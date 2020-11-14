export default{
    namespaced:true,

    state:{
        status:false,
        component:'search',
    },
    mutations:{
        setStatus:(state,status)=>{
            state.status = status
        },
        setComponent:(state,component)=>{
            state.component = component
        },
    },
    actions:{
        actStatus:({commit},status)=>{
            commit('setStatus',status)
        },
        actComponent:({commit},component)=>{
            commit('setStatus',true)
            commit('setComponent',component)
        },
    },
    getters:{
        status:state=>state.status,
        component:state=>state.component,
    }
}