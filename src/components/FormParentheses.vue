<template>
<div>
  <a-button class="btn btn-secondary btn-sm" @click.stop="onSubmit">
    <CheckOutlined />Apply changes
  </a-button>
</div>
</template>

<script lang="ts">
import {inject, reactive} from "vue";
import {CheckOutlined} from "@ant-design/icons-vue";

export default {
  name: "FormParentheses",
  components: {CheckOutlined,},
  props: ['parenExpr'],
  emits: ['previewChange'],
  setup(props, content) {
    const updateExprValue: any = inject('updateExprValue')
    const updateExprIndex: number | undefined = inject('updateExprIndex')
    const updateLeft = inject('updateLeft')
    const formState = reactive({})
    content.emit('previewChange', props.parenExpr)

    const onSubmit = () => {
      const value = {
        parenExpr: props.parenExpr,
        showLeft: updateLeft,
      }
      updateExprValue([value, 'parenExpr', updateExprIndex])
    }

    return {
      onSubmit,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
