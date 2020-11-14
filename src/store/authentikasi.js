export default{
    namespaced:true,

    state:{
        user:{},
        user_profile:{},
    },
    mutations:{
        setUser:(state,payload)=>{
            state.user = payload
        },
        setProfile:(state,payload)=>{
            state.user_profile = payload
        },
    },
    actions:{
        actUser:({commit},payload)=>{
            commit('setUser',payload)
        },
        actUserProfile:({commit},payload)=>{
            commit('setProfile',payload)
        },
    },
    getters:{
        user:state=>state.user,
        user_profile:state=>state.user_profile,
        guest:state=>Object.keys(state.user).length===0,
    }
}