<template>
<span>
  <span v-if="showTips">
    <span class="ast-query-icon-tips"></span>
    <span class="ast-node-child-query-error-message">Please fill out missing child nodes</span>
  </span>
  <div style="display: inline-block" v-else>
    <span style="display: inline-block" v-if="data.status === 'success'">
      <span style="display: inline-block" v-if="!data.isLoading">
        {{ data.data.length }} results - 91ms -
        <span v-if="data.keyInfo.length > 0">
          <div class="ast-node-label-stats" v-for="(item, index) in data.keyInfo" :key="index">
            <span class="ast-label-name" style="color: green;">{{ item.name }}</span>
            :{{ item.value }},
          </div>
        </span>
        <span v-else>no labels</span>
      </span>
      <span v-else><a-spin /></span>
    </span>
    <div style="display: inline-block" v-else>
      <span v-if="!data.isLoading">
        <span class="ast-query-icon"></span>
        <span class="ast-node-query-error-message">Error executing query:{{ data.error }}</span>
      </span>
      <span v-else><a-spin /></span>
    </div>
  </div>
</span>
</template>

<script lang="ts">
export default {
  name: "CommonInfoLabel",
  props: ['showTips', 'data'],
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
