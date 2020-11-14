export default{
    namespaced:true,

    state:{
        menus:[],
    },
    mutations:{
        setMenus:(state,value)=>{
            state.menus = value
        },
    },
    actions:{
        actMenus({commit},value){
            commit('setMenus',value)
        },
    },
    getters:{
        menus:state=>state.menus,
    },
}