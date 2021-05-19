<template>
<span>
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
      <span class="promql-code" @click="queryInfo">
        <span class="promql-paren">()</span>
      </span>
    </template>
    <template v-slot:infoLabel>
      <CommonInfoLabel :showTips="showTips" :data="data" />
    </template>
  </TreeCommon>
  <div class="ast-node">
    <Expr :expr="parenExpr.expr" @updateValue="updateValue" :qlIndex="qlIndex" :showLeft="showLeft" :index="index" />
  </div>
</span>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import PreviewParentheses from "@/components/PreviewParentheses.vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import {defineAsyncComponent, onMounted, provide, reactive, ref} from "vue";
import promRepository from "@/api/promRepository";
import {dataInfo, queryParentheses} from "@/utils/common";
import CommonInfoLabel from "@/components/CommonInfoLabel.vue";
import bus from "@/utils/bus";

export default {
  name: "ParenthesesExpr",
  components: {
    TreeCommon,
    CommonInfoLabel,
    // PreviewParentheses,
    PlusOutlined,
    Expr: defineAsyncComponent(() => import('./Expr.vue')),
  },
  props: ['isLeft', 'parenExpr', 'index', 'showLeft', 'outermost', 'qlIndex'],
  emits: ['updateValue'],
  setup(props, content) {

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
      if (props.parenExpr?.expr) {
        if (!Object.prototype.hasOwnProperty.call(props.parenExpr?.expr, 'unknownExpr')) {
          data.isLoading = true
          try {
            await promRepository.queryDataAll( {query: queryParentheses(props.parenExpr)})
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
      // const value = {
      //   unknownExpr: {
      //     parenExpr: props.parenExpr,
      //     showLeft: props.showLeft,
      //   }
      // }
      const value = {
        parenExpr: props.parenExpr,
        showLeft: props.showLeft,
      }
      content.emit('updateValue', [value, 'unknown', props.index, props.qlIndex])
    }
    const updateValue = async (value) => {
      const [v, str, index, qlIndex] = value
      const data = {
        parenExpr: {
          expr: v,
          parentheses: props.parenExpr.parentheses
        },
        showLeft: props.showLeft
      }
      console.log(v, str, data, 'parentheses')
      await content.emit('updateValue', [data, 'parenExpr', index, qlIndex])
      await queryInfo()
    }

    onMounted(() => {
      queryInfo()

      bus.on('busQuery',  (data) => {
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
      })
    })

    return {
      data,
      showTips,
      addExpr,
      updateValue,
      queryInfo,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
