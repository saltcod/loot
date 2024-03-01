import { handleSearch } from '@/lib/actions'
import Link from 'next/link'

interface SearchProps {
  query?: string
  params?: any
  total?: number
  searchTerm?: string
}

const Search = ({ total, searchTerm }: SearchProps) => {
  return (
    <>
      <div className="flex items-center relative w-full gap-8 ">
        <div className="flex items-center justify-between w-full">
          <form action={handleSearch} className="w-full relative">
            <input
              type="text"
              name="q"
              className="w-full px-4 py-2 rounded-full  bg-background focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Search..."
              defaultValue={searchTerm ?? ''}
              required
              autoFocus
            />
            {searchTerm && (
              <Link href="/" className="hidden md:block rounded-full text-xs  animate-fade-in absolute right-4 top-3">
                Clear
              </Link>
            )}
          </form>
        </div>
        {total && (
          <div className="text-sm hidden md:flex items-center flex-nowrap gap-2 font-bold font-mono">
            ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        )}
      </div>
    </>
  )
}

export default Search
