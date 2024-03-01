import classNames from 'classnames'
import Link from 'next/link'

export default function CategoryBadge({ type }: { type: string }) {
  return (
    <Link href={`/transactions/category/${type}`} className="">
      <button
        className={classNames(
          'bg-gray-100 hover:bg-gray-200 transition-colors py-1 px-2 font-bold text-xs font-mono rounded-xl uppercase '
        )}
      >
        {type}
      </button>
    </Link>
  )
}
