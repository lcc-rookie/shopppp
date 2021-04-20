import Vue from 'vue'
import { Button } from 'element-ui'
import { Form, FormItem, Input, Message } from 'element-ui'


Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)

// 弹窗消息，需要全局挂载
Vue.prototype.$message = Message
    // this.$message中含有各种形式的弹窗