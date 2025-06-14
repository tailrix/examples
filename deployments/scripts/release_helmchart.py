""" Helm releasing script"""
import argparse
from collections import namedtuple
from datetime import datetime, timezone
import os
import shutil
import time
from typing import Dict, List
from distutils.version import StrictVersion
import subprocess
import hashlib
import shlex
import yaml
import requests
import git

LOCK_FILE = '.lock'
GO_ICON = 'https://raw.githubusercontent.com/jenkins-x/jenkins-x-platform/d273e09/images/go.png'

Config = namedtuple(
    'Config', ['helm_charts_dir', 'chart_urlbase', 'chart_binary_dir', 'build_all'])


def get_all_releases() -> Dict[str, List[str]]:
    """ Get all releases so far

    Returns:
         Dict[str, List[str]]: name, version pairs of all releases
         and all their releases, unsorted
    """
    all_releases = filter(lambda x: len(x) == 2,
                          map(lambda x: x.split('refs/tags/')[1].rsplit('-', 1),
                              git.cmd.Git().ls_remote('--tags',
                                                      '--refs',
                                                      'origin').split('\n')))

    releases_dict = {}
    for release in all_releases:
        if not StrictVersion.version_re.match(release[1]):
            continue

        if release[0] not in releases_dict:
            releases_dict[release[0]] = [release[1]]
            continue

        releases_dict[release[0]].append(release[1])

    return releases_dict


def get_latest_releases() -> Dict[str, str]:
    """ Get all the latest releases

    Args:
        repo_url: The url of the github repository

    Returns:
        Dict[str, str]: name, version pairs of the latest releases
    """
    last_release = {}
    for key, value in get_all_releases().items():
        last_release[key] = max(value, key=StrictVersion)

    return last_release


def get_chart_spec(chart_dir: str) -> Dict:
    """ Get the chart specification
        Load Chart.yaml under the chart_dir

    Args:
        chart_dir (str): the dir which contains Chart.yaml

    Returns:
        dict:  Dict[str, str] with "chart, version" pair
    """
    chart_file = os.path.join(chart_dir, 'helm-charts', 'Chart.yaml')
    with open(chart_file, 'r') as chart_yaml_file:
        return yaml.load(chart_yaml_file,
                         Loader=yaml.FullLoader)


def is_it_library(chart_dir: str) -> bool:
    """ Test if a chart is a library chart

    Args:
        chart_dir (str): dir which contains the chart 

    Returns:
        bool:  True if it's library chart
    """
    chart_yaml_spec = get_chart_spec(chart_dir)
    return ('type' in chart_yaml_spec and
            chart_yaml_spec['type'] == 'library')


def get_all_charts(config: Config) -> Dict[str, str]:
    """ Get all the charts under helm-charts

    Args:
        config (Config): the key 'helm-charts' indicates
        the dir which contains all the charts

    Returns:
        Dict[str, str]: with "chart, version" pair
    """
    return {os.path.basename(chart_dir).strip(): get_chart_spec(chart_dir)['version']
            for chart_dir in filter(
                lambda x: os.path.isdir(os.path.join(x, 'helm-charts')) and
                not is_it_library(x),
                [f.path for f in os.scandir(config.helm_charts_dir) if f.is_dir()])}


def update_version_number(chart_dir: str, version: str, index_yaml: Dict, not_skip: bool) -> bool:
    """ Update the version number of a chart.

        If [version] is in  index_yaml already, then the chart is considered released already

    Args:
        chart_dir (str): the dir that contains the chart
        version (str): the new version
        index_yaml (Dict): the index yaml which contains all the released version
        not_skip (bool): whether to skip the released chart
    """
    if (not not_skip and
            chart_dir in index_yaml['entries'] and
            index_yaml['entries'][chart_dir]['version'] == version):
        return False

    chart_yaml_spec = get_chart_spec(chart_dir)
    chart_yaml_spec['version'] = version
    chart_file = os.path.join(chart_dir, 'helm-charts', 'Chart.yaml')
    with open(chart_file, 'w') as chart_yaml_file:
        yaml.dump(chart_yaml_spec, chart_yaml_file,
                  default_flow_style=False)

    return True


def build_the_charts(config: Config, charts: Dict[str, str], index_yml: Dict) -> Dict[str, str]:
    """ build the charts

    Args:
        config (Config): config data
        charts (Dict[str, str]): charts to build (which is pair of [chart, version])
        index_yaml (Dict): the index yaml which contains all the released version

    Raises:
        Exception: If the helm returns an error
    """
    result = {}
    for chart, version in charts.items():
        if not update_version_number(chart, version, index_yml, config.build_all):
            print(f'skipping {chart}, {version}, which exists already')
            continue

        print(f'Building {chart}, {version}')
        chart_package = get_chart_package(chart, version)
        ret = subprocess.run(
            f'cd {chart}&&helm package -u helm-charts/'
            f'&&mv {chart_package} ../{config.chart_binary_dir}/',
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True, shell=True)
        print(ret.returncode, ret.stdout, ret.stderr)

        if ret.returncode != 0:
            raise Exception('can not package helm chart,'
                            'helm package helm-charts/'
                            f'returns {ret.returncode}')

        result[chart] = version

    return result


