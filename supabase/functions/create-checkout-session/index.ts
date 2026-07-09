import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { corsHeaders } from "../_shared/cors.ts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const APP_URL = Deno.env.get("APP_URL") ?? "http://localhost:5173";

const AMOUNTS_CENTS: Record<string, number> = {
  plan_329: 32900,
  sesion_80: 8000,
};

const PRODUCT_NAMES: Record<string, string> = {
  plan_329: "Plan de organización patrimonial — JuliusCapital",
  sesion_80: "Sesión individual — JuliusCapital",
};

function toFormBody(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { service, userId, email, bookingId } = await req.json();

    if (!service || !AMOUNTS_CENTS[service]) {
      return new Response(JSON.stringify({ error: "Servicio inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amount = AMOUNTS_CENTS[service];

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: toFormBody({
        mode: "payment",
        "payment_method_types[0]": "card",
        success_url: `${APP_URL}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${APP_URL}/pago/cancelado`,
        customer_email: email ?? "",
        "line_items[0][price_data][currency]": "eur",
        "line_items[0][price_data][product_data][name]": PRODUCT_NAMES[service],
        "line_items[0][price_data][unit_amount]": String(amount),
        "line_items[0][quantity]": "1",
        "metadata[service]": service,
        "metadata[user_id]": userId ?? "",
        "metadata[booking_id]": bookingId ?? "",
      }),
    });

    if (!stripeResponse.ok) {
      const body = await stripeResponse.text();
      throw new Error(`Stripe error: ${body}`);
    }

    const session = await stripeResponse.json();

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: userId ?? null,
        stripe_session_id: session.id,
        amount: amount / 100,
        currency: "EUR",
        service,
        status: "pendiente",
      })
      .select()
      .single();
    if (paymentError) throw paymentError;

    if (bookingId) {
      await supabase.from("bookings").update({ payment_id: payment.id }).eq("id", bookingId);
    }

    return new Response(JSON.stringify({ id: session.id, url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-checkout-session error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
