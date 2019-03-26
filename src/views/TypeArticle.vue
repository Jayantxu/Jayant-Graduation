<template>
  <div>
    <topheader></topheader>
    <el-container>
      <!-- 主要展示部分 -->
      <el-main class="text-left">
        <div class="float-r font16 hoverClick2" @click='returnAllArticle'>返回查看全部</div>
        <div class="font22">“{{NowType}}”标签书籍内容展示如下：</div>
        <div class="BoolBook" v-if="!NoBookShow">
          <div class="main-book-show mt15" v-loading="BookShowLoading">
            <div class="main-book-item float-l mt20 mr20 text-center hoverClick" v-for="item of bookTypeShow" @click="lookArticle(item.title, item.username)">
              <img style="vertical-align:middle" class="main-book-img" src="../assets/Image/图片无法加载1.jpg" alt=""/>
              <p class="font14 mt5 mb1">{{item.commitTime.split('T')[0]+''+item.commitTime.split('T')[1].split('.')[0]}}</p>
              <p class="font16 mt5 mb1">{{item.title}}</p>
            </div>
          </div>
          <div class="clear"></div>
          <div class="text-center">
            <pagination class="mt40" :parentTotalNum="totalUserNum" @sendNowPageToFather="getNowPagefromChild"></pagination>
          </div>
        </div>
        <div class="BoolBook2" v-if="NoBookShow">
          <div class="bottom-line mt50 float-l"></div>
          <div class="float-l font16 text-center mt50" style="width:40%;">
            <p>没有相关数据</p>
          </div>
          <div class="bottom-line mt50 float-r"></div>
        </div>
      </el-main>
      <!-- 侧边栏部分 -->
      <el-aside>
        <div class="font18 mt5 mb10">所有类别：</div>
        <div class="aside-1 font16" v-for="i of bookType">
          <span class="aside-2-item float-l ml10 mt5 mb5 hoverClick2" :data-index="i.typeID" @click="chooseBookType(i.typeID, i.type, 1)">
            {{i.type}}
          </span>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>
<script>
import topheader from '../components/common/topheader'
import pagination from '../components/common/pagination'
export default {
  data () {
    return {
      bookType: [], // 记录书籍类别
      bookTypeShow: [],
      NowType: '无分类', // 当前类别记录
      NowTypeID: 1, // 当前类别ID
      BookShowLoading: true, // 加载书时候的loading
      nowPage: 1, // 当前页码-初始
      totalUserNum: 0, // 总页码
      NoBookShow: false // 没有书的时候展示
    }
  },
  methods: {
    // 返回查看所有书籍
    returnAllArticle () {
      location.href = '/'
    },
    // 点击进入书籍
    lookArticle ($title, $username) {
      window.open(`/lookArticle?bookusername=${$username}&booktitle=${$title}&ls=false`)
    },
    // 获取分页组件的页数
    getNowPagefromChild (nowpage) {
      this.nowPage = nowpage
      this.chooseBookType(this.NowTypeID, this.NowType, nowpage)
    },
    chooseBookType ($typeID, $type, $nowPage) {
      this.NowType = $type
      this.BookShowLoading = true
      this.$http.get('/api/BookType/GetBook', {
        params: {
          bookTypeID: $typeID,
          bookTypePage: $nowPage
        }
      })
        .then((json) => {
          var result = json.data
          if (result.code !== '0') {
            return Promise.reject(json.msg)
          } else {
            this.totalUserNum = result.data.TotalNum
            this.bookTypeShow = result.data.BookList
            this.BookShowLoading = false
            this.totalUserNum === 0 ? this.NoBookShow = true : this.NoBookShow = false 
          }
        })
        .catch((err) => {
          this.BookShowLoading = false
          this.$message.error('没有')
        })
    }
  },
  mounted () {
    this.bookType = this.$store.state.bookType
    if (window.location.search) {
      var search = window.location.search.split('?')[1]
      // decodeURI
      this.NowTypeID = search.split('&')[0].split('=')[1]
      this.NowType = window.decodeURI(search.split('&')[1].split('=')[1])
    }
    this.chooseBookType(this.NowTypeID, this.NowType, this.nowPage)
  },
  components: {
    topheader,
    pagination
  }
}
</script>
<style lang="scss">
  .el-container {
    top: 0.65rem;
    width: 100vw;
    position: relative;
    height: auto;
    z-index: 1;

    .el-main {
      .BoolBook {
        .main-book-show {
          width: 100%;
          height: 200px;
          .main-book-item {
            overflow-x: hidden;
            height: 180px;
            width: 31%;
          }
          .main-book-img {
            width: 97.5px;
            height: 130px;
          }
        }
      }
      .BoolBook2 {
        .bottom-line {
          width: 30%;
          height: 20px;
          border-bottom: 1px solid black;
        }
      }
      
    }
    .el-aside {
      height: auto;
      background-color: rgba(219, 218, 221, 0.336);
      .aside-1 {
        width: 100%;
        .aside-2-item {
          display: block;
          height: 16px;
          color: rgba(35, 35, 80, 0.795);
          border-bottom: 1px solid blue;
          border-radius: 2px;
           &:hover {
             background-color:rgba(0, 0, 255, 0.507);
           }
        }
      }
    }
  }
  .hoverClick2 {
    &:hover {
        cursor: pointer;
        border-bottom: 1px solid #3e62e0;
    }
  }
</style>
