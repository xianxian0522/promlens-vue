<template>
<div>
  <a-form layout="vertical" :model="formState" class="small">
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
  </a-form>
</div>
</template>

<script lang="ts">
import {QuestionCircleOutlined, PlusOutlined} from '@ant-design/icons-vue'
import {reactive, toRefs} from "vue";

export default {
  name: "FormAggregate",
  components: {
    QuestionCircleOutlined,
    PlusOutlined,
  },
  setup() {
    const formState = reactive({
      aggregationType: 'sum',
      preserve: 'by',
      groupingLabels: [''],
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
    })

    return {
      formState,
      ...toRefs(state),
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
