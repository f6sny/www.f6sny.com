declare interface JokesResponse {
  data: Joke[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

declare interface TagResponse {
  data: TagData[]
} 