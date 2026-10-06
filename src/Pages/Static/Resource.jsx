import React, { useState } from "react";

const qualifications = [
  {
    slNo: 1,
    name: "Paper Recycling Operator cum Technician",
    traineeHandbook: "/Paper Recycling Operator cum Technician_trainee.jpeg",
    trainerHandbook: "/Paper Recycling Operator cum Technician_trainer.jpeg",
  },
  {
    slNo: 2,
    name: "Transformer Manufacturing Engineer",
    traineeHandbook: "/Transformer Manufacturing Engineer_trainee.jpeg",
    trainerHandbook: "/Transformer Manufacturing Engineer_traineer.jpeg",
  },
  {
    slNo: 3,
    name: "Transformer Manufacturing Supervisor",
    traineeHandbook: "/Transformer Manufacturing Supervisor_trainee.jpeg",
    trainerHandbook: "/Transformer Manufacturing Supervisor_trainer.jpeg",
  },
  {
    slNo: 4,
    name: "Transformer Testing Supervisor",
    traineeHandbook: "/Transformer Testing Supervisor_trainee.jpeg",
    trainerHandbook: "/Transformer Testing Supervisor_traineer.jpeg",
  },
  {
    slNo: 5,
    name: "PCB NPI – Fabrication and Verification Specialist",
    traineeHandbook: "/PCB NPI – Fabrication and Verification Specialist_trainee.jpeg",
    trainerHandbook: "/PCB NPI – Fabrication and Verification Specialist_trainer.jpeg",
  },
  {
    slNo: 6,
    name: "Polyhouse Installation, Monitoring and Service Supervisor",
    traineeHandbook: "/Polyhouse Installation, Monitoring and Service Supervisor_trainee.jpeg",
    trainerHandbook: "/Polyhouse Installation, Monitoring and Service Supervisor_trainer.jpeg",
  },
  {
    slNo: 7,
    name: "Seed Production Supervisor",
    traineeHandbook: "/Seed Production Supervisor_trainee.jpeg",
    trainerHandbook: "/Seed Production Supervisor_trainer.jpeg",
  },
  {
    slNo: 8,
    name: "Fisheries Post Harvest Supervisor",
    traineeHandbook: "/Fisheries Post Harvest Supervisor_trainee.jpeg",
    trainerHandbook: "/Fisheries Post Harvest Supervisor_trainer.jpeg",
  },
  {
    slNo: 9,
    name: "Paper Recycling Supervisor",
    traineeHandbook: "/Paper Recycling Supervisor_trainee.jpeg",
    trainerHandbook: "/Paper Recycling Supervisor_trainer.jpeg",
  },
  {
    slNo: 10,
    name: "Milk Testing Facility Supervisor",
    traineeHandbook: "/Milk Testing Facility Supervisor_trainee.jpeg",
    trainerHandbook: "/Milk Testing Facility Supervisor_trainer.jpeg",
  },
  {
    slNo: 11,
    name: "Agriculture Value Addition Consultant",
    traineeHandbook: "/Agriculture Value Addition Consultant_trainee.jpeg",
    trainerHandbook: "/Agriculture Value Addition Consultant_trainer.jpeg",
  },
  {
    slNo: 12,
    name: "Crop and Plant Supervisor",
    traineeHandbook: "/Crop and Plant Supervisor_trainee.jpeg",
    trainerHandbook: "/Crop and Plant Supervisor_trainer.jpeg",
  },
  {
    slNo: 13,
    name: "Post-harvest Commodity Test and Storage Supervisor",
    traineeHandbook: "/Post-harvest Commodity Test and Storage Supervisor_trainee.jpeg",
    trainerHandbook: "/Post-harvest Commodity Test and Storage Supervisor_trainer.jpeg",
  },
  {
    slNo: 14,
    name: "Reverse Engineering and Additive Manufacturing QA Supervisor",
    traineeHandbook: "/Reverse Engineering and Additive Manufacturing QA Supervisor_trainee.jpeg",
    trainerHandbook: "/Reverse Engineering and Additive Manufacturing QA Supervisor_trainer.jpeg",
  },
  {
    slNo: 15,
    name: "Plastic Mold Design and Manufacturing Engineer",
    traineeHandbook: "/Plastic Mold Design and Manufacturing Engineer_trainee.jpeg",
    trainerHandbook: "/Plastic Mold Design and Manufacturing Engineer_trainer.jpeg",
  },
  {
    slNo: 16,
    name: "CNC Turning Programmer",
    traineeHandbook: "/CNC Turning Programmer_trainee.jpeg",
    trainerHandbook: "/CNC Turning Programmer_trainer.jpeg",
  },
  {
    slNo: 17,
    name: "CNC Milling Programmer",
    traineeHandbook: "/CNC Milling Programmer_trainee.jpeg",
    trainerHandbook: "/CNC Milling Programmer_trainer.jpeg",
  },
  {
    slNo: 18,
    name: "Remote Sensing Junior Analyst (Agriculture)",
    traineeHandbook: "/Remote Sensing Junior Analyst (Agriculture)_trainee.jpeg",
    trainerHandbook: "/Remote Sensing Junior Analyst (Agriculture)_trainer.jpeg",
  },
  {
    slNo: 19,
    name: "Aquaponics Cultivator",
    traineeHandbook: "/Aquaponics Cultivator_trainee.jpeg",
    trainerHandbook: "/Aquaponics Cultivator_trainer.jpeg",
  },
  {
    slNo: 20,
    name: "Pollinator Habitat Maker",
    traineeHandbook: "/Pollinator Habitat Maker_trainee.jpeg",
    trainerHandbook: "/Pollinator Habitat Maker_trainer.jpeg",
  },
  {
    slNo: 21,
    name: "Topiary Garden Artist",
    traineeHandbook: "/Topiary Garden Artist_trainee.jpeg",
    trainerHandbook: "/Topiary Garden Artist_trainer.jpeg",
  },
  {
    slNo: 22,
    name: "Seaweed Grower and Processor",
    traineeHandbook: "/Seaweed Grower and Processor_trainee.jpeg",
    trainerHandbook: "/Seaweed Grower and Processor_traineer.jpeg",
  },
  {
    slNo: 23,
    name: "Vermimanuring Technician",
    traineeHandbook: "/Vermimanuring Technician_trainee.jpeg",
    trainerHandbook: "/Vermimanuring Technician_traineer.jpeg",
  },
  {
    slNo: 24,
    name: "Soil & Water Conservation Supervisor",
    traineeHandbook: "/Soil & Water Conservation Supervisor_trainee.jpg",
    trainerHandbook: "/Soil & Water Conservation Supervisor_trainer.jpg",
  },
  {
    slNo: 25,
    name: "Smart Farming Supervisor",
    traineeHandbook: "/qualifications/trainee/qualification-25.jpg",
    trainerHandbook: "/qualifications/trainer/qualification-25.jpg",
  },
  {
    slNo: 26,
    name: "Advanced Farm Equipment Supervisor",
    traineeHandbook: "/qualifications/trainee/qualification-26.jpg",
    trainerHandbook: "/qualifications/trainer/qualification-26.jpg",
  },
  {
    slNo: 27,
    name: "Dairy Processing and Development Supervisor",
    traineeHandbook: "/qualifications/trainee/qualification-27.jpg",
    trainerHandbook: "/qualifications/trainer/qualification-27.jpg",
  },
  {
    slNo: 28,
    name: "Intensive Aquaculture Supervisor",
    traineeHandbook: "/qualifications/trainee/qualification-28.jpg",
    trainerHandbook: "/qualifications/trainer/qualification-28.jpg",
  },
];

