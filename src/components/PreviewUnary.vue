<template>
<span>
  <span class="promql-code">
    <span >{{ preview ? preview?.unaryOp : '-'}}</span>
    <span>
      <span v-if="preview?.expr">
        <PreviewExpr :preview="preview.expr" />
      </span>
      <span v-else class="ast-ellipsis">...</span>
    </span>
  </span>
</span>
</template>

<script lang="ts">
import {defineAsyncComponent} from "vue";

export default {
  name: "PreviewUnary",
  props: ['preview'],
  components: {
    PreviewExpr: defineAsyncComponent(() => import('./PreviewExpr.vue')),
  },
  setup(props) {
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
