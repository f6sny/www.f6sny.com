import { strapi } from '@strapi/client';

const client = strapi({ baseURL: process.env.API_URL || 'http://localhost:1337/api' });

export default client;

// import { strapi } from '@strapi/client';

// const client = strapi({ baseURL: 'http://localhost:1337/api' });


// const API_URL = 'http://localhost:1337/api'

// interface FetchJokesParams {
//   page: number
//   pageSize?: number
//   sort?: string
//   filters?: Record<string, any>
// }

// export const api = {
//   async fetchJokes({
//     page = 1, 
//     pageSize = 10, 
//     sort = 'updatedAt:desc',
//     filters = {
//       '$and': [
//         { joke_status: { '$ne': 'deleted' } },
//         { joke_status: { '$ne': 'pending' } }
//       ]
//     }
//   }: FetchJokesParams) {
//     console.log('Fetching jokes with params:', { page, pageSize, sort, filters })
    
//     // Build the URL manually without encoding
//     let queryParts = [
//       `pagination[page]=${page}`,
//       `pagination[pageSize]=${pageSize}`,
//       `sort=${sort}`
//     ]
    
//     // Add filters
//     const addFilter = (prefix: string, value: any) => {
//       if (typeof value === 'object' && value !== null) {
//         Object.entries(value).forEach(([k, v]) => {
//           addFilter(`${prefix}[${k}]`, v)
//         })
//       } else {
//         // Decode first in case the value is already encoded
//         const decodedValue = decodeURIComponent(value.toString())
//         queryParts.push(`${prefix}=${encodeURIComponent(decodedValue)}`)
//       }
//     }

//     Object.entries(filters).forEach(([key, value]) => {
//       addFilter(`filters[${key}]`, value)
//     })
    
//     // Add populate
//     queryParts.push('populate=user')

//     const finalUrl = `${API_URL}/jokes?${queryParts.join('&')}`
//     console.log('URL:', finalUrl)

//     const response = await fetch(finalUrl)
//     if (!response.ok) throw new Error('Failed to fetch jokes')
//     return response.json()
//   },

//   async fetchTags() {
//     const url = new URL(`${API_URL}/tags`)
//     url.searchParams.append('sort', 'id:desc')
//     url.searchParams.append('populate[jokes][count]', 'true')
//     url.searchParams.append('populate[jokes][filters][joke_status][$notIn]', 'pending')
//     url.searchParams.append('populate[jokes][filters][joke_status][$notIn]', 'deleted')
//     console.log('URL:', url.toString())
//     const response = await fetch(url.toString())
//     // sort the tags by the number of jokes
//     const data = await response.json()
//     data.data.sort((a: any, b: any) => b.jokes.count - a.jokes.count)
//     return data
//   },

//   async fetchStats() {
//     const response = await fetch(`${API_URL}/globalcall/counters`)
//     if (!response.ok) throw new Error('Failed to fetch stats')
//     return response.json()
//   },

//   async fetchTagInfo(slug: string) {
//     console.log('Fetching tag info for slug:', slug)
    
//     // Build query parts manually
//     let queryParts = [
//       `filters[slug][$eq]=${encodeURIComponent(decodeURIComponent(slug))}`,
//       'populate[jokes][count]=true',
//       'populate[jokes][filters][joke_status][$notIn]=pending',
//       'populate[jokes][filters][joke_status][$notIn]=deleted'
//     ]

//     const finalUrl = `${API_URL}/tags?${queryParts.join('&')}`
//     console.log('URL:', finalUrl)

//     const response = await fetch(finalUrl)
//     if (!response.ok) throw new Error('Failed to fetch tag info')
//     return response.json()
//   },

//   async fetchUserJokes(username: string, { page = 1, pageSize = 10 } = {}) {
//     console.log('Fetching jokes for user:', username)
    
//     let queryParts = [
//       `pagination[page]=${page}`,
//       `pagination[pageSize]=${pageSize}`,
//       'sort=updatedAt:desc',
//       `filters[author][username][$eq]=${encodeURIComponent(decodeURIComponent(username))}`,
//       `filters[$and][0][joke_status][$ne]=deleted`,
//       `filters[$and][1][joke_status][$ne]=pending`,
//       'populate=author'
//     ]

//     const finalUrl = `${API_URL}/jokes?${queryParts.join('&')}`
//     console.log('URL:', finalUrl)

//     const response = await fetch(finalUrl)
//     if (!response.ok) throw new Error('Failed to fetch user jokes')
//     return response.json()
//   },

//   async fetchUserInfo(username: string) {
//     console.log('Fetching user info:', username)
    
//     // First get user info
//     let userQueryParts = [
//       `filters[username][$eq]=${encodeURIComponent(decodeURIComponent(username))}`
//     ]

//     const userUrl = `${API_URL}/users?${userQueryParts.join('&')}`
//     console.log('User URL:', userUrl)

//     const userResponse = await fetch(userUrl)
//     if (!userResponse.ok) throw new Error('Failed to fetch user info')
//     const userData = await userResponse.json()

//     // Check if user exists
//     if (!userData || !userData.length) {
//       return null
//     }

//     // Then get joke count
//     let countQueryParts = [
//       'pagination[page]=1',
//       'pagination[pageSize]=1',
//       `filters[author][username][$eq]=${encodeURIComponent(decodeURIComponent(username))}`,
//       `filters[$and][0][joke_status][$ne]=deleted`,
//       `filters[$and][1][joke_status][$ne]=pending`
//     ]

//     const countUrl = `${API_URL}/jokes?${countQueryParts.join('&')}`
//     console.log('Count URL:', countUrl)

//     const countResponse = await fetch(countUrl)
//     if (!countResponse.ok) throw new Error('Failed to fetch joke count')
//     const countData = await countResponse.json()

//     // Combine the data
//     return {
//       ...userData[0],
//       jokes: {
//         count: countData.meta.pagination.total
//       }
//     }
//   },

//   async fetchUsers({ page = 1, pageSize = 20, search = '' } = {}) {
//     console.log('Fetching users:', { page, pageSize, search })
    
//     let queryParts = [
//       `page=${page}`,
//       `pageSize=${pageSize}`,
//       'sort=createdAt:desc'
//     ]

//     if (search) {
//       queryParts.push(`filters[$or][0][username][$contains]=${encodeURIComponent(search)}`)
//       queryParts.push(`filters[$or][1][first_name][$contains]=${encodeURIComponent(search)}`)
//       queryParts.push(`filters[$or][2][last_name][$contains]=${encodeURIComponent(search)}`)
//     }

//     const finalUrl = `${API_URL}/users?${queryParts.join('&')}`
//     console.log('URL:', finalUrl)

//     const response = await fetch(finalUrl)
//     if (!response.ok) throw new Error('Failed to fetch users')
//     return response.json()
//   }
// } 