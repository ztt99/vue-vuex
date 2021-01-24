import Vuex from '@/vuex'
import Vue from 'vue'

Vue.use(Vuex)   //挂载，调用Vuex.install方法

const store = new Vuex.Store({  //创建vuex实例
    state: {
        age: 18
    },
    mutations: {
        setAge(state, p) {
            state.age += p
        }
    },
    getters: {
        age(state) {
            console.log(1);
            return state.age + 10
        }
    },
    actions: {
        setAge({commit},val){
            commit('setAge',val)
        }
    },

})

export default store

