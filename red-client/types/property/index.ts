// data extracted from property document
export type PropertyDocument = {
  tenants?: string[]
  property?: string
  unitAddress?: string
  email?: string
  alternateEmail?: string
  residentAddress?: string
  residentAddress2?: string
  cellPhone?: string
  alternatePhone?: string
  unit?: string
  lateFeesBaseAmount?: string
  lateFeesGracePeriod?: string
  previousRent?: string
  secDep?: string
  unitType?: string
  unitSize?: string
  unitSf?: string
  rentAmount?: number
  leaseTerm?: string
  leaseFrom?: string
  leaseSignDate?: string
}

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
