import fs from 'fs'
import * as Papa from 'papaparse'
import prisma from './prismaClient'

export async function importCsvToDatabase() {
  try {
    const results: any[] = []
    const filePath = './public/data/2023.csv'

    const fileData = fs.readFileSync(filePath, 'utf8')

    Papa.parse(fileData, {
      header: true,
      skipEmptyLines: true,
      step: (row: any) => {
        // Define the type for row as Papa.Row<string>
        const cleanedDate = row.data.date.trim() // Clean the date string

        // Check if 'amount' is defined and not an empty string
        if (typeof row.data.amount !== 'undefined' && row.data.amount.trim() !== '') {
          // Parse and assign the amount
          const parsedAmount = parseFloat(row.data.amount)
          row.data.amount = parsedAmount
          results.push(row.data)
        }
      },
      complete: async () => {
        for (const row of results) {
          await prisma.transactions.create({
            data: {
              name: row.name,
              amount: row.amount,
              date: new Date(row.date),
              category: '',
            },
          })
        }
        console.log('CSV data has been imported into the database.')
      },
    })
  } catch (error) {
    console.error('Error importing CSV data:', error)
  } finally {
    await prisma.$disconnect()
  }
}
