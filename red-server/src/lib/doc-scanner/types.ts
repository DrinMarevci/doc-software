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

export type LeaseRenewalRentAndDepositDetails = {
  oneYearRentAmount: number
  oneYearNewRentAmount: number
  oneYearGuidelineRate: number
  twoYearRentAmount: number
  twoYearNewRentAmount: number
  twoYearGuidelineRate: number
  securityDepositAmount: number
  oneYearAdditionalDepositAmount: number
  twoYearAdditionalDepositAmount: number
}

export type LeaseRenewalDocumentData = {
  tenants: string[]
  property: string
  unitAddress: string
  unit: string
  commencementDate: Date
  oneYearTerminationDate?: Date
  twoYearTerminationDate?: Date
} & LeaseRenewalRentAndDepositDetails

export type PropertyDocumentExtractedKeywords = LeaseRenewalDocumentData

export type PropertyDataKeys = keyof PropertyDocumentData

export type DocKeyword = {
  regularExpressions: RegExp[]
  keywords: string[]
}
