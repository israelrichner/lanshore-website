"use client";

import { useState } from "react";
import { getHutk } from "@/lib/hutk";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (status === "sent") {
    return (
      <div className="rounded-md border border-line bg-paper p-8 text-center">
        <p className="text-lg font-semibold text-ink">Thanks, we got it.</p>
        <p className="mt-2 text-muted">We respond within one business day.</p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("sending");
        const form = e.currentTarget;
        const data = new FormData(form);
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.get("name"),
            email: data.get("email"),
            company: data.get("company"),
            message: data.get("message"),
            hutk: getHutk(),
            pageUri: window.location.href,
            pageName: document.title,
          }),
        }).catch(() => null);
        setStatus(res?.ok ? "sent" : "error");
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Work email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">Company</span>
        <input
          type="text"
          name="company"
          autoComplete="organization"
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">
          What does your comp stack look like today?
        </span>
        <textarea
          name="message"
          rows={4}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>
      {status === "error" && (
        <p className="text-sm font-medium text-red-700">
          Something went wrong sending your message. Email us directly at{" "}
          <a href="mailto:sales@lanshore.com" className="underline">
            sales@lanshore.com
          </a>
          .
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md bg-gold px-6 py-3 font-semibold text-ink-deep hover:bg-gold-hover disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Request an assessment"}
      </button>
    </form>
  );
}
