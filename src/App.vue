<template>
  <div>
    {{this.age}}
    {{this.$store.state.a.a}}
    {{this.$store.getters.age}}
    {{this.$store.state.a.c.name}}
   
    <button @click="$store.commit('setAge',20)">mutaions</button>
    <button @click="$store.commit('a/setName',20)">a/c</button>
    <button @click="$store.dispatch('setAge',20)">actions</button>
    <!-- <Hello></Hello> -->
  </div>
</template>

<script>
// import Hello from './components/HelloWorld'
import {mapState} from './vuex'
export default {
  name:'app',
  created(){
    console.log(this.$store.state);
  },
  computed:{
    ...mapState(['age'])

  },
  components:{
  }
}
</script>

<style>

</style>