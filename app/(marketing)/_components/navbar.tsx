import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/app/(main)/(template)/template/_components/mode-toggle";

export const Navbar = () => {
  return (
    <header className="z-50 flex flex-row justify-between items-center fixed py-2 mx-auto top-0 w-full border-b backdrop-blur-sm bg-white/[0.6] dark:bg-black/[0.6] border-neutral-200 dark:border-white/[0.1]" style={{"transform": "none"}}>
      <div className=" mx-auto flex items-center w-full justify-between px-2">
        <Logo />  
        <div className="space-x-4 md:w-auto flex items-center justify-between w-full">
          <ModeToggle />
          <Button size="default" variant="outline" className="py-0">
            <Link href="/sign-in">
              Login
            </Link>
          </Button>
          <Button size="default" className="py-0">
            <Link href="/sign-up">
              Get Taskify for free
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};