<template>
<div>
  <Expr :expr="binaryExpr.left" />
  <TreeCommon>
<!--    <template v-slot:connector>-->
<!--      <div class="ast-connector ast-connector-down" style="bottom: -81px;"></div>-->
<!--    </template>-->
    <template v-slot:innerText>
      <div>{{ binaryExpr.operator }}</div>
    </template>
  </TreeCommon>
  <Expr :expr="binaryExpr.right" />
</div>
</template>

<script lang="ts">
import {defineAsyncComponent} from "vue";
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
