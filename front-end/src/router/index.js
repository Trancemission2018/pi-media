import Vue from 'vue'
import Router from 'vue-router'
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
      path: '/player',
      name: 'MediaPlayer',
      component: MediaPlayer
    }
  ]
})
