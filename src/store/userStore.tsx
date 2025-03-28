import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware'
import * as Cookies from 'utils/cookies';
interface UserData {
    is_state : boolean;
    staff_id: string;
    is_master:boolean;
    setUserState: (
        state : boolean,
        staff_id: string,
        is_master:boolean
    ) => void;
}

const UserStateStore = create<UserData>()(
    devtools(
        persist(
            (set) => ({
                is_state: false,
                staff_id: '',
                is_master: false,
                setUserState: (is_state,staff_id,is_master) => {
                    set((state) => ({ is_state,staff_id,is_master }));
                    if ( is_state ) {
                        Cookies.setCookie('LoginUser',JSON.stringify({is_state,staff_id,is_master}));
                    }else{
                        Cookies.removeCookie('LoginUser');
                    }
                },
            }),
            { name: 'UserStateStore' }
        )
    )
);

export default UserStateStore;