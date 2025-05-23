import { api, ApiResponse } from '../api';

import functions from "utils/functions";

interface PaginationProps {
    hospitalId: string;
    page: number;
    take: number;
    order: string;
    orderName: string;
    keyword? : string;
}

export function getDoctorList(props: PaginationProps): ApiResponse<any> {
    if ( !functions.isEmpty(props.page) && !functions.isEmpty(props.take) && !functions.isEmpty(props.order) && !functions.isEmpty(props.orderName) ) {
        return api.get(`/doctors/hid/${props.hospitalId}?orderName=${props.orderName}&order=${props.order}&page=${props.page}&take=${props.take}&keyword=${props.keyword}`);
    }else{
        return null;
    } 
}

interface PaperProps {
    doctorId: string;
}
export function getDoctorPaperList(props: PaperProps): ApiResponse<any> {
    if ( !functions.isEmpty(props.doctorId)  ) {
        return api.get(`/doctors/paper/${props.doctorId}`);
    }else{
        return null;
    } 
}