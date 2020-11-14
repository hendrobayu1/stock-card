<template>
    <v-card color="grey lighten-2">
        <v-card-title class="headline"><span class="font-weight-bold text-sm-body-1 basil--text">Laporan Kartu Stok [{{pengguna.unit}}]</span></v-card-title>
        <v-tabs v-model="tab" color="basil" grow>
            <v-tab v-model="tab" v-for="item in item_tab" :key="item">{{item}}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item :key="item_tab[0]">
                <v-card flat>
                    <v-card-text>
                        <v-data-table :headers="headers_my" :items="transaksi_my" :loading="loading[0]" :loading-text="loadText[0]" 
                            class="elevation-2" :sort-by="['id_transaksi']" 
                            :sort-desc="[false,false]" multi-sort>
                            
                            <template v-slot:top>
                                <v-card-title>
                                    <v-row>
                                        <v-col cols="12" lg="2" sm="2">
                                            <v-menu v-model="date_menu_1" :close-on-content-click="false" :nudge-right="5" 
                                            transition="scale-transition" offset-y max-width="290px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field dense v-model="computedDateFormat_1" label="Tanggal awal"
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
                                                    <v-text-field dense v-model="computedDateFormat_2" label="Tanggal akhir"
                                                    readonly v-bind="attrs" v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="date_2" @input="date_menu_2 = false" 
                                                :min="date_1"></v-date-picker>
                                            </v-menu>                        
                                        </v-col>
                                        <!-- <v-spacer /> -->
                                        <v-col cols="12" lg="4" sm="4">
                                            <v-autocomplete dense label="Pilih jenis transaksi" :items="jenisTransaksi_my" 
                                            v-model="idJenisTransaksi_my" item-text="tipe" item-value="kode" />
                                        </v-col> 

                                        <v-spacer />
                                        <v-col cols="12" lg="2" sm="2">
                                            <!-- <v-autocomplete label="Pilih jenis transaksi" :items="jenisTransaksi_my" 
                                            v-model="idJenisTransaksi_my" item-text="tipe" item-value="kode" /> -->
                                            <v-menu offset-y dense>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn color="primary" tile outlined v-bind="attrs" v-on="on"><v-icon left dark>mdi-cloud-download</v-icon> Eksport</v-btn>
                                                </template>
                                                <v-list dense>
                                                    <v-list-item>
                                                        <v-list-item-title style="cursor:pointer">
                                                            <export-excel 
                                                            :fields="field_export_my" :data="transaksi_my" worksheet = "Report" name="My_Transaction_Report.xls"><v-icon>mdi-file-excel</v-icon> Excel</export-excel>
                                                        </v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item @click="eksportPdf()">
                                                        <v-list-item-title><v-icon>mdi-file-pdf</v-icon> Pdf</v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-menu>
                                        </v-col>

                                    </v-row>
                                </v-card-title>
                            </template>

                            <template v-slot:item.id_transaksi="{item}">
                                <span class="font-content-data-table">{{item.id_transaksi}}</span>
                            </template>
                            <template v-slot:item.kode_brg_phc="{item}">
                                <span class="font-content-data-table">{{item.kode_brg_phc}}</span>
                            </template>
                            <template v-slot:item.kode_brg_centra="{item}">
                                <span class="font-content-data-table">{{item.kode_brg_centra}}</span>
                            </template>
                            <template v-slot:item.nama_brg="{item}">
                                <span class="font-content-data-table">{{item.nama_brg}}</span>
                            </template>
                            <template v-slot:item.rak_brg="{item}">
                                <span class="font-content-data-table">{{item.rak_brg}}</span>
                            </template>
                            <template v-slot:item.qty_brg="{item}">
                                <span class="font-content-data-table">{{parseInt(item.qty_brg).toLocaleString('id-ID')}}</span>
                            </template>
                            <template v-slot:item.tgl_mutasi="{item}">
                                <span class="font-content-data-table">{{formatDateTime(item.tgl_mutasi,9)}}</span>
                            </template>
                            <template v-slot:item.mutasi="{item}">
                                <span class="font-content-data-table">{{item.mutasi}}</span>
                            </template>
                            <template v-slot:item.tipe_transaksi="{item}">
                                <span class="font-content-data-table">{{item.tipe_transaksi}}</span>
                            </template>
                            <template v-slot:item.referensi="{item}">
                                <span class="font-content-data-table">{{item.referensi}}</span>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-tab-item>

            <v-tab-item :key="item_tab[1]">
                <v-card flat>
                    <v-card-text>
                        <v-data-table :headers="headers_all_transaksi" :items="transaksi_all" :loading="loading[1]" :loading-text="loadText[1]" 
                            class="elevation-2" :sort-by="['id_transaksi']" 
                            :sort-desc="[false,false]" multi-sort>
                            
                            <template v-slot:top>
                                <v-card-title>
                                    <v-row>
                                        <v-col cols="12" lg="2" sm="2">
                                            <v-menu v-model="date_menu_3" :close-on-content-click="false" :nudge-right="5" 
                                            transition="scale-transition" offset-y max-width="290px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field dense v-model="computedDateFormat_3" label="Tanggal awal"
                                                    readonly v-bind="attrs" v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="date_3" @input="date_menu_3 = false" 
                                                :max="date_4"></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        <v-col cols="12" lg="2" sm="2">
                                            <v-menu v-model="date_menu_4" :close-on-content-click="false" :nudge-right="5" 
                                            transition="scale-transition" offset-y min-width="290px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field dense v-model="computedDateFormat_4" label="Tanggal akhir"
                                                    readonly v-bind="attrs" v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="date_4" @input="date_menu_4 = false" 
                                                :min="date_3"></v-date-picker>
                                            </v-menu>                        
                                        </v-col>
                                        <!-- <v-spacer /> -->
                                        <v-col cols="12" lg="4" sm="4">
                                            <v-autocomplete dense label="Pilih jenis transaksi" :items="jenisTransaksi_all" 
                                            v-model="idJenisTransaksi_all" item-text="tipe" item-value="kode" />
                                        </v-col> 

                                        <v-spacer />
                                        <v-col cols="12" lg="2" sm="2">
                                            <!-- <v-autocomplete label="Pilih jenis transaksi" :items="jenisTransaksi_my" 
                                            v-model="idJenisTransaksi_my" item-text="tipe" item-value="kode" /> -->
                                            <v-menu offset-y dense>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn color="primary" tile outlined v-bind="attrs" v-on="on"><v-icon left dark>mdi-cloud-download</v-icon> Eksport</v-btn>
                                                </template>
                                                <v-list dense>
                                                    <v-list-item>
                                                        <v-list-item-title style="cursor:pointer">
                                                            <export-excel 
                                                            :fields="field_export_all" :data="transaksi_all" worksheet = "Report" name="Transaction_Report.xls"><v-icon>mdi-file-excel</v-icon> Excel</export-excel>
                                                        </v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item @click="eksportPdf()">
                                                        <v-list-item-title><v-icon>mdi-file-pdf</v-icon> Pdf</v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-menu>
                                        </v-col>

                                    </v-row>
                                </v-card-title>
                            </template>

                            <template v-slot:item.id_transaksi="{item}">
                                <span class="font-content-data-table">{{item.id_transaksi}}</span>
                            </template>
                            <template v-slot:item.kode_brg_phc="{item}">
                                <span class="font-content-data-table">{{item.kode_brg_phc}}</span>
                            </template>
                            <template v-slot:item.kode_brg_centra="{item}">
                                <span class="font-content-data-table">{{item.kode_brg_centra}}</span>
                            </template>
                            <template v-slot:item.nama_brg="{item}">
                                <span class="font-content-data-table">{{item.nama_brg}}</span>
                            </template>
                            <template v-slot:item.rak_brg="{item}">
                                <span class="font-content-data-table">{{item.rak_brg}}</span>
                            </template>
                            <template v-slot:item.qty_brg="{item}">
                                <span class="font-content-data-table">{{parseInt(item.qty_brg).toLocaleString('id-ID')}}</span>
                            </template>
                            <template v-slot:item.tgl_mutasi="{item}">
                                <span class="font-content-data-table">{{formatDateTime(item.tgl_mutasi,9)}}</span>
                            </template>
                            <template v-slot:item.mutasi="{item}">
                                <span class="font-content-data-table">{{item.mutasi}}</span>
                            </template>
                            <template v-slot:item.tipe_transaksi="{item}">
                                <span class="font-content-data-table">{{item.tipe_transaksi}}</span>
                            </template>
                            <template v-slot:item.referensi="{item}">
                                <span class="font-content-data-table">{{item.referensi}}</span>
                            </template>
                            <template v-slot:item.user="{item}">
                                <span class="font-content-data-table">{{item.user}}</span>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-tab-item>

            <v-tab-item :key="item_tab[2]">
                <v-card flat>
                    <v-card-text>
                        <v-data-table :headers="headers_movement" :items="transaksi_movement" :loading="loading[2]" :loading-text="loadText[2]" 
                            class="elevation-2">
                            
                            <template v-slot:top>
                                <v-card-title>
                                    <v-row>
                                        <v-col cols="12" lg="2" sm="2">
                                            <v-menu v-model="date_menu_5" :close-on-content-click="false" :nudge-right="5" 
                                            transition="scale-transition" offset-y max-width="290px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field dense v-model="computedDateFormat_5" label="Tanggal awal"
                                                    readonly v-bind="attrs" v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="date_5" @input="date_menu_5 = false" 
                                                :max="date_6"></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        <v-col cols="12" lg="2" sm="2">
                                            <v-menu v-model="date_menu_6" :close-on-content-click="false" :nudge-right="5" 
                                            transition="scale-transition" offset-y min-width="290px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field dense v-model="computedDateFormat_6" label="Tanggal akhir"
                                                    readonly v-bind="attrs" v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="date_6" @input="date_menu_6 = false" 
                                                :min="date_5"></v-date-picker>
                                            </v-menu>                        
                                        </v-col>
                                        <!-- <v-spacer /> -->
                                        <v-col cols="12" lg="4" sm="4">
                                            <v-autocomplete v-model="objKartuStok" :items="barang_movement" :loading="isLoading"
                                                :search-input.sync="search" hide-no-data hide-selected :hint="`Rak : `+objKartuStok.nama_lemari"
                                                item-text="nama_barang" item-value="kode_barang_phc" 
                                                label="Nama Barang" return-object dense 
                                                clear-icon="mdi-close-circle">
                                                <template v-slot:item="data">
                                                    <v-list-item-content>
                                                        <v-list-item-title v-html="data.item.nama_barang"></v-list-item-title>
                                                        <v-list-item-subtitle v-html="data.item.nama_lemari"></v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </template>
                                            </v-autocomplete>
                                        </v-col>
                                        <v-col cols="12" lg="2" sm="2">
                                            <v-autocomplete label="Pilih jenis mutasi" :items="jenis_movement" 
                                            v-model="idMutasi" item-text="keterangan" item-value="kode" dense />
                                        </v-col> 

                                        <v-spacer />
                                        <v-col cols="12" lg="2" sm="2">
                                            <!-- <v-autocomplete label="Pilih jenis transaksi" :items="jenisTransaksi_my" 
                                            v-model="idJenisTransaksi_my" item-text="tipe" item-value="kode" /> -->
                                            <v-menu offset-y dense>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn color="primary" tile outlined v-bind="attrs" v-on="on"><v-icon left dark>mdi-cloud-download</v-icon> Eksport</v-btn>
                                                </template>
                                                <v-list dense>
                                                    <v-list-item>
                                                        <v-list-item-title style="cursor:pointer">
                                                            <export-excel 
                                                                :fields="field_export_movement" :data="transaksi_movement" worksheet = "Report" name="Movement_Report.xls"><v-icon>mdi-file-excel</v-icon> Excel</export-excel>
                                                        </v-list-item-title>
                                                    </v-list-item>
                                                    <v-list-item @click="eksportPdf()">
                                                        <v-list-item-title><v-icon>mdi-file-pdf</v-icon> Pdf</v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-menu>
                                        </v-col>

                                    </v-row>
                                </v-card-title>
                            </template>

                             <template v-slot:item.kode="{item}">
                                <span class="font-content-data-table">{{item.kode}}</span>
                            </template>
                             <template v-slot:item.nama="{item}">
                                <span class="font-content-data-table">{{item.nama}}</span>
                            </template>
                             <template v-slot:item.rak="{item}">
                                <span class="font-content-data-table">{{item.rak}}</span>
                            </template>
                            <template v-slot:item.keterangan="{item}">
                                <span class="font-content-data-table">{{item.keterangan}}</span>
                            </template>
                            <template v-slot:item.tgl="{item}">
                                <span class="font-content-data-table">{{formatDateTime(item.tgl,9)}}</span>
                            </template>
                            <template v-slot:item.tipe_transaksi="{item}">
                                <span class="font-content-data-table">{{item.tipe_transaksi}}</span>
                            </template>
                            <template v-slot:item.petugas="{item}">
                                <span class="font-content-data-table">{{item.petugas}}</span>
                            </template>
                            <template v-slot:item.awal="{item}">
                                <span class="font-content-data-table">{{parseInt(item.awal).toLocaleString('id-ID')}}</span>
                            </template>
                            <template v-slot:item.masuk="{item}">
                                <span class="font-content-data-table">{{parseInt(item.masuk).toLocaleString('id-ID')}}</span>
                            </template>
                            <template v-slot:item.keluar="{item}">
                                <span class="font-content-data-table">{{parseInt(item.keluar).toLocaleString('id-ID')}}</span>
                            </template>
                            <template v-slot:item.akhir="{item}">
                                <span class="font-content-data-table">{{parseInt(item.akhir).toLocaleString('id-ID')}}</span>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-tab-item>

        </v-tabs-items>
    </v-card>
