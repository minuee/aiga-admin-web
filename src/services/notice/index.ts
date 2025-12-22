import { api, ApiResponse } from '../api';

import functions from "utils/functions";

interface PaginationProps {
    page: number;
    take: number;
    order: string;
    orderName: string;
    isAll : boolean
}

export function getHospitalList(props: PaginationProps): ApiResponse<any> {
    if ( !functions.isEmpty(props.page) && !functions.isEmpty(props.take) && !functions.isEmpty(props.order) && !functions.isEmpty(props.orderName) ) {
        return api.get(`/hospitals?orderName=${props.orderName}&order=${props.order}&page=${props.page}&take=${props.take}&isAll=${props.isAll}`);
    }else{
        return null;
    }
}

export async function getNoticeList(): Promise<any> {
    try{
        return await api.get(`/notice`);
    }catch(e:any){
        console.log("getNoticeList e",e)
        return null;
    }
}

interface saveDataProps {
    noticeId : string,
    title :  string,
    content : string,
    is_active : boolean,
    open_date :  string,
    writer : string
}

export function postNoticeData(reqData:saveDataProps): ApiResponse<any> {
    try{
        if ( reqData?.noticeId ) {
            const res:any =  api.post(`/admin/patch/${reqData?.noticeId}`,reqData)
            .then((response) => {
                 return response?.data;
            }).catch((error):any => {
                 console.log("eeeee",error)
                return null;
            });
            return res;
        }else{
            const res:any =  api.post(`/admin/notice`,reqData)
            .then((response) => {
                 return response?.data;
            }).catch((error):any => {
                 console.log("eeeee",error)
                return null;
            });
            return res;
        }
       
    }catch(error){
        console.log("eeeee",error)
        return null;   
    }
}