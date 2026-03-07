import App from "@/Components/Home/SproutsShow";
import Hero from "../Components/Home/Hero";
import HowItWorks from "../Components/Home/HowItWorks";
import PrivacyFirst from "../Components/Home/PrivacyFirst";

const Home = () => {
  return (
    <div className="bg-[#020617]">
      <Hero />
      <HowItWorks />
      <App />
      <PrivacyFirst />
    </div>
  );
};

export default Home;
