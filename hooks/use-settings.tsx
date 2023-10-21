import { create } from "zustand";

interface UseSettingsProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useSettings = create<UseSettingsProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose : () => set({ isOpen : false })
}))