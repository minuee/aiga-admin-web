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


export function putDoctorCareer(reqData:any): ApiResponse<any> {
    try{
        const bodyData = {
            jsondata : reqData?.jsondata,
            education : reqData?.education,
            career : reqData?.career,
            etc : reqData?.etc
        }
        const res:any =  api.put(`/doctors/career/${reqData?.rid}`,bodyData)
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


export function putDoctorBasic(reqData:any): ApiResponse<any> {
    try{
        const bodyData = {
            doctorname : reqData?.doctorname,
            profileimgurl : reqData?.profileimgurl,
            specialties : reqData?.specialties,
            new_doctor_url : reqData?.new_doctor_url,
            is_active : reqData?.is_active
        }
        const res:any =  api.put(`/doctors/basic/${reqData?.rid}`,bodyData)
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



export function deleteDoctorPaper(reqData:any): ApiResponse<any> {
    try{
        const res:any =  api.delete(`/doctors/paper/${reqData?.paper_id}`)
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