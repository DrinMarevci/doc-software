import { type Concession } from '../../types/property'

export type PropertyDocumentData = {
  tenants: string[]
  property: string
  unitAddress: string
  rentAmount: number
  leaseStartDate: Date
  leaseEndDate?: Date
  securityDepositAmount: number
  concession?: Concession[]
  unit: string
}

export type PropertyDocumentExtractedKeywords = {
  tenants: string[]
  property: string[]
  unitAddress: string[]
  rentAmount: string[]
  leaseStartDate: string[]
  leaseEndDate?: string[]
  securityDepositAmount: string[]
  concession?: string[]
  unit: string[]
}

export type PropertyDataKeys = keyof PropertyDocumentData

export type DocKeyword = {
  regularExpressions: RegExp[]
  keywords: string[]
}
