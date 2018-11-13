<template>
    <div>

        <file-list path="/"></file-list>

  </div>
</template>

<script>
import FileList from "./FileList"
export default {
  name: 'Media',
  components: {FileList},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
</style>
