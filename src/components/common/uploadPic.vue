<template>
  <div>
    <el-upload
      class="upload-demo"
      action=""
      :file-list="fileList"
      :limit="1"
      :on-exceed="PicExceed"
      :on-change="PicChange"
      :on-remove="PicRemove"
      :before-upload="beforePicUpload"
      :http-request="PicRequest"
      list-type="picture">
      <el-button size="small" type="primary">选择封面,等待上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileList: [
        ],  // 文件列表
        file: '', // 文件
        hasFile: false // 标识
      };
    },
    methods: {
      // 超出限制的方法
      PicExceed: function () {
        this.$message.error('一次只能上传一张封面')
      },
      // 文件状态改变时的钩子
      PicChange: function (file, fileList) {
        if (fileList.length !== 0) {
          this.fileList = fileList
          this.hasFile = true
          this.file = file
        }
      },
      // 文件移除时的钩子
      PicRemove: function (file, fileList) {
        if (fileList.length === 0) {
          this.fileList = []
          this.hasFile = false
          this.file = ''
        }
        this.PicRequest()
      },
      // 上传的方法
      PicRequest: function (params) {
        // 与父组件通信
        this.$emit('sendPicFile', this.hasFile, this.file.raw)
      },
      // 上传前的校验
      beforePicUpload: function (file) {
        var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
        const isJPG = fileType === 'jpg'
        const ispng = fileType === 'png'
        const isLt500 = file.size/1024 < 500
        if (!isJPG && !ispng) {
          this.$message.error('上传格式只能为 jpg、png!')
        }
        if (!isLt500) {
          this.$message.error('上传封面大小不能超过 500kb!')
        }
        return (isJPG || ispng) && isLt500
      }
    }
  }
</script>
<style lang="scss">
</style>
