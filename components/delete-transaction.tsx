'use client'
import { MinusCircle } from 'lucide-react'
import { addExclude } from '@/lib/actions'
import { TransactionType } from '@/types/types'

interface DeleteTransactionProps {
  transaction: TransactionType
}
const DeleteTransaction = ({ transaction }: DeleteTransactionProps) => {
  return (
    <button
      onClick={async () => {
        await addExclude(transaction.name)
      }}
    >
      <MinusCircle size={15} className="text-red-100 hover:text-red-500 transition-colors" />
    </button>
  )
}

export default DeleteTransaction
