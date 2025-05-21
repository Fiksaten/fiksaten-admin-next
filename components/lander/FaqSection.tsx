import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Dictionary } from "@/lib/dictionaries"

  export default function FAQSection({dict}: {dict: Dictionary}) {
    const faqs = [
      {
        question: dict.lander.faqSection.faq1.question,
        answer: dict.lander.faqSection.faq1.answer
      },
      {
        question: dict.lander.faqSection.faq2.question,
        answer: dict.lander.faqSection.faq2.answer
      },
      {
        question: dict.lander.faqSection.faq3.question,
        answer: dict.lander.faqSection.faq3.answer
      },
      {
        question: dict.lander.faqSection.faq4.question,
        answer: dict.lander.faqSection.faq4.answer
      },
      {
        question: dict.lander.faqSection.faq5.question,
        answer: dict.lander.faqSection.faq5.answer
      },
      {
        question: dict.lander.faqSection.faq6.question,
        answer: dict.lander.faqSection.faq6.answer
      },
      {
        question: dict.lander.faqSection.faq7.question,
        answer: dict.lander.faqSection.faq7.answer
      },
    ]

    return (
      <section className="w-full py-12 md:py-24 px-4 lg:py-32">
        <div>
          <h2 className="text-4xl text-black font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-4">
            {dict.lander.faqSection.title}
          </h2>
          <p className="text-lg text-gray-500 mb-8 text-center">
            {dict.lander.faqSection.description}
          </p>
          <div className="max-w-[80%] mx-auto">
            {faqs.map((faq, index) => (
            <Accordion key={index} type="single" collapsible className="bg-white">
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-black text-3xl font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-black text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
            </Accordion>
            ))}
          </div>
        </div>
      </section>
    )
  }
