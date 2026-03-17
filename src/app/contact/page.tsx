"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SERVICE_OPTIONS = [
  { value: "policy-government", label: "Policy & Government Interface" },
  { value: "technical-regulations", label: "Technical Regulations & Product Compliance" },
  { value: "customs-trade", label: "Customs & Trade Optimisation" },
  { value: "dgft-licensing", label: "DGFT & Import-Export Licensing" },
  { value: "gst-taxation", label: "GST, Customs Taxation & Tax Litigation" },
  { value: "general", label: "General Inquiry" },
];

function ContactForm() {
  const searchParams = useSearchParams();
  const preService = searchParams.get("service") || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: preService || "",
    message: "",
    _honey: "", // honeypot
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form._honey) return; // bot detected
    if (submitting) return;

    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          service: form.service,
          message: form.message,
        }),
      });

      const data = await res.json();
      setResult(data.status === "success" ? "success" : "error");
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--navy)] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-white">Contact Us</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            Let&apos;s discuss how we can help your business navigate Indian import compliance.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              {result === "success" ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-green-600 text-2xl">&#10003;</span>
                      </div>
                      <h2 className="text-xl font-semibold text-[var(--navy)] mb-2">
                        Thank you for reaching out!
                      </h2>
                      <p className="text-gray-600">
                        We&apos;ll get back to you within 24 hours. For urgent matters,
                        call us at{" "}
                        <a href="tel:+919810541740" className="text-[var(--gold)] font-medium">
                          +91-9810541740
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={form.company}
                            onChange={(e) => update("company", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="service">Service of Interest</Label>
                        <Select value={form.service} onValueChange={(v) => update("service", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          rows={5}
                          value={form.message}
                          onChange={(e) => update("message", e.target.value)}
                          placeholder="Tell us about your import compliance needs..."
                          required
                        />
                      </div>

                      {/* Honeypot */}
                      <div className="hidden" aria-hidden="true">
                        <input
                          type="text"
                          name="_honey"
                          value={form._honey}
                          onChange={(e) => update("_honey", e.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>

                      {result === "error" && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                          Couldn&apos;t send your message. Please email us directly at{" "}
                          <a href="mailto:help@accessindia.ai" className="underline font-medium">
                            help@accessindia.ai
                          </a>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-[var(--navy)] hover:bg-[var(--deep-blue)]"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Sending...
                          </span>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[var(--gold)] mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold text-[var(--navy)]">Office</p>
                      <p>9th & 12th Floor, Hemkunt House</p>
                      <p>Rajendra Place, New Delhi 110008</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[var(--gold)] mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold text-[var(--navy)]">Phone</p>
                      <p>
                        <a href="tel:+911141413939" className="hover:text-[var(--gold)]">
                          +91-11-41413939
                        </a>
                      </p>
                      <p>
                        <a href="tel:+919810541740" className="hover:text-[var(--gold)]">
                          +91-9810541740
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[var(--gold)] mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold text-[var(--navy)]">Email</p>
                      <p>
                        <a href="mailto:help@accessindia.ai" className="hover:text-[var(--gold)]">
                          help@accessindia.ai
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Google Maps */}
              <Card className="overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.4!2d77.17!3d28.64!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHemkunt+House%2C+Rajendra+Place%2C+New+Delhi!5e0!3m2!1sen!2sin!4v1700000000000"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AccessIndia Office Location"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-96" />
        </div>
      </div>
    }>
      <ContactForm />
    </Suspense>
  );
}
