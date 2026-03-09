import { Box } from '@mui/material';
import SearchBar from '../../features/drawing-search/components/SearchBar';
import FilterPanel from '../../features/drawing-search/components/FilterPanel';
import DrawingGrid from '../../features/drawing-search/components/DrawingGrid';
import { useEffect } from 'react';
import { useSearchStore } from '../../store/searchStore';

export default function SearchPage() {
  const { performSearch } = useSearchStore();

  useEffect(() => {
    // コンポーネントマウント時に初期検索を実行（モックデータをセット）
    performSearch();
  }, [performSearch]);

  return (
    <Box sx={{ p: 1 }}>
      <SearchBar />
      <FilterPanel />
      <DrawingGrid />
    </Box>
  );
}
