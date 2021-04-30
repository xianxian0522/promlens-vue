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
  <a-button class="btn btn-secondary btn-sm" @click="onSubmit">
    <CheckOutlined />Apply changes
  </a-button>
</div>
</template>

<script lang="ts">
import {inject, onUnmounted, reactive, watch} from "vue";
import {CheckOutlined} from "@ant-design/icons-vue";

export default {
  name: "FormUnaryExpression",
  props: ['unaryExpr'],
  components: {CheckOutlined},
  emits: ['previewChange'],
  setup(props, content) {
    const updateExprValue: any = inject('updateExprValue')
    const updateExprIndex: number | undefined = inject('updateExprIndex')
    const updateLeft = inject('updateLeft')
    const formState = reactive({
      unaryOp: props.unaryExpr?.unaryOp || '-',
      expr: props.unaryExpr?.expr
    })

    const getUnary = () => {
      const data: any = {
        unaryOp: formState.unaryOp,
        expr: formState.expr,
      }
      return data
    }

    const onSubmit = () => {
      const value = {
        unaryExpr: getUnary(),
        showLeft: updateLeft,
      }
      updateExprValue([value, 'unaryExpr', updateExprIndex])
    }

    content.emit('previewChange', props.unaryExpr)

    watch(formState, () => {
      content.emit('previewChange', getUnary())
    })

    return {
      formState,
      onSubmit,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
