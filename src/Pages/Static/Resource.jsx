import React, { useState } from "react";

const qualifications = [
  {
    slNo: 1,
    name: "Paper Recycling Operator cum Technician",
    image: "/qualifications/qualification-1.jpg",
  },
  {
    slNo: 2,
    name: "Transformer Manufacturing Engineer",
    image: "/qualifications/qualification-2.jpg",
  },
  {
    slNo: 3,
    name: "Transformer Manufacturing Supervisor",
    image: "/qualifications/qualification-3.jpg",
  },
  {
    slNo: 4,
    name: "Transformer Testing Supervisor",
    image: "/qualifications/qualification-4.jpg",
  },
  {
    slNo: 5,
    name: "PCB NPI – Fabrication and Verification Specialist",
    image: "/qualifications/qualification-5.jpg",
  },
  {
    slNo: 6,
    name: "Polyhouse Installation, Monitoring and Service Supervisor",
    image: "/qualifications/qualification-6.jpg",
  },
  {
    slNo: 7,
    name: "Seed Production Supervisor",
    image: "/qualifications/qualification-7.jpg",
  },
  {
    slNo: 8,
    name: "Fisheries Post Harvest Supervisor",
    image: "/qualifications/qualification-8.jpg",
  },
  {
    slNo: 9,
    name: "Paper Recycling Supervisor",
    image: "/qualifications/qualification-9.jpg",
  },
  {
    slNo: 10,
    name: "Milk Testing Facility Supervisor",
    image: "/qualifications/qualification-10.jpg",
  },
  {
    slNo: 11,
    name: "Agriculture Value Addition Consultant",
    image: "/qualifications/qualification-11.jpg",
  },
  {
    slNo: 12,
    name: "Crop and Plant Supervisor",
    image: "/qualifications/qualification-12.jpg",
  },
  {
    slNo: 13,
    name: "Post-harvest Commodity Test and Storage Supervisor",
    image: "/qualifications/qualification-13.jpg",
  },
  {
    slNo: 14,
    name: "Reverse Engineering and Additive Manufacturing QA Supervisor",
    image: "/qualifications/qualification-14.jpg",
  },
  {
    slNo: 15,
    name: "Plastic Mold Design and Manufacturing Engineer",
    image: "/qualifications/qualification-15.jpg",
  },
  {
    slNo: 16,
    name: "CNC Turning Programmer",
    image: "/qualifications/qualification-16.jpg",
  },
  {
    slNo: 17,
    name: "CNC Milling Programmer",
    image: "/qualifications/qualification-17.jpg",
  },
  {
    slNo: 18,
    name: "Remote Sensing Junior Analyst (Agriculture)",
    image: "/qualifications/qualification-18.jpg",
  },
  {
    slNo: 19,
    name: "Aquaponics Cultivator",
    image: "/qualifications/qualification-19.jpg",
  },
  {
    slNo: 20,
    name: "Pollinator Habitat Maker",
    image: "/qualifications/qualification-20.jpg",
  },
  {
    slNo: 21,
    name: "Topiary Garden Artist",
    image: "/qualifications/qualification-21.jpg",
  },
  {
    slNo: 22,
    name: "Seaweed Grower and Processor",
    image: "/qualifications/qualification-22.jpg",
  },
  {
    slNo: 23,
    name: "Vermimanuring Technician",
    image: "/qualifications/qualification-23.jpg",
  },
  {
    slNo: 24,
    name: "Soil & Water Conservation Supervisor",
    image: "/qualifications/qualification-24.jpg",
  },
  {
    slNo: 25,
    name: "Smart Farming Supervisor",
    image: "/qualifications/qualification-25.jpg",
  },
  {
    slNo: 26,
    name: "Advanced Farm Equipment Supervisor",
    image: "/qualifications/qualification-26.jpg",
  },
  {
    slNo: 27,
    name: "Dairy Processing and Development Supervisor",
    image: "/qualifications/qualification-27.jpg",
  },
  {
    slNo: 28,
    name: "Intensive Aquaculture Supervisor",
    image: "/qualifications/qualification-28.jpg",
  },
];

function Resource() {
  const [selectedQualification, setSelectedQualification] = useState(null);

  return (
    <section className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Our Resources
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            Qualification Handbooks
          </h1>

          <p className="mt-3 text-slate-600">
            Explore our 28 qualification handbooks.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full">

              {/* Table Header */}
              <thead>
                <tr className="bg-blue-700 text-white">

                  <th className="px-6 py-4 text-left text-sm font-semibold w-24">
                    SL No.
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Qualification Name
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold w-40">
                    Handbook
                  </th>

                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">

                {qualifications.map((qualification) => (
                  <tr
                    key={qualification.slNo}
                    className="hover:bg-blue-50 transition-colors"
                  >

                    {/* SL NO */}
                    <td className="px-6 py-5 text-sm font-medium text-slate-500">
                      {qualification.slNo}
                    </td>

                    {/* NAME */}
                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-900">
                        {qualification.name}
                      </p>
                    </td>

                    {/* VIEW PDF */}
                    <td className="px-6 py-5 text-center">

                      <button
                        onClick={() =>
                          setSelectedQualification(qualification)
                        }
                        className="inline-flex items-center gap-2 rounded-lg
                                   bg-blue-600 px-4 py-2.5
                                   text-sm font-medium text-white
                                   hover:bg-blue-700
                                   transition-colors"
                      >
                        View PDF
                        <span>↗</span>
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {selectedQualification && (
        <div
          className="fixed inset-0 z-50 bg-black/70
                     flex items-center justify-center p-4"
          onClick={() => setSelectedQualification(null)}
        >

          <div
            className="relative bg-white rounded-2xl
                       max-w-4xl w-full max-h-[90vh]
                       overflow-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close Button */}
            <button
              onClick={() => setSelectedQualification(null)}
              className="absolute top-3 right-3 z-10
                         flex items-center justify-center
                         w-9 h-9 rounded-full
                         bg-slate-900 text-white
                         hover:bg-red-600 transition"
            >
              ×
            </button>

            {/* Title */}
            <div className="pr-12 mb-4">
              <p className="text-sm text-blue-600 font-medium">
                Qualification {selectedQualification.slNo}
              </p>

              <h2 className="text-xl font-bold text-slate-900">
                {selectedQualification.name}
              </h2>
            </div>

            {/* Image */}
            <img
              src={selectedQualification.image}
              alt={selectedQualification.name}
              className="w-full h-auto rounded-lg"
            />

          </div>
        </div>
      )}
    </section>
  );
}

export default Resource;
