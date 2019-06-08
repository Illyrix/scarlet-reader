# Scarlet Reader
Scarlet reader is a picture/manga viewer based on Vue.

## demos
![demo](./demo/sc-reader-demo.gif)
src/examples gives more demos

## features
* horizon & vertical scrolling direction
* normal & virtual scroller
* sliding animation
* touch event (only tested on Chrome mobile)
* prev page/next page
* slide to(only normal scroller)
* slots for items

## usage
```bash
npm install scarlet-reader
```
or
```bash
yarn add scarlet-reader
```
in `main.js` (or other place before using &lt;ReaderSlider&gt; tags)
```javascript
import Vue from 'vue'

// some other code...

import Reader from 'scarlet-reader'

// register reader components
Vue.use(Reader)

// other code...
// new Vue()
```
In `*.vue` where you use it
```html
<ReaderSlider :options="options" :items="items">
  <template v-slot:item="{ item, index, active }">
    <ReaderItem :index="index" :active="active">
      <img :src="item.src"/>
      <p>index: {{ index }}</p>
    </ReaderItem>
  </template>
  <template v-slot:pagination="{ item, current, total }">
    <ReaderPagination :current="current" :total="total">
      <div> {{ current + '/' + total }} </div>
    </ReaderPagination>
  </template>
</ReaderSlider>
```
and provide items and options in data
```javascript
export default {
  
  // some code here...

  data () {
    const items = []
    for (let i = 1; i <= 1207; i++) {
      items.push({ src: `/static/${i}.jpg` })
    }
    return {
      items,
      options: {
        // some options
      }
    }
  }

  // other code...
}
```
items in the list can be customized in &lt;ReaderItem&gt; as the way you like

## to-do list
* support `slideTo` on virtual scroller
* support `current` in options indicates to sliding to where after initialization
* loading slot in &lt;ReaderItem&gt;
* pagination
* touch support on Safari
* performance improvement

## options
| property | type | default | description |
| :---: | :---: | :---: | :---: |
| animateDuration | Number | 1000 | the duration of sliding animation |
| batch | Number | 16 | the amount of unreached items but pre-load into DOM |
| _current_ | Number | 0 | __[TO BE SUPPORTED]__<br> slide to the item which has this index after initialization |
| direction | String | vertical | the sliding direction |
| easing | [String, String] | ['Quintic', 'Out'] | easing type of tween.js which controls sliding animation |
| height | String | 600px | height of visible reader div<br> percentage also supported (100%) |
| inertia | Boolean | true | enable sliding animation |
| loading | Boolean | true | __[TO BE SUPPORTED]__<br> enable loading slot display |
| margin | String | 0px | margin between adjacent two items |
| pagination | Boolean | true | __[TO BE SUPPORTED]__<br> enable pagination display |
| scale | String | 80% | how much item will occupy on fixed direction<br> center automatically |
| speedLimit | { down: Number, up: Number } | { down: 0.1, up: 10 } | sliding speed greater than `up` will be limited to `up` during animation;<br> speed less than `down` won't have inertia animation |
| virtual | Boolean | true | enable virtual scroller - less memory and time to load, but cannot use `slideTo` method |
| width | String | 400px | width of visible reader div<br> percentage also supported (100%) |

## apis
### &lt;ReaderSlider&gt;
#### props
* options  
  * type `Object`
  * example
    ```javascript
    {
      virtual: true,
      direction: 'vertical',
      margin: '0px',
      width: '590px',
      height: '940px',
      inertia: true,
      loading: true,
      batch: 10,
      speedLimit: { down: 0.2, up: 8 }
    }
    ```
* items  
  * type `Array`
  * example
    ```javascript
    [
      { src: '1.jpg' },
      { src: '2.jpg' },
      { src: '3.jpg' },
      { src: '4.jpg' },
      { src: '5.jpg' }
    ]
    ```
#### methods
* slideTo  
  slide to the given index. __NOTE__: ONLY support normal scroller, when `options.virtual` set to be `false`
  * param `index`  
    `index` should in range of [0, length of items]
    * type `Number`
  * returns `void`
* prev  
  slide to previous page
  * param `void`
  * returns `void`

example:
```html
<!--in vue template-->
<ReaderSlider ref="slider" :options="options" :items="items">
  <!--ReaderItem-->
</ReaderSlider>
```
```javascript
// in component
this.$refs.slider.slideTo(1)
```
#### events
* changed  
  current page has been changed for any reasons
  * param `index`  
    new page index
* prev  
  trigger as `prev` method was invoked
  * param `latest`  
    current page index (before change)
  * param `next`  
    new page index (after change)
* next  
  trigger as `next` method was invoked
  * param `latest`  
    current page index (before change)
  * param `next`  
    new page index (after change)
* slide-to  
  trigger as `slideTo` method was invoked
  * param `latest`  
    current page index (before change)
  * param `next`  
    new page index (after change)
#### slots
* item
  * scoped varibles
    * index `Number` current page index
    * item `Object` current page data
    * active `Boolean` whether this page is loaded to DOM
* pagination
  * scoped varibles
    * item `Object` current page data
    * current `Number` current page index
    * total `Number` amount of items

### &lt;ReaderItem&gt;
#### slots
* loading  
  display when is loading __[TO BE SUPPORTED]__

## license
MIT

## about Scarlet
Scarlet is a cross-platform manga reader constructed by electron. One of components works with scarlet reader.