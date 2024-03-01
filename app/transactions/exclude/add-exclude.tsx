'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addExclude } from '@/lib/actions'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

const AddExclude = () => {
  const [name, setName] = useState('')

  function handleFormSubmit() {
    addExclude(name)
    setName('')
  }

  return (
    <form onSubmit={handleFormSubmit} className="flex items-center gap-4 max-w-lg">
      <Input autoFocus name="keyword" placeholder="Excluded term..." value={name} onChange={(e) => setName(e.target.value)} />
      <Button type="submit" className="flex items-center gap-1" size="sm" variant="secondary">
        <ArrowRight size={14} />
      </Button>
    </form>
  )
}

export default AddExclude
