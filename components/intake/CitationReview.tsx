"use client";

import { useEffect } from "react";
import { ArrowLeft, DollarSign } from "lucide-react";
import type { CitationData } from "@/app/fight-my-ticket/page";
import { COURT_PRICING, calculatePrice } from "@/lib/constants";

interface CitationReviewProps {
  citation: CitationData;
  updateCitation: (data: Partial<CitationData>) => void;
  price: number;
  setPrice: (price: number) => void;
  onBack: () => void;
  onNext: () => void;
}

const courts = Object.keys(COURT_PRICING).filter((c) => c !== "default");

const violationTypes = [
  "Speeding 1-10 over",
  "Speeding 11-15 over",
  "Speeding 16-20 over",
  "Speeding 21+ over",
  "Speeding in school zone",
  "Speeding in construction zone",
  "Red light camera",
  "Stop sign violation",
  "HOV violation",
  "Cell phone violation",
  "Seatbelt violation",
  "Insurance violation",
  "Expired tabs",
  "Negligent driving",
  "Other infraction",
];

export default function CitationReview({
  citation,
  updateCitation,
  price,
  setPrice,
  onBack,
  onNext,
}: CitationReviewProps) {
  // Calculate price when court or violation changes
  useEffect(() => {
    if (citation.courtName) {
      const priceInfo = calculatePrice(citation.courtName, citation.violationType);
      setPrice(priceInfo.totalPrice);
    }
  }, [citation.courtName, citation.violationType, setPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citation.courtName) {
      alert("Please select a court");
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Court Selection */}
      <div>
        <label
          htmlFor="courtName"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Court <span className="text-red-500">*</span>
        </label>
        <select
          id="courtName"
          value={citation.courtName}
          onChange={(e) => updateCitation({ courtName: e.target.value })}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          required
        >
          <option value="">Select the court on your citation</option>
          {courts.map((court) => (
            <option key={court} value={court}>
              {court}
            </option>
          ))}
          <option value="Other">Other (not listed)</option>
        </select>
        <p className="mt-1 text-xs text-slate-500">
          This is listed on your citation, usually near the top
        </p>
      </div>

      {/* Violation Type */}
      <div>
        <label
          htmlFor="violationType"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Violation Type
        </label>
        <select
          id="violationType"
          value={citation.violationType}
          onChange={(e) => updateCitation({ violationType: e.target.value })}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Select violation type (optional)</option>
          {violationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Citation Number */}
      <div>
        <label
          htmlFor="citationNumber"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Citation Number
        </label>
        <input
          type="text"
          id="citationNumber"
          value={citation.citationNumber}
          onChange={(e) => updateCitation({ citationNumber: e.target.value })}
          placeholder="e.g., TC123456789"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        <p className="mt-1 text-xs text-slate-500">
          Usually at the top of your citation
        </p>
      </div>

      {/* Dates Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="citationDate"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Citation Date
          </label>
          <input
            type="date"
            id="citationDate"
            value={citation.citationDate}
            onChange={(e) => updateCitation({ citationDate: e.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <div>
          <label
            htmlFor="hearingDate"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Court/Hearing Date
          </label>
          <input
            type="date"
            id="hearingDate"
            value={citation.hearingDate}
            onChange={(e) => updateCitation({ hearingDate: e.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Fine Amount */}
      <div>
        <label
          htmlFor="fineAmount"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Fine Amount (if listed)
        </label>
        <input
          type="text"
          id="fineAmount"
          value={citation.fineAmount}
          onChange={(e) => updateCitation({ fineAmount: e.target.value })}
          placeholder="e.g., $250"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Price Quote */}
      {citation.courtName && price > 0 && (
        <div className="rounded-2xl bg-emerald-50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-emerald-700">Your flat fee</p>
              <p className="text-3xl font-bold text-emerald-900">${price}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-emerald-700">
            This includes everything: court appearances, paperwork, and
            negotiations. No hourly billing. No surprises.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-4 font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button type="submit" className="btn-primary flex-1 text-lg">
          Continue
        </button>
      </div>
    </form>
  );
}
