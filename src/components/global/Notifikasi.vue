<template>
    <v-snackbar v-model="notif" :color="color" multi-line top :timeout="2500">
        {{text}}
        <!-- <v-btn dark text @click="close">
            <v-icon>mdi-close-circle</v-icon>
        </v-btn> -->
    </v-snackbar>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
export default {
    name:'notifikasi',
    computed:{
        ...mapGetters({
            status:'notif/status',
            color:'notif/color',
            text:'notif/text'
        }),
        notif:{
            set(value){
                this.setNotif({
                    status:value,
                    color:'success',
                    text:'',
                })
            },
            get(){
                return this.status
            }
        }
    },
    methods:{
        ...mapActions({
            setNotif:'notif/actNotif'
        }),
        // close(){
        //     this.setNotif({
        //         status:false,
        //     })
        // },
    }
}
</script>