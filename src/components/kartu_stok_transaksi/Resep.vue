<template>
    <v-card>
        <v-toolbar dark color="primary" id="scroll-target">
            <v-btn icon dark @click.native="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title><span class="text-sm-body-1">{{objJenisTransaksi.tipe}} ({{pengguna.unit}})</span></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark text @click="cancelProses">Cancel</v-btn>
                <v-btn dark text @click="saveProses">Save</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <!-- <v-btn v-scroll="onScroll" v-show="fab" fab dark fixed bottom right color="error" @click="toTop()">
            <v-icon>mdi-apple-keyboard-control</v-icon>
        </v-btn> -->
        <!-- <v-row v-scroll:#scroll-target="onScroll2"> -->
        <v-list three-line>
            <v-list-item>
                <!-- <v-list-item-title> -->
                <v-row>
                    <v-col cols="12" md="5" sm="5">
                        <v-text-field class="text-sm-body-2" v-model="kode_transaksi" label="Kode transaksi" 
                        type="text" clear-icon="mdi-close-circle" clearable :disabled="cekExistingObjPasien()" @keydown.enter="onButtonClick(null,2)">
                            <!-- slot tombol kode transaksi -->
                            <template v-slot:append-outer>
                                <!-- dialog kode transaksi -->
                                <v-dialog v-model="dialog_kode_transaksi" persistent max-width="1000px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="mx-1" dark color="cyan" v-bind="attrs" v-on="on">
                                            <v-icon dark>mdi-format-list-bulleted-square</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title class="headline grey lighten-2">
                                            <span class="text-sm-body-1 font-weight-bold">Transaksi {{objJenisTransaksi.tipe}} ({{pengguna.unit}})</span>
                                        </v-card-title>
                                        
                                        <!-- Data table pencarian kode transaksi -->
                                        <v-data-table :headers="headers_kode_transaksi" :items="tabel_kode_transaksi" :loading="loading" :loading-text="loadText" 
                                        class="elevation-2" :search="cari_kode_transaksi" :sort-by="['tgl','nomor']" 
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
                                                        <v-col cols="12" lg="8" sm="8">
                                                            <v-text-field v-model="cari_kode_transaksi" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                                        </v-col> 
                                                    </v-row>
                                                </v-card-title>
                                            </template>
                                            <template v-slot:item.id_transaksi="{ item }">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn fab x-small dark color="primary" class="ma-2" 
                                                        @click="onButtonClick(item.id_transaksi,1)" v-bind="attrs" v-on="on">
                                                            <v-icon>mdi-check-bold</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>proses kartu stok</span>
                                                </v-tooltip>
                                            </template>
                                            <template v-slot:item.nota="{ item }">
                                                <span class="font-content-data-table">{{item.nota}}</span>
                                            </template>
                                            <template v-slot:item.nomor="{ item }">
                                                <span class="font-content-data-table">{{item.nomor}}</span>
                                            </template>
                                            <template v-slot:item.no_antrian="{ item }">
                                                <span class="font-content-data-table">{{item.no_antrian}}</span>
                                            </template>
                                            <template v-slot:item.tgl="{ item }">
                                                <span class="font-content-data-table">{{formatDateTime(item.tgl,8)}}</span>
                                            </template>
                                            <template v-slot:item.jam="{ item }">
                                                <span class="font-content-data-table">{{item.jam}}</span>
                                            </template>
                                            <template v-slot:item.rm="{ item }">
                                                <span class="font-content-data-table">{{item.rm}}</span>
                                            </template>
                                            <template v-slot:item.pasien="{ item }">
                                                <span class="font-content-data-table">{{item.pasien}}</span>
                                            </template>
                                            <template v-slot:item.debitur="{ item }">
                                                <span class="font-content-data-table">{{item.debitur}}</span>
                                            </template>
                                            <template v-slot:item.ruangan="{ item }">
                                                <span class="font-content-data-table">{{item.ruangan}}</span>
                                            </template>
                                            <template v-slot:item.dokter="{ item }">
                                                <span class="font-content-data-table">{{item.dokter}}</span>
                                            </template>

                                        </v-data-table>
                                        <!-- end data table pencarian kode transaksi -->
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="warning" dark @click="dialog_kode_transaksi=false">Keluar</v-btn>
                                        </v-card-actions>

                                    </v-card>
                                </v-dialog>
                                <!-- end dialog kode transaksi -->
                            </template>
                            <!-- end slot tombol kode transaksi -->
                        </v-text-field>
                    </v-col>
                    <v-col cols="4" md="3" sm="3">
                        <v-text-field class="text-sm-body-2" v-model="nomor_resep" label="Nomor resep" 
                        type="text" clear-icon="mdi-close-circle" clearable :disabled="cekExistingObjPasien()" />
                    </v-col>
                    <v-col cols="8" md="4" sm="4">
                        <v-menu v-model="date_menu" :close-on-content-click="false" :nudge-right="5" 
                        transition="scale-transition" offset-y max-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field class="text-sm-body-2" v-model="computedDateFormat" label="Tanggal resep"
                                readonly v-bind="attrs" v-on="on">
                                    <template v-slot:append-outer>
                                        <v-btn class="mx-1" dark color="indigo" :disabled="cekExistingObjPasien()" @click="onButtonClick(null,2)">
                                            <v-icon dark>mdi-magnify</v-icon>
                                        </v-btn>
                                    </template>
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="date_resep" @input="date_menu = false" :disabled="cekExistingObjPasien()"></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>
                <!-- </v-list-item-title> -->
                <!-- </v-list-item-content> -->
            </v-list-item> 
        </v-list>
        <v-divider />
        <v-list three-line subheader>
            <v-subheader>Informasi Pasien</v-subheader>
            <v-list-item>
                <v-row>
                    <v-col cols="6" md="3" sm="3">
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.nota" label="Nota" readonly outlined dense placeholder="" />
                    </v-col>
                    <v-col cols="6" md="3" sm="3">
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.nomor" label="No.Resep" readonly outlined dense placeholder="" />
                    </v-col>
                    <v-col cols="6" md="3" sm="3">
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.no_antrian" label="Antrian" readonly outlined dense placeholder="" />
                    </v-col>
                    <v-col cols="6" md="3" sm="3">
                        <v-text-field class="text-sm-body-2" v-model="computedDateFormat_resepTrans" label="Tgl transaksi" readonly outlined dense placeholder="" />
                    </v-col>
                    <v-col cols="4" md="2" sm="2">
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.rm" label="RM" readonly outlined dense placeholder="" />
                    </v-col>
                    <v-col cols="8" md="10" sm="10">
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.nama" label="Nama pasien" readonly outlined dense placeholder="" />
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.id_transaksi" label="ID Transaksi" v-show="hidden_field" />
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.kode_debitur" label="ID Debitur" v-show="hidden_field" />
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.kode_dinas" label="ID Dinas" v-show="hidden_field" />
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.kode_klinik" label="ID Ruang" v-show="hidden_field" />
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.kode_dokter" label="ID Dokter" v-show="hidden_field" />
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.kode_jenis_transksi" label="ID Jenis" v-show="hidden_field" />
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.debitur" label="Debitur" readonly outlined dense placeholder="" />
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.dinas" label="Dinas" readonly outlined dense placeholder="" />
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.klinik" label="Klinik/Ruangan" readonly outlined dense placeholder="" />
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.dokter" label="Dokter" readonly outlined dense placeholder="" />
                        <v-text-field class="text-sm-body-2" v-model="objInfoPasien.jenis_transaksi" label="Jenis Transaksi" readonly outlined dense placeholder="" />
                    </v-col>
                </v-row>
            </v-list-item>
        </v-list>
        <v-divider />
        <v-list three-line subheader>
            <v-subheader>Rincian Obat</v-subheader>
            <v-list-item>
                <v-expansion-panels inset focusable multiple v-model="panel">
                    <v-expansion-panel v-if="objJenisTransaksi.kode==1" :key="0">
                        <v-expansion-panel-header><strong>RESEP DOKTER</strong></v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-data-table dense :headers="headers_resep_dokter" :items="resep_dokter" :item-key="`${resep_dokter.kode_barang}`" class="elevation-1">
                                <template v-slot:item.INFO="{ item }">
                                    <span class="font-content-data-table">{{item.INFO}}</span>
                                </template>
                                <template v-slot:item.NO="{ item }">
                                    <span class="font-content-data-table">{{item.NO}}</span>
                                </template>
                                <template v-slot:item.KODE_BRG="{ item }">
                                    <span class="font-content-data-table">{{item.KODE_BRG}}</span>
                                </template>
                                <template v-slot:item.NAMA_OBAT="{ item }">
                                    <span class="font-content-data-table">{{item.NAMA_OBAT}}</span>
                                </template>
                                <template v-slot:item.JUMLAH="{ item }">
                                    <span class="font-content-data-table">{{item.JUMLAH}}</span>
                                </template>
                                <template v-slot:item.KET="{ item }">
                                    <span class="font-content-data-table">{{item.KET}}</span>
                                </template>
                            </v-data-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel :key="1">
                        <v-expansion-panel-header><strong>NOTA RESEP</strong></v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <!-- v-model="selected" :single-select="singleSelect" show-select -->
                            <v-data-table dense :headers="headers_nota_resep" :items="nota_resep" 
                            item-key="kode_brg_phc" class="elevation-1">
                                <!-- <template v-slot:top>
                                    <v-switch v-model="singleSelect" label="Single select" class="pa-3"></v-switch>
                                </template> -->
                                <template v-slot:item.kode_brg_phc="{ item }">
                                    <span class="font-content-data-table">{{item.kode_brg_phc}}</span>
                                </template>
                                <template v-slot:item.nama_barang="{ item }">
                                    <span class="font-content-data-table">{{item.nama_barang}}</span>
                                </template>
                                <template v-slot:item.jumlah="{ item }">
                                    <span class="font-content-data-table">{{parseInt(item.jumlah).toLocaleString('id-ID')}}</span>
                                </template>
                                <template v-slot:item.signa="{ item }">
                                    <span class="font-content-data-table">{{item.signa}}</span>
                                </template>
                                <template v-slot:item.keterangan="{ item }">
                                    <span class="font-content-data-table">{{item.keterangan}}</span>
                                </template>
                                <!-- <template v-slot:item.barang_pilih="{ item }">
                                    <span class="font-content-data-table">{{item.barang_pilih}}</span>
                                </template> -->
                                <!-- <template v-slot:item.lemari="{ item }">
                                    <span class="font-content-data-table">{{item.lemari}}</span>
                                </template> -->
                                <!-- <template v-slot:item.jumlah_ambil="{ item }">
                                    <span class="font-content-data-table">{{item.jumlah_ambil}}</span>
                                </template> -->
                                <template v-slot:item.lemari="props">
                                    <v-edit-dialog :return-value.sync="props.item.lemari" large
                                    persistent @save="snackNotif=true">
                                        <div><span class="font-content-data-table">{{ props.item.lemari }}</span></div>
                                        <template v-slot:input>
                                            <div class="mt-4 title">Update Rak</div>
                                        </template>
                                        <template v-slot:input>
                                            <v-select v-model="props.item.lemari" :items="rak_per_depo"
                                            hide-selected label="Rak Barang" dense item-text="lemari" 
                                            :item-value="`${rak_per_depo.id} - ${rak_per_depo.lemari}`" persistent-hint />

                                            <!-- <v-text-field v-model="props.item.lemari" label="Edit" single-line>
                                            </v-text-field> -->
                                        </template>
                                    </v-edit-dialog>
                                </template>
                            </v-data-table>
                            <v-snackbar v-model="snackNotif" :timeout="1000" color="success">
                                Data berhasil ditambahkan
                                <template v-slot:action="{ attrs }">
                                    <v-btn v-bind="attrs" text @click="snackNotif = false">Close</v-btn>
                                </template>
                            </v-snackbar>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import moment from 'moment'
