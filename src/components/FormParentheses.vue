<template>
<div>
</div>
</template>

<script lang="ts">
import {reactive} from "vue";

export default {
  name: "FormParentheses",
  components: {},
  props: ['parenExpr'],
  emits: ['previewChange'],
  setup(props, content) {
    const formState = reactive({})
    content.emit('previewChange', formState)
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
