import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import {Button, Form, Input, InputNumber, Radio, Select, Spin, Switch, Tabs, DatePicker} from 'ant-design-vue'

const app = createApp(App)
app.use(router)

app.use(Button)
app.use(Tabs)
app.use(Form)
app.use(Input)
app.use(InputNumber)
app.use(Select)
app.use(Radio)
app.use(Switch)
app.use(Spin)
app.use(DatePicker)

app.mount('#app')
