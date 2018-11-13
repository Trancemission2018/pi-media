import Vue from 'vue'
import Router from 'vue-router'
import Media from '@/components/Media'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/media',
      name: 'Media',
      component: Media
    }
  ]
})
