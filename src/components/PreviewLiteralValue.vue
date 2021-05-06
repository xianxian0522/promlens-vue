<template>
<span>
  <span class="ast-string" v-if="numOrStr === 'stringLiteral'" >"{{ preview }}"</span>
  <span v-else>
    <span class="ast-number">{{ preview ? preview : 0 }}</span>
  </span>
</span>
</template>

<script lang="ts">
export default {
  name: "PreviewLiteralValue",
  props: ['preview', 'numOrStr'],
  setup(props) {
    console.log(props)
  },
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
