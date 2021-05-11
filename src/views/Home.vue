<template>
<div class="promlens-container container-fluid">
  <a-button type="primary">Primary</a-button>
  <div class="editor-container" id="container"></div>
  <div class="row">
    <div class="col ast-visualizer">
      <div v-for="(isShow, index) in isShowForm" :key="index">
        <div class="query-top-bar">
          <div class="expression-input-wrapper">
            <div class="expression-input expression-input-stale">
              <a-button class="expression-input-sync-btn btn btn-light btn-sm"><SyncOutlined /></a-button>
              <div class="cm-expression-input"></div>
              <div class="expression-input-enter">
                <EnterOutlined />
              </div>
            </div>
          </div>
          <a-button type="link" class="query-top-bar-btn btn btn-light btn-sm"><ReadOutlined /></a-button>
          <a-button @click="deleteAnotherQuery(index)" class="query-top-bar-btn btn btn-light btn-sm"><CloseOutlined /></a-button>
        </div>
        <div class="row">
          <div class="col">
            <div class="ast-node ast-node-selected ast-node-root">
              <PromQL :expr="isShow.expr" />
<!--              <div class="ast-node-inner-wrapper">-->
<!--                <PlusOutlined class="ast-connector-plus ast-connector-plus-up" />-->
<!--                <div class="ast-node-inner ast-node-inner-placeholder ast-node-inner-tree-view">-->
<!--                  <div class="ast-node-inner-top">-->
<!--                    <div class="ast-node-inner-text">-->
<!--                      <span>start query:</span>-->
<!--                    </div>-->
<!--                    <a-button @click="isShowForm[index] = !isShowForm[index]" class="ast-node-inner-action-btn btn btn-outline-secondary btn-sm">-->
<!--                      <SwapOutlined />Form-->
<!--                    </a-button>-->
<!--                    <a-button class="ast-node-inner-action-btn btn btn-outline-secondary btn-sm">-->
<!--                      <EditOutlined />PromQL-->
<!--                    </a-button>-->
<!--                  </div>-->
<!--                  <FormCommon v-if="isShow" />-->
<!--                </div>-->
<!--                <div class="ast-node-infos"></div>-->
<!--              </div>-->
<!--              <div class="ast-node">-->
<!--                <PromQL />-->
<!--              </div>-->
            </div>
          </div>
        </div>
        <div class="row" v-if="isShowForm.length > 1 && index !== (isShowForm.length - 1)">
          <div class="col">
            <div style="border-top: 1px dashed rgba(52, 79, 113, 0.2); width: 100%; margin-top: 15px; margin-bottom: 15px; height: 2px;"></div>
          </div>
        </div>
      </div>
      <div class="row" style="margin-top: 20px">
        <div class="col">
          <a-button @click="addAnotherQuery" class="px-4 btn btn-light btn-sm"><PlusOutlined /> Add another query</a-button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">

import {ref, reactive, toRefs, toRaw, onMounted, watch} from 'vue'
import {promRepository} from "@/api/promRepository";
import { ReadOutlined, CloseOutlined, SyncOutlined, EnterOutlined, PlusOutlined,
  SwapOutlined, EditOutlined, QuestionCircleOutlined, CheckOutlined } from '@ant-design/icons-vue'
import FormCommon from "@/components/FormCommon.vue";
import TreeCommon from "@/components/TreeCommon.vue";
import PromQL from "@/views/PromQL.vue";

interface Item {
  name: string;
  value: string;
}

export default {
  name: "Home",
  components: {
    ReadOutlined,
    CloseOutlined,
    SyncOutlined,
    EnterOutlined,
    PlusOutlined,
    // SwapOutlined,
    // EditOutlined,
    // QuestionCircleOutlined,
    // CheckOutlined,
    // FormCommon,
    PromQL,
  },
  setup() {
    const isShowForm = ref([{expr: {}}]);
    const state = reactive({
      metricNameData: [],
      labelNameData: [],
      isShowForm: [{expr: {}}]
    })

    const addAnotherQuery = () => {
      // isShowForm.value.push({expr: {}})
      state.isShowForm.push({expr: {}})
    }
    const deleteAnotherQuery = (index: number) => {
      // if (isShowForm.value.length > 1) {
      //   isShowForm.value.splice(index, 1)
      // }
      if (state.isShowForm.length > 1) {
        state.isShowForm.splice(index, 1)
        console.log(state.isShowForm, index, 'xxxxx 没有重新加载promQl组件')
      }
    }

    const queryLabelValue = async () => {
      await promRepository.queryLabelName()
      // state.metricNameData = data.data;
    }
    const queryLabels = async () => {
      await promRepository.queryLabel()
      // state.labelNameData = data.data;
    }

    onMounted(() => {
      queryLabelValue()
      queryLabels()
    })

    return {
      ...toRefs(state),
      // isShowForm,
      addAnotherQuery,
      deleteAnotherQuery,
    }
  }
}
</script>

<style lang="less">
@import '../components/index.less';
</style>
