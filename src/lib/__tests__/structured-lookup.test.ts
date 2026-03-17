import { describe, it, expect } from "vitest";
import { matchCountryToFTAs, isHSCodeApplicable } from "@/lib/rag/structured-lookup";

describe("matchCountryToFTAs", () => {
  it("matches ASEAN countries to AIFTA", () => {
    expect(matchCountryToFTAs("Vietnam")).toEqual(["AIFTA"]);
    expect(matchCountryToFTAs("Thailand")).toEqual(["AIFTA"]);
    expect(matchCountryToFTAs("Singapore")).toEqual(["AIFTA"]);
    expect(matchCountryToFTAs("Indonesia")).toEqual(["AIFTA"]);
  });

  it("matches UAE to CEPA-UAE", () => {
    expect(matchCountryToFTAs("United Arab Emirates")).toEqual(["CEPA-UAE"]);
    expect(matchCountryToFTAs("UAE")).toEqual(["CEPA-UAE"]);
  });

  it("matches Australia to ECTA-AUS", () => {
    expect(matchCountryToFTAs("Australia")).toEqual(["ECTA-AUS"]);
  });

  it("matches South Korea to CEPA-KOR", () => {
    expect(matchCountryToFTAs("South Korea")).toContain("CEPA-KOR");
  });

  it("matches Japan to CEPA-JPN", () => {
    expect(matchCountryToFTAs("Japan")).toEqual(["CEPA-JPN"]);
  });

  it("matches SAARC countries to SAFTA", () => {
    expect(matchCountryToFTAs("Bangladesh")).toEqual(["SAFTA"]);
    expect(matchCountryToFTAs("Sri Lanka")).toEqual(["SAFTA"]);
    expect(matchCountryToFTAs("Nepal")).toEqual(["SAFTA"]);
  });

  it("matches UK variations to CEPA-UK", () => {
    expect(matchCountryToFTAs("United Kingdom")).toEqual(["CEPA-UK"]);
    expect(matchCountryToFTAs("UK")).toEqual(["CEPA-UK"]);
    expect(matchCountryToFTAs("Great Britain")).toEqual(["CEPA-UK"]);
  });

  it("matches New Zealand to FTA-NZ", () => {
    expect(matchCountryToFTAs("New Zealand")).toEqual(["FTA-NZ"]);
    expect(matchCountryToFTAs("NZ")).toEqual(["FTA-NZ"]);
  });

  it("matches Mauritius to CECPA-MUS", () => {
    expect(matchCountryToFTAs("Mauritius")).toEqual(["CECPA-MUS"]);
  });

  it("returns empty for non-FTA countries", () => {
    expect(matchCountryToFTAs("China")).toEqual([]);
    expect(matchCountryToFTAs("United States")).toEqual([]);
    expect(matchCountryToFTAs("Germany")).toEqual([]);
    expect(matchCountryToFTAs("Russia")).toEqual([]);
  });

  it("is case insensitive", () => {
    expect(matchCountryToFTAs("VIETNAM")).toEqual(["AIFTA"]);
    expect(matchCountryToFTAs("japan")).toEqual(["CEPA-JPN"]);
    expect(matchCountryToFTAs("australia")).toEqual(["ECTA-AUS"]);
  });

  it("uses substring matching for compound names", () => {
    expect(matchCountryToFTAs("South Korea")).toContain("CEPA-KOR");
  });
});

describe("isHSCodeApplicable", () => {
  it("parses valid JSON array and matches code", () => {
    expect(isHSCodeApplicable('["0409.00", "2106.90"]', "0409.00")).toBe(true);
  });

  it("returns false for non-matching code", () => {
    expect(isHSCodeApplicable('["0409.00", "2106.90"]', "8471.30")).toBe(false);
  });

  it("returns false for malformed JSON", () => {
    expect(isHSCodeApplicable("not json", "0409.00")).toBe(false);
    expect(isHSCodeApplicable("", "0409.00")).toBe(false);
    expect(isHSCodeApplicable("{}", "0409.00")).toBe(false);
  });

  it("handles empty array", () => {
    expect(isHSCodeApplicable("[]", "0409.00")).toBe(false);
  });

  it("requires exact code match (no prefix matching)", () => {
    expect(isHSCodeApplicable('["0409.00"]', "0409")).toBe(false);
    expect(isHSCodeApplicable('["0409.00"]', "0409.001")).toBe(false);
  });
});
