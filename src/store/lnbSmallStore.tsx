import { create } from "zustand";
import { devtools, persist,createJSONStorage } from 'zustand/middleware'
interface State {
    isSmall : boolean;
    setSmallState: (isSmall: boolean) => void;
}

const LnbSmallStateStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                isSmall: false,
                setSmallState: (isSmall:boolean) => {
                    set({isSmall});
                },
            }),
            { 
                name: 'LnbSmallStateStore',
                storage: createJSONStorage(() => sessionStorage)
            }
        )
    )
);

export default LnbSmallStateStore;