<template>
    <div>

        <v-list>
            <v-list-tile
                    @click="goBack()"
            >

                <v-list-tile-content>
                    <v-list-tile-title v-html="">UP</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
                    v-for="folder in folders"
                    :key="folder.name"
                    @click="selectFolder(folder)"
            >

                <v-list-tile-content>
                    <v-list-tile-title v-html="folder.name"></v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
        <v-list>
            <v-list-tile
                    v-for="file in files"
                    :key="file.name"
                    @click="playFile(file)"
            >
                <v-list-tile-content>
                    <v-list-tile-title v-html="file.name"></v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </div>

</template>

<script>

  import axios from 'axios'

  const apiBase = 'http://192.168.0.10:9001'

  export default {
    name: "file-list",
    components: {},
    props: ['path'],
    data() {
      return {
        currentPath: null,
        pathHistory: ['/'],
        folders: [],
        files: []
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
        axios.get(`${apiBase}/files${pathLink}`).then(response => {
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
      playFile(file) {
        let filePath = Buffer.from(this.pathHistory[this.pathHistory.length - 1] + '/' + file.name).toString('base64')
        axios.get(`${apiBase}/play/${filePath}`).then(response => {
          console.log(response.data)
        })
      }
    }
  }
</script>

<style scoped>

</style>