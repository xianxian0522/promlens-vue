<template>
<span>
  <span class="ast-ellipsis">...</span>
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
  <span class="ast-ellipsis">...</span>
</span>
</template>

<script lang="ts">
export default {
  name: "PreviewBinary",
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
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
