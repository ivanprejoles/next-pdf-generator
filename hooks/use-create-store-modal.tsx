import { create } from "zustand";

interface useCreateStore {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
}

export const useCreateModal = create<useCreateStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))