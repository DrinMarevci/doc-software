import { type LeaseRenewalDocumentData } from './lease-renewal'

export type PropertyData = {
  tenants: string[]
  property: string
  unitAddress: string
  rentAmount: number
  leaseStartDate: Date
  leaseEndDate?: Date
  securityDepositAmount: number
  concession?: Concession[]
  unit: string
  note?: string
  resident_ids?: string[]
}

// db type of property
export type Property = PropertyData & {
  id: string
  created: number
  updated: number
  deleted?: number | null
}

export type Concession = {
  type: string // Type of concession (e.g., "price reduction", "closing cost coverage", etc.)
  value?: number // Value of the concession (optional, as not all concessions have a numerical value)
  description?: string // Optional description or additional details about the concession
}

export type PropertyDocumentExtractedKeywords = LeaseRenewalDocumentData
