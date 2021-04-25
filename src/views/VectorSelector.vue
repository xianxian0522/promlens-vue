<template>
<div>
  <TreeCommon>
    <template v-slot:connector>
      <div class="ast-connector ast-connector-up" style="top: -4px"></div>
    </template>
    <template v-slot:innerText>
      <span class="promql-code">
        <PreviewSelectData :preview="preview"/>
<!--        <span class="promql-metric-name">{{vectorSelector.metricIdentifier}}</span>-->
<!--        <span class="promql-metric-name" v-if="vectorSelector.labelMatchers.length > 0">-->
<!--          {<span v-for="(vector, index) in vectorSelector.labelMatchers" :key="index">-->
<!--            <span class="promql-label-name">{{ vector.labelName }}</span>-->
<!--            {{vector.matchOp}}-->
<!--            <span class="promql-string">"{{vector.labelValue}}"</span>-->
<!--            <span v-if="vectorSelector.labelMatchers.length > 1 && (vectorSelector.labelMatchers.length - 1 !== index)">,</span>-->
<!--          </span>}-->
<!--        </span>-->
<!--        <span v-if="vectorSelector.matrixSelector">-->
<!--          [<span class="promql-duration">{{vectorSelector.matrixSelector.duration}}</span>]-->
<!--&lt;!&ndash;          <MatrixSelector :matrixSelector="vectorSelector.matrixSelector"/>&ndash;&gt;-->
<!--        </span>-->
<!--        <span v-if="vectorSelector.offsetExpr">-->
<!--          <span class="promql-keyword" v-if="vectorSelector.offsetExpr.offset">offset </span>-->
<!--          <span class="promql-duration">{{vectorSelector.offsetExpr.duration}}</span>-->
<!--        </span>-->
      </span>
    </template>
    <template v-slot:infoLabel>
      16 results - 91ms -
      <div class="ast-node-label-stats">
        <span class="ast-label-name" style="color: green;">host</span>
        :16,
      </div>
      <div class="ast-node-label-stats">
        <span class="ast-label-name" style="color: green;">instance</span>
        :16,
      </div>
    </template>
  </TreeCommon>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import MatrixSelector from "@/views/MatrixSelector.vue";
import PreviewSelectData from "@/components/PreviewSelectData.vue";
import {reactive} from "vue";

export default {
  name: "VectorSelector",
  props: ['vectorSelector'],
  components: {
    TreeCommon,
    // MatrixSelector,
    PreviewSelectData,
  },
  setup(props: any) {

    const preview = {
      metricName: props.vectorSelector.metricIdentifier,
      labelMatchers: props.vectorSelector.labelMatchers,
      select: props.vectorSelector.offsetExpr.offset ? 'range' : 'instance',
      offset: props.vectorSelector.matrixSelector.duration || '0s',
      range: props.vectorSelector.offsetExpr.duration,
    }
    // if (props.vectorSelector.offsetExpr) {
    //   if (props.vectorSelector.offsetExpr.offset) {
    //     preview.select = 'range'
    //   }
    // }

    return {
      preview
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
