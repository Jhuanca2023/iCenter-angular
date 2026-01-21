export interface Claim {
  id?: string;
  claim_code: string;
  consumer_name: string;
  consumer_lastname: string;
  document_type: string;
  document_number: string;
  email: string;
  phone: string;
  address?: string;
  claimant_type: 'ADULT' | 'MINOR';
  is_minor: boolean;

  guardian_name?: string;
  guardian_lastname?: string;
  guardian_document_type?: string;
  guardian_document_number?: string;
  guardian_phone?: string;
  guardian_email?: string;

  record_type: 'Reclamo' | 'Queja';
  motive: 'ATENCIÓN AL CLIENTE' | 'PRODUCTO O SERVICIO' | 'SISTEMA TÉCNICO' | 'OTROS';
  incident_date: string;
  detailed_description: string;
  customer_request: string;
  status: 'PENDIENTE' | 'EN PROCESO' | 'COMPLETADO' | 'ARCHIVADO';
  response_deadline: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  order_number?: string;
  receipt_number?: string;
}

export interface ClaimHistory {
  id?: string;
  claim_id: string;
  action_type: 'STATUS_CHANGE' | 'ADMIN_RESPONSE' | 'CLAIM_CREATED';
  old_status?: string;
  new_status?: string;
  admin_response?: string;
  created_by?: string; // User ID of the admin who performed the action
  created_at?: string;
}
