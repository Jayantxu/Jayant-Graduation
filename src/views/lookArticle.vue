<template>
  <div>
    <topheader></topheader>
    <div class="main">
      <div class="header-title font40">{{gettitle}}</div>
      <div class="header-time mt10 font18">作者：{{getusername}} 发布时间：{{getCommitTime}}</div>
      <div class="header-filename mt10 font16" v-show="fileshow">
        <span>文件：{{getLoca}}</span>
        <a :href="downloadUrl" :download="getLoca">[下载]</a>
      </div>
      <div class="font16">书籍类型:
        <span v-for="item in booktype">
          <i class="bookType">
            {{item}}
          </i>
        </span>
      </div>
      <div class="header-content mt10 font16 text-left" id="contentBorder"></div>
    </div>
  </div>
</template>
<script>
import topheader from '../components/common/topheader'
export default {
  components: {
    topheader
  },
  watch: {
    'getcontent': function () {
      $('#contentBorder').html(this.getcontent)
    }
  },
  data () {
    return {
      gettitle: '',
      getcontent: '',
      getCommitTime: '',
      getusername: '',
      getLoca: '',
      fileshow: false,
      downloadUrl: '',
      booktype: [],
    }
  },
  methods: {
    getOneBookVisit (bookusername, booktitle, TF) {
      this.$http.post('/api/aboutbook/lookPersonOneBook', {
        params: {
          username: this.$store.state.DLusername,
          bookusername: bookusername,
          booktitle: booktitle,
          bookTF: TF
        }
      }).then((res) => {
        var json = res.data
        var jsondata = json.data.data[0]
        if (json.code !== '0') {
          return Promise.reject(json.msg)
        } else {
          this.gettitle = jsondata.title // 发布书籍的标题
          this.getcontent = jsondata.content // 发布书籍的内容
          this.getCommitTime = jsondata.commitTime
          this.getusername = jsondata.username
          // 解析用户书籍的分类
          var bookType = this.$store.state.bookType
          // 书籍真实类型
          var realBookType = jsondata.booktype
          for (let i of bookType) {
            var typeID = i.typeID.toString()
            if (realBookType.indexOf(typeID) !== -1) {
              this.booktype.push(i.type)
            }
          }
          // this.booktype = jsondata.booktype
          if (jsondata.fileLocation) {
            this.fileshow = true
            this.getLoca = jsondata.fileLocation.split('\\')[1]
            this.downloadUrl = `http://localhost:3000/api/download/File?fileName=${this.getLoca}`
          }
        }
      }).catch((err) => {
        this.$message({
          message: `${err}`,
          type: 'error'
        })
      })
    }
  },
  mounted () {
    var canshu = window.location.search.split('?')[1]
    var bookusername = canshu.split('&')[0].split('=')[1]
    var booktitle = canshu.split('&')[1].split('=')[1]
    var TF = canshu.split('&')[2].split('=')[1]
    booktitle = window.decodeURI(booktitle)
    this.getOneBookVisit(bookusername, booktitle, TF)
  }
}
</script>
<style lang="scss">
  .main {
    // font-size: 16px;
    top: 0.8rem;
    left: 10%;
    height: auto;
    position: absolute;
    z-index:0
  }
  .header-title {
    width: 80vw;
    height: 0.7rem;
    // background-color: black;
  }
  .header-time {
    width: 80vw;
    height: 0.4rem;
    // background-color: yellow;
  }
  .header-filename {
    width: 80vw;
    height: 0.4rem;
  }
  .header-content {
    width: 80vw;
    height: 100%;
    border-radius: 0.1rem;
    overflow: auto;
  }
  .bookType {
    height: 15px;
    color: white;
    background-color: rgba(46, 46, 180, 0.555);
    margin-left:3px;
  }
</style>
