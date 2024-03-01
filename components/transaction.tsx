import WordLink from './word-link'
import { formatDollars, getRecordCategories, wordsToStrip } from '@/lib/utils'
import { TransactionType } from '@/types/types'
import CategoryBadge from './category-badge'
import DeleteTransaction from './delete-transaction'
import { CategoryPopup } from './category-popup'
import prisma from '@/lib/prismaClient'

export interface TransactionProps {
  transaction: TransactionType
}

function cleanString(str: string) {
  if (str === undefined) return
  let description = str

  // strip words from transactions
  // Like Point of Sale or INTERAC e-Transfer
  wordsToStrip.forEach((words: any) => {
    description = description.replace(words, '')
  })

  // remove the 10 digit id
  description = description.replace(/[0-9]{6,}/, '')
  return description
}

async function Transaction({ transaction }: TransactionProps) {
  //const categories = await prisma.category.findMany()
  //const uniqueCategories = Array.from(new Set(categories.map((category) => category.name)))

  const cleanedName = cleanString(transaction.name)
  const categories = await getRecordCategories(transaction.name)
  const allCategories = await prisma.category.findMany()

  const uniqueCategories = Array.from(new Set(allCategories.map((category) => category.name))).map((categoryName) => {
    const category = allCategories.find((category) => category.name === categoryName)
    return { id: category!.id, name: categoryName }
  })

  //console.log(categories)
  //console.log(uniqueCategories)

  return (
    <div className="flex w-full gap-4 py-2 border-b justify-between text-sm">
      <div className="flex items-center gap-2">
        <DeleteTransaction transaction={transaction} />
        {/* <span className="w-24">{transaction.date}</span> */}
        <span className="flex gap-1 max-w-xs	truncate">
          {cleanedName?.split(' ').map((word, i) => word.length > 1 && <WordLink key={`${transaction.name}-${word}-${i}`} word={word} />)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4">
          {categories.length > 0 ? categories.map((category: any) => <CategoryBadge key={category} type={category} />) : null}
          <CategoryPopup transaction={transaction} categories={uniqueCategories} />
        </div>
        <span className="min-w-20 text-right">${formatDollars(transaction.amount)}</span>
      </div>
    </div>
  )
}

export default Transaction
