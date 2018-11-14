import Vue from 'vue'
import Router from 'vue-router'
import Media from '@/components/Media'
import Download from '../components/Download'
import Downloads from '../components/Downloads'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/media',
      name: 'Media',
      component: Media
    },
    {
      path: '/download',
      name: 'Download',
      component: Download
    },
    {
      path: '/downloads',
      name: 'Downloads',
      component: Downloads
    }
  ]
})
