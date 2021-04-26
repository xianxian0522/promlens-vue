<template>
<span>
  <span class="ast-number" v-if="preview.valueType === 'numberLiteral'">{{ preview.numValue }}</span>
  <span class="ast-string" v-if="preview.valueType === 'stringLiteral'">{{ preview.stringValue }}</span>
</span>
</template>

<script lang="ts">
export default {
  name: "PreviewLiteralValue",
  props: ['preview'],
  setup() {

  },
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
