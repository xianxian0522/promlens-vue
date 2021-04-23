<template>
<div>
  <div v-if="expr.functionCall">
    <FunctionCall :functionCall="expr.functionCall" :isLeft="isLeft" />
  </div>
  <div v-else-if="expr.matrixSelector">
    <MatrixSelector :matrixSelector="expr.matrixSelector" />
  </div>
  <div v-else-if="expr.vectorSelector">
    <VectorSelector :vectorSelector="expr.vectorSelector" />
  </div>
  <div v-else-if="expr.binaryExpr">
    <BinaryExpr :binaryExpr="expr.binaryExpr" />
  </div>
  <div v-else-if="expr.numberLiteral">
    <NumberLiteral :numberLiteral="expr.numberLiteral" />
  </div>
  <div v-else-if="expr.stringLiteral">
    <StringLiteral :stringLiteral="expr.stringLiteral" />
  </div>
  <div v-else-if="expr.aggregateExpr">
    {{ expr.aggregateExpr }}
  </div>
  <div v-else-if="expr.offsetExpr">
    {{ expr.offsetExpr }}
  </div>
  <div v-else-if="expr.parenExpr">
    {{ expr.parenExpr }}
  </div>
  <div v-else-if="expr.subqueryExpr">
    <SubqueryExpr :subqueryExpr="expr.subqueryExpr" />
  </div>
  <div v-else-if="expr.unaryExpr">
    {{ expr.unaryExpr }}
  </div>
  <div v-else-if="expr.stepInvariantExpr">
    {{ expr.stepInvariantExpr }}
  </div>
</div>
</template>

<script lang="ts">
import FunctionCall from "@/views/FunctionCall.vue";
import MatrixSelector from "@/views/MatrixSelector.vue";
import VectorSelector from "@/views/VectorSelector.vue";
import BinaryExpr from "@/views/BinaryExpr.vue";
import NumberLiteral from "@/views/NumberLiteral.vue";
import StringLiteral from "@/views/StringLiteral.vue";
import SubqueryExpr from "@/views/SubqueryExpr.vue";
import {provide, reactive, ref, toRefs} from "vue";

export default {
  name: "Expr",
  props: [
    // 'functionCall',
    // 'vectorSelector',
    // 'matrixSelector',
    // 'binaryExpr',
    'expr',
    'isLeft',
  ],
  components: {
    FunctionCall,
    MatrixSelector,
    VectorSelector,
    BinaryExpr,
    NumberLiteral,
    StringLiteral,
    SubqueryExpr,
  },
  setup(props: any) {
    // console.log(props, 'expr')
    const addExpr = () => {
      console.log('add')
      return props.expr
    }
    provide('addExpr', addExpr())

    return {
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
