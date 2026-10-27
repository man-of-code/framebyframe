import { useState, type FormEvent, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { ContactAddress } from "@/components/ContactAddress";
import { WorkingHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { SITE } from "@/content/site";
import { contactErrors, contactMailto, type ContactErrors } from "@/lib/form";

const EMPTY = { name: "", email: "", message: "" };

export function Contact(): JSX.Element {
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [pending, setPending] = useState(false);

  function update(key: keyof typeof EMPTY, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = contactErrors(values);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setPending(true);
    const link = document.createElement("a");
    link.href = contactMailto(values, SITE.email);
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    navigate("/thank-you");
  }

  return (
    <article className="page prose-page">
      <WorkingHeader band={false} eyebrow="Contact" title="Get in touch" />
      <p className="page-copy">
        Your note opens in your email app, addressed to us. This site has nowhere to keep messages, so it does not store or send anything itself. You send it from your email app.
      </p>
      <ContactAddress />
      <form className="stack" onSubmit={submit} noValidate>
        <label className="field">
          Name
          <input
            name="name"
            autoComplete="name"
            value={values.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            onChange={(event) => update("name", event.target.value)}
          />
          {errors.name ? <span className="field-error" id="contact-name-error" role="alert">{errors.name}</span> : null}
        </label>
        <label className="field">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            onChange={(event) => update("email", event.target.value)}
          />
          {errors.email ? <span className="field-error" id="contact-email-error" role="alert">{errors.email}</span> : null}
        </label>
        <label className="field">
          Message
          <textarea
            name="message"
            rows={5}
            value={values.message}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            onChange={(event) => update("message", event.target.value)}
          />
          {errors.message ? <span className="field-error" id="contact-message-error" role="alert">{errors.message}</span> : null}
        </label>
        <Button className="self-start" type="submit" disabled={pending} aria-busy={pending}>
          {pending ? "Opening mail…" : "Send"}
        </Button>
      </form>
    </article>
  );
}
