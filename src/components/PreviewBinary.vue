<template>
<span>
  <span >
    <span v-if="leftPreview">
<!--      <span class="promql-code" v-if="leftPreview.numberLiteral">-->
<!--        <span class="promql-keyword">{{leftPreview.numberLiteral}}</span>-->
<!--      </span>-->
<!--      <span class="promql-code" v-else-if="leftPreview.stringLiteral">-->
<!--        <span class="promql-keyword">{{leftPreview.stringLiteral}}</span>-->
<!--      </span>-->
<!--      <PreviewFunction v-else-if="leftPreview.functionCall" :preview="previewData" />-->
<!--      <PreviewAggregate v-else-if="leftPreview.aggregateExpr" :preview="previewData" />-->
<!--      <PreviewSelectData v-else-if="leftPreview.vectorSelector" :preview="previewData" />-->
    </span>
    <span v-else class="ast-ellipsis">...</span>
  </span>

  <span class="ast-operator"> {{ preview.operator }} </span>
  <span v-if="preview.switchOpen">
    <span class="ast-keyword" v-if="preview.ComparisonBehavior === 'bool'"> bool </span>
    <span class="ast-keyword" v-if="preview.matchOn === 'on'"> {{ preview.matchOn }} </span>
    <span v-if="preview.ignoreLabels && preview.ignoreLabels.length > 0">
      <span class="ast-keyword" v-if="preview.matchOn === 'ignoring'"> {{ preview.matchOn }} </span>
    </span>
    <span v-if="preview.ignoreLabels && preview.ignoreLabels.length > 0">
      <span class="ast-parens">(</span>
      <span v-for="(item, index) in preview.ignoreLabels" :key="index">
        <span class="ast-label-name">{{ item }}</span>
        <span v-if="preview.ignoreLabels.length > 1 && (preview.ignoreLabels.length - 1) !== index">,</span>
      </span>
      <span class="ast-parens">)</span>
    </span>
    <span class="ast-keyword" v-if="preview.matchType === 'many-to-one'">group_left</span>
    <span class="ast-keyword" v-if="preview.matchType === 'one-to-many'">group_right</span>
    <span v-if="preview.matchType === 'many-to-one' || preview.matchType === 'one-to-many'">
      <span class="ast-parens">(</span>
      <span v-for="(item, index) in preview.includeLabels" :key="index">
        <span class="ast-label-name">{{ item }}</span>
        <span v-if="preview.includeLabels && preview.includeLabels.length > 1 && (preview.includeLabels.length - 1) !== index">,</span>
      </span>
      <span class="ast-parens">)</span>
    </span>
  </span>

  <span>
    <span v-if="rightPreview">
<!--      <span class="promql-code" v-if="rightPreview.numberLiteral">-->
<!--        <span class="promql-keyword">{{rightPreview.numberLiteral}}</span>-->
<!--      </span>-->
<!--      <span class="promql-code" v-else-if="rightPreview.stringLiteral">-->
<!--        <span class="promql-keyword">{{rightPreview.stringLiteral}}</span>-->
<!--      </span>-->
<!--      <PreviewFunction v-else-if="rightPreview.functionCall" :preview="previewData" />-->
<!--      <PreviewAggregate v-else-if="rightPreview.aggregateExpr" :preview="previewData" />-->
<!--      <PreviewSelectData v-else-if="rightPreview.vectorSelector" :preview="previewData" />-->
    </span>
    <span v-else class="ast-ellipsis">...</span>
  </span>
</span>
</template>

<script lang="ts">
import {defineAsyncComponent} from "vue";

