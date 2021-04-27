<template>
<div>
  <TreeCommon >
    <template v-slot:connector>
      <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>
      <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>
    </template>
    <template v-slot:addExpr>
      <PlusOutlined @click="addExpr" class="ast-connector-plus ast-connector-plus-up" />
    </template>
    <template v-slot:innerText>
      <PreviewAggregate :preview="aggregateExpr" />
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
    <div v-for="(fun, index) in aggregateExpr.functionArgs" :key="index">
      <Expr :expr="fun" @updateValue="updateValue" :index="index" :showLeft="showLeft"/>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import PreviewAggregate from "@/components/PreviewAggregate.vue";
import {PlusOutlined} from '@ant-design/icons-vue'
import {defineAsyncComponent} from "vue";

export default {
  name: "AggregateExpr",
  components: {
    PlusOutlined,
    PreviewAggregate,
    TreeCommon,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  props: ['isLeft', 'aggregateExpr', 'showLeft'],
  emits: ['updateValue'],
  setup(props, content) {

    const addExpr = () => {
      console.log('add agg')
    }

    const updateValue = () => {
      console.log('agg')
    }

    return {
      updateValue,
      addExpr,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
