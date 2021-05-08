<template>
  <TreeCommon :outermost="outermost" :isLeft="isLeft">
    <template v-slot:addExpr>
      <PlusOutlined @click.stop="addExpr" class="ast-connector-plus ast-connector-plus-up" />
    </template>
    <template v-slot:nodeLeftChild>
      <div class="ast-node">
        <Expr :expr="binaryExpr.left" :isLeft="true" :showLeft="true" @updateValue="updateValue" :index="index" />
      </div>
    </template>
    <template v-slot:innerText>
      <span class="promql-code" @click="queryInfo">
        <PreviewBinary :preview="binaryExpr" :leftPreview="binaryExpr.left" :rightPreview="binaryExpr.right" :ellipsis="false" />
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
        <Expr :expr="binaryExpr.right" @updateValue="updateValue" :index="index" />
      </div>
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
            <div class="ast-node-label-stats" v-for="(item, index) in data.keyInfo" :key="index">
              <span class="ast-label-name" style="color: green;">{{ item.name }}</span>
              :{{ item.value }},
            </div>
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
</template>

<script lang="ts">
import {defineAsyncComponent, inject, provide, reactive, ref} from "vue";
import TreeCommon from "@/components/TreeCommon.vue";
import PreviewBinary from "@/components/PreviewBinary.vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import {binaryOperation} from "@/utils/store";
import {promRepository} from "@/api/promRepository";
import {dataInfo, queryBinary} from "@/utils/common";

export default {
  name: "BinaryExpr",
  props: ['binaryExpr', 'index', 'outermost', 'isLeft'],
  components: {
    PlusOutlined,
    TreeCommon,
    PreviewBinary,
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
      matchOn: props.binaryExpr?.binModifiers?.OnOrIgnoring.Ignoring ? 'ignoring' : 'on',
      ComparisonBehavior: props.binaryExpr?.binModifiers?.Bool ? 'bool' : 'filter',
      ignoreLabels: props.binaryExpr?.binModifiers?.OnOrIgnoring.On || props.binaryExpr?.binModifiers?.OnOrIgnoring.Ignoring,
      matchType: props.binaryExpr?.binModifiers?.group.GroupLeft ? 'many-to-one' : props.binaryExpr?.binModifiers?.group.GroupRight ? 'one-to-many' : 'one-to-one',
      includeLabels: props.binaryExpr?.binModifiers?.group.GroupRight || props.binaryExpr?.binModifiers?.group.GroupLeft,
    }

    const queryAllData = async () => {
      await queryInfo()
    }
    provide('queryAllData', queryAllData)

    const queryInfo = async () => {
      if (props.binaryExpr.right && props.binaryExpr.left) {
        data.isLoading = true
        try {
          await promRepository.queryDataAll( {query: queryBinary(props.binaryExpr)})
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

    const updateValue = (value) => {
      const [v, str, index] = value
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
      content.emit('updateValue', [data, 'binaryExpr', index])
      queryInfo()
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
      content.emit('updateValue', [value, 'unknown', props.index])
    }

    return {
      data,
      showTips,
      // preview,
      updateValue,
      addExpr,
      queryInfo,
    }
  },
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
