// 文件内引用 vue对象
import _this from "../main.js"


// 清除激活路径
function clearActivePath(){
    _this.$store.commit("clearActivePath");
}

// 进行暴露
export {clearActivePath}