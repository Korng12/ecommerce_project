import { defineStore } from "pinia";
import productsData from '@/model/products.json'
export const useProduct = defineStore('productStore',{
  state:()=>({
    products:productsData,
 
  }),
  getters:{
    
  },
  actions:{
    
  }
})