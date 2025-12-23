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
    isAll : boolean
}

export function getUserList(props: UserPaginationProps): ApiResponse<any> {
    if ( !functions.isEmpty(props.page) && !functions.isEmpty(props.take) && !functions.isEmpty(props.order) && !functions.isEmpty(props.orderName) ) {
        return api.get(`/aiga-users?orderName=${props.orderName}&order=${props.order}&page=${props.page}&take=${props.take}`);
    }else{
        return null;
    }
}
