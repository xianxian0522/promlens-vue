<template>
  <div>
    <div class="node-editor">
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="1" tab="Edit">
          <div class="tab-content">
            <div>
              <a-form layout="vertical" ref="formRef" :model="formState" class="small">
                <a-form-item label="Preview:">
                  <p class="ast-formatted"><span>{{formState.preview}}</span></p>
                </a-form-item>
                <a-form-item label="Query type:">
                  <a-select
                      v-model:value="formState.queryType"
                      style="width: 100%"
                      ref="select"
                  >
                    <a-select-option value="SelectData">Select data</a-select-option>
                    <a-select-option value="AggregateOverLabels">Aggregate over labels</a-select-option>
                    <a-select-option value="BinaryOperation">Binary operation</a-select-option>
                    <a-select-option value="CallFunction">Call function</a-select-option>
                    <a-select-option value="LiteralValue">Literal value</a-select-option>
                    <a-select-option value="Subquery">Subquery</a-select-option>
                    <a-select-option value="Parentheses">Parentheses</a-select-option>
                    <a-select-option value="UnaryExpression">Unary expression</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
              <div v-if="formState.queryType === 'SelectData'">
                <FormSelectData />
              </div>
              <div v-if="formState.queryType === 'AggregateOverLabels'">
                <FormAggregate />
              </div>
              <div v-if="formState.queryType === 'BinaryOperation'">
                <FormBinaryOperation />
              </div>
              <div v-if="formState.queryType === 'CallFunction'">
                <FormFunction />
              </div>
              <div v-if="formState.queryType === 'LiteralValue'">
                <FormLiteralValue />
              </div>
              <div v-if="formState.queryType === 'Subquery'">
                <FormSubquery />
              </div>
              <div v-if="formState.queryType === 'UnaryExpression'">
                <FormUnaryExpression />
              </div>

              <a-button class="btn btn-secondary btn-sm" @click="onSubmit">
                <CheckOutlined />Apply changes
              </a-button>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Snippets">
          <div class="tab-content"></div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Actions">
          <div class="tab-content"></div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { PlusOutlined, QuestionCircleOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import {ref, toRaw, toRefs, onMounted, reactive, watch} from 'vue'
import {labelNameData, metricNameData, promRepository} from "@/api/promRepository";
import FormSelectData from "@/components/FormSelectData.vue";
import FormAggregate from "@/components/FormAggregate.vue";
import FormBinaryOperation from "@/components/FormBinaryOperation.vue";
import FormFunction from "@/components/FormFunction.vue";
import FormLiteralValue from "@/components/FormLiteralValue.vue";
import FormSubquery from "@/components/FormSubquery.vue";
import FormUnaryExpression from "@/components/FormUnaryExpression.vue";

export default {
  name: "FormCommon",
  components: {
    // PlusOutlined,
    // QuestionCircleOutlined,
    CheckOutlined,
    // DeleteOutlined,
    FormSelectData,
    FormAggregate,
    FormBinaryOperation,
    FormFunction,
    FormLiteralValue,
    FormSubquery,
    FormUnaryExpression,
  },
  props: {
    // metricNameData: Array,
    // labelNameData: Array,
  },
  setup(props: any) {
    console.log(props, 'props')
    const activeKey = ref('1')
    const formRef = ref();
    const formState = reactive({
      preview: 'nnnn',
      queryType: 'SelectData',

      // offset: '0s',
      // range: '5m',
      // step: '0s',

      // valueType: 'numberLiteral',
      // numValue: 0,
      // stringValue: '',
      // unaryOperator: '-',
    });
    const rules = {
      numValue: [{
        type: 'number',
        trigger: 'blur',
        message: 'Invalid number format',
      }]
    };

    const onSubmit = () => {
      formRef.value
          .validate()
          .then(() => {
            console.log('values', formState, toRaw(formState));
          })
          .catch((error: any) => {
            console.log('error', error);
          });
    };

    onMounted(() => {
      watch(() => formState.queryType, () => {
        // if (formState.queryType === 'Subquery') {
        //   formState.range = '1h'
        // } else if (formState.queryType === 'SelectData') {
        //   formState.range = '5m'
        // }
      })
    })

    return {
      onSubmit,
      activeKey,
      formRef,
      formState,
      rules,
    }
  }
}
</script>

<style scoped lang="less">
@import 'index.less';
</style>
