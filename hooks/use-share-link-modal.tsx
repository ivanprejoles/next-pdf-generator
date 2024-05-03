import { create } from "zustand";

interface useShareLink {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
}

export const useShareModal = create<useShareLink>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))