export default{
    namespaced:true,

    state:{
        status:false,
        color:'success',
        text:'',
    },
    mutations:{
        setNotif:(state,payload)=>{
            state.status = payload.status
            state.color = payload.color
            state.text = payload.text
        },
    },
    actions:{
        actNotif:({commit},payload)=>{
            commit('setNotif',payload)
        },
    },
    getters:{
        status:state=>state.status,
        color:state=>state.color,
        text:state=>state.text,
    },
}