"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CookieIcon, ChartPieIcon, KeyIcon, XIcon } from 'lucide-react'

export default function FunCookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [userTokenEnabled, setUserTokenEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleAccept = () => {
    console.log('Cookies accepted:', { analyticsEnabled, userTokenEnabled })
    setIsVisible(false)
  }

  const handleDecline = () => {
    setAnalyticsEnabled(false)
    setUserTokenEnabled(false)
    console.log('Cookies declined')
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg md:max-w-2xl md:mx-auto z-50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CookieIcon className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Cookie Monster Alert! 🍪</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
          <p className="mb-4">
            Nom nom nom! We love cookies, and we bet you do too! But before we start munching, we wanted to let you know that we use some digital cookies to make your experience extra sweet.
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ChartPieIcon className="h-5 w-5" />
                <span>Analytics (for counting cookie crumbs)</span>
              </div>
              <Switch
                checked={analyticsEnabled}
                onCheckedChange={setAnalyticsEnabled}
                aria-label="Enable analytics cookies"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <KeyIcon className="h-5 w-5" />
                <span>User Tokens, needed for the site to function (your secret cookie recipe)</span>
              </div>
              <Switch
                checked={userTokenEnabled}
                onCheckedChange={setUserTokenEnabled}
                aria-label="Enable user token cookies"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleDecline}>
              Only neccesary cookies 😢
            </Button>
            <Button onClick={handleAccept}>
              Let&apos;s get baking! 🍪
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}