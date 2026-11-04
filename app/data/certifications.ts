export type Certification = {
  type: "course" | "webinar";
  name: string;
  issuer: string;
  date: string;
  description: string;
  verifyUrl?: string;
  pdfPath: string;
};

export const CERTIFICATIONS: Certification[] = [
  {
    type: "webinar",
    name: "Research Tools and Platforms: Resources to Enhance Your Research Process",
    issuer: "Sage Publishing",
    date: "Nov 4, 2026",
    description:
      "One-hour webinar from the How to Do Research and Get Published series, covering tools and platforms that support the research and publishing process.",
    pdfPath: "/certificates/research-tools.pdf",
  },
  {
    type: "course",
    name: "Calculus for Engineers",
    issuer: "The Hong Kong University of Science and Technology via Coursera",
    date: "Oct 3, 2026",
    description:
      "Single and multivariable calculus for engineering applications, covering limits, derivatives, integrals, series, and partial derivatives.",
    verifyUrl: "https://coursera.org/verify/VBNF0094IWJX",
    pdfPath: "/certificates/calculus.pdf",
  },
  {
    type: "course",
    name: "Matrix Algebra for Engineers",
    issuer: "The Hong Kong University of Science and Technology via Coursera",
    date: "Mar 21, 2026",
    description:
      "Matrix algebra fundamentals for engineering applications, covering systems of linear equations, vector spaces, eigenvalues and eigenvectors, and matrix decompositions.",
    verifyUrl: "https://coursera.org/verify/XFQ9UHMOBD7O",
    pdfPath: "/certificates/matrix-algebra.pdf",
  },
  {
    type: "course",
    name: "Statistics For Data Science",
    issuer: "Coursera",
    date: "Dec 9, 2025",
    description:
      "Applied statistical methods for data science, covering probability distributions, hypothesis testing, regression analysis, and Bayesian inference.",
    verifyUrl: "https://coursera.org/verify/6BVUFCW3GI1A",
    pdfPath: "/certificates/statistics.pdf",
  },
  {
    type: "course",
    name: "Mastering Digital Twins",
    issuer: "EIT Digital via Coursera",
    date: "Nov 25, 2025",
    description:
      "Design and implementation of digital twin systems, including real-time data integration, simulation modeling, and IoT-driven virtual representations.",
    verifyUrl: "https://coursera.org/verify/Z5QPNQPFN1QZ",
    pdfPath: "/certificates/mastering-dt.pdf",
  },
  {
    type: "course",
    name: "Simulation and Modeling of Natural Processes",
    issuer: "University of Geneva via Coursera",
    date: "Nov 14, 2025",
    description:
      "Computational simulation techniques for modeling natural phenomena, including cellular automata, Monte Carlo methods, and lattice Boltzmann approaches.",
    verifyUrl: "https://coursera.org/verify/V9NQHYI3QZ8T",
    pdfPath: "/certificates/Simulation.pdf",
  },
];
