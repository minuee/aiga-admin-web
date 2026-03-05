import { api, ApiResponse } from '../api';
import functions from "utils/functions";

export function getDashBoardStatistics(): ApiResponse<any> {
    try{
        return api.get(`/statistics/dashboard`);
    }catch(e:any){
        console.log(`error of getStatistics : ${e}`)
        return null
    }
}

interface AnalysisProps {
    start_date: string;
    end_date: string;
    limit : number;
    searchType?: 'doctor' | 'hospital' | 'keyword' | 'token'; 
    keyword?: string; // keyword 추가 (선택 사항)
}

export function getAnalysisStatistics(props: AnalysisProps): ApiResponse<any> {
    try{
        const { start_date, end_date, limit, searchType, keyword } = props;
        let url = `/statistics/analysis?start_date=${start_date}&end_date=${end_date}&limit=${limit}&searchType=${searchType}&keyword=${keyword || ''}`;

        return api.get(url);
    }catch(e:any){
        console.log(`error of getAnalysisStatistics : ${e}`)
        return null
    }
}

interface PaginationProps {
    page: number;
    take: number;
    order: string;
    orderName: string;
    searchType?: '' | 'nickname' | 'session_id' | 'question'; // searchType 추가 (선택 사항)
    keyword?: string; // keyword 추가 (선택 사항)
}

export function getMessageList(props: PaginationProps): ApiResponse<any> {
    const { page, take, order, orderName, searchType, keyword } = props;

    if ( !functions.isEmpty(page) && !functions.isEmpty(take) && !functions.isEmpty(order) && !functions.isEmpty(orderName) ) {
        let url = `/statistics/message?orderName=${orderName}&order=${order}&page=${page}&take=${take}`;

        if (keyword && searchType) {
            url += `&searchType=${searchType}&keyword=${encodeURIComponent(keyword)}`;
        } else if (keyword && !searchType) { // searchType이 없으면 기본적으로 질문으로 검색
            url += `&searchType=question&keyword=${encodeURIComponent(keyword)}`;
        }

        return api.get(url);
    }else{
        return null;
    }
}


export function getMessageDetail(props: any): ApiResponse<any> {
    if ( !functions.isEmpty(props.session_id) ) {
        return api.get(`/statistics/message/${props.session_id}`);
    }else{
        return null;
    }
}


export function removeMessageData(props: any): ApiResponse<any> {
    if ( !functions.isEmpty(props.session_id) ) {
        return api.delete(`/statistics/message/${props.session_id}`);
    }else{
        return null;
    }
}


export function getDataVersion(): ApiResponse<any> {
    return api.get(`/statistics/data-version`);
}

export function getStandardDeptSpec(): ApiResponse<any> {
    return api.get(`/statistics/standard-dept-spec`);
}

export function getStandardSpecialty(): ApiResponse<any> {
    return api.get(`/statistics/standard-specialty`);
}

export function getStandardSpecialtyForDoctors(props: any): ApiResponse<any> {
    
    if ( !functions.isEmpty(props.standard_spec) ) {
        return api.get(`/statistics/standard-specialty-doctors/${props.standard_spec}`);
    }else{
        return null;
    }
}

export function updateStandardSpecialty(props: { spec_id: number; standard_group: string }): ApiResponse<any> {
    if ( !functions.isEmpty(props.spec_id) ) {
        return api.patch(`/statistics/standard-specialty-group/${props.spec_id}`, { standard_group: props.standard_group });
    }else{
        return null;
    }
}