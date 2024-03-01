import TransactionTable from '@/components/transaction-table'

import prisma from '@/lib/prismaClient'
import { calculateSubTotal } from '@/lib/utils'

interface PageProps {
  params: { word: string }
}

export default async function Page({ params }: PageProps) {
  const { word } = params

  const decodedWord = decodeURIComponent(word)

  // Fetch categories and their associated keywords
  const categories = await prisma.category.findMany({
    take: 100,

    include: {
      keywords: {
        select: {
          name: true, // Use 'name' instead of 'keyword'
        },
      },
    },
  })
  // Extract keywords from the result
  const categoryKeywords = categories.flatMap((category) => category.keywords.map((keyword) => keyword.name))

  // Use the categoryKeywords array to search for transactions
  const uncategorizedTransactions = await prisma.transactions.findMany({
    take: 200,
    where: {
      NOT: {
        OR: categoryKeywords.map((keyword) => ({
          name: {
            contains: keyword,
          },
        })),
      },
    },
    orderBy: {
      amount: 'desc',
    },
  })

  //console.log('transactions	', transactions)
  const total = uncategorizedTransactions ? calculateSubTotal(uncategorizedTransactions) : 0

  return (
    <>
      <TransactionTable transactions={uncategorizedTransactions} />
    </>
  )
}
