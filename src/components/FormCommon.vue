<template>
  <div>
    <div class="node-editor">
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="1" tab="Edit">
          <div class="tab-content">
            <div>
              <a-form layout="vertical" ref="formRef" :model="formState" class="small">
                <a-form-item label="Preview:">
                  <p class="ast-formatted" v-if="formState.queryType === 'BinaryOperation'">
                    <PreviewBinary :preview="formState.preview" />
                  </p>
                  <p class="ast-formatted" v-if="formState.queryType === 'CallFunction'">
                    <PreviewFunction :preview="formState.preview" />
                  </p>
                  <p class="ast-formatted" v-if="formState.queryType === 'SelectData'">
                    <PreviewSelectData :preview="formState.preview" />
                  </p>
                  <p class="ast-formatted" v-if="formState.queryType === 'LiteralValue'" >
                    <PreviewLiteralValue :preview="formState.preview" />
                  </p>
                  <p class="ast-formatted" v-if="formState.queryType === 'AggregateOverLabels'" >
                    <PreviewAggregate :preview="formState.preview" />
                  </p>
                  <p class="ast-formatted" v-if="formState.queryType === 'Subquery'" >
                    <PreviewSubQuery :preview="formState.preview" :ellipsis="true" />
                  </p>
                  <p class="ast-formatted" v-if="formState.queryType === 'Parentheses'" >
                    <PreviewParentheses :preview="formState.preview"/>
                  </p>
                  <p class="ast-formatted" v-if="formState.queryType === 'UnaryExpression'" >
                    <PreviewUnary :preview="formState.preview"/>
                  </p>
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
                <FormSelectData @previewChange="previewChange" :vectorSelector="formChildValue.vectorSelector" />
              </div>
              <div v-if="formState.queryType === 'AggregateOverLabels'">
                <FormAggregate  @previewChange="previewChange" :aggregateExpr="formChildValue.aggregateExpr" />
              </div>
              <div v-if="formState.queryType === 'BinaryOperation'">
                <FormBinaryOperation @previewChange="previewChange" :binaryExpr="formChildValue.binaryExpr" />
              </div>
              <div v-if="formState.queryType === 'CallFunction'">
                <FormFunction @previewChange="previewChange" :functionCall="formChildValue.functionCall" />
              </div>
              <div v-if="formState.queryType === 'LiteralValue'" >
                <FormLiteralValue @previewChange="previewChange" :stringLiteral="formChildValue.stringLiteral" :numberLiteral="formChildValue.numberLiteral" />
              </div>
              <div v-if="formState.queryType === 'Subquery'">
                <FormSubquery @previewChange="previewChange" :subqueryExpr="formChildValue.subqueryExpr" />
              </div>
              <div v-if="formState.queryType === 'UnaryExpression'">
                <FormUnaryExpression @previewChange="previewChange" :unaryExpr="formChildValue.unaryExpr" />
              </div>
              <div v-if="formState.queryType === 'Parentheses'">
                <FormParentheses @previewChange="previewChange" :parenExpr="formChildValue.parenExpr"  />
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
import {ref, toRaw, toRefs, onMounted, reactive, watch, inject, defineAsyncComponent} from 'vue'

export default {
  name: "FormCommon",
  components: {
    CheckOutlined,
    FormSelectData: defineAsyncComponent(() => import('./FormSelectData.vue')),
    FormAggregate: defineAsyncComponent(() => import('./FormAggregate.vue')),
    FormBinaryOperation: defineAsyncComponent(() => import('./FormBinaryOperation.vue')),
    FormFunction: defineAsyncComponent(() => import('./FormFunction.vue')),
    FormLiteralValue: defineAsyncComponent(() => import('./FormLiteralValue.vue')),
    FormSubquery: defineAsyncComponent(() => import('./FormSubquery.vue')),
    FormUnaryExpression: defineAsyncComponent(() => import('./FormUnaryExpression.vue')),
    FormParentheses: defineAsyncComponent(() => import('./FormParentheses.vue')),
    PreviewBinary: defineAsyncComponent(() => import('./PreviewBinary.vue')),
    PreviewSelectData: defineAsyncComponent(() => import('./PreviewSelectData.vue')),
    PreviewFunction: defineAsyncComponent(() => import('./PreviewFunction.vue')),
    PreviewLiteralValue: defineAsyncComponent(() => import('./PreviewLiteralValue.vue')),
    PreviewAggregate: defineAsyncComponent(() => import('./PreviewAggregate.vue')),
    PreviewSubQuery: defineAsyncComponent(() => import('./PreviewSubQuery.vue')),
    PreviewParentheses: defineAsyncComponent(() => import('./PreviewParentheses.vue')),
    PreviewUnary: defineAsyncComponent(() => import('./PreviewUnary.vue')),
  },
  props: {
    // metricNameData: Array,
    // labelNameData: Array,
  },
  setup(props: any) {
    // console.log(props, 'props', inject('addExpr'))
    const formChildValue: any = inject('addExpr')
    const activeKey = ref('1')
    const formRef = ref();
    const formState = reactive({
      preview: 'n',
      queryType: 'SelectData',
    });

    formState.queryType = formChildValue.functionCall ? 'CallFunction' : formChildValue.binaryExpr ? 'BinaryOperation'
        : formChildValue.aggregateExpr ? 'AggregateOverLabels' : formChildValue.subqueryExpr ? 'Subquery'
            : formChildValue.unaryExpr ? 'UnaryExpression' : formChildValue.parenExpr ? 'Parentheses'
                : formChildValue.numberLiteral ? 'LiteralValue' : formChildValue.stringLiteral ? 'LiteralValue' : 'SelectData'

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
    const previewChange = (value) => {
      console.log(value, 'value');
      formState.preview = value
    }

    onMounted(() => {

      watch(() => formState.queryType, () => {

      })
    })

    return {
      previewChange,
      onSubmit,
      activeKey,
      formRef,
      formState,
      formChildValue,
    }
  }
}
</script>

<style scoped lang="less">
@import 'index.less';
</style>
