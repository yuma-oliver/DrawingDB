import { create } from 'zustand';
const getFlatGroups = (pdfs) => {
  return pdfs.flatMap(pdf => 
    pdf.groups.map(group => ({
      ...group,
      pdfId: pdf.id,
      pdfTitle: pdf.title,
      projectName: pdf.projectName,
      market: pdf.market,
      decade: pdf.decade
    }))
  );
};

export const useSearchStore = create((set, get) => ({
  keyword: '',
  selectedTags: [],
  drawingType: 'All',
  selectedMarket: 'All',
  selectedDecade: 'All',
  selectedProjectName: 'All',
  allDocs: [],
  allGroups: [],
  results: [],
  viewMode: 'grid', 
  gridSize: 'medium',
  
  setKeyword: (keyword) => set({ keyword }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  setDrawingType: (type) => set({ drawingType: type }),
  setSelectedMarket: (market) => set({ selectedMarket: market }),
  setSelectedDecade: (decade) => set({ selectedDecade: decade }),
  setSelectedProjectName: (projectName) => set({ selectedProjectName: projectName }),
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
  
  removePdf: (pdfId) => {
    set((state) => {
      const newDocs = state.allDocs.filter(d => d.id !== pdfId);
      const newGroups = getFlatGroups(newDocs);
      return {
        allDocs: newDocs,
        allGroups: newGroups
      };
    });
    get().performSearch();
  },

  updatePdf: (pdfId, updates) => {
    set((state) => {
      const newDocs = state.allDocs.map(d => d.id === pdfId ? { ...d, ...updates } : d);
      const newGroups = getFlatGroups(newDocs);
      return {
        allDocs: newDocs,
        allGroups: newGroups
      };
    });
    get().performSearch();
  },
  
  performSearch: () => {
    const { keyword, selectedTags, drawingType, selectedMarket, selectedDecade, selectedProjectName, allGroups } = get();
    let filtered = [...allGroups];
    
    if (selectedMarket !== 'All') {
      filtered = filtered.filter(p => p.market === selectedMarket);
    }
    if (selectedDecade !== 'All') {
      filtered = filtered.filter(p => p.decade === selectedDecade);
    }
    if (selectedProjectName !== 'All') {
      filtered = filtered.filter(p => p.projectName === selectedProjectName);
    }

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
      selectedMarket: 'All',
      selectedDecade: 'All',
      selectedProjectName: 'All',
      results: [...allGroups].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    });
  }
}));
