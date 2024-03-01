import { Button } from '@/components/ui/button'
import { deleteExclude } from '@/lib/actions'
import prisma from '@/lib/prismaClient'
import { MinusCircle } from 'lucide-react'
import AddExclude from './add-exclude'

const ExcludedTransactions = async () => {
  const excludeList = await prisma.exclude.findMany({
    take: 200,
    orderBy: {
      name: 'desc',
    },
  })

  return (
    <div className="w-full bg-background p-4 rounded-lg">
      <h2 className="font-bold text-xl">Excluded transactions</h2>

      <h3 className="text-sm mb-4">Add a name to exclude</h3>
      <AddExclude />

      <div className="grid  gap-4 w-full mt-4">
        <ul>
          {excludeList.map((item) => (
            <li key={item.name} className="text-sm border-b py-2">
              <form action={deleteExclude} className="flex gap-1 items-center">
                <input hidden name="name" value={item.name} readOnly />
                <Button size="sm" variant="ghost">
                  <MinusCircle size={15} className="text-red-100 hover:text-red-500 transition-colors" />
                </Button>
                {item.name}
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ExcludedTransactions
