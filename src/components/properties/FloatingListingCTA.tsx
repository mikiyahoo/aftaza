"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Phone, Send, X } from "lucide-react";
import { SITE } from "@/lib/constants";

const WHATSAPP_NUMBER = SITE.phone.replace(/\D/g, "").replace(/^0/, "251");

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("251")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `251${digits.slice(1)}`;
  }

  if (digits.startsWith("9") && digits.length === 9) {
    return `251${digits}`;
  }

  return digits;
}

export default function FloatingListingCTA() {
  const [phone, setPhone] = useState("");
  const [dismissed, setDismissed] = useState(false);

  const normalizedPhone = useMemo(() => normalizePhone(phone), [phone]);
  const isValidPhone = /^2519\d{8}$/.test(normalizedPhone);

  const whatsappHref = useMemo(() => {
    if (!isValidPhone) {
      return undefined;
    }

    const message = `Hello Aftaza Team,
I want to list my real estate on your website.

My phone number is: ${normalizedPhone}

Thank you!`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [isValidPhone, normalizedPhone]);

  if (dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 rounded-[999px] border border-white/60 bg-white/60 px-4 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-[12px] md:flex-row md:items-center md:gap-4 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-500 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label="Close listing call to action"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#c8a34d]">
              List With Aftaza
            </p>
            <p className="text-sm text-slate-700">
              Capture qualified leads faster with structured listing distribution.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="sr-only" htmlFor="listing-phone">
            Your phone number
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="listing-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+251 9XX XXX XXX"
              className="h-12 w-full rounded-full border border-white/60 bg-white/70 px-5 pl-11 text-sm text-slate-800 outline-none transition focus:border-[#c8a34d] focus:ring-2 focus:ring-[#c8a34d]/20 md:min-w-[240px]"
              aria-invalid={phone.length > 0 && !isValidPhone}
            />
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!isValidPhone}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-xs font-black uppercase tracking-[0.24em] transition ${
              isValidPhone
                ? "bg-[#25D366] text-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:bg-[#1fb95a]"
                : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>

          <a
            href={SITE.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0088cc] px-5 text-xs font-black uppercase tracking-[0.24em] text-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition hover:bg-[#0077b5]"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Telegram
          </a>
        </div>
      </div>

      {phone.length > 0 && !isValidPhone ? (
        <p className="mt-2 text-center text-xs font-medium text-slate-600">
          Enter a valid Ethiopian mobile number to enable WhatsApp.
        </p>
      ) : null}
    </div>
  );
}
