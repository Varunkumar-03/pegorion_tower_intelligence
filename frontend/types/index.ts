export interface Tower {
  id: string
  property_id: string
  site_id_code: string
  site_name: string | null
  latitude: number | null
  longitude: number | null
  status: string
  created_at: string
}

export interface Property {
  id: string
  name: string
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  latitude: number | null
  longitude: number | null
}

export interface Document {
  id: string
  filename: string
  file_size: number | null
  mime_type: string | null
  storage_path: string
  uploaded_by: string | null
  uploaded_at: string
  status: string
  document_type: string | null
}

export interface DocumentPage {
  id: string
  document_id: string
  page_number: number
  text: string | null
  image_path: string | null
}

export interface Lease {
  id: string
  property_id: string
  landlord_id: string
  lease_number: string
  term_months: number | null
  start_date: string | null
  end_date: string | null
  annual_rent: number | null
  status: string
}

export interface LegalMatter {
  id: string
  title: string
  matter_type: string
  status: string
  priority: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  completed_at: string | null
}

export type NavigationItem = {
  name: string
  href: string
  icon: React.ElementType
}