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
            <a-radio style="display: block" value="bool">Return boolean values
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
            <div class="input-group my-bottom" v-for="(ignore, index) in ignoreLabels" :key="index">
              <a-input v-model:value="ignore.name" class="pending-input-item" placeholder="add label name"></a-input>
              <div class="input-group-append">
                <a-button v-if="ignore.isShow" @click="addIgnoreLabel(ignore, index)" class="btn btn-outline-secondary btn-sm" style="padding: 4px 8px">
                  <PlusOutlined style="font-size: 18px;" />
                </a-button>
                <a-button v-else @click="deleteIgnoreLabel(index)" class="btn btn-outline-secondary btn-sm" style="padding: 4px 8px">
                  <DeleteOutlined  style="font-size: 18px;" />
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
          <a-form-item v-if="formState.matchType !== 'one-to-one'">
            <label class="label-svg">Include labels: <QuestionCircleOutlined /></label>
            <div class="input-group my-bottom" v-for="(include, index) in includeLabels" :key="index">
              <a-input v-model:value="include.name" class="pending-input-item" placeholder="add label name"></a-input>
              <div class="input-group-append ">
                <a-button v-if="include.isShow" @click="addIncludeLabel(include, index)" class="btn btn-outline-secondary btn-sm" style="padding: 4px 8px">
                  <PlusOutlined style="font-size: 18px;" />
                </a-button>
                <a-button v-else @click="deleteIncludeLabel(index)" class="btn btn-outline-secondary btn-sm" style="padding: 4px 8px">
                  <DeleteOutlined style="font-size: 18px;" />
                </a-button>
              </div>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </a-form-item>
  </a-form>
  <a-button class="btn btn-secondary btn-sm" @click="onSubmit">
    <CheckOutlined />Apply changes
  </a-button>
</div>
</template>

<script lang="ts">
import {QuestionCircleOutlined, PlusOutlined, DeleteOutlined, CheckOutlined, } from '@ant-design/icons-vue'
import {inject, onMounted, reactive, ref, toRefs, watch} from "vue";

export interface Item {
  name: string;
  isShow: boolean;
}

export default {
  name: "FormBinaryOperation",
  props: ['binaryExpr'],
  emits: ['previewChange'],
  components: {
    QuestionCircleOutlined,
    PlusOutlined,
    DeleteOutlined,
    CheckOutlined,
  },
  setup(props: any, content) {
    // console.log(props.binaryExpr.operator, 'binaryExpr')
    const updateExprValue: any = inject('updateExprValue')
    const updateExprIndex: number | undefined = inject('updateExprIndex')
    const formState = reactive({
      operator: props.binaryExpr?.operator || '/',
      switchOpen: !!props.binaryExpr?.binModifiers,
      matchOn: props.binaryExpr?.binModifiers?.OnOrIgnoring.Ignoring ? 'ignoring' : 'on',
      ComparisonBehavior: props.binaryExpr?.binModifiers?.Bool ? 'bool' : 'filter',
      ignoreLabels: [] as string[],
      matchType: 'one-to-one',
      includeLabels: [] as string[],
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
      ignoreLabels: [{name: '', isShow: true}] as Item[],
      includeLabels: [{name: '', isShow: true}] as Item[],
    })

    content.emit('previewChange', props.binaryExpr)

    const matchState = (state = '', reg: any) => {
      return !!String(state).match(reg) //返回true/false
    }
    const addIgnoreLabel = (item: Item, index: number) => {
      if (item.name) {
        state.ignoreLabels.push({name: '', isShow: true})
        state.ignoreLabels[index].isShow = false;
        formState.ignoreLabels.splice(index, 0, item.name)
      }
    }
    const deleteIgnoreLabel = (index: number) => {
      formState.ignoreLabels.splice(index, 1)
      state.ignoreLabels.splice(index, 1)
    }
    const addIncludeLabel = (item: Item, index: number) => {
      if (item.name) {
        state.includeLabels.push({name: '', isShow: true})
        state.includeLabels[index].isShow = false
        formState.includeLabels.splice(index, 0, item.name)
      }
    }
    const deleteIncludeLabel = (index: number) => {
      formState.includeLabels.splice(index, 1)
      state.includeLabels.splice(index, 1)
    }
    const getBinary = () => {
      const data: any = {
        left: props.binaryExpr?.left,
        operator: formState.operator,
        right: props.binaryExpr?.right,
      }
      if (formState.switchOpen) {
        data.binModifiers = {
          Bool: formState.ComparisonBehavior === 'bool',
          OnOrIgnoring: {},
          group: {}
        }

        if (formState.matchOn === 'ignoring') {
          data.binModifiers.OnOrIgnoring.Ignoring = []
          state.ignoreLabels.forEach((item, index) => {
            if (item.name) {
              data.binModifiers.OnOrIgnoring.Ignoring.splice(index, 1, item.name)
            }
          })
        } else {
          data.binModifiers.OnOrIgnoring.On = []
          state.ignoreLabels.forEach((item, index) => {
            if (item.name) {
              data.binModifiers.OnOrIgnoring.On.splice(index, 1, item.name)
            }
          })
        }
        if (formState.matchType === 'many-to-one') {
          data.binModifiers.group.GroupLeft = []
          state.includeLabels.forEach((item, index) => {
            if (item.name) {
              data.binModifiers.group.GroupLeft.splice(index, 1, item.name)
            }
          })
        } else if (formState.matchType === 'one-to-many') {
          data.binModifiers.group.GroupRight = []
          state.includeLabels.forEach((item, index) => {
            if (item.name) {
              data.binModifiers.group.GroupRight.splice(index, 1, item.name)
            }
          })
        }
      }
      return data
    }

    const onSubmit = () => {
      const value = {
        binaryExpr: getBinary(),
      }
      updateExprValue([value, 'binaryExpr', updateExprIndex])
    }

    onMounted(() => {
      let ignoreList = [];
      let includeList = [];
      if (props.binaryExpr?.binModifiers?.OnOrIgnoring.Ignoring) {
        ignoreList = props.binaryExpr.binModifiers.OnOrIgnoring.Ignoring
      } else if (props.binaryExpr?.binModifiers?.OnOrIgnoring.On) {
        ignoreList = props.binaryExpr.binModifiers.OnOrIgnoring.On
      }
      if (props.binaryExpr?.binModifiers?.group.GroupLeft) {
        formState.matchType = 'many-to-one'
        includeList = props.binaryExpr.binModifiers.group.GroupLeft
      } else if (props.binaryExpr?.binModifiers?.group.GroupRight) {
        formState.matchType = 'one-to-many'
        includeList = props.binaryExpr.binModifiers.group.GroupRight
      }
      ignoreList.forEach((item, index) => {
        formState.ignoreLabels.splice(index, 1, item)
        state.ignoreLabels.splice(index, 1, {name: item, isShow: false})
      })
      includeList.forEach((item, index) => {
        formState.includeLabels.splice(index, 1, item)
        state.includeLabels.splice(index, 1, {name: item, isShow: false})
      })
      state.ignoreLabels.splice(ignoreList.length, 1, {name: '', isShow: true})
      state.includeLabels.splice(includeList.length, 1, {name: '', isShow: true})

      watch(formState, (value => {
        content.emit('previewChange', getBinary())
      }))
    })

    return {
      formState,
      ...toRefs(state),
      matchState,
      addIgnoreLabel,
      deleteIgnoreLabel,
      addIncludeLabel,
      deleteIncludeLabel,
      onSubmit,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
