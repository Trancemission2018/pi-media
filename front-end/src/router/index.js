import Vue from 'vue'
import Router from 'vue-router'


import Download from '../components/Download'
import Downloads from '../components/Downloads'

import Media from '../components/Media'
import MediaPlayer from '../components/MediaPlayer'


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
    },
    {
      path: '/player',
      name: 'MediaPlayer',
      component: MediaPlayer

    }
  ]
})
