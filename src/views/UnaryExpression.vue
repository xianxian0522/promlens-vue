<template>
<div>
  <TreeCommon :outermost="outermost" :isLeft="isLeft">
<!--    <template v-slot:connector>-->
<!--      <div v-if="!outermost">-->
<!--        <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>-->
<!--        <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>-->
<!--      </div>-->
<!--    </template>-->
    <template v-slot:addExpr>
      <PlusOutlined @click.stop="addExpr" class="ast-connector-plus ast-connector-plus-up" />
    </template>
    <template v-slot:innerText>
      <span class="promql-code" @click="changeQueryInfo">{{ unaryExpr.unaryOp }}</span>
    </template>
    <template v-slot:infoLabel>
      <CommonInfoLabel :data="data" :showTips="showTips" />
    </template>
  </TreeCommon>
  <div class="ast-node">
    <Expr :expr="unaryExpr.expr" @updateValue="updateValue" :qlIndex="qlIndex" :showLeft="showLeft" :index="index" />
  </div>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import PreviewUnary from "@/components/PreviewUnary.vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import {defineAsyncComponent, onBeforeUnmount, onMounted, provide, reactive, ref} from "vue";
import CommonInfoLabel from "@/components/CommonInfoLabel.vue";
import promRepository from "@/api/promRepository";
import {dataInfo, queryUnary} from "@/utils/common";
import bus from "@/utils/bus";
import {graphData} from "@/utils/store";

export default {
  name: "UnaryExpression",
  components: {
    TreeCommon,
    CommonInfoLabel,
    PlusOutlined,
    Expr: defineAsyncComponent(() => import('./Expr.vue')),
  },
  props: ['unaryExpr', 'index', 'isLeft', 'showLeft', 'outermost', 'qlIndex'],
  emits: ['updateValue'],
  setup(props, content) {

    // const parenExpr = {
    //   unaryOp: props.unaryExpr?.unaryOp || '-',
    //   expr: props.unaryExpr?.expr,
    // }

    const data = reactive({
      status: '',
      data: [],
      keyInfo: [],
      error: '',
      isLoading: false,
    })
    const showTips = ref(true)
    const isQuery = ref(true)

    const queryAllData = async () => {
      await queryInfo()
    }
    provide('queryAllData', queryAllData)

    const queryInfo = async () => {
      if (props.unaryExpr?.expr) {
        if (!Object.prototype.hasOwnProperty.call(props.unaryExpr?.expr, 'unknownExpr')) {
          data.isLoading = true
          try {
            await promRepository.queryDataAll( {query: queryUnary(props.unaryExpr)})
                .then((res: any) => {
                  data.status = res.status
                  data.data = res.data.result
                  data.isLoading = false
                  graphData.data = data.data
                  graphData.state = 'data'
                  graphData.resultType = res.data.resultType
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
      } else {
        showTips.value = true
      }
    }

    const changeQueryInfo = () => {
      if (isQuery.value) {
        graphData.data = []
        graphData.state = 'noQuery'
        isQuery.value = false
        bus.emit('selectNodeChange', [props.qlIndex, false])
      } else {
        // queryInfo()
        isQuery.value = true
        const query = queryUnary(props.unaryExpr)
        bus.emit('queryGraph', query)
        bus.emit('selectNodeChange', [props.qlIndex, true])
      }
    }

    const addExpr = () => {
      // const value = {
      //   unknownExpr: {
      //     unaryExpr: props.unaryExpr,
      //     showLeft: props.showLeft,
      //   }
      // }
      const value = {
        unaryExpr: props.unaryExpr,
        showLeft: props.showLeft,
      }
      content.emit('updateValue', [value, 'unknown', props.index, props.qlIndex])
    }

    const updateValue = async (value) => {
      const [v, str, index, qlIndex] = value
      const data = {
        unaryExpr: {
          unaryOp: props.unaryExpr.unaryOp,
          expr: v
        },
        showLeft: props.showLeft
      }
      console.log('update unary', v, str, data)
      await content.emit('updateValue', [data, 'unaryExpr', index, qlIndex])
      await queryInfo()
    }

    const parseEmitQuery = (data) => {
      const [index, err] = data
      if (index === props.qlIndex) {
        if (err) {
          if (err === 'success') {
            bus.emit('parseError', [props.qlIndex, false, ''])
            queryInfo()
          } else {
            bus.emit('parseError', [props.qlIndex, true, err])
          }
        } else {
          bus.emit('parseError', [props.qlIndex, false, ''])
        }
      }
    }

    onMounted(() => {
      queryInfo()

      bus.on('busQuery',  parseEmitQuery)
    })
    onBeforeUnmount(() => {
      bus.off('busQuery', parseEmitQuery)
    })

    return {
      showTips,
      data,
      // parenExpr,
      addExpr,
      updateValue,
      changeQueryInfo,
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
