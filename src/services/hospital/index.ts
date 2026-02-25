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



interface saveDataProps {
    hid : string,
    address : string,
    baseName : string,
    shortName : string,
    lat : any,
    lon : any,
    hospital_site : string,
    reservation_site: any,
    telephone: any,
    //req_comment: any
}

export function setHospitalDetail(reqData:saveDataProps): ApiResponse<any> {
    try{
        const bodyData = {
            address : reqData?.address,
            baseName : reqData?.baseName,
            shortName : reqData?.shortName,
            lat : reqData?.lat,
            lon : reqData?.lon,
            telephone : reqData?.telephone,
            hospital_site : reqData?.hospital_site,
            reservation_site : reqData?.reservation_site
        }
        const res:any =  api.put(`/hospitals/${reqData?.hid}`,bodyData)
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



interface HospitalAliasProps {
    hid: string;
}

export function getHospitalAliasList(props: HospitalAliasProps): ApiResponse<any> {
    if ( !functions.isEmpty(props.hid)  ) {
        return api.get(`/hospitals/alias/${props.hid}`);
    }else{
        return null;
    }
}

interface HospitalEvaluationProps {
    hid: string;
}

export function getHospitalEvaluationList(props: HospitalEvaluationProps): ApiResponse<any> {
    if ( !functions.isEmpty(props.hid)  ) {
        return api.get(`/hospitals/evaluation/${props.hid}`);
    }else{
        return null;
    }
}

export function postHospitalAlias(reqData:any): ApiResponse<any> {
    try{
        const bodyData = {
            hid : reqData?.hid,
            standard_name : reqData?.standard_name,
            shortName : reqData?.shortName,
            alias_name : reqData?.alias_name,
        }
        const res:any =  api.post(`/hospitals/alias`,bodyData)
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


export function putHospitalAlias(reqData:any): ApiResponse<any> {
    try{
        const bodyData = {
            aid : reqData?.aid,
            alias_name : reqData?.alias_name,
        }
        const res:any =  api.put(`/hospitals/alias`,bodyData)
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

export function deleteHospitalAlias(reqData:any): ApiResponse<any> {
    try{
        const res:any =  api.delete(`/hospitals/alias/${reqData?.aid}`)
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