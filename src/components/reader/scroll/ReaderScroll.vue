<template>
  <ReaderDraggable ref="wrapper" v-on:scroll-position="updatePostion($event)">
    <template v-for="(v, i) in items">
      <slot :item="v" :index="i" :active="true"></slot>
    </template>
  </ReaderDraggable>
</template>

<script>
import ReaderDraggable from '@/components/reader/scroll/ReaderDraggable.vue'

export default {
  name: 'ReaderScroll',
  inject: [ 'scReaderOptions' ],
  components: { ReaderDraggable },
  computed: {
    options () {
      return this.scReaderOptions
    },
    isVertical () {
      return this.options.direction === 'vertical'
    },
    attrPos () {
      return this.isVertical ? 'offsetTop' : 'offsetLeft'
    },
    attrLength () {
      return this.isVertical ? 'offsetHeight' : 'offsetWidth'
    }
  },
  // TODO: options.current Support
  // 需要注册 img 标签的onload事件, 否则 pos 计算值不准确
  // mounted () {
  //   if (this.options.current) {
  //     this.$refs.wrapper.$children[this.options.current].$el.children[0].onload = () => {
  //       this.slideTo(this.options.current)
  //     }
  //   }
  // },
  methods: {
    itemSelected ($ev) {
      this.$emit('item-selected', $ev)
    },
    slideTo (idx) {
      this.$refs.wrapper.slideToPos(this.getPostionByIdx(idx))
    },
    updatePostion (pos) {
      // wrapper has been scrolled
      const newIdx = this.getIdxByPosition(pos)
      if (newIdx !== this.current) {
        this.$emit('sliding', newIdx)
      }
    },
    getPostionByIdx (idx) {
      const item = this.$refs.wrapper.$children[idx]
      if (item) {
        // last item aligns to the left/top edge
        if (idx === this.items.length - 1) {
          return Math.min(0, item.$el[this.attrLength]- this.$refs.wrapper.$el[this.attrLength]) + item.$el[this.attrPos]
        }
        return item.$el[this.attrPos]
      }
    },
    getIdxByPosition (pos) {
      return this.$refs.wrapper.$children.reduce((p, v, i) => {
        if (v.$el[this.attrPos] < pos + 1) {
          return i
        } else {
          return p
        }
      }, 0)
    }
  },
  props: {
    items: {
      required: true,
      type: Array
    },
    current: {
      required: true,
      type: Number
    }
  }
}
</script>

<style>

</style>
