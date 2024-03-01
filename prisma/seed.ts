import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categoriesData = [{ category: 'grocery' }, { category: 'travel' }]
const kewords = [
  { keyword: 'sobeys', categoryId: 1 },
  { keyword: 'etihad', categoryId: 2 },
]

async function seedCategories() {
  try {
    for (const data of categoriesData) {
      await prisma.categories.create({
        data: {
          category: data.category,
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

seedCategories()
