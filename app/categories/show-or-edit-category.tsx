'use client'
import CategoryBadge from '@/components/category-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteCategory, updateCategory } from '@/lib/actions'
import { CategoryWithKeywords } from '@/types/types'
import { ArrowRight, Edit, Trash, X } from 'lucide-react'
import { useState } from 'react'

interface ShowOrEditCategoryProps {
  category: CategoryWithKeywords
}
const ShowOrEditCategory = ({ category }: ShowOrEditCategoryProps) => {
  const [showEdit, setShowEdit] = useState(false)
  const [newValue, setNewValue] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleSubmit(e: any) {
    e.preventDefault()
    updateCategory(category.id, newValue)
  }

  function handleDelete(e: any) {
    e.preventDefault()
    const target = e.currentTarget
    const formData = new FormData(target)
    deleteCategory(formData)
    target.reset()
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        {showEdit ? (
          <form onSubmit={(e) => handleSubmit(e)} className="flex items-center gap-4">
            <Input autoFocus placeholder={category.name} value={newValue} onChange={(e) => setNewValue(e.target.value)} />
            <Button className="flex items-center gap-1" size="sm" variant="secondary">
              <ArrowRight size={14} />
            </Button>
          </form>
        ) : (
          <CategoryBadge type={category.name} />
        )}
        <div className="flex gap-2">
          {!showEdit && (
            <div className="flex gap-0.5 items-center">
              <Button variant="ghost" size={'sm'} className="" onClick={() => setShowEdit(!showEdit)}>
                <Edit size={14} />
              </Button>
              <Button variant="ghost" size={'sm'} className="group" onClick={() => setConfirmOpen(true)}>
                <Trash size={14} className="text-red-300 group-hover:text-red-500 transition-colors" />
              </Button>
            </div>
          )}

          {showEdit && (
            <Button variant="secondary" size={'sm'} onClick={() => setShowEdit(false)} className="group">
              <X size={14} className="text-red-300 group-hover:text-red-500 transition-colors" />
            </Button>
          )}
        </div>
      </div>
      {confirmOpen && (
        <div className="bg-yellow-50 rounded-xl p-4">
          <form onSubmit={handleDelete}>
            <p className="text-xs mb-2">
              Sure you want to delete category: <u>{category.name}</u>?
            </p>
            <div className="flex items-center gap-2">
              <Button variant="destructive" size={'sm'} className="group flex items-center gap-2" type="submit">
                <span className="text-xs">Confirm</span> <ArrowRight size={14} />
              </Button>
              <Button variant="link" size={'sm'} className="group flex items-center gap-2" onClick={() => setConfirmOpen(false)}>
                <span className="text-xs">Cancel</span>
              </Button>
            </div>
            <input hidden type="text" name="category_id" value={category.id} />
          </form>
        </div>
      )}
    </div>
  )
}

export default ShowOrEditCategory
