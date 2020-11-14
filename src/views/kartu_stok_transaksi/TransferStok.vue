<template>
    <v-card>
        <v-card-title class="text-h6 grey lighten-2">
            <span class="text-sm-body-1 font-weight-bold">Transfer Stok [{{pengguna.kode_unit}}-{{pengguna.unit}}]</span>
            <v-spacer />

            <v-dialog v-model="dialog" persistent max-width="1000px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn small v-model="fab" color="blue darken-2" dark fab v-bind="attrs" v-on="on">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="headline grey lighten-2">
                        <span class="text-sm-body-1 font-weight-bold">Add Transaksi Transfer Stok</span>
                    </v-card-title>
                    
                    <v-card-text>
                        <v-container>
                            <v-data-table :headers="headers_item" :items="transsaksi_item" class="elevation-1" hide-default-footer>
                                <template v-slot:top>
                                    <v-card-title>
                                        <v-row>
                                            <v-col cols="12" lg="5" sm="5">
                                                <v-autocomplete class="text-sm-body-2" v-model="objBarang" :items="barang" :loading="isLoading"
                                                    :search-input.sync="search" hide-no-data hide-selected 
                                                    item-text="nama_barang" item-value="kode_barang" 
                                                    label="Nama Barang" return-object dense 
                                                    clear-icon="mdi-close-circle" clearable @change="list_item_lemari" />
                                            </v-col>
                                            <v-col cols="12" lg="2" sm="2">
                                                <v-select class="text-sm-body-2" v-model="objLemari_source" :items="item_lemari_source" 
                                                    hide-selected label="Rak Kirim" dense item-text="lemari" 
                                                    item-value="id" @change="list_item_lemari_tujuan" persistent-hint 
                                                    :hint="`Stok : `+parseInt(objLemari_source.akhir).toLocaleString('id-ID')" return-object />
                                            </v-col>
                                            <v-col cols="12" lg="2" sm="2">
                                                <v-select class="text-sm-body-2" v-model="objLemari_tujuan" :items="item_lemari_tujuan" 
                                                    hide-selected label="Rak Tujuan" item-value="id" persistent-hint item-text="lemari" 
                                                    :hint="`Stok : `+parseInt(objLemari_tujuan.akhir).toLocaleString('id-ID')" dense return-object />
                                            </v-col>
                                            <v-col cols="12" lg="1" sm="1">
                                                <v-text-field class="right-input text-sm-body-2" v-model="qty" label="Qty" hide-details dense />
                                            </v-col>
                                            <v-col cols="12" lg="2" sm="2">
                                                <v-btn color="info" @click="insertRow()"><v-icon>mdi-plus</v-icon> Tambah</v-btn>
                                            </v-col>
                                        </v-row>
                                        <!-- <v-spacer />
                                        
                                            <v-btn color="primary" dark class="mb-2" @click="insertRow()">
                                                <v-icon left>mdi-plus</v-icon> Tambah Item
                                            </v-btn> -->
                                        
                                    </v-card-title>
                                </template>
                                <template v-slot:item.no="{ item }">
                                    <span class="font-content-data-table">{{item.no}}</span>
                                </template>
                                <template v-slot:item.item="{ item }">
                                    <span class="font-content-data-table">{{item.item}}</span>
                                </template>
                                <template v-slot:item.lemari_kirim="{ item }">
                                    <span class="font-content-data-table">{{item.lemari_kirim}}</span>
                                </template>
                                <template v-slot:item.lemari_tujuan="{ item }">
                                    <span class="font-content-data-table">{{item.lemari_tujuan}}</span>
                                </template>
                                <template v-slot:item.stok="{ item }">
                                    <span class="font-content-data-table">{{item.stok}}</span>
                                </template>
                                <template v-slot:item.qty="{ item }">
                                    <span class="font-content-data-table">{{item.qty}}</span>
                                </template>
                                <template v-slot:item.aksi="{ item }">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-btn small color="error" dark @click="deleteRow(item)" v-bind="attrs" v-on="on">
                                            <v-icon>mdi-delete-forever</v-icon>
                                        </v-btn>
                                        </template>
                                        <span>{{button_icon_delete}}</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                            <!-- <v-row>
                            </v-row> -->
                        </v-container>
                    </v-card-text>
                    <v-divider />
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="warning" dark @click="close()">Batal</v-btn>
                        <v-btn color="success" dark @click="save()">Simpan</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-title>

        <v-data-table :headers="headers" :items="transaksi_transfer" :loading="loading" :loading-text="loadText" 
        class="elevation-2" :search="cari" :sort-by="['tgl_proses_kartu']" 
        :sort-desc="[false]" multi-sort>
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
                        <v-col cols="12" lg="8" sm="8">
                            <v-text-field v-model="cari" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                        </v-col> 
                    </v-row>
                </v-card-title>
            </template>

            <!-- <template v-slot:item.id_transaksi="{ item }">
                <span class="font-content-data-table">{{item.id_transaksi}}</span>
            </template>
            <template v-slot:item.mutasi="{ item }">
                <span class="font-content-data-table">{{item.mutasi}}</span>
            </template> -->
            <template v-slot:item.tgl_proses_kartu="{ item }">
                {{formatDateTime(item.tgl_proses_kartu,9)}}
            </template>
            <!-- <template v-slot:item.jenis_transaksi="{ item }">
                <span class="font-content-data-table">{{item.jenis_transaksi}}</span>
            </template> -->
            <template v-slot:item.status_transaksi="{ item }">
                <v-chip :color="getColor(item.status_transaksi)" dark>{{ item.status_transaksi }}</v-chip>
            </template>
            <!-- <template v-slot:item.nama="{ item }">
                <span class="font-content-data-table">{{item.nama}}</span>
            </template> -->
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
                        <v-btn small color="success" class="ma-2" dark v-if="item.status_transaksi.toLowerCase()=='draft'" @click="editedItem(item)" v-bind="attrs" v-on="on">
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
            <v-dialog v-model="dialogConfirm" persistent max-width="290">
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

