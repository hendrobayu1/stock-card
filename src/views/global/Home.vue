<template>
  <div>
    <v-autocomplete label="Lokasi inventori" :items="depos" 
    v-model="objDepo" item-text="layanan" item-value="kode_mutasi" return-object @input="fillData" id="scroll-target" />
    <v-divider v-if="objDepo.kode_mutasi!=null" />
    
    <v-btn v-scroll="onScroll" v-show="fab" fab dark fixed bottom right color="error" @click="toTop()">
        <v-icon>mdi-apple-keyboard-control</v-icon>
    </v-btn>

    <v-container class="ma-0 pa-0" grid-list-sm v-if="objDepo.kode_mutasi!=null">
      <div class="text-right" v-if="boxes.length>0">
        <v-btn small text to="/boxes" class="blue--text">Semua rak penyimpanan <v-icon>mdi-chevron-double-right</v-icon></v-btn>
      </div>
      <v-layout wrap v-if="isMobile()">
          <v-flex v-for="(box,index) in boxes" :key="`box-`+index" xs3>
              <v-card :to="'/box/'+box.idlemari" :index="index" color="white">
                  <v-img :src="getImage('/boxes/','')" class="red--text">
                    <v-card-title class="fill-height align-end" v-text="box.nmlemari" />
                  </v-img>
              </v-card>
          </v-flex>
      </v-layout>
      <v-layout wrap v-else>
          <v-flex v-for="(box,index) in boxes" :key="`box-`+index" xs2>
              <v-card :to="'/box/'+box.idlemari" :index="index" color="white">
                  <v-img :src="getImage('/boxes/','')" class="red--text">
                    <v-card-title class="fill-height align-end" v-text="box.nmlemari" />
                  </v-img>
              </v-card>
          </v-flex>
      </v-layout>
    </v-container>
    
    <v-container class="ma-0 pa-0" grid-list-sm v-if="objDepo.kode_mutasi!=null">
      <div class="text-right mt-5" v-if="medicines.length>0">
        <v-btn small text to="/medicines" class="blue--text">Semua obat <v-icon>mdi-chevron-double-right</v-icon></v-btn>
      </div>
      <v-layout wrap v-if="isMobile()">
        <v-flex v-for="(medicine,index) in medicines" :key="`medicine-`+index" xs3>
          <medicine-item :medicine="medicine" />
        </v-flex>
      </v-layout>
      <v-layout wrap v-else>
        <v-flex v-for="(medicine,index) in medicines" :key="`medicine-`+index" xs2>
          <medicine-item :medicine="medicine" />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import {mapActions,mapGetters} from 'vuex'
export default {
  name: 'Home',
  components: {
    MedicineItem:() => import('@/components/kartu_stok_master/MedicineItem.vue')
  },
  data(){
    return {
      depos:[],
      objDepo:{kode_mutasi:null,layanan:null},
      boxes:[],
      medicines:[],
      fab:false,
    }
  },
  computed:{
    ...mapGetters({
      kode_unit:'depo/kode_unit',
      unit:'depo/unit'
    })
  },
  created(){
    // console.log(this.tokenGuest)
    this.axios.post('/kartu-stok/list-depo',{},this.tokenGuest)
    .then((response)=>{
      let{data} = response.data
      this.depos = data
    })
    .catch((error)=>{
      let {data} = error.response
      console.log(data.message)
    })
  },
  mounted(){
      if(this.kode_unit!='0'){
        this.objDepo = {
          kode_mutasi:this.kode_unit,
          layanan:this.unit
        }
        this.boxesByDepo()
        this.medicinesByDepo()
      }
  },
  methods:{
    ...mapActions({
      setDepo:'depo/actDepo'
    }),
    isMobile(){
      if(screen.width<=960){
        return true
      }else{
        return false
      }
    },
    onScroll (e) {
        if (typeof window === 'undefined') return
        const top = window.pageYOffset || e.target.scrollTop || 0
        this.fab = top > 50
    },
    toTop () {
        this.$vuetify.goTo(0)
    },
    fillData(){
      this.setDepo({
        kode_unit:this.objDepo.kode_mutasi,
        unit:this.objDepo.layanan,
      })
      this.boxesByDepo()
      this.medicinesByDepo()
    },
    boxesByDepo(){
      this.boxes = []
      let fr = new FormData()
      fr.set('kdmut',this.objDepo.kode_mutasi)
      this.axios.post('/kartu-stok/random-lemari',fr,this.tokenGuest)
      .then((response)=>{
        let {data} = response.data
        this.boxes = data
      })
      .catch((error)=>{
        let {data} = error.response
        console.log(data.message)
      })
    },
    medicinesByDepo(){
      this.boxes = []
      let fr = new FormData()
      fr.set('kdmut',this.objDepo.kode_mutasi)
      this.axios.post('/kartu-stok/top-obat',fr,this.tokenGuest)
      .then((response)=>{
        let {data} = response.data
        this.medicines = data
      })
      .catch((error)=>{
        let {data} = error.response
        console.log(data.message)
      })
    }
  },
}
</script>
