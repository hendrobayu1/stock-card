<template>
    <v-card>
        <v-card-title class="text-h6 grey lighten-2">
            <span class="text-sm-body-1 font-weight-bold">Mutasi Kartu Stok [{{pengguna.unit}}]</span>
            <v-spacer />

            <v-dialog v-model="dialog_tipe_transaksi" persistent max-width="350">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn small v-model="fab" color="blue darken-2" dark fab v-bind="attrs" v-on="on">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="text-h6">Jenis Transaksi</v-card-title>
                    <v-card-text>
                        <v-autocomplete label="Pilih jenis transaksi" :items="jenisTransaksi" 
                        v-model="objJenisTransaksi" item-text="tipe" item-value="kode" return-object />
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="warning" dark @click="dialog_tipe_transaksi = false">Batal</v-btn>
                        <v-btn color="success" dark @click="pilihJenisTransaksi">Proses</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <keep-alive>
                <!-- <v-layout row justify-center> -->
                <v-dialog v-model="komponen_transaksi" persistent fullscreen hide-overlay transition="dialog-bottom-transition">
                    <component :is="komponenSekarangTransaksi" @closed="setKomponenStatusTransaksi" :objJenisTransaksi="objJenisTransaksi" />
                </v-dialog>
                <!-- </v-layout> -->
            </keep-alive>

        </v-card-title>
        <!-- </v-toolbar> -->
        <v-data-table :headers="headers" :items="transaksi" :loading="loading" :loading-text="loadText" 
        class="elevation-2" :search="cari" :sort-by="['id_transaksi']" 
        :sort-desc="[false,false]" multi-sort>

            <template v-slot:top>
                <v-card-title>
                    <v-row>
                        <v-col cols="12" lg="2" sm="2">
                            <v-menu v-model="date_menu_1" :close-on-content-click="false" :nudge-right="5" 
                            transition="scale-transition" offset-y max-width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="computedDateFormat_1" label="Tanggal awal"
                                    readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="date_1" @input="date_menu_1 = false" 
                                :max="date_2"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" lg="2" sm="2">
                            <v-menu v-model="date_menu_2" :close-on-content-click="false" :nudge-right="5" 
                            transition="scale-transition" offset-y min-width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="computedDateFormat_2" label="Tanggal akhir"
                                    readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="date_2" @input="date_menu_2 = false" 
                                :min="date_1"></v-date-picker>
                            </v-menu>                        
                        </v-col>
                        <!-- <v-spacer /> -->
                        <v-col cols="12" lg="8" sm="8">
                            <v-text-field v-model="cari" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                        </v-col> 
                    </v-row>
                </v-card-title>
            </template>

            <template v-slot:item.tgl_mutasi="{ item }">
                {{formatDateTime(item.tgl_mutasi,8)}}
            </template>
            <template v-slot:item.status_editing="{ item }">
                <v-chip :color="getColor(item.status_editing)" dark>{{ item.status_editing }}</v-chip>
            </template>
            <template v-slot:item.aksi="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small color="warning" class="ma-2" dark @click="previewItem(item)" v-bind="attrs" v-on="on">
                            <v-icon>mdi-file-find</v-icon>
                        </v-btn>
                    </template>
                    <span>{{button_icon_preview}}</span>
                </v-tooltip>
                <!-- <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small color="success" class="ma-2" dark v-if="item.status_editing.toLowerCase()=='draft'" @click="editedItem(item)" v-bind="attrs" v-on="on">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </template>
                    <span>{{button_icon_edit}}</span>
                </v-tooltip> -->
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small color="error" class="ma-2" dark @click="deletedItem(item)" v-bind="attrs" v-on="on">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                    <span>{{button_icon_delete}}</span>
                </v-tooltip>
            </template>
        <!-- <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template> -->
      </v-data-table>

      <template>
          <v-row justify="center">
            <v-dialog v-model="dialog" persistent max-width="290">
              <v-card>
                <v-card-title class="headline">Hapus Transaksi</v-card-title>
                <v-card-text>Transaksi yang telah dihapus tidak dapat dirollback. 
                    Pastikan kembali transaksi yang dihapus sudah benar</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="warning" dark @click="closeDialogConfirm">Tidak</v-btn>
                  <v-btn color="success" dark @click="yesDialogConfirm">Ya</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
      </template>

  </v-card>    
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import moment from 'moment'
// import { Datetime } from 'vue-datetime'
export default {
    components:{
        Dko:()=>import('@/components/kartu_stok_transaksi/DKOGudang.vue'),
        Resep:()=>import('@/components/kartu_stok_transaksi/Resep.vue'),
        Pembelian_langsung:()=>import('@/components/kartu_stok_transaksi/PembelianLangsung.vue'),
        Mutasiantarunit:()=>import('@/components/kartu_stok_transaksi/MutasiAntarUnit.vue'),
    },
    data:()=>({
        fab:false,
        objJenisTransaksi:{kode:null,tipe:null,mutasi:null,nama_komponen:null},
        // dialog_fullscreen:false,
        jenisTransaksi:[],
        date_menu_1:false,
        date_menu_2:false,
        date_1:moment().format('YYYY-MM-DD'),//new Date().toISOString().substr(0, 10),
        date_2:moment().format('YYYY-MM-DD'),//new Date().toISOString().substr(0, 10),
        dialog: false,
        dialog_tipe_transaksi:false,
        // dialogConfirm:false,
        cari:'',
        loading:true,
        loadText:'Mohon tunggu...',
        button_icon_preview:'preview transaksi',
        button_icon_edit:'edit transaksi',
        button_icon_delete:'delete transaksi',
        headers: [
            {text: 'ID',value: 'id_transaksi',align:'start',sortable:true},
            {text: 'Tgl Proses',value: 'tgl_mutasi',align:'start'},
            {text: 'Mutasi',value: 'mutasi',align:'start'},
            {text: 'Jenis',value: 'tipe_transaksi',align:'start'},
            {text: 'Referensi',value: 'no_doc_centra',align:'start'},
            {text: 'Status',value: 'status_editing',align:'start'},
            { text: 'Aksi', value: 'aksi', sortable: false,},
        ],
        transaksi: [],
        editIndex: -1,
        dialogIndex: -1,
        editItem: {
            id_transaksi: 0,
            tgl_mutasi: '',
            mutasi: '',
            tipe_transaksi: '',
            no_doc_centra: '',
            status_editing: '',
        },
        defaultItem: {
            id_transaksi: 0,
            tgl_mutasi: '',
            mutasi: '',
            tipe_transaksi: '',
            no_doc_centra: '',
            status_editing: '',
        },
    }),
    computed: {
      ...mapGetters({
          pengguna:'authentikasi/user',
          komponenStatusTransaksi:'komponen_transaksi/status',
          komponenSekarangTransaksi:'komponen_transaksi/component',
      }),
      komponen_transaksi:{
        get(){
            return this.komponenStatusTransaksi
        },
        set(value){
            this.setKomponenStatusTransaksi(value)
        }
      },
      formTitle () {
        return this.dialogIndex === 0 ? 'Preview Transaksi' : 'Edit Transaksi'
      },
    //   dialogTitle () {
    //     if(this.dialogIndex==-1){
    //         return ''
    //     }else if(this.dialogIndex==0){
    //         return 'Reset password ?'
    //     }else{
    //         return 'Hapus user ?'
    //     }
    //   },
    //   dialogSubTitle () {
    //     if(this.dialogIndex==-1){
    //         return ''
    //     }else if(this.dialogIndex==0){
    //         return 'Password akan digenerate secara acak oleh sistem sepanjang 6 karakter. '+
    //         'Segera lakukan update dan jaga kerahasian password anda.'
    //     }else{
    //         return 'User yang dinonaktifkan, tidak akan memiliki akses ke aplikasi ini. '+
    //         'Pastikan kembali bahwa user yang akan dinonaktifkan benar.'
    //     }
    //   },
      computedDateFormat_1(){
          this.initialize()
          return this.formatDateTime(this.date_1,8)
      },
      computedDateFormat_2(){
          this.initialize()
          return this.formatDateTime(this.date_2,8)
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    created () {
        this.initialize()
        let config={
            headers:{
                'Authorization' : 'Bearer ' + this.pengguna.api_token,
            }
        }
        this.axios.post('/kartu-stok/jenis-transaksi',{},config)
        .then((response)=>{
            let{data} = response.data
            // console.log(data)
            this.jenisTransaksi = data
        })
        .catch((error)=>{
            let {data} = error.response
            console.log(data.message)
        })
    },
    // updated(){
    //     this.initialize()
    // },
    methods: {
        ...mapActions({
          setNotif:'notif/actNotif',
          setKomponenStatusTransaksi:'komponen_transaksi/actStatus',
          setKomponenTransaksi:'komponen_transaksi/actComponent',
        }),
        getColor(status_edit_data){
            if(status_edit_data.toLowerCase()=='draft'){
                return 'green'
            }else if(status_edit_data.toLowerCase()=='completed'){
                return 'orange'
            }
        },
        pilihJenisTransaksi(){
            if(this.objJenisTransaksi.kode != null){
                if(this.objJenisTransaksi.nama_komponen.length>0){
                    this.dialog_tipe_transaksi=false
                    // console.log(this.objJenisTransaksi.nama_komponen)
                    this.setKomponenTransaksi(this.objJenisTransaksi.nama_komponen)
                }else{
                    this.setNotif({
                        status:true,
                        color:'error',
                        text:'jenis transaksi masih dalam proses pengembangan',
                    })
                }
            }else{
                this.setNotif({
                    status:true,
                    color:'error',
                    text:'jenis transaksi tidak boleh kosong',
                })
            }
        },
        initialize () {
            let frdata=new FormData()
            frdata.set('depo',this.pengguna.kode_unit)
            frdata.set('tgl1',this.date_1)
            frdata.set('tgl2',this.date_2)
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            // this.loading = true
            this.transaksi = []
            // console.log(moment().format('YYYY-MM-DD'))
            // console.log(this.date_1)
            this.axios.post('/kartu-stok/list-transaksi-kartu-stok',frdata,config)
            .then((response)=>{
                // console.log(this.pengguna.kode_unit)
                // console.log(response)
                if (response.data.status=='success'){
                    this.transaksi = response.data.data
                }
                this.loading = false
            })
            .catch((error)=>{
                let {data} = error.response
                console.log(data.message)
                this.loading = false
            })
        },

        previewItem (item) {
            console.log(item)
            this.setNotif({
                status:true,
                color:'error',
                text:'fitur ini masih dalam proses pengembangan'
            })
            // this.editItem = Object.assign({},item)
            // this.dialogIndex = 0
            // this.dialog = true
        },

        // editedItem (item) {
        //     this.editIndex = this.transaksi.indexOf(item)
        //     this.editItem = Object.assign({}, item)
        //     this.dialogIndex = 1
        //     this.dialog = true
        // },
        
        deletedItem(item){
            // this.editIndex = this.transaksi.indexOf(item)
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            // console.log(config)
            // console.log(item.id_transaksi)
            // let url = encodeURI('/kartu-stok/validasi-hapus-transaksi/' + item.id_transaksi)
            this.axios.post('/kartu-stok/validasi-hapus-transaksi/' + item.id_transaksi,{},config)
            .then((response)=>{
                // console.log(response)
                if(response.data.status=='success'){
                    this.editItem = Object.assign({},item)
                    this.dialog = true
                }else{
                    this.setNotif({
                        status:true,
                        color:'error',
                        text:response.data.message,
                    })
                }
            })
            .catch((error)=>{
                let {data} = error.response
                console.log(data.message)
            })
        },

        closeDialogConfirm(){
            this.dialog = false
            this.$nextTick(()=>{
                this.editItem = Object.assign({}, this.defaultItem)
            })
        },

        yesDialogConfirm () {
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            let formData = {
                'kode_transaksi_kartu_stok':this.editItem.id_transaksi,
                'device_info':this.deviceInfo,
            }
            this.axios.post('/kartu-stok/hapus-transaksi-kartu-stok',formData,config)
            .then((response)=>{
                if(response.data.status=='success'){
                    // this.editItem = Object.assign({}, this.defaultItem)
                    // this.dialog = false
                    this.closeDialogConfirm()
                    this.initialize()
                    this.setNotif({
                        status:true,
                        color:response.data.status,
                        text:response.data.message,
                    })
                }else{
                    this.setNotif({
                        status:true,
                        color:response.data.status,
                        text:response.data.message,
                    })
                }
            }).catch((error)=>{
                let {data} = error.response
                console.log(data.message)
            })
        },

        close () {
            this.dialog = false
            this.$nextTick(() => {
                this.editItem = Object.assign({}, this.defaultItem)
                this.editIndex = -1
                this.dialogIndex = -1
            })
        },

        saveProses(){

        },
    },
}
</script>