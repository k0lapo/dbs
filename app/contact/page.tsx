"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", subject: "general", message: "" })

      setTimeout(() => setSubmitStatus("idle"), 3000)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "dbsbysowetong09@gmail.com",
      description: "We typically respond within 24 hours.",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+234 816 822 4485",
      description: "Mon – Fri · 9 AM – 6 PM (WAT).",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Lagos, Nigeria",
      description: "Available online and via private appointments.",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* HERO – calm, minimal, luxurious */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        <img
          src="/modern-contact-us-minimalist-office.jpg"
          alt="Contact DripBySoweto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: "center center",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/40" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-[0.7rem] tracking-[0.35em] uppercase text-white/50">
            Contact · DripBySoweto
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
            Let&apos;s Talk
            <span className="block text-white/80 text-lg md:text-xl font-normal mt-3">
              Orders, partnerships, styling questions — we&apos;re one message away.
            </span>
          </h1>
        </div>
      </section>

      {/* CONTACT PANEL – glassy, premium layout */}
      <section className="bg-linear-to-b from-background via-background to-muted/40 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border/70 bg-black/5 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.35)] p-6 md:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-start">
              {/* FORM SIDE */}
              <div>
                <div className="space-y-3 mb-8">
                  <p className="text-[0.7rem] tracking-[0.35em] uppercase text-accent">
                    Send a message
                  </p>
                  <h2 className="text-3xl md:text-4xl font-light text-foreground">
                    Tell us what you need.
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground max-w-md">
                    Share your idea, order details, or collaboration request. Our team will
                    reply with a thoughtful response, not a template.
                  </p>
                </div>

                {submitStatus === "success" && (
                  <div className="mb-6 rounded-2xl border border-secondary/40 bg-secondary/10 px-4 py-3 flex gap-3 items-start">
                    <span className="text-secondary font-bold text-xl leading-none mt-0.5">✓</span>
                    <p className="text-secondary text-sm md:text-[0.95rem]">
                      Message received. Our team will get back to you shortly.
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 flex gap-3 items-start">
                    <span className="text-red-500 font-bold text-xl leading-none mt-0.5">!</span>
                    <p className="text-red-500 text-sm md:text-[0.95rem]">
                      Something went wrong. Please try again in a few minutes.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-semibold tracking-wide text-foreground/80">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-semibold tracking-wide text-foreground/80">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs font-semibold tracking-wide text-foreground/80">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+234…"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-xs font-semibold tracking-wide text-foreground/80">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all cursor-pointer"
                      >
                        <option value="general">General inquiry</option>
                        <option value="support">Order / Support</option>
                        <option value="partnership">Partnership / Collaboration</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Something else</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-semibold tracking-wide text-foreground/80">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell us what you have in mind…"
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background/80 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/70 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm tracking-wide disabled:opacity-60 flex items-center justify-center gap-2 rounded-xl"
                  >
                    {isSubmitting ? (
                      "Sending…"
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-[0.7rem] text-muted-foreground text-center">
                    Your details stay with us. No newsletters. No spam. Just a reply to your message.
                  </p>
                </form>
              </div>

              {/* INFO SIDE – looks like a sleek brand profile */}
              <div className="space-y-10">
                <div className="space-y-3">
                  <p className="text-[0.7rem] tracking-[0.35em] uppercase text-muted-foreground">
                    Contact channels
                  </p>
                  <h3 className="text-xl md:text-2xl font-light text-foreground">
                    Prefer talking to a human?
                  </h3>
                  <p className="text-sm md:text-[0.95rem] text-muted-foreground leading-relaxed">
                    Whether it&apos;s a bulk order, styling for a shoot, or a private fitting session,
                    our team is available to help you plan the perfect experience.
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((info) => {
                    const Icon = info.icon
                    return (
                      <div
                        key={info.title}
                        className="flex items-start gap-4 rounded-2xl border border-border/70 bg-background/60 px-4 py-4"
                      >
                        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {info.title}
                          </p>
                          <p className="text-sm font-semibold text-foreground">{info.value}</p>
                          <p className="text-xs text-muted-foreground">{info.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-4 space-y-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-primary">
                    For stylists & creators
                  </p>
                  <p className="text-sm text-foreground">
                    Working on a campaign, video shoot, or tour wardrobe? Mention it in your message
                    and our team will prioritise your request.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ – simple, clean, premium cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center space-y-3 mb-12 md:mb-16">
          <p className="text-[0.7rem] tracking-[0.35em] uppercase text-accent">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground">
            A few things you might want to know.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: "What’s your return policy?",
              a: "We offer a 30-day return window on eligible items. Pieces must be unworn, unwashed, and returned in their original packaging.",
            },
            {
              q: "How fast is delivery?",
              a: "Within Nigeria, delivery is usually 1–3 working days after dispatch. International orders vary by destination at checkout.",
            },
            {
              q: "Do you ship internationally?",
              a: "Yes. We currently ship to over 15 countries. Duties and taxes depend on your local regulations.",
            },
            {
              q: "Can I track my order?",
              a: "Absolutely. Once your order ships, you’ll receive a tracking link via email to follow it in real time.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept major cards, bank transfers, and local payment gateways where available.",
            },
            {
              q: "How do I reach customer support?",
              a: "You can email dbsbysowetong09@gmail.com or use the form above. We aim to respond within 24 hours on business days.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/70 bg-background/60 p-5 md:p-6 hover:border-primary/60 transition-colors"
            >
              <h3 className="font-semibold text-sm md:text-base text-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
