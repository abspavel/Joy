import { Link } from 'react-router-dom';
import { FadeIn } from '../components/FadeIn';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { ArrowUpRight } from 'lucide-react';

const fallbackServices = [
  {
    number: "01",
    name: "Web Design",
    slug: "web-design",
    description: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience."
  },
  {
    number: "02",
    name: "Frontend Development",
    slug: "frontend-development",
    description: "Building fast, responsive, and interactive user interfaces using modern frameworks like React and Next.js."
  },
  {
    number: "03",
    name: "Backend & API Development",
    slug: "backend-api-development",
    description: "Developing reliable server-side logic, databases, and APIs that power dynamic, data-driven websites and applications."
  },
  {
    number: "04",
    name: "E-commerce Development",
    slug: "ecommerce-development",
    description: "Building secure, scalable online stores with smooth checkout flows and easy content management."
  },
  {
    number: "05",
    name: "Website Maintenance & Optimization",
    slug: "website-maintenance-optimization",
    description: "Ongoing updates, bug fixes, and performance/SEO optimization to keep websites fast, secure, and search-friendly."
  }
];

export function ServicesSection() {
  const { data, loading } = usePortfolioData('services');
  const services = data && data.length > 0 ? data : fallbackServices;

  return (
    <section id="services" className="bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <FadeIn y={30}>
        <h2 className="text-[#0C0C0C] font-black uppercase text-center text-[clamp(3rem,12vw,160px)] mb-16 sm:mb-20 md:mb-28 leading-none">
          Services
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto flex flex-col">
        {services.map((service, index) => (
          <FadeIn 
            key={service.number || index} 
            delay={index * 0.1}
          >
            <Link 
              to={`/services/${service.slug || service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="group flex flex-col md:flex-row items-start md:items-center py-8 sm:py-10 md:py-12 border-b border-[rgba(12,12,12,0.15)] last:border-b-0 gap-6 md:gap-12 lg:gap-20 transition-all duration-300 hover:pl-4 sm:hover:pl-8 cursor-pointer relative"
            >
              <div className="text-[#0C0C0C] font-black text-[clamp(3rem,10vw,140px)] leading-none md:w-1/4 shrink-0 transition-colors group-hover:text-[#B600A8]">
                {service.number}
              </div>
              <div className="flex flex-col gap-2 md:gap-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[#0C0C0C] font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)] leading-tight">
                    {service.name}
                  </h3>
                  <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 text-[#0C0C0C] opacity-60 sm:opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200 shrink-0 ml-4" />
                </div>
                <p className="text-[#0C0C0C] font-light leading-relaxed max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] opacity-60">
                  {service.description}
                </p>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
