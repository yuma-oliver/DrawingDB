import { Paper, InputBase, IconButton, Divider } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useSearchStore } from '../../../store/searchStore';
import { useState } from 'react';

export default function SearchBar() {
  const { keyword, setKeyword, performSearch } = useSearchStore();
  const [localKeyword, setLocalKeyword] = useState(keyword);

  const handleSubmit = (e) => {
    e.preventDefault();
    setKeyword(localKeyword);
    performSearch();
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', mb: 3 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="図面名、案件名、説明などで検索"
        inputProps={{ 'aria-label': 'search drawings' }}
        value={localKeyword}
        onChange={(e) => setLocalKeyword(e.target.value)}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
