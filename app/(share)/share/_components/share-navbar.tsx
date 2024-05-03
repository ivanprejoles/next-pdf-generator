import { Logo } from "@/components/logo";
import { ModeToggle } from "@/app/(main)/(template)/template/_components/mode-toggle";

export const ShareNavbar = () => {
  return (
    <header className="z-50 flex flex-row justify-between items-center fixed py-2 mx-auto top-0 w-full border-b backdrop-blur-sm border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-background text-black dark:text-white" style={{"transform": "none"}} >
      <div className=" mx-auto flex items-center w-full justify-between px-2">
        <Logo />  
        <div className="space-x-4 md:w-auto flex items-center justify-end md:justify-between w-full">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};