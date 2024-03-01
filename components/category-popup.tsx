'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { cn } from '@/lib/shadcn-utils'
import { TransactionType } from '@/types/types'
import { ArrowRight, Check, ChevronDown, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import CategoryBadge from './category-badge'
import { addNewKeyword, createNewCategory } from '@/lib/actions'

interface CategoryPopupProps {
  transaction: TransactionType
  categories: { id: number; name: string }[]
}

const FormSchema = z.object({
  category: z.string({
    required_error: 'Please enter a category.',
  }),
  keyword: z.string({
    required_error: 'Enter only a part of this name.',
  }),
})

export function CategoryPopup({ transaction, categories }: CategoryPopupProps) {
  const [transactionName, setTransactionName] = useState(transaction.name)
  const [categorySearchValue, setCategorySearchValue] = useState('')
  const [popoverOpen, setPopoverOpen] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const category_id = categories.find((category) => category.name === data.category)?.id
    console.log('haaaay', data.keyword, category_id)
    addNewKeyword(data.keyword, category_id!)
    setPopoverOpen(false)
  }

  function getUniqueNonNumericWords(text: string) {
    return [...new Set(text.split(' '))].filter(
      (word) => word !== '-' && word !== 'Point' && word !== 'of' && word !== 'Sale' && /\D/.test(word)
    )
  }

  return (
    <Popover open={popoverOpen} onOpenChange={() => setPopoverOpen(!popoverOpen)}>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <PlusCircle size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[620px]" align="end">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-4 w-full">
            <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="w-full">
                    <Input placeholder="Category..." defaultValue={transactionName} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn('w-[200px] justify-between', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? categories.find((category) => category.name === field.value)?.name : 'Select category'}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search..." className="h-9" onValueChange={(value) => setCategorySearchValue(value)} />
                        <CommandEmpty className="p-4 grid gap-4">
                          <div className="text-sm font-bold">Create category:</div>
                          <div className="">
                            <CategoryBadge type={categorySearchValue} />
                          </div>
                          <Button
                            type="button"
                            onClick={async () => {
                              await createNewCategory(categorySearchValue)
                            }}
                          >
                            Create
                          </Button>
                        </CommandEmpty>
                        <CommandGroup>
                          {categories
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((category) => (
                              <CommandItem
                                value={category.name}
                                key={category.id}
                                onSelect={() => {
                                  form.setValue('category', category.name)
                                }}
                              >
                                {category.name}
                                <Check className={cn('ml-auto h-4 w-4', category.name === field.value ? 'opacity-100' : 'opacity-0')} />
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {/* <FormDescription>This is the language that will be used in the dashboard.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              <ArrowRight />
            </Button>
          </form>
          <div className="flex gap-2 mt-3 text-xs">
            {getUniqueNonNumericWords(transaction.name).map((word) => (
              <button onClick={() => form.setValue('keyword', word)} key={word} className="underline hover:decoration-2	">
                {word}
              </button>
            ))}
          </div>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
