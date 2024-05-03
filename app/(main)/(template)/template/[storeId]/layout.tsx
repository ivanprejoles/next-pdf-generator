import MainNav from "../_components/MainNav";

const MainLayout = ({
    children
}: {
    children: React.ReactNode
}) => {   
    return (  
        <div className="h-full flex flex-col">
            <MainNav />
            <main className="pt-[56px] w-full h-full items-center">
                {children}
            </main>
        </div>
    );
}
 
export default MainLayout;