export type Book = {
    id: string,
    status: string,
    added_at: string,
    books: {
        id: string,
        title: string,
        authors: string[],
        description: string | null ,
        page_count: number | null,
        cover_url: string | null,
        isbn_13: string | null
    }
} | null

export interface GoogleBooksResponse {
  kind: string
  totalItems: number
  items: BookItem[]
}

export interface BookItem {
  kind: string
  id: string
  etag: string
  selfLink: string
  volumeInfo: VolumeInfo
  saleInfo: SaleInfo
  accessInfo: AccessInfo
  searchInfo?: SearchInfo
}

export interface VolumeInfo {
  title: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  industryIdentifiers?: IndustryIdentifier[]
  readingModes: ReadingModes
  pageCount?: number
  printType: string
  categories?: string[]
  averageRating?: number
  ratingsCount?: number
  maturityRating: string
  allowAnonLogging: boolean
  contentVersion: string
  panelizationSummary?: PanelizationSummary
  imageLinks?: ImageLinks  // ← optional! some books have no cover
  language: string
  previewLink: string
  infoLink: string
  canonicalVolumeLink: string
}

export interface IndustryIdentifier {
  type: string
  identifier: string
}

export interface ReadingModes {
  text: boolean
  image: boolean
}

export interface PanelizationSummary {
  containsEpubBubbles: boolean
  containsImageBubbles: boolean
}

export interface ImageLinks {
  smallThumbnail: string
  thumbnail: string
}

export interface SaleInfo {
  country: string
  saleability: string
  isEbook: boolean
  listPrice?: ListPrice
  retailPrice?: RetailPrice
  buyLink?: string
  offers?: Offer[]
}

export interface ListPrice {
  amount: number
  currencyCode: string
}

export interface RetailPrice {
  amount: number
  currencyCode: string
}

export interface Offer {
  finskyOfferType: number
  listPrice: { amountInMicros: number; currencyCode: string }
  retailPrice: { amountInMicros: number; currencyCode: string }
}

export interface AccessInfo {
  country: string
  viewability: string
  embeddable: boolean
  publicDomain: boolean
  textToSpeechPermission: string
  epub: { isAvailable: boolean; acsTokenLink?: string }
  pdf: { isAvailable: boolean; acsTokenLink?: string }
  webReaderLink: string
  accessViewStatus: string
  quoteSharingAllowed: boolean
}

export interface SearchInfo {
  textSnippet: string
}

