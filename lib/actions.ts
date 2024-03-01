'use server'
import { TransactionType } from '@/types/types'
import { promises as fs } from 'fs'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prismaClient'
import * as Papa from 'papaparse'
import { redirect } from 'next/navigation'
import { revalidate } from '@/app/search/page'

export async function addTransactionToExcludeList(transaction: TransactionType) {
  const transactionName = transaction.name

  try {
    const filePath = './lib/transaction-exclude-list.txt'
    console.log({ filePath })
    // Read the current content of the file
    const currentContent = await fs.readFile(filePath, 'utf8')

    // Append the new transaction type to the content
    const updatedContent = `${currentContent}${transactionName}\n`

    // Write the updated content back to the file
    await fs.writeFile(filePath, updatedContent, 'utf8')
    revalidatePath(`/`)
    console.log(`Added '${transactionName}' to the transaction exclude list.`)
  } catch (error) {
    console.error('Error adding transaction:', error)
  }
}

export async function removeExcludedTransaction(formData: FormData) {
  const transactionNameToRemove = formData.get('transaction')
  try {
    const filePath = './lib/transaction-exclude-list.txt'

    // Read the current content of the file
    const currentContent = await fs.readFile(filePath, 'utf8')

    // Split the content into lines and filter out the line to be removed
    const lines = currentContent.split('\n')
    const updatedLines = lines.filter((line) => line.trim() !== transactionNameToRemove)

    // Join the updated lines and write the updated content back to the file
    const updatedContent = updatedLines.join('\n')
    await fs.writeFile(filePath, updatedContent, 'utf8')
    revalidatePath('/settings')
    console.log(`Removed '${transactionNameToRemove}' from the transaction exclude list.`)
  } catch (error) {
    console.error('Error removing transaction:', error)
  }
}

export async function importCsvToDatabase2(fileContents: string) {
  try {
    const results: any[] = []

    Papa.parse(fileContents, {
      header: true,
      skipEmptyLines: true,
      step: (row: any) => {
        // Define the type for row as Papa.Row<string>
        //const cleanedDate = row.data.date.trim() // Clean the date string

        // Check if 'amount' is defined and not an empty string
        if (typeof row.data.amount !== 'undefined' && row.data.amount.trim() !== '') {
          // Parse and assign the amount
          const parsedAmount = parseFloat(row.data.amount)
          row.data.amount = parsedAmount
          results.push(row.data)
        }
      },
      complete: async () => {
        for (const row of results) {
          await prisma.transactions.create({
            data: {
              name: row.name,
              amount: row.amount,
              date: new Date(row.date),
            },
          })
        }
        console.log('CSV data has been imported into the database.')
      },
    })

    return true // Return true to indicate success
  } catch (error) {
    console.error('Error importing CSV data:', error)
    return false // Return false to indicate failure
  } finally {
    await prisma.$disconnect()
  }
}

export async function deleteAllTransactions() {
  try {
    const deleteResult = await prisma.transactions.deleteMany()
    console.log(`Deleted ${deleteResult.count} records.`)
  } catch (error) {
    console.error('Error deleting records:', error)
  } finally {
    await prisma.$disconnect()
  }
}

