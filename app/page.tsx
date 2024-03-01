import Search from '@/components/Search'
import { calculateSubTotal } from '@/lib/utils'
import prisma from '@/lib/prismaClient'
import TransactionTable from '@/components/transaction-table'
import Link from 'next/link'

export default async function Page() {
  const excludedNames = await prisma.exclude.findMany()
  const excludedNameSet = new Set(excludedNames.map((exclude) => exclude.name.toLowerCase()))

  const transactions = await prisma.transactions.findMany({
    take: 300,

    orderBy: {
      amount: 'desc',
    },
  })

  const filtered = transactions.filter((transaction) =>
    Array.from(excludedNameSet).every((excludedName) => !transaction.name.toLowerCase().includes(excludedName))
  )
  //console.log({ transactions })
  const total = transactions ? calculateSubTotal(transactions) : 0

  return (
    <>
      {transactions.length > 0 ? (
        <TransactionTable transactions={filtered} />
      ) : (
        <div>
          No transactions found. Please{' '}
          <Link href="/import" className="underline">
            import a CSV file
          </Link>
          .
        </div>
      )}
    </>
  )
}
