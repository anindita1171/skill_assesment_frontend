/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import { motion } from "framer-motion";

const Qualification = () => {
  // Static data from your Excel sheet
  const staticData = [
    {
      "SL NO": 1,
      "QUALIFICATION NAME": "Paper Recycling Operator cum Technician",
      SECTOR: "PAPER & PAPER PRODUCTS",
      "NSQF LEVEL": 4,
      "APPROVED IN NSQC": "24TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/QF%20Paper%20Recycling%20Operator%20Cum%20Technician.pdf",
    },
    {
      "SL NO": 2,
      "QUALIFICATION NAME": "Transformer Manufacturing Engineer",
      SECTOR: "POWER",
      "NSQF LEVEL": 6,
      "APPROVED IN NSQC": "30TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q%20File%20-%20Transformer%20Mfg%20Engineer.pdf",
    },
    {
      "SL NO": 3,
      "QUALIFICATION NAME": "Transformer Manufacturing Supervisor",
      SECTOR: "POWER",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "30TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q%20File%20Transformer%20Mfg%20Supervisor.pdf",
    },
    {
      "SL NO": 4,
      "QUALIFICATION NAME": "Transformer Testing Supervisor",
      SECTOR: "POWER",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "30TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q%20File%20Transformer%20Testing%20Supervisor.pdf",
    },
    {
      "SL NO": 5,
      "QUALIFICATION NAME": "PCB NPI – Fabrication and Verification Specialist",
      SECTOR: "ELECTRONICS AND HW",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "33TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q-File%20PCB%20NPI%20%E2%80%93%20Fabrication%20and%20Verification%20Specialist.pdf",
    },
    {
      "SL NO": 6,
      "QUALIFICATION NAME":
        "Polyhouse Installation, Monitoring and Service Supervisor",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "33TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q-File__Polyhouse%20Installation,%20Monitoring%20and%20Service%20Supervisor.pdf",
    },
    {
      "SL NO": 7,
      "QUALIFICATION NAME": "Seed Production Supervisor",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "33TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q-File_Seed%20Production%20Supervisor.pdf",
    },
    {
      "SL NO": 8,
      "QUALIFICATION NAME": "Fisheries Post Harvest Supervisor",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "33TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q%20File-Fisheries%20Post%20Harvest%20Supervisor.pdf",
    },
    {
      "SL NO": 9,
      "QUALIFICATION NAME": "Paper Recycling Supervisor",
      SECTOR: "ENVIRONMENTAL SCIENCE",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "34TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q-File%20Paper%20Recycling%20Supervisor%20%281%29.pdf",
    },
    {
      "SL NO": 10,
      "QUALIFICATION NAME": "Milk Testing Facility Supervisor",
      SECTOR: "FOOD INDUSTRY",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "34TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q-File%20Milk%20Testing%20Facility%20Supervisor.pdf",
    },
    {
      "SL NO": 11,
      "QUALIFICATION NAME": "Agriculture Value Addition Consultant",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "35TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q-File%20Agriculture%20Value%20Addition%20Consultant.pdf",
    },
    {
      "SL NO": 12,
      "QUALIFICATION NAME": "Crop and Plant Supervisor",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "35TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q-File_Crop%20and%20Plant%20Supervisor.pdf",
    },
    {
      "SL NO": 13,
      "QUALIFICATION NAME":
        "Post-harvest Commodity Test and Storage Supervisor",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "35TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q-File_Post-harvest%20Commodity%20Test%20and%20Storage%20Supervisor.pdf",
    },
    {
      "SL NO": 14,
      "QUALIFICATION NAME":
        "Reverse Engineering and Additive Manufacturing QA Supervisor",
      SECTOR: "CAPITAL GOODS",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "35TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/QF-Reverse%20Engineering%20and%20Additive%20Manufacturing%20%20QA%20Supervisor.pdf",
    },
    {
      "SL NO": 15,
      "QUALIFICATION NAME": "Plastic Mold Design and Manufacturing Engineer",
      SECTOR: "CAPITAL GOODS",
      "NSQF LEVEL": 6,
      "APPROVED IN NSQC": "35TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q-FILE_Plastic%20Mold%20Design%20%20and%20Manufacturing%20Engineer.pdf",
    },
    {
      "SL NO": 16,
      "QUALIFICATION NAME": "CNC Turning Programmer",
      SECTOR: "CAPITAL GOODS",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "35TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q-File%20CNC%20Turning%20Programmer.pdf",
    },
    {
      "SL NO": 17,
      "QUALIFICATION NAME": "CNC Milling Programmer",
      SECTOR: "CAPITAL GOODS",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "35TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q-File%20CNC%20Milling%20Programmer.pdf",
    },


    {
      "SL NO": 18,
      "QUALIFICATION NAME": "Remote Sensing junior Analyst (Agriculture)",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "40TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Qualification%20File-%20Remote%20Sensing%20Junior%20Analyst%20%28Agriculture%29.pdf",
    },    

    {
      "SL NO": 19,
      "QUALIFICATION NAME": "Aquaponics Cultivator",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 4,
      "APPROVED IN NSQC": "40TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Qf%20-Aquaponics%20Cultivator.pdf",
    }, 
    {
      "SL NO": 20,
      "QUALIFICATION NAME": "Polinator Habitat Maker ",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 3.5,
      "APPROVED IN NSQC": "40TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/QF-Pollinator%20Habitat%20Maker.pdf",
    }, 
    {
      "SL NO": 21,
      "QUALIFICATION NAME": "Topiary Garden Artist",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 4,
      "APPROVED IN NSQC": "40TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Qualification%20File-Topiary%20Garden%20Artist.pdf",
    }, 
    {
      "SL NO": 22,
      "QUALIFICATION NAME": "Seaweed Grower and Processor",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 4,
      "APPROVED IN NSQC": "40TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Qualification%20-%20Seaweed%20Grower%20and%20Processor.pdf",
    },
    {
      "SL NO": 23,
      "QUALIFICATION NAME": "Vermimanuring Technician",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 4,
      "APPROVED IN NSQC": "40TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/QF%20-Vermimanuring%20Technician.pdf",
    },
    {
      "SL NO": 24,
      "QUALIFICATION NAME": "Soil & Water Conservation Supervisor",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "43TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Qf%20-Soil%20and%20water%20Conservation%20Supervisor.pdf",
    },
    {
      "SL NO": 25,
      "QUALIFICATION NAME": "Smart Farming Supervisior",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "43TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Qf%20-%20Smart%20Farming%20Supervisor.pdf",
    },
    {
      "SL NO": 26,
      "QUALIFICATION NAME": "Advanced Farm Equipment Supervisor",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "43TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Qf-%20Advanced%20Farm%20Equipment%20Supervisor.pdf",
    },
    {
      "SL NO": 27,
      "QUALIFICATION NAME": "Dairy Processing and Development Supervisor",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "43TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Qf-Dairy%20Processing%20and%20Development%20Supervisor.pdf",
    },
    {
      "SL NO": 28,
      "QUALIFICATION NAME": "Intensive Aquaculture Supervisor",
      SECTOR: "AGRICULTURE",
      "NSQF LEVEL": 5,
      "APPROVED IN NSQC": "43TH NSQC",
      "Q-FILE": "https://www.nqr.gov.in/qualification/file/Q%20File%20-%20Intensive%20Aquaculture%20Supervisor.pdf",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState(null);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const sortedData = [...staticData].sort((a, b) => {
    if (sortConfig !== null) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredData = sortedData.filter(
    (item) =>
      item["QUALIFICATION NAME"]
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item["SECTOR"].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section>
      <motion.div
        className="container min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-blue-50 to-indigo-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Qualification <span className="text-blue-600">Table</span>
        </h1>
        <div className="mb-4 rounded-lg">
          <input
            type="text"
            placeholder="Search by qualification or sector..."
            value={searchQuery}
            onChange={handleSearch}
            className="border rounded-lg p-2 w-full"
          />
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="heading w-full text-sm font-medium">
            <thead>
              <tr className="bg-gray-300">
                <th className="px-6 py-3 text-left text-gray-700 hover:text-primary">
                  Sl. No.{" "}
                </th>
                <th
                  className="p-2 cursor-pointer"
                  onClick={() => requestSort("QUALIFICATION NAME")}
                >
                  Qualification Name
                </th>
                <th
                  className="p-2 cursor-pointer"
                  onClick={() => requestSort("SECTOR")}
                >
                  Sector
                </th>
                <th
                  className="p-2 cursor-pointer"
                  onClick={() => requestSort("NSQF LEVEL")}
                >
                  NSQF Level
                </th>
                <th className="p-2">Approved in NSQC</th>
                <th className="p-2">Q-File</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr
                  key={index}
                  className="bg-white hover:bg-gray-100 text-gray-700 hover:text-primary"
                >
                  <td className="px-4 py-2 text-center">{row["SL NO"]}</td>
                  <td className="px-4 py-2 text-center">
                    {row["QUALIFICATION NAME"]}
                  </td>
                  <td className="p-4 text-center">{row["SECTOR"]}</td>
                  <td className="p-4 text-center">{row["NSQF LEVEL"]}</td>
                  <td className="p-4 text-center">{row["APPROVED IN NSQC"]}</td>
                  <td className="p-4 text-center">
                    <a
                      href={row["Q-FILE"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      View PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
};

export default Qualification;