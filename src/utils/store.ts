import {reactive} from "vue";

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
