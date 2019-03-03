<template>
    <div>
        <topheader></topheader>
        <el-container>
          <el-main class="font22" v-loading="mainLoading">
            <ul class="main_ul">
              <li v-for="(item, index) in homedata" :key="index" class="mt10 li_box text-left">
                <div class="contentBox"  @click="lookArticle(item)">
                  <div class="font24">{{item.title}}</div>
                  <div class="font16 mt15 ml5">
                    <span>{{item.username}}</span>
                    <span>{{item.commitTime.split('T')[0]+' '+item.commitTime.split('T')[1].split('Z')[0].split('.')[0]}}</span>
                  </div>
                  <div class="mt10 font18">
                    <span>附件：</span>
                    <span>{{item.fileLocation ? item.fileLocation.split('\\')[1] : "无"}}</span>
                  </div>
                </div>
              </li>
              <div  class="mt20 loadingPic">
                <span v-loading="addloading"></span>
                <span v-show="refreWWW" class="clickfresh" @click="refreshAdd()">{{refreshword}}</span>
              </div>
            </ul>
          </el-main>
          <el-aside class="main-right">
            <div class="aside-notice aside mt5">
              <i class="icon iconfont icon-gonggao iconfont25"></i>
              <div class="clear font14 mt10 annoMain">
                <p style="margin-bottom: 5px;">
                  {{NowAnnounce.announce}}
                </p>
                <div class="float-l" @click="lookMore">查看更多</div>
              </div>
            </div>
            <div class="aside-hotRank aside mt5">
              <i class="icon iconfont icon-hot iconfont32">
              </i>
              <div class="clear font14 mt5" v-loading="hotBookLoading">
                <div v-for="item in hotBookRank">
                  <div v-for="(item2) in item" class="float-l ml15 mt5 aside-hotRankBookDiv" @click="lookArticle(item2)">
                    {{item2.title}}
                  </div>
                </div>
              </div>
            </div>
            <div class="aside-newRank aside mt5">
              <i class="icon iconfont icon-iconfontzhizuobiaozhun023113 iconfont32">
              </i>
              <div class="clear font14 mt5" v-loading="newBookLoading">
                <div v-for="item in newBookRank">
                  <div v-for="(item2) in item" class="float-l ml15 mt5 aside-NewRankBookDiv" @click="lookArticle(item2)">
                    {{item2.title}}
                  </div>
                </div>
              </div>
            </div>
          </el-aside>
        </el-container>
    </div>
