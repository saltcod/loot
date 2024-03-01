'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createNewCategoryServer } from '@/lib/actions'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

const AddNewCategory = () => {
  const [value, setValue] = useState('')

  async function handleSubmit(formData: FormData) {
    createNewCategoryServer(formData)
    setValue('')
  }

  return (
    <form action={handleSubmit} className="flex items-center gap-4 max-w-lg">
      <Input type="text" value={value} name="category" placeholder="New category" onChange={(e) => setValue(e.target.value)} />
      <Button type="submit" className="flex items-center gap-1" size="sm" variant="default">
        <ArrowRight size={14} />
      </Button>
    </form>
  )
}

export default AddNewCategory
