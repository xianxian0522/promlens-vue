<template>
<div>
  <div ref="nodeRef" >
<!--    <span>{{functionCall.functionIdentifier}}</span>-->
    <TreeCommon @nodeRefHeight="nodeRefHeight" :outermost="outermost" :isLeft="isLeft" >
<!--      <template v-slot:connector>-->
<!--        <div v-if="!outermost">-->
<!--          <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>-->
<!--          <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>-->
<!--        </div>-->
<!--      </template>-->
      <template v-slot:addExpr>
        <PlusOutlined @click.stop="addExpr" class="ast-connector-plus ast-connector-plus-up" />
      </template>
      <template v-slot:innerText>
        <span class="promql-code">
          <span class="promql-keyword">{{functionCall.functionIdentifier}}</span>
        </span>
      </template>
<!--    需要判断是否有  -->
<!--      <template v-slot:infoLabel>-->
<!--        16 results - 91ms - -->
<!--        <div class="ast-node-label-stats">-->
<!--          <span class="ast-label-name" style="color: green;">host</span>-->
<!--          :16,-->
<!--        </div>-->
<!--        <div class="ast-node-label-stats">-->
<!--          <span class="ast-label-name" style="color: green;">instance</span>-->
<!--          :16,-->
<!--        </div>-->
<!--      </template>-->
    </TreeCommon>
    <div class="ast-node">
      <div v-for="(fun, index) in functionCall.functionArgs" :key="index">
        <Expr :expr="fun" @updateValue="updateValue" :index="index" :showLeft="showLeft"/>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {Component, defineAsyncComponent, inject, onMounted, ref, watch} from "vue";
import TreeCommon from "@/components/TreeCommon.vue";
import {PlusOutlined,} from '@ant-design/icons-vue'

export default {
  name: "FunctionCall",
  props: ['isLeft', 'functionCall', 'showLeft', 'outermost'],
  components: {
    PlusOutlined,
    TreeCommon,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  emits: ['updateValue'],
  setup(props, content) {
    // console.log(props);

    const nodeRef = ref()

    const nodeRefHeight = () => {
      console.log(nodeRef.value.offsetHeight, 'height')
    }

    const addExpr = () => {
      // const value = {
      //   unknownExpr: {
      //     functionCall: props.functionCall,
      //     showLeft: props.showLeft,
      //   }
      // }
      const value = {
        functionCall: props.functionCall,
        showLeft: props.showLeft,
      }
      // console.log(value, 'functionCall unknown');
      content.emit('updateValue', [value, 'unknown', props.index])
    }

    const updateValue = (value) => {
      const [v, str, index] = value
      // const data = {
      //   functionCall: {
      //     functionIdentifier: props.functionCall.functionIdentifier,
      //     functionArgs: props.functionCall.functionArgs,
      //   },
      //   showLeft: props.showLeft,
      // }
      const data = {
        functionCall: props.functionCall,
        showLeft: props.showLeft,
      }
      data.functionCall.functionArgs[index] = v;
      console.log(v, str, data, 'function updata')
      content.emit('updateValue', [data, 'functionCall', index])
    }

    onMounted(() => {
    })

    return {
      nodeRef,
      addExpr,
      updateValue,
      nodeRefHeight,
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
