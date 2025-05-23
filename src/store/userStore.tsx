import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware'
import * as Cookies from 'utils/cookies';
interface AdminUserData {
    is_state : boolean;
    staff_id: string;
    is_master:boolean;
    nickName : string
    setAdminUserState: (
        state : boolean,
        staff_id: string,
        is_master:boolean,
        nickName : string
    ) => void;
}

const AdminUserStateStore = create<AdminUserData>()(
    devtools(
        persist(
            (set) => ({
                is_state: false,
                staff_id: '',
                is_master: false,
                nickName :'',
                setAdminUserState: (is_state,staff_id,is_master,nickName) => {
                    set((state) => ({ is_state,staff_id,is_master,nickName }));
                    if ( is_state ) {
                        Cookies.setCookie('AdminLoginUser',JSON.stringify({is_state,staff_id,is_master}));
                    }else{
                        console.log("AdminLoginUser out")
                        Cookies.removeCookie('AdminLoginUser');
                    }
                },
            }),
            { name: 'AdminUserStateStore' }
        )
    )
);

export default AdminUserStateStore;