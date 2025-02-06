import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Importa imágenes separadas para desktop y mobile
import img1 from '../images/banner1.png';
import img2 from '../images/banner2.png';
import img3 from '../images/banner3.png';
import img4 from '../images/banner4.png';
import img5 from '../images/banner5.png';


const mobileImages = [img1, img2, img3, img4];


// Crea dos arrays separados
const desktopImages = [img1, img3, img5];

// Hook personalizado para detectar el tamaño de pantalla
const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile };
};

export function Carousel({ showCarousel = true }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isMobile } = useScreenSize();
  
  // Selecciona el array de imágenes apropiado
  const activeImages = isMobile ? mobileImages : desktopImages;

  useEffect(() => {
    // Reinicia el índice al cambiar entre vistas
    setCurrentIndex(0);
  }, [activeImages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeImages.length]); // Dependencia del largo del array

  const prev = () => setCurrentIndex((prev) => 
    (prev - 1 + activeImages.length) % activeImages.length
  );
  
  const next = () => setCurrentIndex((prev) => 
    (prev + 1) % activeImages.length
  );

  if (!showCarousel) return null;

  return (
    <div className="relative h-[400px] w-full overflow-hidden md:h-[600px]">
      {activeImages.map((img, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-transform duration-700 ease-in-out md: ${
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
      {/* Botones de navegación */}
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