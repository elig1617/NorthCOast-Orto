"use client";

import { useState } from "react";
import { ConfirmMark } from "@/components/ConfirmMark";
import { confirm, contact } from "@/lib/site";

type FormKind = "contact" | "referral" | "quote";

const audiences = [
  "Patient",
  "Physician / referral source",
  "Hospital or facility",
  "Government / VA / DoD buyer",
  "Manufacturer or vendor",
  "Other",
];

const needs = [
  "Product availability or quote",
  "New patient referral / prescription",
  "Existing order question",
  "Insurance or coverage question",
  "Billing / invoice",
  "Institutional or contract purchasing",
  "Something else",
];

export function InquiryForm({ kind = "contact" }: { kind?: FormKind }) {
  const [submitted, setSubmitted] = useState(false);

  const title =
    kind === "referral"
      ? "Refer a patient or send a prescription"
      : kind === "quote"
        ? "Request a product quote"
        : "Contact the office";

  if (submitted) {
    return (
      <div className="border border-line bg-white px-5 py-6">
        <p className="eyebrow">Message prepared</p>
        <h2 className="mt-2 font-serif text-2xl">Thank you.</h2>
        <p className="mt-3 max-w-prose text-ink-soft">
          This form is ready for a live email or intake endpoint. Until that is
          connected, please call{" "}
          <a href={contact.phoneHref}>{contact.phone}</a> or email{" "}
          <ConfirmMark>{confirm.email}</ConfirmMark>. Do not send medical
          records through this page.
        </p>
      </div>
    );
  }

  return (
    <form
      className="border border-line bg-white px-5 py-6"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <p className="eyebrow">Office intake</p>
      <h2 className="mt-2 font-serif text-2xl">{title}</h2>
      <p className="mt-2 max-w-prose text-sm text-slate">
        Do not include diagnoses, medical record numbers, Social Security
        numbers, or other protected health information. Call the office for
        clinical or order-specific details.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="First name" name="firstName" required />
        <Field label="Last name" name="lastName" required />
        <Field label="Organization" name="organization" />
        <Field label="Role / audience" name="audience" as="select" options={audiences} />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" required />
        <Field
          label="How can we help?"
          name="need"
          as="select"
          options={needs}
          className="md:col-span-2"
        />
        <label className="md:col-span-2 text-sm">
          <span className="mb-1 block font-medium">Message</span>
          <textarea
            name="message"
            rows={5}
            required
            className="w-full border border-line bg-paper px-3 py-2 text-ink"
          />
        </label>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="border border-red bg-red px-4 py-2.5 text-sm font-medium text-white hover:bg-red-deep"
        >
          Send to the office
        </button>
        <p className="text-xs text-slate">
          Submissions will route to <ConfirmMark>{confirm.email}</ConfirmMark>{" "}
          once confirmed.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  as,
  options,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  as?: "select";
  options?: string[];
  className?: string;
}) {
  return (
    <label className={`text-sm ${className}`}>
      <span className="mb-1 block font-medium">
        {label}
        {required ? <span className="text-red"> *</span> : null}
      </span>
      {as === "select" ? (
        <select
          name={name}
          required={required}
          defaultValue=""
          className="w-full border border-line bg-paper px-3 py-2 text-ink"
        >
          <option value="" disabled>
            Select
          </option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="w-full border border-line bg-paper px-3 py-2 text-ink"
        />
      )}
    </label>
  );
}
