export type RecordType = 'Grocery' | 'Online' | undefined

export type TransactionType = { id: number; date: Date; name: string; amount: number; category: string }

export interface CategoryWithKeywords {
  id: number
  name: string
  keywords: {
    id: number
    name: string
  }[]
}
