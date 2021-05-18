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
      <CommonInfoLabel :data="data" />
<!--      <span style="display: inline-block" v-if="data.status === 'success'">-->
<!--        <span style="display: inline-block" v-if="!data.isLoading">-->
<!--          {{ data.data.length }} results - 91ms - -->
<!--          <span v-if="data.keyInfo.length > 0">-->
<!--            <div class="ast-node-label-stats" v-for="(item, index) in data.keyInfo" :key="index">-->
<!--            <span class="ast-label-name" style="color: green;">{{ item.name }}</span>-->
<!--            :{{ item.value }},-->
<!--            </div>-->
<!--          </span>-->
<!--          <span v-else>no labels</span>-->
<!--        </span>-->
<!--        <span v-else><a-spin /></span>-->
<!--      </span>-->
<!--      <div style="display: inline-block" v-else>-->
<!--        <span v-if="!data.isLoading">-->
<!--          <span class="ast-query-icon"></span>-->
<!--          <span class="ast-node-query-error-message">Error executing query:{{ data.error }}</span>-->
<!--        </span>-->
<!--        <span v-else><a-spin /></span>-->
<!--      </div>-->
    </template>
  </TreeCommon>
</span>
</template>

<script lang="ts">
import TreeCommon from "@/components/TreeCommon.vue";
import CommonInfoLabel from "@/components/CommonInfoLabel.vue";
import PreviewSelectData from "@/components/PreviewSelectData.vue";
import {inject, onMounted, provide, reactive, ref, watch} from "vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import {promRepository} from "@/api/promRepository";
import {dataInfo, querySelectData} from "@/utils/common";
import bus from "@/utils/bus";

export default {
  name: "VectorSelector",
  props: ['vectorSelector', 'showLeft', 'isLeft', 'index', 'outermost', 'qlIndex'],
  emits: ['updateValue'],
  components: {
    PlusOutlined,
    TreeCommon,
    CommonInfoLabel,
    PreviewSelectData,
  },
  setup(props: any, content) {

    const formValue: any = inject('exprChange')
    const data = reactive({
      status: '',
      data: [],
      keyInfo: [],
      error: '',
      isLoading: false,
      resultType: '',
    })
    const nodeRef = ref()

    // const preview = {
    //   metricName: props.vectorSelector?.metricIdentifier,
    //   labelMatchers: props.vectorSelector?.labelMatchers,
    //   select: props.vectorSelector?.offsetExpr?.offset ? 'range' : 'instance',
    //   offset: props.vectorSelector?.matrixSelector?.duration || '0s',
    //   range: props.vectorSelector?.offsetExpr?.duration,
    // }

    const queryAllData = async () => {
      await queryInfo()
    }
    provide('queryAllData', queryAllData)

    const queryInfo = async () => {
      data.isLoading = true
      try {
        await promRepository.queryDataAll( {query: querySelectData(props.vectorSelector)})
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
      content.emit('updateValue', [value, 'unknown', props.index, props.qlIndex])
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
