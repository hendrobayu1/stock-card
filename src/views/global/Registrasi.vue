<template>
  <v-card>

      <v-card-title class="text-h6 grey lighten-2">
        <span class="text-sm-body-1 font-weight-bold">List Users</span>
          <v-spacer />
          <v-dialog v-model="dialog" persistent max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <!-- <v-spacer /> -->
              <v-btn small v-model="fab" color="blue darken-2" dark fab v-bind="attrs" v-on="on">
                  <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline grey lighten-2">
                <span class="text-sm-body-1 font-weight-bold">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field class="text-sm-body-2" v-model="editItem.userid" label="Userid" :readonly="editIndex==-1?false:true"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="8" md="8">
                      <v-text-field class="text-sm-body-2" v-model="editItem.nama" label="Nama"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="7" md="7">
                      <v-text-field class="text-sm-body-2" v-model="editItem.email" label="Email"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="5" md="5">
                      <v-text-field class="text-sm-body-2" v-model="editItem.akses" label="Akses" readonly></v-text-field>
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

      <v-data-table :headers="headers" :items="users" :loading="loading" :loading-text="loadText" 
        class="elevation-2" :search="cari" :sort-by="['nama']" 
        :sort-desc="[false]" multi-sort>
        <template v-slot:top>
          
          <!-- <v-toolbar flat color="white">
            <v-toolbar-title class="colortitle">List Users</v-toolbar-title>
            <v-divider class="mx-3" inset vertical />
            <v-spacer />
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Tambah User</v-btn>    
              </template>
              <v-card>
                <v-card-title class="headline grey lighten-2">
                  {{ formTitle }}
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="4" md="4">
                        <v-text-field v-model="editItem.userid" label="Userid" :readonly="editIndex==-1?false:true"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="8" md="8">
                        <v-text-field v-model="editItem.nama" label="Nama"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="7" md="7">
                        <v-text-field v-model="editItem.email" label="Email"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="5" md="5">
                        <v-text-field v-model="editItem.akses" label="Akses" readonly></v-text-field>
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
                    <!-- <v-icon medium class="mr-2" @click="editedItem(item)" v-bind="attrs" v-on="on">mdi-pencil</v-icon> -->
                </template>
                <span>{{button_icon_edit}}</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn small color="warning" class="ma-2" dark @click="resetPassword(item)" v-bind="attrs" v-on="on">
                      <v-icon>mdi-lock-reset</v-icon>
                    </v-btn>
                    <!-- <v-icon medium class="mr-2" @click="resetPassword(item)" v-bind="attrs" v-on="on">mdi-lock-reset</v-icon> -->
                </template>
                <span>{{button_icon_reset}}</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn small color="error" class="ma-2" dark @click="deletedItem(item)" v-bind="attrs" v-on="on">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <!-- <v-icon medium class="mr-2" @click="deletedItem(item)" v-bind="attrs" v-on="on">mdi-delete</v-icon> -->
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
                <v-card-title class="headline">{{dialogTitle}}</v-card-title>
                <v-card-text>{{dialogSubTitle}}</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="warning" dark @click="closeDialogCOnfirm">Tidak</v-btn>
                  <v-btn color="success" dark @click="yesDialogConfirm">Ya</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
      </template>

      <template>
        <v-layout row justify-center>
            <v-dialog v-model="dialogInfo" persistent max-width="290">
                <v-card>
                    <!-- <v-card-title class="headline">Konfirmasi</v-card-title> -->
                    <v-card-text>{{messageInfo}}</v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="success" dark @click="dialogInfo=false">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
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
        dialogInfo:false,
        messageInfo:'',
        cari:'',
        loading:true,
        loadText:'Mohon tunggu...',
        button_icon_edit:'edit user',
        button_icon_reset:'reset password',
        button_icon_delete:'delete user',
        headers: [
        {text: 'Userid',value: 'userid',align:'start'},
        {text: 'Nama',value: 'nama',},
        {text: 'Email',value: 'email',},
        { text: 'Akses', value: 'akses',},
        { text: 'Aksi', value: 'aksi', sortable: false,},
      ],
      users: [],
      editIndex: -1,
      dialogIndex: -1,
      editItem: {
        userid: '',
        nama: '',
        email: '',
        akses: 'Petugas Farmasi',
      },
      defaultItem: {
        userid: '',
        nama: '',
        email: '',
        akses: 'Petugas Farmasi',
      },
      // timer:'',
    }),
    computed: {
      ...mapGetters({
          pengguna:'authentikasi/user',
      }),
      formTitle () {
        return this.editIndex === -1 ? 'Tambah User' : 'Edit User'
      },
      dialogTitle () {
        if(this.dialogIndex==-1){
            return ''
        }else if(this.dialogIndex==0){
            return 'Reset password ?'
        }else{
            return 'Hapus user ?'
        }
      },
      dialogSubTitle () {
        if(this.dialogIndex==-1){
            return ''
        }else if(this.dialogIndex==0){
            return 'Password akan digenerate secara acak oleh sistem sepanjang 6 karakter. '+
            'Segera lakukan update dan jaga kerahasian password anda.'
        }else{
            return 'User yang dinonaktifkan, tidak akan memiliki akses ke aplikasi ini. '+
            'Pastikan kembali bahwa user yang akan dinonaktifkan benar.'
        }
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    created () {
      this.initialize()
      // this.timer = setInterval(this.initialize,3000)
    },
    // beforeDestroy(){
    //   clearInterval(this.timer)
    // },
    methods: {
        ...mapActions({
          setNotif:'notif/actNotif',
        }),
        // cancelAutoUpdate(){
        //   clearInterval(this.timer)
        // },
        initialize () {
            let config={
                headers:{
                    'Authorization' : 'Bearer ' + this.pengguna.api_token,
                }
            }
            // this.loading = true
            this.users = []
            this.axios.post('/kartu-stok/list-user',{},config)
            .then((response)=>{
                // console.log(this.pengguna.kode_unit)
                // console.log(response)
                if (response.data.status=='success'){
                    this.users = response.data.data
                }
                this.loading = false
            })
            .catch((response)=>{
                let {data} = response.response
                console.log(data.message)
                this.loading = false
            })
            // }
      },

      editedItem (item) {
        this.editIndex = this.users.indexOf(item)
        this.editItem = Object.assign({}, item)
        // console.log(item.userid)
        this.dialog = true
      },

      resetPassword(item){
        this.editItem = Object.assign({},item)
        this.dialogIndex = 0
        this.dialogConfirm = true
      },

      deletedItem (item) {
        this.editItem = Object.assign({},item)
        this.dialogIndex = 1
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
        this.dialogIndex = -1
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
        if (this.editIndex > -1) {
          let formData = {
              'userid':this.editItem.userid,
              'nama':this.editItem.nama,
              'email':this.editItem.email,
              'device_info':this.deviceInfo,
          }
          this.axios.post('/kartu-stok/update-user',formData,config)
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
            console.log(data.message)
            this.setNotif({
                status:true,
                color:'error',
                text:data.message,
            })
          })
          // console.log(this.users[this.editIndex].userid)
          // Object.assign(this.medicines[this.editedIndex], this.editedItem)
        } else {
          let formData = {
              'userid':this.editItem.userid,
              'nama':this.editItem.nama,
              'email':this.editItem.email,
              'device_info':this.deviceInfo,
          }
          this.axios.post('/kartu-stok/registrasi-user',formData,config)
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
            console.log(data.message)
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
            'userid':this.editItem.userid,
            'device_info':this.deviceInfo,
        }
        if (this.dialogIndex==0) {
            //reset password
            this.axios.post('/kartu-stok/reset-password',formData,config)
            .then((response)=>{
                if(response.data.status=='error'){
                    this.setNotif({
                        status:true,
                        color:response.data.status,
                        text:response.data.message,
                    })
                }else{
                    this.initialize()
                    this.closeDialogCOnfirm()
                    this.messageInfo = response.data.message
                    this.dialogInfo = true
                    // this.setNotif({
                    //     status:true,
                    //     color:response.data.status,
                    //     text:response.data.message,
                    // })
                }
            })
            .catch((response)=>{
                let {data} = response.response
                console.log(data.message)
            })
        } else if(this.dialogIndex==1) {
            //hapus user
            this.axios.post('/kartu-stok/hapus-user',formData,config)
            .then((response)=>{
                if(response.data.status=='error'){
                    this.setNotif({
                        status:true,
                        color:response.data.status,
                        text:response.data.message,
                    })
                }else{
                    this.initialize()
                    this.closeDialogCOnfirm()
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
        }
      },

    },
}
</script>