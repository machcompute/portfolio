"use client";

import { Fragment, useState } from "react";
import { CERTIFICATIONS, type Certification } from "../data/certifications";

const COURSES = CERTIFICATIONS.filter((c) => c.type === "course");
const WEBINARS = CERTIFICATIONS.filter((c) => c.type === "webinar");

function CertificatePreview({ c }: { c: Certification }) {
  return (
    <div className="rounded-2xl border border-mc-gray/15 overflow-hidden">
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
            <p className="mt-2 text-sm font-medium text-mc-gray">{c.issuer}</p>
            <p className="mt-1 text-sm font-mono text-mc-gray/60">{c.date}</p>
            <p className="mt-5 text-sm text-mc-gray leading-relaxed">
              {c.description}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {c.verifyUrl && (
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
            )}
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
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-wider text-mc-gray/70 mb-5">
      {children}
    </h3>
  );
}

export default function CertificationsGrid() {
  const [selected, setSelected] = useState<string | null>(null);
  const toggle = (path: string) =>
    setSelected(selected === path ? null : path);

  return (
    <div className="flex flex-col gap-14">
      {/* Courses */}
      <div>
        <SubHeading>Courses</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 grid-flow-row-dense gap-6">
          {COURSES.map((c) => {
            const isSelected = selected === c.pdfPath;
            return (
              <Fragment key={c.pdfPath}>
                <button
                  onClick={() => toggle(c.pdfPath)}
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
                    <h4 className="text-lg font-semibold text-mc-dark">
                      {c.name}
                    </h4>
                  </div>
                  <p className="mt-3 text-sm text-mc-gray">{c.issuer}</p>
                  <p className="mt-1 text-sm font-mono text-mc-gray/60">
                    {c.date}
                  </p>
                </button>

                {isSelected && (
                  <div className="col-span-1 md:col-span-3">
                    <CertificatePreview c={c} />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Webinars & Events */}
      {WEBINARS.length > 0 && (
        <div>
          <SubHeading>Webinars &amp; Events</SubHeading>
          <div className="flex flex-col gap-3">
            {WEBINARS.map((c) => {
              const isSelected = selected === c.pdfPath;
              return (
                <Fragment key={c.pdfPath}>
                  <button
                    onClick={() => toggle(c.pdfPath)}
                    className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-5 py-4 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? "border-mc-lavender/60 bg-mc-lavender/5"
                        : "border-mc-gray/15 bg-white hover:border-mc-mint/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                          isSelected ? "bg-mc-lavender" : "bg-mc-lavender/50"
                        }`}
                      />
                      <h4 className="text-base font-medium text-mc-dark leading-snug">
                        {c.name}
                      </h4>
                    </div>
                    <p className="text-sm text-mc-gray shrink-0 pl-3.5 sm:pl-0">
                      {c.issuer}
                    </p>
                    <p className="text-sm font-mono text-mc-gray/60 shrink-0 pl-3.5 sm:pl-0 sm:w-28 sm:text-right">
                      {c.date}
                    </p>
                  </button>

                  {isSelected && <CertificatePreview c={c} />}
                </Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
