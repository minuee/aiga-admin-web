import { api, ApiResponse } from '../api';

import functions from "utils/functions";

interface PaginationProps {
    page: number;
    take: number;
    order: string;
    orderName: string;
    status?: '' | '0' | '1' | '9';
    keyword?: string;
}

export function getOpinionList(props: PaginationProps): ApiResponse<any> {
    const { page, take, order, orderName, status, keyword } = props;
    if ( !functions.isEmpty(page) && !functions.isEmpty(take) && !functions.isEmpty(order) && !functions.isEmpty(orderName) ) {
        let queryString = `orderName=${orderName}&order=${order}&page=${page}&take=${take}`;
        if (status) {
            queryString += `&is_clear=${status}`;
        }
        if (keyword) {
            queryString += `&keyword=${keyword}`;
        }
        return api.get(`/opinions?${queryString}`);
    }else{
        return null;
    }
}

interface UpdateOpinionProps {
    is_clear: string;
    comment: string;
}

export function updateOpinion(id: string, data: UpdateOpinionProps): ApiResponse<any> {
    return api.put(`/opinions/${id}`, data);
}

interface saveDataProps {
    opinion_type : string,
    title : string,
    content : string,
    opinion_id : string
}

export function putOpinionDetail(reqData:saveDataProps): ApiResponse<any> {
    try{
        const bodyData = {
            opinion_type : reqData?.opinion_type,
            title : reqData?.title,
            content : reqData?.content
        }
        const res:any =  api.put(`/opinions/${reqData?.opinion_id}`,bodyData)
        .then((response) => {
                return response?.data;
        }).catch((error):any => {
                console.log("eeeee",error)
            return null;
        });
        return res;
        
       
    }catch(error){
        console.log("eeeee",error)
        return null;   
    }
}