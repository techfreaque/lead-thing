'use server';

import SendSupportMail from '@/app/_server/mail/sendSupportMail';

export interface SupportRequest {
    name: string | null;
    company: string | null;
    country: string | null;
    website: string | null;
    email: string;
    subject: string;
    message: string;
}

export async function sendSupportRequest({
    name,
    company,
    subject,
    country,
    website,
    email,
    message,
}: SupportRequest): Promise<boolean> {
    const transporter = await SendSupportMail(
        name,
        company,
        subject,
        country,
        website,
        email,
        message
    );
    console.log(transporter);
    if (
        transporter.customerMessageTransporter.accepted &&
        transporter.supportMessageTransporter?.accepted
    ) {
        return true;
    }
    return false;
}
