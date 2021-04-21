import Vue from 'vue'
// import { Button } from 'element-ui'
import { Message, MessageBox } from 'element-ui'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'



// Vue.use(Button)
// Vue.use(FormItem)
// Vue.use(Form)
// Vue.use(Input)
Vue.use(ElementUI)

// 弹窗消息，需要全局挂载,this.$message中含有各种形式的弹窗
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm