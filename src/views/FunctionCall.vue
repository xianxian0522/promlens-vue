<template>
<div>
  <div>
    <span>{{functionCall.functionIdentifier}}</span>
    <div>
      <span>(</span>
      <div v-for="(fun, index) in functionCall.functionArgs" :key="index">
        <Expr :expr="fun"/>
      </div>
      <span>)</span>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {Component, defineAsyncComponent} from "vue";

export default {
  name: "FunctionCall",
  props: ['functionIdentifier', 'functionArgs', 'functionCall'],
  components: {
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  setup(props) {
    console.log(props);

    return {
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
