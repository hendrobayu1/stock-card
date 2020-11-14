<template>
    <v-card>
        <v-toolbar dark color="primary">
            <v-btn @click.native="close" dark icon>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title><span class="text-sm-body-1">Update Depo</span></v-toolbar-title>
        </v-toolbar>
        <v-divider />
        <v-container fluid>
            <v-form ref="form" lazy-validation v-model="valid">
                <v-autocomplete label="Lokasi inventori" :items="depos" 
                v-model="kode_unit" item-text="layanan" item-value="kode_mutasi" required />

                <div class="text-xs-center">
                    <v-btn color="accent lighten-1" :disabled="!valid" @click="submit">Update <v-icon right dark>mdi-cached</v-icon>
                    </v-btn>
                </div>
            </v-form>
        </v-container>
    </v-card>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
export default {
    name:'update-depo',
    data:()=>({
        depos:[],
        kode_unit:'',
        valid:true,
    }),
    computed:{
        ...mapGetters({
            pengguna : 'authentikasi/user',
        })
    },
    created(){
        this.axios.post('/kartu-stok/list-depo',{},this.tokenGuest)
        .then((response)=>{
            let{data} = response.data
            this.depos = data
            this.kode_unit = this.pengguna.kode_unit
        })
        .catch((error)=>{
            let {data} = error.response
            console.log(data.message)
        })
    },
    methods:{
        ...mapActions({
            setNotif:'notif/actNotif',
            setAuthentikasi:'authentikasi/actUser',
        }),
        submit(){
            if(this.$refs.form.validate() && this.kode_unit.length>0){
                // this.pengguna.kode_unit = this.kode_unit
                // this.setNotif({
                //         status:true,
                //         color:'success',
                //         text:'update depo berhasil',
                //     })
                // console.log(this.pengguna)
                // this.close()

                let formData = {
                    'kdmut':this.kode_unit,
                    'device_info':this.deviceInfo,
                }
                let config={
                    headers:{
                        'Authorization' : 'Bearer ' + this.pengguna.api_token,
                    }
                }
                this.axios.post('/kartu-stok/update-depo',formData,config)
                .then((response)=>{
                    this.setAuthentikasi(response.data.data)
                    // console.log(response.data)
                    // console.log(this.pengguna)
                    this.setNotif({
                        status:true,
                        color:'success',
                        text:response.data.message,
                    })
                    this.close()
                })
                .catch((response)=>{
                    let {data} = response.response
                    console.log(data.message)
                    this.setNotif({
                        status:true,
                        color:'error',
                        // text:data.data.message,
                        text:response.response.data.message,
                    })
                })
            }
        },
        close(){
            // this.kode_unit = ''
            this.$emit('closed',false)
        }
    },
}
</script>