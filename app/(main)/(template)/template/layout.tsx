import TemplateNavBar from "./_components/template-navbar";

const MainLayout = ({
    children
}: {
    children: React.ReactNode
}) => {   
    return (  
        <div className="h-full flex flex-col">
            <TemplateNavBar />
            <main className="pt-[56px] w-full h-full items-center">
                {children}
            </main>
        </div>
    );
}
 
export default MainLayout;