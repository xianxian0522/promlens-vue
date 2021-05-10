<template>
<div>
  <TreeCommon :outermost="outermost" :isLeft="isLeft">
<!--    <template v-slot:connector>-->
<!--      <div v-if="!outermost">-->
<!--        <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>-->
<!--        <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>-->
<!--      </div>-->
<!--      <div v-else></div>-->
<!--    </template>-->
    <template v-slot:addExpr>
      <PlusOutlined @click.stop="addExpr" class="ast-connector-plus ast-connector-plus-up" />
    </template>
    <template v-slot:innerText>
      <PreviewAggregate :preview="aggregateExpr" :isShowExpr="true"/>
    </template>

    <template v-slot:infoLabel>
      <span v-if="showTips">
        <span class="ast-query-icon-tips"></span>
        <span class="ast-node-child-query-error-message">Please fill out missing child nodes</span>
      </span>
      <div style="display: inline-block" v-else>
        <span style="display: inline-block" v-if="data.status === 'success'">
          <span style="display: inline-block" v-if="!data.isLoading">
            {{ data.data.length }} results - 91ms -
            <span v-if="data.keyInfo.length > 0">
              <div class="ast-node-label-stats" v-for="(item, index) in data.keyInfo" :key="index">
              <span class="ast-label-name" style="color: green;">{{ item.name }}</span>
              :{{ item.value }},
              </div>
            </span>
            <span v-else>no labels</span>
          </span>
          <span v-else><a-spin /></span>
        </span>
        <div style="display: inline-block" v-else>
          <span v-if="!data.isLoading">
            <span class="ast-query-icon"></span>
            <span class="ast-node-query-error-message">Error executing query:{{ data.error }}</span>
          </span>
          <span v-else><a-spin /></span>
        </div>
      </div>
    </template>
  </TreeCommon>
  <div class="ast-node">
    <div v-if="aggregateExpr.functionArgs">
      <div v-for="(fun, index) in aggregateExpr.functionArgs" :key="index">
        <Expr :expr="fun" @updateValue="updateValue" :index="index" :showLeft="showLeft"/>
      </div>
    </div>
    <div v-else><Expr :expr="aggregateExpr.functionArgs" @updateValue="updateValue" :index="0" :showLeft="showLeft" /></div>
  </div>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import PreviewAggregate from "@/components/PreviewAggregate.vue";
import {PlusOutlined} from '@ant-design/icons-vue'
import {defineAsyncComponent, onMounted, provide, reactive, ref} from "vue";
import {promRepository} from "@/api/promRepository";
import {dataInfo, queryAggregate} from "@/utils/common";

export default {
  name: "AggregateExpr",
  components: {
    PlusOutlined,
    PreviewAggregate,
    TreeCommon,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  props: ['isLeft', 'aggregateExpr', 'showLeft', 'outermost'],
  emits: ['updateValue'],
  setup(props, content) {

    const preview = {
      aggregationType: props.aggregateExpr?.aggregateOp || 'sum',
      preserve: props.aggregateExpr?.aggregateModifier?.Without ? 'without' : 'by',
      groupingLabels: props.aggregateExpr?.aggregateModifier?.Without || props.aggregateExpr?.aggregateModifier?.By,
    }

    const data = reactive({
      status: '',
      data: [],
      keyInfo: [],
      error: '',
      isLoading: false,
    })
    const showTips = ref(true)

    const queryAllData = async () => {
      await queryInfo()
    }
    provide('queryAllData', queryAllData)

    const queryInfo = async () => {
      if (props.aggregateExpr.functionArgs?.length > 0) {
        data.isLoading = true
        try {
          await promRepository.queryDataAll( {query: queryAggregate(props.aggregateExpr)})
              .then((res: any) => {
                data.status = res.status
                data.data = res.data.result
                data.isLoading = false
                data.keyInfo = dataInfo(data.data)
              })
              .catch(err => {
                const value = {...err.response?.data}
                data.status = value.status
                data.error = value.error
                data.isLoading = false
              })
        } catch (err) {
          console.error(err)
        }
        showTips.value = false
      } else {
        showTips.value = true
      }
    }

    const addExpr = () => {
      // const value = {
      //   unknownExpr: {
      //     aggregateExpr: props.aggregateExpr,
      //     showLeft: props.showLeft,
      //   }
      // }
      const value = {
        aggregateExpr: props.aggregateExpr,
        showLeft: props.showLeft,
      }
      content.emit('updateValue', [value, 'unknown', props.index])
    }

    const updateValue = (value) => {
      const [v, str, index] = value
      const k = props.aggregateExpr.aggregateModifier.Without ? 'Without' : 'By'
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
      if (!data.aggregateExpr.functionArgs) {
        data.aggregateExpr.functionArgs = []
      }
      data.aggregateExpr.functionArgs[index] = v;
      console.log('updata agg', v, str, data)
      content.emit('updateValue', [data, 'aggregateExpr', index])
      queryInfo()
    }

    onMounted(() => {
      queryInfo()
    })

    return {
      showTips,
      data,
      // preview,
      updateValue,
      addExpr,
      queryInfo,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
