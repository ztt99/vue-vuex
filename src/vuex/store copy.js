import { forEachValue } from './utils'

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

        // 2. 处理getters具有缓存性，可利用computed
        this.getters = {}
        forEachValue(getters, (fn, key) => {
            computed[key] = () => {
                return fn(this.state)
            }
            Object.defineProperty(this.getters, key, {
                get: () => this.vm[key]
            })
        })
        // 3. 处理mutations,通过commit触发mutations
        this.mutations = {}
        forEachValue(mutations, (fn, key) => {
            this.mutations[key] = (val) => {
                return fn(this.state, val)
            }
        })
        // 4. 处理actions
        this.actions = {}
        forEachValue(actions, (fn, key) => {
            this.actions[key] = (val) => {
                return fn(this, val)
            }
        })

        this.vm = new Vue({
            data: {  //属性如果是$开头的,不会挂载到vue组件实例中，会保存在_data私有属性中,
                $$state: state // 数据劫持
            },
            computed
        })
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