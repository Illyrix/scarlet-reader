import ReaderSlider from './components/reader/ReaderSlider.vue'
import ReaderItem from './components/reader/ReaderItem.vue'
import ReaderPagination from './components/reader/ReaderPagination.vue'

const install = function (Vue) {
  if (install.installed) {
    return
  }
  Vue.component('ReaderSlider', ReaderSlider)
  Vue.component('ReaderItem', ReaderItem)
  Vue.component('ReaderPagination', ReaderPagination)
}

export default {
  install,
  ReaderItem,
  ReaderPagination,
  ReaderSlider
}
