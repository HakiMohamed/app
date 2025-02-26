import { useState, useEffect } from "react"
import NetInfo from "@react-native-community/netinfo"

export interface City {
    id: number
    name: string
}

export interface Category {
    id: number
    nom: string
    images: string
}

export interface Product {
    id: number
    nom: string
    prix: number
    description: string
    image: string
}

export interface Offer {
    id: number
    produit_id: number
    new_price: number
    start_date: string
    end_date: string
    produit: {
        id: number
        nom: string
        prix: string
        description: string
        image: string
        categorie_id: number
        visible: number
    }
}

export interface DiscountedProduct {
    id: number
    nom: string
    prix: number
    description: string
    image: string
    discountPercentage: number
    originalPrice: number
    startDate: string
    endDate: string
}

export interface Hero {
    id: number
    title: string
    description: string
    image_url: string
}


export const BASE_URL = "https://gaarage.ma/api/v2"
export const DOMAIN = "https://gaarage.ma"
const PRODUCTS_PER_PAGE = 10

async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}) {
    const { timeout = 10000 } = options
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)


    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...options.headers,
            },
        })
        clearTimeout(id)


        if (!response.ok) {
            const responseText = await response.text()
        }
        return response
    } catch (error) {
        clearTimeout(id)
        throw error
    }
}

class CitiesService {

    static decodeUnicode(str: string): string {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    }

    static getCategoryImageUrl(image: string): string {
        return `${BASE_URL}/image/category/${image}`
    }

    static getProductImageUrl(imageName: string): string {
        return `${BASE_URL}/image/product/${imageName}`
    }

