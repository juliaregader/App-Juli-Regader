import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { corsHeaders } from "../_shared/cors.ts";
import { notifyAdmin } from "../_shared/notifyAdmin.ts";
import { sendEmail } from "../_shared/resend.ts";

const serviceLabels: Record<string, string> = {
  plan_329: "Plan de organización patrimonial (329 €)",
  sesion_80: "Sesión individual (80 €)",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { bookingId } = await req.json();
    if (!bookingId) {
      return new Response(JSON.stringify({ error: "bookingId requerido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: booking, error } = await supabase.from("bookings").select("*").eq("id", bookingId).single();
    if (error || !booking) {
      throw error ?? new Error("Reserva no encontrada");
    }

    const dateLabel = new Date(booking.start_at).toLocaleString("es-ES", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Europe/Madrid",
    });
    const serviceLabel = serviceLabels[booking.service] ?? booking.service;

    await notifyAdmin({
      subject: `Nueva reserva: ${booking.name} — ${serviceLabel}`,
      html: `
        <h2>Nueva reserva en JuliusCapital</h2>
        <p><strong>Servicio:</strong> ${serviceLabel}</p>
        <p><strong>Fecha:</strong> ${dateLabel}</p>
        <p><strong>Cliente:</strong> ${booking.name} (${booking.email}${booking.phone ? `, ${booking.phone}` : ""})</p>
      `,
    });

    await sendEmail({
      to: booking.email,
      subject: "Confirmación de tu reserva en JuliusCapital",
      html: `
        <h2>Reserva confirmada</h2>
        <p>Hola ${booking.name},</p>
        <p>Tu sesión (${serviceLabel}) queda reservada para el <strong>${dateLabel}</strong>.</p>
        <p>Si necesitas cambiar o cancelar la reserva, responde a este email.</p>
        <p>— JuliusCapital</p>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-booking error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
