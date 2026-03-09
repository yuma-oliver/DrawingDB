import { create } from 'zustand';
const getFlatGroups = (pdfs) => {
  return pdfs.flatMap(pdf => 
    pdf.groups.map(group => ({
      ...group,
      pdfId: pdf.id,
      pdfTitle: pdf.title,
      projectName: pdf.projectName
    }))
  );
};

export const useSearchStore = create((set, get) => ({
  keyword: '',
  selectedTags: [],
  drawingType: 'All',
  allDocs: [],
  allGroups: [],
  results: [],
  viewMode: 'grid', 
  gridSize: 'medium',
  
  setKeyword: (keyword) => set({ keyword }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  setDrawingType: (type) => set({ drawingType: type }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setGridSize: (size) => set({ gridSize: size }),
  
  addPdf: (newPdf) => {
    set((state) => {
      const newDocs = [newPdf, ...state.allDocs];
      const newGroups = getFlatGroups(newDocs);
      return {
        allDocs: newDocs,
        allGroups: newGroups
      };
    });
    get().performSearch();
  },
  
  performSearch: () => {
    const { keyword, selectedTags, drawingType, allGroups } = get();
    let filtered = [...allGroups];
    
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(lowerKeyword) || 
        p.projectName.toLowerCase().includes(lowerKeyword) ||
        p.description.toLowerCase().includes(lowerKeyword) ||
        p.pdfTitle.toLowerCase().includes(lowerKeyword)
      );
    }
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p => 
        selectedTags.some(tag => p.tags.includes(tag))
      );
    }
    
    if (drawingType !== 'All') {
      filtered = filtered.filter(p => p.drawingType === drawingType);
    }
    
    filtered.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    
    set({ results: filtered });
  },
  
  resetFilters: () => {
    const { allGroups } = get();
    set({
      keyword: '',
      selectedTags: [],
      drawingType: 'All',
      results: [...allGroups].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    });
  }
}));
