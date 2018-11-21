import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showVideoPlayer: false,
    mplayer: {
      status: 'stopped',
      currentTitle: '',
      currentStream: null,
      playlist: {
        id: null,
        name: '',
        files: [],
        currentIndex: null
      },
    }
  },
  mutations: {
    setPlaying(state) {
      state.mplayer.status = 'playing'
    },
    setTitle(state, title) {
      state.mplayer.currentTitle = title
    },
    setPaused(state) {
      state.mplayer.status = 'paused'
    },
    setStopped(state) {
      state.mplayer.status = 'stopped'
    },
    showVideoPlayer(state) {
      state.showVideoPlayer = true
    },
    playPlayList(state, playlist) {
      state.mplayer.playlist.id = playlist.id
      state.mplayer.playlist.name = playlist.name
      state.mplayer.playlist.files = playlist.files
      state.showVideoPlayer = true
    },
    setPlayListPosition(state, position) {
      state.mplayer.playlist.currentIndex = position
    }
  },
  actions: {
    setPlaying(context) {
      context.commit('setPlaying')
    },
    setTitle(context, title) {
      console.log('Setting title')
      context.commit('setTitle', title)
    },
    setPaused(context) {
      context.commit('setPaused')
    },
    setStopped(context) {
      context.commit('setStopped')
    },
    showVideoPlayer(context) {
      context.commit('showVideoPlayer')
    },
    playPlayList(context, playlist) {
      return new Promise((resolve) => {
        console.log('Setting playlist', playlist)
        context.commit('playPlayList', playlist)
        resolve()
      })
    },
    setPlayListPosition(context, position) {
      return new Promise((resolve) => {
        context.commit('setPlayListPosition', position)
        resolve()
      })
    }
  }
})