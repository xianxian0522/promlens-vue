<template>
<div>
  <div v-if="expr?.functionCall">
    <FunctionCall :qlIndex="qlIndex" :outermost="outermost" :functionCall="expr.functionCall" :isLeft="isLeft" :index="index" :showLeft="showLeft" @updateValue="updateValue"/>
  </div>
<!--  <div v-else-if="expr.matrixSelector">-->
<!--    <MatrixSelector :matrixSelector="expr.matrixSelector" />-->
<!--  </div>-->
  <div v-else-if="expr?.vectorSelector">
    <VectorSelector :qlIndex="qlIndex" :outermost="outermost" :vectorSelector="expr.vectorSelector" :index="index" :isLeft="isLeft" :showLeft="showLeft" @updateValue="updateValue" />
  </div>
  <div v-else-if="expr?.binaryExpr">
    <BinaryExpr :qlIndex="qlIndex" :outermost="outermost" :binaryExpr="expr.binaryExpr" @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
  <div v-else-if="expr?.numberLiteral === 0 || expr?.numberLiteral">
    <NumberLiteral :qlIndex="qlIndex" :outermost="outermost" :numberLiteral="expr.numberLiteral" @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
  <div v-else-if="expr?.stringLiteral === '' || expr?.stringLiteral">
    <StringLiteral :qlIndex="qlIndex" :outermost="outermost" :stringLiteral="expr.stringLiteral" @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
  <div v-else-if="expr?.aggregateExpr">
    <AggregateExpr :qlIndex="qlIndex" :outermost="outermost" :aggregateExpr="expr.aggregateExpr" @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
<!--  <div v-else-if="expr.offsetExpr">-->
<!--    {{ expr.offsetExpr }}-->
<!--  </div>-->
  <div v-else-if="expr?.parenExpr">
    <ParenthesesExpr :qlIndex="qlIndex" :outermost="outermost" :parenExpr=expr.parenExpr @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
  <div v-else-if="expr?.subqueryExpr">
    <SubqueryExpr :qlIndex="qlIndex" :outermost="outermost" :subqueryExpr="expr.subqueryExpr" @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
  <div v-else-if="expr?.unaryExpr">
    <UnaryExpression :qlIndex="qlIndex" :outermost="outermost" :unaryExpr="expr.unaryExpr" @updateValue="updateValue" :index="index" :isLeft="isLeft" :showLeft="showLeft" />
  </div>
  <div v-else-if="expr?.stepInvariantExpr">
    {{ expr.stepInvariantExpr }}
  </div>
  <div v-else>
    <UnknownExpr :qlIndex="qlIndex" :outermost="outermost" :unknownExpr="expr?.unknownExpr" :index="index" :isLeft="isLeft" :showLeft="showLeft" @updateValue="updateValue" />
  </div>
</div>
</template>

<script lang="ts">
import FunctionCall from "@/views/FunctionCall.vue";
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
    'outermost',
    'qlIndex',
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
    const exprChange = () => {
      return props.expr
    }

    provide('updateExprIndex', props.index)
    provide('updateLeft', props.showLeft)
    provide('updateQlIndex', props.qlIndex)
    provide('exprChange', exprChange)

    const updateValue = (value) => {
      const [v, str, index, qlIndex] = value
      let newValue
      if (str === 'unknown') {
        newValue = {
          unknownExpr: v
        }
      } else if (Object.prototype.hasOwnProperty.call(v, str)) {
        newValue = v
      } else {
        newValue = {
          [str]: v
        }
      }

      console.log(v, str, index, newValue, 'chu wen ti ')
      content.emit('updateValue', [newValue, str, index, qlIndex])
    }
    provide('updateExprValue', updateValue)

    return {
      updateValue,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
