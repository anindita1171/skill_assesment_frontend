import React from "react";

const KeyStakeholders = () => {
  const stakeholders = [
    
    
    
    
  ];

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          <span className="text-blue-600"></span>
        </h2>
        <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
          
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stakeholders.map((stakeholder, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="w-full h-32 flex items-center justify-center mb-4">
                <img
                  src={stakeholder.logo}
                  alt={`${stakeholder.name} logo`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 text-center">
                {stakeholder.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyStakeholders;
