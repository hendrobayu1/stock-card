<template>
    <v-card>
        <v-toolbar dark color="primary">
        <!-- <v-toolbar flat color="transparent"> -->
            <v-btn icon dark @click.native="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-text-field slot="extension" hide-details 
                append-icon="mdi-microphone" flat label="Cari Obat" solo-inverted 
                prepend-inner-icon="mdi-magnify" v-model="keyword" @input="cari" ref="keyword">
            </v-text-field>
        </v-toolbar>
        <v-card-text>
            <v-subheader v-if="keyword.length>0">
                Hasil pencarian {{keyword}} di {{unit}}
            </v-subheader>
            <v-alert color="warning" :value="keyword.length>0 && medicines.length==0">
                Maaf, obat tidak ditemukan
            </v-alert>

            <v-container class="ma-0 pa-0" grid-list-sm>
                <v-layout wrap>
                    <v-flex v-for="(medicine,index) in medicines" :key="`medicine-`+index" xs3>
                        <medicine-item :medicine="medicine" @click.native="close" />
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    name:'search',
    components:{
        MedicineItem:()=>import('@/components/kartu_stok_master/MedicineItem.vue')
    },
    data:()=>({
      keyword:'',
      medicines:[],
    }),
    computed:{
        ...mapGetters({
            kode_unit:'depo/kode_unit',
            unit:'depo/unit',
        })
    },
    mounted(){
        this.focusLoad()
    },
    methods:{
        focusLoad(){
            this.$refs.keyword.focus()
        },
        cari(){
            let keyword = this.keyword
            if(keyword.length>0){
                let fr = new FormData()
                fr.set('keyword',this.keyword)
                fr.set('kdmut',this.kode_unit)
                this.axios.post('/kartu-stok/cari-obat',fr,this.tokenGuest)
                .then((response)=>{
                    this.medicines = response.data.data.data
                })
                .catch((error)=>{
                    let {data} = error.response
                    console.log(data.message)
                })
            }
        },
        close(){
            this.keyword = ''
            this.medicines = []
            this.$emit('closed',false)
        }
    }
}
</script>