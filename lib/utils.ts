import { TransactionType } from '@/types/types'

import fs from 'fs'
import prisma from '@/lib/prismaClient'

export async function loadTransactionExcludeList() {
  const transactionExcludeList: string[] = []

  try {
    const filePath = './lib/transaction-exclude-list.txt'

    // Read the content of the file as a string
    const fileContent = await fs.readFile(filePath, 'utf8')

    // Split the content into lines and add each line to the array
    const lines = fileContent.split('\n')
    lines.forEach((line) => {
      const trimmedLine = line.trim()
      if (trimmedLine) {
        transactionExcludeList.push(trimmedLine)
      }
    })
  } catch (error) {
    console.error('Error loading transaction exclude list:', error)
  }

  return transactionExcludeList // Return the populated array
}

export function calculateSubTotal(transactions: TransactionType[]) {
  const amounts = transactions.map((item: TransactionType) => (item.amount ? Number(item.amount) : 0))
  var sum = amounts.reduce((a: number, b: number) => a + b, 0)

  return sum
}

export function patternMatch(pattern: string, str: string) {
  const re = new RegExp(pattern, 'i') // Use 'i' flag for case-insensitive matching
  return re.test(str)
}

export async function getRecordCategories(transactionName: string) {
  if (transactionName === undefined) return ['misc']

  const normalizedTransactionName = transactionName.toLowerCase().trim()
  const matchedCategories = []

  try {
    const categories = await prisma.category.findMany() // Fetch all categories

    for (const category of categories) {
      const keywords = await prisma.keyword.findMany({
        where: { categories: { some: { id: category.id } } }, // Filter keywords by category
      })

      for (const keyword of keywords) {
        const keywordValue = keyword.name.toLowerCase().trim()

        if (normalizedTransactionName.includes(keywordValue)) {
          matchedCategories.push(category.name) // Add the matched category name to the array
        }
      }
    }

    return matchedCategories.length > 0 ? matchedCategories : ['misc']
  } catch (error) {
    console.error('Error querying the database:', error)
    return ['misc'] // Handle any database errors gracefully
  }
}

export const wordsToStrip = [
  'Point of Sale',
  'Interac',
  'RETAIL PURCHASE',
  'Electronic Funds Transfer PREAUTHORIZED DEBIT',
  ' - ',
  ',',
  '*',
]

export const unique = (items: any) => [...new Set(items)]

export type TransformationRule = [string | RegExp, string]

export const transformList: TransformationRule[] = [
  [/NLC #\d+/, 'NLC'],
  ['Electronic Funds Transfer PREAUTHORIZED DEBIT LN # 6423378476 CIBC LOANS / PRÊT CIBC', 'Subaru Outback payment'],
  // Add more transformation pairs with regular expressions or strings as needed
]

export function formatDollars(amount: string | number) {
  // Convert to a number if it's a string
  const amountNumber = typeof amount === 'string' ? parseFloat(amount) : amount
  const formattedAmount = amountNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return formattedAmount
}
