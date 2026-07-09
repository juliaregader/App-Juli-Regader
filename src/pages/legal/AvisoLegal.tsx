import { LegalPage } from "./LegalPage";

export function AvisoLegal() {
  return (
    <LegalPage title="Aviso legal">
      <p>
        <strong>Titular:</strong> Julià Regader (persona física / autónomo). <em>[Marcador
        editable: sustituir por NIF, domicilio fiscal y datos de contacto completos antes de la
        publicación definitiva.]</em> Email de contacto:{" "}
        <a href="mailto:juliaregader@gmail.com" className="underline">
          juliaregader@gmail.com
        </a>
        .
      </p>

      <h2 className="text-lg font-semibold text-content">Naturaleza del servicio</h2>
      <p>
        Julià Regader no está registrado como empresa de servicios de inversión, asesor
        financiero ni gestor de patrimonios ante la CNMV ni ningún otro organismo regulador.
        JuliusCapital es una herramienta de organización y educación patrimonial de uso personal:
        no ofrece asesoramiento de inversión en el sentido de la normativa MiFID II, ni
        recomendaciones personalizadas de compra o venta de productos financieros concretos. Toda
        la información, plantillas y cálculos de la aplicación tienen una finalidad educativa e
        informativa; las decisiones financieras y de inversión son responsabilidad exclusiva del
        usuario.
      </p>

      <h2 className="text-lg font-semibold text-content">Condiciones de acceso y uso</h2>
      <p>
        El acceso a la web pública es libre y gratuito. El acceso al área privada requiere
        registro y está sujeto a los <a href="/legal/terminos" className="underline">Términos de
        uso</a>. El usuario se compromete a hacer un uso lícito de la plataforma y a facilitar
        datos veraces.
      </p>

      <h2 className="text-lg font-semibold text-content">Propiedad intelectual</h2>
      <p>
        El nombre "JuliusCapital", el logotipo, los textos, el diseño y el código de la
        aplicación son propiedad de su titular o se usan bajo licencia, y no pueden reproducirse
        ni distribuirse sin autorización.
      </p>

      <h2 className="text-lg font-semibold text-content">Limitación de responsabilidad</h2>
      <p>
        El titular no garantiza la disponibilidad continua del servicio ni se hace responsable de
        las decisiones financieras que el usuario adopte a partir de la información organizada en
        la aplicación.
      </p>
    </LegalPage>
  );
}
