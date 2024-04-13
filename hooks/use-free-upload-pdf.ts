import { create } from "zustand";

interface useBasePDF {
    data: string|null,
    isUsed: boolean,
    setData: (pdf: string|null) => void,
    setUse: (use: boolean) => void,
}

export const useBasePDF = create<useBasePDF>((set) => ({
    data: null,
    setData: (pdf) => set((state) => ({
        ...state,
        data: pdf
    })),
    isUsed: false,
    setUse: (use) => set((state) => ({
        ...state,
        isUsed: use,
    }))

}))