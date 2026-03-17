import { sql } from "@vercel/postgres";
import type { DBGeneratedReport } from "@/types/database";

/** True when POSTGRES_URL is set (Vercel deployment) */
export const usePostgres = !!process.env.POSTGRES_URL;

let tablesEnsured = false;

/** Idempotent — creates tables once per cold start */
export async function ensurePostgresTables() {
  if (tablesEnsured) return;

  await sql`
    CREATE TABLE IF NOT EXISTS generated_reports (
      id TEXT PRIMARY KEY,
      tool TEXT NOT NULL,
      input_data TEXT NOT NULL,
      report_content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS contact_leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      company TEXT NOT NULL DEFAULT '',
      service TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  tablesEnsured = true;
}

export async function saveReport(
  id: string,
  tool: string,
  inputData: string,
  reportContent: string,
  createdAt: string
) {
  await ensurePostgresTables();
  await sql`
    INSERT INTO generated_reports (id, tool, input_data, report_content, created_at)
    VALUES (${id}, ${tool}, ${inputData}, ${reportContent}, ${createdAt})
  `;
}

export async function getReport(id: string): Promise<DBGeneratedReport | null> {
  await ensurePostgresTables();
  const { rows } = await sql`
    SELECT id, tool, input_data, report_content, created_at
    FROM generated_reports WHERE id = ${id}
  `;
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id: row.id,
    tool: row.tool,
    input_data: row.input_data,
    report_content: row.report_content,
    // Postgres returns Date object; convert to ISO string for DBGeneratedReport compat
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}

export async function saveContactLead(
  name: string,
  email: string,
  phone: string,
  company: string,
  service: string,
  message: string
) {
  await ensurePostgresTables();
  await sql`
    INSERT INTO contact_leads (name, email, phone, company, service, message)
    VALUES (${name}, ${email}, ${phone}, ${company}, ${service}, ${message})
  `;
}
