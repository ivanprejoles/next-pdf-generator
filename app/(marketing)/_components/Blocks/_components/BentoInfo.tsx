import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import Image from "next/image";

export function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-4xl mx-auto absolute z-[60]  ">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
const items = [
  {
    title: "How to use pdf automation free",
    description: "upload base pdf ( or use the built in base pdf) for background and csv with header as name at first row and value as data of header, then click Make template to interact with the content.",
    header: <Image src='/bentoInfo/upload pdf.png' alt='bentoinfo'  width={280} height={150} />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Use built in pdf",
    description: "Built in pdf is used here, try to use next to use another built in, click try it to use built in padf.",
    header: <Image src='/bentoInfo/built in.png' alt='bentoinfo'  width={30} height={30}/>,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Designing the template",
    description: "After uploading required data and clicking the 'Make template' you can now design the template and put the data to its specific position.",
    header: <Image src='/bentoInfo/design temp.png' alt='bentoinfo'  width={30} height={30}/>,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Create multiple pdf",
    description:
      "now everything is done, click the download pdfs to create pdf by csv row number",
    header: <Image src='/bentoInfo/download pdf.png' alt='bentoinfo'  width={30} height={30}/>,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  // {
  //   title: "Use Non-free template generator",
  //   description: "To use the Non-free template generator, user need to login and create a template to save their data for future use. Using login template generator has its benefits. Saves template and shares template, can use form instead of sheet.",
  //   header: <Image src='/bentoInfo/login.png' alt='bentoinfo'  width={30} height={30}/>,
  //   icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  // },
  // {
  //   title: "Designing and Layout",
  //   description: "Use the Panel on the right side to change the data.",
  //   header: <Image src='/bentoInfo/design pdf.png' alt='bentoinfo'  width={30} height={30}/>,
  //   icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
  // },
  // {
  //   title: "Share the form or use sheet",
  //   description: "using the sheet is the same as free mode, sharing the form can be used by user being shared to make template without making one.",
  //   header: <Image src='/bentoInfo/form.png' alt='bentoinfo'  width={30} height={30}/>,
  //   icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
  // },
];
