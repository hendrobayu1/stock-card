<template>
    <v-card>
        <v-toolbar dark color="primary">
            <v-btn @click.native="close" dark icon>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-divider />
        <v-container fluid>
            <v-form ref="form" lazy-validation v-model="valid">
                <v-autocomplete v-model="objUser" :items="users" :loading="isLoading"
                    :search-input.sync="search" hide-no-data hide-selected :rules="useridRules"
                    item-text="name" item-value="id" label="Nama / Email" return-object @change="list_depo" />
                <!-- <v-text-field v-model="userid" :rules="useridRules" 
                label="Userid / Email" required append-icon="mdi-account" /> -->

                <v-text-field v-model="password" :rules="passwordRules" label="Password" required 
                :append-icon="tampilkan?'mdi-eye':'mdi-eye-off'" :type="tampilkan?'text':'password'" 
                hint="Harus 6 karakter" counter @click:append="tampilkan=!tampilkan"></v-text-field>

                <v-autocomplete label="Lokasi inventori" :items="depos" 
                v-model="kode_unit" item-text="layanan" item-value="kode_mutasi" :rules="lokasiRules" required />

                <div class="text-xs-center">
                    <v-btn color="accent lighten-1" :disabled="!valid" @click="submit">Login <v-icon right dark>mdi-lock-open</v-icon>
                    </v-btn>
                </div>
            </v-form>
        </v-container>
    </v-card>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
export default {
    name:'login',
    data:()=>({
        valid:true,
        objUser:{},
        users:[],
        search:null,
        isLoading:false,

        // userid:'',
        useridRules:[
            v=>!!v||'Userid / Email harus diisi',
            v=>!!isNaN(parseInt(v))||'Userid / Email tidak boleh diawali dengan angka',
        ],
        tampilkan:false,
        password:'',
        passwordRules:[
            v=>!!v||'Password harus diisi',
            v=>(v && v.length==6)||'Harus 6 karakter',
        ],
        depos:[],
        kode_unit:'',
        lokasiRules:[
            v=>!!v||'Lokasi inventori harus diisi',
        ],
    }),
    computed:{
        ...mapGetters({
            user:'authentikasi/user',
            user_profile:'authentikasi/user_profile',
            prevUrl:'prevUrl',
        })
    },
    // created(){
    //     this.axios.post('/kartu-stok/list-depo',{},this.tokenGuest)
    //     .then((response)=>{
    //         let{data} = response.data
    //         this.depos = data
    //     })
    //     .catch((error)=>{
    //         console.log(error)
    //     })
    // },
    watch: {
        search (val) {
            this.isLoading = true
            let frdata = {
                'keyword' : val,
            }
            this.axios.post('/kartu-stok/list-user-login',frdata,this.tokenGuest)
            .then((response) => {
                this.users = response.data.data
            })
            .catch((error) => {
                let {data} = error.response
                console.log(data.message)
            })
            .finally(() => (this.isLoading = false))
        }
    },
    methods:{
        ...mapActions({
            setNotif:'notif/actNotif',
            setAuthentikasi:'authentikasi/actUser',
            setUserProfile:'authentikasi/actUserProfile',
            setMenus:'menu/actMenus',
            // setDepo:'depo/actDepo'
        }),

        list_depo(){
            this.depos = []
            // console.log(this.objUser)
            if (typeof this.objUser != "undefined"){
                if(this.objUser.userid != null){
                    let frdata = {
                        'id' : this.objUser.id,
                    }
                    this.axios.post('/kartu-stok/list-depo-user',frdata,this.tokenGuest)
                    .then((response)=>{
                        let{data} = response.data
                        this.depos = data
                    })
                    .catch((error)=>{
                        console.log(error)
                    })
                }
            }
        },

        submit(){
            if(this.$refs.form.validate()){
                let formData = {
                    // 'userid':this.userid,
                    'userid':this.objUser.userid,
                    'password':this.password,
                    'kdmut':this.kode_unit,
                    'device_info':this.deviceInfo,
                }
                // console.log(JSON.stringify(device.deviceDetect()))
                this.axios.post('/kartu-stok/login',formData,this.tokenGuest)
                .then((response)=>{
                    this.setAuthentikasi(response.data.data)
                    // this.setDepo({
                    //     kode_unit:response.data.data.kode_unit,
                    //     unit:response.data.data.unit,
                    // })
                    //set user profile
                    let config={
                        headers:{
                            'Authorization' : 'Bearer ' + this.user.api_token,
                        }
                    }
                    this.axios.post('/kartu-stok/profil-user',{},config)
                    .then((response)=>{
                        // console.log(response)
                        let {data} = response.data
                        this.setUserProfile(data)
                    })
                    //end set user profile

                    if(this.user.userid.length>0){

                        let params = {'akses' : this.user.id_akses}
                        this.axios.post('kartu-stok/akses-menu',params,this.tokenGuest)
                        .then((response)=>{
                            // console.log(response)
                            let{data} = response.data
                            this.setMenus(data)
                        })
                        .catch((error)=>{
                            let {data} = error.response
                            console.log(data.message)
                        })

                        this.setNotif({
                            status:true,
                            color:'success',
                            text:'login sukses',
                        })
                        if(this.prevUrl.length>0){
                            this.$router.push(this.prevUrl)
                        }
                        this.close()
                    }else{
                        this.setNotif({
                            status:false,
                            color:'error',
                            text:'Login failed',
                        })
                    }
                })
                .catch((response)=>{
                    // console.log(response.response)
                    // let data = error.response
                    let {data} = response.response
                    this.setNotif({
                        status:true,
                        color:'error',
                        // text:data.data.message,
                        text:data.message,
                    })
                })
            }
        },
        close(){
            // this.userid = ''
            this.objUser = {}
            this.password = ''
            this.kode_unit = ''
            this.$emit('closed',false)
        }
    },
}
</script>