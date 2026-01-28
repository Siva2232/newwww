import React from 'react';
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      {/* Hero Banner Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80"
            alt="Professional photography studio with models and creative team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Hero Content */}
        <Container className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight mb-6">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto mb-10">
            Tailored Support for Your Creative Journey
          </p>
          {/* <Button className="bg-white text-black px-10 py-5 text-xl font-bold hover:bg-gray-100 transition shadow-2xl">
            DISCOVER TALENT
          </Button> */}
        </Container>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left: Contact Form */}
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                LET'S CONNECT.<br />
                YOUR VISION STARTS HERE
              </h2>

              <form className="mt-10 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-white border border-gray-300 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-white border border-gray-300 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full bg-white border border-gray-300 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (Optional)"
                    className="w-full bg-white border border-gray-300 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
                  />
                </div>

                <textarea
                  rows={6}
                  placeholder="Your Message"
                  className="w-full bg-white border border-gray-300 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:outline-none transition resize-none"
                  required
                />

                <Button className="w-full md:w-auto px-12 py-5 text-xl font-bold bg-black text-white hover:bg-gray-800 transition shadow-xl rounded-full">
                  SEND MESSAGE
                </Button>
              </form>
            </div>

            {/* Right: Contact Info + Map */}
            <div className="order-1 lg:order-2 bg-gray-100 rounded-3xl p-10 md:p-12 shadow-xl">
              <h3 className="text-3xl md:text-4xl font-black mb-10">
                CONTACT INFORMATION
              </h3>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-5">
                  <Phone className="w-7 h-7 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-lg">Call Us</p>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <Mail className="w-7 h-7 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-lg">Email</p>
                    <p className="text-gray-700">info@modelstudiocoop.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <MapPin className="w-7 h-7 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-lg">Visit Us</p>
                    <p className="text-gray-700">
                      123 Studio Lane<br />
                      Creativity City, NY 10013
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-full h-64 mb-10 flex items-center justify-center">
                <p className="text-gray-500 text-lg">Interactive Map Here</p>
              </div>

              {/* Social Links */}
              <div>
                <p className="font-semibold text-lg mb-6">FOLLOW US</p>
                <div className="flex gap-6">
                  <a href="#" className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-amber-600 transition">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-amber-600 transition">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-amber-600 transition">
                    <Linkedin size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-amber-600 transition">
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
     
    </>
  );
}