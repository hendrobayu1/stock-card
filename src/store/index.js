import Vue from 'vue'
import Vuex from 'vuex'
import menu from '@/store/menu'
import depo from '@/store/depo'
import notif from '@/store/notif'
import komponen from '@/store/komponen'
import komponen_transaksi from '@/store/komponen_transaksi'
import authentikasi from '@/store/authentikasi'
import VuexPersist from 'vuex-persist'

const vuexPersist = new VuexPersist({
  key:'kartu-stok',
  storage:localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    prevUrl:'',
  },
  mutations: {
    setPrevUrl:(state,value)=>{
      state.prevUrl = value
    },
  },
  actions: {
    actPrevUrl:({commit},value)=>{
      commit('setPrevUrl',value)
    },
  },
  getters:{
    prevUrl:state=>state.prevUrl
  },
  modules: {
    menu,
    depo,
    notif,
    komponen,
    authentikasi,
    komponen_transaksi,
  }
})