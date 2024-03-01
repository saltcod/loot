import { TransactionType } from '@/types/types'
import Transaction from './transaction'
import { calculateSubTotal } from '@/lib/utils'
import Search from './search'

interface PageProps {
  transactions: any
  searchTerm?: string
}
const TransactionTable = ({ transactions, searchTerm = '' }: PageProps) => {
  const total = transactions ? calculateSubTotal(transactions) : 0

  return (
    <div className="grid gap-4 text-sm">
      <div>
        <Search total={total} searchTerm={searchTerm} />
        <div className="bg-background p-4 rounded-lg mt-4">
          {transactions && transactions.map((item: TransactionType) => <Transaction key={item.id} transaction={item} />)}
        </div>
      </div>
    </div>
  )
}

export default TransactionTable
