import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import IndexEn from "./pages/Index.en";

import AboutMeEn from "./pages/en/AboutMe"; 
import AboutMeCh from "./pages/ch/AboutMe";
import ChineseTimeline from "./pages/ch/Timeline";
import EnglishTimeline from "./pages/en/Timeline";
import ArticlePageCh from "./pages/ch/ArticlePage";
import ArticlePageEn from "./pages/en/ArticlePage";
import ArticlesListPageCh from "./pages/ch/ArticlesListPage";
import ArticlesListPageEn from "./pages/en/ArticlesListPage";
import ArticleTemplateDemo from "./pages/ArticleTemplateDemo";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/en/index" replace />} />
            <Route path="/ch/index" element={<Index />} />
            <Route path="/ch/article" element={<ArticlePageCh />} />
            <Route path="/ch/articles" element={<ArticlesListPageCh />} />
            <Route path="/ch/timeline" element={<ChineseTimeline />} />
            <Route path="/ch/aboutme" element={<AboutMeCh />} />
            
            <Route path="/en/index" element={<IndexEn />} />            
            <Route path="/en/article" element={<ArticlePageEn />} />
            <Route path="/en/articles" element={<ArticlesListPageEn />} />
            <Route path="/en/timeline" element={<EnglishTimeline />} />
            <Route path="/en/aboutme" element={<AboutMeEn />} />
            <Route path="/demo/articles" element={<ArticleTemplateDemo />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
