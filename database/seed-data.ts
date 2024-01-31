interface seedCategory {
  category: string
  slug: string
}

interface SeedData {
  categories: seedCategory[]
}

export const initialData: SeedData = {
  categories: [
    {
      category: 'Audífonos',
      slug: 'audifonos'
    },
    {
      category: 'Carcasas Airpods',
      slug: 'carcasas-airpods'
    }
  ]
}