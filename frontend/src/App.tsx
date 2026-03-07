import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "@/Pages/Home";
import HowItWorks from "@/Pages/HowItWorks";
import PrivacyFirst from "@/Pages/PrivacyFirst";
import OnboardingStart from "@/Pages/OnboardingStart";
import OnboardingFamily from "@/Pages/OnboardingFamily";
import Dashboard from "@/Pages/Dashboard";
import { AnimeNavBar } from "./Components/Home/AnimeNavbar";
import Footer from "./Components/Footer";
import { ShieldCheck, Sprout, Home as HomeIcon } from "lucide-react";

const navItems = [
  { name: "Home", url: "/", icon: HomeIcon },
  { name: "How It Works", url: "/how-it-works", icon: Sprout },
  { name: "Privacy", url: "/privacy-first", icon: ShieldCheck },
];

function AppLayout() {
  const location = useLocation();
  const isOnboarding =
    location.pathname.startsWith("/onboarding") ||
    location.pathname === "/dashboard";

  return (
    <>
      {!isOnboarding && <AnimeNavBar items={navItems} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/privacy-first" element={<PrivacyFirst />} />
        <Route path="/onboarding/start" element={<OnboardingStart />} />
        <Route path="/onboarding/family" element={<OnboardingFamily />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {!isOnboarding && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
