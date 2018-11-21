import Vue from 'vue'
import Router from 'vue-router'


import Download from '../components/Download'
import DownloadYouTube from '../components/DownloadYouTube'
import Downloads from '../components/Downloads'

import Media from '../components/Media'
import PlayLists from '../components/PlayLists'
import PlayList from '../components/PlayList'
import PlayListCurrent from '../components/PlayListCurrent'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/media'
    },
    {
      path: '/media',
      name: 'Media',
      component: Media
    },
    {

      path: '/download',
      name: 'Download Torrents',
      component: Download
    },
          {

      path: '/youtube',
      name: 'Download YouTube',
      component: DownloadYouTube
    },
    {
      path: '/downloads',
      name: 'Downloads',
      component: Downloads
    },
    {
      path: '/playlists',
      name: 'PlayLists',
      component: PlayLists
    },
    {
      path: '/playlist/current',
      name: 'Current Playlist',
      component: PlayListCurrent
    },
    {
      path: '/playlist/:playListId',
      name: 'PlayList',
      component: PlayList
    }
  ]
})
