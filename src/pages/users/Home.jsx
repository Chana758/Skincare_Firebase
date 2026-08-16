// src/pages/users/Home.jsx
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Features from '../../components/common/Features'; 
import Banner from '../../components/layout/Banner';
import Categories from '../../components/common/Categories';
import BestSellers from '../../components/common/BestSellers';
import PromoBanners from '../../components/common/PromoBanners';
import InstagramFeed from '../../components/common/InstagramFeed';
import Testimonials from '../../components/common/Testimonials';
import TrustBadges from '../../components/common/TrustBadges';
import Newsletter from '../../components/common/Newsletter';

const Home = () => {
  const { isAdmin, isStaff, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("[Home] checking redirect:", { isAdmin, isStaff, loading }); // TEMP debug
    if (loading) return;
    if (isAdmin) navigate("/admin", { replace: true });
    else if (isStaff) navigate("/staff", { replace: true });
  }, [isAdmin, isStaff, loading, navigate]);

  if (loading || isAdmin || isStaff) return null;

  return (
    <div className="animate-fadeIn">
       <Banner/>
       <Features/>
       <Categories/>
       <BestSellers/>
       <PromoBanners/>
       <InstagramFeed/>
       <Testimonials/>
       <TrustBadges/>
       <Newsletter/>
    </div>
  )
}
export default Home;