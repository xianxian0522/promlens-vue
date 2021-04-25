<template>
<span>
  <span class="promql-keyword">{{ preview.functionIdentifier }}</span>
  <span v-if="preview.functionArgs">

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
