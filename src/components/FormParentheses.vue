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
    const updateQlIndex = inject('updateQlIndex')
    const queryAllData: any = inject('queryAllData')

    const formState = reactive({})
    content.emit('previewChange', props.parenExpr)

    const onSubmit = async () => {
      const value = {
        parenExpr: {
          expr: props.parenExpr?.expr,
          parentheses: '()',
        },
        showLeft: updateLeft,
      }
      await updateExprValue([value, 'parenExpr', updateExprIndex, updateQlIndex])
      await queryAllData()
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
