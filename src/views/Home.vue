<template>
<div class="promlens-container container-fluid">
  <a-button type="primary" @click="submit">Primary</a-button>
  <div class="editor-container" id="container"></div>
  <div class="row">
    <div class="col ast-visualizer">
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
        <a-button class="query-top-bar-btn btn btn-light btn-sm"><CloseOutlined /></a-button>
      </div>
      <div class="row">
        <div class="col">
          <div class="ast-node ast-node-selected ast-node-root">
            <div class="ast-node-inner-wrapper">
              <PlusOutlined class="ast-connector-plus ast-connector-plus-up" />
              <div class="ast-node-inner ast-node-inner-placeholder ast-node-inner-tree-view">
                <div class="ast-node-inner-top">
                  <div class="ast-node-inner-text">
                    <span>start query:</span>
                  </div>
                  <a-button class="ast-node-inner-action-btn btn btn-outline-secondary btn-sm">
                    <SwapOutlined />Form
                  </a-button>
                  <a-button class="ast-node-inner-action-btn btn btn-outline-secondary btn-sm">
                    <EditOutlined />PromQL
                  </a-button>
                </div>
                <div>
                  <div class="node-editor">
                    <a-tabs v-model:activeKey="activeKey" type="card">
                      <a-tab-pane key="1" tab="Edit">
                       <div class="tab-content">
                         <div>
                           <a-form layout="vertical" :model="formState" class="small">
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
                             <div v-if="formState.queryType === 'SelectData'">
                               <a-form-item label="Metric name:">
                                 <a-input v-model:value="formState.metricName" placeholder="input placeholder" />
                               </a-form-item>
                               <a-form-item>
                                 <label class="label-svg">Label matchers: <QuestionCircleOutlined /></label>
                                 <div class="mb-1 row no-gutters">
                                   <div class="col-6">
                                     <div class="row no-gutters">
                                       <div class="col">
                                         <a-input v-model:value="formState.labelName" class="pending-input-item" placeholder="label name"></a-input>
                                       </div>
                                       <div class="col-auto" style="margin-right: 3px; margin-left: 3px">
                                         <a-select
                                             v-model:value="formState.sign"
                                             style="width: 80px"
                                             ref="select"
                                         >
                                           <a-select-option value="=">=</a-select-option>
                                           <a-select-option value="!=">!=</a-select-option>
                                           <a-select-option value="=~" disabled>=~</a-select-option>
                                           <a-select-option value="!~">!~</a-select-option>
                                         </a-select>
                                       </div>
                                     </div>
                                   </div>
                                   <div class="col-6">
                                     <div class="row no-gutters">
                                       <div class="col">
                                         <a-input v-model:value="formState.labelValue" class="pending-input-item" placeholder="label value"></a-input>
                                       </div>
                                       <div class="col-auto" style="margin-right: 3px; margin-left: 3px">
                                         <a-button class="btn btn-secondary btn-sm">
                                           <PlusOutlined />
                                         </a-button>
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                               </a-form-item>
                               <a-form-item>
                                 <label class="label-svg">Select: <QuestionCircleOutlined /></label>
                                 <div>
                                   <a-radio-group v-model:value="formState.select">
                                     <a-radio style="display: block" value="instance">Instance value</a-radio>
                                     <a-radio style="display: block"  value="range">Range of values</a-radio>
                                   </a-radio-group>
                                 </div>
                               </a-form-item>
                               <a-form-item v-if="formState.select === 'range'">
                                 <label class="label-svg">Range: <QuestionCircleOutlined /></label>
                                 <a-input v-model:value="formState.range"></a-input>
                               </a-form-item>
                               <a-form-item>
                                 <label class="label-svg">Offset: <QuestionCircleOutlined /></label>
                                 <a-input v-model:value="formState.offset"></a-input>
                               </a-form-item>
                             </div>
                             <div v-if="formState.queryType === 'AggregateOverLabels'">
                               <a-form-item label="Aggregation type">
                                 <a-select
                                     v-model:value="formState.aggregationType"
                                     style="width: 100%"
                                     ref="select"
                                 >
                                   <a-select-option v-for="item in aggregationTypeList" :key="item.name" :value="item.value">
                                     {{ item.name }}</a-select-option>
                                 </a-select>
                               </a-form-item>
                               <a-form-item>
                                 <label class="label-svg">Preserve: <QuestionCircleOutlined /></label>
                                 <div>
                                   <a-radio-group v-model:value="formState.preserve">
                                     <a-radio style="display: block" value="by">Specified labels
                                       (<span class="ast-keyword">by</span>)
                                     </a-radio>
                                     <a-radio style="display: block"  value="without">All labels except specified
                                       (<span class="ast-keyword">without</span>)
                                     </a-radio>
                                   </a-radio-group>
                                 </div>
                               </a-form-item>
                               <a-form-item>
                                 <label class="label-svg">Grouping labels: <QuestionCircleOutlined /></label>
                                 <div class="input-group" v-for="(group, index) in formState.groupingLabels" :key="index">
                                   <a-input v-model:value="formState.groupingLabels[index]" class="pending-input-item" placeholder="add label name"></a-input>
                                   <div class="input-group-append">
                                     <a-button class="btn btn-outline-secondary btn-sm" style="padding: 4px 8px">
                                       <PlusOutlined style="font-size: 18px;" />
                                     </a-button>
                                   </div>
                                 </div>
                               </a-form-item>
                             </div>
                             <div v-if="formState.queryType === 'BinaryOperation'">
                               <a-form-item label="Operator">
                                 <a-select
                                     v-model:value="formState.operator"
                                     style="width: 100%"
                                     ref="select"
                                 >
                                   <a-select-option v-for="item in operatorList" :key="item.name" :value="item.value">
                                     {{ item.name }}</a-select-option>
                                 </a-select>
                               </a-form-item>
                               <div v-if="formState.operator === '==' || formState.operator === '!=' || formState.operator === '>' || formState.operator === '<' || formState.operator === '>=' || formState.operator === '<='">
                                 <a-form-item >
                                   <label class="label-svg">Comparison behavior: <QuestionCircleOutlined /></label>
                                   <div>
                                     <a-radio-group v-model:value="formState.ComparisonBehavior">
                                       <a-radio style="display: block" value="filter">Filter (omit non-matching series from result)
                                       </a-radio>
                                       <a-radio style="display: block"  value="bool">Return boolean values
                                         (<span class="ast-keyword">bool</span>)
                                       </a-radio>
                                     </a-radio-group>
                                   </div>
                                 </a-form-item>
                               </div>
                               <a-form-item>
                                 <label class="label-svg">
                                   <a-switch size="small" v-model:checked="formState.switchOpen" />Customize vector matching options
                                 </label>
                                 <div class="switch-open" v-if="formState.switchOpen">
                                   <a-form>
                                     <a-form-item>
                                       <label class="label-svg">Match on: <QuestionCircleOutlined /></label>
                                       <div>
                                         <a-radio-group v-model:value="formState.matchOn">
                                           <a-radio style="display: block" value="on">specified labels
                                             (<span class="ast-keyword">on</span>)
                                           </a-radio>
                                           <a-radio style="display: block"  value="ignoring">all labels except some
                                             (<span class="ast-keyword">ignoring</span>)
                                           </a-radio>
                                         </a-radio-group>
                                       </div>
                                     </a-form-item>
                                     <a-form-item>
                                       <label class="label-svg">Ignore labels: <QuestionCircleOutlined /></label>
                                       <div class="input-group" v-for="(ignore, index) in formState.ignoreLabels" :key="index">
                                         <a-input v-model:value="formState.ignoreLabels[index]" class="pending-input-item" placeholder="add label name"></a-input>
                                         <div class="input-group-append">
                                           <a-button class="btn btn-outline-secondary btn-sm" style="padding: 4px 8px">
                                             <PlusOutlined style="font-size: 18px;" />
                                           </a-button>
                                         </div>
                                       </div>
                                     </a-form-item>
                                     <a-form-item>
                                       <label class="label-svg">Match type: <QuestionCircleOutlined /></label>
                                       <a-select
                                           v-model:value="formState.matchType"
                                           style="width: 100%"
                                           ref="select"
                                       >
                                         <a-select-option value="one-to-one">one-to-one</a-select-option>
                                         <a-select-option value="many-to-one">many-to-one</a-select-option>
                                         <a-select-option value="one-to-many">one-to-many</a-select-option>
                                       </a-select>
                                     </a-form-item>
                                   </a-form>
                                 </div>
                               </a-form-item>
                             </div>
                           </a-form>
                           <a-button class="btn btn-secondary btn-sm">
                             <CheckOutlined />Apply changes
                           </a-button>
                         </div>
                       </div>
                      </a-tab-pane>
                      <a-tab-pane key="2" tab="Snippets">
                        <div class="tab-content"></div>
                      </a-tab-pane>
                      <a-tab-pane key="3" tab="Actions">
                        <p>Content of Tab Pane 3</p>
                        <p>Content of Tab Pane 3</p>
                        <p>Content of Tab Pane 3</p>
                      </a-tab-pane>
                    </a-tabs>
                  </div>
                </div>
              </div>
              <div class="ast-node-infos"></div>
            </div>
            <div class="ast-node"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">

