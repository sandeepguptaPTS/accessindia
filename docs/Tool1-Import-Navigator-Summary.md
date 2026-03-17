# Import Compliance Navigator — Status Summary

**Tool:** Import Compliance Navigator (Tool 1 of AccessIndia.ai)
**Live URL:** https://accessindia.vercel.app/import-navigator

---

## What It Does

A user describes a product they want to import into India (e.g., "cotton shirts from Bangladesh, USD 10,000"). The tool returns a complete compliance report:

- **HS Code classification** — identifies the correct customs tariff code
- **Duty breakdown** — BCD, AIDC, SWS, IGST, Compensation Cess, with total landed cost in INR
- **Free Trade Agreement options** — preferential rates under SAFTA, ASEAN-India, CEPA, etc., with rupee savings
- **Certifications required** — BIS, FSSAI, WPC, CDSCO, etc., with pre-shipment flags
- **DGFT licensing status** — whether the product is freely importable, restricted, or prohibited
- **Anti-dumping duties** — country-specific surcharges where applicable
- **Step-by-step import process** — 10-step workflow from PAN registration to customs clearance

Reports are saved and shareable via a unique URL.

---

## How It Works (Architecture)

```
User Input
   ↓
┌──────────────────────────────────┐
│  Stage 1: HS Code Classification │  ← AI narrows from database candidates
│  (Vector search + AI selection)  │    (NOT from AI's general knowledge)
└──────────────┬───────────────────┘
               ↓
┌──────────────────────────────────┐
│  Stage 2: Database Lookups       │  ← All numbers come from structured
│  Duty rates, FTAs, certs, DGFT  │    data files, NOT from AI
└──────────────┬───────────────────┘
               ↓
┌──────────────────────────────────┐
│  Stage 3: Duty Calculation       │  ← Pure math in code, zero AI involved
│  (Deterministic, formula-based)  │
└──────────────┬───────────────────┘
               ↓
┌──────────────────────────────────┐
│  Stage 4: Risk Summary           │  ← AI synthesizes warnings from the
│  (AI-written narrative)          │    structured data above
└──────────────────────────────────┘
```

**Key design principle:** All duty rates, FTA rates, certification rules, and licensing classifications come from structured data files — not from AI memory. AI is used only for (a) selecting the best HS code match from database candidates, and (b) writing a plain-English risk summary from the structured data.

---

## Data Sources Currently Loaded

| Data | Entries | Source Basis |
|------|---------|--------------|
| HS Codes (product tariff lines) | 84 | CBIC Customs Tariff |
| Duty Rates (BCD, AIDC, SWS, IGST) | 84 | CBIC notifications |
| FTA Preferential Rates | 29 | SAFTA, ASEAN-India, CEPA (UAE, Korea, Japan, Australia) |
| Anti-Dumping Duties | 20 | DGTR notifications (China, Vietnam, S. Korea, etc.) |
| Certification Bodies | 7 | BIS, FSSAI, WPC, CDSCO, PQ, BEE, PESO |
| DGFT Licensing Rules | 84 | ITC-HS classifications |
| Import Process Steps | 10 | Standard customs workflow |

**Product categories covered:** Food & agriculture, beverages, oils, chemicals, pharmaceuticals, plastics, rubber & tires, textiles & apparel, footwear, ceramics & glass, jewellery, metals, machinery, electronics, vehicles, medical instruments, furniture, and toys — across 20+ HS chapters.

---

## What AI Does and Does Not Do

| Task | Handled By |
|------|-----------|
| Duty rate lookup | Database (no AI) |
| Duty amount calculation | Code formula (no AI) |
| FTA savings calculation | Code formula (no AI) |
| Certification requirements | Database (no AI) |
| DGFT licensing status | Database (no AI) |
| Import process steps | Database (no AI) |
| HS code selection | AI picks from database candidates (not open-ended) |
| Risk summary & regulatory notes | AI narrative (from structured data, not memory) |

---

## Current Limitations

1. **Static data, not live feeds.** The 84 HS codes and associated rates are loaded from files, not pulled from government systems in real-time. If CBIC publishes a new notification or the Union Budget changes a rate, the data must be manually updated.

2. **Limited product coverage.** 84 tariff lines across 20+ categories is a working sample, not the full Indian customs tariff (~12,000+ lines). Products outside this set will get a best-effort AI match but may not have exact duty rates.

3. **Fixed exchange rate.** USD-to-INR conversion uses a hardcoded rate of ₹83.50. This does not reflect daily market fluctuations.

4. **Risk summary uses AI narrative.** While grounded in the structured data above, the plain-English risk summary and regulatory notes are AI-generated text. They should be treated as guidance, not as a legal opinion.

5. **No user accounts or audit trail.** Reports are generated anonymously. There is no login, history, or change-tracking for regulatory updates.

6. **No integration with government portals.** The tool does not connect to ICEGATE, DGFT, or any customs API. All data is self-contained.

---

## Next Steps to Strengthen

- Connect to live tariff data sources (CBIC API / ICEGATE) for real-time rates
- Expand HS code coverage from 84 to 1,000+ high-volume tariff lines
- Add daily USD-INR exchange rate via RBI/market feed
- Implement data versioning with effective dates and notification references
- Add a "last updated" timestamp visible to users on every report

---

*This document describes the state of Tool 1 as deployed. All duty calculations are formula-based and traceable. AI is used only where noted above.*
