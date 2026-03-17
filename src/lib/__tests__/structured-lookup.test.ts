import { describe, it, expect } from "vitest";

// Test the FTA country matching logic from structured-lookup.ts:19-29
// This is extracted because the actual function requires a live DB connection.
const FTA_MEMBER_COUNTRIES: Record<string, string[]> = {
  AIFTA: ["brunei", "cambodia", "indonesia", "laos", "malaysia", "myanmar", "philippines", "singapore", "thailand", "vietnam"],
  "CEPA-UAE": ["united arab emirates", "uae"],
  "ECTA-AUS": ["australia"],
  "CEPA-KOR": ["south korea", "korea"],
  "CEPA-JPN": ["japan"],
  SAFTA: ["afghanistan", "bangladesh", "bhutan", "maldives", "nepal", "pakistan", "sri lanka"],
  "CEPA-UK": ["united kingdom", "uk", "great britain", "england", "scotland", "wales", "northern ireland"],
  "FTA-NZ": ["new zealand", "nz"],
  "CECPA-MUS": ["mauritius"],
};

function matchCountryToFTA(originCountry: string): string[] {
  const country = originCountry.toLowerCase();
  return Object.entries(FTA_MEMBER_COUNTRIES)
    .filter(([, members]) =>
      members.some((m) => m === country || country.includes(m))
    )
    .map(([code]) => code);
}

// Test JSON parsing logic from structured-lookup.ts:104-109
function parseApplicableCodes(json: string, hsCode: string): boolean {
  try {
    const applicableCodes: string[] = JSON.parse(json);
    return applicableCodes.includes(hsCode);
  } catch {
    return false;
  }
}

describe("FTA country matching", () => {
  it("matches ASEAN countries to AIFTA", () => {
    expect(matchCountryToFTA("Vietnam")).toEqual(["AIFTA"]);
    expect(matchCountryToFTA("Thailand")).toEqual(["AIFTA"]);
    expect(matchCountryToFTA("Singapore")).toEqual(["AIFTA"]);
    expect(matchCountryToFTA("Indonesia")).toEqual(["AIFTA"]);
  });

  it("matches UAE to CEPA-UAE", () => {
    expect(matchCountryToFTA("United Arab Emirates")).toEqual(["CEPA-UAE"]);
    expect(matchCountryToFTA("UAE")).toEqual(["CEPA-UAE"]);
  });

  it("matches Australia to ECTA-AUS", () => {
    expect(matchCountryToFTA("Australia")).toEqual(["ECTA-AUS"]);
  });

  it("matches South Korea to CEPA-KOR", () => {
    const result = matchCountryToFTA("South Korea");
    expect(result).toContain("CEPA-KOR");
  });

  it("matches Japan to CEPA-JPN", () => {
    expect(matchCountryToFTA("Japan")).toEqual(["CEPA-JPN"]);
  });

  it("matches SAARC countries to SAFTA", () => {
    expect(matchCountryToFTA("Bangladesh")).toEqual(["SAFTA"]);
    expect(matchCountryToFTA("Sri Lanka")).toEqual(["SAFTA"]);
    expect(matchCountryToFTA("Nepal")).toEqual(["SAFTA"]);
  });

  it("matches UK variations to CEPA-UK", () => {
    expect(matchCountryToFTA("United Kingdom")).toEqual(["CEPA-UK"]);
    expect(matchCountryToFTA("UK")).toEqual(["CEPA-UK"]);
    expect(matchCountryToFTA("Great Britain")).toEqual(["CEPA-UK"]);
  });

  it("matches New Zealand to FTA-NZ", () => {
    expect(matchCountryToFTA("New Zealand")).toEqual(["FTA-NZ"]);
    expect(matchCountryToFTA("NZ")).toEqual(["FTA-NZ"]);
  });

  it("matches Mauritius to CECPA-MUS", () => {
    expect(matchCountryToFTA("Mauritius")).toEqual(["CECPA-MUS"]);
  });

  it("returns empty for non-FTA countries", () => {
    expect(matchCountryToFTA("China")).toEqual([]);
    expect(matchCountryToFTA("United States")).toEqual([]);
    expect(matchCountryToFTA("Germany")).toEqual([]);
    expect(matchCountryToFTA("Russia")).toEqual([]);
  });

  it("is case insensitive", () => {
    expect(matchCountryToFTA("VIETNAM")).toEqual(["AIFTA"]);
    expect(matchCountryToFTA("japan")).toEqual(["CEPA-JPN"]);
    expect(matchCountryToFTA("australia")).toEqual(["ECTA-AUS"]);
  });

  it("uses substring matching (includes check)", () => {
    // "South Korea" includes "korea" → matches CEPA-KOR
    const result = matchCountryToFTA("South Korea");
    expect(result).toContain("CEPA-KOR");
  });
});

describe("certification HS code JSON parsing", () => {
  it("parses valid JSON array and matches code", () => {
    expect(parseApplicableCodes('["0409.00", "2106.90"]', "0409.00")).toBe(true);
  });

  it("returns false for non-matching code", () => {
    expect(parseApplicableCodes('["0409.00", "2106.90"]', "8471.30")).toBe(false);
  });

  it("returns false for malformed JSON", () => {
    expect(parseApplicableCodes("not json", "0409.00")).toBe(false);
    expect(parseApplicableCodes("", "0409.00")).toBe(false);
    expect(parseApplicableCodes("{}", "0409.00")).toBe(false);
  });

  it("handles empty array", () => {
    expect(parseApplicableCodes("[]", "0409.00")).toBe(false);
  });

  it("requires exact code match (no prefix matching)", () => {
    expect(parseApplicableCodes('["0409.00"]', "0409")).toBe(false);
    expect(parseApplicableCodes('["0409.00"]', "0409.001")).toBe(false);
  });
});
