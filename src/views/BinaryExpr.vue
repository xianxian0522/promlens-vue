<template>
  <TreeCommon :outermost="outermost" :isLeft="isLeft">
    <template v-slot:addExpr>
      <PlusOutlined @click.stop="addExpr" class="ast-connector-plus ast-connector-plus-up" />
    </template>
    <template v-slot:nodeLeftChild>
      <div class="ast-node">
        <Expr :expr="binaryExpr.left" :isLeft="true" :showLeft="true" :qlIndex="qlIndex" @updateValue="updateValue" :index="index" />
      </div>
    </template>
    <template v-slot:innerText>
      <span class="promql-code" @click="changeQueryInfo">
        <PreviewBinary :preview="binaryExpr" :ellipsis="false" />
      </span>
<!--      <div>{{ binaryExpr.operator }}</div>-->
    </template>
<!--    <template v-slot:connector>-->
<!--      <div v-if="!outermost">-->
<!--        <div v-if="isLeft" class="ast-connector ast-connector-down" style="bottom: -80px"></div>-->
<!--        <div v-else class="ast-connector ast-connector-up" style="top: -4px"></div>-->
<!--      </div>-->
<!--    </template>-->
    <template v-slot:nodeRightChild>
      <div class="ast-node">
        <Expr :expr="binaryExpr.right" @updateValue="updateValue" :qlIndex="qlIndex" :index="index" />
      </div>
    </template>

    <template v-slot:infoLabel>
      <CommonInfoLabel :showTips="showTips" :data="data" />
    </template>
  </TreeCommon>
</template>

<script lang="ts">
import {defineAsyncComponent, inject, onBeforeUnmount, onMounted, provide, reactive, ref} from "vue";
import TreeCommon from "@/components/TreeCommon.vue";
import CommonInfoLabel from "@/components/CommonInfoLabel.vue";
import PreviewBinary from "@/components/PreviewBinary.vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import {binaryOperation, graphData} from "@/utils/store";
import promRepository from "@/api/promRepository";
import {dataInfo, queryBinary} from "@/utils/common";
import bus from "@/utils/bus";

export default {
  name: "BinaryExpr",
  props: ['binaryExpr', 'index', 'outermost', 'isLeft', 'qlIndex'],
  components: {
    PlusOutlined,
    TreeCommon,
    PreviewBinary,
    CommonInfoLabel,
    Expr: defineAsyncComponent(() => import('./Expr.vue'))
  },
  emits: ['updateValue'],
  setup(props: any, content) {
    // console.log(props, 'binary')

    const data = reactive({
      status: '',
      data: [],
      keyInfo: [],
      error: '',
      isLoading: false,
    })
    const showTips = ref(true)
    const preview = {
      operator: props.binaryExpr?.operator || '/',
      switchOpen: !!props.binaryExpr?.binModifiers,
      matchOn: props.binaryExpr?.binModifiers?.OnOrIgnoring?.Ignoring ? 'ignoring' : 'on',
      ComparisonBehavior: props.binaryExpr?.binModifiers?.Bool ? 'bool' : 'filter',
      ignoreLabels: props.binaryExpr?.binModifiers?.OnOrIgnoring?.On || props.binaryExpr?.binModifiers?.OnOrIgnoring?.Ignoring,
      matchType: props.binaryExpr?.binModifiers?.group?.GroupLeft ? 'many-to-one' : props.binaryExpr?.binModifiers?.group?.GroupRight ? 'one-to-many' : 'one-to-one',
      includeLabels: props.binaryExpr?.binModifiers?.group?.GroupRight || props.binaryExpr?.binModifiers?.group?.GroupLeft,
    }

    const queryAllData = async () => {
      await queryInfo()
    }
    provide('queryAllData', queryAllData)

    const queryInfo = async () => {
      if (props.binaryExpr.right && props.binaryExpr.left) {
        if (!Object.prototype.hasOwnProperty.call(props.binaryExpr?.right, 'unknownExpr') && !Object.prototype.hasOwnProperty.call(props.binaryExpr?.left, 'unknownExpr')) {
          data.isLoading = true
          try {
            await promRepository.queryDataAll( {query: queryBinary(props.binaryExpr)})
                .then((res: any) => {
                  data.status = res.status
                  data.data = res.data.result
                  data.isLoading = false
                  graphData.data = data.data
                  graphData.state = 'data'
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
      if (graphData.data?.length > 0) {
        graphData.data = []
        graphData.state = 'noQuery'
        bus.emit('selectNodeChange', [props.qlIndex, false])
      } else {
        queryInfo()
        bus.emit('selectNodeChange', [props.qlIndex, true])
      }
    }

    const updateValue = async (value) => {
      const [v, str, index, qlIndex] = value
      // let data = {
      //   left: props.binaryExpr.left,
      //   operator: props.binaryExpr.operator,
      //   right: props.binaryExpr.right,
      //   binModifiers: props.binaryExpr.binModifiers,
      // }
      const data = props.binaryExpr
      if (v && v.showLeft || v[str] && v[str].showLeft || v.unknownExpr && v.unknownExpr.showLeft) {
        data.left = v;
      } else {
        data.right = v;
      }
      console.log(v, str, data, '+++++++update binary', props.isLeft)
      await content.emit('updateValue', [data, 'binaryExpr', index, qlIndex])
      await queryInfo()
    }

    const addExpr = () => {
      // const value = {
      //   unknownExpr: {
      //     binaryExpr: {
      //       left: props.binaryExpr.left,
      //       operator: props.binaryExpr.operator,
      //       right: props.binaryExpr.right,
      //       binModifiers: props.binaryExpr.binModifiers,
      //     }
      //   }
      // }
      const value = {
        // binaryExpr: {
        //   left: props.binaryExpr.left,
        //   operator: props.binaryExpr.operator,
        //   right: props.binaryExpr.right,
        //   binModifiers: props.binaryExpr.binModifiers,
        // }
        binaryExpr: props.binaryExpr
      }
      content.emit('updateValue', [value, 'unknown', props.index, props.qlIndex])
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
      // preview,
      updateValue,
      addExpr,
      changeQueryInfo,
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
