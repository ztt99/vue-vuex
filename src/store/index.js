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
            return state.age + 10
        }
    },
    actions: {
        setAge({commit},val){
            commit('setAge',val)
        }
    },
    modules:{
        a :{
            state:{a:'a'},
            modules:{
                c:{
                    state:{
                        c:'c'
                    },
                    modules:{
                        d:{
                            state:{
                                d:'d'
                            }
                        }
                    }
                }
            }
        },
        b :{
            state:{b:'b'}
        }
    }

})

export default store

