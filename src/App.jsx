import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard';
import NewInvoice from './components/NewInvoice';
import ViewInvoice from './components/ViewInvoice';
import EditInvoice from './components/EditInvoice';
import SearchResults from './components/SearchResults';
import GeneratePDF from './components/GeneratePDF';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoice/new" element={<NewInvoice />} />
          <Route path="/invoice/:id" element={<ViewInvoice />} />
          <Route path="/invoice/edit/:id" element={<EditInvoice />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/invoice/pdf/:id" element={<GeneratePDF />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

