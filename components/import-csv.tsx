'use client'
import { importCsvToDatabase2 } from '@/lib/actions'
import { cn } from '@/lib/shadcn-utils'
import { PackageOpen } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const ImportCSV = () => {
  const [importStatus, setImportStatus] = useState('')
  const onDrop = useCallback(async (acceptedFiles: any) => {
    // Ensure only one file is processed at a time (you can handle multiple files if needed)
    if (acceptedFiles.length === 1) {
      const file = acceptedFiles[0]
      const fileContents = await file.text() // Read the file contents using the text() method
      const importResult = await importCsvToDatabase2(fileContents) // Pass the file contents as a string to the function

      if (importResult) {
        setImportStatus('CSV data imported successfully')
      } else {
        setImportStatus('Error importing CSV data.')
      }
    } else {
      console.error('Please drop a single CSV file.')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className="my-12">
      <div {...getRootProps()} className="mt-12">
        <div className={cn(`p-4 bg-background rounded-xl transition-colors`, isDragActive && 'bg-yellow-50')}>
          <input {...getInputProps()} />
          <div className="text-center mt-12">
            <PackageOpen size={64} strokeWidth={1} className="inline-block opacity-30" />
          </div>
          <div className="my-12 text-center mx-auto">
            {isDragActive ? (
              <p>Drop the CSV file here ...</p>
            ) : (
              <div className="mx-auto">
                <p className="text-lg">Drag and drop a CSV file here</p>
                <p className="mt-4 max-w-2xl mx-auto text-center text-sm">
                  You <u>must</u> provide a header row in your CSV with the following columns:
                </p>
                <p>
                  <u>Date</u>, <u>Name</u>, <u>Amount</u>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mt-12">
        {importStatus && (
          <div className="mt-4 bg-yellow-50 p-4">
            {importStatus}
            <p>
              Return{' '}
              <Link href="/" className="underline">
                home
              </Link>{' '}
              to start exploring your data.
            </p>
          </div>
        )}
        <h3 className="mt-12 font-medium text-base">The csv should look like this:</h3>
        <div className="bg-background p-4 rounded-xl mt-4">
          <pre>
            <div>date,name,amount,,,</div>
            <div>2023-12-29,Starbucks Coffee Limited,31.17,,4500********8386</div>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default ImportCSV
