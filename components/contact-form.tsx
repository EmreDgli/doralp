"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Mesajınız gönderildi!",
      description: "En kısa sürede size dönüş yapacağız.",
    })

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-doralp-navy mb-2">
            Ad *
          </label>
          <Input id="firstName" required className="border-gray-300" />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-doralp-navy mb-2">
            Soyad *
          </label>
          <Input id="lastName" required className="border-gray-300" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-doralp-navy mb-2">
          E-posta *
        </label>
        <Input id="email" type="email" required className="border-gray-300" />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-doralp-navy mb-2">
          Konu *
        </label>
        <Input id="subject" required className="border-gray-300" />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-doralp-navy mb-2">
          Mesaj *
        </label>
        <Textarea id="message" rows={5} required className="border-gray-300" />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="kvkk" required />
        <label htmlFor="kvkk" className="text-sm text-doralp-gray">
          KVKK kapsamında kişisel verilerimin işlenmesini kabul ediyorum. *
        </label>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-doralp-gold hover:bg-doralp-gold/90">
        {isSubmitting ? "Gönderiliyor..." : "Mesaj Gönder"}
      </Button>
    </form>
  )
}
