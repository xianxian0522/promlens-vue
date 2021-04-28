<template>
<div>
  <a-form layout="vertical" :model="formState" class="small">
    <a-form-item label="Unary operator type:">
      <a-select
          v-model:value="formState.unaryOp"
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
  props: ['unaryExpr'],
  emits: ['previewChange'],
  setup(props, content) {
    const formState = reactive({
      unaryOp: props.unaryExpr?.unaryOp || '-',
      expr: props.unaryExpr?.expr
    })
    content.emit('previewChange', formState)

    return {
      formState,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
