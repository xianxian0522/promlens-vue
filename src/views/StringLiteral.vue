<template>
<div>
  <TreeCommon>
    <template v-slot:innerText>{{stringLiteral}}</template>
  </TreeCommon>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";

export default {
  name: "StringLiteral",
  props: ['stringLiteral'],
  components: {TreeCommon},
  setup() {

  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
