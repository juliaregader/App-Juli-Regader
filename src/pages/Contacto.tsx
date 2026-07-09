import { Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const ADMIN_EMAIL = "juliaregader@gmail.com";
const ADMIN_PHONE_DISPLAY = "+34 692 03 25 31";
const ADMIN_WHATSAPP_LINK = "https://wa.me/34692032531";

const schema = z.object({
  name: z.string().min(2, "Introduce tu nombre"),
  email: z.string().email("Introduce un email válido"),
  message: z.string().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)"),
});

type FormValues = z.infer<typeof schema>;

export function Contacto() {
  useDocumentTitle("Contacto");
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    const subject = encodeURIComponent(`Contacto JuliusCapital — ${values.name}`);
    const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);
    window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold text-brand-900 sm:text-4xl">Contacto</h1>
        <p className="mt-3 text-content-muted">
          ¿Tienes dudas antes de empezar? Escríbenos o contáctanos directamente.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-md flex-wrap justify-center gap-3">
        <a href={`mailto:${ADMIN_EMAIL}`} className="btn-secondary">
          <Mail className="h-4 w-4" aria-hidden /> Email
        </a>
        <a href={`tel:${ADMIN_PHONE_DISPLAY.replace(/\s/g, "")}`} className="btn-secondary">
          <Phone className="h-4 w-4" aria-hidden /> Llamar
        </a>
        <a href={ADMIN_WHATSAPP_LINK} target="_blank" rel="noreferrer" className="btn-secondary">
          <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
        </a>
      </div>

      <div className="card mx-auto mt-10 max-w-md">
        {sent ? (
          <p className="text-center text-content-muted">
            Se ha abierto tu cliente de correo con el mensaje listo para enviar. Si no ocurre
            nada, escríbenos directamente a {ADMIN_EMAIL}.
          </p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="label" htmlFor="name">
                Nombre
              </label>
              <input id="name" className="input" {...register("name")} />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input id="email" type="email" className="input" {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="message">
                Mensaje
              </label>
              <textarea id="message" rows={4} className="input" {...register("message")} />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
            </div>
            <button type="submit" className="btn-primary w-full">
              Enviar mensaje
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
