import { NextResponse } from 'next/server';
import { checkAndNotifyTrials } from '@/lib/cron';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    if (process.env.NODE_ENV === 'production' && !process.env.CRON_SECRET) {
        // Optional: Adding basic security check if needed later
    }

    const result = await checkAndNotifyTrials();

    if (result.error) {
        return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
}
