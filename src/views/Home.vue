<template>
    <div>
        <topheader></topheader>
        <el-container>
          <el-main class="font22" v-loading="mainLoading">
            <ul class="main_ul">
              <li v-for="(item, index) in homedata" @click="lookArticle(item)" :key="index" class="mt10 li_box text-left">
                <div class="contentBox">
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
            <div class="aside-notice mt15">
              <span class="font18">欢迎来到分享图书馆</span>
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
      refreWWW: true
    }
  },
  components: {
    topheader
  },
  methods: {
    refreshAdd () {
      if ((this.page)*10 <= this.totalNum) {
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
    }
  },
  mounted () {
    this.getData(1)
  }
}
</script>
<style lang="scss">
  .li_box {
    height: 1.2rem;
    border-bottom: 1px solid gray;
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
  .aside-notice {
    width: 100%;
    height:4rem;
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
