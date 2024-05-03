import { auth, redirectToSignIn } from "@clerk/nextjs";
import WrappedPDFGen from "../_components/wrapped-pdf-gen";

export default function Home() {
  const {
    userId
  } = auth()
  if (!userId) {
    return redirectToSignIn()
  }
  return (
    <main className="w-full h-full p-2 px-3 bg-[#EDEADE] dark:bg-black">
      <WrappedPDFGen />
    </main>
  );
}
