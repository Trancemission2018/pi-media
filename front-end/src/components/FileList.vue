<template>
    <v-container>
        <v-list>
            <v-list-tile
                    @click="goBack"
            >

                <v-list-tile-content>
                    <v-list-tile-title v-html="">
                        <v-icon>arrow_back</v-icon>
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

        <div class="scrollList" style="max-height: 250px;">
            <v-list>

                <v-list-tile
                        v-for="folder in folders"
                        :key="folder.name"
                        @click="selectFolder(folder)"
                        avatar
                >

                    <v-list-tile-avatar>
                        <v-icon>folder</v-icon>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title v-html="folder.name"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </div>

        <v-list v-if="files.length > 0">
            <v-list-tile
                    v-for="file in files"
                    :key="file.name"
                    @click="selectFile(file)"
                    avatar
            >

                <v-list-tile-avatar>
                    <v-icon>play_arrow</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title v-html="file.name"></v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>

        <v-dialog
                v-model="selectDestination"
                max-width="290"
                light
        >
            <div
                    color="white"
            >

                <v-layout row align-center text-xs-center

                          class="pa-3"
                >
                    <v-flex xs6>
                        <v-btn @click="playFile()">
                            <v-icon class="mr-2">tv</v-icon>
                            Pi
                        </v-btn>
                    </v-flex>
                    <v-flex xs6>
                        <v-btn @click="streamFile()">
                            <v-icon>smartphone</v-icon>
                            Device
                        </v-btn>
                    </v-flex>
                </v-layout>
            </div>
        </v-dialog>

    </v-container>

</template>

<script>

  export default {
    name: "file-list",
    components: {},
    props: ['path'],
    data() {
      return {
        currentPath: null,
        pathHistory: ['/'],
        folders: [],
        files: [],
        selectDestination: false,
        selectedFile: null
      }
    },
    created() {

      this.loadPath()

    },
    methods: {
      loadPath(folder) {
        let pathLink = ''
        if (folder) {
          pathLink = `?folder=${folder}`
        }
        this.$piApi.get(`/files${pathLink}`).then(response => {
          console.log(response.data)
          this.folders = response.data.folders
          this.files = response.data.files
        })
      },
      selectFolder(folder, addToHistory = true) {
        console.log('Selected folder', folder)
        this.loadPath(folder.fullPath)
        if (addToHistory === true) {
          this.pathHistory.push(folder.fullPath)
        }

      },
      goBack() {

        this.pathHistory.pop()
        this.selectFolder({fullPath: this.pathHistory[this.pathHistory.length - 1]}, false)
        console.log('Going to,', this.pathHistory[this.pathHistory.length - 1])
      },
      playFile() {
        let filePath = Buffer.from(this.pathHistory[this.pathHistory.length - 1] + '/' + this.selectedFile.name).toString('base64')
        if (this.pathHistory.length === 1) {
          filePath = Buffer.from('/data/media/' + this.pathHistory[this.pathHistory.length - 1] + '/' + this.selectedFile.name).toString('base64')
        }
        this.$piApi.get(`/play/${filePath}`).then(response => {
          console.log('Playing', this.selectedFile.name)
          this.$store.dispatch('setTitle', this.selectedFile.name)
          this.$store.dispatch('setPlaying')
          console.log(response.data)
        })
      },
      streamFile() {
        let filePath = Buffer.from(this.pathHistory[this.pathHistory.length - 1] + '/' + this.selectedFile.name).toString('base64')
        if (this.pathHistory.length === 1) {
          filePath = Buffer.from('/data/media/' + this.pathHistory[this.pathHistory.length - 1] + '/' + this.selectedFile.name).toString('base64')
        }
        this.$router.push(`/player/${filePath}`)
      },
      selectFile(file) {
        this.selectDestination = true
        this.selectedFile = file
      }

    }
  }
</script>

<style scoped>

    .scrollList {
        display: block;
        overflow: scroll;
    }

</style>