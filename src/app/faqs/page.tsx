"use client";
import { Accordion, AccordionItem } from "@nextui-org/react";

const faqList = [
  {
    titles: "What is Frontend Mentor, and how will it help me?",
    details:
      "Frontend Mentor offers realistic coding challenges to help developers improve their frontend coding skills with projects in HTML, CSS, and JavaScript. It's suitable for all levels and ideal for portfolio building.",
  },
  {
    titles: "Is Frontend Mentor free?",
    details:
      "Yes, Frontend Mentor offers both free and premium coding challenges, with the free option providing access to a range of projects suitable for all skill levels.",
  },
  {
    titles: "Can I use Frontend Mentor projects in my portfolio?",
    details:
      "Yes, you can use projects completed on Frontend Mentor in your portfolio. It's an excellent way to showcase your skills to potential employers!",
  },
  {
    titles: "How can I get help if I'm stuck on a Frontend Mentor challenge?",
    details:
      "The best place to get help is inside Frontend Mentor's Discord community. There's a help channel where you can ask questions and seek support from other community members.",
  },
];

export default function FAQs() {
  return (
    <main className="flex flex-col items-center justify-center p-4 pt-6 mx-auto max-w-screen-lg 2xl:max-w-screen-2xl">
      <div id="info-bot" className="text-center text-black tracking-wide">
        <h1 className="text-3xl sm:text-5xl font-bold pb-2">FAQs</h1>
        <p className="text-sm sm:text-xl">Coba cek masalah anda di FAQ kami</p>
      </div>

      <Accordion variant="shadow" className="mt-6 text-sm">
        {faqList.map((faq, index) => (
          <AccordionItem key={index} aria-label={faq.titles} title={faq.titles}>
            <p>{faq.details}</p>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
