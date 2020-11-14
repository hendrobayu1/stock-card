<template>
        <v-card class="overflow-hidden" color="primary lighten-1" dark>
            <v-toolbar flat color="primary">
                <v-icon>mdi-account</v-icon>
                <v-toolbar-title class="font-weight-light">Profil User</v-toolbar-title>
                <v-spacer />
                <v-btn color="primary darken-3" fab small @click="editProfil=!editProfil">
                    <v-icon v-if="editProfil">mdi-close</v-icon>
                    <v-icon v-else>mdi-pencil</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form v-model="valid" ref="form" lazy-validation>
                <v-card-text>
                    <v-text-field :disabled="true" color="white" label="Userid" v-model="profil.userid" />
                    <v-text-field :disabled="!editProfil" :rules="emailRules" required color="white" label="Email" v-model="profil.email" />
                    <v-text-field :disabled="!editProfil" :rules="namaRules" required color="white" label="Nama" v-model="profil.nama" />
                    <v-text-field :disabled="true" color="white" label="Akses" v-model="profil.akses" />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                        <v-spacer />
                        <v-btn color="accent lighten-1" :disabled="!editProfil" @click="submit">Simpan 
                            <v-icon right dark>mdi-account-check</v-icon>
                        </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
export default {
    name:'profile',
    data:()=>({
        valid:true,
        editProfil:false,
        namaRules:[
            v=>!!v||'Nama harus diisi',
        ],
        emailRules:[
            v=>!!v||'E-mail is required',
            v=>/([a-zA-Z0-9_]{1,})(@)([a-zA-Z0-9_]{2,}).([a-zA-Z0-9_]{2,})+/.test(v)||'Email tidak valid',
        ],
    }),
    computed:{
        ...mapGetters({
            pengguna:'authentikasi/user',
            profil:'authentikasi/user_profile',
        }),
        // profil:{
        //     set(){
        //         this.setProfil(this.getProfil())
        //     },
        //     get(){
        //         return this.profil
        //     }
        // },
    },
    methods:{
        ...mapActions({
            setAuthentikasi:'authentikasi/actUser',
            setProfil:'authentikasi/actUserProfile',
            setNotif:'notif/actNotif',
        }),
        // getProfil(){
        //     let config={
        //         headers:{
        //                 'Authorization' : 'Bearer ' + this.pengguna.api_token,
        //         }
        //     }
        //     this.axios.post('/kartu-stok/profil-user',{},config)
        //     .then((response)=>{
        //         return response.data.data
        //     })
        //     .catch((response)=>{
        //         console.log(response)
        //         return null
        //     })
        // },
        submit(){
            if(this.valid){
                let nama = this.profil.nama
                let email = this.profil.email
                let formData = {
                    'nama':nama,
                    'email':email,
                    'device_info':this.deviceInfo,
                }
                let config={
                    headers:{
                        'Authorization' : 'Bearer ' + this.pengguna.api_token,
                    }
                }
                this.axios.post('/kartu-stok/update-profil',formData,config)
                .then((response)=>{
                    this.setProfil(response.data.data)
                    
                    //Set user
                    formData = {
                        'kdmut':this.pengguna.kode_unit,
                    }
                    this.axios.post('/kartu-stok/info-user',formData,config)
                    .then((response)=>{
                        this.setAuthentikasi(response.data.data)

                        this.setNotif({
                            status:true,
                            color:response.data.status,
                            text:'update profil berhasil',
                        })
                        this.editProfil=false
                    })
                    .catch((error)=>{
                        let {data} = error.response
                        console.log(data.message)
                    })
                    //End set user
                })
                .catch((response)=>{
                    let {data} = response.response
                    console.log(data.message)
                    this.setNotif({
                        status:true,
                        color:'error',
                        // text:data.data.message,
                        text:data.message,
                    })
                })
            }else{
               this.setNotif({
                    status:true,
                    color:'error',
                    // text:data.data.message,
                    text:'inputan nama/email tidak valid',
                }) 
            }
        }
    },
}
</script>