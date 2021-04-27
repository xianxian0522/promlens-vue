<template>
<span>
  <span class="promql-code">
    <span class="promql-keyword">{{ preview.aggregateOp }}</span>
    <span v-if="preview.aggregateModifier">
      <span v-if="preview.aggregateModifier.Without">
        <span class="promql-keyword"> without</span>
        <span class="promql-paren">(</span>
        <span v-for="(item, index) in preview.aggregateModifier.Without" :key="index">
          <span class="promql-code promql-label-name">{{item}}</span>
          <span v-if="preview.aggregateModifier.Without.length > 1 && (preview.aggregateModifier.Without.length - 1) !== index">,</span>
        </span>
        <span class="promql-paren">)</span>
      </span>
      <span v-if="preview.aggregateModifier.By && preview.aggregateModifier.By.length > 0">
        <span class="promql-keyword"> by</span>
        <span class="promql-paren">(</span>
        <span v-for="(item, index) in preview.aggregateModifier.By" :key="index">
          <span class="promql-code promql-label-name">{{item}}</span>
          <span v-if="preview.aggregateModifier.By.length > 1 && (preview.aggregateModifier.By.length - 1) !== index">,</span>
        </span>
        <span class="promql-paren">)</span>
      </span>
    </span>
  </span>
</span>
</template>

<script lang="ts">
export default {
  name: "PreviewAggregate",
  props: ['preview'],
  setup() {

  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
