<template>
<div>
  <TreeCommon>
    <template v-slot:addExpr>
      <PlusOutlined @click="addExpr" class="ast-connector-plus ast-connector-plus-up" />
    </template>
    <template v-slot:innerText>
      <PreviewLiteralValue :preview="numberLiteral" numOrStr="numberLiteral" />
<!--       <span class="promql-code">-->
<!--          <span class="promql-keyword">{{numberLiteral}}</span>-->
<!--       </span>-->
    </template>
    <template v-slot:connector>
      <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>
      <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>
    </template>
  </TreeCommon>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import PreviewLiteralValue from "@/components/PreviewLiteralValue.vue";
import {PlusOutlined} from "@ant-design/icons-vue";

export default {
  name: "NumberLiteral",
  props: ['numberLiteral', 'isLeft', 'showLeft', 'index'],
  emits: ['updateValue'],
  components: {
    PlusOutlined,
    TreeCommon,
    PreviewLiteralValue,
  },
  setup(props, content) {
    const addExpr = () => {
      // const data = {
      //   unknownExpr: {
      //     numberLiteral: props.numberLiteral,
      //     showLeft: props.showLeft,
      //   }
      // }
      const data = {
        numberLiteral: props.numberLiteral,
        showLeft: props.showLeft,
      }
      content.emit('updateValue', [data, 'unknown', props.index])
    }

    return {
      addExpr,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
