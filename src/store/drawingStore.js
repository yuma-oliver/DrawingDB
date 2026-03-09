import { create } from 'zustand';
import { useSearchStore } from './searchStore';

export const useDrawingStore = create((set, get) => ({
  selectedDrawing: null,
  selectedPage: null,
  
  selectDrawingById: (id) => {
    const { allDrawings } = useSearchStore.getState();
    const drawing = allDrawings.find(d => d.id === id);
    if (drawing) {
      set({ 
        selectedDrawing: drawing,
        selectedPage: drawing.pages && drawing.pages.length > 0 ? drawing.pages[0] : null
      });
    } else {
      set({ selectedDrawing: null, selectedPage: null });
    }
  },
  
  selectPage: (page) => {
    set({ selectedPage: page });
  },
  
  clearSelection: () => {
    set({ selectedDrawing: null, selectedPage: null });
  }
}));
