import axios from './axios'
export default {
  getBookTypeFun ($this) {
    var _this = $this
    axios.get('/api/common/getBookType')
      .then((json) => {
        var tjson = json.data
        if (tjson.code !== '0') {
          return Promise.reject(tjson.msg)
        } else {
          // 保存书籍分类数组进store
          _this.$store.commit('PutInBookType', {
            bookType: tjson.data.type
          })
        }
      })
      .catch((err) => {
        _this.$message.error(err)
      })
  }
}
