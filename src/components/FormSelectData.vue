<template>
<div>
  <a-form layout="vertical" :model="formState" class="small">
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
  </a-form>
</div>
</template>

<script lang="ts">
import {QuestionCircleOutlined, DeleteOutlined, PlusOutlined, } from '@ant-design/icons-vue'
import {reactive, toRefs} from "vue";
import {labelNameData, metricNameData, promRepository} from "@/api/promRepository";

export default {
  name: "FormSelectData",
  components: {
    QuestionCircleOutlined,
    DeleteOutlined,
    PlusOutlined
  },
  setup() {
    const formState = reactive({
      metricName: undefined,
      labelMatchers: [
        { labelName: undefined, labelValue: undefined, sign: '=', showAdd: true },
      ],
      select: 'instance',
      offset: '0s',
      range: '5m',
    })

    const state = reactive({
      metricNameList: [],
      labelNameList: [],
      valueList: [],
      valueListFilter: [],
    })
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

    return {
      formState,
      handleSearch,
      handleSearchLabel,
      handleChangeLabel,
      handleSearchValue,
      addLabelMatcher,
      deleteLabelMatcher,
      ...toRefs(state),
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
