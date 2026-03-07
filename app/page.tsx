import Image from "next/image";

// Revalidate every 5 minutes
export const revalidate = 300;

const ORCID_ID = "0009-0005-6728-3089";
const AUTHOR_NAME = "Luís Carlos Afonso";

const NAV_LINKS = [
  { label: "Publications", href: "#publications" },
  { label: "Research", href: "#research" },
  { label: "Education", href: "#education" },
];

type Publication = {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  links: { label: string; href: string }[];
};

async function fetchPublications(): Promise<Publication[]> {
  // Fetch works from ORCID public API
  const orcidRes = await fetch(
    `https://pub.orcid.org/v3.0/${ORCID_ID}/works`,
    { headers: { Accept: "application/json" } }
  );

  if (!orcidRes.ok) return [];

  const orcidData = await orcidRes.json();
  const groups = orcidData.group ?? [];

  const publications: Publication[] = [];

  for (const group of groups) {
    const summary = group["work-summary"]?.[0];
    if (!summary) continue;

    const title =
      summary.title?.title?.value ?? "Untitled";
    const year = parseInt(summary["publication-date"]?.year?.value ?? "0", 10);
    const type = summary.type;

    // Extract DOI and other external IDs
    const externalIds =
      summary["external-ids"]?.["external-id"] ?? [];
    const doi = externalIds.find(
      (id: { "external-id-type": string }) => id["external-id-type"] === "doi"
    )?.["external-id-value"];
    const scopusEid = externalIds.find(
      (id: { "external-id-type": string }) => id["external-id-type"] === "eid"
    )?.["external-id-value"];

    // Build links
    const links: { label: string; href: string }[] = [];
    if (doi) {
      links.push({ label: "DOI", href: `https://doi.org/${doi}` });
    }

    // Try to get full metadata from Crossref (authors, venue)
    let authors: string[] = [AUTHOR_NAME];
    let venue =
      summary["journal-title"]?.value ?? type ?? "Publication";

    if (doi) {
      try {
        const crossrefRes = await fetch(
          `https://api.crossref.org/works/${encodeURIComponent(doi)}`,
          { headers: { Accept: "application/json" } }
        );
        if (crossrefRes.ok) {
          const crossrefData = await crossrefRes.json();
          const work = crossrefData.message;

          // Authors
          if (work.author?.length) {
            authors = work.author.map(
              (a: { given?: string; family?: string }) =>
                [a.given, a.family].filter(Boolean).join(" ")
            );
          }

          // Venue — prefer container-title, fall back to event name
          const container = work["container-title"]?.[0];
          const event = work.event?.name;
          if (container) venue = container;
          else if (event) venue = event;
        }
      } catch {
        // Crossref fetch failed — use ORCID data
      }
    }

    // Check for URL-type external IDs (e.g. ACL Anthology)
    for (const eid of externalIds) {
      if (eid["external-id-type"] === "uri" && eid["external-id-value"]) {
        const url = eid["external-id-value"] as string;
        if (url.includes("aclanthology.org")) {
          links.push({ label: "ACL Anthology", href: url });
          // Also add PDF link
          if (url.endsWith("/")) {
            links.push({ label: "PDF", href: url.slice(0, -1) + ".pdf" });
          } else {
            links.push({ label: "PDF", href: url + ".pdf" });
          }
        }
      }
      if (
        eid["external-id-type"] === "source-work-id" &&
        eid["external-id-url"]?.value
      ) {
        const url = eid["external-id-url"].value as string;
        if (url.includes("aclanthology.org")) {
          if (!links.some((l) => l.label === "ACL Anthology")) {
            links.push({ label: "ACL Anthology", href: url });
            links.push({ label: "PDF", href: url + ".pdf" });
          }
        } else if (url.includes("scopus.com")) {
          links.push({ label: "Scopus", href: url });
        }
      }
    }

    publications.push({ title, authors, venue, year, links });
  }

  // Sort by year descending, then alphabetically
  publications.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

  return publications;
}

const RESEARCH_AREAS = [
  {
    title: "Algorithms",
    description:
      "Design and analysis of efficient algorithms for combinatorial optimization, graph problems, and computational geometry. Interested in bridging theoretical guarantees with practical performance.",
  },
  {
    title: "Artificial Intelligence",
    description:
      "Using AI as a tool for solving complex problems across domains. From natural language processing to predictive modeling, exploring how machine learning can be applied to real-world challenges.",
  },
  {
    title: "High Performance Computing",
    description:
      "Parallel and distributed computing, GPU acceleration, and performance optimization. Focused on scaling compute-intensive workloads across heterogeneous architectures.",
  },
];

type Education = {
  degree: string;
  institution: string;
  field: string;
  years: string;
  current: boolean;
};

