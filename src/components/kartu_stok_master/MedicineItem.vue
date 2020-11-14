<template>
    <div>
        <v-card :to="'/medicine/'+medicine.id_kartu_stok" :index="medicine.id_kartu_stok" color="white">
            <v-img :src="getImage('/materials/','')" class="black--text">
                <v-card-title class="fill-height align-end card-title-size">
                    <span class="text-caption">{{medicine.nama_barang}} ({{medicine.lemari}})</span>
                </v-card-title>
            </v-img>
            <v-card-actions>
                <v-spacer />
                <v-icon>mdi-basket</v-icon> <span class="text-caption">{{parseInt(medicine.akhir).toLocaleString('id-ID')}}</span>
            </v-card-actions>
        </v-card>
    </div>
</template>

<style>
  .card-title-size {
    font-size: 12px;
    line-height: 15px;
  }
</style>

<script>
export default {
    name:'medicine-item',
    props:['medicine'],
    data:()=>({
    }),
}   
</script>