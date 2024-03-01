'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addNewKeyword } from '@/lib/actions'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface AddNewCategoryProps {
  category_id: number
}

const AddNewKeyword = ({ category_id }: AddNewCategoryProps) => {
  const [keyword, setKeyword] = useState('')

  async function handleSubmit(keyword: string, category_id: number) {
    addNewKeyword(keyword, category_id)
    setKeyword('')
  }

  return (
    <form action={() => handleSubmit(keyword, category_id)} className="flex items-center gap-4 ">
      <Input name="keyword" placeholder="New keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <input hidden type="text" name="category_id" value={category_id} />
      <Button type="submit" className="flex items-center gap-1" size="sm" variant="secondary">
        <ArrowRight size={14} />
      </Button>
    </form>
  )
}

export default AddNewKeyword
