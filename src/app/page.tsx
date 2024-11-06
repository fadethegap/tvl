"use client"

import { useState, useEffect, useRef } from "react"

import Link from "next/link"
import { motion, useScroll, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  TrendingUp,
  Search,
  Filter,
  Users,
  BarChart2,
  PlayCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

interface CountingNumberProps {
  target: number
  duration?: number
}

function CountingNumber({ target, duration = 2000 }: CountingNumberProps) {
  const [count, setCount] = useState(0)
  const elementRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(elementRef, {
    once: true,
    amount: 0.5,
  })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < duration) {
        setCount(Math.min(Math.floor((progress / duration) * target), target))
        animationFrame = requestAnimationFrame(updateCount)
      } else {
        setCount(target)
      }
    }

    animationFrame = requestAnimationFrame(updateCount)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [target, duration, isInView])

  return <motion.span ref={elementRef}>{count.toLocaleString()}</motion.span>
}

export default function Home() {
  const { scrollYProgress } = useScroll()
  const [isHovered, setIsHovered] = useState<number | null>(null)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Section */}
      <section className="relative py-12 lg:py-32 overflow-hidden px-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto relative">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-8 lg:mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-8 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Discover How Small Creators Go Viral
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-muted-foreground mb-6 lg:mb-8 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Get access to 1,000+ viral videos from creators who started with
              zero followers. Learn the exact strategies that work for
              beginners.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/checkout">
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-semibold text-base sm:text-lg px-4 sm:px-8 group"
                >
                  <span>Get Lifetime Access for $29</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 lg:mb-20 px-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Search,
                title: "Curated Content",
                description:
                  "Hand-picked viral videos exclusively from small creators across all platforms.",
              },
              {
                icon: Filter,
                title: "Smart Filtering",
                description:
                  "Filter by platform, duration, category, and more to find relevant examples.",
              },
              {
                icon: TrendingUp,
                title: "Proven Strategies",
                description:
                  "Learn from real examples of first-time viral successes.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ scale: 1.02, translateY: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-background/50 backdrop-blur border-2 transition-colors duration-300 hover:border-primary">
                  <CardContent className="p-4 sm:p-6">
                    <feature.icon className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-primary" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="text-center mb-12 lg:mb-20 px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              Trusted by Content Creators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                { number: 1000, label: "Viral Videos" },
                { number: 50, label: "New Examples Daily" },
                { number: 4, label: "Major Platforms" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center p-4 bg-background/50 rounded-lg hover:bg-background/80 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-3xl sm:text-4xl font-bold mb-1">
                    <CountingNumber target={stat.number} />
                    {stat.number === 1000 && "+"}
                  </span>
                  <span className="text-sm sm:text-base text-muted-foreground">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            className="max-w-4xl mx-auto px-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              How The Viral Library Works
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {[
                {
                  title: "Find Relevant Examples",
                  description:
                    "Filter through our library of viral videos by platform, category, and more to find examples that match your niche.",
                },
                {
                  title: "Study Successful Patterns",
                  description:
                    "Analyze how small creators achieved viral success and identify patterns you can apply to your content.",
                },
                {
                  title: "Create With Confidence",
                  description:
                    "Use proven strategies from successful small creators instead of copying big influencers.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
                  variants={fadeIn}
                  whileHover={{ x: 10 }}
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 transition-transform group-hover:scale-110" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="bg-primary text-primary-foreground py-12 sm:py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container px-4 mx-auto text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8">
              Ready to Create Your First Viral Video?
            </h2>
            <p className="text-base sm:text-xl mb-6 sm:mb-8 opacity-90">
              Join The Viral Library today and get lifetime access to our
              growing collection of viral content examples.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/checkout">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto font-semibold text-base sm:text-lg px-4 sm:px-8 group"
                >
                  <span>Get Started for $29</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
