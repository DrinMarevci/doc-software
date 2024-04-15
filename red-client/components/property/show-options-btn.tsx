import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { type PropertyData } from '@/types/property'
import React from 'react'

interface ShowOptionsButtonProps {
  // updateInputFieldValue?: (updatedInputValue: string) => void
  updateInputFieldValue?: React.Dispatch<React.SetStateAction<PropertyData>>
  keywordValues?: string[]
  keyword?:
    | 'tenants'
    | 'property'
    | 'unitAddress'
    | 'rentAmount'
    | 'securityDepositAmount'
    | 'unit'
    | 'leaseStartDate'
    | 'leaseEndDate'
  index?: number
}

export const ShowOptionsButton = React.memo(function ({
  updateInputFieldValue,
  keywordValues,
  keyword,
  index,
}: ShowOptionsButtonProps) {
  const update = (value: string) => {
    if (!!!updateInputFieldValue || !!!keyword) return

    if (keyword === 'tenants') {
      updateInputFieldValue((prevFormData) => {
        const updatedTenants = [...prevFormData.tenants]
        updatedTenants[index!] = value
        return {
          ...prevFormData,
          tenants: updatedTenants,
        }
      })
    } else if (keyword === 'property') {
      updateInputFieldValue((prevFormData) => {
        return {
          ...prevFormData,
          property: value,
        }
      })
    } else if (keyword === 'unitAddress') {
      updateInputFieldValue((prevFormData) => {
        return {
          ...prevFormData,
          unitAddress: value,
        }
      })
    } else if (keyword === 'unit') {
      updateInputFieldValue((prevFormData) => {
        return {
          ...prevFormData,
          unit: value,
        }
      })
    } else if (keyword === 'leaseStartDate') {
      updateInputFieldValue((prevFormData) => {
        return {
          ...prevFormData,
          leaseStartDate: new Date(value || ''),
        }
      })
    } else if (keyword === 'leaseEndDate') {
      updateInputFieldValue((prevFormData) => {
        return {
          ...prevFormData,
          leaseEndDate: new Date(value || ''),
        }
      })
    } else if (keyword === 'rentAmount') {
      updateInputFieldValue((prevFormData) => {
        return {
          ...prevFormData,
          rentAmount: parseFloat(value.replace('$', '')),
        }
      })
    } else if (keyword === 'securityDepositAmount') {
      updateInputFieldValue((prevFormData) => {
        return {
          ...prevFormData,
          securityDepositAmount: parseFloat(value.replace('$', '')),
        }
      })
    }
  }

  return (
    <Select value="idk" onValueChange={(value) => update(value)}>
      <SelectTrigger
        className={cn(
          'w-fit flex items-center gap-2 font-medium text-zinc-800',
          !!keywordValues &&
            keywordValues.length > 0 &&
            'border border-green-700'
        )}
      ></SelectTrigger>
      <SelectContent>
        {keywordValues?.map((keywordValue) => (
          <SelectItem key={keywordValue} value={keywordValue}>
            {keywordValue}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})
