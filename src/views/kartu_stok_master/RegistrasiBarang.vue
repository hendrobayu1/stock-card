<template>
    <v-data-table :headers="headers" :items="medicines" :loading="loading" :loading-text="loadText" 
    class="elevation-2" :search="cari" :sort-by="['nama_brg']" 
    :sort-desc="[false]" multi-sort>
        <template v-slot:top>
        <v-toolbar flat color="white">
            <v-toolbar-title class="colortitle">[{{pengguna.kode_unit}}] - {{pengguna.unit}}</v-toolbar-title>
            <v-divider class="mx-3" inset vertical />
            <v-spacer></v-spacer>
            <v-text-field v-model="cari" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            <v-dialog v-model="dialog" max-width="600px" persistent>
            <v-card>
                <v-card-title class="headline grey lighten-2">
                <span class="text-sm-body-1 font-weight-bold">Registrasi Obat</span>
                </v-card-title>

                <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field class="text-sm-body-2" v-model="registrasiItem.kode_brg_phc" label="Kode obat" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="9" md="9">
                            <v-text-field class="text-sm-body-2" v-model="registrasiItem.nama_brg" label="Nama obat" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="9" md="9">
                            <v-text-field class="text-sm-body-2" v-model="registrasiItem.kemasan" label="Kemasan" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field class="text-sm-body-2" v-model="registrasiItem.jenis" label="Jenis" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <vuetify-money class="text-sm-body-2" v-model="registrasiItem.stok" :options="options" valueWhenIsEmpty=0 readonly label="Stok" />
                            <!-- <v-text-field class="text-sm-body-2" v-model="registrasiItem.stok" label="Stok" readonly></v-text-field> -->
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-select class="text-sm-body-2" v-model="idlemari" :items="item_lemari" 
                            hide-selected label="Rak obat" item-value="idlemari" persistent-hint item-text="nmlemari" />
                        </v-col>
                    </v-row>
                </v-container>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning" dark @click="close">Keluar</v-btn>
                <v-btn color="success" dark @click="save">Simpan</v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-toolbar>
        </template>
        <template v-slot:item.kode_brg_phc="{ item }">
            <span class="font-content-data-table">{{item.kode_brg_phc}}</span>
        </template>
        <template v-slot:item.kode_brg_centra="{ item }">
            <span class="font-content-data-table">{{item.kode_brg_centra}}</span>
        </template>
        <template v-slot:item.nama_brg="{ item }">
            <span class="font-content-data-table">{{item.nama_brg}}</span>
        </template>
        <template v-slot:item.kemasan="{ item }">
            <span class="font-content-data-table">{{item.kemasan}}</span>
        </template>
        <template v-slot:item.jenis="{ item }">
            <span class="font-content-data-table">{{item.jenis}}</span>
        </template>
        <template v-slot:item.stok="{ item }">
            <span class="font-content-data-table">{{parseInt(item.stok).toLocaleString('id-ID')}}</span>
        </template>
        <template v-slot:item.aksi="{ item }">
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn small color="success" dark @click="regItem(item)" v-bind="attrs" v-on="on">
                <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </template>
            <span>{{button_icon_registrasi}}</span>
        </v-tooltip>
        </template>
    </v-data-table>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
// import VuetifyMoney from 'VuetifyMoney'
export default {
    data:()=>({
        dialog: false,
        cari:'',
        idlemari:0,
        loading:true,
        loadText:'Mohon tunggu...',
        button_icon_registrasi:'registrasi obat',
        headers: [
            {text: 'Kode 1',value: 'kode_brg_phc',align:'start'},
            {text: 'Kode 2',value: 'kode_brg_centra',},
            { text: 'Nama obat', value: 'nama_brg',},
            { text: 'Kemasan', value: 'kemasan',},
            { text: 'Jenis', value: 'jenis',},
            { text: 'Stok', value: 'stok',},
            { text: 'Aksi', value: 'aksi', sortable: false,},
        ],
        medicines: [],
        item_lemari:[],
        registrasiIndex: -1,
        registrasiItem: {
            kode_brg_phc: '',
            kode_brg_centra: '',
            nama_brg: '',
            kemasan: '',
            jenis: '',
            stok: 0,
        },
        defaultItem: {
            kode_brg_phc: '',
            kode_brg_centra: '',
            nama_brg: '',
            kemasan: '',
            jenis: '',
            stok: 0,
        },
        options: {
            locale: 'id-ID',
            prefix: '',
            suffix: '',
            length: 11,
            precision: 0
        }
    }),
    
    computed:{
        ...mapGetters({
            pengguna:'authentikasi/user',
        }),
    },
    
    watch: {
        dialog (val) {
            val || this.close()
        },
    },

    created(){
        this.initialize()
        this.getListRak()
    },

    methods:{
        ...mapActions({
            setNotif:'notif/actNotif',
        }),

        initialize () {
            let formData = {
              'kdmut':this.pengguna.kode_unit,
            }
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            this.medicines = []
            this.axios.post('/kartu-stok/list-barang-tanpa-rak',formData,config)
            .then((response)=>{
                this.medicines = response.data.data
                this.loading = false
            })
            .catch((error)=>{
                this.loading = false
                let {data} = error.response
                console.log(data.message)
            })
        },

        // getStok(){
        //     console.log(this.registrasiItem.stok)
        //     return parseInt(this.registrasiItem.stok).toLocaleString('id-ID')
        // },

        getListRak(){
            let formData = {
              'kdmut':this.pengguna.kode_unit,
            }
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            this.item_lemari = []
            this.axios.post('/kartu-stok/lemari-all',formData,config)
            .then((response)=>{
                this.item_lemari = response.data.data
            })
            .catch((error)=>{
                let {data} = error.response
                console.log(data.message)
            })
        },

        regItem (item) {
            this.idlemari = 0
            this.registrasiIndex = this.medicines.indexOf(item)
            this.registrasiItem = Object.assign({}, item)
            // console.log(item.id_kartu_stok)
            this.dialog = true
        },

        close () {
            this.dialog = false
            this.$nextTick(() => {
                this.registrasiItem = Object.assign({}, this.defaultItem)
                this.registrasiIndex = -1
            })
        },

        save(){
            if(this.registrasiIndex>-1){
                let formData = {
                    'kdmut':this.pengguna.kode_unit,
                    'kdbrg':this.registrasiItem.kode_brg_phc,
                    'idlemari':this.idlemari,
                    'stok':this.registrasiItem.stok,
                    'device_info':this.deviceInfo,
                }
                let config={
                    headers:{
                        'Authorization' : 'Bearer ' + this.pengguna.api_token,
                    }
                }
                
                this.axios.post('/kartu-stok/registrasi-barang',formData,config)
                .then((response)=>{
                    if(response.data.status=='success'){
                        this.setNotif({
                            status:true,
                            color:response.data.status,
                            text:response.data.message,
                        })
                        this.initialize()
                        this.close()
                    }else{
                        this.setNotif({
                            status:true,
                            color:response.data.status,
                            text:response.data.message,
                        })
                    }
                })
                .catch((error)=>{
                    let {data} = error.response
                    console.log(data.message)
                })
            }else{
                this.setNotif({
                    status:true,
                    color:'error',
                    text:'tidak ada barang yang diregistrasi'
                })
            }
        },
    }
}
</script>