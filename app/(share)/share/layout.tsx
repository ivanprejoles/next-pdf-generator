import { ShareNavbar } from "./_components/share-navbar";

const SharingLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full">
      <ShareNavbar />
      <main className="pt-[59px] h-full">
        {children}
      </main>
    </div>
  );
};

export default SharingLayout;