import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock modules before importing the module under test
vi.mock("@/lib/ai/embeddings", () => ({
  getEmbedding: vi.fn().mockResolvedValue(Array(768).fill(0.1)),
}));

vi.mock("@/lib/ai/gemini", () => ({
  generateJSON: vi.fn(),
}));

vi.mock("@/lib/rag/vector-search", () => ({
  getEmbeddingsLoaded: vi.fn(),
  searchHSCodes: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  getDB: vi.fn().mockReturnValue({
    prepare: vi.fn().mockReturnValue({
      all: vi.fn().mockReturnValue([]),
    }),
  }),
}));

import { classifyHSCode } from "@/lib/ai/classify-hs";
import { generateJSON } from "@/lib/ai/gemini";
import { getEmbeddingsLoaded, searchHSCodes } from "@/lib/rag/vector-search";

const mockGenerateJSON = vi.mocked(generateJSON);
const mockGetEmbeddingsLoaded = vi.mocked(getEmbeddingsLoaded);
const mockSearchHSCodes = vi.mocked(searchHSCodes);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("classifyHSCode", () => {
  it("uses vector search when embeddings are loaded", async () => {
    mockGetEmbeddingsLoaded.mockReturnValue(true);
    mockSearchHSCodes.mockReturnValue([
      { code: "0409.00", description: "Natural honey", similarity: 0.95 },
      { code: "0410.00", description: "Edible products of animal origin", similarity: 0.7 },
    ]);
    mockGenerateJSON.mockResolvedValue({
      selectedCode: "0409.00",
      confidence: 0.95,
      reasoning: "Natural honey matches exactly",
    });

    const result = await classifyHSCode("natural honey", "Australia");

    expect(mockGetEmbeddingsLoaded).toHaveBeenCalled();
    expect(mockSearchHSCodes).toHaveBeenCalled();
    expect(result.hsCode).toBe("0409.00");
    expect(result.description).toBe("Natural honey");
    expect(result.confidence).toBe(0.95);
    expect(result.needsUserSelection).toBe(false);
  });

  it("falls back to SQL LIKE when embeddings not loaded", async () => {
    const mockAll = vi.fn().mockReturnValue([
      { code: "8471.30", description: "Portable digital automatic data processing machines" },
    ]);
    const { getDB } = await import("@/lib/db/client");
    vi.mocked(getDB).mockReturnValue({
      prepare: vi.fn().mockReturnValue({ all: mockAll }),
    } as never);

    mockGetEmbeddingsLoaded.mockReturnValue(false);
    mockGenerateJSON.mockResolvedValue({
      selectedCode: "8471.30",
      confidence: 0.85,
      reasoning: "Laptop matches portable data processing",
    });

    const result = await classifyHSCode("laptop computer", "China");

    expect(mockSearchHSCodes).not.toHaveBeenCalled();
    expect(result.hsCode).toBe("8471.30");
    expect(result.confidence).toBe(0.85);
    expect(result.needsUserSelection).toBe(false);
  });

  it("sets needsUserSelection when confidence < 0.7", async () => {
    mockGetEmbeddingsLoaded.mockReturnValue(true);
    mockSearchHSCodes.mockReturnValue([
      { code: "8471.30", description: "Portable machines", similarity: 0.5 },
      { code: "8471.41", description: "Other machines", similarity: 0.45 },
    ]);
    mockGenerateJSON.mockResolvedValue({
      selectedCode: "8471.30",
      confidence: 0.55,
      reasoning: "Uncertain match",
    });

    const result = await classifyHSCode("some ambiguous product");

    expect(result.needsUserSelection).toBe(true);
    expect(result.confidence).toBe(0.55);
  });

  it("returns empty result when no candidates found", async () => {
    mockGetEmbeddingsLoaded.mockReturnValue(true);
    mockSearchHSCodes.mockReturnValue([]);

    const result = await classifyHSCode("nonexistent product xyz");

    expect(result.hsCode).toBe("");
    expect(result.needsUserSelection).toBe(true);
    expect(result.candidates).toEqual([]);
    expect(mockGenerateJSON).not.toHaveBeenCalled();
  });

  it("returns top 5 candidates in result", async () => {
    mockGetEmbeddingsLoaded.mockReturnValue(true);
    const candidates = Array.from({ length: 10 }, (_, i) => ({
      code: `0409.0${i}`,
      description: `Product ${i}`,
      similarity: 0.9 - i * 0.05,
    }));
    mockSearchHSCodes.mockReturnValue(candidates);
    mockGenerateJSON.mockResolvedValue({
      selectedCode: "0409.00",
      confidence: 0.9,
      reasoning: "Best match",
    });

    const result = await classifyHSCode("honey");

    expect(result.candidates).toHaveLength(5);
    expect(result.candidates[0].code).toBe("0409.00");
    expect(result.candidates[4].code).toBe("0409.04");
  });

  it("handles Gemini selecting a code not in candidates", async () => {
    mockGetEmbeddingsLoaded.mockReturnValue(true);
    mockSearchHSCodes.mockReturnValue([
      { code: "0409.00", description: "Natural honey", similarity: 0.9 },
    ]);
    mockGenerateJSON.mockResolvedValue({
      selectedCode: "9999.99",
      confidence: 0.8,
      reasoning: "Hallucinated code",
    });

    const result = await classifyHSCode("some product");

    expect(result.hsCode).toBe("9999.99");
    expect(result.description).toBe(""); // Not found in candidates
  });
});
