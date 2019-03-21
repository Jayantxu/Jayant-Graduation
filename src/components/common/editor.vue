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
        <div class="mt10" v-show="hasdownloadFile">
          <span>已上传文件:</span>
          <a :href="downloadUrl" :download="downloadFile">{{filenameD}}</a>
        </div>
      </div>
      <p class="font14 float-l">书籍分类：(限3种)</p>
      <!-- 书籍分类的Tag -->
      <div class="bookTypeTag mt10 mb5">
        <div class="float-l vw30">
          <el-select style="width:70%;"  v-model="chooseBooktype" multiple :multiple-limit="BookTypeNum" placeholder="请选择">
            <el-option
              v-for="item in bookTypeState"
              :key="item.typeID"
              :label="item.type"
              :value="item.typeID">
            </el-option>
          </el-select>
        </div>
        <div class="float-l vw30">
          <el-input v-model="chooseBooktype2" placeholder="输入自定分类（、）分隔"></el-input>
        </div>
      </div>
      <div class="mt10 btn-l20">
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
import getBookType from '../../assets/JS/getBookType'
export default {
  name: 'editor',
  components: {
  },
  props: ['fatherTitle', 'fathercontent', 'fatherLoca', 'fathergetFile'],
  watch: {
    'fatherTitle': function () {
      this.ruleEditor.commentTitle = this.fatherTitle
    },
    'fathercontent': function () {
      console.log(this.fathercontent)
      this.editorObj.txt.html(this.fathercontent)
    },
    'fatherLoca': function () {
      if (this.fatherLoca) {
        this.filenameD = this.fatherLoca.split('\\')[1]
        this.hasdownloadFile = true
        this.downloadFile = this.filenameD
        this.downloadUrl = `http://localhost:3000/api/download/File?fileName=${this.filenameD}`
      } else {
        this.hasdownloadFile = false
      }
    },
    'fathergetFile': function () {
      this.getFile = this.fathergetFile
    },
    'chooseBooktype': function () {
      // 下拉框的逻辑-满了三个不可选，如果键盘输入了三个，则option中不可选
      if (this.chooseBooktype2array.length + this.chooseBooktype.length >= 4) {
        this.$message.error('不可高于三种书籍分类')
      }
    },
    'chooseBooktype2': function () {
      this.chooseBooktype2array = this.chooseBooktype2.split('、')
      if (this.chooseBooktype2array.length + this.chooseBooktype.length >= 4) {
        this.$message.error('不可高于三种书籍分类')
      }
    },
  },
  data () {
    return {
      getFile: false,
      // store中的type
      bookTypeState: [],
      // 下拉框选择的书籍type
      chooseBooktype: [],
      BookTypeNum: 3,
      // 输入的书籍type
      chooseBooktype2: '',
      chooseBooktype2array: [],
      hasdownloadFile: false,
      filenameD: '',
      downloadUrl: '',
      downloadFile: '',
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
      if (this.chooseBooktype2array.length + this.chooseBooktype.length >= 4) {
        this.$message.error('书籍分类不可超过三种')
        return false
      }
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
      const isJPG = fileType === 'jpg'
      const iswordx = fileType === 'docx'
      const isword = fileType === 'doc'
      const ispdf = fileType === 'pdf'
      const ispng = fileType === 'png'
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isJPG && !isword && !ispdf && !iswordx && !ispng) {
        this.$message.error('上传只能是 jpg、png、doc、pdf 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return (isJPG || isword || ispdf || iswordx || ispng) && isLt5M
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
      if (this.getFile) {
        formData.append('second', true)
      }
      if (!this.getFile) {
        formData.append('second', false)
      }
      if (this.hasdownloadFile) {
        // 记录原始旧文件
        formData.append('oldFile', this.fatherLoca)
      }
      formData.append('articleTitle', this.ruleEditor.commentTitle)
      formData.append('articleContent', this.editorContenthtml)
      formData.append('username', this.$store.state.DLusername)
      formData.append('bookType1', this.chooseBooktype)
      formData.append('bookType2', this.chooseBooktype2array)
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
    // editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片
    // editor.customConfig.uploadImgServer = '/upload'上传图片到服务器
    // 隐藏“网络图片”tab
    editor.customConfig.showLinkImg = false
    editor.customConfig.zIndex = 0
    this.editorObj.create()
    // editor.txt.html('记录您的新书评...')
    getBookType.getBookTypeFun(this)
    // 获取store中的booktype
    this.bookTypeState = this.$store.state.bookType
  }
}
</script>
<style scoped lang="scss">
  .bookTypeTag {
    height: 0.5rem;
    width: 100%;
  }
</style>
