"use client"

import { useState } from "react"
import Link from "next/link"
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
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-32 overflow-hidden px-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto relative">
          <div className="max-w-3xl mx-auto text-center mb-8 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-8 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent leading-tight">
              Discover How Small Creators Go Viral
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 lg:mb-8 px-4">
              Get access to 1,000+ viral videos from creators who started with
              zero followers. Learn the exact strategies that work for
              beginners.
            </p>
            <Link href="/checkout">
              <Button
                size="lg"
                className="w-full sm:w-auto font-semibold text-base sm:text-lg px-4 sm:px-8"
              >
                Get Lifetime Access for $29
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 lg:mb-20 px-4">
            <Card className="bg-background/50 backdrop-blur">
              <CardContent className="p-4 sm:p-6">
                <Search className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-primary" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Curated Content
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Hand-picked viral videos exclusively from small creators
                  across all platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur">
              <CardContent className="p-4 sm:p-6">
                <Filter className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-primary" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Smart Filtering
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Filter by platform, duration, category, and more to find
                  relevant examples.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-primary" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Proven Strategies
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Learn from real examples of first-time viral successes.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Social Proof */}
          <div className="text-center mb-12 lg:mb-20 px-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              Trusted by Content Creators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
                <span className="text-3xl sm:text-4xl font-bold mb-1">
                  1000+
                </span>
                <span className="text-sm sm:text-base text-muted-foreground">
                  Viral Videos
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
                <span className="text-3xl sm:text-4xl font-bold mb-1">50+</span>
                <span className="text-sm sm:text-base text-muted-foreground">
                  New Examples Daily
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
                <span className="text-3xl sm:text-4xl font-bold mb-1">All</span>
                <span className="text-sm sm:text-base text-muted-foreground">
                  Major Platforms
                </span>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              How The Viral Library Works
            </h2>
            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    Find Relevant Examples
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Filter through our library of viral videos by platform,
                    category, and more to find examples that match your niche.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    Study Successful Patterns
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Analyze how small creators achieved viral success and
                    identify patterns you can apply to your content.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    Create With Confidence
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Use proven strategies from successful small creators instead
                    of copying big influencers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12 sm:py-20">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8">
            Ready to Create Your First Viral Video?
          </h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 opacity-90">
            Join The Viral Library today and get lifetime access to our growing
            collection of viral content examples.
          </p>
          <Link href="/checkout">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto font-semibold text-base sm:text-lg px-4 sm:px-8"
            >
              Get Started for $29
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

// // app/page.tsx
// import Link from "next/link"
// import {
//   ArrowRight,
//   Zap,
//   Target,
//   TrendingUp,
//   CheckCircle2,
//   MessagesSquare,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card"
// import { Badge } from "@/components/ui/badge"

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
//       {/* Hero Section */}
//       <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
//         <div className="text-center">
//           <Badge variant="secondary" className="mb-4">
//             Limited Time Offer
//           </Badge>
//           <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
//             Your Path to Viral Marketing Success
//           </h1>
//           <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
//             Unlock proven strategies, step-by-step guides, and expert insights
//             to create viral content that drives real engagement and growth.
//           </p>
//           <div className="mt-10 flex justify-center gap-4">
//             <Link href="/checkout">
//               <Button size="lg" className="gap-2">
//                 Get Started Now <ArrowRight className="h-4 w-4" />
//               </Button>
//             </Link>
//             <HoverCard>
//               <HoverCardTrigger asChild>
//                 <Button size="lg" variant="outline">
//                   Learn More
//                 </Button>
//               </HoverCardTrigger>
//               <HoverCardContent className="w-80">
//                 <div className="space-y-2">
//                   <h4 className="text-sm font-semibold">What's included?</h4>
//                   <p className="text-sm">
//                     • Complete viral marketing playbook • Step-by-step
//                     implementation guides • Expert case studies and analysis •
//                     Lifetime access to updates
//                   </p>
//                 </div>
//               </HoverCardContent>
//             </HoverCard>
//           </div>
//         </div>
//       </section>

//       {/* Features Tabs Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Tabs defaultValue="features" className="w-full">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="features">Key Features</TabsTrigger>
//               <TabsTrigger value="benefits">Benefits</TabsTrigger>
//               <TabsTrigger value="results">Results</TabsTrigger>
//             </TabsList>
//             <TabsContent value="features">
//               <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-8">
//                 <Card className="border-2">
//                   <CardHeader>
//                     <Zap className="h-10 w-10 text-blue-500 mb-2" />
//                     <CardTitle>Instant Access</CardTitle>
//                     <CardDescription>
//                       Get immediate access to our complete library
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <ul className="space-y-2 text-sm text-gray-600">
//                       <li className="flex items-center gap-2">
//                         <CheckCircle2 className="h-4 w-4 text-green-500" />
//                         Complete strategy guides
//                       </li>
//                       <li className="flex items-center gap-2">
//                         <CheckCircle2 className="h-4 w-4 text-green-500" />
//                         Content templates
//                       </li>
//                       <li className="flex items-center gap-2">
//                         <CheckCircle2 className="h-4 w-4 text-green-500" />
//                         Case studies
//                       </li>
//                     </ul>
//                   </CardContent>
//                 </Card>

