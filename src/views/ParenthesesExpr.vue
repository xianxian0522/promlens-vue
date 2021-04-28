<template>
<span>
  <TreeCommon>
    <template v-slot:connector>
        <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>
        <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>
      </template>
      <template v-slot:addExpr>
        <PlusOutlined @click="addExpr" class="ast-connector-plus ast-connector-plus-up" />
      </template>
      <template v-slot:innerText>
        <PreviewParentheses :preview="parenExpr" />
      </template>
  </TreeCommon>
  <div class="ast-node">
    <Expr :expr="parenExpr" @updateValue="updateValue" :showLeft="showLeft" :index="index" />
  </div>
</span>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import PreviewParentheses from "@/components/PreviewParentheses.vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import {defineAsyncComponent} from "vue";

export default {
  name: "ParenthesesExpr",
  components: {
    TreeCommon,
    PreviewParentheses,
    PlusOutlined,
    Expr: defineAsyncComponent(() => import('./Expr.vue')),
  },
  props: ['isLeft', 'parenExpr', 'index', 'showLeft'],
  emits: ['updateValue'],
  setup(props, content) {
    const addExpr = () => {
      const value = {
        unknownExpr: {
          parenExpr: props.parenExpr,
          showLeft: props.showLeft,
        }
      }
      content.emit('updateValue', [value, 'unknownExpr'])
    }
    const updateValue = (value) => {
      console.log(value, 'parentheses')
    }

    return {
      addExpr,
      updateValue,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
