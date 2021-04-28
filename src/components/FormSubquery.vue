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
</div>
</template>

<script lang="ts">
import {QuestionCircleOutlined} from '@ant-design/icons-vue'
import {reactive, ref, watch} from "vue";
import {validatorRule} from "@/utils/common";

export default {
  name: "FormSubquery",
  components: {
    QuestionCircleOutlined
  },
  props: ['subqueryExpr'],
  emits: ['previewChange'],
  setup(props, content) {
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

    content.emit('previewChange', formState)

    watch(formState, (value) => {
      formRef.value.validate().then(res => {
        console.log(res, 'sub query')
        content.emit('previewChange', value)
      }).catch(err => console.log(err, 'err'))
    })

    return {
      formRef,
      rules,
      formState,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
</style>
