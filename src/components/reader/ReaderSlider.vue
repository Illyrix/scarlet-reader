<template>
  <div class="sc-reader-wrapper">
    <ReaderVirtualScroll
      ref="vscroller"
      :items="items"
      :current="current"
      v-if="options.virtual"
      v-on:item-selected="itemSelected($event)"
      v-on:sliding="updateCurrent($event)"
    >
      <template v-slot="{ item, index, active }">
        <slot name="item" :item="item" :index="index" :active="active"></slot>
      </template>
    </ReaderVirtualScroll>
    <ReaderScroll
      ref="scroller"
      v-else
      :items="items"
      :current="current"
      v-on:item-selected="itemSelected($event)"
      v-on:sliding="updateCurrent($event)"
    >
      <template v-slot="{ item, index, active }">
        <slot name="item" :item="item" :index="index" :active="active"></slot>
      </template>
    </ReaderScroll>
    <slot
    name="pagination"
    v-if="options.pagination"
    :total="items.length"
    :item="currentItem"
    :current="current"
    v-on:page-selected="slideTo($event)">
    </slot>
  </div>
</template>

<script>
import ReaderVirtualScroll from '@/components/reader/scroll/ReaderVirtualScroll.vue'
import ReaderScroll from '@/components/reader/scroll/ReaderScroll.vue'
export default {
  name: 'ReaderSlider',
  data () {
    const self = this
    return {
      // eslint-disable-next-line
      _current: self.options.current || 0,
      set current(n) {
        this._current = n
        self.$emit('changed', n)
      },
      // eslint-disable-next-line
      get current() {
        return this._current
      },
      get currentItem () {
        return self.items[this._current]
      }
    }
  },
  provide () {
    const self = this
    return {
      scReaderOptions: self.options
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  components: { ReaderVirtualScroll, ReaderScroll },
  methods: {
    prev () {
      const latest = this.current
      this.current = Math.max(0, latest - 1)
      if (this.options.virtual) {
        this.$refs.vscroller.slideTo(this.current)
      } else {
        this.$refs.scroller.slideTo(this.current)
      }
      this.$emit('prev', latest, this.current)
    },
    next () {
      const latest = this.current
      this.current = Math.min(this.items.length - 1, latest + 1)
      if (this.options.virtual) {
        this.$refs.vscroller.slideTo(this.current)
      } else {
        this.$refs.scroller.slideTo(this.current)
      }
      this.$emit('next', latest, this.current)
    },
    slideTo (index) {
      if (index === this.current) {
        return
      }
      const latest = this.current
      this.current = index
      try {
        if (this.options.virtual) {
          this.$refs.vscroller.slideTo(this.current)
        } else {
          this.$refs.scroller.slideTo(this.current)
        }
      } catch (e) {
        // restore current
        this.current = latest
        throw e
      }
      this.$emit('slide-to', latest, this.current)
    },
    itemSelected (ev) {
      this.$emit('item-selected', ev)
    },
    updateCurrent (idx) {
      this.current = idx
    }
  }
}
</script>
