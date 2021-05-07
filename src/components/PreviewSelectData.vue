<template>
<span>
<!--  <span class="promql-metric-name">{{ preview.metricName }}</span>-->
<!--  <span v-if="preview.labelMatchers && preview.labelMatchers.length > 0">{<span class="promql-metric-name" v-for="(label, index) in preview.labelMatchers" :key="index">-->
<!--      <span class="promql-label-name">{{ label.labelName }}</span>{{ label.matchOp }}<span class="promql-string">"{{ label.labelValue }}"</span>-->
<!--    <span v-if="preview.labelMatchers.length > 1 && (preview.labelMatchers.length - 1) !== index">, </span>-->
<!--    </span>}</span>-->
<!--  <span v-if="preview.select === 'range'" >[<span class="promql-duration">{{ preview.range }}</span>]-->
<!--  </span>-->
<!--  <span v-if="preview.offset && preview.offset.slice(0, -1) !== '0'">-->
<!--    <span class="promql-keyword"> offset </span>-->
<!--    <span class="promql-duration">{{ preview.offset }}</span>-->
<!--  </span>-->

  <span class="promql-metric-name">{{preview?.metricIdentifier}}</span>
  <span class="promql-metric-name" v-if="preview?.labelMatchers?.length > 0">{<span v-for="(vector, index) in preview?.labelMatchers" :key="index">
    <span class="promql-label-name">{{ vector.labelName }}</span>{{vector.matchOp}}<span class="promql-string">"{{vector.labelValue}}"</span>
    <span v-if="preview?.labelMatchers?.length > 1 && (preview?.labelMatchers?.length - 1 !== index)">, </span></span>}
  </span>
  <span v-if="preview?.offsetExpr">[<span class="promql-duration">{{preview?.offsetExpr?.duration}}</span>]
    <!--          <MatrixSelector :matrixSelector="vectorSelector.matrixSelector"/>-->
  </span>
  <span v-if="preview?.offsetExpr && (preview?.matrixSelector && preview?.matrixSelector?.duration.slice(0, -1) !== '0')">
    <span class="promql-keyword" v-if="preview?.offsetExpr?.offset">offset </span>
    <span class="promql-duration">{{preview?.matrixSelector?.duration}}</span>
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
