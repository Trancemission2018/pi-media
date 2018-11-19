<template>
    <v-app
            id="app"
            dark
            @click="showPlayer = false"
    >
        <v-navigation-drawer
                v-model="drawer"
                fixed
                clipped
                app
        >

            <v-list dense class="mt-4">

                <v-list-tile v-for="item in menu" :key="item.text" :to="item.link">
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{ item.text }}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar
                color="#37474F"
                dense
                fixed
                clipped-left
                app
        >
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-icon class="mx-3">fab fa-youtube</v-icon>
            <v-toolbar-title class="mr-5 align-center">
                <span class="title">Pi-Media</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-content>
            <router-view>
            </router-view>
            <!-- <v-btn @click="showPlayer = !showPlayer">Player</v-btn> -->
        </v-content>
        <v-bottom-sheet persistent inset hide-overlay :value="$store.state.showVideoPlayer">
            <media-player :src="$store.state.mplayer.currentStream"></media-player>
        </v-bottom-sheet>
        <v-bottom-sheet persistent inset hide-overlay :value="$store.state.mplayer.status !== 'stopped'">

            <v-progress-linear
                    :value="50"
                    class="my-0"
                    height="3"
            ></v-progress-linear>
            <v-list>
                <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title>{{$store.state.mplayer.currentTitle}}</v-list-tile-title>
                    </v-list-tile-content>

                    <v-spacer></v-spacer>

                    <!--
                    <v-list-tile-action>
                        <v-btn icon>
                            <v-icon>fast_rewind</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                    -->


                    <v-list-tile-action
                            v-if="$store.state.mplayer.status==='playing'"
                            :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }"
                            @click="pause"
                    >
                        <v-btn icon>
                            <v-icon>pause</v-icon>
                        </v-btn>
                    </v-list-tile-action>

                    <v-list-tile-action
                            v-else-if="$store.state.mplayer.status==='paused'"
                            :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }"
                            @click="play"
                    >
                        <v-btn icon>
                            <v-icon>play_arrow</v-icon>
                        </v-btn>
                    </v-list-tile-action>

                    <v-list-tile-action
                            v-else
                            :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }"
                            @click="stop"
                    >
                        <v-btn icon>
                            <v-icon>stop</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                    <!--
                    <v-list-tile-action :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }">
                        <v-btn icon>
                            <v-icon>fast_forward</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                    -->
                </v-list-tile>
            </v-list>
        </v-bottom-sheet>
    </v-app>
</template>

<script>
  import axios from 'axios'
  import MediaPlayer from "./components/MediaPlayer"
  // const apiBase = 'http://192.168.0.10:9001'
  const apiBase = 'http://localhost:9001'

  const piApi = axios.create({
    baseURL: apiBase
  })
  export default {
    name: 'App',
    components: {MediaPlayer},
    data: () => ({
      drawer: null,
      showPlayer: false,
      menu: [
        {icon: 'folder', text: 'Media Browser', link: '/media'},
        {icon: 'search', text: 'Search Torrents', link: '/download'},
        {icon: 'cloud_download', text: 'Download From Web', link: '/youtube'},
        {icon: 'check', text: 'View Downloads', link: '/downloads'},
        {icon: 'list', text: 'PlayLists', link: '/playlists'},

      ],
    }),
    props: {
      source: String
    },
    methods: {
      pause() {
        piApi.get(`/pause`).then(response => {
          this.$store.dispatch('setPaused')
          console.log(response.data)
        })
      },
      play() {
        piApi.get(`/resume`).then(response => {
          this.$store.dispatch('setPlaying')
          console.log(response.data)
        })
      },
      stop() {
        piApi.get(`/stop`).then(response => {
          this.$store.dispatch('setStopped')
          console.log(response.data)
        })
      }
    }
  }
</script>