import { defineStore } from "pinia";
import getImageUrl from "../utils/convertImagePath";

export const useProduct = defineStore('productStore',{
  state:()=>({
    products: [],
  }),
  getters:{
    getByCategory:(state)=>(catName)=>{
      if(!catName) return state.products
      return state.products.filter(p=> (p.category || '').toLowerCase()===catName.toLowerCase())
    },
    searchSuggestions:(state)=>(query)=>{
      if(!query) return []
      return state.products.filter(p=> (p.name || '').toLowerCase().includes(query.toLowerCase())).slice(0,5)
    },
    getProductsByBrand:(state)=>(brandName)=>{
      if(!brandName) return state.products
      return state.products.filter(p=> (p.brand || '').toLowerCase()===brandName.toLowerCase())
    },
    getPopularProducts:(state)=>{
      return state.products
        .slice()
        .sort((a,b)=> b.totalReviews - a.totalReviews)
        .slice(0,10)
    }
  },
  actions:{
    async fetchAllProducts(){
      try{
        const res = await fetch('http://localhost:3000/api/products')
        if(!res.ok){
          throw new Error('Failed to fetch products')
        }
        const data = await res.json()
        // Normalize backend shape to what the UI expects
        this.products = Array.isArray(data) ? data.map(p => {
          const primaryImage = (p.images && Array.isArray(p.images)) ? (p.images.find(i => i.isPrimary) || p.images[0]) : null
          // Construct full backend URL for images
          const imageUrl = primaryImage?.imageUrl || ''
          const image = imageUrl ? getImageUrl(imageUrl) : ''
          return {
            id: p.id,
            name: p.name,
            price: p.price,
            image,
            brand: p.brand?.name || '',
            category: p.category?.name || '',
            rating: Number(p.averageRating || 0),
            totalReviews: p.totalReviews || 0,
            description: p.description || ''
          }
        }) : []
      }catch(err){
        console.error('Failed to fetch products:', err)
        this.products = []
        throw err
      }
    },
    async createProduct(productData){
      try{
        const res = await fetch('http://localhost:3000/api/products',{
          method:'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        })
        if(!res.ok){
          throw new Error('Failed to create product')
        }
        const newProduct = await res.json()
        this.products.push({
          ...newProduct,
          image: newProduct.images && newProduct.images.length > 0 ? getImageUrl(newProduct.images[0].imageUrl) : ''
        })
      }catch(err){
        console.error('Failed to create product:', err)
        throw err
      }
    }
  }
})