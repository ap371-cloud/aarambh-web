import type { Chapter, SubjectId } from "./types";

export const SUBJECTS: Record<
  SubjectId,
  { name: string; short: string; line: string }
> = {
  phy: { name: "Physics", short: "Phy", line: "Mechanics, fields, waves, modern." },
  chem: { name: "Chemistry", short: "Chem", line: "Physical, organic, inorganic." },
  math: { name: "Mathematics", short: "Math", line: "Algebra, calculus, coordinate." },
};

export const chapters: Chapter[] = [
  {
    id: "kinematics",
    subject: "phy",
    title: "Kinematics",
    classLevel: "11",
    weight: "High yield",
    topics: [
      {
        id: "kin-1d",
        title: "Motion in one dimension",
        minutes: 18,
        blurb: "SUVAT with signs, and when constant acceleration actually holds.",
        formulas: [
          { name: "v = u + at", expr: "v = u + at", note: "a constant" },
          { name: "s", expr: "s = ut + ½at²", note: "from rest, s = ½at²" },
          { name: "v²", expr: "v² = u² + 2as", note: "time-free" },
        ],
        questions: [
          {
            id: "kin-1",
            stem: "A particle starts from rest with constant acceleration 2 m/s². Distance in the 3rd second is",
            options: { A: "5 m", B: "6 m", C: "7 m", D: "9 m" },
            answer: "A",
            explain: "sₙ = u + a(n - ½) = 0 + 2(3 - 0.5) = 5 m.",
          },
          {
            id: "kin-2",
            stem: "A body moving at 20 m/s is brought to rest in 5 s by uniform retardation. Distance covered is",
            options: { A: "25 m", B: "50 m", C: "100 m", D: "10 m" },
            answer: "B",
            explain: "a = (0-20)/5 = -4. s = ut + ½at² = 100 - 50 = 50 m. Or average speed × time = 10 × 5.",
          },
          {
            id: "kin-3",
            stem: "Which graph for a particle with constant positive acceleration (starting from rest) is correct?",
            options: {
              A: "v-t is a horizontal line",
              B: "s-t is a straight line through origin",
              C: "v-t is a straight line with positive slope through origin",
              D: "a-t is a straight line with positive slope",
            },
            answer: "C",
            explain: "Constant a means v = at (through origin if u = 0). a-t is horizontal, not sloped. s-t is parabolic.",
          },
          {
            id: "kin-4",
            stem: "A stone is dropped from a tower. It covers 25 m in the last second of its fall (g = 10 m/s²). Height of the tower is",
            options: { A: "45 m", B: "50 m", C: "125 m", D: "20 m" },
            answer: "A",
            explain: "Distance in nth second = ½g(2n-1) = 25 ⇒ 5(2n-1) = 25 ⇒ n = 3. H = ½gt² = 5×9 = 45 m.",
          },
        ],
      },
      {
        id: "kin-proj",
        title: "Projectile motion",
        minutes: 22,
        blurb: "Range, time of flight, and the 45° myth on level ground.",
        formulas: [
          { name: "Time of flight", expr: "T = 2u sinθ / g", note: "level ground" },
          { name: "Range", expr: "R = u² sin2θ / g", note: "max at 45°" },
          { name: "Max height", expr: "H = u² sin²θ / 2g", note: "vertical part only" },
        ],
        questions: [
          {
            id: "pr-1",
            stem: "Two projectiles are thrown with the same speed at 30° and 60° to the horizontal. Their ranges are",
            options: { A: "in ratio 1 : 2", B: "in ratio 1 : √3", C: "equal", D: "in ratio √3 : 1" },
            answer: "C",
            explain: "sin 60° = sin 120° = √3/2, so sin 2θ is the same for complementary angles. Ranges are equal.",
          },
          {
            id: "pr-2",
            stem: "A projectile has maximum range R on level ground. Maximum height for that throw is",
            options: { A: "R", B: "R/2", C: "R/4", D: "R/8" },
            answer: "C",
            explain: "At 45°, R = u²/g and H = u²/(4g) = R/4.",
          },
          {
            id: "pr-3",
            stem: "For a projectile, the horizontal component of velocity",
            options: {
              A: "increases with time",
              B: "decreases with time",
              C: "remains constant if air drag is ignored",
              D: "is zero at the top",
            },
            answer: "C",
            explain: "Gravity is vertical. With no air resistance, ux is constant. At the top only uy is zero.",
          },
          {
            id: "pr-4",
            stem: "Angle of projection for maximum range up an incline of angle β is",
            options: { A: "45°", B: "45° + β/2", C: "45° - β/2", D: "90° - β" },
            answer: "B",
            explain: "Standard result: θ = π/4 + β/2 for range up the incline.",
          },
        ],
      },
    ],
  },
  {
    id: "newton",
    subject: "phy",
    title: "Laws of motion",
    classLevel: "11",
    weight: "Core",
    topics: [
      {
        id: "n2",
        title: "Newton's second law & friction",
        minutes: 20,
        blurb: "Free-body diagrams, limiting friction, and pseudo force only when you must.",
        formulas: [
          { name: "ΣF", expr: "ΣF = ma", note: "in an inertial frame" },
          { name: "Friction", expr: "f ≤ μN", note: "kinetic: f = μₖN" },
        ],
        questions: [
          {
            id: "n-1",
            stem: "A 2 kg block on a horizontal surface (μ = 0.2) is pulled by 10 N horizontally. Acceleration is (g = 10)",
            options: { A: "3 m/s²", B: "5 m/s²", C: "1 m/s²", D: "4 m/s²" },
            answer: "A",
            explain: "f = μmg = 0.2×2×10 = 4 N. Net force = 6 N. a = 6/2 = 3 m/s².",
          },
          {
            id: "n-2",
            stem: "A lift of mass M is going up with acceleration a. Tension in the cable is",
            options: { A: "Mg", B: "M(g - a)", C: "M(g + a)", D: "Ma" },
            answer: "C",
            explain: "T - Mg = Ma ⇒ T = M(g + a).",
          },
          {
            id: "n-3",
            stem: "Two blocks of 3 kg and 2 kg are connected by a light string on a smooth table. A 10 N force pulls the 3 kg block away from the 2 kg. Tension is",
            options: { A: "4 N", B: "6 N", C: "10 N", D: "2 N" },
            answer: "A",
            explain: "a = 10/5 = 2 m/s². Tension pulls the 2 kg block: T = 2×2 = 4 N.",
          },
          {
            id: "n-4",
            stem: "A body of mass m is at rest on a rough inclined plane of angle θ. The friction force is",
            options: { A: "μmg cosθ always", B: "mg sinθ", C: "mg cosθ", D: "zero" },
            answer: "B",
            explain: "At rest, static friction balances the downhill component mg sinθ, provided it does not exceed μN.",
          },
        ],
      },
    ],
  },
  {
    id: "electro",
    subject: "phy",
    title: "Electrostatics",
    classLevel: "12",
    weight: "High yield",
    topics: [
      {
        id: "coulomb",
        title: "Coulomb's law & field",
        minutes: 24,
        blurb: "Point charges, superposition, and field vs potential.",
        formulas: [
          { name: "Coulomb", expr: "F = k q₁q₂ / r²", note: "k = 9×10⁹" },
          { name: "Field", expr: "E = kq / r²", note: "away if q > 0" },
          { name: "Potential", expr: "V = kq / r", note: "scalar" },
        ],
        questions: [
          {
            id: "e-1",
            stem: "Two equal charges repel with force F. If each charge is doubled and separation is also doubled, the new force is",
            options: { A: "F", B: "2F", C: "4F", D: "F/2" },
            answer: "A",
            explain: "F′ = k(2q)(2q)/(2r)² = 4kq² / 4r² = F.",
          },
          {
            id: "e-2",
            stem: "Electric field inside a uniformly charged thin spherical shell is",
            options: { A: "kq/R²", B: "kq/r²", C: "zero", D: "constant and non-zero" },
            answer: "C",
            explain: "By Gauss's law, flux through an interior Gaussian surface is zero, so E = 0.",
          },
          {
            id: "e-3",
            stem: "Work done in moving a charge between two points on an equipotential surface is",
            options: { A: "positive", B: "negative", C: "zero", D: "infinite" },
            answer: "C",
            explain: "ΔV = 0, so W = qΔV = 0.",
          },
          {
            id: "e-4",
            stem: "Potential at a point due to a dipole of moment p, on its axial line at distance r (r ≫ size) is",
            options: { A: "kp/r²", B: "kp/r³", C: "2kp/r²", D: "zero" },
            answer: "A",
            explain: "Axial potential V = kp/r². Axial field is 2kp/r³.",
          },
        ],
      },
    ],
  },
  {
    id: "mole",
    subject: "chem",
    title: "Some basic concepts",
    classLevel: "11",
    weight: "Foundation",
    topics: [
      {
        id: "mole-1",
        title: "Mole & stoichiometry",
        minutes: 16,
        blurb: "n = m/M, limiting reagent, and percent yield.",
        formulas: [
          { name: "Moles", expr: "n = m / M = N / Nₐ", note: "Nₐ = 6.022×10²³" },
          { name: "Molarity", expr: "M = n / V(L)", note: "temperature sensitive" },
        ],
        questions: [
          {
            id: "m-1",
            stem: "Number of moles in 11 g of CO₂ (M = 44) is",
            options: { A: "0.25", B: "0.5", C: "1", D: "4" },
            answer: "A",
            explain: "n = 11/44 = 0.25 mol.",
          },
          {
            id: "m-2",
            stem: "4 g of H₂ is mixed with 32 g of O₂ to form water (2H₂ + O₂ → 2H₂O). Which statement is correct?",
            options: {
              A: "H₂ is limiting",
              B: "O₂ is limiting",
              C: "They are in exact stoichiometric ratio",
              D: "No reaction occurs",
            },
            answer: "C",
            explain: "4 g H₂ = 2 mol. 32 g O₂ = 1 mol. The equation needs 2 mol H₂ per 1 mol O₂, so neither is in excess.",
          },
          {
            id: "m-3",
            stem: "Molarity of a solution containing 4 g NaOH in 500 mL water (NaOH = 40) is",
            options: { A: "0.1 M", B: "0.2 M", C: "0.4 M", D: "1 M" },
            answer: "B",
            explain: "n = 4/40 = 0.1 mol in 0.5 L ⇒ M = 0.2.",
          },
          {
            id: "m-4",
            stem: "1 mole of any gas at STP occupies approximately",
            options: { A: "1 L", B: "11.2 L", C: "22.4 L", D: "44.8 L" },
            answer: "C",
            explain: "Molar volume: 22.4 L at STP (0 °C, 1 atm) - the value exams want. The newer IUPAC STP (1 bar) gives 22.7 L.",
          },
        ],
      },
    ],
  },
  {
    id: "bonding",
    subject: "chem",
    title: "Chemical bonding",
    classLevel: "11",
    weight: "High yield",
    topics: [
      {
        id: "vsepr",
        title: "VSEPR & hybridisation",
        minutes: 20,
        blurb: "Shape from electron pairs, not just bonds.",
        formulas: [
          { name: "Steric number", expr: "SN = σ bonds + lone pairs", note: "on central atom" },
        ],
        questions: [
          {
            id: "b-1",
            stem: "Shape of NH₃ is",
            options: { A: "trigonal planar", B: "tetrahedral", C: "trigonal pyramidal", D: "bent" },
            answer: "C",
            explain: "SN = 4 (3 bonds + 1 lone pair). Geometry tetrahedral, shape pyramidal.",
          },
          {
            id: "b-2",
            stem: "Hybridisation of carbon in C₂H₄ is",
            options: { A: "sp", B: "sp²", C: "sp³", D: "sp³d" },
            answer: "B",
            explain: "Each carbon forms 3 σ bonds (two C-H, one C-C) and one π bond. SN = 3 → sp².",
          },
          {
            id: "b-3",
            stem: "Which molecule is linear?",
            options: { A: "H₂O", B: "SO₂", C: "BeCl₂", D: "NH₃" },
            answer: "C",
            explain: "BeCl₂ has SN = 2, no lone pair on Be → linear. SO₂ is bent.",
          },
          {
            id: "b-4",
            stem: "Bond order of O₂ is",
            options: { A: "1", B: "1.5", C: "2", D: "3" },
            answer: "C",
            explain: "MO: (σ2s)²(σ*2s)²(σ2p)²(π2p)⁴(π*2p)². Bond order = (8-4)/2 = 2. It is paramagnetic.",
          },
        ],
      },
    ],
  },
  {
    id: "organic",
    subject: "chem",
    title: "General organic chemistry",
    classLevel: "11",
    weight: "High yield",
    topics: [
      {
        id: "goc-effects",
        title: "Electronic effects",
        minutes: 22,
        blurb: "Inductive, resonance, and which wins in acidity.",
        formulas: [
          { name: "Acidity trend", expr: "stronger acid ⇔ weaker conjugate base", note: "compare stability" },
        ],
        questions: [
          {
            id: "o-1",
            stem: "The most acidic compound among the following is",
            options: { A: "CH₄", B: "NH₃", C: "H₂O", D: "HF" },
            answer: "D",
            explain: "Across the period, acidity of hydrides increases: CH₄ < NH₃ < H₂O < HF.",
          },
          {
            id: "o-2",
            stem: "-NO₂ group on benzene is",
            options: {
              A: "ortho-para directing, activating",
              B: "meta directing, deactivating",
              C: "ortho-para directing, deactivating",
              D: "meta directing, activating",
            },
            answer: "B",
            explain: "Nitro is strongly electron withdrawing by -R and -I, deactivates, and directs meta.",
          },
          {
            id: "o-3",
            stem: "Hyperconjugation is also called",
            options: {
              A: "no-bond resonance",
              B: "inductive effect",
              C: "electromeric effect",
              D: "steric effect",
            },
            answer: "A",
            explain: "Baker-Nathan effect: delocalisation of σ electrons of C-H adjacent to an unsaturated system - 'no-bond resonance'.",
          },
          {
            id: "o-4",
            stem: "Which carbocation is most stable?",
            options: {
              A: "CH₃⁺",
              B: "(CH₃)₃C⁺",
              C: "CH₃CH₂⁺",
              D: "(CH₃)₂CH⁺",
            },
            answer: "B",
            explain: "Tertiary > secondary > primary > methyl, due to +I and hyperconjugation.",
          },
        ],
      },
    ],
  },
  {
    id: "quadratic",
    subject: "math",
    title: "Quadratic equations",
    classLevel: "11",
    weight: "Core",
    topics: [
      {
        id: "quad-roots",
        title: "Nature of roots",
        minutes: 16,
        blurb: "Discriminant, sum and product, and location of roots.",
        formulas: [
          { name: "D", expr: "D = b² - 4ac", note: "D > 0 distinct real" },
          { name: "Sum / product", expr: "α+β = -b/a, αβ = c/a", note: "for ax²+bx+c" },
        ],
        questions: [
          {
            id: "q-1",
            stem: "Roots of x² - 5x + 6 = 0 are",
            options: { A: "2, 3", B: "-2, -3", C: "1, 6", D: "-1, 6" },
            answer: "A",
            explain: "(x-2)(x-3) = 0.",
          },
          {
            id: "q-2",
            stem: "For real roots of x² + 2x + k = 0, k must satisfy",
            options: { A: "k > 1", B: "k < 1", C: "k ≤ 1", D: "k ≥ 1" },
            answer: "C",
            explain: "D = 4 - 4k ≥ 0 ⇒ k ≤ 1.",
          },
          {
            id: "q-3",
            stem: "If α, β are roots of x² - 7x + 10 = 0, then α² + β² equals",
            options: { A: "29", B: "49", C: "39", D: "19" },
            answer: "A",
            explain: "α+β = 7, αβ = 10. α²+β² = (α+β)² - 2αβ = 49 - 20 = 29.",
          },
          {
            id: "q-4",
            stem: "Both roots of ax² + bx + c = 0 are positive if",
            options: {
              A: "D ≥ 0, a and c same sign, -b/a > 0",
              B: "D < 0 only",
              C: "sum negative and product positive",
              D: "a = 0",
            },
            answer: "A",
            explain: "Need D ≥ 0, product c/a > 0 (same sign of a,c), and sum -b/a > 0.",
          },
        ],
      },
    ],
  },
  {
    id: "calculus",
    subject: "math",
    title: "Limits & derivatives",
    classLevel: "12",
    weight: "High yield",
    topics: [
      {
        id: "limits",
        title: "Standard limits",
        minutes: 18,
        blurb: "sin x / x, (1+x)^(1/x), and when you may not cancel.",
        formulas: [
          { name: "sin", expr: "lim x→0 sin x / x = 1", note: "x in radians" },
          { name: "e", expr: "lim x→0 (1+x)^(1/x) = e", note: "also (1+1/n)^n" },
        ],
        questions: [
          {
            id: "l-1",
            stem: "lim (x→0) (sin 3x) / x equals",
            options: { A: "1", B: "3", C: "0", D: "1/3" },
            answer: "B",
            explain: "sin 3x / x = 3 · (sin 3x)/(3x) → 3×1.",
          },
          {
            id: "l-2",
            stem: "lim (x→0) (1 - cos x) / x² equals",
            options: { A: "0", B: "1", C: "1/2", D: "2" },
            answer: "C",
            explain: "1 - cos x = 2 sin²(x/2), so ratio → 2 · (1/4) = 1/2.",
          },
          {
            id: "l-3",
            stem: "Derivative of sin x at x = 0 is",
            options: { A: "0", B: "1", C: "-1", D: "undefined" },
            answer: "B",
            explain: "d/dx sin x = cos x, and cos 0 = 1.",
          },
          {
            id: "l-4",
            stem: "d/dx (x³) equals",
            options: { A: "3x", B: "x²", C: "3x²", D: "3x³" },
            answer: "C",
            explain: "Power rule: n x^(n-1) with n = 3.",
          },
        ],
      },
      {
        id: "integ",
        title: "Indefinite integrals",
        minutes: 18,
        blurb: "Reverse of differentiation, plus the constant you always forget.",
        formulas: [
          { name: "Power", expr: "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C", note: "n ≠ -1" },
          { name: "1/x", expr: "∫ dx/x = ln|x| + C", note: "absolute value" },
        ],
        questions: [
          {
            id: "i-1",
            stem: "∫ 2x dx equals",
            options: { A: "x² + C", B: "2x² + C", C: "x + C", D: "2 + C" },
            answer: "A",
            explain: "∫ 2x dx = x² + C.",
          },
          {
            id: "i-2",
            stem: "∫ sec²x dx equals",
            options: { A: "tan x + C", B: "sec x + C", C: "cot x + C", D: "sin x + C" },
            answer: "A",
            explain: "Derivative of tan x is sec²x.",
          },
          {
            id: "i-3",
            stem: "∫₀¹ x dx equals",
            options: { A: "1", B: "1/2", C: "0", D: "2" },
            answer: "B",
            explain: "[x²/2] from 0 to 1 = 1/2.",
          },
          {
            id: "i-4",
            stem: "∫ eˣ dx equals",
            options: { A: "eˣ + C", B: "xeˣ + C", C: "eˣ / x + C", D: "ln x + C" },
            answer: "A",
            explain: "Exponential is its own integral (up to +C).",
          },
        ],
      },
    ],
  },
  {
    id: "probability",
    subject: "math",
    title: "Probability",
    classLevel: "12",
    weight: "Scoring",
    topics: [
      {
        id: "prob-basic",
        title: "Classical probability",
        minutes: 16,
        blurb: "Equally likely outcomes, and the complement trick.",
        formulas: [
          { name: "Classical", expr: "P(A) = n(A)/n(S)", note: "equally likely" },
          { name: "Complement", expr: "P(A′) = 1 - P(A)", note: "often faster" },
        ],
        questions: [
          {
            id: "p-1",
            stem: "A fair die is rolled. Probability of a prime number is",
            options: { A: "1/2", B: "1/3", C: "1/6", D: "2/3" },
            answer: "A",
            explain: "Primes on a die: 2, 3, 5. So 3/6 = 1/2. (1 is not prime.)",
          },
          {
            id: "p-2",
            stem: "Two coins are tossed. Probability of at least one head is",
            options: { A: "1/4", B: "1/2", C: "3/4", D: "1" },
            answer: "C",
            explain: "Outcomes HH, HT, TH, TT. At least one H: 3 of 4.",
          },
          {
            id: "p-3",
            stem: "If P(A) = 0.3 and A, B are mutually exclusive with P(B) = 0.4, then P(A ∪ B) is",
            options: { A: "0.12", B: "0.7", C: "0.1", D: "1" },
            answer: "B",
            explain: "Mutually exclusive ⇒ P(A ∪ B) = P(A)+P(B) = 0.7.",
          },
          {
            id: "p-4",
            stem: "A bag has 3 red and 2 blue balls. Probability of drawing a blue ball is",
            options: { A: "3/5", B: "2/5", C: "1/2", D: "2/3" },
            answer: "B",
            explain: "2 blue out of 5.",
          },
        ],
      },
    ],
  },
];

