<template>
<span>
  <span class="promql-code">
    <span class="promql-paren">(</span>
    <span>
      <span v-if="preview"></span>
      <span v-else class="ast-ellipsis">...</span>
    </span>
    <span class="promql-paren">)</span>
  </span>
</span>
</template>

<script lang="ts">
export default {
  name: "PreviewParentheses",
  components: {},
  props: ['preview'],
  setup() {

  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
