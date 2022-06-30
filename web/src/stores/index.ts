import { defineStore } from 'pinia'
import { getApiList } from '@/server'
import type { RootObject,Children,ChinaAdd,ChinaTotal } from './type'

export const useStore = defineStore({
  id: 'useStore',
  state: () => ({
    list:<RootObject>{},
    item:<Children[]>[],
    chinaAdd:<ChinaAdd>{},
    chinaTotal:<ChinaTotal>{},
    cityInfo:<Children[]>[]
  }),
  actions: {
    async getList(){
      const data = await getApiList()
      this.list = data
      this.chinaAdd = data.diseaseh5Shelf.chinaAdd
      this.chinaTotal = data.diseaseh5Shelf.chinaTotal
      this.cityInfo = data.diseaseh5Shelf.areaTree[0].children.slice(5,15)
    }
  }
})
