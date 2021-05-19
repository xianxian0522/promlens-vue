import {reactive, ref} from "vue";

export const baseUrl = ref<string>('http://prometheus.proxy.sumscope.com:8000/')

export const selectData = reactive({
    status: '',
    data: [],
    keyInfo: [],
    error: '',
    isLoading: false,
    resultType: '',
})

export const numberLiteral = reactive({
    status: '',
    data: [],
    error: '',
    isLoading: false,
})

export const stringLiteral = reactive({
    status: '',
    data: [],
    error: '',
    isLoading: false,
})

export const binaryOperation = reactive({
    status: '',
    data: [],
    keyInfo: [],
    error: '',
    isLoading: false,
})
