"use client";

import Image from "next/image";
import { Fragment, useState } from "react";

const NAV_LINKS = [
  { label: "Publications", href: "/#publications" },
  { label: "Research", href: "/#research" },
  { label: "Education", href: "/#education" },
  { label: "Certifications", href: "/certifications" },
];

const FOOTER_NAV = [
  { label: "Publications", href: "/#publications" },
  { label: "Research", href: "/#research" },
  { label: "Education", href: "/#education" },
  { label: "Certifications", href: "/certifications" },
  { label: "Main Site", href: "https://machcomputing.com" },
];

const ORCID_ID = "0009-0005-6728-3089";

type Certification = {
  name: string;
  issuer: string;
  date: string;
  description: string;
  verifyUrl: string;
  pdfPath: string;
};

const CERTIFICATIONS: Certification[] = [
  {
    name: "Statistics For Data Science",
    issuer: "Coursera",
    date: "Dec 9, 2025",
    description:
      "Applied statistical methods for data science, covering probability distributions, hypothesis testing, regression analysis, and Bayesian inference.",
    verifyUrl: "https://coursera.org/verify/6BVUFCW3GI1A",
    pdfPath: "/certificates/statistics.pdf",
  },
  {
    name: "Mastering Digital Twins",
    issuer: "EIT Digital via Coursera",
    date: "Nov 25, 2025",
    description:
      "Design and implementation of digital twin systems, including real-time data integration, simulation modeling, and IoT-driven virtual representations.",
    verifyUrl: "https://coursera.org/verify/Z5QPNQPFN1QZ",
    pdfPath: "/certificates/mastering-dt.pdf",
  },
  {
    name: "Simulation and Modeling of Natural Processes",
    issuer: "University of Geneva via Coursera",
    date: "Nov 14, 2025",
    description:
      "Computational simulation techniques for modeling natural phenomena, including cellular automata, Monte Carlo methods, and lattice Boltzmann approaches.",
    verifyUrl: "https://coursera.org/verify/V9NQHYI3QZ8T",
    pdfPath: "/certificates/Simulation.pdf",
  },
];

export default function Certifications() {
  const [selected, setSelected] = useState<number | null>(null);
  const cert = selected !== null ? CERTIFICATIONS[selected] : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-mc-gray/15">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="MACH COMPUTING"
              width={36}
              height={36}
            />
            <Image
              src="/text_logo.png"
              alt="MACH COMPUTING"
              width={160}
              height={20}
              className="hidden sm:block"
            />
          </a>
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.href === "/certifications"
                    ? "text-mc-dark"
                    : "text-mc-gray hover:text-mc-dark"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://machcomputing.com"
              className="text-sm font-medium text-mc-gray/60 hover:text-mc-dark transition-colors"
            >
              &larr; Home
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12 lg:pt-32 lg:pb-20">
        <div className="max-w-xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-mc-dark">
            Certifications
          </h1>
          <p className="mt-6 text-lg text-mc-gray leading-relaxed max-w-lg">
            Professional certifications and credentials in data science,
            simulation, and digital systems.
          </p>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CERTIFICATIONS.map((c, i) => {
              const isSelected = selected === i;
              return (
                <Fragment key={c.verifyUrl}>
                  <button
                    onClick={() => setSelected(isSelected ? null : i)}
                    className={`group p-6 rounded-2xl border text-left transition-colors ${
                      isSelected
                        ? "border-mc-lavender/60 bg-mc-lavender/5"
                        : "border-mc-gray/15 bg-white hover:border-mc-mint/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full transition-colors ${
                          isSelected ? "bg-mc-lavender" : "bg-mc-lavender/50"
                        }`}
                      />
                      <h3 className="text-lg font-semibold text-mc-dark">
                        {c.name}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-mc-gray">{c.issuer}</p>
                    <p className="mt-1 text-sm font-mono text-mc-gray/60">
                      {c.date}
                    </p>
                  </button>

                  {isSelected && (
                    <div className="col-span-1 md:col-span-3 rounded-2xl border border-mc-gray/15 overflow-hidden">
                      <div className="flex flex-col lg:flex-row">
                        {/* PDF Viewer */}
                        <div className="flex-1 bg-mc-dark/[0.03] min-h-[600px]">
                          <iframe
                            src={c.pdfPath}
                            className="w-full h-full min-h-[600px]"
                            title={`${c.name} certificate`}
                          />
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-80 p-8 border-t lg:border-t-0 lg:border-l border-mc-gray/15 flex flex-col">
                          <div className="flex-1">
                            <div className="w-3 h-3 rounded-full bg-mc-lavender mb-4" />
                            <h3 className="text-xl font-bold text-mc-dark leading-snug">
                              {c.name}
                            </h3>
                            <p className="mt-2 text-sm font-medium text-mc-gray">
                              {c.issuer}
                            </p>
                            <p className="mt-1 text-sm font-mono text-mc-gray/60">
                              {c.date}
                            </p>
                            <p className="mt-5 text-sm text-mc-gray leading-relaxed">
                              {c.description}
                            </p>
                          </div>

                          <div className="mt-8 flex flex-col gap-3">
                            <a
                              href={c.verifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-mc-dark text-white text-sm font-medium hover:bg-mc-dark/85 transition-colors"
                            >
                              Verify on Coursera
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5-6h6m0 0v6m0-6L9.75 14.25"
                                />
                              </svg>
                            </a>
                            <a
                              href={c.pdfPath}
                              download
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-mc-gray/20 text-mc-dark/70 text-sm font-medium hover:border-mc-gray/40 transition-colors"
                            >
                              Download PDF
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Fragment>
              );
            })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-mc-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div>
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="MACH COMPUTING"
                  width={32}
                  height={32}
                />
                <span className="font-bold text-lg tracking-tight">
                  MACH COMPUTING
                </span>
              </div>
              <p className="mt-3 text-white/50 text-sm max-w-xs">
                Publications and research portfolio.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                  Navigation
                </h4>
                <div className="flex flex-col gap-2">
                  {FOOTER_NAV.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
                  Connect
                </h4>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://orcid.org/${ORCID_ID}`}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    ORCID
                  </a>
                  <a
                    href="https://scholar.google.com/citations?user=BgSpSB0AAAAJ"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Google Scholar
                  </a>
                  <a
                    href="https://github.com/LukasAfonso"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/lu%C3%ADs-carlos-casanova-afonso-8415521b2"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/10 text-xs text-white/30">
            &copy; {new Date().getFullYear()} MACH COMPUTING. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
