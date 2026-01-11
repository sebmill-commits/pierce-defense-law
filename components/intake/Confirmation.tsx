"use client";

import { useEffect } from "react";
import { CheckCircle, Mail, Phone, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import type { IntakeState } from "@/app/(pierce)/fight-my-ticket/page";
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

interface ConfirmationProps {
  state: IntakeState;
  onReset: () => void;
}

export default function Confirmation({ state, onReset }: ConfirmationProps) {
  // Fire Google Ads conversion on successful form submission
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-16922284676/traffic_ticket_submission",
        value: state.price,
        currency: "USD",
        transaction_id: state.paymentId,
      });
    }
  }, [state.price, state.paymentId]);
  const steps = [
    {
      icon: Mail,
      title: "Check your email",
      description: `I've sent a retainer agreement to ${state.contact.email}. Please sign it to officially begin your case.`,
    },
    {
      icon: FileText,
      title: "I'll review your case",
      description:
        "Once I receive your signed retainer, I'll review your citation and develop a defense strategy.",
    },
    {
      icon: Calendar,
      title: "I'll handle the court date",
      description:
        "I'll file the necessary paperwork and appear in court on your behalf. You don't need to take time off work.",
    },
    {
      icon: Phone,
      title: "Stay in touch",
      description:
        "I'll keep you updated via email and phone. Reach out anytime if you have questions.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <h2
          className="mb-2 text-2xl font-bold text-slate-900"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          You&apos;re All Set!
        </h2>
        <p className="text-slate-600">
          Thank you, {state.contact.firstName}. Your payment has been received.
        </p>
      </div>

      {/* Order Details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-slate-900">Case Details</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Confirmation</dt>
            <dd className="font-medium text-slate-900">
              {state.paymentId?.slice(0, 12).toUpperCase() || "PENDING"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Court</dt>
            <dd className="font-medium text-slate-900">
              {state.citation.courtName}
            </dd>
          </div>
          {state.citation.citationNumber && (
            <div className="flex justify-between">
              <dt className="text-slate-500">Citation #</dt>
              <dd className="font-medium text-slate-900">
                {state.citation.citationNumber}
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-slate-500">Amount Paid</dt>
            <dd className="font-medium text-emerald-600">${state.price}</dd>
          </div>
        </dl>
      </div>

      {/* What Happens Next */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          What Happens Next
        </h3>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                <step.icon className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">{step.title}</h4>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Contact Info */}
      <div className="rounded-2xl bg-slate-800 p-6 text-white">
        <h3 className="mb-2 font-semibold">Save My Contact Info</h3>
        <p className="mb-4 text-sm text-slate-300">
          Add my number to your contacts for quick access if you have questions.
        </p>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-emerald-400" />
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="text-lg font-semibold text-white hover:text-emerald-400"
          >
            {SITE_CONFIG.phone}
          </a>
        </div>
        <p className="mt-2 text-sm text-slate-400">{SITE_CONFIG.attorneyName}</p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link
          href="/"
          className="btn-primary flex w-full items-center justify-center text-lg"
        >
          Back to Homepage
        </Link>
        <button
          onClick={onReset}
          className="w-full text-center text-sm text-slate-500 hover:text-slate-700"
        >
          Submit another ticket
        </button>
      </div>
    </div>
  );
}
