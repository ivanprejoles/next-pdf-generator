import Head from 'next/head';

import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

const MarketingLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="pt-[59px] h-auto bg-white dark:bg-black">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;