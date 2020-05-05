import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
/* 引入vuex日志插件 */
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

/* debug为true 为严格模式  */
const debug = process.env.NODE_ENV !== 'production'

/*
  关于store：
      1.store中的数据是响应式的，store中的状态改变，相应的组件也会更新
      2.不能直接改变store中的状态，只有通过提交mutation，也就是action中的操作，这样可以方便的跟踪每个状态的变化
 */
/*
    一个完整的store的结构包括：
          state：存放状态
          getters：获取状态
          mutation：更改状态，同步操作
          actions：提交mutation，异步操作
 */
/*
      vuex的优点：
          能够集中管理共享的数据，易于后期开发和维护
          能够高效实现组件之间的数据共享，提高开发效率
          存储在vuex中的数据都是响应式的，能够实时保持数据和页面的同步
 */
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict:debug,
  /* 打印日志的插件 ：数组*/
  plugins:debug?[createLogger()]:[]
})
