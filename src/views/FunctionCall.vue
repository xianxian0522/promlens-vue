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
        <span class="promql-code" @click="queryInfo">
          <span class="promql-keyword">{{functionCall.functionIdentifier}}</span>
        </span>
      </template>
      <template v-slot:infoLabel>
        <CommonInfoLabel :showTips="showTips" :data="data" />
      </template>
    </TreeCommon>
    <div class="ast-node">
      <div v-if="functionCall.functionArgs.length > 0">
        <div v-for="(fun, index) in functionCall.functionArgs" :key="index">
          <Expr :expr="fun" @updateValue="updateValue" :qlIndex="qlIndex" :index="index" :showLeft="showLeft"/>
        </div>
      </div>
      <div v-else><Expr :expr="functionCall.functionArgs[0]" @updateValue="updateValue" :qlIndex="qlIndex" :index="0" :showLeft="showLeft" /></div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {Component, defineAsyncComponent, inject, onMounted, provide, reactive, ref, watch} from "vue";
import TreeCommon from "@/components/TreeCommon.vue";
import CommonInfoLabel from "@/components/CommonInfoLabel.vue";
import {PlusOutlined,} from '@ant-design/icons-vue'
import {promRepository} from "@/api/promRepository";
import {dataInfo, queryFunction} from "@/utils/common";

export default {
  name: "FunctionCall",
  props: ['isLeft', 'functionCall', 'showLeft', 'outermost', 'qlIndex'],
  components: {
    PlusOutlined,
    TreeCommon,
    CommonInfoLabel,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  emits: ['updateValue'],
  setup(props, content) {
    // console.log(props);

    const nodeRef = ref()
    const data = reactive({
      status: '',
      data: [],
      keyInfo: [],
      error: '',
      isLoading: false,
    })
    const showTips = ref(true)

    const nodeRefHeight = () => {
      console.log(nodeRef.value.offsetHeight, 'height')
    }

    const queryAllData = async () => {
      await queryInfo()
    }
    provide('queryAllData', queryAllData)

    const queryInfo = async () => {
      if (props.functionCall.functionArgs?.length > 0) {
        data.isLoading = true
        try {
          await promRepository.queryDataAll( {query: queryFunction(props.functionCall)})
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
      //     functionCall: props.functionCall,
      //     showLeft: props.showLeft,
      //   }
      // }
      const value = {
        functionCall: props.functionCall,
        showLeft: props.showLeft,
      }
      // console.log(value, 'functionCall unknown');
      content.emit('updateValue', [value, 'unknown', props.index, props.qlIndex])
    }

    const updateValue = async (value) => {
      const [v, str, index, qlIndex] = value
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
      if (!data.functionCall.functionArgs) {
        data.functionCall.functionArgs = []
      }
      data.functionCall.functionArgs[index] = v;
      console.log(v, str, data, 'function updata')
      await content.emit('updateValue', [data, 'functionCall', index, qlIndex])
      await queryInfo()
    }

    onMounted(() => {
      queryInfo()
    })

    return {
      data,
      showTips,
      nodeRef,
      addExpr,
      updateValue,
      nodeRefHeight,
      queryInfo,
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
