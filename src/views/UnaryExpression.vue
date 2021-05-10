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
      <span class="promql-code" @click="queryInfo">{{ unaryExpr.unaryOp }}</span>
    </template>
    <template v-slot:infoLabel>
      <CommonInfoLabel :data="data" :showTips="showTips" />
    </template>
  </TreeCommon>
  <div class="ast-node">
    <Expr :expr="unaryExpr.expr" @updateValue="updateValue" :showLeft="showLeft" :index="index" />
  </div>
</div>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import PreviewUnary from "@/components/PreviewUnary.vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import {defineAsyncComponent, onMounted, provide, reactive, ref} from "vue";
import CommonInfoLabel from "@/components/CommonInfoLabel.vue";
import {promRepository} from "@/api/promRepository";
import {dataInfo, queryUnary} from "@/utils/common";

export default {
  name: "UnaryExpression",
  components: {
    TreeCommon,
    CommonInfoLabel,
    PlusOutlined,
    Expr: defineAsyncComponent(() => import('./Expr.vue')),
  },
  props: ['unaryExpr', 'index', 'isLeft', 'showLeft', 'outermost'],
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

    const queryAllData = async () => {
      await queryInfo()
    }
    provide('queryAllData', queryAllData)

    const queryInfo = async () => {
      if (props.unaryExpr?.expr) {
        data.isLoading = true
        try {
          await promRepository.queryDataAll( {query: queryUnary(props.unaryExpr)})
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
      //     unaryExpr: props.unaryExpr,
      //     showLeft: props.showLeft,
      //   }
      // }
      const value = {
        unaryExpr: props.unaryExpr,
        showLeft: props.showLeft,
      }
      content.emit('updateValue', [value, 'unknown', props.index])
    }

    const updateValue = async (value) => {
      const [v, str, index] = value
      const data = {
        unaryExpr: {
          unaryOp: props.unaryExpr.unaryOp,
          expr: v
        },
        showLeft: props.showLeft
      }
      console.log('update unary', v, str, data)
      await content.emit('updateValue', [data, 'unaryExpr', index])
      await queryInfo()
    }

    onMounted(() => {
      queryInfo()
    })

    return {
      showTips,
      data,
      // parenExpr,
      addExpr,
      updateValue,
      queryInfo,
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
