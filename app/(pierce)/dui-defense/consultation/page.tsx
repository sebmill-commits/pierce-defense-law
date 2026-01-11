"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

type FormStep = "form" | "submitting" | "success";

interface FormData {
  // Contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Arrest info
  arrestDate: string;
  arrestLocation: string;
  // DUI specifics
  bacLevel: string;
  refusal: string;
  priorDuis: string;
  licenseStatus: string;
  // Court
  courtName: string;
  // Notes
  notes: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  arrestDate: "",
  arrestLocation: "",
  bacLevel: "",
  refusal: "Unknown",
  priorDuis: "0",
  licenseStatus: "Valid",
  courtName: "",
  notes: "",
};

export default function DUIConsultationPage() {
  const [step, setStep] = useState<FormStep>("form");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep("submitting");

    try {
      const response = await fetch("/api/dui-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          },
          arrest: {
            arrestDate: formData.arrestDate,
            arrestLocation: formData.arrestLocation,
            bacLevel: formData.bacLevel,
            refusal: formData.refusal,
            priorDuis: formData.priorDuis,
            licenseStatus: formData.licenseStatus,
            courtName: formData.courtName,
            notes: formData.notes,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setStep("success");
    } catch (err) {
      setError("Something went wrong. Please call us directly.");
      setStep("form");
    }
  };

  // Calculate DOL deadline if arrest date provided
  const getDolDeadline = () => {
    if (!formData.arrestDate) return null;
    const arrest = new Date(formData.arrestDate);
    const deadline = new Date(arrest);
    deadline.setDate(deadline.getDate() + 7);
    return deadline;
  };

  const dolDeadline = getDolDeadline();
  const isUrgent = dolDeadline && dolDeadline <= new Date();

  // Fire Google Ads conversion on successful form submission
  useEffect(() => {
    if (step === "success" && typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-16922284676/dui_consultation_submission",
      });
    }
  }, [step]);

  if (step === "success") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h1
              className="mb-2 text-2xl font-bold text-slate-900"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Request Received
            </h1>
            <p className="mb-6 text-slate-600">
              I&apos;ll call you shortly to discuss your case, {formData.firstName}.
            </p>

            {dolDeadline && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-left">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">
                      DOL Hearing Deadline
                    </p>
                    <p className="text-sm text-red-700">
                      You have until{" "}
                      <strong>
                        {dolDeadline.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </strong>{" "}
                      to request a DOL hearing. I&apos;ll help you with this.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Can&apos;t wait? Call me directly:
              </p>
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="btn-call flex w-full items-center justify-center gap-2 text-lg"
              >
                <Phone className="h-5 w-5" />
                {SITE_CONFIG.phone}
              </a>
              <Link
                href="/dui-defense"
                className="block text-sm text-slate-500 hover:text-slate-700"
              >
                Back to DUI Defense
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 px-4 py-8 text-white">
        <div className="mx-auto max-w-lg">
          <Link
            href="/dui-defense"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to DUI Defense
          </Link>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Free DUI Consultation
          </h1>
          <p className="mt-2 text-slate-300">
            Tell me about your situation. I&apos;ll call you to discuss your options.
          </p>
        </div>
      </div>

      {/* Urgency Banner */}
      <div className="bg-red-600 px-4 py-3 text-center text-white">
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">
            DOL hearing must be requested within 7 days of arrest
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-8">
        <div className="mx-auto max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Info */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-slate-900">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="(253) 555-0000"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Arrest Info */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-slate-900">
                Arrest Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Date of Arrest
                  </label>
                  <input
                    type="date"
                    name="arrestDate"
                    value={formData.arrestDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  {dolDeadline && (
                    <p
                      className={`mt-1 text-sm ${isUrgent ? "font-semibold text-red-600" : "text-amber-600"}`}
                    >
                      DOL deadline:{" "}
                      {dolDeadline.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                      {isUrgent && " - URGENT"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Location of Arrest
                  </label>
                  <input
                    type="text"
                    name="arrestLocation"
                    value={formData.arrestLocation}
                    onChange={handleChange}
                    placeholder="e.g., I-5 near Tacoma Dome"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      BAC Level (if known)
                    </label>
                    <input
                      type="text"
                      name="bacLevel"
                      value={formData.bacLevel}
                      onChange={handleChange}
                      placeholder="e.g., 0.12"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Breath/Blood Refusal?
                    </label>
                    <select
                      name="refusal"
                      value={formData.refusal}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Unknown">Not sure</option>
                      <option value="No">No - I took the test</option>
                      <option value="Yes">Yes - I refused</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Prior DUIs
                    </label>
                    <select
                      name="priorDuis"
                      value={formData.priorDuis}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="0">None</option>
                      <option value="1">1 prior</option>
                      <option value="2">2 prior</option>
                      <option value="3+">3 or more</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      License Status
                    </label>
                    <select
                      name="licenseStatus"
                      value={formData.licenseStatus}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Valid">Valid</option>
                      <option value="Suspended">Already suspended</option>
                      <option value="Revoked">Revoked</option>
                      <option value="Unknown">Not sure</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-slate-900">
                Additional Details
              </h2>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Anything else I should know?
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any details about the stop, tests performed, or concerns you have..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={step === "submitting"}
              className="btn-primary w-full text-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === "submitting" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Request Free Consultation"
              )}
            </button>

            {/* Call Option */}
            <div className="text-center">
              <p className="mb-2 text-sm text-slate-500">
                Need immediate help?
              </p>
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="inline-flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700"
              >
                <Phone className="h-4 w-4" />
                Call {SITE_CONFIG.phone}
              </a>
              <p className="mt-1 text-xs text-slate-400">Available 24/7</p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
