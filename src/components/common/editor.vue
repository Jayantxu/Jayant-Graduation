<template>
    <div class="comment-Edit">
      <el-form :model="ruleEditor" :rules="rules" ref="ruleEditor">
        <el-form-item prop="commentTitle">
          <el-input v-model="ruleEditor.commentTitle" placeholder="请输入标题"></el-input>
        </el-form-item>
        <div ref="editor" style="text-align:left" >
        </div>
      </el-form>
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
          <el-button type="primary" @click="commintEditor()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import E from 'wangeditor'
export default {
  name: 'editor',
  data () {
    return {
      editorObj: '',
      editorContenthtml: '',
      clearDialog: false,
      commitDialog: false,
      ruleEditor: {
        commentTitle: ''
      },
      rules: {
        commentTitle: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
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
    commintEditor: function () {
      // 提交内容并且发送给后台
      this.$http.post('/api/article/commitNewArticle', {
        params: {
          articleTitle: this.ruleEditor.commentTitle,
          articleContent: this.editorContenthtml
        }
      })
        .then((res) => {
          var json = res.data
          if (json.code !== '0') {
            return Promise.reject(json.msg)
          } else {
            console.log(res)
          }
        })
        .catch((err) => {
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