<style scoped>
    .right-input >>> input {
      text-align:right
    }
</style>
<script>
import {mapGetters,mapActions} from 'vuex'
import moment from 'moment'
export default {
    data:()=>({
        fab:true,
        date_menu_1:false,
        date_menu_2:false,
        date_1:moment().format('YYYY-MM-DD'),//new Date().toISOString().substr(0, 10),
        date_2:moment().format('YYYY-MM-DD'),//new Date().toISOString().substr(0, 10),
        dialog: false,
        dialogConfirm: false,
        cari:'',

        objBarang:{},
        search:null,
        // entries:[],
        barang:[],
        // itemLimit: 50,
        isLoading:false,

        objLemari_source:{},
        objLemari_tujuan:{},
        item_lemari_source:[],
        item_lemari_tujuan:[],
        qty:0,

        loading:true,
        loadText:'Mohon tunggu...',
        button_icon_preview:'preview transaksi',
        button_icon_edit:'edit transaksi',
        button_icon_delete:'delete item',
        headers: [
            {text: 'ID',value: 'id_transaksi',align:'start',sortable:true},
            {text: 'Mutasi',value: 'mutasi',align:'start'},
            {text: 'Tgl Proses',value: 'tgl_proses_kartu',align:'start'},
            // {text: 'Jenis Transaksi',value: 'jenis_transaksi',align:'start'},
            {text: 'Status',value: 'status_transaksi',align:'start'},
            {text: 'User',value: 'nama',align:'start'},
            { text: 'Aksi', value: 'aksi', sortable: false,},
        ],
        // tambah_item:false,
        headers_item: [
            {text: 'No',value: 'no',align:'start',sortable:false},
            {text: 'Item',value: 'item',align:'start',sortable:false},
            {text: 'Rak Pengirim',value: 'lemari_kirim',align:'start',sortable:false},
            {text: 'Rak Tujuan',value: 'lemari_tujuan',align:'start',sortable:false},
            {text: 'Stok',value: 'stok',align:'start',sortable:false},
            {text: 'Qty',value: 'qty',align:'start',sortable:false},
            {text: 'Aksi',value: 'aksi',align:'start',sortable:false},
        ],
        transaksi_transfer: [],
        transsaksi_item : [],
        editIndex: -1,
        dialogIndex: -1,
        editItem: {
            no: 0,
            id_transaksi: 0,
            mutasi: '',
            tgl_proses_kartu: '',
            status_transaksi: '',
            nama: '',
        },
        defaultItem: {
            no: 0,
            id_transaksi: 0,
            mutasi: '',
            tgl_proses_kartu: '',
            status_transaksi: '',
            nama: '',
        },
    }),
    computed:{
        ...mapGetters({
            pengguna:'authentikasi/user',
        }),
        formTitle () {
            return this.dialogIndex === 0 ? 'Preview Transaksi' : 'Edit Transaksi'
        },
        computedDateFormat_1(){
            this.initialize()
            return this.formatDateTime(this.date_1,8)
        },
        computedDateFormat_2(){
            this.initialize()
            return this.formatDateTime(this.date_2,8)
        },
        // barang () {
        //     return this.entries.map(entry => {
        //         const NamaBarang = entry.nama_barang.length > this.itemLimit
        //             ? entry.nama_barang.slice(0, this.itemLimit) + '...'
        //             : entry.nama_barang

        //         return Object.assign({}, entry, { NamaBarang })
        //     })
        // },
    },
    created(){
        this.initialize()
        // console.log(this.headers_item.length)
    },
    watch: {
        dialog (val) {
            val || this.close()
        },
        search (val) {
            this.isLoading = true
            let frdata = {
                'depo' : this.pengguna.kode_unit,
                'nama_barang' : val,
            }
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            this.axios.post('/kartu-stok/list-master-obat-depo',frdata,config)
            // .then(response => response.json())
            .then((response) => {
                this.barang = response.data.data
            })
            .catch((error) => {
                let {data} = error.response
                console.log(data.message)
            })
            .finally(() => (this.isLoading = false))
        },
    },
    methods:{
        ...mapActions({
            setNotif:'notif/actNotif',
        }),
        getColor(status_edit_data){
            if(status_edit_data.toLowerCase()=='draft'){
                return 'green'
            }else if(status_edit_data.toLowerCase()=='completed'){
                return 'orange'
            }
        },
        list_item_lemari(){
            this.item_lemari_source = []
            this.item_lemari_tujuan = []
            this.objLemari_source = {}
            this.objLemari_tujuan = {}
            // console.log(this.objBarang)
            if (typeof this.objBarang != "undefined"){
                if(this.objBarang.kode_barang != null){
                    let frdata = {
                        'kode_depo' : this.pengguna.kode_unit,
                        'kode_brg' : this.objBarang.kode_barang,
                    }
                    let config={
                        headers:{
                            'Authorization' : 'Bearer ' + this.pengguna.api_token,
                        }
                    }
                    // lemari source
                    this.axios.post('/kartu-stok/list-lemari-perbarang',frdata,config)
                    .then((response) => {
                        // console.log(response.data.data)
                        // let {data} = response.data.data
                        this.item_lemari_source = response.data.data
                        // return response.data.data
                    })
                    .catch((error) => {
                        let {data} = error.response
                        console.log(data.message)
                    })
                }
            }
        },
        list_item_lemari_tujuan(){
            this.item_lemari_tujuan = []
            this.objLemari_tujuan = {}
            // console.log(this.objLemari_source)
            if (typeof this.objLemari_source != "undefined"){
                if(this.objLemari_source.id != ''){
                    // lemari tujuan
                    let frdata = {
                        'kode_depo' : this.pengguna.kode_unit,
                        'kode_lemari' : this.objLemari_source.id,
                        'kode_barang' : this.objBarang.kode_barang,
                    }
                    let config={
                        headers:{
                            'Authorization' : 'Bearer ' + this.pengguna.api_token,
                        }
                    }
                    this.axios.post('/kartu-stok/list-lemari-per-depo-khusus',frdata,config)
                    .then((response) => {
                        // console.log(response.data.data)
                        // let {data} = response.data.data
                        this.item_lemari_tujuan = response.data.data
                        // console.log(this.objLemari_tujuan)
                        // return response.data.data
                    })
                    .catch((error) => {
                        let {data} = error.response
                        console.log(data.message)
                    })
                }
            }
        },
        insertRow(){
            // console.log(this.transsaksi_item.length)
            let message = ''
            let status = 'success'
            if (typeof this.objBarang != "undefined"){
                if(this.objBarang.kode_barang == null){
                    message = 'inputan nama barang tidak boleh kosong'
                    status = 'error'
                }
            }else{
                message = 'inputan nama barang tidak boleh kosong'
                status = 'error'
            }

            if(status=='success'){
                if (typeof this.objLemari_source != "undefined"){
                    if(this.objLemari_source.id == null){
                        message = 'inputan lokasi kirim tidak boleh kosong'
                        status = 'error'
                    }
                }else{
                    message = 'inputan lokasi kirim tidak boleh kosong'
                    status = 'error'
                }
            }

            if(status=='success'){
                if (typeof this.objLemari_tujuan != "undefined"){
                    if(this.objLemari_tujuan.id == null){
                        message = 'inputan lokasi penerima tidak boleh kosong'
                        status = 'error'
                    }
                }else{
                    message = 'inputan lokasi penerima tidak boleh kosong'
                    status = 'error'
                }
            }

            if(status=='success'){
                if(this.qty==0 || this.qty==''){
                    message = 'inputan qty transfer'
                    status = 'error'
                }else{
                    if (!(!isNaN(parseFloat(this.qty)) && isFinite(this.qty))){
                        message = 'inputan qty harus angka'
                        status = 'error'
                    }
                }
            }

            if(status=='success'){
                if(this.qty>parseInt(this.objLemari_source.akhir)){
                    message = 'qty transfer melebihi stok'
                    status = 'error'
                }
            }

            if(status=='error'){
                this.setNotif({
                    status:true,
                    color:status,
                    text:message,
                })
            }else{
                let data = {
                    'no':this.transsaksi_item.length+1,
                    'item':this.objBarang.kode_barang+' ~ '+this.objBarang.nama_barang,
                    'lemari_kirim':this.objLemari_source.id + ' ~ ' + this.objLemari_source.lemari,
                    'lemari_tujuan':this.objLemari_tujuan.id + ' ~ ' + this.objLemari_tujuan.lemari,
                    'stok':this.objLemari_source.akhir,
                    'qty':this.qty,
                    'aksi':this.transsaksi_item.length
                }
                this.transsaksi_item.push(data)
                this.clearItem()
                this.setNotif({
                    status:true,
                    color:status,
                    text:'item berhasil ditambahkan',
                })
            }
        },
        deleteRow(item){
            // console.log(item.aksi)
            for(var i = 0; i < this.transsaksi_item.length; i++){
                if(this.transsaksi_item[i]['aksi']==item.aksi){
                    this.transsaksi_item.splice(i,1)
                    break;
                }
            }
            for(var x = 0; x < this.transsaksi_item.length; x++){
                this.transsaksi_item[x]['no'] = x+1
            }
            // this.transsaksi_item.splice(item.aksi,1)
        },
        initialize () {
            let frdata=new FormData()
            frdata.set('depo',this.pengguna.kode_unit)
            frdata.set('tgl1',this.date_1)
            frdata.set('tgl2',this.date_2)
            // console.log(this.date_1)
            // console.log(this.date_2)
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            // get transaksi
            this.transaksi_transfer = []
            this.axios.post('/kartu-stok/list-transaksi-transfer-stok',frdata,config)
            .then((response)=>{
                // console.log(this.pengguna.kode_unit)
                // console.log(response)
                if (response.data.status=='success'){
                    this.transaksi_transfer = response.data.data
                }
                this.loading = false
            })
            .catch((error)=>{
                let {data} = error.response
                console.log(data.message)
                this.loading = false
            })
        },
        // aksesEditItem(item){
        //     console.log(item.mutasi)
        //     console.log(item.jenis_transaksi.toLowerCase())
        //     if(item.mutasi==='I' && item.jenis_transaksi.toLowerCase().substring(0,13)==='transfer stok'){
        //         return false
        //     }else{
        //         return true
        //     }
        // },
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
        //     this.editIndex = this.transaksi_transfer.indexOf(item)
        //     this.editItem = Object.assign({}, item)
        //     this.dialogIndex = 1
        //     this.dialog = true
        // },

        deletedItem(item){
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            this.axios.post('/kartu-stok/validasi-hapus-transaksi/' + item.id_transaksi,{},config)
            .then((response)=>{
                // console.log(response)
                if(response.data.status=='success'){
                    this.editItem = Object.assign({},item)
                    this.dialogConfirm = true
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
            this.dialogConfirm = false
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

        clearItem(){
            this.barang = []
            this.objBarang = {}
            this.objLemari_source = {}
            this.objLemari_tujuan = {}
            this.qty = 0
        },

        close () {
            this.dialog = false
            this.transsaksi_item = []
            this.clearItem()

            // this.tambah_item = false
            this.$nextTick(() => {
            this.editItem = Object.assign({}, this.defaultItem)
            this.editIndex = -1
            this.dialogIndex = -1
            })
        },

        save(){
            if(this.transsaksi_item.length<1){
                this.setNotif({
                    status:true,
                    color:'error',
                    text:'tidak ada data transaksi yang diproses'
                })
            }else{
                let frdata =    {
                    'depo' : this.pengguna.kode_unit,
                    'transaksi' : JSON.stringify(this.transsaksi_item),
                    'device_info':this.deviceInfo,
                }
                let config={
                    headers:{
                        'Authorization' : 'Bearer ' + this.pengguna.api_token,
                    }
                }
                // console.log(frdata)
                // console.log(this.pengguna.api_token)
                this.axios.post('/kartu-stok/simpan-transfer-stok',frdata,config)
                .then((response)=>{
                    // console.log(response)
                    if(response.data.status=='error'){
                        this.setNotif({
                            status:true,
                            color:response.data.status,
                            text:response.data.message,
                        })
                    }else{
                        this.clearItem()
                        this.transsaksi_item = []
                        this.initialize()
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
            }
        }
    }
}
</script>