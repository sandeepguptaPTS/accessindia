"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, ArrowRight, Loader2 } from "lucide-react";
import { COUNTRIES } from "@/lib/constants";

type ChatStep = "welcome" | "product" | "country" | "value" | "loading" | "result" | "lead" | "error";

interface ChatState {
  step: ChatStep;
  product: string;
  country: string;
  value: string;
  result: {
    riskLevel?: string;
    totalDuty?: string;
    effectiveRate?: string;
    agencies?: string[];
    reportId?: string;
    hsCode?: string;
  } | null;
}

const SESSION_KEY = "accessindia-chat-state";

function loadState(): ChatState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return getDefaultState();
}

function getDefaultState(): ChatState {
  return { step: "welcome", product: "", country: "", value: "", result: null };
}

function saveState(state: ChatState) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {}
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ChatState>(getDefaultState);
  const [submitting, setSubmitting] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSent, setLeadSent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (!open) return;
    if (state.step === "product") textareaRef.current?.focus();
    else if (state.step === "value") numberInputRef.current?.focus();
    else if (state.step === "lead") emailInputRef.current?.focus();
  }, [open, state.step]);

  const update = (partial: Partial<ChatState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  };

  const handleSubmitReport = async () => {
    if (submitting) return;
    setSubmitting(true);
    update({ step: "loading" });

    try {
      const res = await fetch("/api/import-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productDescription: state.product,
          originCountry: state.country,
          assessableValueUSD: parseFloat(state.value),
        }),
      });

      if (!res.ok) {
        update({ step: "error" });
        return;
      }

      const data = await res.json();

      if (data.status === "complete" && data.report) {
        const report = data.report;
        update({
          step: "result",
          result: {
            riskLevel: report.riskSummary?.substring(0, 100) || "Report generated",
            totalDuty: report.dutyBreakdown
              ? `INR ${report.dutyBreakdown.totalDuty.toLocaleString("en-IN")}`
              : "N/A",
            effectiveRate: report.dutyBreakdown
              ? `${report.dutyBreakdown.effectiveDutyRate}%`
              : "N/A",
            agencies: report.certifications?.map((c: { body: string }) => c.body) || [],
            reportId: report.id,
            hsCode: report.hsCode,
          },
        });
      } else if (data.status === "needs_classification") {
        // For low-confidence results, redirect to full search
        update({
          step: "result",
          result: {
            riskLevel: "Multiple HS codes possible — use full search for classification",
            totalDuty: "Requires classification",
            effectiveRate: "—",
            agencies: [],
            reportId: undefined,
            hsCode: undefined,
          },
        });
      } else {
        update({ step: "error" });
      }
    } catch {
      update({ step: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    const fresh = getDefaultState();
    setState(fresh);
    setLeadSent(false);
    setLeadEmail("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      {/* Chat panel */}
      {open && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-[360px] max-h-[520px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[var(--navy)] text-white px-4 py-3">
            <p className="text-sm font-semibold">AccessIndia.ai</p>
            <p className="text-xs text-white/60">Import compliance assistant</p>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Welcome */}
            {state.step === "welcome" && (
              <>
                <BotMessage>
                  Hi! I can help you check import compliance for any product entering India. Ready to start?
                </BotMessage>
                <div className="flex gap-2">
                  <button
                    onClick={() => update({ step: "product" })}
                    className="px-3 py-1.5 bg-[var(--navy)] text-white text-sm rounded-lg hover:bg-[var(--deep-blue)] transition-colors"
                  >
                    Check a product
                  </button>
                  <button
                    onClick={() => update({ step: "lead" })}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Ask a question
                  </button>
                </div>
              </>
            )}

            {/* Step 1: Product */}
            {state.step === "product" && (
              <>
                <BotMessage>What product are you importing?</BotMessage>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (state.product.trim()) update({ step: "country" });
                  }}
                  className="flex gap-2"
                >
                  <textarea
                    ref={textareaRef}
                    value={state.product}
                    onChange={(e) => update({ product: e.target.value })}
                    placeholder="e.g., Lithium-ion batteries for EVs"
                    className="flex-1 text-sm border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                    rows={2}
                  />
                  <button
                    type="submit"
                    disabled={!state.product.trim()}
                    className="self-end p-2 bg-[var(--navy)] text-white rounded-lg hover:bg-[var(--deep-blue)] disabled:opacity-40 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

            {/* Step 2: Country */}
            {state.step === "country" && (
              <>
                <BotMessage>
                  <span className="text-gray-500 text-xs block mb-1">Product: {state.product}</span>
                  Where is it shipping from?
                </BotMessage>
                <select
                  value={state.country}
                  onChange={(e) => {
                    update({ country: e.target.value, step: "value" });
                  }}
                  className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </>
            )}

            {/* Step 3: Value */}
            {state.step === "value" && (
              <>
                <BotMessage>
                  <span className="text-gray-500 text-xs block mb-1">
                    {state.product} from {state.country}
                  </span>
                  Approximate shipment value in USD?
                </BotMessage>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (state.value && parseFloat(state.value) > 0) handleSubmitReport();
                  }}
                  className="flex gap-2"
                >
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      ref={numberInputRef}
                      type="number"
                      min="1"
                      step="0.01"
                      value={state.value}
                      onChange={(e) => update({ value: e.target.value })}
                      placeholder="10,000"
                      className="w-full text-sm border rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!state.value || parseFloat(state.value) <= 0}
                    className="p-2 bg-[var(--navy)] text-white rounded-lg hover:bg-[var(--deep-blue)] disabled:opacity-40 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

            {/* Loading */}
            {state.step === "loading" && (
              <div className="flex flex-col items-center py-6 gap-3">
                <Loader2 className="w-8 h-8 text-[var(--navy)] animate-spin" />
                <p className="text-sm text-gray-500">Running 264 regulatory checks...</p>
              </div>
            )}

            {/* Result */}
            {state.step === "result" && state.result && (
              <>
                <div className="bg-[var(--light-bg)] rounded-lg p-3 space-y-2">
                  {state.result.hsCode && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">HS Code</span>
                      <span className="font-mono font-semibold">{state.result.hsCode}</span>
                    </div>
                  )}
                  {state.result.totalDuty && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Estimated Total Duty</span>
                      <span className="font-semibold text-[var(--navy)]">{state.result.totalDuty}</span>
                    </div>
                  )}
                  {state.result.effectiveRate && state.result.effectiveRate !== "—" && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Effective Rate</span>
                      <span className="font-semibold">{state.result.effectiveRate}</span>
                    </div>
                  )}
                  {state.result.agencies && state.result.agencies.length > 0 && (
                    <div className="text-xs">
                      <span className="text-gray-500">Key Agencies: </span>
                      <span className="font-medium">{[...new Set(state.result.agencies)].join(", ")}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {state.result.reportId ? (
                    <a
                      href={`/report/${state.result.reportId}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--navy)] text-white text-sm rounded-lg hover:bg-[var(--deep-blue)] transition-colors"
                    >
                      Full Report <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <a
                      href={`/search?q=${encodeURIComponent(state.product)}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--navy)] text-white text-sm rounded-lg hover:bg-[var(--deep-blue)] transition-colors"
                    >
                      Full Search <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <a
                    href="/contact"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-[var(--navy)] text-[var(--navy)] text-sm rounded-lg hover:bg-[var(--light-bg)] transition-colors"
                  >
                    Talk to Expert
                  </a>
                </div>

                <button
                  onClick={reset}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors"
                >
                  Check another product
                </button>
              </>
            )}

            {/* Lead capture */}
            {state.step === "lead" && (
              <>
                <BotMessage>
                  Have a question? Leave your email and we&apos;ll get back to you.
                </BotMessage>
                {leadSent ? (
                  <div className="bg-green-50 text-green-700 text-sm rounded-lg p-3">
                    Thanks! We&apos;ll be in touch soon.
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (leadEmail) setLeadSent(true);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      ref={emailInputRef}
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="flex-1 text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                      required
                    />
                    <button
                      type="submit"
                      disabled={!leadEmail}
                      className="p-2 bg-[var(--gold)] text-[var(--navy)] rounded-lg hover:bg-[var(--gold-hover)] disabled:opacity-40 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
                <button
                  onClick={() => update({ step: "welcome" })}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Back
                </button>
              </>
            )}

            {/* Error */}
            {state.step === "error" && (
              <>
                <BotMessage>
                  Having trouble connecting. Try the full search or email us directly.
                </BotMessage>
                <div className="flex gap-2">
                  <a
                    href={`/search?q=${encodeURIComponent(state.product)}`}
                    className="flex-1 text-center px-3 py-2 bg-[var(--navy)] text-white text-sm rounded-lg hover:bg-[var(--deep-blue)] transition-colors"
                  >
                    Try Full Search
                  </a>
                  <a
                    href="mailto:help@accessindia.ai"
                    className="flex-1 text-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Email Us
                  </a>
                </div>
                <button
                  onClick={reset}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors"
                >
                  Start over
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-[var(--gold)] text-[var(--navy)] rounded-full shadow-lg hover:bg-[var(--gold-hover)] transition-all flex items-center justify-center hover:scale-105 cursor-pointer"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}

function BotMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--light-bg)] rounded-lg rounded-bl-none px-3 py-2 text-sm text-gray-700">
      {children}
    </div>
  );
}
