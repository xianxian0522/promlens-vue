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
      <div class="input-group my-bottom" v-for="(group, index) in groupingLabels" :key="index">
        <a-input v-model:value="group.value" class="pending-input-item" placeholder="add label name"></a-input>
        <div class="input-group-append">
          <a-button v-if="group.isShow" @click="addGroupingLabels(group, index)" class="btn btn-outline-secondary btn-sm" style="padding: 4px 8px">
            <PlusOutlined style="font-size: 18px;" />
          </a-button>
          <a-button v-if="!group.isShow" @click="deleteGroupingLabels(index)" class="btn btn-outline-secondary btn-sm" style="padding: 4px 8px">
            <CloseOutlined style="font-size: 18px;" />
          </a-button>
        </div>
      </div>
    </a-form-item>
  </a-form>
</div>
</template>

<script lang="ts">
import {QuestionCircleOutlined, PlusOutlined, CloseOutlined} from '@ant-design/icons-vue'
import {onMounted, reactive, toRefs} from "vue";

export interface ItemGroup {
  value: undefined | string;
  isShow: boolean;
}

export default {
  name: "FormAggregate",
  components: {
    QuestionCircleOutlined,
    PlusOutlined,
    CloseOutlined,
  },
  props: ['aggregateExpr'],
  emits: ['previewChange'],
  setup(props, content) {
    console.log(props, 'agg')
    const formState = reactive({
      aggregationType: props.aggregateExpr.aggregateOp || 'sum',
      preserve: 'by',
      groupingLabels: [] as string[],
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
      groupingLabels: [{value: undefined, isShow: true}] as ItemGroup[],
    })

    const deleteGroupingLabels = (index: number) => {
      state.groupingLabels.splice(index, 1)
      formState.groupingLabels.splice(index, 1)
    }
    const addGroupingLabels = (item, index: number) => {
      if (item.value) {
        state.groupingLabels[index].isShow = false
        state.groupingLabels.push({value: undefined, isShow: true})
        formState.groupingLabels.splice(index, 0, item.value)
      }
    }

    onMounted(() => {
      let grouping
      if (props.aggregateExpr.aggregateModifier && props.aggregateExpr.aggregateModifier.Without) {
        formState.preserve = 'without'
        grouping = props.aggregateExpr.aggregateModifier.Without
      } else {
        grouping = props.aggregateExpr.aggregateModifier.By
      }
      grouping.forEach((item, index) => {
        formState.groupingLabels.splice(index, 1, item)
        state.groupingLabels.splice(index, 1, {value: item, isShow: false})
      })

      state.groupingLabels.splice(state.groupingLabels.length, 0, {value: undefined, isShow: true})

      content.emit('previewChange', formState)
    })

    return {
      formState,
      ...toRefs(state),
      deleteGroupingLabels,
      addGroupingLabels,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
