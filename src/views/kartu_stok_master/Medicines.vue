<template>
    <div>
        <v-container class="ma-0 pa-0" grid-list-sm>
            <v-subheader id="scroll-target">Semua obat ({{unit}} - {{kode_unit}})</v-subheader>
            <v-btn v-scroll="onScroll" v-show="fab" fab dark fixed bottom right color="error" @click="toTop()">
                <v-icon>mdi-apple-keyboard-control</v-icon>
            </v-btn>
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
        <v-pagination v-model="page" @input="go" :length="lengthPage" :total-visible="10" />
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data:()=>({
        medicines:[],
        page:0,
        lengthPage:0,
        fab:false,
    }),
    components: {
        MedicineItem:() => import('@/components/kartu_stok_master/MedicineItem.vue')
    },
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
            this.fab = top > 30
        },
        toTop () {
            this.$vuetify.goTo(0)
        },
        go(){
            let fr=new FormData()
            fr.set('kdmut',this.kode_unit)
            let url = "/kartu-stok/obat?page=" + this.page
            this.axios.post(url,fr,this.tokenGuest)
            .then((response)=>{
                let {data} = response.data.data
                this.page = response.data.data.current_page
                this.lengthPage = response.data.data.last_page
                this.medicines =data
            })
            .catch((error)=>{
                // let {data} = error.response
                let {data} = error.response
                console.log(data.message)
            })
        }
    }
}
</script>