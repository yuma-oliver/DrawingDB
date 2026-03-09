import { create } from 'zustand';
import { mockDrawings } from '../shared/mock/drawings';

export const useSearchStore = create((set, get) => ({
  keyword: '',
  selectedTags: [],
  drawingType: 'All', // 'All', 'Plan', 'Equipment', 'Detail', 'Exterior'
  allDrawings: mockDrawings,
  results: mockDrawings,
  
  setKeyword: (keyword) => set({ keyword }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  setDrawingType: (type) => set({ drawingType: type }),
  
  addDrawing: (newDrawing) => {
    set((state) => ({
      allDrawings: [newDrawing, ...state.allDrawings]
    }));
    get().performSearch();
  },
  
  performSearch: () => {
    const { keyword, selectedTags, drawingType, allDrawings } = get();
    let filtered = [...allDrawings];
    
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(lowerKeyword) || 
        d.projectName.toLowerCase().includes(lowerKeyword) ||
        d.description.toLowerCase().includes(lowerKeyword)
      );
    }
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(d => 
        selectedTags.some(tag => d.tags.includes(tag))
      );
    }
    
    if (drawingType !== 'All') {
      filtered = filtered.filter(d => d.drawingType === drawingType);
    }
    
    set({ results: filtered });
  },
  
  resetFilters: () => {
    const { allDrawings } = get();
    set({
      keyword: '',
      selectedTags: [],
      drawingType: 'All',
      results: allDrawings
    });
  }
}));
