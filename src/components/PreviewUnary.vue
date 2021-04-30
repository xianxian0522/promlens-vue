<template>
<span>
  <span class="promql-code">
    <span >{{ preview.unaryOp }}</span>
    <span>
      <span v-if="preview.expr"></span>
      <span v-else class="ast-ellipsis">...</span>
    </span>
  </span>
</span>
</template>

<script lang="ts">
export default {
  name: "PreviewUnary",
  props: ['preview'],
  setup(props) {
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
