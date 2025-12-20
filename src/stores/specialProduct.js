import { defineStore } from "pinia";
import productsSpecialData from '@/model/productSpecial.json'
export const useProduct = defineStore('productSpecialData',{
  state:()=>({
    products:productsSpecialData,
    cart:[]
 
  }),
  getters:{
    
  },
  actions:{
    
  }
})