<template>
<!-- 用户已经发布的文章 -->
  <div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="120">
        </el-table-column>
        <el-table-column prop="title" label="标题" width="250">
        </el-table-column>
        <el-table-column prop="author" label="作者" width="200">
        </el-table-column>
        <el-table-column prop="hasFile" label="附件" width="250">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination class="mt20" @sendNowPageToFather="getNowPagefromChild"></pagination>
  </div>
</template>
<script>
import pagination from '../../components/common/pagination'
export default {
  components: {
    pagination
  },
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        title: '王小虎',
        author: '上海市普陀区金沙江路 1518 弄',
        hasFile: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        title: '王小虎',
        author: '上海市普陀区金沙江路 1517 弄',
        hasFile: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        title: '王小虎',
        author: '上海市普陀区金沙江路 1519 弄',
        hasFile: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        title: '王小虎',
        author: '上海市普陀区金沙江路 1516 弄',
        hasFile: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  },
  methods: {
    // 获取分页组件的页数
    getNowPagefromChild (nowpage) {
      this.getUserData(nowpage)
    },
    getUserData: function (nowPage) {
      console.log(nowPage)
    }
  },
  mounted: function () {
    // 挂载时获取一遍数据
    this.getUserData(1)
  }
}
</script>
