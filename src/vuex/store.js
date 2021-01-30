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

function getState(store,path){
    // 想要找当前的新的state
  let state = store.state //1. 找到更新的state
  return  path.reduce((root,curretn)=>{
      return  root[curretn]
    },state)
}
/**
 * 
 * @param {*} store 实例对象
 * @param {*} rootState state状态对象
 * @param {*} path 是否是根还是module
 * @param {*} modules store的树状结构
 */
const installModules = (store,rootState,path,modules)=>{
    // 把各个模块的方法都整合到一起
    /**
     * 最后得到的是
     * {
     *  state:{
     *          name:'a',
     *          b:{
     *              name:'b'
     *          },
     *          c:{
     *              name:'c'
     *          }
     *      }
     * }
     */
    const namespeced = store._modules.getNamespaced(path)
    // 1、 判断是否是module中的state
    if(path.length >0){
      let parent = path.slice(0,-1).reduce((memo,current)=>{
          return  memo[current]
        },rootState)
        // 找到他的爸爸，然后设置属性
        Vue.set(parent,path[path.length -1],modules.state)
    }
    
    modules.forEachMutaions((mutation,key)=>{
        store._mutations[namespeced+key] =  store._mutations[namespeced+key] || []
        store._mutations[namespeced+key].push((payload)=>{
            mutation.call(store,getState(store,path),payload)
            store._subscribes.forEach(fn=>{
                fn(mutation,store.state)
            })
        })
    })
    modules.forEachActions((action,key)=>{
        store._actions[namespeced+key] =  store._actions[namespeced+key] || []
        store._actions[namespeced+key].push((payload)=>{
            action.call(store,store,payload)
        })
    })
    modules.forEachGetters((getter,key)=>{
        // geteer是对象
        store._getters[key]=()=>{
          return  getter(getState(store,path))
        }
    })
    modules.forEachChildren((child,key)=>{
        installModules(store,rootState,path.concat(key),child)
    })
}
function resetStoreVm(store,state){

//     // 挂载getters
//     // 1. 遍历getters
    let computed = {}
    store.getters = {}
 
    forEachValue( store._getters,(getter,key)=>{
        computed[key] = ()=>{
          return  getter()
        }
        Object.defineProperty(store.getters,key,{
            get: ()=>{
             return  store.vm[key]
            }
        })
    })

    store.vm = new Vue({
        data:{
            $$state:state
        },
        computed
    })
   
    
}

export class Store {
    constructor(options) {
        let state = options.state
        this._mutations = {}
        this._actions = {}
        this._getters = {}
        this._subscribes = []
        // 1. 格式化数据(树结构)
        this._modules = new ModuldCollection(options)
        // 2. 安装modules，根模块的状态中，要通过子模块的模块名定义在根模块上
        installModules(this,state,[],this._modules.root)
        // 2.1 将模块中的所有选项都提取到store上
        resetStoreVm(this,state)

        //3. 全局处理插件
        options.plugins?.forEach(plugin=>plugin(this))

    }
    replaceState(state){
        //更新的只是get state中的state options的state并没有改变，所以installModule中的state是options的state
        this.vm._data.$$state = state
    }
    // 收集
    subscribe(fn){
        this._subscribes.push(fn)
    }
    commit = (type,val) => {
        this._mutations[type].forEach(mutation=>{
            mutation(val)
        })
    }
    dispatch = (type,val) => {
        this._actions[type].forEach(action=>{
            action(val)
        })
    }
    get state() { //1. 处理state
        return this.vm._data.$$state
    }
}