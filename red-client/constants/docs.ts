export const KEYWORD_REGULAR_EXPRESSIONS = {
  tenants:
    /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:,\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)+\b/g,
  property: 'property',
  unitAddress:
    /\b\d+\s+(?:\w+\s+){1,2}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/g,
  rentAmount: /\$\d+(?:,\d{3})*(?:\.\d{2})\b/g,
  leaseStartDate: /\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/g,
  leaseEndDate: /\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/g,
  securityDepositAmount: 'deposit',
  concession: 'concession',
  unit: 'unit',
}
