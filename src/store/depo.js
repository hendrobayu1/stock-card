export default{
    namespaced:true,

    state:{
        kode_unit:'',
        unit:'',
    },
    mutations:{
        setDepo:(state,payload)=>{
            state.kode_unit = payload.kode_unit
            state.unit = payload.unit
        },
    },
    actions:{
        actDepo({commit},payload){
            commit('setDepo',payload)
        },
    },
    getters:{
        kode_unit:state=>state.kode_unit,
        unit:state=>state.unit,
    }
}