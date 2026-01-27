import { defineStore } from "pinia";
import brands from "@/model/brands.json";

export const useBrand = defineStore("useBrand", {
  state: () => ({
    brands:[]
  }),
  getters: {},
  actions: {
    async fetchAllBrands(){
      try{
        const res = await fetch('http://localhost:3000/api/brands') 
        if(!res.ok){
          throw new Error('Failed to fetch brands')
        }
        const data = await res.json()
        this.brands=Array.isArray(data) ? data : []
      }catch(err){
        console.error('Failed to fetch brands:', err)
        this.brands=[]
        throw err
      }
    },
    async fetchBrands(){
      return await this.fetchAllBrands()
    }
  }
});
