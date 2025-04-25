import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Realistic Video Interviews",
      description:
        "Practice with AI agents via video calls that mimic real interviews.",
      icon: "🎥",
    },
    {
      title: "Tailored Questions",
      description:
        "Create and take interviews customized by tech stack and role.",
      icon: "🎯",
    },
    {
      title: "AI-Driven Feedback",
      description:
        "Get instant, detailed feedback to improve your performance.",
      icon: "🤖",
    },
  ];

  const stats = [
    { value: "10K+", label: "Users Practicing" },
    { value: "50K+", label: "Interviews Completed" },
    { value: "95%", label: "User Satisfaction" },
  ];

  const testimonials = [
    {
      name: "Ayesha Khan",
      role: "Software Engineer at Google",
      quote:
        "This platform gave me the confidence to face real interviews. The feedback was incredibly accurate and helpful.",
      avatar: "https://via.placeholder.com/80x80.png?text=AK",
    },
    {
      name: "Ali Raza",
      role: "Frontend Developer",
      quote:
        "I practiced daily before my interviews and finally landed a job! Highly recommend for anyone looking to improve.",
      avatar: "https://via.placeholder.com/80x80.png?text=AR",
    },
    {
      name: "Sara Malik",
      role: "Tech Recruiter",
      quote:
        "This is a game-changer. It helps candidates be better prepared and more confident in interviews.",
      avatar: "https://via.placeholder.com/80x80.png?text=SM",
    },
  ];

  const faqs = [
    {
      q: "Is the platform free to use?",
      a: "You can start for free! We also offer premium plans for advanced features.",
    },
    {
      q: "Do you support technical interviews?",
      a: "Yes! Our AI can simulate technical interviews with role-specific questions.",
    },
    {
      q: "Can I review my previous interview sessions?",
      a: "Absolutely. You can view and analyze all your past interviews and feedback.",
    },
  ];

  return (
    <div className="w-full bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="w-full py-24 px-6 bg-background border-b">
        <div className="max-w-6xl mx-auto flex flex-col gap-10 items-center text-center">
          <h1 className="text-5xl font-bold tracking-tight leading-tight">
            Master Interviews with{" "}
            <span className="text-primary">AI Precision</span>
          </h1>
          <p className="text-lg  max-w-2xl">
            Practice lifelike video interviews powered by AI. Receive detailed
            feedback on your technical, communication, and problem-solving
            skills.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button
              as={Link}
              className="font-semibold"
              color="primary"
              href="/auth/signup"
              radius="lg"
              size="md"
              variant="solid"
            >
              Start Practicing
            </Button>
            <Button
              as={Link}
              href="/demo"
              radius="lg"
              size="md"
              variant="bordered"
            >
              Watch Demo
            </Button>
          </div>
          <Image
            alt="AI Interview Demo"
            className="rounded-2xl shadow-lg border object-cover"
            height={400}
            src="/video-job-interview.png"
            width={720}
          />
        </div>
      </section>

      {/* Stats */}
      <section className="w-full py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <h3 className="text-4xl font-bold text-primary">{stat.value}</h3>
              <p className=" text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-24 px-6 bg-content1 border-y">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Why Choose Our AI Platform?
          </h2>
          <p className=" max-w-xl mx-auto mb-12 text-base">
            Experience the most realistic interview practice with cutting-edge
            AI.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border shadow-sm bg-background text-left transition hover:shadow-md"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">What People Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white border rounded-2xl p-6 text-left shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    alt={t.name}
                    className="rounded-full border"
                    height={50}
                    src={t.avatar}
                    width={50}
                  />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm ">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-24 px-6 bg-content1 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 text-left">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-4">
                <h4 className="text-lg font-medium mb-2">{faq.q}</h4>
                <p className="text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-24 px-6 text-center bg-background">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to ace your next interview?
          </h2>
          <p className="mb-6">
            Start practicing today and build your confidence with AI-powered
            simulations.
          </p>
          <Button
            as={Link}
            className="font-semibold"
            color="primary"
            href="/auth/signup"
            radius="lg"
            size="md"
            variant="solid"
          >
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}
