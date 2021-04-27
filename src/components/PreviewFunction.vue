<template>
<span>
  <span class="promql-keyword">{{ preview.functionIdentifier }}</span>
  <span v-if="preview.functionArgs">
    <span v-for="(item, index) in preview.functionArgs" :key="index">

    </span>
  </span>
  <span v-else>
    <span class="ast-parens">(</span><span class="ast-ellipsis">...</span><span class="ast-parens">)</span>
  </span>
</span>
</template>

<script lang="ts">
export default {
  name: "PreviewFunction",
  props: ['preview'],
  setup(props: any) {
    console.log(props, 'function prew')
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
