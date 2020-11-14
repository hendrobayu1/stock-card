import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/global/Home.vue'
import store from '../store/index.js'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/global/About.vue')
  },
  {
    path:'/boxes',
    name:'Boxes',
    component:() => import('../views/kartu_stok_master/Boxes.vue')
  },
  {
    path:'/medicines',
    name:'Medicines',
    component:() => import('../views/kartu_stok_master/Medicines.vue')
  },
  {
    path:'/box/:id',
    name:'Box',
    component:() => import('../views/kartu_stok_master/Box.vue')
  },
  {
    path:'/medicine/:id',
    name:'Medicine',
    component:() => import('../views/kartu_stok_master/Medicine.vue')
  },
  {
    path:'/profil',
    name:'Profile',
    component:() => import('../views/global/Profile.vue'),
    meta:{auth:true},
  },
  {
    path:'/info-barang',
    name:'Info-Barang',
    component:() => import('../views/kartu_stok_master/InfoMedicine.vue'),
    meta:{auth:true},
  },
  {
    path:'/registrasi',
    name:'Registrasi',
    component:() => import('../views/global/Registrasi.vue'),
    meta:{auth:true},
  },
  {
    path:'/list-lemari',
    name:'List-Lemari',
    component:() => import('../views/kartu_stok_master/Lemari.vue'),
    meta:{auth:true},
  },
  {
    path:'/registrasi-obat',
    name:'Registrasi-Obat',
    component:() => import('../views/kartu_stok_master/RegistrasiBarang.vue'),
    meta:{auth:true},
  },
  {
    path:'/transaksi',
    name:'Transaksi',
    component:() => import('../views/kartu_stok_transaksi/Transaksi.vue'),
    meta:{auth:true},
  },
  {
    path:'/transfer-stok',
    name:'Transfer-Stok',
    component:() => import('../views/kartu_stok_transaksi/TransferStok.vue'),
    meta:{auth:true},
  },
  {
    path:'/laporan',
    name:'Laporan-Stok',
    component:() => import('../views/kartu_stok_laporan/MyReport.vue'),
    meta:{auth:true},
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  // if(to.path=='/'){
  //   store.dispatch('depo/actDepo',{
  //     kode_unit:'',
  //     unit:'',
  //   })
  // }
  
  if(to.matched.some(record=>record.meta.auth)){
    // console.log(to.matched.some(route => route.meta.requiresSession))
    if(store.getters['authentikasi/guest']){
    // if(!to.matched.some(route => route.meta.requiresSession)){
      store.dispatch('notif/actNotif',{
        status:true,
        text:'Login first',
        color:'error',
      })
      store.dispatch('actPrevUrl',to.path)
      store.dispatch('komponen/actComponent','login')
      // store.dispatch('komponen/actStatus',true)
    }else{
      next()
    }
  }else{
    next()
  }
})
export default router