async function fetchEducation(): Promise<Education[]> {
  const res = await fetch(
    `https://pub.orcid.org/v3.0/${ORCID_ID}/educations`,
    { headers: { Accept: "application/json" } }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const groups =
    data["affiliation-group"] ?? data["education-summary"] ?? [];

  const entries: Education[] = [];

  for (const group of groups) {
    // Handle both grouped and flat formats
    const summaries =
      group.summaries?.map(
        (s: Record<string, unknown>) =>
          s["education-summary"] ?? s
      ) ?? [group];

    for (const summary of summaries) {
      const role = summary["role-title"] ?? "";
      const dept = summary["department-name"] ?? "";
      const org = summary.organization?.name ?? "";
      const startYear = summary["start-date"]?.year?.value;
      const endYear = summary["end-date"]?.year?.value;

      const degree = role || dept || "Degree";
      const field = role ? dept : "";
      const current = !endYear;
      const years = current
        ? `${startYear ?? "?"} — Present`
        : `${startYear ?? "?"} — ${endYear}`;

      entries.push({ degree, institution: org, field, years, current });
    }
  }

  // Sort: current first, then by start year descending
  entries.sort((a, b) => {
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    const aStart = parseInt(a.years) || 0;
    const bStart = parseInt(b.years) || 0;
    return bStart - aStart;
  });

  return entries;
}

function HeroGeometry() {
  return (
    <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-square relative">
      {/* Large quarter circle — mint */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full geo-arc">
        <path d="M400,0 A400,400 0 0,1 0,400 L400,400 Z" fill="#98DFAF" />
      </svg>
      {/* Overlapping circle — lavender */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full geo-circle">
        <circle cx="140" cy="140" r="120" fill="#B8B3E9" />
      </svg>
      {/* Small rounded square — dark */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full geo-square">
        <rect x="80" y="300" width="60" height="60" rx="12" fill="#2E282A" />
      </svg>
      {/* Diamond accent — lime */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full geo-diamond">
        <rect x="300" y="180" width="36" height="36" rx="4" transform="rotate(45 318 198)" fill="#DEEFB7" />
      </svg>
    </div>
  );
}

const FOOTER_NAV = [
  { label: "Publications", href: "#publications" },
  { label: "Research", href: "#research" },
  { label: "Education", href: "#education" },
  { label: "Main Site", href: "https://machcomputing.com" },
];

export default async function Portfolio() {
  const publications = await fetchPublications();
  const education = await fetchEducation();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-mc-gray/15">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <a
            href="https://machcomputing.com"
            className="flex items-center gap-3"
          >
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
                className="text-sm font-medium text-mc-gray hover:text-mc-dark transition-colors"
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
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-mc-dark">
              Publications &{" "}
              <span className="text-mc-lavender">Research</span>
            </h1>
            <p className="mt-6 text-lg text-mc-gray leading-relaxed max-w-lg">
              Academic work in systems, performance engineering, and distributed
              computing. Currently pursuing a PhD in Computer Science.
            </p>
          </div>
          <div className="flex-1 flex justify-center lg:justify-end">
            <HeroGeometry />
          </div>
        </div>
      </section>

      {/* Publications */}
      <section id="publications" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-mc-dark tracking-tight">
              Publications
            </h2>
            <a
              href={`https://orcid.org/${ORCID_ID}`}
              className="text-xs font-medium px-3 py-1 rounded-full bg-mc-lime/30 text-mc-dark/70 hover:bg-mc-lime/50 transition-colors"
            >
              ORCID
            </a>
          </div>
          <p className="mt-3 text-mc-gray text-lg max-w-2xl">
            Peer-reviewed papers and thesis work.
          </p>
          <div className="mt-12 space-y-0 divide-y divide-mc-gray/10">
            {publications.map((pub) => (
              <div key={pub.title} className="py-6 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-mc-dark leading-snug">
                      {pub.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-mc-gray">
                      {pub.authors.map((author, i) => (
                        <span key={`${author}-${i}`}>
                          {author === AUTHOR_NAME ? (
                            <span className="font-semibold text-mc-dark/80">
                              {author}
                            </span>
                          ) : (
                            author
                          )}
                          {i < pub.authors.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                    <p className="mt-1 text-sm text-mc-gray italic">
                      {pub.venue}, {pub.year}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {pub.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          className="text-xs font-medium px-2.5 py-1 rounded-full bg-mc-lavender/15 text-mc-dark/70 hover:bg-mc-lavender/25 transition-colors"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-mono text-mc-gray/50 shrink-0 pt-0.5">
                    {pub.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research */}
      <section id="research" className="py-20 lg:py-28 bg-mc-dark/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-mc-dark tracking-tight">
            Research Areas
          </h2>
          <p className="mt-3 text-mc-gray text-lg max-w-2xl">
            Current interests and ongoing directions.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESEARCH_AREAS.map((area) => (
              <div
                key={area.title}
                className="group p-6 rounded-2xl border border-mc-gray/15 bg-white hover:border-mc-mint/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-mc-mint" />
                  <h3 className="text-lg font-semibold text-mc-dark">
                    {area.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-mc-gray leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-mc-dark tracking-tight">
            Education
          </h2>
          <div className="mt-12 space-y-8">
            {education.map((entry) => (
              <div
                key={`${entry.degree}-${entry.institution}`}
                className="border-l-2 border-mc-mint pl-6"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-mc-dark">
                    {entry.degree}
                  </h3>
                  {entry.current && (
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-mc-mint/20 text-mc-dark/70">
                      Current
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-mc-gray">
                  {entry.institution}
                  {entry.field && <> &middot; {entry.field}</>}
                </p>
                <p className="mt-0.5 text-sm font-mono text-mc-gray/60">
                  {entry.years}
                </p>
              </div>
            ))}
          </div>
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
                  className=""
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
