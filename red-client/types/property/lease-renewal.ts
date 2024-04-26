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
