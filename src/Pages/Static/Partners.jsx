import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { FaChartLine, FaLightbulb, FaPuzzlePiece } from "react-icons/fa";

// Common image for all partners
const partnerImage =
  "https://www.shutterstock.com/shutterstock/photos/2807940593/display_1500/stock-vector-vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-2807940593.jpg";

export default function Partners() {
  const partners = [];

  const trainingPartners = [
    {
      name: "Black Panther Guards and Services Pvt Ltd",
      description: "",
      image: partnerImage,
    },
    {
      name: "Pramodini Educational and Charitable Trust",
      description: "",
      image: partnerImage,
    },
    {
      name: "Distil Education and Technology Pvt Ltd",
      description: "",
      image: partnerImage,
    },
    {
      name: "Gram Tarang Employability Training Services Pvt Ltd",
      description: "",
      image: partnerImage,
    },
    {
      name: "NIAM Educational Foundation",
      description: "",
      image: partnerImage,
    },
  ];

  const assessmentAgencies = [
    {
      name: "I ASSESS Consultants LLP",
      description: "",
      image: partnerImage,
    },
    {
      name: "IRIS Corporate Solutions Pvt. Ltd.",
      description: "",
      image: partnerImage,
    },
    {
      name: "Merindyne Skills India Pvt. Ltd.",
      description: "",
      image: partnerImage,
    },
    {
      name: "MASCOT Upgradeskill and Knowledge Pvt. Ltd.",
      description: "",
      image: partnerImage,
    },
    {
      name: "Skill Mantra Edtech Consultant India Pvt. Ltd.",
      description: "",
      image: partnerImage,
    },
    {
      name: "Ginger Webs Pvt. Ltd.",
      description: "",
      image: partnerImage,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CarouselSection
            title="Our"
            title2="Training Partners"
            description="We partner with top training organizations to provide the best resources for employee development."
            items={trainingPartners}
            CardComponent={TrainingCard}
          />

          <CarouselSection
            title="Our"
            title2="Assessment Agencies"
            description="We collaborate with leading agencies to provide comprehensive and reliable assessment solutions."
            items={assessmentAgencies}
            CardComponent={AgencyCard}
          />

          <Testimonials />
        </div>
      </main>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-gradient-to-r from-blue-100 to-indigo-300 text-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
            Empowering <span className="text-blue-600">Stakeholders</span> for
            Growth
          </h1>

          <p className="text-xl md:text-2xl mb-10 text-gray-600">
            Our comprehensive assessment solutions help organizations identify
            and nurture talent, ensuring success across all levels.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-lg"
            >
              Learn More
            </a>

            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-white text-blue-600 font-medium hover:bg-blue-50 transition-colors border border-blue-600 text-lg"
            >
              Contact Us
            </a>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <FeatureCard
            title="Comprehensive Assessments"
            description="Gain deep insights into your organization's talent landscape."
            icon="chart"
          />

          <FeatureCard
            title="Data-Driven Decisions"
            description="Make informed choices based on robust analytics and reporting."
            icon="lightbulb"
          />

          <FeatureCard
            title="Tailored Solutions"
            description="Customized approaches to meet your unique organizational needs."
            icon="puzzle"
          />
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ title, description, icon }) {
  const iconComponents = {
    chart: FaChartLine,
    lightbulb: FaLightbulb,
    puzzle: FaPuzzlePiece,
  };

  const IconComponent = iconComponents[icon] || FaLightbulb;

  return (
    <motion.div
      className="bg-white bg-opacity-50 rounded-lg p-6 flex flex-col items-center text-center"
      whileHover={{
        y: -5,
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <IconComponent className="text-3xl text-blue-600" />
      </motion.div>

      <h3 className="text-xl font-semibold mb-3 text-gray-800">
        {title}
      </h3>

      <p className="text-gray-600 mb-4">{description}</p>

      <motion.a
        href="#"
        className="text-blue-600 font-medium hover:text-blue-700 transition-colors inline-flex items-center"
        whileHover={{ x: 5 }}
      >
        Learn More

        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.a>
    </motion.div>
  );
}

function CarouselSection({
  title,
  title2,
  description,
  items,
  CardComponent,
}) {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            {title}{" "}
            <span className="text-blue-600">{title2}</span>
          </h2>

          <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          pagination={{ clickable: true }}
          navigation={true}
          loop={true}
          modules={[Pagination, Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
          className="py-8"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index} className="p-2">
              <CardComponent {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

function PartnerCard({ name, description, image }) {
  return (
    <div className="bg-white rounded-lg hover:shadow-md p-6 h-full flex flex-col justify-between cursor-pointer transition duration-300 ease-in-out transform hover:scale-105">
      <div>
        <img
          src={image}
          alt={`${name} Logo`}
          className="w-24 h-24 mx-auto rounded-lg object-cover mb-4"
        />

        <h3 className="text-xl font-semibold text-center mb-4 text-blue-600">
          {name}
        </h3>
      </div>

      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}

function TrainingCard({ name, description, image }) {
  return (
    <div className="bg-white rounded-lg p-6 h-full flex flex-col justify-between cursor-pointer hover:shadow-md transition duration-300 ease-in-out transform hover:scale-105">
      <div>
        <img
          src={image}
          alt={`${name} Logo`}
          className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
        />

        <h3 className="text-xl font-semibold text-center mb-4 text-green-600">
          {name}
        </h3>
      </div>

      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}

function AgencyCard({ name, description, image }) {
  return (
    <div className="bg-white rounded-lg hover:shadow-md p-6 h-full flex flex-col justify-between cursor-pointer transition duration-300 ease-in-out transform hover:scale-105">
      <div>
        <img
          src={image}
          alt={`${name} Logo`}
          className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
        />

        <h3 className="text-xl font-semibold text-center mb-4 text-purple-600">
          {name}
        </h3>
      </div>

      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-green-100 to-green-50 w-full py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <p className="text-xl text-gray-600 max-w-2xl mx-auto"></p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2"></div>
      </div>
    </section>
  );
}

function TestimonialCard({ quote, name, title, imageSrc }) {
  return (
    <div className="bg-green-200 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl p-6 flex flex-col">
      <blockquote className="text-gray-600 mb-4">
        {quote}
      </blockquote>

      <div className="flex items-center mt-auto">
        <img
          src={imageSrc}
          alt={name}
          className="w-12 h-12 rounded-full mr-4"
        />

        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    </div>
  );
}
