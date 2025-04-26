import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { INSIGHTS_FEATURE } from '../utils/features';
import { useTailrixSDK } from 'tailrix/client/tailrixprovider';

export default function HighlightedCard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const sdk = useTailrixSDK();
  const [hasInsightFeature, setHasInsightFeature] = React.useState(false)

  React.useEffect(() => {
    sdk.getFeature(INSIGHTS_FEATURE).
      then(([val]) => setHasInsightFeature(val === 'true'))
      .catch((err) => console.error('Error fetching feature:', err));
  }, [sdk]);


  return (
    <Card sx={{ height: '100%' }} variant="outlined">
      <CardContent>
        <InsightsRoundedIcon />
        <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: '600' }}>
          Explore your data
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: '8px' }}>
          Uncover performance and visitor insights with our data wizardry.
        </Typography>
        <Button
          variant="contained"
          size="small"
          color="primary"
          endIcon={<ChevronRightRoundedIcon />}
          fullWidth={isSmallScreen}
          disabled={!hasInsightFeature}
        >
          Get insights
        </Button>
      </CardContent>
    </Card>
  );
}
