import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Layout,
  Calendar,
  BarChart,
  ArrowRight,
} from "lucide-react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CompanyCarousel from "@/components/company-carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Jexo?",
    answer:
      "Jexo is a modern project management platform that helps teams plan, organize, and deliver projects efficiently. From task tracking to team collaboration, Jexo keeps everything in one place.",
  },
  {
    question: "Who can use Jexo?",
    answer:
      "Jexo is designed for startups, agencies, developers, product teams, freelancers, and businesses of all sizes looking for a better way to manage projects and workflows.",
  },
  {
    question: "Can I manage multiple projects?",
    answer:
      "Yes. Jexo allows you to create and manage multiple projects simultaneously, track progress, assign tasks, and monitor deadlines from a single dashboard.",
  },
  {
    question: "Does Jexo support team collaboration?",
    answer:
      "Absolutely. Team members can collaborate on tasks, share updates, track project progress, and stay aligned throughout the project lifecycle.",
  },
  {
    question: "Is Jexo beginner-friendly?",
    answer:
      "Yes. Jexo is built with simplicity in mind, making it easy for individuals and teams to get started without a steep learning curve.",
  },
  {
    question: "Is Jexo free to use?",
    answer:
      "Jexo offers a free plan to help individuals and small teams get started, with premium features available as your team grows.",
  },
];

const features = [
  {
    title: "Smart Project Management",
    description:
      "Create, organize, and manage projects with a clean and intuitive workspace designed for productivity.",
    icon: Layout,
  },
  {
    title: "Task & Deadline Tracking",
    description:
      "Assign tasks, set priorities, and stay on top of deadlines with real-time progress tracking.",
    icon: Calendar,
  },
  {
    title: "Analytics & Insights",
    description:
      "Monitor team performance, project progress, and productivity through powerful reports and insights.",
    icon: BarChart,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto py-25 text-center min-h-[550px]">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-1 flex flex-col">
          Streamline Your Workflow <br />
          <span className="flex mx-auto gap-3 sm:gap-4 items-center">
            with
            <Image
              src={"/jexo-logo.png"}
              alt="Jexo Logo"
              width={400}
              height={80}
              className="h-14 sm:h-24 w-auto object-contain"
            />
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Empower your team with our intuitive project management solution.
        </p>
        <p className="text-xl mb-12 max-w-2xl mx-auto"></p>
        <Link href="/onboarding">
          <Button size="lg" className="mr-4 h-9 px-3 text-base cursor-pointer">
            Get Started <ChevronRight size={18} className="ml-1" />
          </Button>
        </Link>
        <Link href="#features">
          <Button
            size="lg"
            variant="outline"
            className="mr-4 h-9 px-3 text-base cursor-pointer"
          >
            Learn More
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-900 py-10 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Powerful Features
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 mb-4 text-blue-300" />
                  <h4 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Carousel */}
      <section className="py-20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Built for Modern Teams
          </h3>
          <CompanyCarousel />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-900 py-20 px-5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-3xl font-bold mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about Jexo and how it helps teams
              manage projects more efficiently.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-3">
            Ready to Transform Your Workflow?
          </h3>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Join teams using Jexo to organize work, collaborate efficiently, and
            deliver projects on time.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="animate-bounce">
              Start For Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
