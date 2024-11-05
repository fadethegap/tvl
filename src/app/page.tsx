// app/page.tsx
import Link from "next/link"
import {
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  CheckCircle2,
  MessagesSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Limited Time Offer
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your Path to Viral Marketing Success
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
            Unlock proven strategies, step-by-step guides, and expert insights
            to create viral content that drives real engagement and growth.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/checkout">
              <Button size="lg" className="gap-2">
                Get Started Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">What's included?</h4>
                  <p className="text-sm">
                    • Complete viral marketing playbook • Step-by-step
                    implementation guides • Expert case studies and analysis •
                    Lifetime access to updates
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </section>

      {/* Features Tabs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Key Features</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            <TabsContent value="features">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                <Card className="border-2">
                  <CardHeader>
                    <Zap className="h-10 w-10 text-blue-500 mb-2" />
                    <CardTitle>Instant Access</CardTitle>
                    <CardDescription>
                      Get immediate access to our complete library
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Complete strategy guides
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Content templates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Case studies
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <Target className="h-10 w-10 text-green-500 mb-2" />
                    <CardTitle>Proven Results</CardTitle>
                    <CardDescription>
                      Strategies that have generated millions of views
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Real campaign examples
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Success metrics
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Implementation guides
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <TrendingUp className="h-10 w-10 text-purple-500 mb-2" />
                    <CardTitle>Growth Framework</CardTitle>
                    <CardDescription>
                      Systematic approach to content creation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Step-by-step process
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Growth metrics
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Analytics guide
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="benefits">
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Transform Your Marketing Strategy</CardTitle>
                  <CardDescription>
                    See how our comprehensive guide can impact your business
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <MessagesSquare className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">Increased Engagement</h3>
                      <p className="text-sm text-gray-600">
                        Learn techniques to boost your content's viral potential
                      </p>
                    </div>
                  </div>
                  {/* Add more benefits here */}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="results">
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Success Stories</CardTitle>
                  <CardDescription>
                    Real results from our customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add success stories or metrics here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                What's included in the package?
              </AccordionTrigger>
              <AccordionContent>
                You'll get instant access to our complete viral marketing
                playbook, including strategy guides, templates, case studies,
                and lifetime updates.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How long do I have access?</AccordionTrigger>
              <AccordionContent>
                Your purchase includes lifetime access to all current content
                and future updates to the viral marketing library.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Is there a money-back guarantee?
              </AccordionTrigger>
              <AccordionContent>
                Yes! We offer a 30-day satisfaction guarantee. If you're not
                completely satisfied, we'll refund your purchase.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Viral Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of marketers who have transformed their content
            strategy
          </p>
          <Link href="/checkout">
            <Button size="lg" className="gap-2">
              Get Started Today - $29.00 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
