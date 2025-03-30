import { create } from "zustand";
import { devtools, persist,createJSONStorage } from 'zustand/middleware'
interface State {
    isOpen : boolean;
    setOpenState: (isOpen: boolean) => void;
}

const LnbStateStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                isOpen: false,
                setOpenState: (isOpen:boolean) => {
                    set({isOpen});
                },
            }),
            { 
                name: 'LnbStateStore',
                storage: createJSONStorage(() => sessionStorage)
            }
        )
    )
);

export default LnbStateStore;