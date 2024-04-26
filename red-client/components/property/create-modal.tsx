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
import { type PropertyDocumentExtractedKeywords } from '@/types/property'
import React, { type FormEvent, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, Loader2, Minus } from 'lucide-react'
import { format } from 'date-fns'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

const initialFormData: PropertyDocumentExtractedKeywords = {
  tenants: [''],
  property: '',
  unitAddress: '',
  unit: '',
  commencementDate: new Date(),
  oneYearRentAmount: 0,
  oneYearNewRentAmount: 0,
  oneYearGuidelineRate: 0,
  twoYearRentAmount: 0,
  twoYearNewRentAmount: 0,
  twoYearGuidelineRate: 0,
  securityDepositAmount: 0,
  oneYearAdditionalDepositAmount: 0,
  twoYearAdditionalDepositAmount: 0,
}

export function CreatePropertyModal() {
  const [formData, setFormData] =
    useState<PropertyDocumentExtractedKeywords>(initialFormData)
  const [loadingFormData, setLoadingFormData] = useState<boolean>(false)

  const [pdfFile, setPdfFile] = useState<Uint8Array | undefined>(undefined)

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const onPdfUpload = async (event: FormEvent) => {
    event.preventDefault()

    const fileInput = document.getElementById('pdfFile') as HTMLInputElement

    if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0]

      if (!!selectedFile) {
        const buffer = await selectedFile.arrayBuffer()
        setPdfFile(new Uint8Array(buffer))
        setLoadingFormData(true)

        const getPdfContentData = await DocumentsService.getPdfContent(
          selectedFile
        )

        setFormData((prevFormData) => ({
          ...prevFormData,
          ...getPdfContentData.documentData,
        }))
        setLoadingFormData(false)
      }
    }
  }

  const onSubmitHandler = async (event: FormEvent) => {
    event.preventDefault()
  }

  return (
    <Dialog
      onOpenChange={() => {
        setPdfFile(undefined)
        setFormData(initialFormData)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Add New Property</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:max-w-[825px] 2xl:max-w-[1200px] max-h-screen w-full overflow-y-scroll">
        {loadingFormData && (
          <div className="w-full h-full bg-neutral-200 opacity-50 flex justify-center items-center absolute z-20 top-0 left-0 pointer-events-none">
            <Loader2
              className="h-10 w-10 inline-block animate-spin"
              style={{ animationDuration: '0.75s' }}
            />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Add new property</DialogTitle>
          <DialogDescription>
            Make changes to your property information here. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          className="w-full h-full flex flex-col gap-2"
          onSubmit={onSubmitHandler}
        >
          <div className="flex h-full md:flex-row flex-col justify-between items-start my-2 gap-0">
            <div className="flex flex-col md:w-[53%] w-full h-full">
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
              <div className="bg-zinc-50 min-h-64 relative h-full w-full border border-zinc-200 rounded-md overflow-y-scroll">
                {pdfFile && (
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <div className="absolute h-full w-full top-0 bottom-0">
                      <Viewer
                        fileUrl={pdfFile}
                        plugins={[defaultLayoutPluginInstance]}
                      />
                    </div>
                  </Worker>
                )}
              </div>
            </div>
            <Separator className="md:hidden block opacity-60" />
            <Separator
              className="md:block hidden opacity-60 h-full"
              orientation="vertical"
            />
            <div className="grid gap-4 py-4 md:w-[43%] w-full">
              <div className="grid grid-cols-3 items-center gap-2">
                <div className="col-span-3 flex flex-col gap-2">
                  {formData.tenants.map((tenant, index) => (
                    <div
                      className="grid grid-cols-4 items-center gap-2"
                      key={index}
                    >
                      <Label
                        htmlFor={`tenants-${index}`}
                        className="text-left text-nowrap"
                        style={{
                          opacity: index === 0 ? 1 : 0,
                        }}
                      >
                        Tenant(s)
                      </Label>
                      <div className="w-full flex gap-2 col-span-3">
                        <Input
                          className="w-10/12"
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
                          className="w-2/12"
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
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <div></div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={formData.tenants.length >= MAX_TENANTS}
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
                  + Tenant
                </Button>
                <div></div>
                <div></div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="name" className="text-left text-nowrap">
                  Name
                </Label>
                <Input
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
              <div className="grid grid-cols-10 items-center gap-2">
                <div className="col-span-1 flex justify-end items-center">
                  <Label htmlFor="unit" className="text-left text-nowrap">
                    Unit
                  </Label>
                </div>
                <div className="w-full flex gap-4 col-span-2">
                  <Input
                    required
                    type="text"
                    id="unit"
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
                <div className="col-span-1"></div>
                <div className="col-span-1 flex justify-end items-center">
                  <Label htmlFor="address" className="text-left text-nowrap">
                    Address
                  </Label>
                </div>
                <div className="w-full flex gap-4 col-span-4">
                  <Input
                    required
                    type="text"
                    id="address"
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
              </div>
              <Separator className="block opacity-60" />
              <div className="flex items-center gap-4">
                <Label htmlFor="commencementDate" className="text-left">
                  Commencement date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'justify-center text-left font-normal p-4 flex items-center',
                        !formData.commencementDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {formData.commencementDate ? (
                        format(formData.commencementDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.commencementDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Label htmlFor="oneYearTerminationDate" className="text-left">
                Termination date
              </Label>
              <div className="flex items-center gap-2">
                <div className="w-1/2 flex items-center gap-4">
                  <Label
                    htmlFor="oneYearTerminationDate"
                    className="font-light text-neutral-600 text-left text-nowrap"
                  >
                    One year
                  </Label>
                  <Popover>
                    <div className="w-full flex gap-4">
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'justify-center text-left font-normal p-4 flex items-center',
                            !formData.oneYearTerminationDate &&
                              'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-1 h-4 w-4" />
                          {formData.oneYearTerminationDate ? (
                            format(formData.oneYearTerminationDate, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </div>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.oneYearTerminationDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="w-1/2 flex items-center gap-4">
                  <Label
                    htmlFor="twoYearTerminationDate"
                    className="font-light text-neutral-600 text-left text-nowrap"
                  >
                    Two years
                  </Label>
                  <Popover>
                    <div className="w-full flex gap-4">
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'justify-center text-left font-normal p-4 flex items-center',
                            !formData.twoYearTerminationDate &&
                              'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-1 h-4 w-4" />
                          {formData.twoYearTerminationDate ? (
                            format(formData.twoYearTerminationDate, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </div>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.twoYearTerminationDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Separator className="block opacity-60" />
              <Label htmlFor="oneYearRentAmount" className="text-left">
                Old rent
              </Label>
              <div className="grid grid-cols-11 items-center gap-2">
                <div className="col-span-2">
                  <Label
                    htmlFor="oneYearRentAmount"
                    className="font-light text-neutral-600 text-left text-nowrap"
                  >
                    One year
                  </Label>
                </div>
                <div className="w-full flex gap-4 col-span-3">
                  <Input
                    required
                    type="number"
                    id="oneYearRentAmount"
                    value={formData.oneYearRentAmount}
                    onChange={(event) =>
                      setFormData((prevFormData) => {
                        return {
                          ...prevFormData,
                          oneYearRentAmount: parseFloat(event.target.value),
                        }
                      })
                    }
                  />
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-2">
                  <Label
                    htmlFor="twoYearRentAmount"
                    className="font-light text-neutral-600 text-left text-nowrap"
                  >
                    Two years
                  </Label>
                </div>
                <div className="w-full flex gap-4 col-span-3">
                  <Input
                    required
                    type="number"
                    id="twoYearRentAmount"
                    value={formData.twoYearRentAmount}
                    onChange={(event) =>
                      setFormData((prevFormData) => {
                        return {
                          ...prevFormData,
                          twoYearRentAmount: parseFloat(event.target.value),
                        }
                      })
                    }
                  />
                </div>
              </div>
              <Separator className="block opacity-60" />
              <Label htmlFor="oneYearNewRentAmount" className="text-left">
                New rent
              </Label>
              <div className="grid grid-cols-11 items-center gap-2">
                <div className="col-span-2">
                  <Label
                    htmlFor="oneYearNewRentAmount"
                    className="font-light text-neutral-600 text-left text-nowrap"
                  >
                    One year
                  </Label>
                </div>
                <div className="w-full flex gap-4 col-span-3">
                  <Input
                    required
                    type="number"
                    id="oneYearNewRentAmount"
                    value={formData.oneYearNewRentAmount}
                    onChange={(event) =>
                      setFormData((prevFormData) => {
                        return {
                          ...prevFormData,
                          oneYearNewRentAmount: parseFloat(event.target.value),
                        }
                      })
                    }
                  />
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-2">
                  <Label
                    htmlFor="twoYearNewRentAmount"
                    className="font-light text-neutral-600 text-left text-nowrap"
                  >
                    Two years
                  </Label>
                </div>
                <div className="w-full flex gap-4 col-span-3">
                  <Input
                    required
                    type="number"
                    id="twoYearNewRentAmount"
                    value={formData.twoYearNewRentAmount}
                    onChange={(event) =>
                      setFormData((prevFormData) => {
                        return {
                          ...prevFormData,
                          twoYearNewRentAmount: parseFloat(event.target.value),
                        }
                      })
                    }
                  />
                </div>
              </div>
              <Separator className="block opacity-60" />
              <div className="grid grid-cols-4 items-center gap-2">
                <div className="col-span-1">
                  <Label
                    htmlFor="securityDepositAmount"
                    className="text-left text-nowrap"
                  >
                    Security deposit
                  </Label>
                </div>
                <div className="w-full flex gap-4 col-span-1">
                  <Input
                    required
                    type="number"
                    id="securityDepositAmount"
                    value={formData.securityDepositAmount}
                    onChange={(event) =>
                      setFormData((prevFormData) => {
                        return {
                          ...prevFormData,
                          securityDepositAmount: parseFloat(event.target.value),
                        }
                      })
                    }
                  />
                </div>
                <div className="col-span-2"></div>
              </div>
              <Label
                htmlFor="oneYearAdditionalDepositAmount"
                className="text-left"
              >
                Additional deposit
              </Label>
              <div className="grid grid-cols-11 items-center gap-2">
                <div className="col-span-2">
                  <Label
                    htmlFor="oneYearAdditionalDepositAmount"
                    className="font-light text-neutral-600 text-left text-nowrap"
                  >
                    One year
                  </Label>
                </div>
                <div className="w-full flex gap-4 col-span-3">
                  <Input
                    required
                    type="number"
                    id="oneYearAdditionalDepositAmount"
                    value={formData.oneYearAdditionalDepositAmount}
                    onChange={(event) =>
                      setFormData((prevFormData) => {
                        return {
                          ...prevFormData,
                          oneYearAdditionalDepositAmount: parseFloat(
                            event.target.value
                          ),
                        }
                      })
                    }
                  />
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-2">
                  <Label
                    htmlFor="twoYearAdditionalDepositAmount"
                    className="font-light text-neutral-600 text-left text-nowrap"
                  >
                    Two years
                  </Label>
                </div>
                <div className="w-full flex gap-4 col-span-3">
                  <Input
                    required
                    type="number"
                    id="twoYearAdditionalDepositAmount"
                    value={formData.twoYearAdditionalDepositAmount}
                    onChange={(event) =>
                      setFormData((prevFormData) => {
                        return {
                          ...prevFormData,
                          twoYearAdditionalDepositAmount: parseFloat(
                            event.target.value
                          ),
                        }
                      })
                    }
                  />
                </div>
                <div className="col-span-1"></div>
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
