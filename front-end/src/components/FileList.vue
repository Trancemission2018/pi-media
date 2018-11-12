<template>
    <div>

        <v-list two-line>
            <v-list-tile
                    @click="selectFolder(parent)"
            >

                <v-list-tile-content>
                    <v-list-tile-title v-html="parent"></v-list-tile-title>
                    <v-list-tile-sub-title></v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
                    v-for="folder in folders"
                    :key="folder.name"
                    @click="selectFolder(folder)"
            >

                <v-list-tile-content>
                    <v-list-tile-title v-html="folder.name"></v-list-tile-title>
                    <v-list-tile-sub-title></v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
        <v-list two-line>
            <v-list-tile
                    v-for="file in files"
                    :key="file.name"
                    @click=""
            >

                <v-list-tile-content>
                    <v-list-tile-title v-html="file.name"></v-list-tile-title>
                    <v-list-tile-sub-title></v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>


        <pre>
            {{ folders }}
        </pre>
    </div>

</template>

<script>

  import axios from 'axios'

  const apiBase = 'http://localhost:9001'

  export default {
    name: "file-list",
    components: {},
    props: ['path'],
    data() {
      return {
        currentPath: null,
        parent: '',
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
          this.parent = response.data.parent
          this.folders = response.data.folders
          this.files = response.data.files
        })
      },
      selectFolder(folder) {
        this.loadPath(folder.fullPath)

      }
    }
  }
</script>

<style scoped>

</style>