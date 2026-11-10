/** Mock API responses for rapid prototyping - Vertical Bridge specific data */

// Sample Vertical Bridge towers data
export const mockTowers = [
  {
    id: 'vb-001-dallas',
    site_id_code: 'VB-TOWER-001',
    site_name: 'Dallas Site Alpha',
    property_id: 'prop-dallas-01',
    latitude: 32.7767,
    longitude: -96.7970,
    status: 'Active',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'vb-002-houston',
    site_id_code: 'VB-TOWER-002',
    site_name: 'Houston Central',
    property_id: 'prop-houston-01',
    latitude: 29.7604,
    longitude: -95.3698,
    status: 'Active',
    created_at: '2024-02-20T14:15:00Z'
  },
  {
    id: 'vb-003-austin',
    site_id_code: 'VB-TOWER-003',
    site_name: 'Austin Hub',
    property_id: 'prop-austin-01',
    latitude: 30.2672,
    longitude: -97.7431,
    status: 'Active',
    created_at: '2024-03-10T09:00:00Z'
  }
]

// Sample Vertical Bridge leases data
export const mockLeases = [
  {
    id: 'lease-001',
    lease_number: 'VB-LEASE-2024-001',
    property_id: 'prop-dallas-01',
    landlord_id: 'landlord-001',
    tenant_id: 'tenant-001',
    annual_rent: 480000,
    rent_escalation_pct: 2.5,
    term_months: 120,
    start_date: '2024-01-01',
    end_date: '2034-12-31',
    status: 'Active',
    created_at: '2023-12-15T00:00:00Z'
  },
  {
    id: 'lease-002',
    lease_number: 'VB-LEASE-2024-002',
    property_id: 'prop-houston-01',
    landlord_id: 'landlord-002',
    tenant_id: 'tenant-002',
    annual_rent: 350000,
    rent_escalation_pct: 3.0,
    term_months: 120,
    start_date: '2024-04-01',
    end_date: '2033-03-31',
    status: 'Active',
    created_at: '2024-03-01T00:00:00Z'
  }
]

// Sample Vertical Bridge legal cases
export const mockLegalMatters = [
  {
    id: 'legal-001',
    matter_number: 'VB-LEGAL-2024-001',
    title: 'Lease Dispute - Dallas Site Alpha',
    matter_type: 'Litigation',
    status: 'Open',
    priority: 'High',
    opened_date: '2024-06-01',
    organization_id: 'org-vb',
    created_at: '2024-06-01T09:00:00Z'
  },
  {
    id: 'legal-002',
    matter_number: 'VB-LEGAL-2024-002',
    title: 'Carrier Rights of Way',
    matter_type: 'Regulatory',
    status: 'In Progress',
    priority: 'Medium',
    opened_date: '2024-05-15',
    organization_id: 'org-vb',
    created_at: '2024-05-15T14:30:00Z'
  }
]

// Vertical Bridge tenant info
export const verticalBridgeTenant = {
  id: 'org-vb',
  name: 'Vertical Bridge Infrastructure',
  logo_url: 'https://www.deepsouthcommunications.com/wp-content/uploads/2020/11/vertical-bridge-logo.png',
  created_at: '2023-01-01T00:00:00Z'
}