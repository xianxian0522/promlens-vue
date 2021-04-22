<template>
<div>
  <a-form layout="vertical" :model="formState" class="small">
    <a-form-item label="Unary operator type:">
      <a-select
          v-model:value="formState.unaryOperator"
          style="width: 100%"
          ref="select"
      >
        <a-select-option value="+">+</a-select-option>
        <a-select-option value="-">-</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</div>
</template>

<script lang="ts">
import {reactive} from "vue";

export default {
  name: "FormUnaryExpression",
  setup() {
    const formState = reactive({
      unaryOperator: '-',
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
