import Vue from 'vue'
import Router from 'vue-router'
/* 子路由使用步骤：导入组件 配置子路由 <router-view>标签 事件中push进去 */

Vue.use(Router)                                      //vue的路由

/*
*   功能：给组件起一个名字
*/
const recommend = ((resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
})

const rank = ((resolve) => {
  import('components/rank/rank').then((module) => {
    resolve(module)
  })
})

const search = ((resolve) => {
  import('components/search/search').then((module) => {
    resolve(module)
  })
})

const singer = ((resolve) => {
  import('components/singer/singer').then((module) => {
    resolve(module)
  })
})

const SingerDetail = ((resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
})

const User = ((resolve) => {
  import('components/user-center/user-center').then((module) => {
    resolve(module)
  })
})

const Disc = ((resolve) => {
  import('components/disc/disc').then((module) => {
    resolve(module)
  })
})

const TopList = ((resolve) => {
  import('components/topList/topList').then((module) => {
    resolve(module)
  })
})
/*
   功能：根据路径找到相应的组件（映射）
 */
export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/recommend'
    },
    {
      path: '/recommend',
      component: recommend,
      children:[
        {
          path:':id',
          component:Disc
        }
      ]
    },
    {
      path:'/rank',
      component:rank,
      children:[
        {
          path:':id',
          component:TopList
        }
        ]
    },
    {
      path:'/search',
      component:search,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path:'/singer',
      component:singer,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path:'/user',
      component:User
    }
  ]
})