export async function seedCategories() {
  const categoryData = [
    { category: 'grocery', keyword: 'sobeys' },
    { category: 'electronics', keyword: 'best buy' },
  ]

  try {
    for (const data of categoryData) {
      const category = await prisma.categoriesLookup.create({
        data: {
          category: data.category,
        },
      })

      await prisma.categories.create({
        data: {
          keyword: data.keyword,
          categoryId: category.id, // Associate the keyword with the category
        },
      })
    }

    console.log('Seed data inserted successfully.')
  } catch (error) {
    console.error('Error seeding data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

export async function handleSearch(formData: FormData) {
  const searchTerm = formData.get('q')
  redirect(`/search?q=${searchTerm}`)
}

export async function createNewCategory(categoryName: string) {
  console.log({ categoryName })
  try {
    const category = await prisma.category.create({
      data: {
        name: categoryName,
      },
    })
    revalidatePath('/')
    console.log(`Category "${categoryName}" created with ID: ${category.id}`)
  } catch (error) {
    console.error('Error creating category:', error)
  } finally {
    await prisma.$disconnect()
  }
}

export async function createNewCategoryServer(formData: FormData) {
  const categoryName = formData.get('category')

  try {
    const category = await prisma.category.create({
      data: {
        name: categoryName,
      },
    })
    revalidatePath('/')
    console.log(`Category "${category}" created with ID: ${category.id}`)
  } catch (error) {
    console.error('Error creating category:', error)
  } finally {
    await prisma.$disconnect()
  }
}

export async function updateCategory(id: number, newValue: string) {
  console.log('newValue', newValue)
  try {
    const updatedCategory = await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name: newValue,
      },
    })

    revalidatePath('/categories')
  } catch (error) {
    console.error('Error creating category:', error)
  } finally {
    await prisma.$disconnect()
  }
}

export async function deleteCategory(formData: FormData) {
  const category_id = formData.get('category_id')
  console.log({ category_id })
  try {
    const category = await prisma.category.delete({
      where: {
        //@ts-ignore
        id: Number(category_id),
      },
    })

    revalidatePath('/categories')
  } catch (error) {
    console.error('Error creating category:', error)
  } finally {
    await prisma.$disconnect()
  }
}

//export async function addNewKeyword(newKeyword: string, categoryID: number) {
export async function addNewKeyword(newKeyword: string, category_id: number) {
  console.log('prisma side', newKeyword, category_id)
  try {
    const keyword = await prisma.keyword.create({
      data: {
        name: newKeyword.toLowerCase(),
        categories: {
          connect: {
            id: Number(category_id),
          },
        },
      },
    })

    revalidatePath('/')
    console.log(`Category "${keyword}" created with ID: ${keyword}`)
  } catch (error) {
    console.error('Error creating category:', error)
  } finally {
    await prisma.$disconnect()
  }
}

export async function detachKeyword(formData: FormData) {
  const keyword = formData.get('keyword')
  const category_id = formData.get('category_id')

  if (keyword !== null && typeof keyword === 'string') {
    try {
      const updatedKeyword = await prisma.keyword.update({
        where: {
          name: keyword,
        },
        data: {
          categories: {
            disconnect: {
              id: Number(category_id),
            },
          },
        },
      })
      revalidatePath('/categories')
      // Handle success or additional logic after disconnection
    } catch (error) {
      console.error('Error disconnecting keyword from category:', error)
    }
  } else {
    console.error('Invalid keyword:', keyword)
  }
}

export async function excludeName(formData: FormData) {
  const name = formData.get('name')

  try {
    const exclude = await prisma.exclude.create({
      data: {
        //@ts-ignore
        name: name,
      },
    })
    revalidatePath('/transactions/exclude')
    // Handle success or additional logic after disconnection
  } catch (error) {
    console.error('Error disconnecting keyword from category:', error)
  }
}

export async function addExclude(name: string) {
  try {
    const exclude = await prisma.exclude.create({
      //@ts-ignore
      data: {
        name: name,
      },
    })
    //revalidatePath('/transactions/exclude')
    revalidatePath('/', 'layout')
    // Handle success or additional logic after disconnection
  } catch (error) {
    console.error('Error disconnecting keyword from category:', error)
  }
}

export async function deleteExclude(formData: FormData) {
  const name = formData.get('name')

  try {
    const exclude = await prisma.exclude.delete({
      where: {
        //@ts-ignore
        name: name,
      },
    })
    //revalidatePath('/transactions/exclude')
    revalidatePath('/', 'layout')
    revalidatePath('/transactions/exclude')

    // Handle success or additional logic after disconnection
  } catch (error) {
    console.error('Error disconnecting keyword from category:', error)
  }
}
