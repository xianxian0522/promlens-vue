<template>
  <div>
    <div class="node-editor">
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="1" tab="Edit">
          <div class="tab-content">
            <div>
              <a-form layout="vertical" ref="formRef" :model="formState" :rules="rules" class="small">
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
                    <a-select
                        show-search
                        v-model:value="formState.metricName"
                        placeholder="metric name"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                        @search="handleSearch"
                    >
                      <a-select-option v-for="(item, index) in metricNameList" :value="item" :key="index">{{ item }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item>
                    <label class="label-svg">Label matchers: <QuestionCircleOutlined /></label>
                    <div class="mb-1 row no-gutters" v-for="(label, index) in formState.labelMatchers" :key="index">
                      <div>
                        <div class="row no-gutters">
                          <div class="col col-select">
                            <a-select
                                placeholder="label name"
                                show-search
                                v-model:value="label.labelName"
                                :default-active-first-option="false"
                                :show-arrow="false"
                                :filter-option="false"
                                :not-found-content="null"
                                @search="handleSearchLabel"
                                @change="handleChangeLabel"
                            >
                              <a-select-option v-for="(item, num) in labelNameList" :value="item" :key="num">{{ item }}</a-select-option>
                            </a-select>
                          </div>
                          <div class="col-auto" style="margin-right: 3px; margin-left: 3px">
                            <a-select
                                v-model:value="label.sign"
                                style="width: 80px"
                                ref="select"
                            >
                              <a-select-option value="=">=</a-select-option>
                              <a-select-option value="!=">!=</a-select-option>
                              <a-select-option value="=~">=~</a-select-option>
                              <a-select-option value="!~">!~</a-select-option>
                            </a-select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="row no-gutters">
                          <div class="col col-select">
                            <a-select
                                placeholder="label value"
                                show-search
                                v-model:value="label.labelValue"
                                :default-active-first-option="false"
                                :dropdownMatchSelectWidth="false"
                                :show-arrow="false"
                                :filter-option="false"
                                :not-found-content="null"
                                @search="handleSearchValue"
                            >
                              <a-select-option v-for="(item, num) in valueListFilter" :value="item" :key="num">{{ item }}</a-select-option>
                            </a-select>
                          </div>
                          <div class="col-auto" style="margin-right: 3px; margin-left: 3px">
                            <a-button v-if="label.showAdd" @click="addLabelMatcher(index)" class="btn btn-secondary btn-sm">
                              <PlusOutlined />
                            </a-button>
                            <a-button v-if="!label.showAdd" @click="deleteLabelMatcher(index)" class="btn btn-secondary btn-sm">
                              <DeleteOutlined />
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
                  <a-form-item label="Operator:">
                    <a-select
                        v-model:value="formState.operator"
                        style="width: 100%"
                        ref="select"
                    >
                      <a-select-option v-for="(item, index) in operatorList" :key="index" :value="item.value">
                        {{ item.name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <div v-if="matchState(formState.operator, /[==,!=,>,<,<=,>=]/) ">
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
                    <label class="label-svg" style="justify-content: flex-start;">
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
                        <div v-if="matchState(formState.operator, /[-,+,*,/,%,^,>,>=,<,<=,==,!=]/)">
                          <a-form-item >
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
                        </div>
                      </a-form>
                    </div>
                  </a-form-item>
                </div>
                <div v-if="formState.queryType === 'CallFunction'">
                  <a-form-item label="Function:">
                    <a-select
                        v-model:value="formState.fun"
                        style="width: 680px"
                        ref="select"
                    >
                      <a-select-option v-for="(item, index) in functionList" :key="index" :value="item.value">
                        {{ item.name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
                <div v-if="formState.queryType === 'LiteralValue'">
                  <a-form-item label="Value type:">
                    <a-select v-model:value="formState.valueType">
                      <a-select-option value="numberLiteral">number (scalar)</a-select-option>
                      <a-select-option value="stringLiteral">string</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item v-if="formState.valueType === 'numberLiteral'" label="Numeric value:">
                    <a-input-number v-model:value="formState.numValue"></a-input-number>
                  </a-form-item>
                  <a-form-item v-if="formState.valueType === 'stringLiteral'" label="String value:">
                    <a-input v-model:value="formState.stringValue"></a-input>
                  </a-form-item>
                </div>
                <div v-if="formState.queryType === 'Subquery'">
                  <a-form-item>
                    <label class="label-svg">Range: <QuestionCircleOutlined /></label>
                    <a-input v-model:value="formState.range"></a-input>
                  </a-form-item>
                  <a-form-item>
                    <label class="label-svg">Offset: <QuestionCircleOutlined /></label>
                    <a-input v-model:value="formState.offset"></a-input>
                  </a-form-item>
                  <a-form-item>
                    <label class="label-svg">Resolution step: <QuestionCircleOutlined /></label>
                    <a-input v-model:value="formState.step"></a-input>
                  </a-form-item>
                </div>
                <div v-if="formState.queryType === 'UnaryExpression'">
                  <a-form-item label="Unary operator type:">
                    <a-select
                        v-model:value="formState.unaryOperator"
                        style="width: 100%"
                        ref="select"
                    >
                      <a-select-option value="+">+</a-select-option>
                      <a-select-option value="-">-</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
              </a-form>
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
import promRepository from "@/api/promRepository";

export default {
  name: "FormCommon",
  components: {
    PlusOutlined,
    QuestionCircleOutlined,
    CheckOutlined,
    DeleteOutlined,
  },
  props: {
    metricNameData: Array,
    labelNameData: Array,
  },
  setup(props: any) {
    console.log(props, 'props')
    const activeKey = ref('1')
    const formRef = ref();
    const formState = reactive({
      preview: 'nnnn',
      queryType: 'SelectData',
      metricName: undefined,
      labelMatchers: [
        { labelName: undefined, labelValue: undefined, sign: '=', showAdd: true },
      ],
      select: 'instance',
      offset: '0s',
      range: '5m',
      step: '0s',
      aggregationType: 'sum',
      preserve: 'by',
      operator: '/',
      switchOpen: false,
      matchOn: 'on',
      ComparisonBehavior: 'filter',
      ignoreLabels: [''],
      groupingLabels: [''],
      matchType: 'one-to-one',
      fun: 'rate',
      valueType: 'numberLiteral',
      numValue: 0,
      stringValue: '',
      unaryOperator: '-',
    });
    const rules = {
      numValue: [{
        type: 'number',
        trigger: 'blur',
        message: 'Invalid number format',
      }]
    };
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
      functionList: [
        {name: 'abs() — return absolute values of input series', value: 'abs'},
        {name: 'absent() — determine whether input vector is empty', value: 'absent'},
        {name: 'absent_over_time() — determine whether input range vector is empty', value: 'absent_over_time'},
        {name: 'avg_over_time() — average series values over time', value: 'avg_over_time'},
        {name: 'ceil() — round up values of input series to nearest integer', value: 'ceil'},
        {name: 'changes() — return number of value changes in input series over time', value: 'changes'},
        {name: 'clamp_max() — limit the value of input series to a maximum', value: 'clamp_max'},
        {name: 'clamp_min() — limit the value of input series to a minimum', value: 'clamp_min'},
        {name: 'count_over_time() — count the number of values for each input series', value: 'count_over_time'},
        {name: 'day_of_month() — return the day of the month for provided timestamps', value: 'day_of_month'},
        {name: 'day_of_week() — return the day of the week for provided timestamps', value: 'day_of_week'},
        {name: 'days_in_month() — return the number of days in current month for provided timestamps', value: 'days_in_month'},
        {name: 'delta() — calculate the difference between beginning and end of a range vector (for gauges)', value: 'delta'},
        {name: 'deriv() — calculate the per-second derivative over series in a range vector (for gauges)', value: 'deriv'},
        {name: 'exp() — calculate exponential function for input vector values', value: 'exp'},
        {name: 'floor() — round down values of input series to nearest integer', value: 'floor'},
        {name: 'histogram_quantile() — calculate quantiles from histogram buckets', value: 'histogram_quantile'},
        {name: 'holt_winters() — calculate smoothed value of input series', value: 'holt_winters'},
        {name: 'hour() — return the hour of the day for provided timestamps', value: 'hour'},
        {name: 'idelta() — calculate the difference between the last two samples of a range vector (for counters)', value: 'idelta'},
        {name: 'increase() — calculate the increase in value over a range of time (for counters)', value: 'increase'},
        {name: 'irate() — calculate the per-second increase over the last two samples of a range vector (for counters)', value: 'irate'},
        {name: 'label_join() — join together label values into new label', value: 'label_join'},
        {name: 'label_replace() — set or replace label values', value: 'label_replace'},
        {name: 'ln() — calculate natural logarithm of input series', value: 'ln'},
        {name: 'log10() — calculate base-10 logarithm of input series', value: 'log10'},
        {name: 'log2() — calculate base-2 logarithm of input series', value: 'log2'},
        {name: 'max_over_time() — return the maximum value over time for input series', value: 'max_over_time'},
        {name: 'min_over_time() — return the minimum value over time for input series', value: 'min_over_time'},
        {name: 'minute() — return the minute of the hour for provided timestamps', value: 'minute'},
        {name: 'month() — return the month for provided timestamps', value: 'month'},
        {name: 'predict_linear() — predict the value of a gauge into the future', value: 'predict_linear'},
        {name: 'quantile_over_time() — calculate value quantiles over time for input series', value: 'quantile_over_time'},
        {name: 'rate() — calculate per-second increase over a range vector (for counters)', value: 'rate'},
        {name: 'resets() — return number of value decreases (resets) in input series of time', value: 'resets'},
        {name: 'round() — round values of input series to nearest integer', value: 'round'},
        {name: 'scalar() — convert single-element series vector into scalar value', value: 'scalar'},
        {name: 'sort() — sort input series ascendingly by value', value: 'sort'},
        {name: 'sort_desc() — sort input series descendingly by value', value: 'sort_desc'},
        {name: 'sqrt() — return the square root for input series', value: 'sqrt'},
        {name: 'stddev_over_time() — calculate the standard deviation within input series over time', value: 'stddev_over_time'},
        {name: 'stdvar_over_time() — calculate the standard variation within input series over time', value: 'stdvar_over_time'},
        {name: 'sum_over_time() — calculate the sum over the values of input series over time', value: 'sum_over_time'},
        {name: 'time() — return the Unix timestamp at the current evaluation time', value: 'time'},
        {name: 'timestamp() — return the Unix timestamp for the samples in the input vector', value: 'timestamp'},
        {name: 'vector() — convert a scalar value into a single-element series vector', value: 'vector'},
        {name: 'year() — return the year for provided timestamps', value: 'year'},
      ],
      metricNameList: [],
      labelNameList: [],
      valueList: [],
      valueListFilter: [],
    })
    const matchState = (state = '', reg: any) => {
      return !!String(state).match(reg) //返回true/false
    }
    const handleSearch = (value: string) => {
      if (value) {
        state.metricNameList = props.metricNameData.filter((item: string) => item.toLocaleLowerCase().startsWith(value))
      }
    }
    const handleSearchLabel = (value: string) => {
      if (value) {
        state.labelNameList = props.labelNameData.filter((item: string) => item.toLocaleLowerCase().startsWith(value))
      }
    }
    const handleChangeLabel = async (value: string) => {
      const data = await promRepository.queryValueByLabelName(value);
      state.valueList = data.data;
    }
    const handleSearchValue = (value: any) => {
      if (value) {
        state.valueListFilter = state.valueList.filter((item: string) => item.toLocaleLowerCase().startsWith(value))
      }
    }
    const addLabelMatcher = (index: number) => {
      if (formState.labelMatchers[index].labelName && formState.labelMatchers[index].labelValue) {
        console.log(index, 'add', formState.labelMatchers[index]);
        formState.labelMatchers[index].showAdd = false;
        formState.labelMatchers.push({
          labelName: undefined, labelValue: undefined, sign: '=', showAdd: true
        })
      }
    }
    const deleteLabelMatcher = (index: number) => {

    }
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
        if (formState.queryType === 'Subquery') {
          formState.range = '1h'
        } else if (formState.queryType === 'SelectData') {
          formState.range = '5m'
        }
      })
    })

    return {
      onSubmit,
      matchState,
      handleSearch,
      handleSearchLabel,
      handleChangeLabel,
      handleSearchValue,
      addLabelMatcher,
      deleteLabelMatcher,
      activeKey,
      formRef,
      formState,
      rules,
      ...toRefs(state),
    }
  }
}
</script>

<style scoped lang="less">
@import 'index.less';
</style>
