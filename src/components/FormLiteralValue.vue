<template>
<div >
  <a-form layout="vertical" :model="formState" class="small">
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
  </a-form>
  <a-button class="btn btn-secondary btn-sm" @click.stop="onSubmit">
    <CheckOutlined />Apply changes
  </a-button>
</div>
</template>

<script lang="ts">
import {inject, onMounted, reactive, watch} from "vue";
import {CheckOutlined} from "@ant-design/icons-vue";
import {promRepository} from "@/api/promRepository";

export default {
  name: "FormLiteralValue",
  components: {CheckOutlined,},
  props: ['stringLiteral', 'numberLiteral'],
  emits: ['previewChange', 'numOrStr'],
  setup(props, content) {
    const updateExprValue: any = inject('updateExprValue')
    const updateExprIndex: number | undefined = inject('updateExprIndex')
    const updateLeft = inject('updateLeft')
    const queryAllData: any = inject('queryAllData')

    const formState = reactive({
      valueType: props.stringLiteral ? 'stringLiteral' : 'numberLiteral',
      numValue: props.numberLiteral || 0,
      stringValue: props.stringLiteral || '',
    })
    if (props.numberLiteral || props.stringLiteral === '') {
      formState.valueType = 'numberLiteral'
    }

    const getLiteral = () => {
      let value
      if (formState.valueType === 'numberLiteral') {
        value = formState.numValue
      } else {
        value = formState.stringValue
      }
      return value
    }

    const onSubmit = async () => {
      const value: any = {
        showLeft: updateLeft,
      }
      if (formState.valueType === 'numberLiteral') {
        value.numberLiteral = getLiteral()
        // await promRepository.queryLiteral('numberLiteral', {query: value.numberLiteral})
        await queryAllData()
        await updateExprValue([value, 'numberLiteral', updateExprIndex])
      } else {
        value.stringLiteral = getLiteral()
        // await promRepository.queryLiteral('stringLiteral', {query: '"' + value.stringLiteral + '"'})
        await queryAllData()
        await updateExprValue([value, 'stringLiteral', updateExprIndex])
      }
    }


    onMounted(() => {
      if (formState.valueType === 'numberLiteral') {
        content.emit('previewChange', props.numberLiteral)
        content.emit('numOrStr', 'numberLiteral')
      } else {
        content.emit('previewChange', props.stringLiteral)
        content.emit('numOrStr', 'stringLiteral')
      }

      watch(formState, () => {
        content.emit('previewChange', getLiteral())
        content.emit('numOrStr', formState.valueType)
      })
    })

    return {
      formState,
      onSubmit,
    }
  }
}
</script>

<style scoped lang="less">
@import "index.less";
.tab-content .ant-input-number {
  width: 100%;
}
</style>
