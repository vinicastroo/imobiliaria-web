'use client'

/**
 * Peças de animação da Scala. Durações e curva vêm do guia (design/tokens.css):
 * quick 120ms · fast 200ms · medium 320ms · cubic-bezier(.2, 0, 0, 1).
 * Tudo passa por <MotionProvider> com reducedMotion="user": quem desativa
 * animações no sistema vê o conteúdo parado, sem perder nada.
 */
import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from 'motion/react'

export const EASE = [0.2, 0, 0, 1] as const
export const DURATION = { quick: 0.12, fast: 0.2, medium: 0.32, slow: 0.5 } as const

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: DURATION.medium, ease: EASE }}>
      {children}
    </MotionConfig>
  )
}

type RevealProps = HTMLMotionProps<'div'> & {
  /** Atraso em segundos (para escalonar irmãos). */
  delay?: number
  /** Distância da subida em px. */
  y?: number
}

/** Fade + leve subida quando entra na tela (uma vez só). */
export function Reveal({ delay = 0, y = 16, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: DURATION.slow, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Contêiner que escalona a entrada dos filhos <StaggerItem>. */
export function Stagger({
  children,
  gap = 0.06,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  gap?: number
  className?: string
  as?: 'div' | 'ul' | 'ol'
}) {
  const Comp = as === 'ul' ? motion.ul : as === 'ol' ? motion.ol : motion.div
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </Comp>
  )
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'li'
}) {
  const Comp = as === 'li' ? motion.li : motion.div
  return (
    <Comp
      className={className}
      variants={{
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE } },
      }}
    >
      {children}
    </Comp>
  )
}

/** Flutuação lenta e contínua (cards em volta da prévia do produto). */
export function Float({
  children,
  className,
  distance = 8,
  duration = 5,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  distance?: number
  duration?: number
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { y: [0, -distance, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}

/** Número que conta até o valor quando aparece na tela. */
const formatInt = (n: number) => Math.round(n).toLocaleString('pt-BR')

export function CountUp({
  value,
  format = formatInt,
  duration = 1.2,
  className,
}: {
  value: number
  format?: (n: number) => string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(() => format(reduce ? value : 0))
  const formatRef = useRef(format)
  useEffect(() => {
    formatRef.current = format
  }, [format])

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (n) => setDisplay(formatRef.current(n)),
    })
    return () => controls.stop()
  }, [inView, reduce, value, duration])

  return (
    <span ref={ref} className={className}>
      {reduce ? format(value) : display}
    </span>
  )
}

/** Texto que "digita sozinho", alternando entre frases. */
export function Typewriter({
  phrases,
  className,
  typeMs = 55,
  holdMs = 1800,
}: {
  phrases: string[]
  className?: string
  typeMs?: number
  holdMs?: number
}) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')

  useEffect(() => {
    if (reduce) return
    const phrase = phrases[index % phrases.length] ?? ''
    let i = 0
    let timer: ReturnType<typeof setTimeout>
    const type = () => {
      i += 1
      setText(phrase.slice(0, i))
      if (i < phrase.length) timer = setTimeout(type, typeMs)
      else timer = setTimeout(() => setIndex((v) => v + 1), holdMs)
    }
    timer = setTimeout(type, typeMs)
    return () => clearTimeout(timer)
  }, [index, phrases, reduce, typeMs, holdMs])

  return (
    <span className={className}>
      {reduce ? (phrases[0] ?? '') : text}
      {!reduce && (
        <span aria-hidden="true" className="ml-px inline-block w-px animate-pulse bg-current">
          &nbsp;
        </span>
      )}
    </span>
  )
}
