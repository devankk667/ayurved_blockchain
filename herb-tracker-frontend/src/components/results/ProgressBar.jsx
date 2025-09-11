import React from 'react';

const ProgressBar = ({ currentStage }) => {
  const stages = ['Farm', 'Processing', 'Distribution', 'Retail', 'Consumer'];
  const progressPercentage = ((currentStage + 1) / stages.length) * 100;

  return (
    <div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
              Stage {currentStage + 1} of {stages.length}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-green-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
          <div
            style={{ width: `${progressPercentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
          ></div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        {stages.map((stage, index) => (
          <span
            key={stage}
            className={`font-semibold ${index <= currentStage ? 'text-green-700' : 'text-gray-400'}`}
          >
            {stage}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