</template>
<script>
import topheader from '../components/common/topheader'
export default {
  name: 'Home',
  data () {
    return {
      homedata: [],
      page: 1,
      totalNum: 0,
      addloading: false,
      refreshword: '点击刷新',
      mainLoading: false,
      hotBookLoading: false, // 热门书籍加载loading
      newBookLoading: false, // 新书籍加载loading
      refreWWW: true,
      hotBookRank: [], // 保存热门书籍
      newBookRank: [], // 保存新书籍推荐
      NowAnnounce: ''
    }
  },
  components: {
    topheader
  },
  methods: {
    lookMore () {
      this.$notify({
        title: '公告',
        dangerouslyUseHTMLString: true,
        message: 
          `
          <div>
            ${this.NowAnnounce.announce}
          </div>
          <div class="float-r">${this.NowAnnounce.form}</div>
          <div class="float-r clear">${this.NowAnnounce.commitTime.split('T')[0]}</div>
          `,
        duration: 0
      });
    },
    refreshAdd () {
      if ((this.page) * 10 <= this.totalNum) {
        this.page = this.page + 1
        this.addloading = true
        this.refreWWW = false
        this.getData(this.page)
      } else {
        this.refreshword = '没有更多'
      }
    },
    //  查看文章
    lookArticle (item) {
      var bookusername = item.username
      var booktitle = item.title
      window.open(`/lookArticle?bookusername=${bookusername}&booktitle=${booktitle}&ls=false`)
    },
    getData (page) {
      this.mainLoading = true
      this.$http.post('/api/main/findAllBook', {
        params: {
          nowpage: page
        }
      }).then((res) => {
        var json = res.data
        if (json.code !== '0') {
          return Promise.reject(json.msg)
        } else {
          this.mainLoading = false
          var jsondata = json.data
          this.totalNum = jsondata.Total
          for (let i = 0; i < jsondata.data.length; i++) {
            this.homedata.push(jsondata.data[i])
          }
          this.addloading = false
          this.refreWWW = true
        }
      }).catch((err) => {
        this.mainLoading = false
        this.$message.error(err)
      })
    },
    // 获取热门书籍
    getHotBook () {
      this.hotBookLoading = true
      this.$http.get('/api/hotNewBook/getHotBook')
        .then((res) => {
          var json = res.data
          if (json.code !== '0') {
            return Promise.reject(json.msg)
          } else {
            this.hotBookRank = json.data
            this.hotBookLoading = false
          }
        })
        .catch((err) => {
          this.hotBookLoading = false
          console.log(err)
        })
    },
    getNewBook () {
      this.newBookLoading = true
      this.$http.get('/api/hotNewBook/getNewBook')
        .then((res) => {
          var json = res.data
          if (json.code !== '0') {
            return Promise.reject(json.msg)
          } else {
            this.newBookRank = json.data
            this.newBookLoading = false
          }
        })
        .catch((err) => {
          this.newBookLoading = false
          console.log(err)
        })
    },
    getNowA () {
      this.$http.get('/api/userCenter/nowAnnounce')
        .then((res) => {
          var json = res.data
          if (json.code !== '0') {
            return Promise.reject(json.msg)
          } else {
            this.NowAnnounce = json.data.anno[0]
          }
        })
        .catch((err) => {
          this.$message.error(err)
        })
    }
  },
  mounted () {
    this.getData(1)
    this.getHotBook()
    this.getNewBook()
    this.getNowA()
  }
}
</script>
<style lang="scss">
  .annoMain {
    width: 90%;
    height: 1.5rem;
    p {
      position: relative;
      line-height: 20px;
      max-height: 100px;
      overflow: hidden;
    }
    div {
      background: rgb(175, 175, 221);
    &:hover {
      cursor: pointer;
    }
    }
  }
  .li_box {
    height: 1.2rem;
    border-bottom: 1px solid rgb(128, 128, 128);
    .contentBox {
      width: 60%;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .el-container {
    top: 0.65rem;
    width: 80%;
    position: relative;
    height: auto;
    z-index: 1
  }
  .el-main {
    height: auto;
  }
  .el-aside {
    left: 80%;
    height: 100vh;
    border-left: 1px solid gray;
    position: fixed;
  }
  .aside {
    i {
      float: left;
    }
    .clear {
      clear: both;
    }
  }
  .aside-notice {
    width: 100%;
    height:1.6rem;
  }
  .aside-hotRank {
    width: 100%;
    height:1.8rem;
    background-color: rgba(245, 200, 200, 0.3);
  }
  .aside-newRank {
    width: 100%;
    height:1.8rem;
    background-color: rgba(221, 241, 235, 0.3);
  }
  .aside-hotRankBookDiv {
    background: rgba(190, 213, 214, 0.1);
    border: 1px solid blanchedalmond;
    border-radius: 1px;
    &:hover {
      cursor: pointer;
    }
  }
  .aside-NewRankBookDiv {
    background: rgba(150, 132, 138, 0.1);
    border: 1px solid blanchedalmond;
    border-radius: 1px;
    &:hover {
      cursor: pointer;
    }
  }
  ul {
    list-style: none;
  }
  .loadingPic {
    height: 0.25rem;
  }
  .clickfresh {
    color: blue;
    &:hover {
      cursor: pointer;
    }
  }
</style>
