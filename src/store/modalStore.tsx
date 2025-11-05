import { create } from "zustand";
import { devtools, persist,createJSONStorage } from 'zustand/middleware'
interface State {
    isOpenNoticeDetailModal : boolean;
    setOpenNoticeDetailModal: (isOpenNoticeDetailModal: boolean) => void;
}

export const NoticeDetailModalStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                isOpenNoticeDetailModal: false,
                setOpenNoticeDetailModal: (isOpenNoticeDetailModal:boolean) => {
                    set({isOpenNoticeDetailModal});
                },
            }),
            { 
                name: 'NoticeDetailModalStore',
                storage: createJSONStorage(() => sessionStorage)
            }
        )
    )
);

