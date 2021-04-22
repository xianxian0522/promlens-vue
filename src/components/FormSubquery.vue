<template>
<div>
  <a-form layout="vertical" :model="formState" class="small">
    <a-form-item>
      <label class="label-svg">Range: <QuestionCircleOutlined /></label>
      <a-input v-model:value="formState.range"></a-input>
    </a-form-item>
    <a-form-item>
      <label class="label-svg">Offset: <QuestionCircleOutlined /></label>
      <a-input v-model:value="formState.offset"></a-input>
    </a-form-item>
    <a-form-item>
      <label class="label-svg">Resolution step: <QuestionCircleOutlined /></label>
      <a-input v-model:value="formState.step"></a-input>
    </a-form-item>
  </a-form>
</div>
</template>

<script lang="ts">
import {QuestionCircleOutlined} from '@ant-design/icons-vue'
import {reactive} from "vue";

export default {
  name: "FormSubquery",
  components: {
    QuestionCircleOutlined
  },
  setup() {
    const formState = reactive({
      offset: '0s',
      range: '1h',
      step: '0s',
    })

    return {
      formState,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
