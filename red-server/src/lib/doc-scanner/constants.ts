import { type DocKeyword, type PropertyDataKeys } from './types'

export const DOC_KEYWORDS: { [key in PropertyDataKeys]: DocKeyword } = {
  tenants: {
    keywords: ['tenant', 'tenants'],
    regularExpressions: [],
  },
  property: {
    keywords: ['property name', 'property'],
    regularExpressions: [],
  },
  unitAddress: {
    keywords: ['address'],
    regularExpressions: [
      /\b\d+\s+(?:\w+\s+){1,2}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/g,
    ],
  },
  unit: {
    keywords: ['apartment', 'unit'],
    regularExpressions: [/\b\d+[A-Za-z]\b/g],
  },
  leaseStartDate: {
    keywords: ['lease start date', 'lease start', 'lease date'],
    regularExpressions: [/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/g],
  },
  leaseEndDate: {
    keywords: ['lease end date', 'lease end', 'lease date'],
    regularExpressions: [/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/g],
  },
  rentAmount: {
    keywords: ['rent amount', 'rent'],
    regularExpressions: [/\$\d+(?:,\d{3})*(?:\.\d{2})\b/g],
  },
  securityDepositAmount: {
    keywords: ['security deposit amount', 'security deposit', 'deposit'],
    regularExpressions: [/\$\d+(?:,\d{3})*(?:\.\d{2})\b/g],
  },
  concession: {
    keywords: ['concessions'],
    regularExpressions: [],
  },
}
