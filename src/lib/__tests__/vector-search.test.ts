import { describe, it, expect } from "vitest";
import { cosineSimilarity } from "@/lib/rag/vector-search";

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    const v = [1, 2, 3, 4, 5];
    expect(cosineSimilarity(v, v)).toBeCloseTo(1, 10);
  });

  it("returns -1 for opposite vectors", () => {
    const a = [1, 0, 0];
    const b = [-1, 0, 0];
    expect(cosineSimilarity(a, b)).toBeCloseTo(-1, 10);
  });

  it("returns 0 for orthogonal vectors", () => {
    const a = [1, 0, 0];
    const b = [0, 1, 0];
    expect(cosineSimilarity(a, b)).toBeCloseTo(0, 10);
  });

  it("handles high-dimensional embedding vectors", () => {
    const a = Array.from({ length: 768 }, (_, i) => Math.sin(i));
    const b = Array.from({ length: 768 }, (_, i) => Math.sin(i + 0.1));
    const sim = cosineSimilarity(a, b);
    expect(sim).toBeGreaterThan(0.95);
    expect(sim).toBeLessThanOrEqual(1);
  });

  it("is commutative", () => {
    const a = [1, 2, 3];
    const b = [4, 5, 6];
    expect(cosineSimilarity(a, b)).toBeCloseTo(cosineSimilarity(b, a), 10);
  });

  it("is magnitude-invariant", () => {
    const a = [1, 2, 3];
    const b = [2, 4, 6];
    expect(cosineSimilarity(a, b)).toBeCloseTo(1, 10);
  });

  it("returns 0 for zero vector (guarded against NaN)", () => {
    const zero = [0, 0, 0];
    const normal = [1, 2, 3];
    const result = cosineSimilarity(zero, normal);
    expect(result).toBe(0);
    expect(Number.isNaN(result)).toBe(false);
  });

  it("returns 0 when both vectors are zero", () => {
    const zero = [0, 0, 0];
    const result = cosineSimilarity(zero, zero);
    expect(result).toBe(0);
    expect(Number.isNaN(result)).toBe(false);
  });

  it("handles very small values without overflow to zero", () => {
    const a = [1e-10, 2e-10, 3e-10];
    const b = [4e-10, 5e-10, 6e-10];
    const sim = cosineSimilarity(a, b);
    expect(Number.isNaN(sim)).toBe(false);
    expect(sim).toBeGreaterThan(0.9);
  });
});
