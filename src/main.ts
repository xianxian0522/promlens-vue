import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import {Button, Form, Input, Radio, Select, Switch, Tabs} from 'ant-design-vue'

const app = createApp(App)
app.use(router)

app.use(Button)
app.use(Tabs)
app.use(Form)
app.use(Input)
app.use(Select)
app.use(Radio)
app.use(Switch)

app.mount('#app')
