const API_key = process.env.GOOGLE_BOOKS_API_KEY!
const BASE_URL = 'https://www.googleapis.com/books/v1'

export async function searchBooks(query: string) {
    const url = `${BASE_URL}/volumes?q=${query}&key=${API_key}&maxResults=8`

    const res = await fetch(url)

    if(!res.ok){
        throw new Error('Google Books API request failed')
    }

    const data = await res.json()
    if(!data.items){
        return []
    }

    return data;
}

export async function getBookById(volumeId: string) {
    const url = `${BASE_URL}/volumes/${volumeId}`

    const res = await fetch(url)

    if(!res.ok){
        throw new Error('Google Books API request failed')
    }
    const data = await res.json()
    return data
}