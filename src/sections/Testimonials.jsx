import Container from "../components/common/Container";
import { Star } from "lucide-react";

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah K.",
    role: "Photographer",
    feedback:
      "The Model Studio Cooperative transformed my career! Found incredible projects and collaborations here.",
  rating: 5,
  },
  {
    id: 2,
    name: "Ben T.",
    role: "Model",
    feedback:
      "A fantastic platform, its invaluable. I've met amazing artists and developed valuable connections. The resources are invaluable.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma L.",
    role: "Designer",
    feedback:
      "This community has been a game-changer. Professional, supportive, and full of creative opportunities.",
    rating: 5,
  },
];

export default function Testimonials() {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
      />
    ));
  };

  return (
    <section className="bg-gradient-to-b from-gray-900 to-black py-24">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gray-400 uppercase tracking-wider text-sm font-medium mb-4">
            Community Voices
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hear what our members have to say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col transform hover:scale-105 transition-transform duration-300"
            >
              {/* Avatar + Feedback */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  {/* Replace above div with <img src={t.avatar} alt={t.name} /> if you have images */}
                </div>
                <p className="text-gray-800 font-medium text-lg leading-relaxed">{t.feedback}</p>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">{renderStars(t.rating)}</div>

              {/* Name & Role */}
              <div className="mt-auto">
                <p className="text-gray-900 font-semibold text-lg">– {t.name}</p>
                <p className="text-gray-500 text-sm">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
