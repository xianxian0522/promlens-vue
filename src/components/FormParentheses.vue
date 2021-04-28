<template>
<div>
</div>
</template>

<script lang="ts">
export default {
  name: "FormParentheses",
  components: {},
  props: ['parenExpr'],
  emits: ['previewChange'],
  setup(props, content) {
    content.emit('previewChange')
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