def sha256_of(filename: str) -> str:
    """ calculate sha256 of a file

    Args:
        filename (str): path of file to calculate 

    Returns:
        str: the sha256 of the file
    """
    sha256_hash = hashlib.sha256()
    with open(filename, "rb") as file_to_read:
        for byte_block in iter(lambda: file_to_read.read(4096), b""):
            sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()


def get_chart_package(chart: str, version: str) -> str:
    """ get the file name of the chart package

    Args:
        chart (str): name of the chart.
        version (str): version of the chart.

    Returns:
        str:  name of the chart package
    """
    return f'{chart}-{version}.tgz'


def existed_index_file(config: Config) -> Dict:
    """ get the existed index file from config.chart_urlbase

    Args:
        config (Config): config data 

    Returns:
        Dict: the data of the index yaml, None if the yaml doesn't
        exist.
    """
    # download the yaml index file
    response = requests.get(os.path.join(
        config.chart_urlbase, 'index.yaml'), timeout=10)
    if response is None or response.status_code != 200:
        print(f'Can not get the index yaml file {config.chart_urlbase}')
        return None

    return yaml.safe_load(response.text)

def build_index_file(config: Config):
    os.system(f'helm repo index {config.chart_binary_dir}')

def parse_args():
    """ parse the arguments

    Returns:
        args: the parsed arguments
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('helm_charts_dir',
                        help='directory contains all the charts')
    parser.add_argument(
        'chart_urlbase', help='chart urlbase, e.g. https://fredrikluo.github.io/boilerplate')
    parser.add_argument('-a', '--build-all', action='store_true')
    args = parser.parse_args()
    return args


def log_charts(prefix: str, charts: Dict[str, str]):
    """ utility function to log the content of charts

    Args:
        prefix (str): the prefix of log statement
        charts (Dict[str, str]): list of charts to log
    """
    print(f'{prefix}:')
    print('\n'.join([f'  {k}:{v}' for k, v in charts.items()]))


def lock_and_clean(config: Config) -> bool:
    """ Lock and clean config.chart_binary_dir

    Args:
        config (Config): data 

    Returns:
        bool: whether we can lock the config.chart_binary_dir
    """
    lockfilename = os.path.join(config.chart_binary_dir, LOCK_FILE)
    if (os.path.isfile(lockfilename) and
            time.time() - os.path.getmtime(lockfilename) < 120):
        print('The lock file exists')
        return False

    if os.path.isdir(config.chart_binary_dir):
        shutil.rmtree(config.chart_binary_dir)

    os.mkdir(config.chart_binary_dir)

    # write our pid to the file
    with open(lockfilename, 'w') as lock_file_towrite:
        lock_file_towrite.write(f'{os.getpid()}')

    return True


def unlock(config: Config):
    """ unlock the file from config.chart_binary_dir

    Args:
        config (Config): config data
    """
    # check if we own the file:
    lockfilename = os.path.join(config.chart_binary_dir, LOCK_FILE)
    with open(lockfilename, 'r') as local_file_read:
        pid = local_file_read.readline().strip()
        if os.getpid() != int(pid):
            print('we do not own the lock file,'
                  f' another process is running {pid} {os.getpid()}')
            return

    # delete the file
    os.remove(lockfilename)


def build_charts(config: Config,
                 all_charts: Dict[str, str],
                 latest_releases: Dict[str, str],
                 index_yaml: Dict):
    """ Build all the charts

    Args:
        config (Config): Config data 
        all_charts (Dict[str, str]): all charts to build
        latest_releases (Dict[str, str]): charts that releasd lately
        index_yaml (Dict): index yaml file
    """
    if not lock_and_clean(config):
        print('can not lock the file, another process is running')
        return

    try:
        # see if we need to build everything
        log_charts('Found charts', all_charts)
        log_charts('Charts with last releases', latest_releases)

        # build the chart
        build_the_charts(config, latest_releases, index_yaml)

    finally:
        unlock(config)


if __name__ == '__main__':
    ARGS = parse_args()
    CFG = Config(ARGS.helm_charts_dir,
                 ARGS.chart_urlbase,
                 '.build',
                 ARGS.build_all)

    build_charts(CFG,
                 get_all_charts(CFG),
                 get_latest_releases(),
                 existed_index_file(CFG))
