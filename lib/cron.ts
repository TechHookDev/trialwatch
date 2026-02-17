import { createClient } from '@supabase/supabase-js';
import { sendTrialReminderEmail } from '@/lib/email';

export async function checkAndNotifyTrials() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase credentials missing during execution');
        return { error: 'Configuration missing' };
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    });

    try {
        const now = new Date();
        const { data: trials, error } = await supabaseAdmin
            .from('trials')
            .select('*, users:user_id(email)')
            .eq('status', 'active');

        if (error) {
            console.error('Database error:', error);
            throw error;
        }

        let emailsSent = 0;

        for (const trial of trials || []) {
            if (!trial.end_date) continue;

            const endDate = new Date(trial.end_date);
            const diffTime = endDate.getTime() - now.getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (daysLeft === 3 || daysLeft === 1) {
                // @ts-ignore
                const userEmail = trial.users?.email;
                if (userEmail) {
                    await sendTrialReminderEmail(
                        userEmail,
                        'User',
                        trial.name,
                        daysLeft,
                        trial.end_date
                    );
                    emailsSent++;
                }
            }
        }

        return { success: true, emailsSent };
    } catch (error) {
        console.error('Check trials error:', error);
        return { error: 'Internal Error' };
    }
}
