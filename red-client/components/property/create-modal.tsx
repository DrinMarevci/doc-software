'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { MAX_TENANTS } from '@/constants/property'
import { cn } from '@/lib/utils'
import { DocumentsService } from '@/services/docs.service'
import { type PropertyData } from '@/types/property'
import React, { type FormEvent, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, Minus } from 'lucide-react'
import { format } from 'date-fns'

export function CreatePropertyModal() {
  const [rawPdfContent, setRawPdfContent] = useState<string>('')
  const [formData, setFormData] = useState<PropertyData>({
    tenants: [''],
    property: '',
    unitAddress: '',
    rentAmount: 0,
    unit: '',
    note: '',
    securityDepositAmount: 0,
    leaseStartDate: new Date(),
  })

  const onPdfUpload = async (event: FormEvent) => {
    event.preventDefault()

    const fileInput = document.getElementById('pdfFile') as HTMLInputElement

    if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0]

      if (!!selectedFile) {
        const getPdfContentData = await DocumentsService.getPdfContent(
          selectedFile
        )

        setRawPdfContent(getPdfContentData.pdfContent)

        Object.keys(getPdfContentData.documentData).forEach((key: any) => {
          if (!Object.keys(formData).includes(key)) return

          setFormData((prevFormData) => {
            return {
              ...prevFormData,
              [key]: getPdfContentData.documentData[key],
            }
          })
        })
      }
    }
  }

  const onSubmitHandler = async (event: FormEvent) => {
    event.preventDefault()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Property</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:max-w-[800px] 2xl:max-w-[1000px] max-h-full">
        <DialogHeader>
          <DialogTitle>Add new property</DialogTitle>
          <DialogDescription>
            Make changes to your property information here. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmitHandler}>
          <div className="flex md:flex-row flex-col justify-between items-start my-2 gap-8">
            <div className="flex flex-col md:w-1/3 w-full">
              <div className="flex gap-2 items-center py-4">
                <Label
                  htmlFor="name"
                  className="text-left md:text-right min-w-fit"
                >
                  Upload PDF
                </Label>
                <input
                  className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:outline-none"
                  id="pdfFile"
                  accept=".pdf"
                  multiple={false}
                  onChange={onPdfUpload}
                  type="file"
                />
              </div>
              <Label htmlFor="name" className="text-left min-w-fit mt-4 mb-2">
                PDF Content: {` `}
              </Label>
              <div className="w-full border border-zinc-200 overflow-y-scroll max-h-[250px] bg-zinc-50 rounded-md p-3">
                {rawPdfContent}
              </div>
            </div>
            <Separator className="md:hidden block" />
            <Separator className="md:block hidden" orientation="vertical" />
            <div className="grid gap-4 py-4 md:w-2/3 w-full">
              <div className="grid grid-cols-3 items-center gap-2">
                <div className="col-span-3 flex flex-col gap-2">
                  {formData.tenants.map((tenant, index) => (
                    <div
                      className="grid grid-cols-4 items-center gap-2"
                      key={index}
                    >
                      <Label
                        htmlFor={`tenants-${index}`}
                        className="text-left md:text-right text-nowrap"
                        style={{
                          opacity: index === 0 ? 1 : 0,
                        }}
                      >
                        Tenant(s) *
                      </Label>
                      <Input
                        className="col-span-2"
                        required
                        type="text"
                        id={`tenants-${index}`}
                        value={tenant}
                        onChange={(event) =>
                          setFormData((prevFormData) => {
                            const updatedTenants = [...prevFormData.tenants]
                            updatedTenants[index] = event.target.value
                            return {
                              ...prevFormData,
                              tenants: updatedTenants,
                            }
                          })
                        }
                      />
                      <Button
                        variant="ghost"
                        disabled={formData.tenants.length <= 1}
                        type="button"
                        onClick={() => {
                          setFormData((prevFormData) => {
                            const updatedTenants = [...prevFormData.tenants]
                            updatedTenants.splice(index, 1)
                            return {
                              ...prevFormData,
                              tenants: updatedTenants,
                            }
                          })
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <div></div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (formData.tenants.length >= MAX_TENANTS) return

                    setFormData((prevFormData) => {
                      return {
                        ...prevFormData,
                        tenants: [...prevFormData.tenants, ''],
                      }
                    })
                  }}
                >
                  + New Tenant
                </Button>
                <div></div>
                <div></div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label
                  htmlFor="name"
                  className="text-left md:text-right text-nowrap"
                >
                  Name *
                </Label>
                <Input
                  required
                  type="text"
                  id="name"
                  className="col-span-3"
                  value={formData.property}
                  onChange={(event) =>
                    setFormData((prevFormData) => {
                      return {
                        ...prevFormData,
                        property: event.target.value,
                      }
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label
                  htmlFor="address"
                  className="text-left md:text-right text-nowrap"
                >
                  Address *
                </Label>
                <Input
                  required
                  type="text"
                  id="address"
                  className="col-span-3"
                  value={formData.unitAddress}
                  onChange={(event) =>
                    setFormData((prevFormData) => {
                      return {
                        ...prevFormData,
                        unitAddress: event.target.value,
                      }
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label
                  htmlFor="unit"
                  className="text-left md:text-right text-nowrap"
                >
                  Unit *
                </Label>
                <Input
                  required
                  type="text"
                  id="unit"
                  className="col-span-3"
                  value={formData.unit}
                  onChange={(event) =>
                    setFormData((prevFormData) => {
                      return {
                        ...prevFormData,
                        unit: event.target.value,
                      }
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label
                  htmlFor="leaseStartDate"
                  className="text-left md:text-right"
                >
                  Lease Start Date *
                </Label>
                <Popover>
                  <PopoverTrigger asChild className="col-span-3">
                    <Button
                      variant={'outline'}
                      className={cn(
                        'justify-center text-left font-normal p-1 flex items-center',
                        !formData.leaseStartDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {formData.leaseStartDate ? (
                        format(formData.leaseStartDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.leaseStartDate}
                      onSelect={(e) => {
                        if (!!!e) return

                        setFormData((prevFormData) => {
                          return {
                            ...prevFormData,
                            leaseStartDate: e,
                          }
                        })
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label
                  htmlFor="leaseEndDate"
                  className="text-left md:text-right"
                >
                  Lease End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild className="col-span-3">
                    <Button
                      variant={'outline'}
                      className={cn(
                        'justify-center text-left font-normal p-1 flex items-center',
                        !formData.leaseEndDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {formData.leaseEndDate ? (
                        format(formData.leaseEndDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.leaseEndDate}
                      onSelect={(e) => {
                        setFormData((prevFormData) => {
                          return {
                            ...prevFormData,
                            leaseEndDate: e,
                          }
                        })
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="rentAmount" className="text-left md:text-right">
                  Rent Amount *
                </Label>
                <Input
                  required
                  type="number"
                  id="rentAmount"
                  className="col-span-1"
                  value={formData.rentAmount}
                  onChange={(event) =>
                    setFormData((prevFormData) => {
                      return {
                        ...prevFormData,
                        rentAmount: parseInt(event.target.value),
                      }
                    })
                  }
                />
                <Label
                  htmlFor="securityDepositAmount"
                  className="text-left md:text-right"
                >
                  Security Deposit Amount *
                </Label>
                <Input
                  required
                  type="number"
                  id="securityDepositAmount"
                  className="col-span-1"
                  value={formData.securityDepositAmount}
                  onChange={(event) =>
                    setFormData((prevFormData) => {
                      return {
                        ...prevFormData,
                        securityDepositAmount: parseInt(event.target.value),
                      }
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
