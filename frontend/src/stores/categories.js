import { defineStore } from "pinia";
import categoriesData from '@/model/categories.json'
export const useCategory=defineStore('categoryStore',{
  state:()=>({
    categories:categoriesData
  }),
  getters:{

  },
  actions:{

  }
})