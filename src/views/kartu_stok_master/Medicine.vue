<template>
    <div>
        <v-card color="#1F7087" dark v-if="medicine">
            <v-card-title class="headlilne justify-center"  v-text="medicine.kode_brg_phc + ' - ' + 
            medicine.kode_brg_centra  +  ' - ' + medicine.nama_barang + ' (' + unit + ' - ' + kode_unit + ')'" />
        </v-card>
        <v-card-text>
            <v-simple-table dense>
                <tbody>
                    <tr>
                        <td><v-icon>mdi-cog-outline</v-icon> Jenis</td>
                        <td>[{{medicine.kode_jenis}}] {{medicine.jenis}} [{{medicine.grup}}]</td>
                    </tr>
                    <tr>
                        <td><v-icon>mdi-factory</v-icon> Pabrik</td>
                        <td>{{medicine.pabrik}}</td>
                    </tr>
                    <tr>
                        <td><v-icon>mdi-cart</v-icon> Stok</td>
                        <td>{{parseInt(medicine.akhir).toLocaleString('id-ID')}}</td>
                    </tr>
                    <tr>
                        <td><v-icon>mdi-nas</v-icon> Rak Penyimpanan</td>
                        <td>{{medicine.lemari}}</td>
                    </tr>
                </tbody>
            </v-simple-table>
            <br>Kandungan :
            <v-simple-table dense>
                <tbody>
                    <tr>
                        <td><v-icon>mdi-pill</v-icon> <span class="blue--text">Terapi</span> / 
                        <span class="red--text">Bahan</span> / 
                        <span class="green--text">Dosis</span></td>
                        <td v-for="kandung in kandungan" :key="kandung.kode_terapi_bahan">
                            <span class="blue--text">[{{kandung.kode_terapi}} - {{kandung.terapi}}]</span>
                            <span class="red--text">[{{kandung.kode_bahan}} - {{kandung.bahan}}]</span> 
                            <span class="green--text">[{{kandung.dosis}}]</span></td>
                    </tr>
                </tbody>
            </v-simple-table>
            <br>Supplier :
            <v-chip small v-for="supp in supplier" :key="supp.kode_supplier">[{{supp.kode_supplier}}] - {{supp.supplier}}</v-chip>
            <br><br>Fungsi obat :
            <v-chip small v-for="f in fungsi" :key="f.kode">[{{f.kode}}] - {{f.fungsi}}</v-chip>
        </v-card-text>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data:() => ({
        medicine:{},
        supplier:[],
        kandungan:[],
        fungsi:[],
    }),
    computed:{
        ...mapGetters({
            kode_unit:'depo/kode_unit',
            unit:'depo/unit',
        }),
    },
    created(){
        this.go()
    },
    methods:{
        go(){
            let {id} = this.$route.params
            let url = '/kartu-stok/info-obat/' + id
            this.axios.post(url,{},this.tokenGuest)
            .then((response) => {
                let {data} = response.data
                // console.log(response)
                this.medicine = data
                this.fungsi = data.fungsi
                this.kandungan = data.kandungan
                this.supplier = data.supplier
            })
            .catch((error) => {
                let {data} = error.response
                console.log(data.message)
            })
        }
    }
}
</script>