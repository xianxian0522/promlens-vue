<template>
<span>
  <span class="promql-code">
    <span class="promql-paren">(</span>
    <span>
      <span v-if="preview?.expr">
        <!--    判断是Expr里面的哪一个就展示哪一个的preview    -->
        <PreviewExpr :preview="preview.expr" />
      </span>
      <span v-else class="ast-ellipsis">...</span>
    </span>
    <span class="promql-paren">)</span>
  </span>
</span>
</template>

<script lang="ts">
import {defineAsyncComponent} from "vue";

export default {
  name: "PreviewParentheses",
  components: {
    PreviewExpr: defineAsyncComponent(() => import('./PreviewExpr.vue')),
  },
  props: ['preview'],
  setup(props) {
    console.log(props.preview, 'xxx')
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
