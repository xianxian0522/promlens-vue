<template>
<div>
  <div >
<!--    <span>{{functionCall.functionIdentifier}}</span>-->
    <TreeCommon >
      <template v-slot:connector>
        <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>
        <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>
      </template>
      <template v-slot:innerText>
        <span class="promql-code">
          <span class="promql-keyword">{{functionCall.functionIdentifier}}</span>
        </span>
      </template>
<!--    需要判断是否有  -->
<!--      <template v-slot:infoLabel>-->
<!--        16 results - 91ms - -->
<!--        <div class="ast-node-label-stats">-->
<!--          <span class="ast-label-name" style="color: green;">host</span>-->
<!--          :16,-->
<!--        </div>-->
<!--        <div class="ast-node-label-stats">-->
<!--          <span class="ast-label-name" style="color: green;">instance</span>-->
<!--          :16,-->
<!--        </div>-->
<!--      </template>-->
    </TreeCommon>
    <div class="ast-node">
      <div v-for="(fun, index) in functionCall.functionArgs" :key="index">
        <Expr :expr="fun"/>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {Component, defineAsyncComponent, onMounted, ref} from "vue";
import TreeCommon from "@/components/TreeCommon.vue";

export default {
  name: "FunctionCall",
  props: ['isLeft', 'functionCall'],
  components: {
    TreeCommon,
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
