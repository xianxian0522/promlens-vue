<template>
<div>
  <div >
<!--    <span>{{functionCall.functionIdentifier}}</span>-->
    <TreeCommon :isLeft="isLeft">
      <template v-slot:connector>
        <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>
        <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>
      </template>
      <template v-slot:addExpr>
        <PlusOutlined @click="addExpr" class="ast-connector-plus ast-connector-plus-up" />
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
        <Expr :expr="fun" @updateValue="updateValue"/>
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
  props: ['isLeft', 'functionCall'],
  components: {
    PlusOutlined,
    TreeCommon,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  emits: ['updateValue'],
  setup(props, content) {
    console.log(props);

    const addExpr = () => {
      console.log(props, 'add')
      const value = {
        unknownExpr: {
          functionCall: props.functionCall,
          isLeft: props.isLeft
        }
      }
      console.log(value, 'functionCall unknown');
      // content.emit('updateValue', [value, 'unknownExpr'])
    }

    const updateValue = (value) => {
      console.log(value, 'function value', props)
    }

    onMounted(() => {
    })

    return {
      addExpr,
      updateValue,
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
