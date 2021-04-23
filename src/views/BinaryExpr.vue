<template>
  <TreeCommon>
    <template v-slot:nodeLeftChild>
      <div class="ast-node">
        <Expr :expr="binaryExpr.left" :isLeft="true" />
      </div>
    </template>
    <template v-slot:innerText>
      <div>{{ binaryExpr.operator }}</div>
    </template>
    <template v-slot:nodeRightChild>
      <div class="ast-node">
        <Expr :expr="binaryExpr.right" />
      </div>
    </template>
  </TreeCommon>
</template>

<script lang="ts">
import {defineAsyncComponent, inject, provide} from "vue";
import TreeCommon from "@/components/TreeCommon.vue";

export default {
  name: "BinaryExpr",
  props: ['binaryExpr'],
  components: {
    TreeCommon,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  setup(props: any) {
    console.log(props, 'binary')

    return {

    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
