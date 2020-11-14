<template>
    <v-card>
        <v-toolbar dark color="primary">
            <v-btn @click.native="close" dark icon>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title><span class="text-sm-body-1">Update Password</span></v-toolbar-title>
        </v-toolbar>
        <v-divider />
        <v-container fluid>
            <v-form ref="form" lazy-validation v-model="valid">
                <v-text-field v-model="password_lama" label="Password lama" required 
                :append-icon="tampilkan_pass_lama?'mdi-eye':'mdi-eye-off'" :type="tampilkan_pass_lama?'text':'password'" 
                hint="Harus 6 karakter" counter @click:append="tampilkan_pass_lama=!tampilkan_pass_lama"></v-text-field>

                <v-text-field v-model="password_baru" label="Password baru" required 
                :append-icon="tampilkan_pass_baru?'mdi-eye':'mdi-eye-off'" :type="tampilkan_pass_baru?'text':'password'" 
                hint="Harus 6 karakter" counter @click:append="tampilkan_pass_baru=!tampilkan_pass_baru"></v-text-field>

                <v-text-field v-model="konfirm_password_baru" label="Konfirmasi password baru" required 
                :append-icon="tampilkan_konfirm_pass?'mdi-eye':'mdi-eye-off'" :type="tampilkan_konfirm_pass?'text':'password'" 
                hint="Harus 6 karakter" counter @click:append="tampilkan_konfirm_pass=!tampilkan_konfirm_pass"></v-text-field>

                <div class="text-xs-center">
                    <v-btn color="accent lighten-1" :disabled="!valid" @click="submit">Update <v-icon right dark>mdi-lock-reset</v-icon>
                    </v-btn>
                </div>
            </v-form>
        </v-container>
    </v-card>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
export default {
    name:'update-password',
    data:()=>({
        valid:true,
        password_lama:'',
        password_baru:'',
        konfirm_password_baru:'',
        tampilkan_pass_lama:false,
        tampilkan_pass_baru:false,
        tampilkan_konfirm_pass:false,
    }),
    computed:{
        ...mapGetters({
            pengguna:'authentikasi/user',
        }),
    },
    methods:{
        ...mapActions({
            setNotif:'notif/actNotif',
        }),
        submit(){
            if(this.$refs.form.validate()){
                let formData = {
                    'password':this.password_lama,
                    'newPassword':this.password_baru,
                    'confirmPassword':this.konfirm_password_baru,
                    'device_info':this.deviceInfo,
                }
                // console.log(formData)
                let config={
                    headers:{
                        'Authorization' : 'Bearer ' + this.pengguna.api_token,
                    }
                }
                this.axios.post('/kartu-stok/update-password',formData,config)
                .then((response)=>{
                    // console.log(response.data)
                    this.setNotif({
                        status:true,
                        color:response.data.status,
                        text:response.data.message,
                    })
                    if(response.data.status=='success'){
                        this.close()
                    }
                })
                .catch((response)=>{
                    let {data} = response.response
                    //console.log(data.message)
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
            this.password_lama = ''
            this.password_baru = ''
            this.konfirm_password_baru = ''
            this.$emit('closed',false)
        }
    }
}
</script>