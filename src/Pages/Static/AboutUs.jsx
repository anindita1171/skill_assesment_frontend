import React from "react";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <>
      <AboutUsSection />

      {/* Main content centered properly */}
      <main className="w-full">
        <ImageGallery />
        <OurTeam />
      </main>
    </>
  );
}

function AboutUsSection() {
  return (
    <section className="w-full py-16 bg-gradient-to-r from-blue-100 to-indigo-300 text-gray-900">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
              About Our <span className="text-blue-600">Organization</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto">
              Empowering organizations and individuals through innovative
              assessment solutions
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AboutUsCard
              title="Our Mission"
              description="To promote quality education, skill development, and competency-based learning through innovative approaches, industry collaboration, and technology-enabled assessment and certification."
              icon={<MissionIcon />}
            />

            <AboutUsCard
              title="Our Vision"
              description="To emerge as a globally recognized institution for skill-based education and assessment, empowering learners and professionals with relevant knowledge, practical competencies, and opportunities for sustainable growth."
              icon={<VisionIcon />}
            />

            <AboutUsCard
              title="Our Values"
              description="Integrity, Excellence, Innovation, Inclusion, Collaboration, and Continuous Improvement guide our academic and professional practices and help us maintain a strong commitment to learners, industry, and society."
              icon={<ValuesIcon />}
            />

            <AboutUsCard
              title="Our Expertise"
              description="With experienced academic professionals, trainers, assessors, and industry experts, Centurion University brings together expertise in education, vocational training, competency assessment, and workforce development."
              icon={<ExpertiseIcon />}
            />

            <AboutUsCard
              title="Our Approach"
              description="We combine academic knowledge with practical, industry-oriented learning. Our approach emphasizes competency, hands-on experience, technology, and quality assurance to ensure that learners develop skills that are relevant to real-world requirements."
              icon={<ApproachIcon />}
            />

            <AboutUsCard
              title="Our Impact"
              description="Through education, skill development, assessment, and certification, Centurion University works to empower individuals, strengthen employability, and support organizations in developing a capable and skilled workforce."
              icon={<ImpactIcon />}
            />
          </div>
        </div>
      </motion.section>
    </section>
  );
}

function AboutUsCard({ title, description, icon }) {
  return (
    <motion.div
      className="bg-white/50 rounded-lg p-6 backdrop-blur-lg"
      whileHover={{
        y: -5,
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <div className="mr-4 text-yellow-600">{icon}</div>
        <h2 className="text-blue-600 text-2xl font-semibold">{title}</h2>
      </div>

      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

/* ---------------- ICONS ---------------- */

function MissionIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

function VisionIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function ValuesIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function ExpertiseIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      />
    </svg>
  );
}

function ApproachIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
  );
}

function ImpactIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

/* ---------------- IMAGE GALLERY ---------------- */

function ImageGallery() {
  const programs = [
    
   
  ];

  return (
    <section className="w-full py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Centered container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-10 text-center text-gray-800">
           <span className="text-blue-600"></span>
        </h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative overflow-hidden rounded-xl shadow-md cursor-pointer group"
            >
              <img
                src={program.image}
                alt={program.name}
                className="object-cover w-full h-60 transition-transform duration-300 ease-in-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold text-center px-4">
                  {program.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- OUR TEAM ---------------- */

function OurTeam() {
  const teamMembers = [
    {
      name: "Partha Sarathi Mohanty",
      role: "Head-Centre for Skill Certification",
      image:
        "https://www.shutterstock.com/shutterstock/photos/2807940593/display_1500/stock-vector-vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-2807940593.jpg",
    },
    {
      name: "Monalisha Ghosh",
      role: "National Coordinator",
      image:
        "https://www.shutterstock.com/shutterstock/photos/2807940593/display_1500/stock-vector-vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-2807940593.jpg",
    },
    {
      name: "Rajib Lochan Patnaik",
      role: "Manager Quality Assurance & Operation",
      image:
        "https://www.shutterstock.com/shutterstock/photos/2807940593/display_1500/stock-vector-vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-2807940593.jpg",
    },
    {
      name: "Pritam Mahapatra",
      role: "Manager-Operation",
      image:
        "https://www.shutterstock.com/shutterstock/photos/2807940593/display_1500/stock-vector-vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-2807940593.jpg",
    },
    {
      name: "Subrat Sahu",
      role: "Accountant",
      image:
        "https://www.shutterstock.com/shutterstock/photos/2807940593/display_1500/stock-vector-vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-2807940593.jpg",
    },
    {
      name: "Priyadarshini Mangaraj",
      role: "Assistant Manager-Standard",
      image:
        "https://www.shutterstock.com/shutterstock/photos/2807940593/display_1500/stock-vector-vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-2807940593.jpg",
    },
    {
      name: "Anindita Samal",
      role: "IT-Executive",
      image:
        "https://www.shutterstock.com/shutterstock/photos/2807940593/display_1500/stock-vector-vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-2807940593.jpg",
    },
    {
      name: "Deepam Jyoti Das",
      role: "Assessment Coordinator",
      image:
        "https://www.shutterstock.com/shutterstock/photos/2807940593/display_1500/stock-vector-vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-2807940593.jpg",
    },
    {
      name: "Sumit Kumar Parichha",
      role: "Office Coordinator",
      image:
        "https://www.shutterstock.com/shutterstock/photos/2807940593/display_1500/stock-vector-vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-2807940593.jpg",
    },
  ];

  return (
    <section className="w-full py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-10 text-center text-gray-800">
          Our <span className="text-blue-600">Team</span>
        </h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-5
            gap-x-6
            gap-y-10
            justify-items-center
          "
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center text-center w-full max-w-[180px]"
            >
              <img
                src={member.image}
                alt={member.name}
                className="
                  w-24 h-24
                  sm:w-28 sm:h-28
                  md:w-32 md:h-32
                  rounded-full
                  mb-3
                  object-cover
                  border-4
                  border-white
                  shadow-md
                "
              />

              <h3 className="text-sm sm:text-base font-semibold text-gray-800 leading-tight">
                {member.name}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                {member.role}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
