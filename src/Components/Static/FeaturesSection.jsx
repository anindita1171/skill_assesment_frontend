import React from "react";
import students from "../../assets/students.png"
import govt from "../../assets/govt.png"
import assesmentagencies from "../../assets/assesmentagencies.png"
import traningpartner from "../../assets/traningpartner.png"
function FeaturesSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gray-600 font-semibold uppercase tracking-wider">
            Why choose us
          </span>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Trained students in{" "}
            <span className="text-blue-600">different locations</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-700 leading-relaxed">
            Centurion University is trusted for its skill-focused, practical, and industry-oriented approach to education. Our students are trained through hands-on learning, experiential programmes, and real-world exposure to develop job-ready competencies. To make quality skill development accessible across communities, our training programmes are delivered at multiple locations, bringing learning opportunities closer to students and local communities. Our experienced faculty and trainers focus on practical knowledge, professional skills, and competency development, helping learners become confident and future-ready. With a strong emphasis on skills, employability, innovation, and industry relevance, we prepare students to build meaningful careers and create sustainable opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            image={students}
            number="10,000+"
            title="Students Trained"
            description="Trained 10,000+ students in different states"
          />
          <FeatureCard
            image={govt}
            number="5+"
            title="Government Projects"
            description="Working with 5+ government projects and organizations"
          />
          <FeatureCard
            image={traningpartner}
            number="5"
            title="Training Partners"
            description="We have 5 Training Partners with us"
          />
          <FeatureCard
            image={assesmentagencies}
            number="6"
            title="Assignment Partners"
            description="We have 6 Assignment agencies with us"
          />
        </div>
      </div>
    </section>
  );
}

const FeatureCard = ({ image, number, title, description }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
    <div className="mb-4">
      <img
        src={image}
        alt={title}
        className="w-24 h-24 object-cover mx-auto rounded-full border-4 border-blue-100"
      />
    </div>
    <h2 className="text-3xl font-bold text-blue-600 mb-2">{number}</h2>
    <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default FeaturesSection;
