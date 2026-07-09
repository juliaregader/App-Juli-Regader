import { LegalPage } from "./LegalPage";

export function Privacidad() {
  return (
    <LegalPage title="Política de privacidad">
      <p>
        Tratamos tus datos (identificativos, de contacto y la información patrimonial que
        introduces voluntariamente) para prestarte el servicio de organización patrimonial que
        solicitas, con base legal en la ejecución de un contrato y tu consentimiento explícito.
      </p>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición (ARCO), así
        como exportar o eliminar tu cuenta y tus datos, escribiendo a{" "}
        <a href="mailto:juliaregader@gmail.com" className="underline">
          juliaregader@gmail.com
        </a>
        .
      </p>
      <p>
        Contenido pendiente de completar en la Fase 11 con el detalle de responsable del
        tratamiento, plazos de conservación, encargados de tratamiento (Supabase, Stripe, Resend)
        y procedimiento de exportación/eliminación desde la propia app.
      </p>
    </LegalPage>
  );
}
