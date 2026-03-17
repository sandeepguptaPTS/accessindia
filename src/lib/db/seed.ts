import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return row;
  });
}

export function seedDatabase(db: Database.Database): void {
  const dataDir = path.join(process.cwd(), "data");

  // Check if already seeded
  const count = db.prepare("SELECT COUNT(*) as c FROM hs_codes").get() as {
    c: number;
  };
  if (count.c > 0) return;

  console.log("Seeding database...");

  // Seed HS codes
  const hsCodes = parseCSV(
    fs.readFileSync(path.join(dataDir, "hs-codes.csv"), "utf-8")
  );
  const insertHS = db.prepare(
    "INSERT OR IGNORE INTO hs_codes (code, description, chapter, heading, unit) VALUES (?, ?, ?, ?, ?)"
  );
  for (const row of hsCodes) {
    insertHS.run(row.code, row.description, row.chapter, row.heading, row.unit);
  }
  console.log(`  Seeded ${hsCodes.length} HS codes`);

  // Seed duty rates
  const dutyRates = parseCSV(
    fs.readFileSync(path.join(dataDir, "duty-rates.csv"), "utf-8")
  );
  const insertDuty = db.prepare(
    "INSERT OR IGNORE INTO duty_rates (hs_code, bcd_rate, aidc_rate, sws_rate, igst_rate, compensation_cess_rate, effective_from, notification_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  for (const row of dutyRates) {
    insertDuty.run(
      row.hs_code,
      parseFloat(row.bcd_rate),
      parseFloat(row.aidc_rate),
      parseFloat(row.sws_rate),
      parseFloat(row.igst_rate),
      parseFloat(row.compensation_cess_rate),
      row.effective_from,
      row.notification_no
    );
  }
  console.log(`  Seeded ${dutyRates.length} duty rates`);

  // Seed FTA rates
  const ftaRates = parseCSV(
    fs.readFileSync(path.join(dataDir, "fta-rates.csv"), "utf-8")
  );
  const insertFTA = db.prepare(
    "INSERT OR IGNORE INTO fta_rates (hs_code, agreement_code, agreement_name, preferential_bcd_rate, rules_of_origin) VALUES (?, ?, ?, ?, ?)"
  );
  for (const row of ftaRates) {
    insertFTA.run(
      row.hs_code,
      row.agreement_code,
      row.agreement_name,
      parseFloat(row.preferential_bcd_rate),
      row.rules_of_origin
    );
  }
  console.log(`  Seeded ${ftaRates.length} FTA rates`);

  // Seed certifications
  const certifications = JSON.parse(
    fs.readFileSync(path.join(dataDir, "certifications.json"), "utf-8")
  );
  const insertCert = db.prepare(
    "INSERT INTO certifications (body, name, applicable_hs_codes, is_mandatory, pre_shipment_required, risk_if_missing, process_summary) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  for (const cert of certifications) {
    insertCert.run(
      cert.body,
      cert.name,
      JSON.stringify(cert.applicable_hs_codes),
      cert.is_mandatory ? 1 : 0,
      cert.pre_shipment_required ? 1 : 0,
      cert.risk_if_missing,
      cert.process_summary
    );
  }
  console.log(`  Seeded ${certifications.length} certifications`);

  // Seed DGFT licensing
  const dgft = parseCSV(
    fs.readFileSync(path.join(dataDir, "dgft-licensing.csv"), "utf-8")
  );
  const insertDGFT = db.prepare(
    "INSERT OR IGNORE INTO dgft_licensing (hs_code, classification, scomet_listed, epr_required, moef_permission) VALUES (?, ?, ?, ?, ?)"
  );
  for (const row of dgft) {
    insertDGFT.run(
      row.hs_code,
      row.classification,
      parseInt(row.scomet_listed),
      parseInt(row.epr_required),
      parseInt(row.moef_permission)
    );
  }
  console.log(`  Seeded ${dgft.length} DGFT licensing entries`);

  // Seed anti-dumping duties
  const antiDumpingFile = path.join(dataDir, "anti-dumping-duties.csv");
  if (fs.existsSync(antiDumpingFile)) {
    const antiDumping = parseCSV(fs.readFileSync(antiDumpingFile, "utf-8"));
    const insertAD = db.prepare(
      "INSERT INTO anti_dumping_duties (hs_code, origin_country, duty_type, duty_amount, notification_no) VALUES (?, ?, ?, ?, ?)"
    );
    for (const row of antiDumping) {
      insertAD.run(
        row.hs_code,
        row.origin_country,
        row.duty_type,
        parseFloat(row.duty_amount),
        row.notification_no
      );
    }
    console.log(`  Seeded ${antiDumping.length} anti-dumping duties`);
  }

  // Seed process steps
  const processSteps = JSON.parse(
    fs.readFileSync(path.join(dataDir, "process-steps.json"), "utf-8")
  );
  const insertStep = db.prepare(
    "INSERT OR IGNORE INTO process_steps (step_code, name, description, is_mandatory, prerequisites, timeline, documents_required, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  for (const step of processSteps) {
    insertStep.run(
      step.step_code,
      step.name,
      step.description,
      step.is_mandatory ? 1 : 0,
      JSON.stringify(step.prerequisites),
      step.timeline,
      JSON.stringify(step.documents_required),
      step.sort_order
    );
  }
  console.log(`  Seeded ${processSteps.length} process steps`);

  console.log("Database seeding complete!");
}
