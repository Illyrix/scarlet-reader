<template>
  <div class="demo-app">
    <button @click="$refs.slider.prev()">prev</button>
    <button @click="$refs.slider.slideTo(Math.floor(Math.random() * items.length))">Slide to rand</button>
    <button @click="$refs.slider.next()">next</button>
    <ReaderSlider ref="slider" :options="options" :items="items">
      <template v-slot:item="{ item, index, active }">
        <ReaderItem :index="index" :active="active">
          <img :src="item.src"/>
          <p>index: {{ index }}</p>
          <template v-slot:loading>
            <p>loading</p>
          </template>
        </ReaderItem>
      </template>
      <template v-slot:pagination="{ item, current, total }">
        <ReaderPagination :current="current" :total="total">
          <div> {{ current + '/' + total }} </div>
        </ReaderPagination>
      </template>
    </ReaderSlider>
  </div>
</template>

<script>

import ReaderSlider from '@/components/reader/ReaderSlider.vue'
import ReaderItem from '@/components/reader/ReaderItem.vue'
import ReaderPagination from '@/components/reader/ReaderPagination.vue'

export default {
  name: 'BasicUsage',
  components: { ReaderSlider, ReaderPagination, ReaderItem },
  data () {
    const items = []
    for (let i = 1; i <= 34; i++) {
      if (i < 10) {
        items.push({ id: i, src: `/static/test/0${i}.jpg` })
      } else {
        items.push({ id: i, src: `/static/test/${i}.jpg` })
      }
    }
    return {
      items,
      options: {
        virtual: true,
        pagination: true,
        direction: 'vertical',
        margin: '0px',
        width: '590px',
        height: '940px',
        inertia: true,
        loading: true,
        batch: 10,
        speedLimit: { down: 0.2, up: 8 }
      }
    }
  }
}
</script>

<style>
</style>
