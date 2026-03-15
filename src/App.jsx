import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import MountsList from './components/MountsList';
import MountDetail from './pages/MountDetail';
import NotFound from './components/NotFound';
import './App.css';
import {Analytics} from "@vercel/analytics/react";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<MountsList />} />
            <Route path="/mount/:id" element={<MountDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Analytics />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
