import { getApiKey } from '@/app/actions/apikey';
import { fetchOrganization } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const orgId = searchParams.get('orgId') || "";
        const isCustomerId = searchParams.get('isCustomerId');
        const apikey = await getApiKey();

        console.log("Fetching organization with params:", {
            orgId,
            isCustomerId,
            apikey
        });

        const org = await fetchOrganization(orgId, isCustomerId === 'true', apikey);
        console.log("Fetched organization:", org);
        return NextResponse.json(org);
    } catch (err) {
        console.error('Error fetching org:', err);
        return NextResponse.json(err);
    }
}
