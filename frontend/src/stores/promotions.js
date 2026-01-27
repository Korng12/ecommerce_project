import Promotions from "@/components/admin/Promotions.vue";
import { defineStore } from "pinia";
export const usePromotionStore=defineStore('promotionStore',{
    state:()=>({
        promotions:[]
    }),
    getters:{

    },
    actions:{
        async fetchAllPromotions(){
            try{
                const res = await fetch('http://localhost:3000/api/promotions')
                if(!res.ok){
                    throw new Error('Failed to fetch promotions')
                }
                const data = await res.json()
                this.promotions=Array.isArray(data)?data:[]
            }catch(err){
                console.error('Failed to fetch promotions:', err)
                this.promotions=[]
                throw err
            }
        }
    }
})