//                 <Card className="border-2">
//                   <CardHeader>
//                     <Target className="h-10 w-10 text-green-500 mb-2" />
//                     <CardTitle>Proven Results</CardTitle>
//                     <CardDescription>
//                       Strategies that have generated millions of views
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <ul className="space-y-2 text-sm text-gray-600">
//                       <li className="flex items-center gap-2">
//                         <CheckCircle2 className="h-4 w-4 text-green-500" />
//                         Real campaign examples
//                       </li>
//                       <li className="flex items-center gap-2">
//                         <CheckCircle2 className="h-4 w-4 text-green-500" />
//                         Success metrics
//                       </li>
//                       <li className="flex items-center gap-2">
//                         <CheckCircle2 className="h-4 w-4 text-green-500" />
//                         Implementation guides
//                       </li>
//                     </ul>
//                   </CardContent>
//                 </Card>

//                 <Card className="border-2">
//                   <CardHeader>
//                     <TrendingUp className="h-10 w-10 text-purple-500 mb-2" />
//                     <CardTitle>Growth Framework</CardTitle>
//                     <CardDescription>
//                       Systematic approach to content creation
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <ul className="space-y-2 text-sm text-gray-600">
//                       <li className="flex items-center gap-2">
//                         <CheckCircle2 className="h-4 w-4 text-green-500" />
//                         Step-by-step process
//                       </li>
//                       <li className="flex items-center gap-2">
//                         <CheckCircle2 className="h-4 w-4 text-green-500" />
//                         Growth metrics
//                       </li>
//                       <li className="flex items-center gap-2">
//                         <CheckCircle2 className="h-4 w-4 text-green-500" />
//                         Analytics guide
//                       </li>
//                     </ul>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>
//             <TabsContent value="benefits">
//               <Card className="mt-8">
//                 <CardHeader>
//                   <CardTitle>Transform Your Marketing Strategy</CardTitle>
//                   <CardDescription>
//                     See how our comprehensive guide can impact your business
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="grid gap-4">
//                   <div className="flex items-center gap-4">
//                     <MessagesSquare className="h-8 w-8 text-blue-500" />
//                     <div>
//                       <h3 className="font-semibold">Increased Engagement</h3>
//                       <p className="text-sm text-gray-600">
//                         Learn techniques to boost your content's viral potential
//                       </p>
//                     </div>
//                   </div>
//                   {/* Add more benefits here */}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//             <TabsContent value="results">
//               <Card className="mt-8">
//                 <CardHeader>
//                   <CardTitle>Success Stories</CardTitle>
//                   <CardDescription>
//                     Real results from our customers
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {/* Add success stories or metrics here */}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </section>

//       {/* FAQ Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold text-center mb-8">
//             Frequently Asked Questions
//           </h2>
//           <Accordion type="single" collapsible className="w-full">
//             <AccordionItem value="item-1">
//               <AccordionTrigger>
//                 What's included in the package?
//               </AccordionTrigger>
//               <AccordionContent>
//                 You'll get instant access to our complete viral marketing
//                 playbook, including strategy guides, templates, case studies,
//                 and lifetime updates.
//               </AccordionContent>
//             </AccordionItem>
//             <AccordionItem value="item-2">
//               <AccordionTrigger>How long do I have access?</AccordionTrigger>
//               <AccordionContent>
//                 Your purchase includes lifetime access to all current content
//                 and future updates to the viral marketing library.
//               </AccordionContent>
//             </AccordionItem>
//             <AccordionItem value="item-3">
//               <AccordionTrigger>
//                 Is there a money-back guarantee?
//               </AccordionTrigger>
//               <AccordionContent>
//                 Yes! We offer a 30-day satisfaction guarantee. If you're not
//                 completely satisfied, we'll refund your purchase.
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         </div>
//       </section>

//       {/* Final CTA Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl font-bold mb-6">
//             Ready to Start Your Viral Journey?
//           </h2>
//           <p className="text-xl text-gray-600 mb-8">
//             Join thousands of marketers who have transformed their content
//             strategy
//           </p>
//           <Link href="/checkout">
//             <Button size="lg" className="gap-2">
//               Get Started Today - $29.00 <ArrowRight className="h-4 w-4" />
//             </Button>
//           </Link>
//         </div>
//       </section>
//     </div>
//   )
// }
