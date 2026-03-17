#!/usr/bin/env python3
"""Generate a well-formatted PDF for the Tool 1 summary."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm, inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import os

OUTPUT = os.path.join(os.path.dirname(__file__), "Tool1-Import-Navigator-Summary.pdf")

ORANGE = HexColor("#ea580c")
DARK = HexColor("#1a1a1a")
GRAY = HexColor("#6b7280")
LIGHT_BG = HexColor("#fff7ed")
WHITE = HexColor("#ffffff")
BORDER = HexColor("#e5e7eb")

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    topMargin=20 * mm,
    bottomMargin=20 * mm,
    leftMargin=22 * mm,
    rightMargin=22 * mm,
)

styles = getSampleStyleSheet()

s_title = ParagraphStyle("Title2", parent=styles["Title"], fontSize=20, textColor=ORANGE,
                         spaceAfter=2, alignment=TA_LEFT, fontName="Helvetica-Bold")
s_subtitle = ParagraphStyle("Sub", parent=styles["Normal"], fontSize=10, textColor=GRAY,
                            spaceAfter=6)
s_h1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=14, textColor=DARK,
                       spaceBefore=16, spaceAfter=6, fontName="Helvetica-Bold")
s_h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=11, textColor=DARK,
                       spaceBefore=10, spaceAfter=4, fontName="Helvetica-Bold")
s_body = ParagraphStyle("Body", parent=styles["Normal"], fontSize=9.5, leading=13.5,
                         textColor=DARK, spaceAfter=4)
s_bullet = ParagraphStyle("Bullet", parent=s_body, leftIndent=14, bulletIndent=4,
                           spaceBefore=1, spaceAfter=1)
s_mono = ParagraphStyle("Mono", parent=s_body, fontName="Courier", fontSize=8,
                         leading=11, leftIndent=10, textColor=HexColor("#374151"))
s_small = ParagraphStyle("Small", parent=s_body, fontSize=8, textColor=GRAY, spaceBefore=12)
s_disclaimer = ParagraphStyle("Disc", parent=s_body, fontSize=8, textColor=GRAY,
                               spaceBefore=8, spaceAfter=0, leading=11)

def hr():
    return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceBefore=6, spaceAfter=6)

def table(headers, rows, col_widths=None):
    data = [headers] + rows
    w = col_widths or [doc.width / len(headers)] * len(headers)
    t = Table(data, colWidths=w, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), ORANGE),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("FONTSIZE", (0, 1), (-1, -1), 8.5),
        ("LEADING", (0, 0), (-1, -1), 12),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 1), (-1, -1), WHITE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
        ("GRID", (0, 0), (-1, -1), 0.4, BORDER),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t

story = []

# Title
story.append(Paragraph("Import Compliance Navigator", s_title))
story.append(Paragraph("Tool 1 — Status Summary  |  AccessIndia.ai  |  accessindia.vercel.app/import-navigator", s_subtitle))
story.append(hr())

# What It Does
story.append(Paragraph("What It Does", s_h1))
story.append(Paragraph(
    "A user describes a product they want to import into India (e.g., <i>\"cotton shirts from Bangladesh, USD 10,000\"</i>). "
    "The tool returns a complete compliance report:", s_body))
for item in [
    "<b>HS Code classification</b> — identifies the correct customs tariff code",
    "<b>Duty breakdown</b> — BCD, AIDC, SWS, IGST, Compensation Cess, with total landed cost in INR",
    "<b>FTA options</b> — preferential rates under SAFTA, ASEAN-India, CEPA, etc., with rupee savings",
    "<b>Certifications required</b> — BIS, FSSAI, WPC, CDSCO, etc., with pre-shipment flags",
    "<b>DGFT licensing status</b> — freely importable, restricted, or prohibited",
    "<b>Anti-dumping duties</b> — country-specific surcharges where applicable",
    "<b>Step-by-step import process</b> — 10-step workflow from PAN registration to customs clearance",
]:
    story.append(Paragraph(f"\u2022  {item}", s_bullet))

story.append(Spacer(1, 4))
story.append(Paragraph("Reports are saved and shareable via a unique URL.", s_body))

# Architecture
story.append(hr())
story.append(Paragraph("How It Works", s_h1))
story.append(Paragraph(
    "<b>Key design principle:</b> All duty rates, FTA rates, certification rules, and licensing classifications come from "
    "<b>structured data files</b> — not from AI memory. AI is used <b>only</b> for (a) selecting the best HS code match from "
    "database candidates, and (b) writing a plain-English risk summary from the structured data.", s_body))

story.append(Spacer(1, 4))
for step, desc, source in [
    ("Stage 1", "HS Code Classification", "AI narrows from database candidates (not open-ended)"),
    ("Stage 2", "Database Lookups — duties, FTAs, certs, DGFT", "All numbers from structured data files"),
    ("Stage 3", "Duty Calculation", "Pure math in code — zero AI involved"),
    ("Stage 4", "Risk Summary & Regulatory Notes", "AI narrative grounded in the structured data above"),
]:
    story.append(Paragraph(f"\u2022  <b>{step}:</b> {desc} — <i>{source}</i>", s_bullet))

# Data Sources
story.append(hr())
story.append(Paragraph("Data Currently Loaded", s_h1))
story.append(table(
    ["Data", "Entries", "Source Basis"],
    [
        ["HS Codes (product tariff lines)", "84", "CBIC Customs Tariff"],
        ["Duty Rates (BCD, AIDC, SWS, IGST)", "84", "CBIC notifications"],
        ["FTA Preferential Rates", "29", "SAFTA, ASEAN-India, CEPA (UAE, Korea, Japan, Australia)"],
        ["Anti-Dumping Duties", "20", "DGTR notifications (China, Vietnam, S. Korea, etc.)"],
        ["Certification Bodies", "7", "BIS, FSSAI, WPC, CDSCO, PQ, BEE, PESO"],
        ["DGFT Licensing Rules", "84", "ITC-HS classifications"],
        ["Import Process Steps", "10", "Standard customs workflow"],
    ],
    col_widths=[doc.width * 0.38, doc.width * 0.12, doc.width * 0.50],
))
story.append(Spacer(1, 4))
story.append(Paragraph(
    "<b>Product categories covered:</b> Food &amp; agriculture, beverages, oils, chemicals, pharmaceuticals, plastics, "
    "rubber &amp; tires, textiles &amp; apparel, footwear, ceramics &amp; glass, jewellery, metals, machinery, electronics, "
    "vehicles, medical instruments, furniture, and toys — across 20+ HS chapters.", s_body))

# AI vs Non-AI
story.append(hr())
story.append(Paragraph("What AI Does and Does Not Do", s_h1))
story.append(table(
    ["Task", "Handled By"],
    [
        ["Duty rate lookup", "Database (no AI)"],
        ["Duty amount calculation", "Code formula (no AI)"],
        ["FTA savings calculation", "Code formula (no AI)"],
        ["Certification requirements", "Database (no AI)"],
        ["DGFT licensing status", "Database (no AI)"],
        ["Import process steps", "Database (no AI)"],
        ["HS code selection", "AI picks from database candidates (not open-ended)"],
        ["Risk summary & regulatory notes", "AI narrative (grounded in structured data)"],
    ],
    col_widths=[doc.width * 0.42, doc.width * 0.58],
))

# Limitations
story.append(hr())
story.append(Paragraph("Current Limitations", s_h1))
for num, title, desc in [
    ("1", "Static data, not live feeds.",
     "The 84 HS codes and associated rates are loaded from files, not pulled from government systems in real-time. "
     "Rate changes (e.g., Union Budget, CBIC notifications) require a manual data update."),
    ("2", "Limited product coverage.",
     "84 tariff lines across 20+ categories is a working sample, not the full Indian customs tariff (~12,000+ lines). "
     "Products outside this set will get a best-effort match but may not have exact duty rates."),
    ("3", "Fixed exchange rate.",
     "USD-to-INR conversion uses a hardcoded rate of \u20b983.50, not a live market rate."),
    ("4", "Risk summary uses AI narrative.",
     "While grounded in structured data, the plain-English risk summary is AI-generated text. "
     "It should be treated as guidance, not as a legal opinion."),
    ("5", "No integration with government portals.",
     "The tool does not connect to ICEGATE, DGFT, or any customs API. All data is self-contained."),
]:
    story.append(Paragraph(f"<b>{num}. {title}</b> {desc}", s_bullet))

# Next Steps
story.append(hr())
story.append(Paragraph("Recommended Next Steps", s_h1))
for item in [
    "Connect to live tariff data sources (CBIC / ICEGATE) for real-time rates",
    "Expand HS code coverage from 84 to 1,000+ high-volume tariff lines",
    "Add daily USD-INR exchange rate via RBI / market feed",
    "Implement data versioning with effective dates and notification references",
    "Add a \"last updated\" timestamp visible to users on every report",
]:
    story.append(Paragraph(f"\u2022  {item}", s_bullet))

# Footer
story.append(Spacer(1, 8))
story.append(HRFlowable(width="100%", thickness=0.3, color=GRAY, spaceBefore=4, spaceAfter=4))
story.append(Paragraph(
    "This document describes the state of Tool 1 as deployed. All duty calculations are formula-based and traceable. "
    "AI is used only where noted above.", s_disclaimer))

doc.build(story)
print(f"PDF saved to: {OUTPUT}")
