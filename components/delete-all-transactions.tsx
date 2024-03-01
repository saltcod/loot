import { deleteAllTransactions } from '@/lib/actions'
import { Button } from './ui/button'

const DeleteAllTransactions = () => {
  return (
    <div>
      <form action={deleteAllTransactions}>
        <Button className="">Delete all transactions</Button>
      </form>
    </div>
  )
}

export default DeleteAllTransactions
