import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        routes:[]//一会儿菜单项要加载到这里
    },
    mutations:{
        initRoutes(state,data){//调用此方法时可以不用传state参数
            state.routes=data;
        }
    },
    actions:{

    }
})