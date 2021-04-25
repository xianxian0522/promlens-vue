<template>
<span>
  <span class="promql-metric-name">{{ preview.metricName }}</span>
  <span v-if="preview.labelMatchers && preview.labelMatchers.length > 0">{<span class="promql-metric-name" v-for="(label, index) in preview.labelMatchers" :key="index">
      <span class="promql-label-name">{{ label.labelName }}</span>{{ label.matchOp }}<span class="promql-string">"{{ label.labelValue }}"</span>
    <span v-if="preview.labelMatchers.length > 1 && (preview.labelMatchers.length - 1) !== index">, </span>
    </span>}</span>
  <span v-if="preview.select === 'range'" >[<span class="promql-duration">{{ preview.range }}</span>]
  </span>
  <span v-if="preview.offset && preview.offset.slice(0, -1) !== '0'">
    <span class="promql-keyword"> offset </span>
    <span class="promql-duration">{{ preview.offset }}</span>
  </span>
</span>
</template>

<script lang="ts">
export default {
  name: "PreviewSelectData",
  props: ["preview"],
  setup() {

  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
