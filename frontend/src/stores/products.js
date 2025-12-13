import { defineStore } from "pinia";
import productsData from '@/model/products.json'
export const useProduct = defineStore('productStore',{
  state:()=>({
    products:productsData,
    
 
  }),
  getters:{
    getByCategory:(state)=>(catName)=>{
      return state.products.filter(p=>p.category.toLowerCase()===catName.toLowerCase())
    },
    searchSuggestions:(state)=>(query)=>{
      if(!query) return[]
      return state.products.filter(p=>p.name.toLowerCase().includes(query.toLowerCase())).slice(0,5)
    }
  },
  actions:{
    
  }
})