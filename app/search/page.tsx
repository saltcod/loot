import Search from '@/components/search'
import TransactionTable from '@/components/transaction-table'
import { calculateSubTotal } from '@/lib/utils'
import prisma from '@/lib/prismaClient'
import Insights from '@/components/insights'

export const revalidate = 0

interface PageParams {
  searchParams: any
}

export default async function Page({ searchParams }: PageParams) {
  const { q } = searchParams

  const transactions = await prisma.transactions.findMany({
    take: 25,
    where: {
      name: {
        contains: q,
      },
    },
    orderBy: {
      amount: 'desc',
    },
  })

  const total = transactions ? calculateSubTotal(transactions) : 0

  return (
    <>
      <TransactionTable transactions={transactions} searchTerm={q} />
      <Insights transactions={transactions} />
    </>
  )
}
