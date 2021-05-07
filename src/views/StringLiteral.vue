<template>
<div>
  <TreeCommon :outermost="outermost" :isLeft="isLeft">
    <template v-slot:addExpr>
      <PlusOutlined @click.stop="addExpr" class="ast-connector-plus ast-connector-plus-up" />
    </template>
    <template v-slot:innerText>
      <span class="promql-code" @click="queryInfo">
        <PreviewLiteralValue :preview="stringLiteral" numOrStr="stringLiteral" />
<!--          <span class="promql-keyword">{{stringLiteral}}</span>-->
      </span>
    </template>
<!--    <template v-slot:connector>-->
<!--      <div v-if="!outermost">-->
<!--        <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>-->
<!--        <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>-->
<!--      </div>-->
<!--    </template>-->
  </TreeCommon>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import PreviewLiteralValue from "@/components/PreviewLiteralValue.vue";
import {promRepository} from "@/api/promRepository";

export default {
  name: "StringLiteral",
  props: ['stringLiteral', 'showLeft', 'isLeft', 'index', 'outermost'],
  emits: ['updateValue'],
  components: {
    PlusOutlined,
    TreeCommon,
    PreviewLiteralValue,
  },
  setup(props, content) {

    const queryInfo = async () => {
      promRepository.queryAll({query: props.stringLiteral})
    }

    const addExpr = () => {
      // const data = {
      //   unknownExpr: {
      //     numberLiteral: props.stringLiteral,
      //     showLeft: props.showLeft,
      //   }
      // }
      const data = {
        numberLiteral: props.stringLiteral,
        showLeft: props.showLeft,
      }
      content.emit('updateValue', [data, 'unknown', props.index])
    }

    return {
      queryInfo,
      addExpr,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
