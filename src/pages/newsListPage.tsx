import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchListPage from "@/components/SearchListPage";

const NewsListPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SearchListPage />
      <Footer />
    </div>
  );
};

export default NewsListPage;
