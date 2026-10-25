export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function startDateError(value: string): string | null {
  const match = DATE.exec(value);
  if (!match) return "Choose a start date.";
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return "That date is not valid.";
  }
  return null;
}

export function contactErrors(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  if (input.name.trim() === "") errors.name = "Enter your name.";
  if (!EMAIL.test(input.email.trim())) errors.email = "Enter a valid email address.";
  if (input.message.trim() === "") errors.message = "Enter a message.";
  return errors;
}

export function contactMailto(input: ContactInput, to: string): string {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const subject = encodeURIComponent(`Frame by Frame — ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
