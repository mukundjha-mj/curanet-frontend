import { useEffect, useRef, type ReactNode } from "react"
import gsap from "gsap"
import { ReactLenis, type LenisRef } from "lenis/react"

interface SmoothScrollingProps {
  children: ReactNode
}

export function SmoothScrolling({ children }: SmoothScrollingProps) {
  const lenisRef = useRef<LenisRef | null>(null)

  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        duration: 1.5,
        easing: (time) => Math.min(1, 1.001 - 2 ** (-10 * time)),
        touchMultiplier: 2,
        infinite: false,
        anchors: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
