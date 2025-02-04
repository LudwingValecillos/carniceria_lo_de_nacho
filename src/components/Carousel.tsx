import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import img1 from '../images/TATTOO.png';
import img2 from '../images/Post de instagram haz tu pedido a domicilio ilustrado colorido naranja.png';

const images = [img1, img2];

export function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${
            index === currentIndex ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <img
            src={img}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
      >
        <ChevronLeft className="w-6 h-6 text-red-600" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
      >
        <ChevronRight className="w-6 h-6 text-red-600" />
      </button>
    </div>
  );
}
