<template>
<div>
  <a-form layout="vertical" :model="formState" :rules="rules" ref="formRef" class="small">
    <a-form-item name="range">
      <label class="label-svg">Range: <QuestionCircleOutlined /></label>
      <a-input v-model:value="formState.range"></a-input>
    </a-form-item>
    <a-form-item name="offset">
      <label class="label-svg">Offset: <QuestionCircleOutlined /></label>
      <a-input v-model:value="formState.offset"></a-input>
    </a-form-item>
    <a-form-item name="step">
      <label class="label-svg">Resolution step: <QuestionCircleOutlined /></label>
      <a-input v-model:value="formState.step"></a-input>
    </a-form-item>
  </a-form>
  <a-button class="btn btn-secondary btn-sm" @click="onSubmit">
    <CheckOutlined />Apply changes
  </a-button>
</div>
</template>

<script lang="ts">
import {CheckOutlined, QuestionCircleOutlined} from '@ant-design/icons-vue'
import {inject, reactive, ref, watch} from "vue";
import {validatorRule} from "@/utils/common";

export default {
  name: "FormSubquery",
  components: {
    QuestionCircleOutlined,
    CheckOutlined,
  },
  props: ['subqueryExpr'],
  emits: ['previewChange'],
  setup(props, content) {
    const updateExprValue: any = inject('updateExprValue')
    const updateExprIndex: number | undefined = inject('updateExprIndex')
    const updateLeft = inject('updateLeft')
    const formState = reactive({
      offset: props.subqueryExpr?.offsetExpr?.duration || '0s',
      range: props.subqueryExpr?.range || '1h',
      step: props.subqueryExpr?.step || '0s',
    })
    const formRef = ref()

    const rules = {
      range: [
        { required: true, message: 'Please input range', trigger: 'blur' },
        {validator: validatorRule},
      ],
      offset: [{
        validator: validatorRule,
        trigger: 'blur',
      }],
      step: [{validator: validatorRule, trigger: 'blur'}],
    }

    const getSubquery = () => {
      const data: any = {
        range: formState.range,
        step: formState.step,
      }
      if (formState.offset.slice(0, -1) !== '0') {
        data.offsetExpr = {
          offset: true,
          duration: formState.offset,
        }
      }
      return data
    }

    const onSubmit = () => {
      const value = {
        subqueryExpr: getSubquery(),
        showLeft: updateLeft,
      }
      updateExprValue([value, 'subqueryExpr', updateExprIndex])
    }

    content.emit('previewChange', props.subqueryExpr)

    watch(formState, (value) => {
      formRef.value.validate().then(res => {
        content.emit('previewChange', getSubquery())
      }).catch(err => console.log(err, 'err'))
    })

    return {
      formRef,
      rules,
      formState,
      onSubmit,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
