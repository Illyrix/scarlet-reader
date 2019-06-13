<template>
  <ReaderDraggable ref="wrapper" v-on:scroll-position="updatePostion($event)">
    <template refs="items" v-for="v of pool">
      <slot :item="v.item" :index="v.index" :active="!v.destroyed"></slot>
    </template>
  </ReaderDraggable>
</template>

<script>
import ReaderDraggable from '@/components/reader/scroll/ReaderDraggable.vue'
import _ from 'lodash'

export default {
  name: 'ReaderVirtualScroll',
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
    attrScroll () {
      return this.isVertical ? 'scrollTop' : 'scrollLeft'
    },
    attrLength () {
      return this.isVertical ? 'offsetHeight' : 'offsetWidth'
    },
    scrolled () {
      return this.$refs.wrapper.slider[this.attrScroll]
    },
    batch () {
      return this.options.batch || 10
    },
    currIndex () {
      return this.pool.findIndex(v => v.index === this.current)
    }
  },
  data () {
    return {
      isSlidingTo: false,
      slidingTarget: -1,
      pool: [],       // { index: source index of items, item: ..., destroyed: int, style: {height: '550px'} }
      offset: 0       // indicates how long has been scrolled
    }
  },
  created () {
    Object.assign(this, {
      autoIncrement: 1,
      time: 0
    })
  },
  updated () {
    console.log('POOL: ' + this.pool.map(v => v.index).join(' '))
  },
  mounted () {
    this.updatePoolItems()
  },
  watch: {
    items () {
      this.updatePoolItems()
    }
  },
  methods: {
    itemSelected ($ev) {
      this.$emit('item-selected', $ev)
    },
    slideTo (idx) {
      // check whether slideTo() invoked by prev() or next()
      if (Math.abs(idx - this.current) > 1) {
        // because it's hard to pre-load image far away from current index
        throw new Error(`[Scarlet-Reader] slideTo method is not support on virtual scroller`)
      }
      // uninterrupt animation
      if (this.$refs.wrapper.slideToPos(this.getPostionByIdx(idx), true)) {
        this.isSlidingTo = true
        this.slidingTarget = idx
      }
    },
    updatePostion (pos) {
      // wrapper has been scrolled
      // these indecies are in items
      const newIdx = this.getIdxByPosition(pos)
      if (this.isSlidingTo && newIdx === this.slidingTarget) {
        this.isSlidingTo = false
      }
      if (newIdx !== this.current) {
        if (!this.isSlidingTo) {
          // ignore change event was emitted by animation from this.slideTo()
          this.updatePoolItems()
        }
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
      } else {
        console.warn(`[Scarlet-Reader::WARNING] undefined index: ${idx}`)
        return 0
      }
    },
    getIdxByPosition (pos) {
      const index = this.$refs.wrapper.$children.reduce((p, v, i) => {
        if (v.$el[this.attrPos] < pos + 1) {
          return i
        } else {
          return p
        }
      }, 0)
      return this.pool[index].index
    },
    updatePoolItems () {
      const batch = this.batch
      if (this.currIndex === -1 && this.pool.length != 0) {
        console.warn('[Scarlet-Reader::WARNING] scroll too fast to load new pages')
      }

      const startIdx = Math.max(this.current - batch, 0)
      const endIdx = Math.min(this.current + batch - 1, this.items.length)
      const newPool = []
      for (let i = startIdx; i <= endIdx; i++) {
        this.items[i] && newPool.push({
          item: this.items[i],
          index: i,
          style: {},
          destroyed: 0
        })
      }

      this.comparePool(newPool)
    },
    comparePool (nextState) {
      // find which should be removed, kept and inserted
      const removed = _.differenceBy(this.pool, nextState, 'index')
      const inter = _.intersectionBy(this.pool, nextState, 'index')
      const inserted = _.differenceBy(nextState, this.pool, 'index')

      // clean inserted elements' recycle status
      _.union(inserted, inter).forEach(v => v.destroyed = 0)

      // delete removed elements
      this.destroyPoolItems(removed)

      // deal with inserted elements
      // assert inserted elements are continous in nextState and this.items
      if (inserted.length > 0) {
        const insertTo = _.findIndex(nextState, (v) => inserted.includes(v))
        const startIdx = Math.min(...inserted.map(v => v.index))
        const endIdx = Math.max(...inserted.map(v => v.index))
        const startStateIdx = Math.min(...nextState.map((v, i) => {
            if (inserted.includes(v)) {
              return i
            }
          }).filter(v => v !== undefined))
        const endStateIdx = Math.max(...nextState.map((v, i) => {
            if (inserted.includes(v)) {
              return i
            }
          }).filter(v => v !== undefined))
        if (endStateIdx - startStateIdx + 1 !== inserted.length
          && endIdx - startIdx + 1 !== inserted.length
        ) {
          console.warn('[Scarlet-Reader::WARNING] inserted items are not continous')
        }
        this.addPoolItems(startIdx, endIdx, insertTo)
      }
    },
    destroyPoolItems (items) {
      if (items.length > 0) {
        const flag = this.autoIncrement++
        items.forEach(v => {
          if (!v.destroyed) {
            v.destroyed = flag
          }
        })
      }
    },
    // insertTo: 0 - start of pool, positive - index in pool, negative - tails of pool
    // before it(0 -> head)
    addPoolItems (startIdx, endIdx, insertTo) {
      const insertItems = []
      for (let i = startIdx; i <= endIdx; i++) {
        if (this.items[i]) {
          const item = this.pool.findIndex(v => v.index === i)
          if (item !== -1) {
            if (this.pool[item].destroyed) {
              console.log(item, this.pool)
              this.$set(this.pool, item, Object.assign({}, this.pool[item], {
                destroyed: 0,
                style: {}
              }))
              console.log(item, this.pool)
            }
          } else {
            insertItems.push({
              item: this.items[i],
              index: i,
              style: {},
              destroyed: 0
            })
          }
        }
      }
      const left = _.slice(this.pool, 0, insertTo)
      const right = _.slice(this.pool, insertTo)
      this.pool = _.concat(left, insertItems, right)
      this.sortPool()
    },
    sortPool () {
      this.pool.sort((a, b) => a.index < b.index ? -1 : 1)
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
.sc-reader-hidden {
  opacity: 0;
}
</style>
