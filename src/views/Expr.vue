<template>
<div>
  <div v-if="expr.functionCall">
    <FunctionCall :functionCall="expr.functionCall" />
  </div>
  <div v-if="expr.matrixSelector">
    <MatrixSelector :matrixSelector="expr.matrixSelector" />
  </div>
  <div v-if="expr.vectorSelector">
    <VectorSelector :vectorSelector="expr.vectorSelector" />
  </div>
  <div v-if="expr.binaryExpr">
    <BinaryExpr :binaryExpr="expr.binaryExpr" />
  </div>
  <div v-if="expr.numberLiteral">
    {{ expr.numberLiteral }}
  </div>
</div>
</template>

<script lang="ts">
import FunctionCall from "@/views/FunctionCall.vue";
import MatrixSelector from "@/views/MatrixSelector.vue";
import VectorSelector from "@/views/VectorSelector.vue";
import BinaryExpr from "@/views/BinaryExpr.vue";
import {reactive, ref, toRefs} from "vue";

export default {
  name: "Expr",
  props: [
    // 'functionCall',
    // 'vectorSelector',
    // 'matrixSelector',
    // 'binaryExpr',
    'expr',
  ],
  components: {
    FunctionCall,
    MatrixSelector,
    VectorSelector,
    BinaryExpr,
  },
  setup(props: any) {
    console.log(props, 'expr')

    return {
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
