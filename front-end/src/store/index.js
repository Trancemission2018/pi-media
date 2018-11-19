import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showVideoPlayer: false,
    mplayer: {
      status: 'stopped',
      currentTitle: '',
      currentStream: null
    }
  },
  mutations: {
    setPlaying (state) {
      state.mplayer.status = 'playing'
    },
    setTitle (state, title) {
      state.mplayer.currentTitle = title
    },
    setPaused (state) {
      state.mplayer.status = 'paused'
    },
    setStopped (state) {
      state.mplayer.status = 'stopped'
    },
    showVideoPlayer (state) {
      state.showVideoPlayer = true
    },
  },
  actions: {
    setPlaying (context) {
      context.commit('setPlaying')
    },
    setTitle (context, title) {
      console.log('Setting title')
      context.commit('setTitle', title)
    },
    setPaused (context) {
      context.commit('setPaused')
    },
    setStopped (context) {
      context.commit('setStopped')
    },
    showVideoPlayer (context) {
      context.commit('showVideoPlayer')
    },
  }
})