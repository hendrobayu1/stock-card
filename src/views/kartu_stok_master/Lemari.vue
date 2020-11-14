<template>
    <v-card>

        <v-card-title class="text-h6 grey lighten-2">
            <span class="text-sm-body-1 font-weight-bold">[{{pengguna.kode_unit}}] - List Rak Obat {{pengguna.unit}}</span>
            <v-spacer />
            <v-dialog v-model="dialog" persistent max-width="200px">
                <template v-slot:activator="{ on, attrs }">
                    <!-- <v-spacer /> -->
                    <v-btn small v-model="fab" color="blue darken-2" dark fab v-bind="attrs" v-on="on">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="headline grey lighten-2">
                        <span class="text-sm-body-1 font-weight-bold">{{formTitle()}}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="editItem.nmlemari" label="Nama Rak"></v-text-field>
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
        </v-card-title>

        <v-data-table :headers="headers" :items="lemari" :loading="loading" :loading-text="loadText" 
            class="elevation-2" :search="cari" :sort-by="['idlemari']" 
            :sort-desc="[false]">
            <template v-slot:top>
            
            <!-- <v-toolbar flat color="white">
                <v-toolbar-title class="colortitle">[{{pengguna.kode_unit}}] - List Lemari Obat {{pengguna.unit}}</v-toolbar-title>
                <v-divider class="mx-3" inset vertical />
                <v-spacer />
                <v-dialog v-model="dialog" max-width="200px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Tambah Lemari</v-btn>    
                    </template>
                    <v-card>
                        <v-card-title class="headline grey lighten-2">
                            {{formTitle()}}
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="editItem.nmlemari" label="Nama lemari"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-divider />
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">Keluar</v-btn>
                            <v-btn color="blue darken-1" text @click="save">Simpan</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar> -->

            <v-card-title>
                <v-text-field v-model="cari" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            </v-card-title>
            </template>
            <template v-slot:item.aksi="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small color="success" class="ma-2" dark @click="editedItem(item)" v-bind="attrs" v-on="on">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </template>
                    <span>{{button_icon_edit}}</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small color="error" class="ma-2" dark @click="deletedItem(item)" v-bind="attrs" v-on="on">
                            <v-icon >mdi-delete</v-icon>
                        </v-btn>
                    </template>
                    <span>{{button_icon_delete}}</span>
                </v-tooltip>
            </template>
        </v-data-table>
        <template>
            <v-row justify="center">
                <v-dialog v-model="dialogConfirm" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">Hapus Rak Penyimpanan</v-card-title>
                    <v-card-text>Obat di dalam rak yang dinonaktifkan akan dihapus. 
                        Pastikan kembali rak penyimpanan yang akan dinonaktifkan benar.
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="warning" dark @click="closeDialogCOnfirm">Tidak</v-btn>
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
export default {
    data:()=>({
        fab:true,
        dialog: false,
        dialogConfirm:false,
        cari:'',
        loading:true,
        loadText:'Mohon tunggu...',
        button_icon_edit:'edit rak obat',
        button_icon_delete:'delete obat',
        headers: [
            {text: 'ID',value: 'idlemari',align:'start'},
            {text: 'Nama Rak',value: 'nmlemari',align:'start'},
            {text: 'Aksi', value: 'aksi', sortable: false,},
        ],
        lemari: [],
        editIndex: -1,
        editItem: {
            idlemari: 0,
            nmlemari: '',
        },
        defaultItem: {
            idlemari: 0,
            nmlemari: '',
        },
    }),
    computed:{
        ...mapGetters({
            pengguna:'authentikasi/user',
        }),
    },
    created(){
        this.initialize()
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    methods:{
        ...mapActions({
            setNotif:'notif/actNotif',
        }),
        formTitle () {
            return this.editIndex === -1 ? 'Add Rak' : 'Edit Rak'
        },
        initialize () {
            this.lemari = []
            let fr = {
                'kdmut':this.pengguna.kode_unit
            }
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            this.axios.post('/kartu-stok/lemari-all',fr,config)
            .then((response)=>{
                // console.log(response.data.data)
                this.lemari = response.data.data
                this.loading = false
            })
            .catch((error)=>{
                this.loading = false
                let {data} = error.response
                console.log(data.message)
            })
        },
        editedItem (item) {
            this.editIndex = this.lemari.indexOf(item)
            this.editItem = Object.assign({}, item)
            // console.log(this.editIndex)
            this.dialog = true
        },
        deletedItem (item) {
            this.editItem = Object.assign({},item)
            this.dialogConfirm = true
        },

        close () {
            this.dialog = false
            this.$nextTick(() => {
                this.editItem = Object.assign({}, this.defaultItem)
                this.editIndex = -1
            })
        },

        closeDialogCOnfirm(){
            this.dialogConfirm = false
            this.$nextTick(()=>{
                this.editItem = Object.assign({}, this.defaultItem)
            })
        },

        save () {
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            // console.log(this.editIndex)
            let formData =  {}
            if (this.editIndex > -1) {
                formData = {
                    'id_lemari':this.editItem.idlemari,
                    'lemari':this.editItem.nmlemari,
                    'depo':this.pengguna.kode_unit,
                    'device_info':this.deviceInfo,
                }

                this.axios.post('/kartu-stok/update-lemari',formData,config)
                .then((response)=>{
                    if(response.data.status=='error'){
                        this.setNotif({
                            status:true,
                            color:response.data.status,
                            text:response.data.message,
                        })
                    }else{
                        this.initialize()
                        this.close()
                        this.setNotif({
                            status:true,
                            color:response.data.status,
                            text:response.data.message,
                        })
                    }
                })
                .catch((response)=>{
                    let {data} = response.response
                    console.log(data)
                    this.setNotif({
                        status:true,
                        color:'error',
                        text:data.message,
                    })
                })
            }else{
                formData = {
                    'nama_lemari':this.editItem.nmlemari,
                    'depo':this.pengguna.kode_unit,
                    'nama_depo':this.pengguna.unit,
                    'device_info':this.deviceInfo,
                }

                this.axios.post('/kartu-stok/simpan-lemari',formData,config)
                .then((response)=>{
                    if(response.data.status=='error'){
                        this.setNotif({
                            status:true,
                            color:response.data.status,
                            text:response.data.message,
                        })
                    }else{
                        this.initialize()
                        this.close()
                        this.setNotif({
                            status:true,
                            color:response.data.status,
                            text:response.data.message,
                        })
                    }
                })
                .catch((response)=>{
                    let {data} = response.response
                    console.log(data)
                    this.setNotif({
                        status:true,
                        color:'error',
                        text:data.message,
                    })
                })
            }
        },

        yesDialogConfirm () {
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            let formData = {
                'idlemari':this.editItem.idlemari,
                'depo':this.pengguna.kode_unit,
                'device_info':this.deviceInfo,
            }
           
            this.axios.post('/kartu-stok/hapus-lemari',formData,config)
            .then((response)=>{
                if(response.data.status=='success'){
                    this.initialize()
                    this.closeDialogCOnfirm()
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
            })
            .catch((response)=>{
                let {data} = response.response
                console.log(data.message)
            })
        },
    },
}
</script>