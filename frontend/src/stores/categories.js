
import { defineStore } from "pinia";
export const useCategory=defineStore('categoryStore',{
  state:()=>({
    categories:[]
  }),
  getters:{

  },
  actions:{
    async fetchAllCategories(){
      try{
        const res=await fetch('http://localhost:3000/api/categories')
        if(!res.ok){
          throw new Error('Failed to fetch categories')
        }
        const data=await res.json()
        this.categories=Array.isArray(data)?data.map(c=>({
          id:c.id,
          name:c.name,
          description:c.description,
          image:c.image
        })):[]
      }catch(err){
        console.error('Failed to fetch categories:',err)
        this.categories=[]
        throw err
      }
    }
  }
})