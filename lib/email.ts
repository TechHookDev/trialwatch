import { Resend } from 'resend';

// NOTE: In a real app, this key should be in process.env.RESEND_API_KEY
// For now, we need to instruct the user to set it up.
export async function sendTrialReminderEmail(
    email: string,
    userName: string,
    trialName: string,
    daysLeft: number,
    endDate: string
) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn('RESEND_API_KEY is missing');
        return false;
    }
    const resend = new Resend(apiKey);
    try {
        const { data, error } = await resend.emails.send({
            from: 'Trials Watch <alerts@resend.dev>', // Update this with verified domain later
            to: [email],
            subject: `Action Required: ${trialName} trial ends in ${daysLeft > 0 ? daysLeft + ' days' : 'soon'}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Trial Expiring Soon!</h1>
          <p>Hi ${userName},</p>
          <p>Your free trial for <strong>${trialName}</strong> is ending on <strong>${new Date(endDate).toLocaleDateString()}</strong>.</p>
          <p>Make sure to cancel it to avoid being charged.</p>
          <br/>
          <a href="https://trialswatch.com/dashboard" style="background-color: #00f0ff; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
        </div>
      `,
        });

        if (error) {
            console.error({ error });
            return false;
        }

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
