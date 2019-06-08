<template>
  <div id="app">
    <BasicUsage></BasicUsage>
  </div>
</template>

<script>
import BasicUsage from './components/BasicUsage.vue'

export default {
  name: 'app',
  components: {
    BasicUsage
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
