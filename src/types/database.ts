export interface DBHSCode {
  code: string;
  description: string;
  chapter: string;
  heading: string;
  unit: string;
  embedding: Buffer | null;
}

export interface DBDutyRate {
  hs_code: string;
  bcd_rate: number;
  aidc_rate: number;
  sws_rate: number;
  igst_rate: number;
  compensation_cess_rate: number;
  effective_from: string;
  notification_no: string;
}

export interface DBFTARate {
  hs_code: string;
  agreement_code: string;
  agreement_name: string;
  preferential_bcd_rate: number;
  rules_of_origin: string;
}

export interface DBAntiDumpingDuty {
  hs_code: string;
  origin_country: string;
  duty_type: string;
  duty_amount: number;
  notification_no: string;
}

export interface DBCertification {
  id: number;
  body: string;
  name: string;
  applicable_hs_codes: string; // JSON array
  is_mandatory: number;
  pre_shipment_required: number;
  risk_if_missing: string;
  process_summary: string;
}

export interface DBDGFTLicensing {
  hs_code: string;
  classification: string;
  scomet_listed: number;
  epr_required: number;
  moef_permission: number;
}

export interface DBProcessStep {
  step_code: string;
  name: string;
  description: string;
  is_mandatory: number;
  prerequisites: string; // JSON array
  timeline: string;
  documents_required: string; // JSON array
  sort_order: number;
}

export interface DBRegulatoryChunk {
  id: number;
  content: string;
  embedding: Buffer | null;
  metadata: string; // JSON
}

export interface DBGeneratedReport {
  id: string;
  tool: string;
  input_data: string; // JSON
  report_content: string; // JSON
  created_at: string;
}
