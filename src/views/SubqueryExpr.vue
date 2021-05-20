<template>
  <div>
<!--    <Expr :expr="subqueryExpr.expr" />-->
    <TreeCommon :outermost="outermost" :isLeft="isLeft">
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
        <span class="promql-code" @click="queryInfo">
          <PreviewSubQuery :preview="subqueryExpr" :ellipsis="false"/>
        </span>
<!--        [<span class="ast-duration">{{ subqueryExpr.duration }}</span>:<span class="ast-duration">1m</span>]-->
      </template>
      <template v-slot:infoLabel>
        <CommonInfoLabel :data="data" :showTips="showTips" />
      </template>
    </TreeCommon>
    <div class="ast-node">
      <Expr :expr="subqueryExpr.expr" @updateValue="updateValue" :qlIndex="qlIndex" :showLeft="showLeft" :index="index" />
    </div>
  </div>
</template>

<script lang="ts">
import TreeCommon from '@/components/TreeCommon.vue'
import CommonInfoLabel from "@/components/CommonInfoLabel.vue";
import PreviewSubQuery from "@/components/PreviewSubQuery.vue";
import {defineAsyncComponent, onBeforeUnmount, onMounted, provide, reactive, ref} from "vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import promRepository from "@/api/promRepository";
import {dataInfo, querySubquery} from "@/utils/common";
import bus from "@/utils/bus";

export default {
  name: "SubqueryExpr",
  props: ['subqueryExpr', 'isLeft', 'showLeft', 'index', 'outermost', 'qlIndex'],
  components: {
    TreeCommon,
    PlusOutlined,
    PreviewSubQuery,
    CommonInfoLabel,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  emits: ['updateValue'],
  setup(props, content) {
    const preview = {
      offset: props.subqueryExpr?.offsetExpr?.duration || '0s',
      range: props.subqueryExpr?.range || '1h',
      step: props.subqueryExpr?.step || '0s',
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
      if (props.subqueryExpr?.expr) {
        if (!Object.prototype.hasOwnProperty.call(props.subqueryExpr?.expr, 'unknownExpr')) {
          data.isLoading = true
          try {
            await promRepository.queryDataAll( {query: querySubquery(props.subqueryExpr)})
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
      } else {
        showTips.value = true
      }
    }

    const addExpr = () => {
      console.log(props, 'props')
      // const value = {
      //   unknownExpr: {
      //     subqueryExpr: props.subqueryExpr,
      //     showLeft: props.showLeft,
      //   }
      // }
      const value = {
        subqueryExpr: props.subqueryExpr,
        showLeft: props.showLeft,
      }
      content.emit('updateValue', [value, 'unknown', props.index, props.qlIndex])
    }

    const updateValue = async (value) => {
      const [v, str, index, qlIndex] = value
      const data = {
        subqueryExpr: props.subqueryExpr,
        showLeft: props.showLeft
      }
      data.subqueryExpr.expr = v
      console.log(v, str, data, 'subqueryExpr')
      await content.emit('updateValue', [data, 'subqueryExpr', index, qlIndex])
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
      data,
      showTips,
      preview,
      addExpr,
      updateValue,
      queryInfo,
    }
  }
}
</script>

<style scoped>

</style>
