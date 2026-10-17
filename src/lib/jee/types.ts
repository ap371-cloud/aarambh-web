export type SubjectId = "phy" | "chem" | "math";

export type OptionId = "A" | "B" | "C" | "D";

export type Question = {
  id: string;
  stem: string;
  options: Record<OptionId, string>;
  answer: OptionId;
  explain: string;
};

export type Topic = {
  id: string;
  title: string;
  minutes: number;
  blurb: string;
  formulas: { name: string; expr: string; note: string }[];
  questions: Question[];
};

export type Chapter = {
  id: string;
  subject: SubjectId;
  title: string;
  classLevel: "11" | "12";
  weight: string;
  topics: Topic[];
};

export type Attempt = {
  qid: string;
  picked: OptionId | null;
  correct: boolean;
  at: number;
};
