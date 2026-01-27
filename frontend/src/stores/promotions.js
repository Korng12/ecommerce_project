
import { defineStore } from "pinia";
export const usePromotion=defineStore('promotionStore',{
    state:()=>({
        promotions:[],
        loading:false,
    }),
    getters:{

    },
    actions:{
        async fetchAllPromotions(){
            this.loading = true;
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
            }finally{
                this.loading = false;
            }
        },

        async createPromotion(promotionData){
            this.loading = true;
            try{
                const res = await fetch('http://localhost:3000/api/promotions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(promotionData)
                });

                if(!res.ok){
                    const error = await res.json();
                    throw new Error(error.message || 'Failed to create promotion');
                }

                const data = await res.json();
                this.promotions.push(data);
                return data;
            }catch(err){
                console.error('Failed to create promotion:', err);
                throw err;
            }finally{
                this.loading = false;
            }
        },

        async updatePromotion(promotionId, promotionData){
            this.loading = true;
            try{
                const res = await fetch(`http://localhost:3000/api/promotions/${promotionId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(promotionData)
                });

                if(!res.ok){
                    const error = await res.json();
                    throw new Error(error.message || 'Failed to update promotion');
                }

                const data = await res.json();
                const index = this.promotions.findIndex(p => p.id === promotionId);
                if(index > -1){
                    this.promotions[index] = data;
                }
                return data;
            }catch(err){
                console.error('Failed to update promotion:', err);
                throw err;
            }finally{
                this.loading = false;
            }
        },

        async deletePromotion(promotionId){
            this.loading = true;
            try{
                const res = await fetch(`http://localhost:3000/api/promotions/${promotionId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if(!res.ok){
                    const error = await res.json();
                    throw new Error(error.message || 'Failed to delete promotion');
                }

                this.promotions = this.promotions.filter(p => p.id !== promotionId);
            }catch(err){
                console.error('Failed to delete promotion:', err);
                throw err;
            }finally{
                this.loading = false;
            }
        }
    }
})