import Insights from '@/components/insights'
import TransactionTable from '@/components/transaction-table'

import prisma from '@/lib/prismaClient'

interface PageProps {
  params: { word: string }
}

export default async function Page({ params }: PageProps) {
  const { word } = params

  const decodedWord = decodeURIComponent(word)

  // Fetch categories and their associated keywords
  const categories = await prisma.category.findMany({
    take: 100,
    where: {
      name: {
        contains: decodedWord,
      },
    },
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
  const transactions = await prisma.transactions.findMany({
    take: 100,
    where: {
      OR: categoryKeywords.map((keyword) => ({
        name: {
          contains: keyword,
        },
      })),
    },
    orderBy: {
      amount: 'desc',
    },
  })

  return (
    <>
      <TransactionTable transactions={transactions} />
      <Insights transactions={transactions} />
    </>
  )
}
