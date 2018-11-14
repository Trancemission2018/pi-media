import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mplayer: {
      status: 'stopped'
    }
  },
  mutations: {
    setPlaying (state) {
      state.mplayer.status = 'playing'
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
    setPaused (context) {
      context.commit('setPaused')
    },
    setStopped (context) {
      context.commit('setStopped')
    },
  }
})