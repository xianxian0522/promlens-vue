<template>
<div>
  <TreeCommon>
    <template v-slot:connector>
      <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>
      <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>
    </template>
    <template v-slot:addExpr>
      <PlusOutlined @click="addExpr" class="ast-connector-plus ast-connector-plus-up" />
    </template>
    <template v-slot:innerText>
<!--      <PreviewParentheses :preview="parenExpr" />-->
    </template>
  </TreeCommon>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import {PlusOutlined} from "@ant-design/icons-vue";

export default {
  name: "UnaryExpression",
  components: {
    TreeCommon,
    PlusOutlined,
  },
  props: ['unaryExpr', 'index', 'isLeft', 'showLeft'],
  emits: ['updateValue'],
  setup(props, content) {
    const addExpr = () => {
      const value = {
        unknownExpr: {
          unaryExpr: props.unaryExpr,
          showLeft: props.showLeft,
        }
      }
      content.emit('updateValue', [value, 'unknownExpr', props.index])
    }

    return {
      addExpr,
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
