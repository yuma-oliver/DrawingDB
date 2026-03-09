import { create } from 'zustand';
import { useSearchStore } from './searchStore';

export const useDrawingStore = create((set, get) => ({
  selectedPdf: null,
  selectedGroup: null,
  selectedGroupPage: null,
  viewerMode: 'group', // 'group' | 'original'
  
  selectGroupById: (groupId) => {
    const { allDocs } = useSearchStore.getState();
    const pdf = allDocs.find(doc => doc.groups && doc.groups.some(g => g.id === groupId));
    
    if (pdf) {
      const group = pdf.groups.find(g => g.id === groupId);
      set({ 
        selectedPdf: pdf,
        selectedGroup: group,
        selectedGroupPage: group.startPage,
        viewerMode: 'group'
      });
    } else {
      set({ selectedPdf: null, selectedGroup: null, selectedGroupPage: null, viewerMode: 'group' });
    }
  },
  
  selectGroup: (group) => {
    set({ selectedGroup: group, selectedGroupPage: group.startPage, viewerMode: 'group' });
  },

  setGroupPage: (pageNum) => {
    set({ selectedGroupPage: pageNum });
  },

  setViewerMode: (mode) => {
    set({ viewerMode: mode });
  },
  
  clearSelection: () => {
    set({ selectedPdf: null, selectedGroup: null, selectedGroupPage: null, viewerMode: 'group' });
  }
}));
