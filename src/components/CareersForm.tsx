"use client";

import { useState } from "react";
import { getHutk } from "@/lib/hutk";

export default function CareersForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (status === "sent") {
    return (
      <div className="rounded-md border border-line bg-paper p-8 text-center">
        <p className="text-lg font-semibold text-ink">Thanks, we got your note.</p>
        <p className="mt-2 text-muted">We read every application and will follow up if there&rsquo;s a fit.</p>
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
        const res = await fetch("/api/careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.get("name"),
            email: data.get("email"),
            linkedin: data.get("linkedin"),
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
            className="w-full rounded-md border border-line px-3 py-2 focus:border-accent focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className="w-full rounded-md border border-line px-3 py-2 focus:border-accent focus:outline-none"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">
          LinkedIn profile <span className="font-normal text-muted">(optional)</span>
        </span>
        <input
          type="url"
          name="linkedin"
          autoComplete="url"
          placeholder="https://www.linkedin.com/in/…"
          className="w-full rounded-md border border-line px-3 py-2 focus:border-accent focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ink">
          Tell us about your background
        </span>
        <textarea
          name="message"
          rows={5}
          required
          className="w-full rounded-md border border-line px-3 py-2 focus:border-accent focus:outline-none"
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
        {status === "sending" ? "Sending…" : "Submit application"}
      </button>
    </form>
  );
}
