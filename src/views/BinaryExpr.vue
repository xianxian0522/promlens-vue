<template>
  <TreeCommon>
    <template v-slot:nodeLeftChild>
      <div class="ast-node">
        <Expr :expr="binaryExpr.left" :isLeft="true" @updateValue="updateValue" />
      </div>
    </template>
    <template v-slot:innerText>
      <div>{{ binaryExpr.operator }}</div>
    </template>
    <template v-slot:nodeRightChild>
      <div class="ast-node">
        <Expr :expr="binaryExpr.right" @updateValue="updateValue" />
      </div>
    </template>
  </TreeCommon>
</template>

<script lang="ts">
import {defineAsyncComponent, inject, provide} from "vue";
import TreeCommon from "@/components/TreeCommon.vue";

export default {
  name: "BinaryExpr",
  props: ['binaryExpr'],
  components: {
    TreeCommon,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  emits: ['updateValue'],
  setup(props: any, content) {
    console.log(props, 'binary')

    const updateValue = (value) => {
      console.log(value, 'binary', props)
      const [v,] = value
      let data = {
        left: props.binaryExpr.left,
        operator: props.binaryExpr.operator,
        right: props.binaryExpr.right,
      }
      if (v.unknownExpr && v.unknownExpr.isLeft) {
        console.log('value xxx', v.unknownExpr)
        data.left = v;
      } else if (v.unknownExpr && !v.unknownExpr.isLeft) {
        data.right = v;
      }
      content.emit('updateValue', [data, 'binaryExpr'])
    }

    return {
      updateValue,
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
