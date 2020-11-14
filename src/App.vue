<template>
  <v-app>
    <v-app-bar app color="primary" dark dense v-if="beranda">
    <!-- <v-app-bar app absolute color="transparent" flat v-if="beranda"> -->
      <v-app-bar-nav-icon @click.stop="drawer=!drawer"></v-app-bar-nav-icon>
      <v-toolbar-title><span class="text-sm-body-1">{{appName}}</span></v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- <v-badge color="green" :content="jumlahOrder" :value="jumlahOrder" overlap v-if="!tamu">
          <v-icon>mdi-cart</v-icon>
      </v-badge> -->

      <v-menu left bottom transition="slide-x-reverse-transition">
        <template v-slot:activator="{on,attrs}">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list v-if="!tamu" nav dense>
          <template v-for="(item,index) in topMenu">
            <!-- <v-list-item :key="`menu-`+index" @click="item.route=='keluar()'?keluar():item.route"> -->
            <v-list-item :key="`menu-`+index" 
            @click="item.route.charAt(0)!='/'?
            item.route=='keluar'?dialogConfirm=true:
            handle_function_call(item.route,item.route.charAt(0)!='|'?
            '':item.route):item.route">
              <v-list-item-content>
                <v-list-item-title><v-icon>{{item.icon}}</v-icon> {{item.title}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
      <v-text-field slot="extension" hide-details 
        append-icon="mdi-microphone" flat label="Cari Obat" solo-inverted 
        prepend-inner-icon="mdi-magnify" @click="kode_unit.length>0?setKomponen('search'):notifPencarian()">
      </v-text-field>
    </v-app-bar>

    <v-app-bar app color="primary" dark v-else>
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
      <v-spacer />

      <v-menu left bottom transition="slide-x-reverse-transition">
        <template v-slot:activator="{on,attrs}">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list v-if="!tamu" nav dense>
          <template v-for="(item,index) in topMenu">
            <v-list-item :key="`menu-`+index" @click="item.route.charAt(0)!='/'?
            item.route=='keluar'?dialogConfirm=true:
            handle_function_call(item.route,item.route.charAt(0)!='|'?'':item.route):item.route" v-if="item.route=='keluar'">
              <v-list-item-content>
                <v-list-item-title><v-icon>{{item.icon}}</v-icon> {{item.title}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-card>
      <!-- <v-navigation-drawer app v-model="drawer" :mini-variant.sync="mini"> -->
      <v-navigation-drawer app v-model="drawer">
        <v-list>
          <v-list-item v-if="!tamu">
            <v-list-item-avatar><v-img :src="getImage('/users/','')"></v-img></v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{pengguna.name}}</v-list-item-title>
              <v-list-item-subtitle>({{pengguna.akses}})</v-list-item-subtitle>
            </v-list-item-content>
            <!-- <v-btn icon @click.stop="mini=!mini"><v-icon>mdi-chevron-left</v-icon></v-btn> -->
          </v-list-item>
          <div class="pa-2" v-if="tamu">
            <v-btn block color="primary" class="mb-1" @click="setKomponen('login')"><v-icon left>mdi-lock</v-icon> Login</v-btn>
            <!-- <v-btn block color="success"><v-icon left>mdi-account</v-icon> Register</v-btn> -->
          </div>
          <v-divider></v-divider>
          <v-list nav dense rounded>
            <template v-for="(item,index) in sideMenu">

              <v-list-item color="primary" :key="`menu-`+index" :to="item.route" v-if="item.parent_menu==0 && item.sub_menu.length==0">
                <v-list-item-icon>
                  <v-icon left>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{item.title}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-group v-if="item.sub_menu.length>0" :key="item.id_menu" :prepend-icon="item.icon" no-action>
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item color="primary" v-for="subItem in item.sub_menu" :key="subItem.id_menu" :to="subItem.route">
                  <v-list-item-content>
                    <v-list-item-title v-text="subItem.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
              
              <!-- <v-list-item :key="`menu-`+index" :to="item.route" v-if="!tamu && pengguna.akses=='Superadmin'">
                <v-list-item-icon>
                  <v-icon left>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{item.title}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item :key="`menu-`+index" :to="item.route" v-if="!tamu && pengguna.akses=='Administrator' && item.route!='/registrasi'">
                <v-list-item-icon>
                  <v-icon left>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{item.title}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item :key="`menu-`+index" :to="item.route" v-if="!tamu && pengguna.akses=='Petugas Farmasi' && item.route!='/registrasi' && item.route!='/list-lemari'">
                <v-list-item-icon>
                  <v-icon left>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{item.title}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item :key="`menu-`+index" :to="item.route" v-else-if="tamu && item.is_auth=='0'">
                <v-list-item-icon>
                  <v-icon left>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{item.title}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item> -->

            </template>
          </v-list>
        </v-list>
      </v-navigation-drawer>
    </v-card>

    <notifikasi />

    <keep-alive>
      <v-dialog v-model="komponen" fullscreen hide-overlay transition="dialog-bottom-transition">
        <component :is="komponenSekarang" @closed="setKomponenStatus"></component>
      </v-dialog>
    </keep-alive>

    <v-main>
      <v-container fluid>
        <v-slide-y-transition>
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-main>

    <template>
        <v-layout row justify-center>
            <v-dialog v-model="dialogConfirm" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">Konfirmasi</v-card-title>
                    <v-card-text>Logout aplikasi ?</v-card-text>
                    <v-card-actions>
                        <v-btn color="warning" @click="cancel">Tidak</v-btn>
                        <v-spacer />
                        <v-btn color="success" @click="keluar">Ya</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </template>

    <v-footer dark padless app absolute>
        <v-card class="flex" flat tile>
            <v-card-title class="indigo lighten-1">
                <strong class="subheading">Get connected with us on social networks</strong>
                <v-spacer></v-spacer>
                <v-btn icon v-for="(ico,index) in icons" :key="index" class="mx-4" :href="ico.url" :target="'_blank'">
                    <v-icon size="33px">{{ico.icon}}</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="py-2 white--text text-center">
                &copy; {{new Date().getFullYear()}} - 
                <a href="http://rsphc.co.id" :target="'_blank'" :style="'text-decoration:none;color:white'"><strong>{{corporateName}}</strong></a>
            </v-card-text>
        </v-card>
    </v-footer>
  </v-app>
</template>

<script>
// import device from 'mobile-device-detect'
// import HelloWorld from './components/HelloWorld';
import {mapGetters,mapActions} from 'vuex'
export default {
  name: 'App',
  components: {
    Search:()=>import('@/components/global/Search.vue'),
    Notifikasi:()=>import('@/components/global/Notifikasi.vue'),
    Login:()=>import('@/components/global/Login.vue'),
    UpdatePassword:()=>import('@/components/kartu_stok_master/UpdatePassword.vue'),
    UpdateDepo:()=>import('@/components/kartu_stok_master/UpdateDepo.vue'),
  },
  data(){
    return {
      icons: [
        {icon:'mdi-facebook',url:'https://www.facebook.com/rsphcsby/'},
        {icon:'mdi-twitter',url:'https://twitter.com/rs_phc'},
        {icon:'mdi-instagram',url:'https://www.instagram.com/rsphcsurabaya/'},
      ],
      drawer:false,
      //mini:false,
      dialogConfirm:false,
      // jumlahOrder:1,
      // menu_app_bar:[
      //   {title:'Ganti Depo',icon:'mdi-database-refresh',route:'/ganti-depo'},
      //   {title:'Ubah Password',icon:'mdi-lock-reset',route:'/ubah-password'},
      //   {title:'Keluar',icon:'mdi-logout',route:'/keluar'},
      // ],
      // menu_navigation:[
      //   {title:'Beranda',icon:'mdi-home',route:'/'},
      //   {title:'Profil',icon:'mdi-account-details',route:'/profil'},
      //   {title:'Info Barang',icon:'mdi-book-search',route:'/info-barang'},
      //   {title:'Transaksi',icon:'mdi-cart',route:'/transaksi'},
      //   {title:'Riwayat Transaksi',icon:'mdi-history',route:'/riwayat-transaksi'},
      //   {title:'Laporan',icon:'mdi-file-pdf',route:'/laporan'},
      // ],
    }
  },
  computed:{
    beranda(){
      return (this.$route.path==='/')
    },
    ...mapGetters({
      menus:'menu/menus',
      komponenStatus:'komponen/status',
      komponenSekarang:'komponen/component',
      kode_unit:'depo/kode_unit',
      unit:'depo/unit',
      tamu:'authentikasi/guest',
      pengguna:'authentikasi/user',
    }),
    komponen:{
      get(){
        return this.komponenStatus
      },
      set(value){
        this.setKomponenStatus(value)
      }
    },
    topMenu(){
      return this.menus.filter(function(menu) {
        if(menu.jenis_menu==1){
          return menu
        }
      })
    },
    sideMenu(){
      return this.menus.filter(function(menu) {
        if(menu.jenis_menu==2){
          return menu
        }
      })
    }
  },
  methods:{
    ...mapActions({
      setMenus:'menu/actMenus',
      setKomponenStatus:'komponen/actStatus',
      setKomponen:'komponen/actComponent',
      setNotif:'notif/actNotif',
      setDepo:'depo/actDepo',
      setAuthentikasi:'authentikasi/actUser',
      setUserProfile:'authentikasi/actUserProfile',
    }),
    notifPencarian(){
      this.setNotif({
        status:true,
        color:'error',
        text:'Lokasi inventori harap dipilih.',
      })
    },
    handle_function_call(function_name,params) {
      if(params==''){
        this[function_name]()
      }else {
        this.setKomponen(params.substr(1))
      }
    },
    cancel(){
      this.dialogConfirm = false
    },
    keluar(){
      let config={
        headers:{
          'authorization': 'Bearer ' + this.pengguna.api_token
        },
      }
      let formData = {
          'device_info':this.deviceInfo,
      }
      this.axios.post('/kartu-stok/logout',formData,config)
      .then((response)=>{
        console.log(response)
        this.setAuthentikasi({})
        this.setUserProfile({})

        let params = {'akses' : -1}
        this.axios.post('kartu-stok/akses-menu',params)
        .then((response)=>{
            // console.log(response)
            let{data} = response.data
            this.setMenus(data)
        })
        .catch((error)=>{
            let {data} = error.response
            console.log(data.message)
        })

        this.dialogConfirm = false
        
        this.setNotif({
          status:true,
          color:'success',
          text:'Logout sukses',
        })

        this.$router.push('/').catch(()=>{})

      })
      .catch((response)=>{
        // let {data} = error.response
        // console.log(data)
        this.setNotif({
          status:true,
          color:'error',
          text:response.response.data.message,
        })
      })
    },
  },
  created(){
    // console.log(device.deviceDetect())
    if(this.menus && this.menus.length==0){

      let params = {}
      if (Object.prototype.hasOwnProperty.call(this.pengguna, "id_akses")){
        params = {'akses' : this.pengguna.id_akses}
      }else{
        params = {'akses' : -1}
      }
      this.axios.post('kartu-stok/akses-menu',params)

      // this.axios.post('kartu-stok/menu')

      .then((response)=>{
        // console.log(response)
        let{data} = response.data
        this.setMenus(data)
      })
      .catch((error)=>{
        let {data} = error.response
        console.log(data.message)
      })
    }
    // console.log(this.tamu)
  },
};
</script>
