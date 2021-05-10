<template>
<span>
  <span v-if="preview.numberLiteral || preview.numberLiteral === 0">
    <span v-if="rightOrLeft === 'left'" class="left-or-right"></span>
    <PreviewLiteralValue :preview="preview.numberLiteral" numOrStr="numberLiteral" />
    <span v-if="rightOrLeft === 'right'" class="left-or-right"></span>
  </span>
  <span v-else-if="preview.stringLiteral || preview.stringLiteral === ''">
    <span v-if="rightOrLeft === 'left'" class="left-or-right"></span>
    <PreviewLiteralValue :preview="preview.stringLiteral" numOrStr="stringLiteral" />
    <span v-if="rightOrLeft === 'right'" class="left-or-right"></span>
  </span>
  <span v-else-if="preview.functionCall">
    <span v-if="rightOrLeft === 'left'" class="left-or-right"></span>
    <PreviewFunction :preview="preview.functionCall" />
    <span v-if="rightOrLeft === 'right'" class="left-or-right"></span>
  </span>
  <span v-else-if="preview.aggregateExpr">
    <span v-if="rightOrLeft === 'left'" class="left-or-right"></span>
    <PreviewAggregate :preview="preview.aggregateExpr" />
    <span v-if="rightOrLeft === 'right'" class="left-or-right"></span>
  </span>
  <span v-else-if="preview.vectorSelector">
    <span v-if="rightOrLeft === 'left'" class="left-or-right"></span>
    <PreviewSelectData :preview="preview.vectorSelector" />
    <span v-if="rightOrLeft === 'right'" class="left-or-right"></span>
  </span>
  <span v-else-if="preview.binaryExpr">
    <span v-if="rightOrLeft === 'left'" class="left-or-right"></span>
    <PreviewBinary :preview="preview.binaryExpr" />
    <span v-if="rightOrLeft === 'right'" class="left-or-right"></span>
  </span>
  <span v-else-if="preview.parenExpr">
    <span v-if="rightOrLeft === 'left'" class="left-or-right"></span>
    <PreviewParentheses :preview="preview.parenExpr" />
    <span v-if="rightOrLeft === 'right'" class="left-or-right"></span>
  </span>
  <span v-else-if="preview.subqueryExpr">
    <span v-if="rightOrLeft === 'left'" class="left-or-right"></span>
    <PreviewSubQuery :preview="preview.subqueryExpr" />
    <span v-if="rightOrLeft === 'right'" class="left-or-right"></span>
  </span>
  <span v-else-if="preview.unaryExpr">
    <span v-if="rightOrLeft === 'left'" class="left-or-right"></span>
    <PreviewUnary :preview="preview.unaryExpr" />
    <span v-if="rightOrLeft === 'right'" class="left-or-right"></span>
  </span>
</span>
</template>

<script lang="ts">
import {defineAsyncComponent} from "vue";

export default {
  name: "PreviewExpr",
  props: ['preview', 'rightOrLeft'],
  components: {
    PreviewFunction: defineAsyncComponent(() => import('./PreviewFunction.vue')),
    PreviewAggregate: defineAsyncComponent(() => import('./PreviewAggregate.vue')),
    PreviewSelectData: defineAsyncComponent(() => import('./PreviewSelectData.vue')),
    PreviewLiteralValue: defineAsyncComponent(() => import('./PreviewLiteralValue.vue')),
    PreviewBinary: defineAsyncComponent(() => import('./PreviewBinary.vue')),
    PreviewParentheses: defineAsyncComponent(() => import('./PreviewParentheses.vue')),
    PreviewSubQuery: defineAsyncComponent(() => import('./PreviewSubQuery.vue')),
    PreviewUnary: defineAsyncComponent(() => import('./PreviewUnary.vue')),
  },
  setup() {

  }
}
</script>

<style scoped lang="less">
@import "index.less";
.left-or-right {
  display: inline-block;
  width: 4px;
}
</style>
