<template>
<span>
  <span class="promql-code">
<!--    <span class="promql-keyword">{{ preview.aggregationType }}</span>-->
<!--    <span class="promql-keyword" v-if="preview.preserve === 'by' && preview.groupingLabels?.length > 0"> by</span>-->
<!--    <span class="promql-keyword" v-if="preview.preserve === 'without'"> without</span>-->
<!--    <span class="promql-paren" v-if="(preview.preserve !== 'by' || preview.groupingLabels?.length > 0)">(</span>-->
<!--    <span v-for="(item, index) in preview.groupingLabels" :key="index">-->
<!--      <span class="promql-code promql-label-name">{{item}}</span>-->
<!--      <span v-if="preview.groupingLabels?.length > 1 && (preview.groupingLabels?.length - 1) !== index">,</span>-->
<!--    </span>-->
<!--    <span class="promql-paren" v-if="(preview.preserve !== 'by' || preview.groupingLabels?.length > 0)">)</span>-->

    <span class="promql-keyword">{{ preview ? preview?.aggregateOp : 'sum' }}</span>
    <span v-if="preview?.aggregateModifier">
      <span v-if="preview?.aggregateModifier?.Without">
        <span class="promql-keyword"> without</span>
        <span class="promql-paren">(</span>
        <span v-for="(item, index) in preview?.aggregateModifier?.Without" :key="index">
          <span class="promql-code promql-label-name">{{item}}</span>
          <span v-if="preview?.aggregateModifier?.Without?.length > 1 && (preview?.aggregateModifier?.Without?.length - 1) !== index">,</span>
        </span>
        <span class="promql-paren">) </span>
      </span>
      <span v-if="preview?.aggregateModifier?.By?.length > 0">
        <span class="promql-keyword"> by</span>
        <span class="promql-paren">(</span>
        <span v-for="(item, index) in preview?.aggregateModifier?.By" :key="index">
          <span class="promql-code promql-label-name">{{item}}</span>
          <span v-if="preview?.aggregateModifier?.By?.length > 1 && (preview?.aggregateModifier?.By?.length - 1) !== index">,</span>
        </span>
        <span class="promql-paren">) </span>
      </span>
    </span>

    <span v-if="!isShowExpr">(<span v-if="preview?.functionArgs">
        <span v-for="(item, index) in preview?.functionArgs" :key="index">
          <PreviewExpr :preview="item" />
<!--          <PreviewSelectData v-if="item.vectorSelector" :preview="item.vectorSelector" />-->
<!--          <PreviewAggregate v-if="item.aggregateExpr" :preview="item.aggregateExpr"/>-->
        </span>
      </span>
      <span class="ast-ellipsis" v-else>...</span>)</span>
  </span>
</span>
</template>

<script lang="ts">
import PreviewSelectData from "@/components/PreviewSelectData.vue";
import {defineAsyncComponent} from "vue";

export default {
  name: "PreviewAggregate",
  props: ['preview', 'isShowExpr'],
  components: {
    // PreviewSelectData,
    PreviewExpr: defineAsyncComponent(() => import('./PreviewExpr.vue')),
  },
  setup() {
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
