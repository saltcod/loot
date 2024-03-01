import { Button } from '@/components/ui/button'
import { detachKeyword } from '@/lib/actions'
import prisma from '@/lib/prismaClient'
import { X } from 'lucide-react'

import { CategoryWithKeywords } from '@/types/types'
import AddNewCategory from './add-new-category'
import AddNewKeyword from './add-new-keyword'
import ShowOrEditCategory from './show-or-edit-category'

const Categories = async () => {
  // get a list of categories along with the associated keywords

  async function getUniqueCategoriesWithKeywords() {
    const categoriesWithKeywords: CategoryWithKeywords[] = await prisma.category.findMany({
      include: {
        keywords: true,
      },
    })

    const uniqueCategories: CategoryWithKeywords[] = categoriesWithKeywords.reduce((acc: CategoryWithKeywords[], category) => {
      const existingCategory = acc.find((c) => c.id === category.id)

      if (!existingCategory) {
        acc.push({
          id: category.id,
          name: category.name,
          keywords: category.keywords,
        })
      }

      return acc
    }, [])

    return uniqueCategories
  }

  // Example usage
  const uniqueCategoriesWithKeywords = await getUniqueCategoriesWithKeywords()

  return (
    <div>
      <h2 className="font-bold">Categories</h2>
      <div className="mt-12">
        <AddNewCategory />
      </div>
      <ul className="mt-8 gap-24 font-mono grid">
        {uniqueCategoriesWithKeywords.map((category) => (
          <li key={category.name} className="grid grid-cols-2 gap-4 bg-background p-4 rounded-lg">
            <div>
              <span className="sticky top-4">
                <ShowOrEditCategory category={category} />
              </span>
            </div>

            <ul className="grid gap-4 ">
              {category.keywords
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((keyword) => (
                  <li key={keyword.id} className="">
                    <form action={detachKeyword} className="flex items-center gap-1 text-sm justify-between border-b py-2">
                      {keyword.name}
                      <input hidden name="keyword" value={keyword.name} />
                      <input hidden name="category_id" value={category.id} />
                      <Button type="submit" className="flex items-center gap-1" size="sm" variant="secondary">
                        <X size={14} />
                      </Button>
                    </form>
                  </li>
                ))}

              <AddNewKeyword category_id={category.id} />
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Categories
