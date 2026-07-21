// src/pages/user/Home.jsx
import Banner from "../../components/layout/Banner";
import Features from "../../components/common/Features";
import Categories from "../../components/common/Categories";
import BestSellers from "../../components/common/BestSellers";
import PromoBanners from "../../components/common/PromoBanners";
import InstagramFeed from "../../components/common/InstagramFeed";
import Testimonials from "../../components/common/Testimonials";
import TrustBadges from "../../components/common/TrustBadges";
import Newsletter from "../../components/common/Newsletter";

const Home = () => {
  return (
    <main>
      <Banner />
      <Features />
      <Categories />
      <BestSellers />
      <PromoBanners />
      <InstagramFeed />
      <Testimonials />
      <TrustBadges />
      <Newsletter />
    </main>
  );
};

export default Home;