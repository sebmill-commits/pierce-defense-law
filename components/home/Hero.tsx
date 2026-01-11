"use client";

import Link from "next/link";
import Image from "next/image";
import { Camera, Phone, Clock } from "lucide-react";
import { SITE_CONFIG, BRAND } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12 lg:py-20">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Limited Availability Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Clock className="h-4 w-4 text-[--warning]" />
              Limited availability. Fast response.
            </div>

            {/* Main Headline */}
            <h1
              className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              DUI or Traffic Ticket?
              <span className="block text-[--success]">I&apos;ll Fight It.</span>
            </h1>

            {/* Subheadline */}
            <p className="mb-6 text-lg text-gray-300 sm:text-xl">
              {SITE_CONFIG.tagline}
            </p>

            {/* Three Pillars - Quick hits */}
            <div className="mb-8 flex flex-wrap justify-center gap-4 text-sm text-gray-300 lg:justify-start">
              {BRAND.pillars.map((pillar, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[--success]" />
                  {pillar.title}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/fight-my-ticket"
                className="btn-primary w-full text-lg sm:w-auto"
              >
                <Camera className="h-5 w-5" />
                Upload Your Ticket
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="btn-secondary w-full text-lg sm:w-auto"
              >
                <Phone className="h-5 w-5" />
                {SITE_CONFIG.phone}
              </a>
            </div>

            {/* Urgency Note */}
            <p className="mt-6 text-sm text-gray-400">
              I take a limited number of cases to keep service fast and personal.
              <br className="hidden sm:block" />
              {" "}If I&apos;m full, I&apos;ll tell you right away.
            </p>
          </div>

          {/* Hero Photo */}
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/images/sebastian-miller.jpg"
                alt="Sebastian Miller, Trial Attorney"
                width={741}
                height={1024}
                className="h-auto w-full object-cover"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Name Tag */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-lg font-bold text-white">
                  {SITE_CONFIG.attorneyName}
                </p>
                <p className="text-sm text-gray-300">
                  {SITE_CONFIG.attorneyTitle} &bull; Pierce County
                </p>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 rounded-xl bg-white p-4 shadow-xl lg:-right-8">
              <p className="text-2xl font-bold text-[--primary]">
                {SITE_CONFIG.caseCount}
              </p>
              <p className="text-xs text-[--text-secondary]">Cases Handled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80L60 73.3C120 66.7 240 53.3 360 46.7C480 40 600 40 720 43.3C840 46.7 960 53.3 1080 56.7C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
