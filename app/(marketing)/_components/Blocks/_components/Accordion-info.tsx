import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

type CardProps = React.ComponentProps<typeof Card>


const HowTo = [
  {
    key: 'item1',
    triggerName: 'How to generate PDFs from CSV?',
    description: 'PDF generation can be achieved by referencing the cells of first row of the data sheet to the edit field name.',
    image: '/howTo/csvToPDf.png',
    alt: 'pdf to csv image'
  },
  {
    key: 'item2',
    triggerName: 'How template sharing works?',
    description: 'Template sharing works by saving the template and sharing the generated public link. Users with the link can only use the template for form and PDF automation.',
    image: '/howTo/share template.png',
    alt: 'template sharing image'
  },
  {
    key: 'item3',
    triggerName: 'Why two-page template does not work?',
    description: 'Two-page templates are not currently supported. However, for urgent needs, you can achieve a similar layout by copying and pasting the desired field from the first page to the second page. If it still does not work, ',
    image: '/howTo/accessPages.png',
    alt: '2 page template image'
  },
  {
    key: 'item4',
    triggerName: 'How about the checkbox field?',
    description: "We understand the need for checkbox fields. While we're working on implementing them, you can potentially achieve similar functionality by using the image in the meantime.",
    image: null,
    alt: null
  },
  
]
const AccordionInfo = ({ className, ...props }: CardProps) => {
    return (
      <Accordion type="single" collapsible className="w-full mx-0 absolute z-[60] px-10">
        {HowTo.map((item) => (
          <AccordionItem value={item.key} key={item.key}>
          <AccordionTrigger>{item.triggerName}</AccordionTrigger>
          <AccordionContent>
            <Card className={cn("w-full", className)} {...props}>
              <CardContent className="grid">
                  <div className="flex flex-col sm:flex-row gap-2 rounded-md border p-4 bg-transparent h-[400px] justify-between">
                      <p className="text-md font-medium leading-none ">
                        {item.description}
                      </p>
                      <div className="w-auto" style={{ position: 'relative' }}>
                        {item.image && (
                          <Image src={item.image} alt={item.alt}  width={366.4} height={366.4} objectFit="cover" />
                          )
                        }
                      </div> 
                  </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        ))}
      </Accordion>
    )
}
 
export default AccordionInfo;