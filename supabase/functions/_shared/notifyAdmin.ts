import { sendEmail } from "./resend.ts";

const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "juliaregader@gmail.com";

interface NotifyAdminInput {
  subject: string;
  html: string;
}

/**
 * Punto único de notificación al administrador. Hoy solo envía email.
 * Ampliación futura (WhatsApp vía Twilio, ver .env.example ADMIN_PHONE /
 * TWILIO_*): añadir aquí una rama que también envíe el mensaje por
 * WhatsApp cuando esas variables estén configuradas, sin tocar las Edge
 * Functions que llaman a notifyAdmin().
 */
export async function notifyAdmin({ subject, html }: NotifyAdminInput): Promise<void> {
  await sendEmail({ to: ADMIN_EMAIL, subject, html });

  // const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  // if (twilioSid) { /* enviar también por WhatsApp a ADMIN_PHONE */ }
}
