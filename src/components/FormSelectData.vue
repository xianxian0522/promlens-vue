<template>
<div>
  <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" class="small">
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
      <div class="mb-1 row no-gutters" v-for="(label, index) in labelMatchers" :key="index">
        <div class="col">
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
                  v-model:value="label.matchOp"
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
        <div class="col">
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
              <a-button v-if="label.showAdd" @click="addLabelMatcher(label, index)" class="btn btn-secondary btn-sm">
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
    <a-form-item name="offset">
      <label class="label-svg">Offset: <QuestionCircleOutlined /></label>
      <a-input v-model:value="formState.offset"></a-input>
    </a-form-item>
  </a-form>
  <a-button class="btn btn-secondary btn-sm" @click="onSubmit">
    <CheckOutlined />Apply changes
  </a-button>
</div>
</template>

<script lang="ts">
import {QuestionCircleOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, } from '@ant-design/icons-vue'
import {onMounted, reactive, ref, toRefs, watch, readonly, toRaw, inject} from "vue";
import {labelNameData, metricNameData, promRepository} from "@/api/promRepository";
import {validatorRule} from "@/utils/common";

export interface Label {
  labelName: string;
  labelValue: string;
  matchOp: string;
  showAdd: boolean
}

export default {
  name: "FormSelectData",
  props: ['vectorSelector'],
  emits: ['previewChange'],
  components: {
    QuestionCircleOutlined,
    DeleteOutlined,
    PlusOutlined,
    CheckOutlined,
  },
  setup(props: any, content) {
    console.log(props, 'props select data')
    const updateExprValue: any = inject('updateExprValue')
    const updateExprIndex: number | undefined = inject('updateExprIndex')
    const formRef = ref()
    const formState = reactive({
      metricName: (props.vectorSelector?.metricIdentifier) || undefined,
      labelMatchers: [] as Label[],
      select: props.vectorSelector?.offsetExpr?.offset ? 'range' : 'instance',
      offset: props.vectorSelector?.matrixSelector.duration || '0s',
      range: props.vectorSelector?.offsetExpr?.duration || '5m',
    })
    const state = reactive({
      metricNameList: [] as string[],
      labelNameList: [] as string[],
      valueList: [],
      valueListFilter: [],
      labelMatchers: [
        { labelName: undefined, labelValue: undefined, matchOp: '=', showAdd: true },
      ],
    })
    // const validatorRule = async (rule, value) => {
    //   const num = value.slice(0, -1)
    //   const str = value.slice(-1)
    //   if (str === 's' || str === 'm' || str === 'h' || str === 'd' || str === 'w' || str === 'y') {
    //     if (Number(num) || parseInt(num, 10) === 0) {
    //       return Promise.resolve();
    //     }
    //     return Promise.reject('Unable to parse duration string: invalid duration string');
    //   } else {
    //     return Promise.reject('Unable to parse duration string: invalid duration string');
    //   }
    // }
    const rules = {
      offset: [{
        validator: validatorRule,
        trigger: 'blur',
      }],
    }

    const handleSearch = (value: string) => {
      if (value) {
        state.metricNameList = metricNameData.value.filter((item: string) => item.toLocaleLowerCase().startsWith(value))
      }
    }
    const handleSearchLabel = (value: string) => {
      if (value) {
        state.labelNameList = labelNameData.value.filter((item: string) => item.toLocaleLowerCase().startsWith(value))
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
    const addLabelMatcher = (label: Label, index: number) => {
      if (state.labelMatchers[index].labelName && state.labelMatchers[index].labelValue) {
        state.labelMatchers[index].showAdd = false;
        state.labelMatchers.push({
          labelName: undefined, labelValue: undefined, matchOp: '=', showAdd: true
        })
        formState.labelMatchers.splice(index, 0, label)
      }
    }
    const deleteLabelMatcher = (index: number) => {
      formState.labelMatchers.splice(index, 1)
      state.labelMatchers.splice(index, 1)
    }

    const onSubmit = () => {
      formRef.value
          .validate()
          .then(() => {
            console.log('values', formState, toRaw(formState));
            const value: any = {
              vectorSelector: {
                metricIdentifier: formState.metricName,
                labelMatchers: formState.labelMatchers,
                matrixSelector: {
                  expr: {},
                  duration: formState.offset,
                },
              }
            }
            if (formState.select === 'range') {
              value.vectorSelector.offsetExpr = {
                offset: formState.select,
                duration: formState.range,
              }
            }
            updateExprValue([value, 'vectorSelector', updateExprIndex])
          })
          .catch((error: any) => {
            console.log('error', error);
          });
    };

    onMounted(() => {
      content.emit('previewChange', formState)
      if (formState.metricName) {
        state.metricNameList.push(formState.metricName)
      }
      if (props.vectorSelector?.labelMatchers) {
        const p = props.vectorSelector.labelMatchers;
        p.forEach((item, index) => {
          state.labelMatchers[index] = item
          formState.labelMatchers[index] = item
        })
        state.labelMatchers[p.length] = {
          labelName: undefined, labelValue: undefined, matchOp: '=', showAdd: true
        }
      }
      if (props.vectorSelector?.matrixSelector.duration) {
        formState.offset = props.vectorSelector.matrixSelector.duration
      }

      watch(formState, (value) => {
        formRef.value.validate().then(res => {
          console.log(res, 'res')
          content.emit('previewChange', value)
        }).catch(err => console.log(err, 'err'))
      })
    })

    return {
      formRef,
      rules,
      formState,
      handleSearch,
      handleSearchLabel,
      handleChangeLabel,
      handleSearchValue,
      addLabelMatcher,
      deleteLabelMatcher,
      onSubmit,
      ...toRefs(state),
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
