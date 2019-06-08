<template>
  <div class="sc-reader-pagination" @click="$emit('page-selected', 1)">
    <slot></slot>
  </div>
</template>

<script>
// Working...
export default {
  name: 'ReaderPagination',
  inject: [ 'scReaderOptions' ],
  computed: {
    options () {
      return this.scReaderOptions
    }
  },
  data () {
    return {
      a: 1
    }
  },
  props: {
    current: {
      type: Number
    },
    total: {
      type: Number
    }
  }
}
</script>

<style>

</style>
