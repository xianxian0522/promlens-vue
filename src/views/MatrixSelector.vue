<template>
<div>
  <div>
    <Expr :expr="matrixSelector.expr" />
    <div>[ {{matrixSelector.duration}} ]</div>
  </div>
</div>
</template>

<script lang="ts">
import {defineAsyncComponent} from "vue";

export default {
  name: "MatrixSelector",
  props: ['matrixSelector'],
  components: {
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  setup(props: any) {
    console.log(props, 'matrix')

    return {

    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