    static useCities() {
        const [cities, setCities] = useState<City[]>([])
        const [isLoading, setIsLoading] = useState(true)
        const [error, setError] = useState<string | null>(null)

        const fetchCitiesData = async () => {
            try {
                const netInfo = await NetInfo.fetch()
                if (!netInfo.isConnected) {
                    throw new Error("No internet connection")
                }

                const response = await fetchWithTimeout(`${BASE_URL}/zones`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()

                const processedCities: City[] = data.map((zone: any) => ({
                    id: zone.id,
                    name: this.decodeUnicode(zone.nom || ""),
                }))

                setCities(processedCities)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error")
            } finally {
                setIsLoading(false)
            }
        }

        useEffect(() => {
            fetchCitiesData()
        }, [])

        return { cities, isLoading, error }
    }

    static useCategories(zoneId: number) {
        const [categories, setCategories] = useState<Category[]>([])
        const [isLoading, setIsLoading] = useState(true)
        const [error, setError] = useState<string | null>(null)

        const fetchCategories = async () => {
            try {
                const netInfo = await NetInfo.fetch()
                if (!netInfo.isConnected) {
                    throw new Error("No internet connection")
                }

                const response = await fetchWithTimeout(`${BASE_URL}/categories/zone/${zoneId}`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()

                const processedCategories: Category[] = (data || []).map((category: any) => ({
                    ...category,
                    nom: this.decodeUnicode(category.nom || ""),
                }))

                setCategories(processedCategories)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load categories")
            } finally {
                setIsLoading(false)
            }
        }

        useEffect(() => {
            if (zoneId > 0) {
                fetchCategories()
            }
        }, [zoneId])

        return { categories, isLoading, error }
    }

    static useProducts(categoryId: number, zoneId: number) {
        const [products, setProducts] = useState<Product[]>([])
        const [isLoading, setIsLoading] = useState(true)
        const [error, setError] = useState<string | null>(null)
        const [page, setPage] = useState(1)
        const [lastPage, setLastPage] = useState(1)
        const [total, setTotal] = useState(0)
        const [isLoadingMore, setIsLoadingMore] = useState(false)

        const loadProducts = async (pageNum: number) => {
            try {
                pageNum === 1 ? setIsLoading(true) : setIsLoadingMore(true)

                const netInfo = await NetInfo.fetch()
                if (!netInfo.isConnected) {
                    throw new Error("No internet connection")
                }

                const response = await fetchWithTimeout(
                    `${BASE_URL}/category/${categoryId}/${zoneId}?page=${pageNum}&per_page=${PRODUCTS_PER_PAGE}`
                )
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()

                const productData = data.data || data || []
                const processedProducts = productData.map((product: any) => ({
                    ...product,
                    nom: this.decodeUnicode(product.nom || ""),
                    description: this.decodeUnicode(product.description || ""),
                }))

                setProducts(processedProducts)
                setPage(data.current_page || pageNum)
                setLastPage(data.last_page || 1)
                setTotal(data.total || processedProducts.length)
                setError(null)
            } catch (err) {
                console.error("Error fetching products:", err)
                setError(err instanceof Error ? err.message : "Failed to load products")
            } finally {
                setIsLoading(false)
                setIsLoadingMore(false)
            }
        }

        useEffect(() => {
            if (categoryId && zoneId) {
                loadProducts(1)
            }
        }, [categoryId, zoneId])

        return {
            products,
            isLoading,
            error,
            page,
            lastPage,
            total,
            isLoadingMore,
            loadProducts
        }
    }

    static useDiscountedProducts(zoneId: number) {
        const [products, setProducts] = useState<DiscountedProduct[]>([])
        const [isLoading, setIsLoading] = useState(true)
        const [error, setError] = useState<string | null>(null)

        const fetchDiscountedProducts = async () => {

            try {
                const netInfo = await NetInfo.fetch()
                if (!netInfo.isConnected) {
                    throw new Error("No internet connection")
                }

                // Use fetchWithTimeout instead of fetch
                const response = await fetchWithTimeout(`${BASE_URL}/offres/${zoneId}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                })


                const responseText = await response.text()

                let data
                try {
                    data = JSON.parse(responseText)
                } catch (e) {
                    throw new Error('Invalid JSON response from server')
                }

                if (!Array.isArray(data)) {
                    setProducts([])
                    return
                }

                const processedProducts: DiscountedProduct[] = data
                    .filter((offer: any) => offer?.produit && offer.produit.visible === 1)
                    .map((offer: any) => {
                        const originalPrice = parseFloat(offer.produit.prix)
                        const newPrice = parseFloat(offer.new_price)
                        const discountPercentage = Math.round(((originalPrice - newPrice) / originalPrice) * 100)

                        return {
                            id: offer.produit.id,
                            nom: CitiesService.decodeUnicode(offer.produit.nom),
                            prix: newPrice,
                            description: CitiesService.decodeUnicode(offer.produit.description),
                            image: offer.produit.image,
                            discountPercentage,
                            originalPrice,
                            startDate: offer.start_date,
                            endDate: offer.end_date
                        }
                    })

                setProducts(processedProducts)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load discounted products")
                setProducts([])
            } finally {
                setIsLoading(false)
            }
        }

        useEffect(() => {
            if (zoneId > 0) {
                fetchDiscountedProducts()
            }
        }, [zoneId])

        return { products, isLoading, error }
    }


    static useHero(heroId: number) {
        const [hero, setHero] = useState<Hero | null>(null)
        const [isLoading, setIsLoading] = useState(true)
        const [error, setError] = useState<string | null>(null)

        const fetchHeroData = async () => {
            try {
                const netInfo = await NetInfo.fetch()
                if (!netInfo.isConnected) {
                    throw new Error("No internet connection")
                }

                const response = await fetchWithTimeout(`${BASE_URL}/hero/${heroId}`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()

                setHero(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load hero data")
            } finally {
                setIsLoading(false)
            }
        }

        useEffect(() => {
            if (heroId > 0) {
                fetchHeroData()
            }
        }, [heroId])

        return { hero, isLoading, error }
    }
}

export default CitiesService
