<template>
<div>
  <TreeCommon>
    <template v-slot:innerText>{{numberLiteral}}</template>
    <template v-slot:connector>
      <div class="ast-connector ast-connector-up" style="top: -4px"></div>
    </template>
  </TreeCommon>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";

export default {
  name: "NumberLiteral",
  props: ['numberLiteral'],
  components: {TreeCommon},
  setup() {

  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
