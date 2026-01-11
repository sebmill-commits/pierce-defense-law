"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Do I have to go to court?",
    answer:
      "For most traffic infractions in Seattle and King County courts, no. I appear on your behalf so you can go about your day. Criminal matters like DUI require your presence at some hearings, but I'll be there with you.",
  },
  {
    question: "What are my chances of winning?",
    answer:
      "Every case is different, but most traffic tickets have weaknesses - procedural errors, calibration issues, or problems with the officer's observations. I'll give you an honest assessment of your case before you pay anything.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Traffic infractions start at $149-$219 depending on the court and violation type. DUI consultations are free. I'll give you an exact quote before we start - no surprises.",
  },
  {
    question: "How long does this take?",
    answer:
      "Traffic tickets typically resolve in 30-90 days depending on the court's schedule. DUI cases take longer - usually 3-6 months. I'll keep you informed throughout.",
  },
  {
    question: "What if I already paid my ticket?",
    answer:
      "Paying a ticket is admitting guilt, and it's usually final. If you haven't paid yet, don't - contact me first. There may still be options depending on when you paid and the specific circumstances.",
  },
  {
    question: "Do you handle cases outside King County?",
    answer:
      "Yes. While I focus on Seattle and King County courts, I also handle cases in Snohomish County, Pierce County, and other nearby jurisdictions. If you're not sure, just ask.",
  },
];

export default function SeattleFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[--bg-light] py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2
            className="mb-4 text-3xl font-bold text-[--primary] sm:text-4xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Common Questions
          </h2>
          <p className="text-lg text-[--text-secondary]">
            Straight answers to the questions I hear most.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-[--primary]">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 flex-shrink-0 text-[--text-secondary]" />
                ) : (
                  <ChevronDown className="h-5 w-5 flex-shrink-0 text-[--text-secondary]" />
                )}
              </button>
              {openIndex === index && (
                <div className="border-t border-gray-100 px-6 py-4">
                  <p className="text-[--text-secondary]">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
