import Vue from 'vue'
import App from './App.vue'
import store from './store'
Vue.config.productionTip = false
// Vue.extend({})  在随意的地方拿到Vue实例
// 异步加载vuex，vuex的modules中的名字要和组件中name一致

let obj = {
  a:123
}
class a {
  install(){
    Vue.mixin({
      beforeCreated(){
        if(this.$options.isVuex){
          const name = this.$options.name
          import('path' + name).then((res)=>{
            // this.$store动态添加module
            // this.$store.
          })
        }

        Vue.util.defineReactive(this,'a',obj.a)


      }
    })
  }
}

// api 
new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
