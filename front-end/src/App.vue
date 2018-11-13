<template>
    <v-app
            id="app"
            dark
    >
        <v-navigation-drawer
                v-model="drawer"
                fixed
                clipped
                app
        >
            <v-list dense>
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
                color="red"
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
            <v-btn @click="showPlayer = true">Player</v-btn>
        </v-content>
        <v-bottom-sheet inset :value="showPlayer">

            <v-card tile>
                <v-progress-linear
                        :value="50"
                        class="my-0"
                        height="3"
                ></v-progress-linear>

                <v-list>
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>The Walker</v-list-tile-title>
                            <v-list-tile-sub-title>Fitz & The Trantrums</v-list-tile-sub-title>
                        </v-list-tile-content>

                        <v-spacer></v-spacer>

                        <v-list-tile-action>
                            <v-btn icon>
                                <v-icon>fast_rewind</v-icon>
                            </v-btn>
                        </v-list-tile-action>

                        <v-list-tile-action :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }"
                                            @click="pause"
                        >
                            <v-btn icon>
                                <v-icon>pause</v-icon>
                            </v-btn>
                        </v-list-tile-action>

                        <v-list-tile-action :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }">
                            <v-btn icon>
                                <v-icon>fast_forward</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-card>
        </v-bottom-sheet>
    </v-app>
</template>

<script>
    import axios from 'axios'
  export default {
    name: 'App',
    data: () => ({
      drawer: null,
      showPlayer: false,
      menu: [
        {icon: 'folder', text: 'Files', link: 'media'},
        {icon: 'cloud_download', text: 'Download', link: 'download'},
        {icon: 'tv', text: 'Media Player', link: 'player'},
      ],
    }),
    props: {
      source: String
    },
    methods: {
      pause() {
        axios.pause()

      }
    }
  }
</script>