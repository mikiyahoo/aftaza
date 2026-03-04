"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/lib/constants";

const buttons = [
  {
    label: "WhatsApp",
    href: SITE.whatsapp,
    color: "#25D366",
    isWhatsApp: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: "Telegram",
    href: SITE.telegram,
    color: "#0088cc",
    isWhatsApp: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    label: "Call Support",
    href: SITE.call,
    color: "#c8a34d",
    isWhatsApp: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.29 6.29l.44-.44a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
];

const WHATSAPP_BUSINESS_NUMBER = "251911281850";

export default function FloatingContactStack() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [userMessage, setUserMessage] = useState("");

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedMessage = `Hello AFTAZA Team,

I would like to inquire about your real estate advisory services.

Phone: ${userPhone || "Not provided"}
Message: ${userMessage || "No additional message"}

Please contact me at your convenience.`;
    const encodedMessage = encodeURIComponent(formattedMessage);
    const waUrl = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodedMessage}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setShowPopup(false);
    setUserPhone("");
    setUserMessage("");
  };

  return (
    <>
      {/* WhatsApp Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-md rounded-2xl overflow-hidden"
              style={{
                background: "rgba(9,17,31,0.97)",
                border: "1px solid rgba(200,163,77,0.25)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(37,211,102,0.08)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 px-6 pt-6 pb-4"
                style={{ borderBottom: "1px solid rgba(200,163,77,0.12)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#25D366" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Chat on WhatsApp</p>
                  <p className="text-[#94a3b8] text-xs font-mono">Aftaza · Typically replies within hours</p>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ color: "#94a3b8" }}
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleWhatsAppSubmit} className="px-6 py-5 flex flex-col gap-4">
                <p className="text-[#94a3b8] text-sm leading-relaxed">
                  Start a conversation with our team. We'll respond on WhatsApp as quickly as possible.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#c8a34d] text-[10px] font-mono tracking-widest uppercase">
                    Your Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+251 9XX XXX XXXX"
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-[#475569] outline-none transition-all focus:ring-1"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(200,163,77,0.2)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(37,211,102,0.5)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,211,102,0.08)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(200,163,77,0.2)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#c8a34d] text-[10px] font-mono tracking-widest uppercase">
                    Message <span className="text-[#475569] normal-case tracking-normal font-sans">(optional)</span>
                  </label>
                  <textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Hello, I'd like to learn more about..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-[#475569] outline-none resize-none transition-all focus:ring-1"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(200,163,77,0.2)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(37,211,102,0.5)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,211,102,0.08)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(200,163,77,0.2)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,0.3)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  Open WhatsApp Chat
                </button>

                <p className="text-center text-[#475569] text-[10px] font-mono">
                  You'll be redirected to WhatsApp
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-[100] items-end">
        {buttons.map((btn, i) => (
          <motion.div
            key={btn.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative flex items-center group"
          >
            {/* Enhanced Tooltip Label */}
            <AnimatePresence>
              {hovered === btn.label && (
                <motion.span
                  initial={{ opacity: 0, x: 10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 5, scale: 0.95 }}
                  className="absolute right-14 px-3 py-1.5 rounded-full bg-brand-dark border border-[#c8a34d]/30 text-white text-[10px] font-mono tracking-widest uppercase shadow-2xl backdrop-blur-md pointer-events-none whitespace-nowrap"
                >
                  {btn.label}
                  {/* Arrow Pointer */}
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-brand-dark border-r border-t border-[#c8a34d]/30 rotate-45" />
                </motion.span>
              )}
            </AnimatePresence>

            {/* Action Button */}
            {btn.isWhatsApp ? (
              <motion.button
                type="button"
                onClick={() => setShowPopup(true)}
                onMouseEnter={() => setHovered(btn.label)}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: hovered === btn.label ? btn.color : "rgba(9, 17, 31, 0.8)",
                  border: `1px solid ${hovered === btn.label ? btn.color : "rgba(200, 163, 77, 0.2)"}`,
                  boxShadow: hovered === btn.label
                    ? `0 0 20px ${btn.color}60`
                    : "0 8px 32px rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(8px)",
                  color: hovered === btn.label ? "#fff" : "#94a3b8",
                }}
                aria-label={btn.label}
              >
                <div className="relative">
                  {btn.icon}
                  {hovered === btn.label && (
                    <motion.div
                      layoutId="dot"
                      className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border border-black/10"
                    />
                  )}
                </div>
              </motion.button>
            ) : (
              <motion.a
                href={btn.href}
                target={btn.href.startsWith("http") ? "_blank" : undefined}
                rel={btn.href.startsWith("http") ? "noopener noreferrer" : undefined}
                onMouseEnter={() => setHovered(btn.label)}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: hovered === btn.label ? btn.color : "rgba(9, 17, 31, 0.8)",
                  border: `1px solid ${hovered === btn.label ? btn.color : "rgba(200, 163, 77, 0.2)"}`,
                  boxShadow: hovered === btn.label
                    ? `0 0 20px ${btn.color}60`
                    : "0 8px 32px rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(8px)",
                  color: hovered === btn.label ? "#fff" : "#94a3b8",
                }}
                aria-label={btn.label}
              >
                <div className="relative">
                  {btn.icon}
                  {hovered === btn.label && (
                    <motion.div
                      layoutId="dot"
                      className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border border-black/10"
                    />
                  )}
                </div>
              </motion.a>
            )}
          </motion.div>
        ))}

        {/* Visual connection to the "System" - Small decorative bar */}
        <div className="w-1 h-8 bg-gradient-to-t from-transparent via-[#c8a34d]/20 to-transparent mr-5.5" />
      </div>
    </>
  );
}
