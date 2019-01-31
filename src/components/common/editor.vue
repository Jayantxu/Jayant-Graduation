<template>
    <div class="comment-Edit" v-loading="uploading">
      <el-form :model="ruleEditor" :rules="rules" ref="ruleEditor">
        <el-form-item prop="commentTitle">
          <el-input v-model="ruleEditor.commentTitle" placeholder="请输入标题"></el-input>
        </el-form-item>
        <div ref="editor" style="text-align:left" >
        </div>
      </el-form>
      <div class="mt20 ml20 vw20">
        <el-upload class="upload-demo" ref="upload" action=""
          :with-credentials="true"
          :on-error="handleError"
          :limit="1"
          :before-upload="beforeAvatarUpload"
          :file-list="fileList"
          :http-request="commintEditor"
          :on-exceed="uploadExceed"
          :on-change="uploadChange"
          :on-remove="uploadRemove"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
          <div slot="tip" class="el-upload__tip">只能上传jpg、pdf、doc文件，且不超过5MB</div>
        </el-upload>
      </div>
      <div class="mt15 btn-l20">
        <el-button type="warning" round @click="clearDialog = true">重置编辑框</el-button>
        <el-button type="primary" round  @click="commitContent('ruleEditor')">提交</el-button>
      </div>
      <!-- 清空的提示框 -->
      <el-dialog title="警告" :visible.sync="clearDialog" width="30%" class="editor-dialog3">
        <span>警告，此操作将会清空您的编辑操作，且不可逆!</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clearDialog = false">取 消</el-button>
          <el-button type="primary" @click="clearEditor()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 提交编辑的提示框 -->
      <el-dialog title="提示" :visible.sync="commitDialog" width="30%" class="editor-dialog3">
        <span>确认提交您的编辑内容</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="commitDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitUpload">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import E from 'wangeditor'
export default {
  name: 'editor',
  components: {
  },
  data () {
    return {
      uploading: false,
      editorObj: '',
      editorContenthtml: '',
      clearDialog: false,
      commitDialog: false,
      ruleEditor: {
        commentTitle: ''
      },
      // 是否有文件在列表
      hasFile: false,
      rules: {
        commentTitle: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ]
      },
      fileList: [
      ]
    }
  },
  methods: {
    /*  以下上传文件相关  */
    submitUpload () {
      if (this.hasFile) {
        this.$refs.upload.submit()
      } else {
        this.commintEditor(false)
      }
    },
    // 文件添加改变时的-用于标记变量
    uploadChange (file, fileList) {
      this.hasFile = !this.hasFile
      // console.log(fileList.length)
      // console.log(this.hasFile)
    },
    // 文件移除改变时的-用于标记变量
    uploadRemove (file, fileList) {
      this.hasFile = !this.hasFile
      // console.log(fileList.length)
      // console.log(this.hasFile)
    },
    handleError (file) {
      this.$message.error('上传失败')
    },
    uploadExceed (files, fileList) {
      this.$message.error('只允许上传一个文件，无法添加')
    },
    beforeAvatarUpload (file) {
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      console.log(fileType)
      const isJPG = fileType === 'image/jpeg'
      const iswordx = fileType === 'docx'
      const isword = fileType === 'doc'
      const ispdf = fileType === 'pdf'
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isJPG && !isword && !ispdf && !iswordx) {
        this.$message.error('上传只能是 JPG、doc、pdf 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return (isJPG || isword || ispdf || iswordx) && isLt5M
    },
    /*  以上上传文件相关  */
    clearEditor: function () {
      // 给弹框提示： 清空谨慎
      this.editorObj.txt.clear()
      this.clearDialog = false
      console.log('清空编辑框')
    },
    commitContent: function (ruleEditor) {
      this.$refs[ruleEditor].validate((valid) => {
        if (valid) {
          this.commitDialog = true
        } else {
          this.$message.error('编辑框错误')
          return false
        }
      })
    },
    commintEditor: function (params) {
      // 提交内容并且发送给后台
      var formData = new FormData()
      this.uploading = true
      if (params) {
        const _file = params.file
        formData.append('file', _file)
      }
      formData.append('articleTitle', this.ruleEditor.commentTitle)
      formData.append('articleContent', this.editorContenthtml)
      formData.append('username', this.$store.state.DLusername)
      console.log(formData.get('uploadData'))
      // 配置header
      var config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      // 注意formData添加的不是挂载在实例上的
      // console.log(formData.get('file'))
      this.$http.post('/api/article/commitNewArticle', formData, config)
        .then((res) => {
          var json = res.data
          this.uploading = false
          if (json.code !== '0') {
            return Promise.reject(json.msg)
          } else {
            this.$message({
              message: `恭喜，${res.data.msg}`,
              type: 'success'
            })
            setTimeout(function () {
              location.href = '/'
            }, 2000)
          }
        })
        .catch((err) => {
          this.uploading = false
          this.$message({
            message: err,
            type: 'error'
          })
        })
      this.commitDialog = false
    }
  },
  mounted () {
    this.editorObj = new E(this.$refs.editor)
    var editor = this.editorObj
    editor.customConfig.onchange = (html) => {
      this.editorContenthtml = html
    }
    // 关闭粘贴样式的过滤
    // editor.customConfig.pasteFilterStyle = false
    // 忽略粘贴内容中的图片
    // editor.customConfig.pasteIgnoreImg = true
    // 自定义处理粘贴的文本内容
    // editor.customConfig.pasteTextHandle = function (content) {
    //     // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
    //     return content + '<p>在粘贴内容后面追加一行</p>'
    // }
    // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
    editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片
    // editor.customConfig.uploadImgServer = '/upload'上传图片到服务器
    // 隐藏“网络图片”tab
    editor.customConfig.showLinkImg = false
    editor.customConfig.zIndex = 0
    this.editorObj.create()
    // editor.txt.html('记录您的新书评...')
  }
}
</script>
<style scoped lang="scss">
</style>
