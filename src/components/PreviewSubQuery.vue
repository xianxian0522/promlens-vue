<template>
<span>
  <span v-if="ellipsis">
    <span v-if="preview?.expr">
      <PreviewExpr :preview="preview.expr" />
    </span>
    <span v-else class="ast-ellipsis">...</span>
  </span>
  <span>[<span class="promql-duration">{{ preview ? preview?.range : '1h'}}</span>:<span v-if="preview?.step?.slice(0, -1) !== '0'" class="promql-duration">{{ preview?.step }}</span>]
  </span>
  <span v-if="preview?.offsetExpr?.offset && preview?.offsetExpr?.duration.slice(0, -1) !== '0'">
    <span class="promql-keyword"> offset </span>
    <span class="promql-duration">{{ preview?.offsetExpr?.duration }}</span>
  </span>
</span>
</template>

<script lang="ts">
import {defineAsyncComponent} from "vue";

export default {
  name: "PreviewSubQuery",
  props: ['preview', 'ellipsis'],
  components: {
    PreviewExpr: defineAsyncComponent(() => import('./PreviewExpr.vue')),
  },
  setup() {

  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
