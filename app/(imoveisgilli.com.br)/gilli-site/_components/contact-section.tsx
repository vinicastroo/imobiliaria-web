'use client'

import { ContactForm } from '@/components/contact-section'

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative flex min-h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#fafafa] to-[#fafafa] p-4"
    >
      {/* <div className="absolute bottom-0 w-full flex justify-center opacity-80 pointer-events-none">
        <Image src="/city-background.svg" alt="Cidade" className="w-auto h-[300px] md:h-[450px]" width={300} height={300} />
      </div> */}

      <ContactForm />
    </section>
  )
}
