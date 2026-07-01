import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../pages/Home/Home";
import { ThemeProvider } from "@/components/ui/shadcn/theme-provider";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import Navbar from "@/components/Navbar/Navbar";
import Components from "@/pages/Components/Components";
import Form from "@/pages/Form/Form";
import Charts from "@/pages/Charts/Charts";
import Tables from "@/pages/Tables/Tables";

const App = () => {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/components" element={<Components />} />
          <Route path="/form" element={<Form />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/tables" element={<Tables />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
