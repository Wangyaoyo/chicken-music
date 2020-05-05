<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" v-model="query" :placeholder="placeholder" ref="input"/>
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from "common/js/util";

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
      /*
      现状：页面上的某些事件触发频率非常高，数据发生变化时，可能造成成百上千次对处理函数的调用，对于性能的影响是非常大的
      解决办法：于是，我们可以考虑，每次数据改变时，不要立即执行相关操作，而是等一段时间，以数据不再变化为计时起点，一段时间后再去执行操作。
      代码：设置一个定时器，在这一小段时间之后再去发送请求，这就稀释了发请求的频率，该函数称为防抖函数
      */
    created() {
      /* 截流函数用法 */
      this.$watch('query', debounce((newQuery) => {                 //
        this.$emit('query',newQuery)
      },200))
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      clear() {
        this.query = ''
      },
        //在哪里用到这个方法
      setQuery(query){
        this.query = query
      },
        //在哪里用到这个方法
      inputblur(){
        this.$refs.input.blur()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display flex
    align-items center
    box-sizing border-box
    width 100%
    padding 0 6px
    height 40px
    background $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
