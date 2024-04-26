import fs, { readdirSync } from 'fs'
import { getPdfFileResult } from '../lib/doc-scanner'
import { UploadedFile } from 'express-fileupload'
import path from 'path'

const leaseRenewalDocumentsDir = 'C:/Users/Daka/Desktop/renewals'
const testResultsDir = 'C:/Users/Daka/Desktop/renewals-lib-test-results'

;(async () => {
  const files = readdirSync(leaseRenewalDocumentsDir)
  // const chunk_size =
  //   files.length % 4 ? 4 : files.length % 3 ? 3 : files.length % 2 ? 2 : 1
  const chunk_size = files.length % 3 ? 3 : files.length % 2 ? 2 : 1
  const resultReports = {
    tenants: 0,
    property: 0,
    unitAddress: 0,
    unit: 0,
    commencementDate: 0,
    oneYearTerminationDate: 0,
    twoYearTerminationDate: 0,
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

  console.log(`\n${files.length} files to test`)

  async function processFile(file: string) {
    console.log(`\ntesting ${file}`)

    try {
      const filePath = `${leaseRenewalDocumentsDir}/${file}`
      const data = fs.readFileSync(filePath)
      const testResultSubDir = `${testResultsDir}/${file.replace('.pdf', '')}`

      // create folder and save pdf file there
      if (!fs.existsSync(testResultSubDir))
        fs.mkdirSync(testResultSubDir, { recursive: true })
      const resultFilePath = path.join(
        testResultSubDir,
        file.replace('.pdf', '')
      )
      fs.writeFileSync(`${resultFilePath}.pdf`, data)
      console.log(`File ${file} saved in directory ${testResultSubDir}`)

      // convert to express uploaded file type
      const uploadedFile = {
        name: filePath.split('/').pop(),
        data: data,
        mv: (path: string, callback?: (err: any) => void) => {
          fs.writeFile(path, data, (err: any) => {
            if (err && callback) {
              callback(err)
            } else if (err) {
              throw err
            } else if (callback) {
              callback(null)
            }
          })
        },
      }

      const { pdfContent, keywordsMap } = await getPdfFileResult(
        uploadedFile as UploadedFile
      )

      // add data to result reports
      Object.keys(keywordsMap).forEach((keyword) => {
        if (
          !!!(keywordsMap as any)[keyword] ||
          (keywordsMap as any)[keyword] == 0
        ) {
          return
        }

        ;(resultReports as any)[keyword] = (resultReports as any)[keyword] + 1
      })

      // save result file in test result sub dir
      fs.writeFileSync(
        `${resultFilePath}.txt`,
        `${JSON.stringify(keywordsMap, null, 4)}\n\n\n\n${pdfContent}`
      )
      console.log(`File ${file} saved in directory ${testResultSubDir}`)
    } catch (err) {
      console.error(err)
    }
  }

  const chunks = []
  for (let i = 0; i < files.length; i += chunk_size) {
    chunks.push(files.slice(i, i + chunk_size))
  }

  for (let i = 0; i < chunks.length; i++) {
    console.log(`\n\nChunk ${i + 1} / ${chunks.length}\n\n`)
    await Promise.all(chunks[i].map(processFile))
  }

  const resultFilePath = path.join(testResultsDir, 'resultReports')
  fs.writeFileSync(
    `${resultFilePath}.txt`,
    JSON.stringify(resultReports, null, 4)
  )
  console.log(`Results report file saved in directory ${testResultsDir}`)

  // ------------

  // for (const file of files) {
  //   console.log(`\ntesting ${file}`)

  //   try {
  //     const filePath = `${leaseRenewalDocumentsDir}/${file}`
  //     const data = fs.readFileSync(filePath)
  //     const testResultSubDir = `${testResultsDir}/${file.replace('.pdf', '')}`

  //     // create folder and save pdf file there
  //     if (!fs.existsSync(testResultSubDir))
  //       fs.mkdirSync(testResultSubDir, { recursive: true })
  //     const resultFilePath = path.join(
  //       testResultSubDir,
  //       file.replace('.pdf', '')
  //     )
  //     fs.writeFileSync(`${resultFilePath}.pdf`, data)
  //     console.log(`File ${file} saved in directory ${testResultSubDir}`)

  //     // convert to express uploaded file type
  //     const uploadedFile = {
  //       name: filePath.split('/').pop(),
  //       data: data,
  //       mv: (path: string, callback?: (err: any) => void) => {
  //         fs.writeFile(path, data, (err: any) => {
  //           if (err && callback) {
  //             callback(err)
  //           } else if (err) {
  //             throw err
  //           } else if (callback) {
  //             callback(null)
  //           }
  //         })
  //       },
  //     }

  //     const { pdfContent, keywordsMap } = await getPdfFileResult(
  //       uploadedFile as UploadedFile
  //     )

  //     // save result file in test result sub dir
  //     fs.writeFileSync(
  //       `${resultFilePath}.txt`,
  //       `${JSON.stringify(keywordsMap, null, 4)}\n\n\n\n${pdfContent}`
  //     )
  //     console.log(`File ${file} saved in directory ${testResultSubDir}`)
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }
})()
