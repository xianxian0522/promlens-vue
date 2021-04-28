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
      <PreviewAggregate :preview="preview" />
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
  props: ['isLeft', 'aggregateExpr', 'showLeft', 'index'],
  emits: ['updateValue'],
  setup(props, content) {

    const preview = {
      aggregationType: props.aggregateExpr.aggregateOp || 'sum',
      preserve: props.aggregateExpr.aggregateModifier.Without ? 'without' : 'by',
      groupingLabels: props.aggregateExpr.aggregateModifier.Without || props.aggregateExpr.aggregateModifier.By,
    }

    const addExpr = () => {
      const value = {
        unknownExpr: {
          aggregateExpr: props.aggregateExpr,
          showLeft: props.showLeft,
        }
      }
      content.emit('updateValue', [value, 'unknownExpr', props.index])
    }

    const updateValue = (value) => {
      const [v, str, index] = value
      const k = props.aggregateExpr.aggregateModifier.Without ? 'without' : 'by'
      const data = {
        aggregateExpr: {
          aggregateOp: props.aggregateExpr.aggregateOp,
          aggregateModifier: {
            [k]: props.aggregateExpr.aggregateModifier.Without || props.aggregateExpr.aggregateModifier.By
          },
          functionArgs: props.aggregateExpr.functionArgs,
        },
        showLeft: props.showLeft,
      }
      data.aggregateExpr.functionArgs[index] = v;
      content.emit('updateValue', [data, str, index])
    }

    return {
      preview,
      updateValue,
      addExpr,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
