<template>
<div>
  <div v-if="expr.functionCall">
    <FunctionCall :functionCall="expr.functionCall" :isLeft="isLeft" :index="index" :showLeft="showLeft" @updateValue="updateValue"/>
  </div>
<!--  <div v-else-if="expr.matrixSelector">-->
<!--    <MatrixSelector :matrixSelector="expr.matrixSelector" />-->
<!--  </div>-->
  <div v-else-if="expr.vectorSelector">
    <VectorSelector :vectorSelector="expr.vectorSelector" :index="index" :isLeft="isLeft" :showLeft="showLeft" @updateValue="updateValue" />
  </div>
  <div v-else-if="expr.binaryExpr">
    <BinaryExpr :binaryExpr="expr.binaryExpr" @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
  <div v-else-if="expr.numberLiteral">
    <NumberLiteral :numberLiteral="expr.numberLiteral" @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
  <div v-else-if="expr.stringLiteral">
    <StringLiteral :stringLiteral="expr.stringLiteral" @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
  <div v-else-if="expr.aggregateExpr">
    <AggregateExpr :aggregateExpr="expr.aggregateExpr" @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
<!--  <div v-else-if="expr.offsetExpr">-->
<!--    {{ expr.offsetExpr }}-->
<!--  </div>-->
  <div v-else-if="expr.parenExpr">
    <ParenthesesExpr :parenExpr=expr.parenExpr @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
  <div v-else-if="expr.subqueryExpr">
    <SubqueryExpr :subqueryExpr="expr.subqueryExpr" @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
  <div v-else-if="expr.unaryExpr">
    <UnaryExpression :unaryExpr="expr.unaryExpr" @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
  <div v-else-if="expr.stepInvariantExpr">
    {{ expr.stepInvariantExpr }}
  </div>
  <div v-else>
    <UnknownExpr :unknownExpr="expr.unknownExpr" :index="index" :isLeft="isLeft" :showLeft="showLeft" @updateValue="updateValue" />
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
import UnknownExpr from "@/views/UnknownExpr.vue";
import AggregateExpr from "@/views/AggregateExpr.vue";
import ParenthesesExpr from "@/views/ParenthesesExpr.vue";
import UnaryExpression from "@/views/UnaryExpression.vue";
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
    'showLeft',
    'index',
  ],
  components: {
    FunctionCall,
    // MatrixSelector,
    VectorSelector,
    BinaryExpr,
    NumberLiteral,
    StringLiteral,
    SubqueryExpr,
    UnknownExpr,
    AggregateExpr,
    ParenthesesExpr,
    UnaryExpression,
  },
  emits: ['updateValue'],
  setup(props: any, content) {
    // console.log(props, 'expr')
    const addExpr = () => {
      return props.expr
    }
    provide('addExpr', addExpr())

    const updateValue = (value) => {
      console.log(value, 'expr xxx')
      const [v, str, index] = value
      content.emit('updateValue', [v, str,index])
    }

    return {
      updateValue,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
