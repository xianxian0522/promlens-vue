<template>
<div>
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
</div>
</template>

<script lang="ts">
export default {
  name: "PreviewBinary",
  props: ['preview'],
  setup() {

  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
