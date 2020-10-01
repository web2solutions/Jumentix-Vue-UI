<template>
  <div>
    <h3 class="subheading" v-if="!hideLabel">File Upload</h3>
    <v-list v-if="mediaList">
      <v-list-tile v-for="(item,i) in mediaList" :key="i">
        <v-list-tile-avatar @click="onItemClick(item.url)">
          <img :src="item.url" :alt="item.name" :title="item.name">
        </v-list-tile-avatar>
        <v-list-tile-content @click="onItemClick(item.url)">
          <v-list-tile-title>{{item.contentType}}</v-list-tile-title>
          <v-list-tile-sub-title>{{item.name}}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon @click.native="deleteFile(item.id)" :disabled="$store.state.mediaDeleting">
            <v-icon class="red--text text--lighten-1">delete</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-progress-linear class="ma-0" :active="isActive" :indeterminate="true"></v-progress-linear>
    <v-layout row v-if="(!multiple && !mediaList) || multiple">
      <v-text-field
        prepend-icon="attach_file"
        single-line
        name="uploadfile"
        :value="filename"
        :label="label"
        :disabled="disabled"
        :required="required"
        @click.native="onFocus"
        ref="fileTextField"
      ></v-text-field>
      <input
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        ref="fileInput"
        @change="onFileChange"
      >

      <v-btn
        icon
        class="primary--text mt-4"
        :disabled="!filename"
        @click.stop="fileUpload"
        :loading="uploading"
      >
        <v-icon>{{ iconUpload }}</v-icon>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'upload-container',
  props: {
    accept: {
      type: String,
      default: '*'
    },
    label: {
      type: String,
      default: 'Select a file'
    },
    disabled: Boolean,
    multiple: Boolean,
    required: Boolean,
    media: Array | Object,
    deletingFile: Boolean | Object,
    hideLabel: Boolean
  },
  data () {
    return {
      filename: '',
      forms: [],
      uploading: false,
      iconUpload: 'file_upload'
    };
  },
  computed: {
    isActive () {
      return this.$store.state.mediaDeleting || this.uploading;
    },
    mediaList () {
      if (!this.media) return null;
      if (this.media.constructor === Object) {
        return [this.media];
      }
      const filter = this.media && this.media.filter(e => e);
      return filter.length ? filter : null;
    }
  },
  methods: {
    onItemClick (url) {
      window.open(url, '_blank');
    },
    async deleteFile (fileId) {
      this.$emit('deleted', fileId);
    },
    async fileUpload () {
      const endpoint = `#${
        process.env.GRAPH_FILE_API
      }`;
      if (this.forms.length) {
        let self = this;
        this.uploading = true;
        // console.log('this.uploading 1', this.uploading);
        const results = [];
        /* for (const form of this.forms) {
          const response = await fetch(endpoint, {
            method: 'POST',
            body: form
          });
          const responseData = await response.json();
          results.push(responseData); 
        } */
        setTimeout(function () { 
          self.uploading = false;
          self.iconUpload = 'check';
        }, 3000);
        
        const responseData = [{ name: this.filename }];
        results.push(responseData); 

        // this.uploading = false;
        this.forms = [];
        // this.filename = '';
        const data = results.length === 1 ? results[0] : results;
        if (results.length) {
          this.$emit('uploaded', data);
        }
      }
    },
    getFormData (files) {
      const forms = [];
      for (const file of files) {
        const form = new FormData();
        form.append('data', file, file.name);
        forms.push(form);
      }
      return forms;
    },
    onFocus () {
      if (!this.disabled) {
        this.$refs.fileInput.click();
      }
    },
    onFileChange ($event) {
      const files = $event.target.files || $event.dataTransfer.files;
      let filename;
      if (files) {
        if (files.length > 0) {
          filename = [...files].map(file => file.name).join(', ');
        }
      } else {
        filename = $event.target.value.split('\\').pop();
      }
      this.iconUpload = 'file_upload';
      this.$refs.fileTextField.inputValue = filename;
      this.filename = filename;
      this.forms = this.getFormData(files);
    }
  }
};
</script>

<style scoped>
input[type="file"] {
  position: absolute;
  left: -99999px;
}
</style>
