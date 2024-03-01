'use client'

import { cn } from '@/lib/shadcn-utils'
import { FileMinus, FileQuestion, Home, Receipt, Settings, Tags } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Nav = () => {
  const pathname = usePathname()

  return (
    <nav className="w-48">
      <div className="sticky top-4">
        <Link href="/" className="flex items-center gap-2 font-bold p-2">
          <Receipt /> <span className="font-bold">Loot</span>
        </Link>

        <div className="grid items-center gap-1 mt-4">
          <Link
            title="Manage categories"
            href="/categories"
            className={cn(
              'flex items-center gap-1.5 text-xs px-3 py-2',
              pathname === '/categories' ? 'bg-background rounded-full ' : 'p-2'
            )}
          >
            <Tags strokeWidth={1.5} size={15} /> Categories
          </Link>

          <Link
            title="Uncategorized transactions"
            href="/transactions/uncategorized"
            className={cn(
              'flex items-center gap-1.5 text-xs px-3 py-2',
              pathname === '/transactions/uncategorized' ? 'bg-background rounded-full  ' : 'p-2'
            )}
          >
            <FileQuestion strokeWidth={1.5} size={15} /> Uncategorized
          </Link>

          <Link
            title="Excluded transactions"
            href="/transactions/exclude"
            className={cn(
              'flex items-center gap-1.5 text-xs px-3 py-2',
              pathname === '/transactions/exclude' ? 'bg-background rounded-full  ' : 'p-2'
            )}
          >
            <FileMinus strokeWidth={1.5} size={15} /> Excluded
          </Link>

          <Link
            href="/settings"
            className={cn('flex items-center gap-1.5 text-xs px-3 py-2', pathname === '/settings' ? 'bg-background rounded-full  ' : 'p-2')}
          >
            <Settings strokeWidth={1.5} size={15} /> Settings
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Nav
