import request from "@/utils/request";
import {reactive, ref, toRefs} from "vue";
import {dataInfo} from "@/utils/common";
import {numberLiteral, selectData, stringLiteral, metricNameData, labelNameData} from "@/utils/store";

const ApiQuery = '/api/v1/query_range';
const ApiLabelName = '/api/v1/label/__name__/values';
const ApiMetadata = '/api/v1/metadata';
const ApiLabels = '/api/v1/labels';
const ApiValue = '/api/v1/label';
const ApiQueryAll = '/api/v1/query';
const ApiExpr = '/api/parse';
const ApiQueryGraph = '/api/v1/query_range'

// const metricNameData = ref();
// const labelNameData = ref();
const storeState = reactive({
    metricNameData: [],
    labelNameData: [],
})

const promRepository: any = {};
promRepository.queryLabelName = (params?: any) => request.get(`${ApiLabelName}`, params)
    // .then((res: any) => {
    //     metricNameData.value = res.data
    //     storeState.metricNameData = res.data
    // }).catch(err => console.error(err))

promRepository.query = (params?: any) => request.get(`${ApiQuery}`, params).catch(err => console.error(err))

promRepository.queryMetadata = (params?: any) => request.get(`${ApiMetadata}`, params).catch(err => console.error(err))

promRepository.queryLabel = (params?: any) => request.get(`${ApiLabels}`, params)
    // .then((res: any) => {
    //     labelNameData.value = res.data
    //     storeState.labelNameData = res.data
    // }).catch(err => console.error(err))

promRepository.queryValueByLabelName = (labelName: string) => request.get(`${ApiValue}/${labelName}/values`).catch(err => console.error(err))

promRepository.queryDataAll = (params?: any) => request.get(`${ApiQueryAll}`, params)

promRepository.queryExprParse = (params?: any) => request.get(`${ApiExpr}`, params)

promRepository.queryGraphData = (params?: any) => request.get(`${ApiQueryGraph}`, params)

// promRepository.queryDataAll = (str: string, params?: any) => {
//     if (str === 'vector') {
//         selectData.isLoading = true
//     }
//     request.get(`${ApiQueryAll}`, params)
//         .then((res: any) => {
//             if (str === 'vector') {
//                 selectData.status = res.status
//                 selectData.data = res.data.result
//                 selectData.isLoading = false
//                 selectData.keyInfo = dataInfo(selectData.data)
//             }
//             // selectData.resultType = res.data.resultType
//             // if (selectData.resultType === 'vector') {
//             //     selectData.keyInfo = dataInfo(selectData.data)
//             // }
//             // console.log(res, 'query res', queryData,)
//             // return {...res}
//         })
//         .catch(err => {
//             const value = {...err.response?.data}
//             if (str === 'vector') {
//                 selectData.status = value.status
//                 selectData.error = value.error
//                 selectData.isLoading = false
//             }
//             // console.log({...err.response}, queryData)
//         })
// }

promRepository.queryLiteral = (str: string, params?: any) => {
    if (str === 'numberLiteral') {
        numberLiteral.isLoading = true
    } else {
        stringLiteral.isLoading = true
    }
    request.get(`${ApiQueryAll}`, params)
        .then((res: any) => {
            if (str === 'numberLiteral') {
                numberLiteral.status = res.status
                numberLiteral.data = res.data.result
                numberLiteral.isLoading = false
            } else {
                stringLiteral.status = res.status
                stringLiteral.data = res.data.result
                stringLiteral.isLoading = false
            }
        })
        .catch(err => {
            const value = {...err.response?.data}
            if (str === 'numberLiteral') {
                numberLiteral.status = value.status
                numberLiteral.error = value.error
                numberLiteral.isLoading = false
            } else {
                stringLiteral.status = value.status
                stringLiteral.error = value.error
                stringLiteral.isLoading = false
            }
        })
}

// promRepository.queryStringLiteral = (params?: any) => {


export default promRepository
