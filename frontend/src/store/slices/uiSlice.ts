import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme: 'light' | 'dark' | 'system';
  isSidebarOpen: boolean;
}

const initialState: UiState = {
  theme: 'system',
  isSidebarOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { setTheme, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
