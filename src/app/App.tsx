import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../pages/Home/Home";
import { ThemeProvider } from "@/components/ui/shadcn/theme-provider";

const App = () => {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
