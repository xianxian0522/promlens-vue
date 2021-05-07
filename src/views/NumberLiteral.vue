<template>
<div>
  <TreeCommon :outermost="outermost" :isLeft="isLeft">
    <template v-slot:addExpr>
      <PlusOutlined @click.stop="addExpr" class="ast-connector-plus ast-connector-plus-up" />
    </template>
    <template v-slot:innerText>
      <span class="promql-code" @click="queryInfo">
        <PreviewLiteralValue :preview="numberLiteral" numOrStr="numberLiteral" />
<!--          <span class="promql-keyword">{{numberLiteral}}</span>-->
      </span>
    </template>
<!--    <template v-slot:connector>-->
<!--      <div v-if="!outermost">-->
<!--        <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>-->
<!--        <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>-->
<!--      </div>-->
<!--    </template>-->
    <template v-slot:infoLabel>
      <div style="display: inline-block" v-if="data.status === 'success'">
        <span v-if="!data.isLoading"></span>
        <span v-else><a-spin /></span>
      </div>
      <div style="display: inline-block" v-else>
        <span v-if="!data.isLoading">
          <span class="ast-query-icon"></span>
          <span class="ast-node-query-error-message">Error executing query:{{ data.error }}</span>
        </span>
        <span v-else><a-spin /></span>
      </div>
    </template>
  </TreeCommon>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import PreviewLiteralValue from "@/components/PreviewLiteralValue.vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import {inject, ref} from "vue";
import {promRepository} from "@/api/promRepository";
import {numberLiteral} from "@/utils/store";

export default {
  name: "NumberLiteral",
  props: ['numberLiteral', 'isLeft', 'showLeft', 'index', 'outermost'],
  emits: ['updateValue'],
  components: {
    PlusOutlined,
    TreeCommon,
    PreviewLiteralValue,
  },
  setup(props, content) {

    const data = ref(numberLiteral)
    const queryInfo = async () => {
      promRepository.queryLiteral('numberLiteral', {query: props.numberLiteral})
    }

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
      data,
      addExpr,
      queryInfo,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
