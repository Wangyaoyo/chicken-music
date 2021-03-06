<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span v-for="(dot,index) in dots" :class="{active:currentPageIndex === index}" class="dot"></span>
    </div>
  </div>
</template>
<!-- 笔记 -->
<!-- 1、导入轮播图的组件 使用v-if确保dom的渲染在获取数据之后 -->
<!-- 2、浏览器窗口改变时 设置标志位避免宽度多次相加 -->
<!-- 3、mounted钩子一般结合setTimeout使用，确保浏览器刷新后初始化 -->
<!-- 思路：
      配置轮播图的重要参数：自动轮播、循环轮播、轮播时间
      初始化：计算宽度（轮播图父容器、子的宽度）、dot初始化、scroll初始化
      监听事件：每滑到一页结束，是自动播放就自己计算页数并利用定时器滑到下一页
      学会理解业务的同时思考代码的实现
-->
<script type="text/ecmascript-6">
    import {addClass} from "common/js/dom";
    import BScroll from "better-scroll"

    export default {
      props:{
        /* 循环轮播 */
        loop:{
          type:Boolean,
          default:true
        },
        /* 自动轮播 */
        autoPlay:{
          type:Boolean,
          default:true
        },
        /* 每4秒轮播一次 */
        interval:{
          type:Number,
          default:4000
        }
      },
      data(){
        return{
          dots:[],
          currentPageIndex:0
        }
      },
      mounted(){
        /* 浏览器每17毫秒刷新一次 */
        setTimeout(() => {
          this._setSliderWidth()
          this._initDots()
          this._initSliderScroll()

          if (this.autoPlay) {
            this._play()
          }
        },20)

        window.addEventListener('resize',() => {
          if(!this.slider){
            return
          }
          this._setSliderWidth(true)
          this.slider.refresh()
        })
      },
      activated() {
        if (this.autoPlay) {
          this._play()
        }
      },
      deactivated(){
        clearTimeout(this.timer)
      },
      beforeDestroy(){
        clearTimeout(this.timer)
      },
      destroyed(){
        clearTimeout(this.timer)
      },
      methods:{
        /* 初始化轮播器的宽度 */
        _setSliderWidth(isResize){
          this.children = this.$refs.sliderGroup.children

          let width = 0
          let sliderWidth = this.$refs.slider.clientWidth
          for(let i = 0; i < this.children.length; i++){
            let child = this.children[i]
            addClass(child,'slider-item')

            child.style.width = sliderWidth + 'px'
            width += sliderWidth
          }
          if(this.loop && !isResize){
            width += sliderWidth * 2;
          }
          this.$refs.sliderGroup.style.width = width + 'px';
        },
        _initDots(){
          this.dots = new Array(this.children.length)
        },
        _initSliderScroll(){
          this.slider = new BScroll(this.$refs.slider,{
            scrollX: true,
            scrollY: false,
            momentum: false,
            snap: true,
            snapLoop: this.loop,
            snapThreshold: 0.3,
            snapSpeed: 400,
            click:true
          })

          this.slider.on('scrollEnd',() => {
            let pageIndex = this.slider.getCurrentPage().pageX
            if(this.loop){
              /* 因为循环播放多渲染了一个dom : 多一页 */
              pageIndex -= 1
            }
            /* currentPageIndex 与 index都是从0开始，比pageIndex少1 */
            this.currentPageIndex = pageIndex
            if(this.autoPlay){
              this._play()
            }
          })

          this.slider.on('beforeScrollStart',() => {
            if(this.autoPlay){
              clearTimeout(this.timer)
            }
          })
        },
        _play(){
          let pageIndex = this.currentPageIndex + 1
          if(this.loop){
            pageIndex += 1
          }
          /* 设置自动播放的定时器 */
          this.timer = setTimeout(() => {
            this.slider.goToPage(pageIndex,0,400)
          },this.interval)
        }
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
