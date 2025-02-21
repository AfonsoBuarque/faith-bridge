import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  churchName: string;
  logo: string;
  quote: string;
  author: string;
  role: string;
  backgroundImage: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    churchName: "Igreja Batista Central",
    logo: "https://i.postimg.cc/Kj2Vv6RL/church-logo-1.png",
    quote: "O sistema revolucionou a forma como gerenciamos nossa igreja. A praticidade e eficiência são impressionantes!",
    author: "Pr. João Silva",
    role: "Pastor Titular",
    backgroundImage: "https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 2,
    churchName: "Igreja Presbiteriana Renovada",
    logo: "https://i.postimg.cc/QxXYzqw4/church-logo-2.png",
    quote: "Desde que implementamos o FaithFlow Tech, nossa gestão de membros e visitantes melhorou significativamente.",
    author: "Pr. Carlos Santos",
    role: "Pastor Presidente",
    backgroundImage: "https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 3,
    churchName: "Comunidade Cristã Vida",
    logo: "https://i.postimg.cc/RFp7J6Yy/church-logo-3.png",
    quote: "A facilidade de uso e o suporte excepcional fazem toda a diferença. Recomendo fortemente!",
    author: "Pr. André Oliveira",
    role: "Pastor Líder",
    backgroundImage: "https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1974&auto=format&fit=crop"
  }
];

export function PartnerChurches() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) {
        handleNext();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, isHovered]);

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className="py-12 md:py-20 bg-[#D3D3D3]">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          Igrejas Parceiras
        </h2>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>

          {/* Testimonial Card */}
          <div 
            className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12 overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Background Image on Hover */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 opacity-0 group-hover:opacity-30"
              style={{ backgroundImage: `url(${testimonials[currentIndex].backgroundImage})` }}
            />

            <div className={`relative transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="flex flex-col items-center">
                <img
                  src={testimonials[currentIndex].logo}
                  alt={`${testimonials[currentIndex].churchName} Logo`}
                  className="h-20 w-auto mb-6 object-contain"
                  loading="lazy"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {testimonials[currentIndex].churchName}
                </h3>
              </div>
              
              <blockquote className="text-center mt-6">
                <p className="text-lg text-gray-600 italic">
                  "{testimonials[currentIndex].quote}"
                </p>
                <footer className="mt-4">
                  <p className="text-gray-900 font-medium">{testimonials[currentIndex].author}</p>
                  <p className="text-gray-500">{testimonials[currentIndex].role}</p>
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-gray-800 w-4' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}