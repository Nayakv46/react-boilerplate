import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../pages/Home/Home";
import { ThemeProvider } from "@/components/ui/shadcn/theme-provider";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import Navbar from "@/components/Navbar/Navbar";

const App = () => {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/components" element={<Home />} />
          <Route path="/form" element={<Home />} />
          <Route path="/charts" element={<Home />} />
          <Route path="/tables" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
