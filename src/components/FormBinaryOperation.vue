<template>
<div>
  <a-form layout="vertical" :model="formState" class="small">
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
  </a-form>
</div>
</template>

<script lang="ts">
import {QuestionCircleOutlined, PlusOutlined, } from '@ant-design/icons-vue'
import {reactive, toRefs} from "vue";

export default {
  name: "FormBinaryOperation",
  components: {
    QuestionCircleOutlined,
    PlusOutlined,
  },
  setup() {
    const formState = reactive({
      operator: '/',
      switchOpen: false,
      matchOn: 'on',
      ComparisonBehavior: 'filter',
      ignoreLabels: [''],
      matchType: 'one-to-one',
    })
    const state = reactive({
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

    const matchState = (state = '', reg: any) => {
      return !!String(state).match(reg) //返回true/false
    }

    return {
      formState,
      ...toRefs(state),
      matchState,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
