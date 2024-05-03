import Image from "next/image";

export const Logo = () => {
  return (
    <div className="transition items-center gap-x-2 hidden md:flex">
      <Image
        className="block dark:hidden"
        src="/images/pdf-gen-high-resolution-logo-black-transparent.svg"
        alt="Logo"
        height={100}
        width={100}
      />
      <Image
        className="hidden dark:block"
        src="/images/pdf-gen-high-resolution-logo-white-transparent.svg"
        alt="Logo"
        height={100}
        width={100}
      />
    </div>
  );
};