</template>

<style>
    .basil--text {
        color: #356859 !important;
    }
</style>

<script>
import {mapGetters,mapActions} from 'vuex'
import {jsPDF} from 'jspdf'
// import * as arrialnarrow from 'arrialnarrow'
// import * as arrialnarrow_bold from 'arrialnarrow_bold'
// import * as arrialnarrow_italic from 'arrialnarrow_italic'

// import * as arrialnarrow from './assets/fonts/ARIALN-normal.js'
// import * as arrialnarrow_bold from './assets/fonts/ARIALN-bold.js'
// import * as arrialnarrow_italic from './assets/fonts/ARIALN-italic.js'
// import arialnarrow from '../assets/fonts/ARIALN-normal.js'
// import excel from 'vue-excel-export'
import moment from 'moment'
export default {
    data:()=>({
        tab:null,
        item_tab:['My Report','All Reports','Movement Report'],
        headers_my: [
            {text: 'ID',value: 'id_transaksi',align:'start',sortable:true},
            {text: 'Kode 1',value: 'kode_brg_phc',align:'start'},
            {text: 'Kode 2',value: 'kode_brg_centra',align:'start'},
            {text: 'Nama Barang',value: 'nama_brg',align:'start'},
            {text: 'Rak',value: 'rak_brg',align:'start'},
            {text: 'Qty',value: 'qty_brg',align:'start'},
            {text: 'Tgl Proses',value: 'tgl_mutasi',align:'start'},
            {text: 'Mutasi',value: 'mutasi',align:'start'},
            {text: 'Jenis',value: 'tipe_transaksi',align:'start'},
            {text: 'Referensi',value: 'referensi',align:'start'},
        ],
        field_export_my:{
            'ID' : 'id_transaksi',
            'Kode 1' : 'kode_brg_phc',
            'Kode 2' : 'kode_brg_centra',
            'Nama Barang' : 'nama_brg',
            'Rak' : 'rak_brg',
            'Qty' : 'qty_brg',
            'Tgl Proses' : 'tgl_mutasi',
            'Mutasi' : 'mutasi',
            'Jenis' : 'tipe_transaksi',
            'Referensi' : 'referensi',
        },
        headers_all_transaksi: [
            {text: 'ID',value: 'id_transaksi',align:'start',sortable:true},
            {text: 'Kode 1',value: 'kode_brg_phc',align:'start'},
            {text: 'Kode 2',value: 'kode_brg_centra',align:'start'},
            {text: 'Nama Barang',value: 'nama_brg',align:'start'},
            {text: 'Rak',value: 'rak_brg',align:'start'},
            {text: 'Qty',value: 'qty_brg',align:'start'},
            {text: 'Tgl Proses',value: 'tgl_mutasi',align:'start'},
            {text: 'Mutasi',value: 'mutasi',align:'start'},
            {text: 'Jenis',value: 'tipe_transaksi',align:'start'},
            {text: 'Referensi',value: 'referensi',align:'start'},
            {text: 'Petugas',value: 'user',align:'start'},
        ],
        field_export_all:{
            'ID' : 'id_transaksi',
            'Kode 1' : 'kode_brg_phc',
            'Kode 2' : 'kode_brg_centra',
            'Nama Barang' : 'nama_brg',
            'Rak' : 'rak_brg',
            'Qty' : 'qty_brg',
            'Tgl Proses' : 'tgl_mutasi',
            'Mutasi' : 'mutasi',
            'Jenis' : 'tipe_transaksi',
            'Referensi' : 'referensi',
            'Petugas' : 'user',
        },
        headers_movement: [
            {text: 'Kode',value: 'kode',align:'start',sortable:false},
            {text: 'Nama Barang',value: 'nama',align:'start',sortable:false},
            {text: 'Rak',value: 'rak',align:'start',sortable:false},
            {text: 'Keterangan',value: 'keterangan',align:'start',sortable:false},
            {text: 'Tgl Proses',value: 'tgl',align:'start',sortable:false},
            {text: 'Jenis Transaksi',value: 'tipe_transaksi',align:'start',sortable:false},
            {text: 'Petugas',value: 'petugas',align:'start',sortable:false},
            {text: 'Awal',value: 'awal',align:'start',sortable:false},
            {text: 'Masuk',value: 'masuk',align:'start',sortable:false},
            {text: 'Keluar',value: 'keluar',align:'start',sortable:false},
            {text: 'Akhir',value: 'akhir',align:'start',sortable:false},
        ],
        field_export_movement:{
            'Kode' : 'kode',
            'Nama' : 'nama',
            'Rak' : 'rak',
            'Keterangan' : 'keterangan',
            'Tgl Proses' : 'tgl',
            'Jenis Transaksi' : 'tipe_transaksi',
            'Petugas' : 'petugas',
            'Awal' : 'awal',
            'Masuk' : 'masuk',
            'Keluar' : 'keluar',
            'Akhir' : 'akhir',
        },
        transaksi_my: [],
        transaksi_all: [],
        transaksi_movement: [],
        loading:[false,false,false],
        loadText:['Mohon tunggu...','Mohon tunggu...','Mohon tunggu...'],
        date_menu_1:false,
        date_menu_2:false,
        date_menu_3:false,
        date_menu_4:false,
        date_menu_5:false,
        date_menu_6:false,
        date_1:moment().format('YYYY-MM-DD'),
        date_2:moment().format('YYYY-MM-DD'),
        date_3:moment().format('YYYY-MM-DD'),
        date_4:moment().format('YYYY-MM-DD'),
        date_5:moment().format('YYYY-MM-DD'),
        date_6:moment().format('YYYY-MM-DD'),
        idJenisTransaksi_my:'',
        idJenisTransaksi_all:'',
        objKartuStok:{},
        search:null,
        isLoading:false,
        idMutasi:'',
        jenisTransaksi_my:[],
        jenisTransaksi_all:[],
        barang_movement:[],
        jenis_movement:[{
            'kode':'X',
            'keterangan':'Semua',
        },{
            'kode':'I',
            'keterangan':'Masuk',
        },{
            'kode':'O',
            'keterangan':'Keluar',
        }],
    }),
    computed:{
        ...mapGetters({
              pengguna:'authentikasi/user',
        }),
        computedDateFormat_1(){
            this.listMyTransaksi()
            return this.formatDateTime(this.date_1,8)
        },
        computedDateFormat_2(){
            this.listMyTransaksi()
            return this.formatDateTime(this.date_2,8)
        },
        computedDateFormat_3(){
            this.listAllTransaksi()
            return this.formatDateTime(this.date_3,8)
        },
        computedDateFormat_4(){
            this.listAllTransaksi()
            return this.formatDateTime(this.date_4,8)
        },
        computedDateFormat_5(){
            this.listMovement()
            return this.formatDateTime(this.date_5,8)
        },
        computedDateFormat_6(){
            this.listMovement()
            return this.formatDateTime(this.date_6,8)
        }
    },
    watch:{
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
            this.axios.post('/kartu-stok/list-barang-depo',frdata,config)
            // .then(response => response.json())
            .then((response) => {
                this.barang_movement = response.data.data
            })
            .catch((error) => {
                let {data} = error.response
                console.log(data.message)
            })
            .finally(() => (this.isLoading = false))
        }
    },
    created(){
        this.idMutasi = 'X'
        let config={
            headers:{
                'Authorization' : 'Bearer ' + this.pengguna.api_token,
            }
        }
        this.axios.post('/kartu-stok/jenis-transaksi',{},config)
        .then((response)=>{
            let{data} = response.data
            // console.log(data)
            data.unshift({'kode' : '0',tipe:'Semua Transaksi'})
            data.push({'kode' : '99',tipe:'Transfer Stok'})
            this.jenisTransaksi_my = data
            this.jenisTransaksi_all = data
            // this.jenisTransaksi_my.unshift(['Semua Transaksi'])
            this.idJenisTransaksi_my='0'
            this.idJenisTransaksi_all='0'
        })
        .catch((error)=>{
            let {data} = error.response
            console.log(data.message)
        })
    },
    // mounted(){
    //     this.listMyTransaksi()
    // },
    methods:{
        ...mapActions({
            setNotif:'notif/actNotif',
        }),
        listMyTransaksi(){
            let config = {
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token
                }
            }
            let fr = {
                'depo' : this.pengguna.kode_unit,
                'tgl1' : this.date_1,
                'tgl2' : this.date_2,
                'jenis_transaksi' : this.idJenisTransaksi_my
            }
            // console.log(config)
            // console.log({...fr})
            this.axios.post('/kartu-stok/report-transaksiku',fr,config)
            .then((response)=>{
                this.transaksi_my = response.data.data
                this.loading[0] = false
            })
            .catch((error)=>{
                let {data} = error.response
                console.log(data.message)
                this.loading[0]=false
            })
        },
        listAllTransaksi(){
            let config = {
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token
                }
            }
            let fr = {
                'depo' : this.pengguna.kode_unit,
                'tgl1' : this.date_3,
                'tgl2' : this.date_4,
                'jenis_transaksi' : this.idJenisTransaksi_all
            }
            // console.log({...fr})
            this.axios.post('/kartu-stok/report-transaksi',fr,config)
            .then((response)=>{
                this.transaksi_all = response.data.data
                this.loading[1] = false
            })
            .catch((error)=>{
                let {data} = error.response
                console.log(data.message)
                this.loading[1]=false
            })
        },
        listMovement(){
            let valid = true
            if (typeof this.objKartuStok != "undefined"){
                if(this.objKartuStok.id_kartu_stok == null){
                    valid=false
                }
            }else{
                valid = false
            }
            this.transaksi_movement = []
            if(valid){
                let config = {
                    headers:{
                        'Authorization' : 'Bearer ' + this.pengguna.api_token
                    }
                }
                let fr = {
                    'depo' : this.pengguna.kode_unit,
                    'tgl1' : this.date_5,
                    'tgl2' : this.date_6,
                    'id_kartu_stok' : this.objKartuStok.id_kartu_stok,
                    'mutasi' : this.idMutasi
                }
                // console.log(config)
                // console.log({...fr})
                this.axios.post('/kartu-stok/report-movement',fr,config)
                .then((response)=>{
                    this.transaksi_movement = response.data.data
                    this.loading[2] = false
                })
                .catch((error)=>{
                    let {data} = error.response
                    console.log(data.message)
                    this.loading[2]=false
                })
            }
        },
        eksportPdf(){
            this.setNotif({
                status:true,
                color:'error',
                text:'fitur dalam pengembangan',
            })
            const doc = new jsPDF({
                orientation: "portrait",
                paper: "a4",
            })
            // arrialnarrow
            // arrialnarrow_bold
            // arrialnarrow_italic
            // console.log(doc.getFontList())
            doc.setFont('ARIALN','bold')
            doc.setFontSize(12)

            let img  = new Image()
            
            // let promise = fetch(this.getLogoInstansi('logo_1.png'),{mode:'no-cors'})
            // console.log(promise)
            // promise
            // .then((response)=>{
            //     console.log(response)
            //     // img.src = require(response)
            //     // doc.addImage(img,'PNG',20,10,40,20)
            //     doc.text('HENDRO SUCIPTO BAYU',30,50)
            //     window.open(doc.output('bloburl'))
            // })
            // .catch((error)=>{
            //     console.log(error)
            // })

            img.src = require('@/assets/logo-perusahaan/logo_1.png')//this.getLogoInstansi('logo_1.png')
            // console.log(img)
            doc.addImage(img,'PNG',20,10,40,20)
            doc.text('HENDRO SUCIPTO BAYU',30,50)
            window.open(doc.output('bloburl'))
        },
    },
}
</script>