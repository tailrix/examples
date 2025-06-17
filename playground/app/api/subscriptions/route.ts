import { getApiKey } from '@/app/actions/apikey';
import { listSubcriptions } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const isCustomerId = searchParams.get('isCustomerId') === 'true';
        const accountId = searchParams.get('accountId') || "";
        const orgId = searchParams.get('orgId') || "";

        const apikey = await getApiKey();
        const subscriptions = await listSubcriptions(accountId, orgId, isCustomerId, apikey);
        return NextResponse.json(subscriptions);
    } catch (err) {
        console.error('Error fetching subscriptions:', err);
        return NextResponse.json(err);
    }
}
