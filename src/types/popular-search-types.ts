export type PopularSearch = {
  id: string // Unique identifier for the popular search entry
  searchTerm: string // The search term that is popular
  popularityScore: number // Score indicating how popular the search term is
  createdAt: string // Timestamp for when the popular search entry was created
  updatedAt: string // Timestamp for when the popular search entry was last updated
}