function Resource() {
  const [selectedHandbook, setSelectedHandbook] = useState(null);

  const openHandbook = (qualification, type) => {
    setSelectedHandbook({
      qualification,
      type,
      image:
        type === "trainee"
          ? qualification.traineeHandbook
          : qualification.trainerHandbook,
    });
  };

  const closeHandbook = () => {
    setSelectedHandbook(null);
  };

  return (
    <section className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Qualification Handbooks
          </h1>

          <p className="mt-3 text-slate-600">
            Explore our 28 qualification handbooks.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">

              {/* Table Header */}
              <thead>
                <tr className="bg-blue-700 text-white">

                  <th className="px-6 py-4 text-left text-sm font-semibold w-24">
                    SL No.
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Qualification Name
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold w-48">
                    Trainee Handbook
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold w-48">
                    Trainer Handbook
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

                    {/* QUALIFICATION NAME */}
                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-900">
                        {qualification.name}
                      </p>
                    </td>

                    {/* TRAINEE HANDBOOK */}
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() =>
                          openHandbook(qualification, "trainee")
                        }
                        className="inline-flex items-center gap-2 rounded-lg
                                   bg-purple-600 px-4 py-2.5
                                   text-sm font-medium text-white
                                   hover:bg-blue-700
                                   transition-colors"
                      >
                        View PDF
                        <span>↗</span>
                      </button>
                    </td>

                    {/* TRAINER HANDBOOK */}
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() =>
                          openHandbook(qualification, "trainer")
                        }
                        className="inline-flex items-center gap-2 rounded-lg
                                   bg-emerald-600 px-4 py-2.5
                                   text-sm font-medium text-white
                                   hover:bg-emerald-700
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

      {/* HANDBOOK MODAL */}
      {selectedHandbook && (
        <div
          className="fixed inset-0 z-50 bg-black/70
                     flex items-center justify-center p-4"
          onClick={closeHandbook}
        >

          <div
            className="relative bg-white rounded-2xl
                       max-w-5xl w-full max-h-[90vh]
                       overflow-auto p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close Button */}
            <button
              onClick={closeHandbook}
              className="absolute top-3 right-3 z-10
                         flex items-center justify-center
                         w-9 h-9 rounded-full
                         bg-slate-900 text-white
                         hover:bg-red-600 transition"
              aria-label="Close"
            >
              ×
            </button>

            {/* Modal Title */}
            <div className="pr-12 mb-5">

              <p className="text-sm text-blue-600 font-medium">
                Qualification {selectedHandbook.qualification.slNo}
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {selectedHandbook.qualification.name}
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                {selectedHandbook.type === "trainee"
                  ? "Trainee Handbook"
                  : "Trainer Handbook"}
              </p>

            </div>

            {/* Handbook Image */}
            <img
              src={selectedHandbook.image}
              alt={`${selectedHandbook.type} handbook - ${selectedHandbook.qualification.name}`}
              className="w-full h-auto rounded-lg border border-slate-200"
            />

          </div>
        </div>
      )}
    </section>
  );
}

export default Resource;
