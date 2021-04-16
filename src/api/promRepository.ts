import request from "@/utils/request";

const API = '/api/v1/query_range';
const APILabel = '/api/v1/label/__name__/values';

const promRepository: any = {};
promRepository.queryLabel = (params?: any) => request.get(`${APILabel}`).catch(err => console.error(err))
promRepository.query = (params?: any) => request.get(`${API}`, params).catch(err => console.error(err))


export default promRepository