export default {
  name: "PreviewBinary",
  components: {
    // PreviewFunction: defineAsyncComponent(() => import('./PreviewFunction.vue')),
    // PreviewAggregate: defineAsyncComponent(() => import('./PreviewAggregate.vue')),
    // PreviewSelectData: defineAsyncComponent(() => import('./PreviewSelectData.vue')),
  },
  props: ['preview', 'leftPreview', 'rightPreview'],
  setup(props) {
    console.log(props.leftPreview, props.rightPreview)
    let previewData
    if (props.leftPreview?.functionCall) {
      previewData = {
        functionIdentifier: props.leftPreview.functionCall.functionIdentifier,
        functionArgs: props.leftPreview.functionCall.functionArgs,
      }
    }
    if (props.rightPreview?.functionCall) {
      previewData = {
        functionIdentifier: props.rightPreview.functionCall.functionIdentifier,
        functionArgs: props.rightPreview.functionCall.functionArgs,
      }
    }
    if (props.rightPreview?.binaryExpr) {
      previewData = {
        operator: props.rightPreview.binaryExpr?.operator || '/',
        switchOpen: !!props.rightPreview.binaryExpr?.binModifiers,
        matchOn: props.rightPreview.binaryExpr?.binModifiers?.OnOrIgnoring.Ignoring ? 'ignoring' : 'on',
        ComparisonBehavior: props.rightPreview.binaryExpr?.binModifiers?.Bool ? 'bool' : 'filter',
        ignoreLabels: props.rightPreview.binaryExpr?.binModifiers?.OnOrIgnoring.On || props.rightPreview.binaryExpr?.binModifiers?.OnOrIgnoring.Ignoring,
        matchType: props.rightPreview.binaryExpr?.binModifiers?.group.GroupLeft ? 'many-to-one' : props.rightPreview.binaryExpr?.binModifiers?.group.GroupRight ? 'one-to-many' : 'one-to-one',
        includeLabels: props.rightPreview.binaryExpr?.binModifiers?.group.GroupRight || props.rightPreview.binaryExpr?.binModifiers?.group.GroupLeft,
      }
    }
    if (props.leftPreview?.binaryExpr) {
      previewData = {
        operator: props.leftPreview.binaryExpr?.operator || '/',
        switchOpen: !!props.leftPreview.binaryExpr?.binModifiers,
        matchOn: props.leftPreview.binaryExpr?.binModifiers?.OnOrIgnoring.Ignoring ? 'ignoring' : 'on',
        ComparisonBehavior: props.leftPreview.binaryExpr?.binModifiers?.Bool ? 'bool' : 'filter',
        ignoreLabels: props.leftPreview.binaryExpr?.binModifiers?.OnOrIgnoring.On || props.leftPreview.binaryExpr?.binModifiers?.OnOrIgnoring.Ignoring,
        matchType: props.leftPreview.binaryExpr?.binModifiers?.group.GroupLeft ? 'many-to-one' : props.leftPreview.binaryExpr?.binModifiers?.group.GroupRight ? 'one-to-many' : 'one-to-one',
        includeLabels: props.leftPreview.binaryExpr?.binModifiers?.group.GroupRight || props.leftPreview.binaryExpr?.binModifiers?.group.GroupLeft,
      }
    }
    if (props.leftPreview?.vectorSelector) {
      previewData = {
        metricName: props.leftPreview.vectorSelector.metricIdentifier,
        labelMatchers: props.leftPreview.vectorSelector.labelMatchers,
        select: props.leftPreview.vectorSelector.offsetExpr.offset ? 'range' : 'instance',
        offset: props.leftPreview.vectorSelector.matrixSelector.duration || '0s',
        range: props.leftPreview.vectorSelector.offsetExpr.duration,
      }
    }
    if (props.rightPreview?.vectorSelector) {
      previewData = {
        metricName: props.rightPreview.vectorSelector.metricIdentifier,
        labelMatchers: props.rightPreview.vectorSelector.labelMatchers,
        select: props.rightPreview.vectorSelector.offsetExpr.offset ? 'range' : 'instance',
        offset: props.rightPreview.vectorSelector.matrixSelector.duration || '0s',
        range: props.rightPreview.vectorSelector.offsetExpr.duration,
      }
    }
    if (props.leftPreview?.aggregateExpr) {
      previewData = {
        aggregationType: props.leftPreview.aggregateExpr.aggregateOp || 'sum',
        preserve: props.leftPreview.aggregateExpr.aggregateModifier.Without ? 'without' : 'by',
        groupingLabels: props.leftPreview.aggregateExpr.aggregateModifier.Without || props.leftPreview.aggregateExpr.aggregateModifier.By,
        functionArgs: props.leftPreview.aggregateExpr?.functionArgs
      }
    }
    if (props.rightPreview?.aggregateExpr) {
      previewData = {
        aggregationType: props.rightPreview.aggregateExpr.aggregateOp || 'sum',
        preserve: props.rightPreview.aggregateExpr.aggregateModifier.Without ? 'without' : 'by',
        groupingLabels: props.rightPreview.aggregateExpr.aggregateModifier.Without || props.rightPreview.aggregateExpr.aggregateModifier.By,
        functionArgs: props.rightPreview.aggregateExpr?.functionArgs
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
