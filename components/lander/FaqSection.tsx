import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export default function FAQSection() {
    const faqs = [
      {
        question: "Miten Fiksaten toimii?",
        answer: "En kerro :D"
      },
      {
        question: "Miten tarjouspyynnön lähettäminen toimii?",
        answer: "En kerro :D"
      },
      {
        question: "Mikä on asiakkaan budjetti?",
        answer: "En kerro :D"
      },
      {
        question: "Työpyyntö peruuntui, kuinka toimin?",
        answer: "En kerro :D"
      },
      {
        question: "Apulainen ei ilmestynyt paikalle, mitä teen?",
        answer: "Mikäli apulainen  ei saapunut paikalle sovittuna aikana ja työpyyntö oli avoimena, otathan yhteyttä Fiksatenin asiakaspalveluun. Tiimimme auttaa selvittämään mikä on mennyt pieleen ja tarvittaessa voimme auttaa etsimään toisen apulaisen haluamallesi työlle."
      },
      {
        question: "Mitä maksutapoja teillä on käytössä?",
        answer: "En kerro :D"
      },
      {
        question: "Miten voin liittyä apulaiseksi?",
        answer: "En kerro :D"
      },
    ]
  
    return (
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-4">
            Usein kysytyt kysymykset
          </h2>
          <p className="text-lg text-gray-500 mb-8 text-center">Vastaamme kaikkiin kysymyksiisi</p>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible >
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-xl font-bold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    )
  }