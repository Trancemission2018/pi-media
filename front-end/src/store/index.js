import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mplayer: {
      status: 'stopped',
      currentTitle: ''
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
  }
})