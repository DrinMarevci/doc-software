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
import {
  type PropertyDocumentExtractedKeywords,
  type PropertyData,
} from '@/types/property'
import React, {
  type FormEvent,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, Minus } from 'lucide-react'
import { format } from 'date-fns'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { KEYWORD_REGULAR_EXPRESSIONS } from '@/constants/docs'
import { ShowOptionsButton } from './show-options-btn'

export function CreatePropertyModal() {
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

  const [pdfFile, setPdfFile] = useState<Uint8Array | undefined>(undefined)
  const [searchingKeyword, setSearchingKeyword] = useState<string | RegExp>('')
  const [searchingKeywordIndex, setSearchingKeywordIndex] = useState<number>(0)
  const [documentData, setDocumentData] = useState<
    Partial<PropertyDocumentExtractedKeywords>
  >({})

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  useEffect(() => {
    if (searchingKeyword === '') {
      defaultLayoutPluginInstance.toolbarPluginInstance.searchPluginInstance.clearHighlights()
      return
    }

    const highlightKeywordOnPdfViewer = async () => {
      await defaultLayoutPluginInstance.toolbarPluginInstance.searchPluginInstance.highlight(
        searchingKeyword
      )
    }

    highlightKeywordOnPdfViewer()
  }, [searchingKeyword, searchingKeywordIndex])

  useEffect(() => {
    if (!!!documentData) return

    if (!!documentData['tenants'] && documentData['tenants'].length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        tenants: [...(documentData['tenants'] || []), ''],
      }))
    }
    if (
      !!documentData['unitAddress'] &&
      documentData['unitAddress'].length > 0
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        unitAddress: documentData['unitAddress']![0] || '',
      }))
    }
    if (!!documentData['unit'] && documentData['unit'].length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        unit: documentData['unit']![0] || '',
      }))
    }
    if (!!documentData['property'] && documentData['property'].length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        property: documentData['property']![0] || '',
      }))
    }
    if (
      !!documentData['leaseStartDate'] &&
      documentData['leaseStartDate'].length > 0
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        leaseStartDate: new Date(documentData['leaseStartDate']![0] || ''),
      }))
    }
    if (
      !!documentData['leaseEndDate'] &&
      documentData['leaseEndDate'].length > 1
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        leaseEndDate: new Date(documentData['leaseEndDate']![1] || ''),
      }))
    }
    if (!!documentData['rentAmount'] && documentData['rentAmount'].length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        rentAmount:
          parseFloat(documentData['rentAmount']![0].replace('$', '')) || 0,
      }))
    }
    if (
      !!documentData['securityDepositAmount'] &&
      documentData['securityDepositAmount'].length > 0
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        securityDepositAmount:
          parseFloat(
            documentData['securityDepositAmount']![0].replace('$', '')
          ) || 0,
      }))
    }
  }, [documentData])

  const onPdfUpload = async (event: FormEvent) => {
    event.preventDefault()

    const fileInput = document.getElementById('pdfFile') as HTMLInputElement
    setSearchingKeyword('')

    if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0]

      if (!!selectedFile) {
        const buffer = await selectedFile.arrayBuffer()
        setPdfFile(new Uint8Array(buffer))

        const getPdfContentData = await DocumentsService.getPdfContent(
          selectedFile
        )

        setDocumentData(getPdfContentData.documentData)
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
        setSearchingKeyword('')
        setDocumentData({})
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Add New Property</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:max-w-[825px] 2xl:max-w-[1200px] max-h-screen w-full overflow-y-scroll">
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
                        Tenant(s) *
                      </Label>
                      <div className="w-full flex gap-2 col-span-3">
                        <Input
                          className="w-8/12"
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
                          onSelect={() => {
                            setSearchingKeyword(
                              KEYWORD_REGULAR_EXPRESSIONS.tenants
                            )
                            setSearchingKeywordIndex(
                              (prevSearchingKeywordIndex) =>
                                prevSearchingKeywordIndex + 1
                            )
                          }}
                        />
                        <div className="w-2/12">
                          <ShowOptionsButton
                            // updateInputFieldValue={(
                            //   updatedInputValue: string
                            // ) =>
                            //   setFormData((prevFormData) => {
                            //     const updatedTenants = [...prevFormData.tenants]
                            //     updatedTenants[index] = updatedInputValue
                            //     return {
                            //       ...prevFormData,
                            //       tenants: updatedTenants,
                            //     }
                            //   })
                            // }
                            keyword="tenants"
                            updateInputFieldValue={setFormData}
                            keywordValues={documentData.tenants}
                          />
                        </div>
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
                  onSelect={() => {
                    setSearchingKeyword(KEYWORD_REGULAR_EXPRESSIONS.property)
                    setSearchingKeywordIndex(
                      (prevSearchingKeywordIndex) =>
                        prevSearchingKeywordIndex + 1
                    )
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="address" className="text-left text-nowrap">
                  Address *
                </Label>
                <div className="w-full flex gap-4 col-span-3">
                  <Input
                    required
                    type="text"
                    id="address"
                    className="w-3/4"
                    value={formData.unitAddress}
                    onChange={(event) =>
                      setFormData((prevFormData) => {
                        return {
                          ...prevFormData,
                          unitAddress: event.target.value,
                        }
                      })
                    }
                    onSelect={() => {
                      setSearchingKeyword(
                        KEYWORD_REGULAR_EXPRESSIONS.unitAddress
                      )
                      setSearchingKeywordIndex(
                        (prevSearchingKeywordIndex) =>
                          prevSearchingKeywordIndex + 1
                      )
                    }}
                  />
                  <div className="w-1/4">
                    <ShowOptionsButton
                      // updateInputFieldValue={(updatedInputValue: string) =>
                      //   setFormData((prevFormData) => {
                      //     return {
                      //       ...prevFormData,
                      //       unitAddress: updatedInputValue,
                      //     }
                      //   })
                      // }
                      keyword="unitAddress"
                      updateInputFieldValue={setFormData}
                      keywordValues={documentData.unitAddress}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="unit" className="text-left text-nowrap">
                  Unit *
                </Label>
                <div className="w-full flex gap-4 col-span-3">
                  <Input
                    required
                    type="text"
                    id="unit"
                    className="w-3/4"
                    value={formData.unit}
                    onChange={(event) =>
                      setFormData((prevFormData) => {
                        return {
                          ...prevFormData,
                          unit: event.target.value,
                        }
                      })
                    }
                    onSelect={() => {
                      setSearchingKeyword(KEYWORD_REGULAR_EXPRESSIONS.unit)
                      setSearchingKeywordIndex(
                        (prevSearchingKeywordIndex) =>
                          prevSearchingKeywordIndex + 1
                      )
                    }}
                  />
                  <div className="w-1/4">
                    <ShowOptionsButton
                      // updateInputFieldValue={(updatedInputValue: string) =>
                      //   setFormData((prevFormData) => {
                      //     return {
                      //       ...prevFormData,
                      //       unit: updatedInputValue,
                      //     }
                      //   })
                      // }
                      keyword="unit"
                      updateInputFieldValue={setFormData}
                      keywordValues={documentData.unit}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="leaseStartDate" className="text-left">
                  Lease Start Date *
                </Label>
                <Popover>
                  <div className="w-full flex gap-4 col-span-3">
                    <PopoverTrigger asChild className="w-3/4">
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
                    <div className="w-1/4">
                      <ShowOptionsButton
                        // updateInputFieldValue={(updatedInputValue: string) =>
                        //   setFormData((prevFormData) => {
                        //     return {
                        //       ...prevFormData,
                        //       leaseStartDate: new Date(updatedInputValue || ''),
                        //     }
                        //   })
                        // }
                        keyword="leaseStartDate"
                        updateInputFieldValue={setFormData}
                        keywordValues={documentData.leaseStartDate}
                      />
                    </div>
                  </div>
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

                        setSearchingKeyword(
                          KEYWORD_REGULAR_EXPRESSIONS.leaseStartDate
                        )
                        setSearchingKeywordIndex(
                          (prevSearchingKeywordIndex) =>
                            prevSearchingKeywordIndex + 1
                        )
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="leaseEndDate" className="text-left">
                  Lease End Date
                </Label>
                <Popover>
                  <div className="w-full flex gap-4 col-span-3">
                    <PopoverTrigger asChild className="w-3/4">
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
                    <div className="w-1/4">
                      <ShowOptionsButton
                        // updateInputFieldValue={(updatedInputValue: string) =>
                        //   setFormData((prevFormData) => {
                        //     return {
                        //       ...prevFormData,
                        //       leaseEndDate: new Date(updatedInputValue || ''),
                        //     }
                        //   })
                        // }
                        keyword="leaseEndDate"
                        updateInputFieldValue={setFormData}
                        keywordValues={documentData.leaseEndDate}
                      />
                    </div>
                  </div>
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

                        setSearchingKeyword(
                          KEYWORD_REGULAR_EXPRESSIONS.leaseEndDate
                        )
                        setSearchingKeywordIndex(
                          (prevSearchingKeywordIndex) =>
                            prevSearchingKeywordIndex + 1
                        )
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="rentAmount" className="text-left">
                  Rent Amount *
                </Label>
                <div className="w-full flex gap-4 col-span-3">
                  <Input
                    required
                    type="number"
                    id="rentAmount"
                    className="w-3/4"
                    value={formData.rentAmount}
                    onChange={(event) =>
                      setFormData((prevFormData) => {
                        return {
                          ...prevFormData,
                          rentAmount: parseFloat(event.target.value),
                        }
                      })
                    }
                    onSelect={() => {
                      setSearchingKeyword(
                        KEYWORD_REGULAR_EXPRESSIONS.rentAmount
                      )
                      setSearchingKeywordIndex(
                        (prevSearchingKeywordIndex) =>
                          prevSearchingKeywordIndex + 1
                      )
                    }}
                  />
                  <div className="w-1/4">
                    <ShowOptionsButton
                      // updateInputFieldValue={(updatedInputValue: string) =>
                      //   setFormData((prevFormData) => ({
                      //     ...prevFormData,
                      //     rentAmount:
                      //       parseFloat(updatedInputValue.replace('$', '')) || 0,
                      //   }))
                      // }
                      keyword="rentAmount"
                      updateInputFieldValue={setFormData}
                      keywordValues={documentData.rentAmount}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="securityDepositAmount" className="text-left">
                  Security Deposit Amount *
                </Label>
                <div className="w-full flex gap-4 col-span-3">
                  <Input
                    required
                    type="number"
                    id="securityDepositAmount"
                    className="w-3/4"
                    value={formData.securityDepositAmount}
                    onChange={(event) =>
                      setFormData((prevFormData) => {
                        return {
                          ...prevFormData,
                          securityDepositAmount: parseFloat(event.target.value),
                        }
                      })
                    }
                    onSelect={() => {
                      setSearchingKeyword(
                        KEYWORD_REGULAR_EXPRESSIONS.securityDepositAmount
                      )
                      setSearchingKeywordIndex(
                        (prevSearchingKeywordIndex) =>
                          prevSearchingKeywordIndex + 1
                      )
                    }}
                  />
                  <div className="w-1/4">
                    <ShowOptionsButton
                      keyword="securityDepositAmount"
                      // updateInputFieldValue={(updatedInputValue: string) =>
                      //   setFormData((prevFormData) => ({
                      //     ...prevFormData,
                      //     securityDepositAmount:
                      //       parseFloat(updatedInputValue.replace('$', '')) || 0,
                      //   }))
                      // }
                      updateInputFieldValue={setFormData}
                      keywordValues={documentData.securityDepositAmount}
                    />
                  </div>
                </div>
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
