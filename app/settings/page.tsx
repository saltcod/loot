import DeleteAllTransactions from '@/components/delete-all-transactions'
import { removeExcludedTransaction, seedCategories } from '@/lib/actions'
import prisma from '@/lib/prismaClient'
import { loadTransactionExcludeList } from '@/lib/utils'
import { MinusCircle } from 'lucide-react'
import Link from 'next/link'

const SettingsPage = async () => {
  return (
    <div className="grid gap-24 grid-cols-2 bg-background p-4 rounded-xl">
      <div>
        <div className="my-4 grid items-center gap-4">
          <DeleteAllTransactions />
          <Link href="/import"> Import transactions</Link>
          <form action={seedCategories} className="flex items-center gap-2">
            <button>Seed data</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
