import { LegalPage } from "./LegalPage";

export function Privacidad() {
  return (
    <LegalPage title="Política de privacidad">
      <p>
        <strong>Responsable del tratamiento:</strong> Julià Regader,{" "}
        <a href="mailto:juliaregader@gmail.com" className="underline">
          juliaregader@gmail.com
        </a>
        . <em>[Marcador editable: añadir NIF y domicilio antes de publicar.]</em>
      </p>

      <h2 className="text-lg font-semibold text-content">Qué datos tratamos</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Datos identificativos y de contacto: nombre, email, teléfono.</li>
        <li>
          Datos patrimoniales que introduces voluntariamente: ingresos, gastos, activos, pasivos,
          objetivos financieros y tu estrategia de inversión.
        </li>
        <li>Datos de reserva y de pago (importe, estado, identificador de Stripe) cuando contratas un servicio.</li>
      </ul>

      <h2 className="text-lg font-semibold text-content">Con qué base legal y para qué finalidad</h2>
      <p>
        Tratamos tus datos para prestarte el servicio de organización patrimonial que solicitas
        (ejecución de un contrato) y, en el caso de las comunicaciones y el uso de la app, con tu
        consentimiento explícito prestado al registrarte. Los datos patrimoniales nunca se usan
        con fines distintos de mostrártelos a ti mismo y, si eres cliente, a Julià Regader para
        poder acompañarte.
      </p>

      <h2 className="text-lg font-semibold text-content">Con quién se comparten</h2>
      <p>
        Usamos encargados de tratamiento que alojan o procesan datos en nuestro nombre, siempre
        bajo contrato: <strong>Supabase</strong> (base de datos y autenticación),{" "}
        <strong>Stripe</strong> (procesamiento de pagos) y <strong>Resend</strong> (envío de
        emails transaccionales). No vendemos ni cedemos tus datos a terceros con fines
        publicitarios.
      </p>

      <h2 className="text-lg font-semibold text-content">Plazo de conservación</h2>
      <p>
        Conservamos tus datos mientras mantengas tu cuenta activa. Puedes eliminarla en cualquier
        momento (ver más abajo); los datos de facturación de pagos ya realizados se conservan el
        tiempo exigido por la normativa fiscal aplicable.
      </p>

      <h2 className="text-lg font-semibold text-content">Tus derechos (ARCO y RGPD)</h2>
      <p>
        Puedes ejercer en cualquier momento tus derechos de <strong>acceso, rectificación,
        cancelación/supresión, oposición, portabilidad y limitación del tratamiento</strong>:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Acceso y portabilidad:</strong> desde "Mi perfil" puedes exportar toda tu
          información en formato JSON en cualquier momento.
        </li>
        <li>
          <strong>Rectificación:</strong> puedes editar tus datos personales y patrimoniales
          directamente desde "Mi perfil".
        </li>
        <li>
          <strong>Supresión:</strong> desde "Mi perfil" puedes eliminar tu cuenta y todos tus
          datos de forma permanente e irreversible.
        </li>
        <li>
          Para cualquier otra solicitud, o si prefieres que lo gestionemos nosotros, escribe a{" "}
          <a href="mailto:juliaregader@gmail.com" className="underline">
            juliaregader@gmail.com
          </a>
          . También tienes derecho a reclamar ante la Agencia Española de Protección de Datos
          (AEPD).
        </li>
      </ul>

      <h2 className="text-lg font-semibold text-content">Confidencialidad</h2>
      <p>
        Tus datos financieros se tratan con estricta confidencialidad: solo tú y, si eres
        cliente, el administrador de JuliusCapital pueden acceder a ellos, protegidos mediante
        políticas de seguridad a nivel de fila (Row Level Security) en la base de datos.
      </p>
    </LegalPage>
  );
}
