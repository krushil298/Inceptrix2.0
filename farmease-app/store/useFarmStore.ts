import { create } from 'zustand';

interface FarmState {
    selectedCrop: string | null;
    soilType: string | null;
    location: { lat: number; lng: number } | null;
    diseaseHistory: any[];
    setSelectedCrop: (crop: string | null) => void;
    setSoilType: (type: string | null) => void;
    setLocation: (loc: { lat: number; lng: number } | null) => void;
    addDiseaseLog: (log: any) => void;
}

export const useFarmStore = create<FarmState>((set) => ({
    selectedCrop: null,
    soilType: null,
    location: null,
    diseaseHistory: [],
    setSelectedCrop: (crop) => set({ selectedCrop: crop }),
    setSoilType: (type) => set({ soilType: type }),
    setLocation: (loc) => set({ location: loc }),
    addDiseaseLog: (log) => set((s) => ({ diseaseHistory: [log, ...s.diseaseHistory] })),
}));
