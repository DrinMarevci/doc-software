export type ResidentData = {
  name: string
  address: string
  email: string
  officePhone?: string
  homePhone?: string
  cellPhone?: string
  alternatePhone?: string
  fax?: string
  ssn?: string
}

// db type of resident
export type Resident = ResidentData & {
  created: number
  updated: number
  deleted?: number | null
}