import {ref, reactive, toRefs} from 'vue'
import promRepository from "@/api/promRepository";
import { ReadOutlined, CloseOutlined, SyncOutlined, EnterOutlined, PlusOutlined,
  SwapOutlined, EditOutlined, QuestionCircleOutlined, CheckOutlined } from '@ant-design/icons-vue'

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
    SwapOutlined,
    EditOutlined,
    QuestionCircleOutlined,
    CheckOutlined
  },
  setup() {
    const activeKey = ref('1')
    const formState = reactive({
      queryType: 'SelectData',
      metricName: '',
      preview: 'nnnn',
      labelName: '',
      labelValue: '',
      sign: '=',
      select: 'instance',
      offset: '0s',
      range: '5m',
      aggregationType: 'sum',
      preserve: 'by',
      operator: '/',
      switchOpen: false,
      matchOn: 'on',
      ComparisonBehavior: 'filter',
      ignoreLabels: [''],
      groupingLabels: [''],
      matchType: 'one-to-one',
    })
    const state = reactive({
      aggregationTypeList: [
        {name: 'sum', value: 'sum'},
        {name: 'min', value: 'min'},
        {name: 'max', value: 'max'},
        {name: 'avg', value: 'avg'},
        {name: 'stddev', value: 'stddev'},
        {name: 'stdvar', value: 'stdvar'},
        {name: 'count', value: 'count'},
        {name: 'group', value: 'group'},
        {name: 'count_values', value: 'count_values'},
        {name: 'bottomk', value: 'bottomk'},
        {name: 'topk', value: 'topk'},
        {name: 'quantile', value: 'quantile'},
      ],
      operatorList: [
        {name: '+', value: '+'},
        {name: '-', value: '-'},
        {name: '*', value: '*'},
        {name: '/', value: '/'},
        {name: '%', value: '%'},
        {name: '^', value: '^'},
        {name: '==', value: '=='},
        {name: '!=', value: '!='},
        {name: '>', value: '>'},
        {name: '<', value: '<'},
        {name: '>=', value: '>='},
        {name: '<=', value: '<='},
        {name: 'and', value: 'and'},
        {name: 'or', value: 'or'},
        {name: 'unless', value: 'unless'},
      ],
    })
    const submit = async () => {
      const data = await promRepository.queryLabel()
      console.log(data);
    }

    return {
      submit,
      activeKey,
      formState,
      ...toRefs(state),
    }
  }
}
</script>

<style lang="less">
@import '../components/index.less';
</style>
