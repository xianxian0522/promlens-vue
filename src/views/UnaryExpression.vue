<template>
<div>
  <TreeCommon :outermost="outermost" :isLeft="isLeft">
<!--    <template v-slot:connector>-->
<!--      <div v-if="!outermost">-->
<!--        <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>-->
<!--        <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>-->
<!--      </div>-->
<!--    </template>-->
    <template v-slot:addExpr>
      <PlusOutlined @click.stop="addExpr" class="ast-connector-plus ast-connector-plus-up" />
    </template>
    <template v-slot:innerText>
      <span >{{ unaryExpr.unaryOp }}</span>
    </template>
  </TreeCommon>
  <div class="ast-node">
    <Expr :expr="unaryExpr.expr" @updateValue="updateValue" :showLeft="showLeft" :index="index" />
  </div>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import PreviewUnary from "@/components/PreviewUnary.vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import {defineAsyncComponent} from "vue";

export default {
  name: "UnaryExpression",
  components: {
    TreeCommon,
    PlusOutlined,
    Expr: defineAsyncComponent(() => import('./Expr.vue')),
  },
  props: ['unaryExpr', 'index', 'isLeft', 'showLeft', 'outermost'],
  emits: ['updateValue'],
  setup(props, content) {

    // const parenExpr = {
    //   unaryOp: props.unaryExpr?.unaryOp || '-',
    //   expr: props.unaryExpr?.expr,
    // }

    const addExpr = () => {
      // const value = {
      //   unknownExpr: {
      //     unaryExpr: props.unaryExpr,
      //     showLeft: props.showLeft,
      //   }
      // }
      const value = {
        unaryExpr: props.unaryExpr,
        showLeft: props.showLeft,
      }
      content.emit('updateValue', [value, 'unknown', props.index])
    }

    const updateValue = (value) => {
      const [v, str, index] = value
      const data = {
        unaryExpr: {
          unaryOp: props.unaryExpr.unaryOp,
          expr: v
        },
        showLeft: props.showLeft
      }
      console.log('update unary', v, str, data)
      content.emit('updateValue', [data, 'unaryExpr', index])
    }

    return {
      // parenExpr,
      addExpr,
      updateValue,
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
