<template>
    <div>

        <div>
            {{ cleanName }}
        </div>

        <v-layout row align-center class="mb-2">
            <v-flex xs1 @click="goBack()">
                <v-icon v-if="pathHistory.length !== 1">arrow_back</v-icon>
            </v-flex>
            <v-flex xs7>
                {{ currentFolder }}
            </v-flex>
            <v-flex xs4 text-xs-right>
                <v-btn small @click="newFolder">New Folder</v-btn>
            </v-flex>
        </v-layout>

        <div class="folderList" style="max-height: 250px;">
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
        <v-layout row wrap align-center text-xs-center class="pt-2">
            <v-flex xs6 class="pa-2">
                <v-btn small color="grey" block @click="$emit('cancel')">Cancel</v-btn>
            </v-flex>
            <v-flex xs6 class="pa-2">
                <v-btn small color="teal" block @click="$emit('startDownload', currentPath)">Download</v-btn>
            </v-flex>

        </v-layout>
    </div>

</template>

<script>

  import axios from 'axios'

  // const apiBase = 'http://192.168.0.10:9001'
  const apiBase = 'http://10.0.0.165:9001'

  const piApi = axios.create({
    baseURL: apiBase
  })

  export default {
    name: "folder-select",
    components: {},
    props: ['path', 'torrent'],
    data() {
      return {
        currentPath: '/',
        pathHistory: ['/'],
        folders: [],
        files: [],
        displayHistory: []
      }
    },
    computed: {
      displayPath() {
        return this.currentPath.match(/([^\/]*)\/*$/)[1]
      },
      cleanName() {
        return this.torrent.name.replace(/\./g, ' ')
      },
      currentFolder() {

        if (this.pathHistory.length === 1) {
          return 'Select Folder'
        } else {
          let parts = this.currentPath.split('/')
          return parts[parts.length - 1]
        }

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
        piApi.get(`/files${pathLink}`).then(response => {
          this.folders = response.data.folders
          this.files = response.data.files
        })
      },
      selectFolder(folder, addToHistory = true) {
        console.log('Selected folder', folder)
        this.loadPath(folder.fullPath)
        if (addToHistory === true) {
          this.pathHistory.push(folder.fullPath)
          this.currentPath = folder.fullPath
        }

      },
      goBack() {
        this.pathHistory.pop()
        this.selectFolder({fullPath: this.pathHistory[this.pathHistory.length - 1]}, false)
        this.currentPath = this.pathHistory[this.pathHistory.length - 1]
      },
      newFolder() {

        console.log('CurrentPath', this.currentPath)

        let folderName = prompt('Folder name')
        if (folderName) {

          let fullName
          if (this.currentPath !== undefined) {
            fullName = `${this.currentPath}/${folderName}`
          } else {
            fullName = folderName
          }
          console.log('Saving ful', fullName)
          piApi.post('/folder/create', {folder: fullName}).then(response => {
            console.log('Selecting folder', fullName)
            this.loadPath(fullName)
            this.currentPath = fullName
            this.pathHistory.push(fullName)


          }).catch(error => {
            alert('Unable to create folder')
            console.log(error)
          })
        }
      }
    }
  }
</script>

<style scoped>

    .folderList {
        display: block;
        overflow: scroll;
    }

</style>