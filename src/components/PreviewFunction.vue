<template>
<span>
  <span class="promql-keyword">{{ preview ? preview?.functionIdentifier : 'rate' }}</span><span class="ast-parens">(</span>
  <span v-if="preview?.functionArgs">
    <span v-for="(item, index) in preview?.functionArgs" :key="index">
<!--      <PreviewSelectData v-if="item.vectorSelector" :preview="item.vectorSelector" />-->
      <PreviewExpr :preview="item" />
    </span>
  </span>
  <span v-else>
    <span class="ast-ellipsis">...</span>
  </span>
  <span class="ast-parens">)</span>
</span>
</template>

<script lang="ts">
import {defineAsyncComponent} from "vue";

export default {
  name: "PreviewFunction",
  props: ['preview'],
  components: {
    // PreviewSelectData: defineAsyncComponent(() => import('./PreviewSelectData.vue')),
    PreviewExpr: defineAsyncComponent(() => import('./PreviewExpr.vue'))
  },
  setup(props: any) {
    console.log(props, 'function prew')

    const previewData = (item) => {
      return {
        metricName: item.vectorSelector.metricIdentifier,
        labelMatchers: item.vectorSelector.labelMatchers,
        select: item.vectorSelector.offsetExpr.offset ? 'range' : 'instance',
        offset: item.vectorSelector.matrixSelector.duration || '0s',
        range: item.vectorSelector.offsetExpr.duration,
      }
    }

    return {
      previewData,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
