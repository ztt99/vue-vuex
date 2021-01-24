<template>
  <div>
    {{this.$store.state.age}}
    {{this.$store.getters.age}}
    {{this.$store.getters.age}}
    {{this.$store.getters.age}}
    {{this.$store.getters.age}}
    {{this.$store.getters.age}}
    <button @click="$store.commit('setAge',20)">mutaions</button>
    <button @click="$store.dispatch('setAge',20)">actions</button>
    <!-- <Hello></Hello> -->
  </div>
</template>

<script>
// import Hello from './components/HelloWorld'
export default {
  name:'app',
  created(){
  },
  components:{
    // Hello
  }
}
</script>

<style>

</style>