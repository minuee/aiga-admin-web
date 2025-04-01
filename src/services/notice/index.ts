import { api, ApiResponse } from '../api';

import functions from "utils/functions";

interface PaginationProps {
    page: number;
    take: number;
    order: string;
    orderName: string;
}

export function getHospitalList(props: PaginationProps): ApiResponse<any> {
    if ( !functions.isEmpty(props.page) && !functions.isEmpty(props.take) && !functions.isEmpty(props.order) && !functions.isEmpty(props.orderName) ) {
        return api.get(`/api/v1/hospitals?orderName=${props.orderName}&order=${props.order}&page=${props.page}&take=${props.take}`);
    }else{
        return
    }
    
}
