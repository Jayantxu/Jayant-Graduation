<template>
    <div>
        <topheader></topheader>
        <div class="EditorClass">
          <editor :fathergetFile="getFile" :fatherTitle="gettitle" :fathercontent="getcontent" :fatherLoca="getLoca"></editor>
        </div>
    </div>
</template>
<script>
import topheader from '../components/common/topheader'
import editor from '../components/common/editor'
export default {
  name: 'writeNewComment',
  data () {
    return {
      gettitle: '',
      getcontent: '',
      getLoca: '',
      getFile: false
    }
  },
  methods: {
    secondEdit (bookusername, booktitle) {
      this.$http.post('/api/aboutbook/getPersonOneBook', {
        params: {
          username: this.$store.state.DLusername,
          bookusername: bookusername,
          booktitle: booktitle
        }
      }).then((res) => {
        var json = res.data
        var jsondata = json.data.data[0]
        if (json.code !== '0') {
          return Promise.reject(json.msg)
        } else {
          this.gettitle = jsondata.title // 发布书籍的标题
          this.getcontent = jsondata.content // 发布书籍的内容
          this.getLoca = jsondata.fileLocation // 发布书籍的文件
          this.getFile = true // 是编辑文件的标识
        }
      }).catch((err) => {
        this.$message({
          message: `${err}`,
          type: 'error'
        })
      })
    }
  },
  components: {
    topheader,
    editor
  },
  mounted: function () {
    var canshu = window.location.search.split('?')[1]
    var bookusername = canshu.split('&')[0].split('=')[1]
    var booktitle = canshu.split('&')[1].split('=')[1]
    booktitle = window.decodeURI(booktitle)
    if (booktitle && bookusername) {
      var DLusername = this.$store.state.DLusername
      if (bookusername !== DLusername) {
        this.$message.warning('非登录者书籍,无法操作')
      } else {
        this.secondEdit(bookusername, booktitle)
      }
    } else {
      console.log('无用户编辑操作')
    }
  }
}
</script>
<style>
  .EditorClass {
    font-size: 16px;
    top: 1rem;
    width: 100%;
    position: fixed;
    z-index:0
  }
</style>