export default {
    name:'resep',
    props:['objJenisTransaksi'],
    data:()=>({
        // fab:false,
        dialog_kode_transaksi:false,
        // lock_pencarian:false,
        date_menu_1:false,
        date_menu_2:false,
        date_1:moment().format('YYYY-MM-DD'),//new Date().toISOString().substr(0, 10),
        date_2:moment().format('YYYY-MM-DD'),//new Date().toISOString().substr(0, 10),
        cari_kode_transaksi:'',
        loading:true,
        loadText:'Mohon tunggu...',
        headers_kode_transaksi:[
            {text: 'Proses',align: 'start',sortable: false,value: 'id_transaksi',},
            {text: 'Nota',align: 'start',sortable: false,value: 'nota',},
            {text: 'Nomor',align: 'start',sortable: false,value: 'nomor',},
            {text: 'Antrian',align: 'start',sortable: false,value: 'no_antrian',},
            {text: 'Tgl Transaksi',align: 'start',sortable: false,value: 'tgl',},
            {text: 'Jam',align: 'start',sortable: false,value: 'jam',},
            {text: 'RM',align: 'start',sortable: false,value: 'rm',},
            {text: 'Nama',align: 'start',sortable: false,value: 'pasien',},
            {text: 'Debitur',align: 'start',sortable: false,value: 'debitur',},
            {text: 'Ruangan',align: 'start',sortable: false,value: 'ruangan',},
            {text: 'Dokter',align: 'start',sortable: false,value: 'dokter',},
        ],
        tabel_kode_transaksi:[],
        hidden_field:false,
        // row:'opsi_pencarian',
        kode_transaksi:'',
        nomor_resep:'',
        date_menu:false,
        date_resep:moment().format('YYYY-MM-DD'),//new Date().toISOString().substr(0, 10),
        objInfoPasien:{},
        panel:[0,1],
        headers_resep_dokter: [
            {text: '',align: 'start',sortable: false,value: 'INFO',},
            {text: 'Nomor',align: 'start',sortable: false,value: 'NO',},
            {text: 'Kode',align: 'start',sortable: false,value: 'KODE_BRG',},
            {text: 'Barang', align: 'start',sortable:false,value: 'NAMA_OBAT',},
            {text: 'Qty', align: 'start',sortable:false,value: 'JUMLAH',},
            // {text: 'Satuan', align: 'start',sortable:false,value: 'satuan_barang',},
            {text: 'Keterangan', align: 'start',sortable:false,value: 'KET',},
        ],
        resep_dokter:[],

        // singleSelect:false,
        // selected:[],
        snackNotif: false,
        rak_per_depo:[],
        headers_nota_resep: [
            // {text: 'Cek',align: 'start',sortable: false,value: 'cek',},
            {text: 'Kode',align: 'start',sortable: false,value: 'kode_brg_phc',},
            {text: 'Barang',align: 'start',sortable: false,value: 'nama_barang',},
            {text: 'Qty', align: 'start',sortable:false,value: 'jumlah',},
            {text: 'Signa', align: 'start',sortable:false,value: 'signa',},
            {text: 'Keterangan', align: 'start',sortable:false,value: 'keterangan'},
            // {text: 'Pilih Barang', align: 'start',sortable:false,value: 'barang_pilih'},
            {text: 'Rak', align: 'start',sortable:false,value: 'lemari'},
            // {text: 'Qty Ambil', align: 'start',sortable:false,value: 'jumlah_ambil'},
        ],
        nota_resep:[],
        // offsetTop: 0,
    }),
    computed:{
        ...mapGetters({
           pengguna:'authentikasi/user' 
        }),
        computedDateFormat(){
            return this.formatDateTime(this.date_resep,8)
        },
        computedDateFormat_1(){
            this.getListResep()
            return this.formatDateTime(this.date_1,8)
        },
        computedDateFormat_2(){
            this.getListResep()
            return this.formatDateTime(this.date_2,8)
        },
        computedDateFormat_resepTrans(){
            if(typeof this.objInfoPasien.tgl != "undefined"){
                return this.formatDateTime(this.objInfoPasien.tgl,8)
            }else{
                return this.objInfoPasien.tgl
            }
        },
    },
    methods:{
        ...mapActions({
            setNotif:'notif/actNotif',
        }),
        // onScroll (e) {
        //     if (typeof window === 'undefined') return
        //     const top = window.pageYOffset || e.target.scrollTop || 0
        //     console.log(top)
        //     this.fab = top > 20
        // },
        // toTop () {
        //     // console.log(1)
        //     this.$vuetify.goTo(0)
        // },
        listRakBarang(){
            let kode = []
            for(var i=0;i<this.nota_resep.length;i++){
                kode.push(this.nota_resep[i]['kode_brg_phc'])
            }
            
            let fr = {
                'kode_brg':kode,
                'kode_depo':this.pengguna.kode_unit
            }
                        
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            this.rak_per_depo = []
            this.axios.post('kartu-stok/list-lemari-array-barang',fr,config)
            .then((response)=>{
                // console.log(response)
                this.rak_per_depo = response.data.data
                // console.log(this.rak_per_depo)
            })
            .catch((response)=>{
                console.log(response)
            })
        },
        cekExistingObjPasien(){
            return Object.prototype.hasOwnProperty.call(this.objInfoPasien, "id_transaksi")
        },
        cancelProses(){
            if(typeof this.objInfoPasien.id_transaksi != "undefined"){

                let fr=new FormData()
                fr.set('kode_transaksi',this.objInfoPasien.id_transaksi)
                fr.set('device_info',this.deviceInfo)
                let config = {
                    headers:{
                        'Authorization' : 'Bearer ' + this.pengguna.api_token,
                    }
                }
                // console.log(this.objInfoPasien.id_transaksi)
                this.axios.post('kartu-stok/cancel-proses-kartu-stok-resep',fr,config)
                .then((response)=>{
                    if(response.data.status=='success'){
                        this.setNotif({
                            status:true,
                            color:response.data.status,
                            text:response.data.message
                        })
                        // this.lock_pencarian = false
                        this.objInfoPasien = {}
                        this.resep_dokter = []
                        this.nota_resep = []
                        this.kode_transaksi = ''
                        this.nomor_resep = ''
                    }else{
                        console.log(response)
                    }
                })
                .catch((response)=>{
                    console.log(response)
                })
            }else{
                this.setNotif({
                    status:true,
                    color:'error',
                    text:'tidak ada data yang akan diproses kartu stok'
                })
            }
        },
        onButtonClick(item,idxCari) {
            // console.log('click on ' + item)
            let fr=new FormData()
            fr.set('depo',this.pengguna.kode_unit)
            fr.set('device_info',this.deviceInfo)
            if(idxCari==1){
                fr.set('kode_transaksi',item)
                fr.set('nomor_resep',null)
                fr.set('tgl_resep',null)
                fr.set('jenis_transaksi',this.objJenisTransaksi.kode)
            }else if(idxCari==2){
                fr.set('kode_transaksi',this.kode_transaksi)
                fr.set('nomor_resep',this.nomor_resep)
                fr.set('tgl_resep',this.date_resep)
                fr.set('jenis_transaksi',this.objJenisTransaksi.kode)
            }
            let config = {
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            this.objInfoPasien = {}
            this.resep_dokter = []
            if((this.nomor_resep=='' || this.nomor_resep=='0') && this.kode_transaksi=='' && idxCari==2){
                this.setNotif({
                    status:true,
                    color:'error',
                    text:'lengkapi parameter pencarian'
                })
            }else{
                this.axios.post('kartu-stok/cari-transaksi-farmasi',fr,config)
                .then((response)=>{
                    // console.log(response)
                    if(response.data.status=='success'){
                        console.log(response.data.data)
                        this.kode_transaksi = response.data.data.id_transaksi
                        this.objInfoPasien = response.data.data
                        this.resep_dokter = response.data.data.rincian_eresep
                        this.nota_resep = response.data.data.rincian_nota_resep
                        this.dialog_kode_transaksi = false
                        this.listRakBarang()
                        this.setNotif({
                            status:true,
                            color:'success',
                            text:'data transaksi siap diproses'
                        })
                    }else{
                        this.setNotif({
                            status:true,
                            color:'error',
                            text:response.data.message
                        })
                    }
                })
                .catch((response)=>{
                    console.log(response)
                })
            }
        },
        getListResep(){
            let fr = new FormData()
            fr.set('depo',this.pengguna.kode_unit)
            fr.set('tgl1',this.formatDateTime(this.date_1,8))
            fr.set('tgl2',this.formatDateTime(this.date_2,8))
            fr.set('jenis_transaksi',this.objJenisTransaksi.kode)
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            this.tabel_kode_transaksi = []
            this.axios.post('kartu-stok/list-transaksi',fr,config)
            .then((response)=>{
                // console.log(response)
                this.tabel_kode_transaksi = response.data.data
                this.loading=false
            })
            .catch((response)=>{
                console.log(response)
                this.loading=false
            })
        },
        close(){
            if(!this.cekExistingObjPasien()){
                this.$emit('closed',false)
            }else{
                this.setNotif({
                    status:true,
                    color:'error',
                    text:'save/cancel transaksi terlebih dahulu'
                })
            }
        },
        saveProses(){
            if(typeof this.objInfoPasien == 'undefined' || this.nota_resep.length<1){
                this.setNotif({
                    status:true,
                    color:'error',
                    text:'tidak ada data yang diproses'
                })
            }else{
                let frdata =    {
                    'depo' : this.pengguna.kode_unit,
                    'id_transaksi' : this.objInfoPasien.id_transaksi,
                    'tgl_transaksi_farmasi' : this.objInfoPasien.tgl,
                    'jenis_transaksi' : this.objJenisTransaksi.kode,
                    'mutasi' : this.objJenisTransaksi.mutasi,
                    'transaksi' : JSON.stringify(this.nota_resep),
                    'device_info':this.deviceInfo,
                }
                let config={
                    headers:{
                        'Authorization' : 'Bearer ' + this.pengguna.api_token,
                    }
                }
                // console.log(frdata)
                this.axios.post('/kartu-stok/simpan-transfer-stok-resep',frdata,config)
                .then((response)=>{
                    // console.log(response)
                    if(response.data.status=='error'){
                        this.setNotif({
                            status:true,
                            color:response.data.status,
                            text:response.data.message,
                        })
                    }else{
                        this.objInfoPasien = {}
                        this.resep_dokter = []
                        this.nota_resep = []
                        this.kode_transaksi = ''
                        this.nomor_resep = ''
                        this.getListResep()
                        this.setNotif({
                            status:true,
                            color:response.data.status,
                            text:response.data.message,
                        })
                    }
                })
                .catch((response)=>{
                    console.log(response.error)
                })
            }
        }
    },
}
</script>