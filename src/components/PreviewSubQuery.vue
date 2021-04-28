<template>
<span>
  <span class="ast-ellipsis" v-if="ellipsis">...</span>
  <span>[<span class="promql-duration">{{preview.range}}</span>:<span v-if="preview.step?.slice(0, -1) !== '0'" class="promql-duration">{{ preview.step }}</span>]
  </span>
  <span v-if="preview.offset && preview.offset.slice(0, -1) !== '0'">
    <span class="promql-keyword"> offset </span>
    <span class="promql-duration">{{ preview.offset }}</span>
  </span>
</span>
</template>

<script lang="ts">
export default {
  name: "PreviewSubQuery",
  props: ['preview', 'ellipsis'],
  setup() {

  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
