import { Outlet } from "react-router-dom";
import AnnounceBar from "./AnnounceBar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <>
      <AnnounceBar />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;