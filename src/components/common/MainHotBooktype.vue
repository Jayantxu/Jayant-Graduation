<template>
  <div class="MainHotBookLooking text-left mt40">
    <div class="MainHotBookrecent1" v-if="MainHotBookRank" v-loading="MainHotBookRankLoading">
      <!-- 清除margin重叠 -->
      <div style="overflow: hidden;">
        <span class="inline-block font-bold ml20 mt20 font18" style="width: 85%">
          当前系统热门分类中书籍:
        </span>
        <div class="inline-block">
          <span class="ml40 mt10 font16 hvr-grow-rotate" @click="returnTypeArticle">
            分类查看
          </span>
        </div>
      </div>
      <div class="MainHotBookrecent1-1 mt10 text-center">
        <el-carousel :interval="5000" indicator-position="none">
          <el-carousel-item v-for="item of rankBookType0">
            <div class="inline-block font-white MainHotBookrecent1-2 ml30 mt10" v-for="item1 of item">
              <img style="vertical-align:middle" class="MainHot-book-img hvr-grow-shadow" @click="lookArticle(item1.title, item1.username)" src="../../assets/Image/图片无法加载1.jpg" alt=""/>
              <div style="overflow: hidden; width: 150px;">
                 <span class="font16 font-black MainHot-book-span inline-block hvr-buzz-out mt10">{{item1.title}}</span>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      MainHotBookRankLoading: true,
      MainHotBookRank: true,
      rankBookType1: [],
      rankBookType2: [],
      rankBookType0: [],
      rankBooklen: ''
    }
  },
  methods: {
    lookArticle (title, username) {
      window.open(`/lookArticle?bookusername=${username}&booktitle=${title}&ls=false`)
    },
    // 按分类查看
    returnTypeArticle () {
      location.href = '/typeArticle'
    },
    mainHotBookTypeRank () {
      this.$http.get('/api/hotNewBook/getTopHotBook')
        .then((json) => {
          var json = json.data
          if (json.code !== '0') {
            return Promise.reject(json.msg)
          }
          this.rankBooklen = json.data.len
          this.rankBookType1 = json.data.rankType1
          this.rankBookType2 = json.data.rankType2
          if (json.data.len > 5) {
            this.rankBookType0.push(json.data.rankType1)
            this.rankBookType0.push(json.data.rankType2)
          } else {
            this.rankBookType0 = json.data.rankType1
          }
          this.MainHotBookRankLoading = false
        })
        .catch((err) => {
          this.MainHotBookRank = false
        })
    }
  },
  mounted () {
    this.mainHotBookTypeRank()
  }
}
</script>
<style lang="scss">
  .MainHotBookLooking {
    width: 100%;
    height: 260px;
  }
  .MainHotBookrecent1 {
    width: 98%;
    height: 240px;
    transform: translateX(8px);
    border-radius: 10px 10px 0 0;
    background: rgba(219, 219, 219, 0.356);
  }
  .MainHotBookrecent1-1 {
    width: 100%;
    height: 205px;
  }
  .MainHotBookrecent1-2 {
    height: 140px;
    width: 150px;
    vertical-align: top;
  }
  .MainHot-book-img {
    height: 140px;
    width: 110px;
  }
  .MainHot-book-span {
    line-height: 18px;
    width: 150px;
  }
  // 走马灯的style
  // .el-carousel__item h3 {
  //   color: #475669;
  //   font-size: 18px;
  //   opacity: 0.75;
  //   line-height: 205px;
  //   margin: 0;
  // }
  .el-carousel__container {
    height: 205px;
  }
  // .el-carousel__item:nth-child(2n) {
  //   background-color: #2a2a2b3a;
  // }
  
  // .el-carousel__item:nth-child(2n+1) {
  //   background-color: #24252536;
  // }
</style>
