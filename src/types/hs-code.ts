export interface HSCode {
  code: string;
  description: string;
  chapter: string;
  heading: string;
  unit: string;
}

export interface HSCodeWithEmbedding extends HSCode {
  embedding: number[];
}

export interface HSCodeCandidate {
  code: string;
  description: string;
  similarity: number;
}

export interface ClassificationResult {
  hsCode: string;
  description: string;
  confidence: number;
  candidates: HSCodeCandidate[];
  needsUserSelection: boolean;
}
