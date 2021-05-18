<template>
<span>
  <span v-if="ellipsis">
    <span v-if="preview?.left">
      <PreviewExpr :preview="preview.left" rightOrLeft="right"/>
<!--      <span v-if="preview.left.numberLiteral || preview.left.numberLiteral === 0">-->
<!--        <PreviewLiteralValue :preview="preview.left.numberLiteral" numOrStr="numberLiteral" />-->
<!--      </span>-->
<!--      <PreviewLiteralValue v-else-if="preview.left.stringLiteral" :preview="preview.left.stringLiteral" numOrStr="stringLiteral" />-->
<!--      <PreviewFunction v-else-if="preview.left.functionCall" :preview="preview.left.functionCall" />-->
<!--      <PreviewAggregate v-else-if="preview.left.aggregateExpr" :preview="preview.left.aggregateExpr" />-->
<!--      <span v-else-if="preview.left.vectorSelector">-->
<!--        <PreviewSelectData :preview="preview.left.vectorSelector" />-->
<!--        <span style="display: inline-block; width: 4px"></span>-->
<!--      </span>-->
    </span>
    <span v-else class="ast-ellipsis">...</span>
  </span>

<!--  <span class="ast-operator"> {{ preview.operator }} </span>-->
<!--  <span v-if="preview.switchOpen">-->
<!--    <span class="ast-keyword" v-if="preview.ComparisonBehavior === 'bool'"> bool </span>-->
<!--    <span class="ast-keyword" v-if="preview.matchOn === 'on'"> {{ preview.matchOn }} </span>-->
<!--    <span v-if="preview.ignoreLabels && preview.ignoreLabels.length > 0">-->
<!--      <span class="ast-keyword" v-if="preview.matchOn === 'ignoring'"> {{ preview.matchOn }} </span>-->
<!--    </span>-->
<!--    <span v-if="preview.ignoreLabels && preview.ignoreLabels.length > 0">-->
<!--      <span class="ast-parens">(</span>-->
<!--      <span v-for="(item, index) in preview.ignoreLabels" :key="index">-->
<!--        <span class="ast-label-name">{{ item }}</span>-->
<!--        <span v-if="preview.ignoreLabels.length > 1 && (preview.ignoreLabels.length - 1) !== index">,</span>-->
<!--      </span>-->
<!--      <span class="ast-parens">)</span>-->
<!--    </span>-->
<!--    <span class="ast-keyword" v-if="preview.matchType === 'many-to-one'"> group_left</span>-->
<!--    <span class="ast-keyword" v-if="preview.matchType === 'one-to-many'"> group_right</span>-->
<!--    <span v-if="preview.matchType === 'many-to-one' || preview.matchType === 'one-to-many'">-->
<!--      <span class="ast-parens">(</span>-->
<!--      <span v-for="(item, index) in preview.includeLabels" :key="index">-->
<!--        <span class="ast-label-name">{{ item }}</span>-->
<!--        <span v-if="preview.includeLabels && preview.includeLabels.length > 1 && (preview.includeLabels.length - 1) !== index">,</span>-->
<!--      </span>-->
<!--      <span class="ast-parens">)</span>-->
<!--    </span>-->
<!--  </span>-->

  <span class="ast-operator"> {{ preview ? preview?.operator : '/' }} </span>
  <span v-if="preview?.binModifiers">
    <span class="ast-keyword" v-if="preview?.binModifiers?.Bool"> bool </span>
    <span v-if="preview?.binModifiers?.OnOrIgnoring?.Ignoring?.length > 0">
      <span class="ast-keyword" v-if="preview?.binModifiers?.OnOrIgnoring?.Ignoring"> ignoring </span>
      <span class="ast-parens">(</span>
      <span v-for="(item, index) in preview?.binModifiers?.OnOrIgnoring?.Ignoring" :key="index">
        <span class="ast-label-name">{{ item }}</span>
        <span v-if="preview?.binModifiers?.OnOrIgnoring?.Ignoring.length > 1 && (preview?.binModifiers?.OnOrIgnoring?.Ignoring.length - 1) !== index">,</span>
      </span>
      <span class="ast-parens">)</span>
    </span>
    <span v-if="preview?.binModifiers?.OnOrIgnoring?.On">
      <span class="ast-keyword"> on</span>
      <span class="ast-parens">(</span>
      <span v-if="preview?.binModifiers?.OnOrIgnoring?.On?.length > 0">
      <span v-for="(item, index) in preview?.binModifiers?.OnOrIgnoring?.On" :key="index">
        <span class="ast-label-name">{{ item }}</span>
        <span v-if="preview?.binModifiers?.OnOrIgnoring?.On.length > 1 && (preview?.binModifiers?.OnOrIgnoring?.On.length - 1) !== index">,</span>
      </span>
      </span>
      <span class="ast-parens">)</span>
    </span>
    <span class="ast-keyword" v-if="preview?.binModifiers?.group?.GroupLeft"> group_left</span>
    <span class="ast-keyword" v-if="preview?.binModifiers?.group?.GroupRight"> group_right</span>
    <span v-if="preview?.binModifiers?.group?.GroupLeft">
      <span class="ast-parens">(</span>
      <span v-for="(item, index) in preview?.binModifiers?.group?.GroupLeft" :key="index">
        <span class="ast-label-name">{{ item }}</span>
        <span v-if="preview?.binModifiers?.group?.GroupLeft.length > 1 && (preview?.binModifiers?.group?.GroupLeft.length - 1) !== index">,</span>
      </span>
      <span class="ast-parens">)</span>
    </span>
    <span v-if="preview?.binModifiers?.group?.GroupRight">
      <span class="ast-parens">(</span>
      <span v-for="(item, index) in preview?.binModifiers?.group?.GroupRight" :key="index">
        <span class="ast-label-name">{{ item }}</span>
        <span v-if="preview?.binModifiers?.group?.GroupRight.length > 1 && (preview?.binModifiers?.group?.GroupRight.length - 1) !== index">,</span>
      </span>
      <span class="ast-parens">)</span>
    </span>
  </span>

  <span v-if="ellipsis">
    <span v-if="preview?.right">
      <PreviewExpr :preview="preview.right" rightOrLeft="left" />
<!--      <PreviewLiteralValue v-if="preview.right.numberLiteral || preview.right.numberLiteral === 0" :preview="preview.right.numberLiteral" numOrStr="numberLiteral" />-->
<!--      <PreviewLiteralValue v-else-if="preview.right.stringLiteral" :preview="preview.right.stringLiteral" numOrStr="stringLiteral" />-->
<!--      <PreviewFunction v-else-if="preview.right.functionCall" :preview="preview.right.functionCall" />-->
<!--      <PreviewAggregate v-else-if="preview.right.aggregateExpr" :preview="preview.right.aggregateExpr" />-->
<!--      <PreviewSelectData v-else-if="preview.right.vectorSelector" :preview="preview.right.vectorSelector" />-->
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
    PreviewExpr: defineAsyncComponent(() => import('./PreviewExpr.vue')),
    // PreviewFunction: defineAsyncComponent(() => import('./PreviewFunction.vue')),
    // PreviewAggregate: defineAsyncComponent(() => import('./PreviewAggregate.vue')),
    // PreviewSelectData: defineAsyncComponent(() => import('./PreviewSelectData.vue')),
    // PreviewLiteralValue: defineAsyncComponent(() => import('./PreviewLiteralValue.vue')),
  },
  props: ['preview', 'ellipsis'],
  setup(props) {

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
