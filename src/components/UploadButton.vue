<template>
<div>
  <div
    class="upload-btn"
  >
  
    <input
      :id="`${name}`"
      ref="uploadFile"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      @change="fileChanged"
    >
    <label
      :id="`label${name + ''}`"
      v-ripple="ripple"
      :for="`${name}`"
      :class="`v-btn ${classes}${color} ${labelClass} upload-btn`"
      :style="{ maxWidth, width: fixedWidth || 'auto' }"
    >
      <div class="v-btn__content" style="max-width: 100%">
        <slot name="icon-left" />
        <span>
          {{ icon ? '' : noTitleUpdate ? title : uTitle || title }}
        </span>
        <slot name="icon" />
      </div>
      
    </label>
  </div>
  <div class="v-btn upload-btn error" style="max-width: 100%" @click="clear">
        <v-icon left>remove</v-icon>
        <span>
          clear
        </span>
  </div>
</div>
  
  
</template>
<script>
/* eslint-disable */
import Swal from 'sweetalert2/dist/sweetalert2.js';
export default {
  name: 'UploadBtn',
  props: {
    accept: {
      default: '*',
      type: String
    },
    block: {
      default: false,
      type: Boolean
    },
    depressed: {
      default: false,
      type: Boolean
    },
    color: {
      default: 'primary',
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    },
    fixedWidth: {
      default: null,
      type: String
    },
    flat: {
      default: false,
      type: Boolean
    },
    hover: {
      default: true,
      type: Boolean
    },
    icon: {
      default: false,
      type: Boolean
    },
    labelClass: {
      default: '',
      type: String
    },
    large: {
      default: false,
      type: Boolean
    },
    loading: {
      default: false,
      type: Boolean
    },
    maxWidth: {
      default: '100%',
      type: String
    },
    multiple: {
      default: false,
      type: Boolean
    },
    name: {
      default: 'uploadFile',
      type: String
    },
    parentFieldName: {
      default: 'uploadFile',
      type: String
    },
    outline: {
      default: false,
      type: Boolean
    },
    ripple: {
      default: true,
      type: Boolean
    },
    round: {
      default: false,
      type: Boolean
    },
    small: {
      default: false,
      type: Boolean
    },
    size: {
      default: 1024,
      type: Number
    },
    title: {
      default: 'Upload',
      type: String
    },
    noTitleUpdate: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      uTitle: null
    }
  },
  computed: {
    classes() {
      const classes = {
        'v-btn--block': this.block,
        'v-btn--flat': this.flat,
        'upload-btn-hover': this.hover,
        'v-btn--icon': this.icon,
        'v-btn--large': this.large,
        'v-btn--loading': this.loading,
        'v-btn--outline v-btn--depressed': this.outline,
        'v-btn--round': this.round,
        'v-btn--small': this.small,
        'v-btn--disabled': this.disabled,
        'v-btn--depressed': this.depressed
      }

      // eslint-disable-next-line
      if (this.flat) this.color = ''

      let classString = ''
      for (const key in classes) {
        if (classes[key]) {
          classString += `${key} `
        }
      }
      return classString
    }
  },
  methods: {
    fileChanged(e) {
      if (e) {
        if (e.target.files.length > 0) {
          if (!this.multiple) {
            console.log('XXX>>>>>>>>>>>>>>>>')
            console.log(e.target.files[0])
            console.log(e.target.files[0].size)
            console.log(this.size)
            if (e.target.files[0].size > this.size)
            {
              let fileSize = Number.parseFloat((e.target.files[0].size / 1024 / 1024)).toFixed(2);

              Swal.fire({
                title: `<strong>Upload error</strong>`,
                type: 'error',
                html: 'Selected file has <b class="error">' + (fileSize) + ' Mb</b>. Allowed: <b class="error">' + (this.size / 1024 / 1024) + ' Mb</b>.',
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText: 'Close',
              });
              return;
            }
            this.uTitle = e.target.files[0].name
            this.$emit('file-update', e.target.files[0], this.parentFieldName)
          } else {
            let title = ''
            for (let i = 0; i < e.target.files.length; i++) {
              title += e.target.files[i].name + ', '
            }
            title = title.slice(0, title.length - 2)
            this.uTitle = title
            this.$emit('file-update', e.target.files, this.parentFieldName)
          }
        } else {
          this.uTitle = null
          this.$emit('file-update', false, this.parentFieldName)
        }
      }
    },
    clear() {
      this.$refs.uploadFile.value = ''
      this.$emit('file-update', false, this.parentFieldName)
      this.uTitle = null
    }
  }
}
</script>

<style scoped>
.upload-btn {
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  float: left
}

.upload-btn input[type='file'] {
  position: absolute;
  height: 0.1px;
  width: 0.1px;
  overflow: hidden;
  opacity: 0;
  z-index: -1;
}

.upload-btn > .v-btn__content > span {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.upload-btn-hover {
  cursor: pointer;
}
</style>
