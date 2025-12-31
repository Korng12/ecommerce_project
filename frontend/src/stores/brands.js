import { defineStore } from "pinia";
import brands from '@/model/brands.json'
import Brands from "@/components/Brands.vue";
export const useBrand=defineStore('useBrand',{
  state:()=>({
    brands:brands
  }),
  getters:{

  },
  actions:{

  }
})