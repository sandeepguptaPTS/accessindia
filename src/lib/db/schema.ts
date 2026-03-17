import Database from "better-sqlite3";

export function initializeDatabase(db: Database.Database): void {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS hs_codes (
      code TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      chapter TEXT NOT NULL,
      heading TEXT NOT NULL,
      unit TEXT NOT NULL DEFAULT 'KGS',
      embedding BLOB
    );

    CREATE TABLE IF NOT EXISTS duty_rates (
      hs_code TEXT PRIMARY KEY,
      bcd_rate REAL NOT NULL DEFAULT 0,
      aidc_rate REAL NOT NULL DEFAULT 0,
      sws_rate REAL NOT NULL DEFAULT 10,
      igst_rate REAL NOT NULL DEFAULT 18,
      compensation_cess_rate REAL NOT NULL DEFAULT 0,
      effective_from TEXT NOT NULL DEFAULT '2024-01-01',
      notification_no TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (hs_code) REFERENCES hs_codes(code)
    );

    CREATE TABLE IF NOT EXISTS fta_rates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hs_code TEXT NOT NULL,
      agreement_code TEXT NOT NULL,
      agreement_name TEXT NOT NULL,
      preferential_bcd_rate REAL NOT NULL,
      rules_of_origin TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (hs_code) REFERENCES hs_codes(code),
      UNIQUE(hs_code, agreement_code)
    );

    CREATE TABLE IF NOT EXISTS anti_dumping_duties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hs_code TEXT NOT NULL,
      origin_country TEXT NOT NULL,
      duty_type TEXT NOT NULL DEFAULT 'fixed',
      duty_amount REAL NOT NULL DEFAULT 0,
      notification_no TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (hs_code) REFERENCES hs_codes(code)
    );

    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      body TEXT NOT NULL,
      name TEXT NOT NULL,
      applicable_hs_codes TEXT NOT NULL DEFAULT '[]',
      is_mandatory INTEGER NOT NULL DEFAULT 1,
      pre_shipment_required INTEGER NOT NULL DEFAULT 0,
      risk_if_missing TEXT NOT NULL DEFAULT '',
      process_summary TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS dgft_licensing (
      hs_code TEXT PRIMARY KEY,
      classification TEXT NOT NULL DEFAULT 'free',
      scomet_listed INTEGER NOT NULL DEFAULT 0,
      epr_required INTEGER NOT NULL DEFAULT 0,
      moef_permission INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (hs_code) REFERENCES hs_codes(code)
    );

    CREATE TABLE IF NOT EXISTS process_steps (
      step_code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      is_mandatory INTEGER NOT NULL DEFAULT 1,
      prerequisites TEXT NOT NULL DEFAULT '[]',
      timeline TEXT NOT NULL DEFAULT '',
      documents_required TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS regulatory_chunks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      embedding BLOB,
      metadata TEXT NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS generated_reports (
      id TEXT PRIMARY KEY,
      tool TEXT NOT NULL,
      input_data TEXT NOT NULL DEFAULT '{}',
      report_content TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT '{}'
    );
  `);
}
