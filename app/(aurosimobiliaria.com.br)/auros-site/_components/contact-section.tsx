'use client'

import Image from 'next/image'
import { ContactForm } from '@/components/contact-section'

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative flex min-h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#fafafa] to-[#D0DEF8] p-4"
    >
      <div className="pointer-events-none absolute bottom-0 flex w-full justify-center opacity-80">
        <Image
          src="/city-background.svg"
          alt="Cidade"
          className="h-[300px] w-auto md:h-[450px]"
          width={300}
          height={300}
        />
      </div>

      <ContactForm />
    </section>
  )
}
