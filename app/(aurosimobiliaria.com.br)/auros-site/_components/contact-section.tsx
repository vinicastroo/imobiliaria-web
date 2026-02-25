"use client"

import Image from 'next/image'
import { ContactForm } from '@/components/contact-section'

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative w-full min-h-[600px] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#fafafa] to-[#D0DEF8] overflow-hidden"
    >
      <div className="absolute bottom-0 w-full flex justify-center opacity-80 pointer-events-none">
        <Image src="/city-background.svg" alt="Cidade" className="w-auto h-[300px] md:h-[450px]" width={300} height={300} />
      </div>

      <ContactForm />
    </section>
  )
}
