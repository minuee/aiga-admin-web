import { api, ApiResponse } from '../api';
import functions from "utils/functions";
import { TUser } from "../auth"; // auth.ts가 상위 폴더에 있으므로 경로 수정

type TUserAccount = TUser & {
  password?: string;
};

interface UserPaginationProps {
    page: number;
    take: number;
    order: string;
    orderName: string;
    isAll : boolean;
    keyword?: string; // keyword 속성 추가
}

export function getUserList(props: UserPaginationProps): ApiResponse<any> {
    if ( !functions.isEmpty(props.page) && !functions.isEmpty(props.take) && !functions.isEmpty(props.order) && !functions.isEmpty(props.orderName) ) {
        let url = `/aiga-users?orderName=${props.orderName}&order=${props.order}&page=${props.page}&take=${props.take}`;
        if (props.keyword) { // keyword가 존재할 경우에만 URL에 추가
            url += `&searchType=nickname&keyword=${encodeURIComponent(props.keyword)}`;
        }
        return api.get(url);
    }else{
        return null;
    }
}

export function getUserDetail(userId: string): ApiResponse<any> {
    if ( !functions.isEmpty(userId) ) {
        return api.get(`/aiga-users/${userId}`);
    }else{
        return null;
    }
}

export function resetRestrictedTime(userId: string, adminId: string): ApiResponse<any> {
    if ( !functions.isEmpty(userId) && !functions.isEmpty(adminId) ) {
        return api.put(`/aiga-users/reset-restriction/${userId}`, { adminId });
    }else{
        return null;
    }
}
