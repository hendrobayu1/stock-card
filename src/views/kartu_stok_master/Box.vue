<template>
    <div>
        <v-card color="#385F73" dark v-if="box.id_lemari" :to="'/box/'+box.id_lemari" id="scroll-target">
            <v-card-title class="headlilne justify-center"  v-text="box.lemari + ' (' + unit + ' - ' + kode_unit + ')'" />
        </v-card>
        <v-btn v-scroll="onScroll" v-show="fab" fab dark fixed bottom right color="error" @click="toTop()">
            <v-icon>mdi-apple-keyboard-control</v-icon>
        </v-btn>
        <v-container class="ma-0 pa-0" grid-list-sm v-if="medicines">
            <v-subheader>Semua obat</v-subheader>
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
        <v-pagination v-model="page" @input="go" :length="lengthPage" :total-visible="5" />
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    components:{
        MedicineItem:() => import('@/components/kartu_stok_master/MedicineItem.vue')
    },
    data:()=>({
        box:{},
        medicines:[],
        page:0,
        lengthPage:0,
        fab:false,
    }),
    computed:{
        ...mapGetters({
            kode_unit:'depo/kode_unit',
            unit:'depo/unit',
        }),
    },
    created(){
        this.go()
    },
    methods:{
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
        go(){
            let {id} = this.$route.params
            let url = 'kartu-stok/info-lemari/'+id+'?page='+this.page
            this.axios.post(url,{},this.tokenGuest)
            .then((response)=>{
                let {data} = response.data
                this.box = data
                this.medicines = data.obat.data
                this.page = data.obat.current_page
                this.lengthPage = data.obat.last_page
            })
            .catch((error)=>{
                let {data} = error.response
                console.log(data.message)
            })
        }
    },
}
</script>