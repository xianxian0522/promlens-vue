<template>
<div>
  <Expr :expr="binaryExpr.left" />
  <div>{{ binaryExpr.operator }}</div>
  <Expr :expr="binaryExpr.right" />
</div>
</template>

<script lang="ts">
import {defineAsyncComponent} from "vue";

export default {
  name: "BinaryExpr",
  props: ['binaryExpr'],
  components: {
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
