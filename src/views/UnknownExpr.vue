<template>
<span>
  <TreeCommon :outermost="outermost" :isLeft="isLeft" :unknown="true">
    <template v-slot:innerText>
      <span @click="graphStateChange">start query:</span>
    </template>
    <template v-slot:addExpr>
      <PlusOutlined @click.stop="addExpr" class="ast-connector-plus ast-connector-plus-up" />
    </template>
<!--    <template v-slot:connector>-->
<!--      <div v-if="!outermost">-->
<!--        <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>-->
<!--        <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>-->
<!--      </div>-->
<!--    </template>-->
  </TreeCommon>
  <div class="ast-node" v-if="unknownExpr">
    <Expr :expr="unknownExpr" @updateValue="updateValue" :qlIndex="qlIndex" :showLeft="showLeft" :index="index" />
  </div>
</span>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import {defineAsyncComponent, inject, provide, ref} from "vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import {graphData} from "@/utils/store";
import bus from "@/utils/bus";
export default {
  name: "UnknownExpr",
  props: ['unknownExpr', 'showLeft', 'isLeft', 'index', 'outermost', 'qlIndex'],
  emits: ['updateValue'],
  components: {
    PlusOutlined,
    TreeCommon,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  setup(props, content) {

    const isQuery = ref(true)

    const queryAllData = async () => {
      // console.log( '+++============')
    }
    provide('queryAllData', queryAllData)

    const addExpr = () => {
      // const value = {
      //   unknownExpr: {
      //     unknownExpr: props.unknownExpr,
      //     showLeft: props.showLeft,
      //   }
      // }
      const value = {
        unknownExpr: props.unknownExpr,
        showLeft: props.showLeft,
      }
      content.emit('updateValue', [value, 'unknown', props.index, props.qlIndex])
    }

    const updateValue = (value) => {
      const [v, str, index, qlIndex] = value
      const data = {
        unknownExpr: v,
        showLeft: props.showLeft
      }

      console.log(v, str, data, 'unk update')
      content.emit('updateValue', [data, 'unknownExpr', index, qlIndex])
    }

    const graphStateChange = () => {
      graphData.state = isQuery.value ? 'noQuery' : 'init'
      graphData.data = []
      isQuery.value ? bus.emit('selectNodeChange', [props.qlIndex, false]) : bus.emit('selectNodeChange', [props.qlIndex, true])
      isQuery.value = !isQuery.value
    }

    return {
      addExpr,
      updateValue,
      graphStateChange,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
