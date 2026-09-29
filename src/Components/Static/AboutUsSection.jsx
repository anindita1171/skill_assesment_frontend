import React from "react";
// this is a about section
function AboutUsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
              About <span className="text-blue-600">Us</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Centurion University of Technology and Management (CUTM) is a pioneering Skill University focused on practical learning, skill development, employability, entrepreneurship, innovation, and industry relevance. Our “learning by doing” approach integrates academic knowledge with hands-on training, experiential learning, and real-world problem-solving, preparing learners for the future of work.

As a Skill University, CUTM bridges education, skills, industry, and opportunities by integrating higher education with vocational learning and practical training. The University is recognised by the National Council for Vocational Education and Training (NCVET) as an Awarding Body, contributing to India's national skill assessment and certification ecosystem.

Centurion University — where knowledge meets skills and skills create opportunities.
          </p>
            <a
              href="/about"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              Learn More
            </a>
            
          </div>
          <div className="md:w-1/2">
            <img
              src="\MRC_5982.JPG"
              alt="About Us"
              className="w-full h-auto object-cover rounded-lg shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUsSection;
