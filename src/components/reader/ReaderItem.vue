<template>
  <div
    :class="[isVertical ? 'sc-reader-item-vertical' : 'sc-reader-item-horizon', 'sc-reader-item']"
    :style="itemStyles"
    ref="item"
    @click="select($event)"
    @dragstart="dragStart($event)"
    >
      <template v-if="active">
        <slot></slot>
        <div v-if="options.loading" class="sc-reader-loading">
          <slot name="loading"></slot>
        </div>
      </template>
      <template v-else>
        <div :style="size"></div>
      </template>
  </div>
</template>

<script>
export default {
  name: 'ReaderItem',
  data () {
    return {
      size: {
        height: '0px',
        width: '0px'
      }
    }
  },
  inject: [ 'scReaderOptions' ],
  watch: {
    active (newState, oldState) {
      if (!newState && oldState) {
        const computedStyle = window.getComputedStyle(this.$refs.item)
        this.size = {
          height: computedStyle.getPropertyValue('height'),
          width: computedStyle.getPropertyValue('width')
        }
      }
    }
  },
  computed: {
    options () {
      return this.scReaderOptions
    },
    isVertical () {
      return this.options.direction === 'vertical'
    },
    itemStyles () {
      const scale = this.options.scale ? this.options.scale : '80%'
      const sizeStyle = this.isVertical ? { width: scale } : { height: scale }
      const margin = this.options.margin ? this.options.margin : '0'
      const marginStyle = this.isVertical ? { 'margin-bottom': margin } : { 'margin-right': margin }

      return Object.assign({}, sizeStyle, marginStyle)
    }
  },
  methods: {
    select () {
      this.$emit('selected', this.index)
    },
    dragStart (ev) {
      ev.preventDefault()
    }
  },
  props: {
    index: {
      type: Number,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style>
.sc-reader-item {
  user-select: none;
}

.sc-reader-item-horizon img {
  display: block;
  height: 100%;
  width: auto;
}

.sc-reader-item-vertical img {
  display: block;
  height: auto;
  width: 100%;
}
</style>
