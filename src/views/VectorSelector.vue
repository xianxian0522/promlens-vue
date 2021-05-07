<template>
<span ref="nodeRef" >
  <TreeCommon @nodeRefHeight="nodeRefHeight" :outermost="outermost" :isLeft="isLeft" >
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
        <PreviewSelectData :preview="vectorSelector"/>
<!--        <span class="promql-metric-name">{{vectorSelector.metricIdentifier}}</span>-->
<!--        <span class="promql-metric-name" v-if="vectorSelector.labelMatchers.length > 0">-->
<!--          {<span v-for="(vector, index) in vectorSelector.labelMatchers" :key="index">-->
<!--            <span class="promql-label-name">{{ vector.labelName }}</span>-->
<!--            {{vector.matchOp}}-->
<!--            <span class="promql-string">"{{vector.labelValue}}"</span>-->
<!--            <span v-if="vectorSelector.labelMatchers.length > 1 && (vectorSelector.labelMatchers.length - 1 !== index)">,</span>-->
<!--          </span>}-->
<!--        </span>-->
<!--        <span v-if="vectorSelector.matrixSelector">-->
<!--          [<span class="promql-duration">{{vectorSelector.matrixSelector.duration}}</span>]-->
<!--&lt;!&ndash;          <MatrixSelector :matrixSelector="vectorSelector.matrixSelector"/>&ndash;&gt;-->
<!--        </span>-->
<!--        <span v-if="vectorSelector.offsetExpr">-->
<!--          <span class="promql-keyword" v-if="vectorSelector.offsetExpr.offset">offset </span>-->
<!--          <span class="promql-duration">{{vectorSelector.offsetExpr.duration}}</span>-->
<!--        </span>-->
      </span>
    </template>
    <template v-slot:infoLabel>
      <div style="display: inline-block" v-if="data.status === 'success'">
        <div style="display: inline-block" v-if="!data.isLoading">
          {{ data.data.length }} results - 91ms -
          <div class="ast-node-label-stats" v-for="(item, index) in data.keyInfo" :key="index">
            <span class="ast-label-name" style="color: green;">{{ item.name }}</span>
            :{{ item.value }},
          </div>
        </div>
        <span v-else><a-spin /></span>
      </div>
      <div style="display: inline-block" v-else>
        <span v-if="!data.isLoading">
          <span class="ast-query-icon"></span>
          <span class="ast-node-query-error-message">Error executing query:{{ data.error }}</span>
        </span>
        <span v-else><a-spin /></span>
      </div>
    </template>
  </TreeCommon>
</span>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import MatrixSelector from "@/views/MatrixSelector.vue";
import PreviewSelectData from "@/components/PreviewSelectData.vue";
import {inject, provide, reactive, ref, watch} from "vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import {promRepository} from "@/api/promRepository";
import {querySelectData} from "@/utils/common";
import {selectData} from "@/utils/store";

export default {
  name: "VectorSelector",
  props: ['vectorSelector', 'showLeft', 'isLeft', 'index', 'outermost'],
  emits: ['updateValue'],
  components: {
    PlusOutlined,
    TreeCommon,
    // MatrixSelector,
    PreviewSelectData,
  },
  setup(props: any, content) {

    const formValue: any = inject('exprChange')
    const data = ref(selectData)
    const nodeRef = ref()

    // const preview = {
    //   metricName: props.vectorSelector?.metricIdentifier,
    //   labelMatchers: props.vectorSelector?.labelMatchers,
    //   select: props.vectorSelector?.offsetExpr?.offset ? 'range' : 'instance',
    //   offset: props.vectorSelector?.matrixSelector?.duration || '0s',
    //   range: props.vectorSelector?.offsetExpr?.duration,
    // }

    const queryAllData = async () => {
      console.log(data.value, '============')
    }
    // provide('queryAllData', queryAllData)

    const queryInfo = async () => {
      // console.log(formValue(), 'select query info =====')
      promRepository.querySelectDataAll({query: querySelectData(props)})
    }

    const nodeRefHeight = () => {
      // console.log(nodeRef.value.offsetHeight, 'height')
    }

    const addExpr = () => {
      // const value = {
      //   unknownExpr: {
      //     vectorSelector: props.vectorSelector,
      //     showLeft: props.showLeft,
      //   }
      // }
      const value = {
        vectorSelector: props.vectorSelector,
        showLeft: props.showLeft,
      }
      content.emit('updateValue', [value, 'unknown', props.index])
    }

    return {
      // preview,
      data,
      nodeRef,
      addExpr,
      queryInfo,
      nodeRefHeight,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index.less";
</style>
