"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import type { IntakeState } from "@/app/defense/fight-my-ticket/page";
import { SEATTLE_SITE_CONFIG } from "@/lib/seattle-constants";

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

export default function SeattleConfirmation({ state, onReset }: ConfirmationProps) {
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

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <h2
          className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          You&apos;re All Set, {state.contact.firstName}!
        </h2>
        <p className="text-slate-600">
          I&apos;ve received your case information and payment.
        </p>
      </div>

      {/* Order Details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-slate-900">Case Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Court</span>
            <span className="font-medium text-slate-900">
              {state.citation.courtName}
            </span>
          </div>
          {state.citation.violationType && (
            <div className="flex justify-between">
              <span className="text-slate-600">Violation</span>
              <span className="font-medium text-slate-900">
                {state.citation.violationType}
              </span>
            </div>
          )}
          {state.citation.citationNumber && (
            <div className="flex justify-between">
              <span className="text-slate-600">Citation #</span>
              <span className="font-medium text-slate-900">
                {state.citation.citationNumber}
              </span>
            </div>
          )}
          <div className="border-t border-slate-200 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Amount Paid</span>
              <span className="font-bold text-emerald-600">${state.price}</span>
            </div>
          </div>
          {state.paymentId && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Confirmation</span>
              <span className="font-mono text-slate-400">{state.paymentId}</span>
            </div>
          )}
        </div>
      </div>

      {/* What Happens Next */}
      <div className="rounded-2xl bg-slate-100 p-6">
        <h3 className="mb-4 font-semibold text-slate-900">What Happens Next</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              1
            </div>
            <div>
              <p className="font-medium text-slate-900">
                Confirmation Email
              </p>
              <p className="text-sm text-slate-600">
                Check your inbox for a welcome email with next steps.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              2
            </div>
            <div>
              <p className="font-medium text-slate-900">Case Review</p>
              <p className="text-sm text-slate-600">
                I&apos;ll review your citation and develop a defense strategy.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              3
            </div>
            <div>
              <p className="font-medium text-slate-900">Court Handling</p>
              <p className="text-sm text-slate-600">
                I handle all court appearances and paperwork on your behalf.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-slate-900">Questions?</h3>
        <div className="space-y-3">
          <a
            href={`tel:${SEATTLE_SITE_CONFIG.phoneRaw}`}
            className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100"
          >
            <Phone className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-medium text-slate-900">
                {SEATTLE_SITE_CONFIG.phone}
              </p>
              <p className="text-xs text-slate-500">Call or text anytime</p>
            </div>
          </a>
          <a
            href={`mailto:${SEATTLE_SITE_CONFIG.email}`}
            className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100"
          >
            <Mail className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-medium text-slate-900">
                {SEATTLE_SITE_CONFIG.email}
              </p>
              <p className="text-xs text-slate-500">Email me directly</p>
            </div>
          </a>
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <Clock className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-medium text-slate-900">Response Time</p>
              <p className="text-xs text-slate-500">
                Usually within a few hours during business hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-medium text-emerald-600 hover:text-emerald-700"
        >
          Back to Home
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
