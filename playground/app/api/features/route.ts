import { getApiKey } from '@/app/actions/apikey';
import { fetchFeatures } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const accountId = searchParams.get('accountId') || "";
        const orgId = searchParams.get('orgId') || "";
        const isCustomerId = searchParams.get('isCustomerId');
        const apikey = await getApiKey();

        const features = fetchFeatures(accountId, orgId, isCustomerId === 'true', apikey)
        console.log('Fetched features:', features);
        return NextResponse.json(features);
    } catch (err) {
        console.error('Error fetching features:', err);
        return NextResponse.json(err);
    }
}
