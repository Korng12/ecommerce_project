import { defineStore } from "pinia";
import banners from '@/model/banners.json'
export const useBanner=defineStore('bannerStore',{
  state:()=>({
    banners:banners
  }),
  getters:{

  },
  actions:{

  }
})