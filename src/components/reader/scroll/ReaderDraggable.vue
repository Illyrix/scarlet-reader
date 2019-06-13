<template>
  <div 
  class="sc-reader-item-list"
  :class="listClasses"
  :style="listSize" 
  @mousedown="onmousedown($event)"
  @mousemove="onmousemove($event)"
  @mouseleave="onmouseup($event)"
  @mouseup="onmouseup($event)"
  @touchstart="onmousedown($event)"
  @touchmove="onmousemove($event)"
  @touchend="onmouseup($event)"
  @touchleave="onmouseup($event)"
  @scroll="onscroll($event)"
  ref="itemList">
    <slot></slot>
  </div>
</template>

<script>
import TWEEN from 'tween.js'
const throttle = 33

export default {
  name: 'ReaderDraggable',
  inject: [ 'scReaderOptions' ],
  computed: {
    options () {
      return this.scReaderOptions
    },
    easing () {
      return this.options.easing || ['Quintic', 'Out']
    },
    isVertical () {
      return this.options.direction === 'vertical'
    },
    listSize () {
      return {
        height: this.options.height ? this.options.height : (this.$props.height ? this.$props.height : '600px'),
        width: this.options.width ? this.options.width : (this.$props.width ? this.$props.width : '400px')
      }
    },
    listClasses () {
      return {
        'sc-reader-direct-vertical' : this.isVertical,
        'sc-reader-direct-horizon' : !this.isVertical
      }
    },
    slider () {
      return this.$refs.itemList
    },
    // bias average speed in last moves
    lastSpeed () {
      if (this.lastMoves.length < 2) {
        return 0
      }
      const speed = this.lastMoves.reduceRight((i, { ts, pos }) => {
        if (i === undefined) {
          return {
            speed: 0,
            last: { ts, pos }
          }
        } else {
          return  {
            speed: (i.speed + (i.last.pos - pos) / (i.last.ts - ts)) / 2,
            last: { ts, pos }
          }
        }
      }, undefined).speed
      if (this.options.speedLimit){
        if (this.options.speedLimit.up && Math.abs(speed) > this.options.speedLimit.up) {
          return this.options.speedLimit.up * Math.sign(speed)
        }
        if (this.options.speedLimit.down && Math.abs(speed) < this.options.speedLimit.down) {
          return 0
        }
      }
      return speed
    },
    attrPos () {
      return this.isVertical ? 'offsetTop' : 'offsetLeft'
    },
    attrScroll () {
      return this.isVertical ? 'scrollTop' : 'scrollLeft'
    },
    duration () {
      return this.options.animateDuration || 1000
    }
  },
  created () {
    Object.assign(this, {
      interruptable: true,
      isMouseDown: false,
      startPos: 0,
      scrollPos: 0,
      animate: null
    })
  },
  data () {
    return {
      lastMoves: []
    }
  },
  mounted () {
    (function animate() {
      requestAnimationFrame(animate)
      TWEEN.update()
    })()
  },
  methods: {
    triggerSliding () {
      this.$emit('scroll-position', this.slider[this.attrScroll])
    },
    slideToPos (pos, interruptable = true) {
      // trigger this method at changing current page
      // do nothing
      if (!this.isMouseDown && (!this.animate || this.interruptable)) {
        this.scrollPos = pos
        const el = this.slider
        if (el[this.attrScroll] === pos) {
          return
        }
        const self = this
        if (this.animate) {
          this.animate.stop()
        }
        
        this.animate = new TWEEN.Tween({scrollPos: el[self.attrScroll]})
          .easing(TWEEN.Easing[this.easing[0]][this.easing[1]])
          .to({scrollPos: self.scrollPos}, this.duration)
          .onStart(function () {
            if (!interruptable) {
              self.interruptable = false
            }
          })
          .onComplete(function () {
            if (!interruptable) {
              self.interruptable = true
            }
            self.triggerSliding()
          })
          .onStop(function () {
            if (!interruptable) {
              self.interruptable = true
            }
            self.triggerSliding()
          })
          .onUpdate(function () {
            el[self.attrScroll] = this.scrollPos
          })
          .start()
        return true
      } else {
        return false
      }
    },
    onmousedown (ev) {
      if (this.animate && !this.interruptable) {
        return
      }
      this.isMouseDown = true
      this.lastMoves = []
      this.startPos = (this.isVertical ? ev.pageY : ev.pageX) - this.slider[this.attrPos]
      this.scrollPos = this.slider[this.attrScroll]
      if (this.animate) {
        this.animate.stop()
      }
    },
    onmousemove (ev) {
      if (!this.isMouseDown || (this.animate && !this.interruptable)) {
        return
      } else {
        ev.preventDefault()
        const pos = (this.isVertical ? ev.pageY : ev.pageX) - this.slider[this.attrPos]
        const walk = (pos - this.startPos) * 1 // 1 is the speed
        this.slider[this.attrScroll] = this.scrollPos - walk

        this.lastMoves.push({ ts: ev.timeStamp, pos })
        if (this.lastMoves.length > 3) {
          this.lastMoves.shift()
        }
      }
    },
    onmouseup () {
      if (this.isMouseDown && (!this.animate || this.interruptable)) {
        this.isMouseDown = false
        const el = this.$refs.itemList
        const self = this
        if (this.options.inertia) {
          const speed = this.lastSpeed
          const distance = speed * this.duration / 2
          if (this.animate) {
            this.animate.stop()
          }
          this.scrollPos = el[self.attrScroll] - distance
          this.animate = new TWEEN.Tween({scrollPos: el[self.attrScroll]})
            .easing(TWEEN.Easing[this.easing[0]][this.easing[1]])
            .to({scrollPos: self.scrollPos}, this.duration)
            .onComplete(function () {
              self.triggerSliding()
            })
            .onStop(function () {
              self.triggerSliding()
            })
            .onUpdate(function () {
              el[self.attrScroll] = this.scrollPos
            })
            .start()
        }
      }
    },
    onscroll () {
      if (!this.scrollThrottle) {
        this.scrollThrottle = true
        this.triggerSliding()
        window.setTimeout(() => {
          this.scrollThrottle = false
        }, throttle)
      }
    }
  }
}
</script>

<style>
.sc-reader-item-list {
  position: relative;
  display: flex;
  align-items: center;
  background-color: lightgrey;
  margin: auto;
  /* for Firefox */
  scrollbar-width: none;
}
/* for Chrome */
.sc-reader-item-list::-webkit-scrollbar{
  display: none;
}


.sc-reader-direct-vertical {
  flex-direction: column;
  overflow-x: scroll;
}

.sc-reader-direct-horizon {
  flex-direction: row;
  overflow-y: scroll;
}
</style>
