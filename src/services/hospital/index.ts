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
    //yoyang_giho : string,
    ///reservation_site: any,
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