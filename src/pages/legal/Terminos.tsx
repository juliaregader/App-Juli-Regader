import { LegalPage } from "./LegalPage";

export function Terminos() {
  return (
    <LegalPage title="Términos de uso">
      <h2 className="text-lg font-semibold text-content">Objeto</h2>
      <p>
        Estos términos regulan el uso de JuliusCapital, una herramienta de organización y
        educación patrimonial ofrecida por Julià Regader. Al registrarte aceptas estos términos y
        la <a href="/legal/privacidad" className="underline">política de privacidad</a>.
      </p>

      <h2 className="text-lg font-semibold text-content">Naturaleza del servicio</h2>
      <p>
        JuliusCapital no ofrece asesoramiento financiero, fiscal ni de inversión personalizado, ni
        recomienda productos financieros concretos. La estrategia de inversión que registras en la
        aplicación es siempre definida por ti; las decisiones de inversión son tu responsabilidad
        exclusiva.
      </p>

      <h2 className="text-lg font-semibold text-content">Servicios de pago</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Plan de organización patrimonial (329 €):</strong> pago único mediante Stripe
          Checkout. Da acceso a la configuración completa de tu dashboard patrimonial y a una
          sesión inicial con Julià Regader.
        </li>
        <li>
          <strong>Sesión individual (80 €):</strong> reserva de una sesión de 1 hora. La reserva
          no exige pago por adelantado; el pago puede completarse online tras la reserva, en
          persona o por transferencia.
        </li>
      </ul>

      <h2 className="text-lg font-semibold text-content">Cancelaciones y reembolsos</h2>
      <p>
        Puedes cancelar o reprogramar una sesión reservada contactando con{" "}
        <a href="mailto:juliaregader@gmail.com" className="underline">
          juliaregader@gmail.com
        </a>{" "}
        con la mayor antelación posible. Los reembolsos de pagos ya realizados se valoran caso a
        caso escribiendo al mismo email.
      </p>

      <h2 className="text-lg font-semibold text-content">Obligaciones del usuario</h2>
      <p>
        Te comprometes a facilitar información veraz, a mantener la confidencialidad de tus
        credenciales de acceso y a hacer un uso lícito de la plataforma.
      </p>

      <h2 className="text-lg font-semibold text-content">Limitación de responsabilidad</h2>
      <p>
        JuliusCapital se ofrece "tal cual". El titular no es responsable de las decisiones
        financieras o de inversión que el usuario adopte a partir de la información organizada en
        la aplicación, ni de eventuales interrupciones del servicio.
      </p>

      <h2 className="text-lg font-semibold text-content">Ley aplicable</h2>
      <p>Estos términos se rigen por la legislación española.</p>
    </LegalPage>
  );
}