export function allTopics() {
  return chapters.flatMap((c) => c.topics.map((t) => ({ chapter: c, topic: t })));
}

export function findTopic(topicId: string) {
  for (const chapter of chapters) {
    const topic = chapter.topics.find((t) => t.id === topicId);
    if (topic) return { chapter, topic };
  }
  return null;
}

export function allQuestions() {
  return allTopics().flatMap(({ chapter, topic }) =>
    topic.questions.map((q) => ({ chapter, topic, q })),
  );
}

export function allFormulas() {
  return allTopics().flatMap(({ chapter, topic }) =>
    topic.formulas.map((f) => ({ chapter, topic, f })),
  );
}

export function lessonFor(topicId: string) {
  const found = findTopic(topicId);
  if (!found) return null;
  const { chapter, topic } = found;
  const example = topic.questions[0];
  return {
    chapter,
    topic,
    steps: [
      {
        k: "idea",
        title: "The idea",
        body: topic.blurb + " Read it once, then say it back in one sentence before you touch a question.",
      },
      {
        k: "tools",
        title: "Tools you will use",
        body: topic.formulas.map((f) => `${f.name}: ${f.expr} - ${f.note}`).join("\n"),
      },
      {
        k: "worked",
        title: "A worked check",
        body: example
          ? `${example.stem}\n\nAnswer ${example.answer}. ${example.explain}`
          : "No worked example on this topic yet.",
      },
    ],
  };
}

