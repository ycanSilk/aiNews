import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutMe from "@/components/aboutme/AboutMe";
import aboutMeConfig from "@/data/local/en/aboutMe.json";

const AboutMeEn = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutMe config={aboutMeConfig} />
      <Footer />
    </div>
  );
};

export default AboutMeEn;
