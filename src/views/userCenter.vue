<template>
<!-- 整个页面的布局，左侧侧边栏，右侧内容 -->
    <div>
        <topheader></topheader>
        <el-row class="container" v-loading="uploading">
          <el-col :span="24" class="main">
            <aside class="menu-expanded">
              <!--导航菜单-->
              <el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router >
                <div class="font16" v-for="(item,index) in $router.options.routes" :key="index" v-if='!item.hidden && (item.routeMeta.indexOf(userMeta) != -1)'>
                  <el-submenu :index="index+''" v-if="!item.leaf">
                    <template slot="title">
                      <i :class="item.iconCls"></i>
                      {{item.name}}
                    </template>
                    <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if='!child.hidden'>
                      {{child.name}}
                    </el-menu-item>
                  </el-submenu>
                </div>
              </el-menu>
            </aside>
            <section class="content-container">
              <div class="grid-content bg-purple-light">
                <el-col :span="24" class="content-wrapper">
                  <transition name="fade" mode="out-in">
                    <router-view></router-view>
                  </transition>
                </el-col>
              </div>
            </section>
          </el-col>
        </el-row>
    </div>
</template>
<script>
import topheader from '../components/common/topheader'
export default {
  components: {
    topheader
  },
  data () {
    return {
      uploading: false,
      userMeta: ''
    }
  },
  methods: {
  },
  mounted: function () {
    // 挂载的时候就去请求判断是否有登录
    if (!this.$store.state.isLogin) {
      this.$message.error('用户未登录，请登录后重试')
      setTimeout(function () {
        location.href = '/'
      }, 2000)
    } else {
      this.uploading = true
      this.$http.post(
        '/api/userCenter/checkLogin',
        {
          params: {
            username: this.$store.state.DLusername
          }
        }
      ).then((res) => {
        var json = res.data
        if (json.code !== '0') {
          return Promise.reject(json.msg)
        } else {
          this.uploading = false
          this.userMeta = this.$store.state.meta
        }
      }).catch((err) => {
        this.$message({
          message: `${err}`,
          type: 'error'
        })
        setTimeout(function () {
          location.href = '/'
        }, 2000)
      })
    }
  }
}
</script>
<style lang="scss">
.container {
  position: absolute;
  top: 1rem;
  bottom: 0;
  width:100%;
  .main {
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    overflow: hidden;
    .menu-collapsed{
      flex:0 0 60px;
      width: 60px;
    }
    .menu-expanded{
      flex:0 0 230px;
      width: 230px;
    }
  }
  .content-container {
    // background: #f1f2f7;
    flex:1;
    overflow-y: scroll;
    padding: 10px;
  }
}
</style>
