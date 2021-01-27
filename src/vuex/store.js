import { forEachValue } from './utils'
import ModuldCollection from './moduld-collection'
export let Vue
export function install(_Vue) {
    // 将根组件中的store注入到Vue的每一个子组件
    Vue = _Vue
    applyMixin(Vue)
}

function applyMixin(Vue) {
    Vue.mixin({
        beforeCreate() {
            const options = this.$options
            if (options.store) {  //根实例
                //给所有组件增加$store
                this.$store = options.store
            } else if (options.parent && options.parent.$store) {  //不是未挂载store的实例，并且是子组件(存在parent)
                this.$store = options.parent.$store
            }
        }
    })
}

export class Store {
    constructor(options) {
        const state = options.state
        const getters = options.getters
        const mutations = options.mutations
        const actions = options.actions
        const computed = {}

        // 1. 格式化数据(树结构)
        new ModuldCollection(options)

    }
    commit = (type,val) => {
        this.mutations[type](val)
    }
    dispatch = (type,val) => {
        this.actions[type](val)
    }
    get state() { //1. 处理state
        return this.vm._data.$$state
    }
}