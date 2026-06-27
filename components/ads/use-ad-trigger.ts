"use client"

import { useEffect, useRef, useState } from "react"
import { recordImpression } from "@/app/actions/ads"

export type OverlayAd = {
  id: number
  placement: string
  imageUrl: string
  linkUrl: string | null
  altText: string | null
  title: string | null
  bodyText: string | null
  buttonText: string | null
  trigger: string
  frequency: string
  showSponsoredLabel: boolean
}

const keyFor = (id: number) => `awaj_ad_${id}`
const today = () => new Date().toISOString().slice(0, 10)

function alreadyDismissed(frequency: string, id: number): boolean {
  if (typeof window === "undefined") return true
  try {
    if (frequency === "always") return false
    if (frequency === "day") return window.localStorage.getItem(keyFor(id)) === today()
    // default: once per session
    return window.sessionStorage.getItem(keyFor(id)) === "1"
  } catch {
    return false
  }
}

function persistDismissal(frequency: string, id: number) {
  try {
    if (frequency === "day") window.localStorage.setItem(keyFor(id), today())
    else if (frequency !== "always") window.sessionStorage.setItem(keyFor(id), "1")
  } catch {
    /* storage unavailable — ignore */
  }
}

/**
 * Drives visibility for an overlay ad based on its trigger
 * (immediate / delay / scroll / exit) and frequency (session / day / always).
 * Records a single impression the first time the unit becomes visible.
 */
export function useAdTrigger(ad: OverlayAd) {
  const [visible, setVisible] = useState(false)
  const impressionFired = useRef(false)

  useEffect(() => {
    if (alreadyDismissed(ad.frequency, ad.id)) return

    const isTouch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
    let timer: ReturnType<typeof setTimeout> | undefined
    const cleanups: Array<() => void> = []

    const show = () => setVisible(true)

    const trigger = ad.trigger
    if (trigger === "immediate") {
      show()
    } else if (trigger === "scroll") {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        if (window.scrollY > Math.min(600, max * 0.4)) show()
      }
      window.addEventListener("scroll", onScroll, { passive: true })
      cleanups.push(() => window.removeEventListener("scroll", onScroll))
    } else if (trigger === "exit" && !isTouch) {
      const onLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) show()
      }
      document.addEventListener("mouseout", onLeave)
      cleanups.push(() => document.removeEventListener("mouseout", onLeave))
      // Safety fallback so exit-intent still appears on long sessions.
      timer = setTimeout(show, 20000)
    } else {
      // "delay" (and touch fallback for exit): show after 5s
      timer = setTimeout(show, 5000)
    }

    return () => {
      if (timer) clearTimeout(timer)
      cleanups.forEach((fn) => fn())
    }
  }, [ad.id, ad.trigger, ad.frequency])

  useEffect(() => {
    if (visible && !impressionFired.current) {
      impressionFired.current = true
      void recordImpression(ad.id)
    }
  }, [visible, ad.id])

  const dismiss = () => {
    persistDismissal(ad.frequency, ad.id)
    setVisible(false)
  }

  return { visible, dismiss }
}
