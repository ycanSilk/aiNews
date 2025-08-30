import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutMe from "@/components/aboutme/AboutMe";
import aboutMeConfig from "@/data/local/cn/aboutMe.json";

const AboutMeCh = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutMe config={aboutMeConfig} />
      <Footer />
    </div>
  );
};

export default AboutMeCh;
