<template>
  <v-data-table :headers="headers" :items="medicines" :loading="loading" :loading-text="loadText" 
  class="elevation-2" :search="cari" :sort-by="['nama_lemari','nama_obat']" 
  :sort-desc="[false,false]" multi-sort>
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title class="colortitle">[{{pengguna.kode_unit}}] - {{pengguna.unit}}</v-toolbar-title>
        <v-divider class="mx-3" inset vertical />
        <v-spacer></v-spacer>
        <v-text-field v-model="cari" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-dialog v-model="dialog" max-width="600px" persistent>
          <!-- <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >New Item</v-btn>
          </template> -->
          <v-card>
            <v-card-title class="headline grey lighten-2">
              <span class="text-sm-body-1 font-weight-bold">Preview Obat</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="2" md="2">
                    <v-text-field class="text-sm-body-2" v-model="previewItem.nama_lemari" label="Rak obat" readonly></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="3" md="3">
                    <v-text-field class="text-sm-body-2" v-model="previewItem.kode_obat_phc" label="Kode obat" readonly></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="7" md="7">
                    <v-text-field class="text-sm-body-2" v-model="previewItem.nama_obat" label="Nama obat" readonly></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="9" md="9">
                    <v-text-field class="text-sm-body-2" v-model="previewItem.kemasan" label="Kemasan" readonly></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="3" md="3">
                    <v-text-field class="text-sm-body-2" v-model="previewItem.isi" label="Isi" readonly></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="9" md="9">
                    <v-text-field class="text-sm-body-2" v-model="previewItem.jenis" label="Jenis" readonly></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="3" md="3">
                    <v-text-field class="text-sm-body-2" v-model="previewItem.grup" label="Grup" readonly></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning" dark @click="close">Keluar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.nama_lemari="{ item }">
        <span class="font-content-data-table">{{item.nama_lemari}}</span>
    </template>
    <template v-slot:item.kode_obat_phc="{ item }">
        <span class="font-content-data-table">{{item.kode_obat_phc}}</span>
    </template>
    <template v-slot:item.kode_obat_centra="{ item }">
        <span class="font-content-data-table">{{item.kode_obat_centra}}</span>
    </template>
    <template v-slot:item.nama_obat="{ item }">
        <span class="font-content-data-table">{{item.nama_obat}}</span>
    </template>
    <template v-slot:item.kemasan="{ item }">
        <span class="font-content-data-table">{{item.kemasan}}</span>
    </template>
    <template v-slot:item.isi="{ item }">
        <span class="font-content-data-table">{{item.isi}}</span>
    </template>
    <template v-slot:item.jenis="{ item }">
        <span class="font-content-data-table">{{item.jenis}}</span>
    </template>
    <template v-slot:item.grup="{ item }">
        <span class="font-content-data-table">{{item.grup}}</span>
    </template>
    <template v-slot:item.akhir="{ item }">
        <span class="font-content-data-table">{{parseInt(item.akhir).toLocaleString('id-ID')}}</span>
    </template>
    <template v-slot:item.aksi="{ item }">
      <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn small color="warning" dark @click="prevItem(item)" v-bind="attrs" v-on="on">
              <v-icon>mdi-file-find</v-icon>
            </v-btn>
            <!-- <v-icon medium class="mr-2" @click="prevItem(item)" v-bind="attrs" v-on="on">
                mdi-clipboard-edit-outline
            </v-icon> -->
          </template>
          <span>{{button_icon_preview}}</span>
      </v-tooltip>
    </template>
    <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template> -->
  </v-data-table>
</template>

<script>
import {mapGetters} from 'vuex'
  export default {
    data: () => ({
      dialog: false,
      cari:'',
      loading:true,
      loadText:'Mohon tunggu...',
      button_icon_preview:'preview obat',
      // depoAwal:'',
      headers: [
        {text: 'Rak Obat',value: 'nama_lemari',align:'start'},
        {text: 'Kode 1',value: 'kode_obat_phc',},
        {text: 'Kode 2',value: 'kode_obat_centra',},
        { text: 'Nama obat', value: 'nama_obat',},
        { text: 'Kemasan', value: 'kemasan',},
        { text: 'Isi', value: 'isi',},
        { text: 'Jenis', value: 'jenis',},
        { text: 'Grup', value: 'grup',visibility: 'hidden'},
        // { text: 'Awal', value: 'stok_awal' },
        // { text: 'Masuk', value: 'masuk' },
        // { text: 'Keluar', value: 'keluar' },
        { text: 'Stok', value: 'akhir',},
        { text: 'Aksi', value: 'aksi', sortable: false,},
      ],
      medicines: [],
      previewIndex: -1,
      previewItem: {
        nama_lemari: '',
        kode_obat_phc: '',
        nama_obat: '',
        kemasan: '',
        isi: '',
        jenis: '',
        grup: '',
        // akhir: '',
        // hjual: [],
        // supplier: [],
        // pabrik: [],
        // terapi: [],
        // bahan: [],
        // dosis: [],
        // fungsi: [],
      },
      defaultItem: {
        nama_lemari: '',
        kode_obat_phc: '',
        kode_obat_centra: '',
        nama_obat: '',
        kemasan: '',
        isi: 0,
        jenis: '',
        grup: '',
        akhir: '',
      },
    }),

    computed: {
        ...mapGetters({
            pengguna:'authentikasi/user',
        }),
      // formTitle () {
      //   return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      // },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      // depoAwal(){
      //   console.log('depo awal : ' + this.depoAwal)
      //   console.log('depo akhir : ' + this.pengguna.kode_unit)
      //   if(this.depoAwal != this.pengguna.kode_unit){
      //     this.depoAwal = this.pengguna.kode_unit
      //     this.initialize()
      //   }
      // },
    },

    // updated(){
    //   this.initialize()
    // },

    created () {
      this.initialize()
    },

    methods: {
        // updatedData(){
        //   if(this.depoAwal != this.pengguna.kode_unit){
        //     this.depoAwal = this.pengguna.kode_unit
        //     this.initialize()
        //   }
        // },
        initialize () {
            // if(this.depoAwal != this.pengguna.kode_unit){
            //     this.depoAwal = this.pengguna.kode_unit
            let formData = {
              'depo':this.pengguna.kode_unit,
            }
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            // this.loading = true
            this.medicines = []
            this.axios.post('/kartu-stok/list-obat',formData,config)
            .then((response)=>{
                // console.log(this.pengguna.kode_unit)
                // console.log(response)
                this.medicines = response.data.data
                this.loading = false
            })
            .catch((error)=>{
                this.loading = false
                let {data} = error.response
                console.log(data.message)
            })
            // }
      },

      prevItem (item) {
        this.previewIndex = this.medicines.indexOf(item)
        this.previewItem = Object.assign({}, item)
        // console.log(item.id_kartu_stok)
        this.dialog = true
      },

      // deleteItem (item) {
      //   const index = this.medicines.indexOf(item)
      //   confirm('Are you sure you want to delete this item?') && this.medicines.splice(index, 1)
      // },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.previewItem = Object.assign({}, this.defaultItem)
          this.previewIndex = -1
        })
      },

      // save () {
      //   if (this.editedIndex > -1) {
      //     Object.assign(this.medicines[this.editedIndex], this.editedItem)
      //   } else {
      //     this.medicines.push(this.editedItem)
      //   }
      //   this.close()
      // },
    },
  }
</script>