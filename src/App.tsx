import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import YouTubeManualGenerator from "./pages/YouTubeManualGenerator";
import SearchResults from "./pages/SearchResults";
import CategoryPage from "./pages/CategoryPage";
import ArticleDetail from "./pages/ArticleDetail";
import Favorites from "./pages/Favorites";
import Roadmap from "./pages/Roadmap";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/search"} component={SearchResults} />
      <Route path={"/category/:categoryId"} component={CategoryPage} />
      <Route path={"/article/:articleId"} component={ArticleDetail} />
      <Route path={"/favorites"} component={Favorites} />
      <Route path={"/roadmap"} component={Roadmap} />
      <Route path={"/youtube-manual"} component={YouTubeManualGenerator} />
      <Route path={"/mypage"} component={MyPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
