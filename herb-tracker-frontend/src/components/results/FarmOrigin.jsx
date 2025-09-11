import React from 'react';
import { Leaf, MapPin, Calendar } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div>
    <p className="text-sm text-gray-600 flex items-center">
      <Icon className="w-4 h-4 mr-2 text-gray-400" />
      {label}
    </p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

const FarmOrigin = ({ batch }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Leaf className="w-5 h-5 text-green-600 mr-2" />
        Farm Origin
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailItem icon={MapPin} label="Location" value={batch.farmLocation} />
        <DetailItem icon={MapPin} label="Coordinates" value={batch.gpsCoordinates} />
        <DetailItem icon={Calendar} label="Planted" value={formatDate(batch.plantingDate)} />
        <DetailItem icon={Calendar} label="Harvested" value={formatDate(batch.harvestDate)} />
        <DetailItem icon={Leaf} label="Soil Condition" value={batch.soilCondition} />
        <DetailItem icon={Leaf} label="Quantity" value={`${batch.quantity}g`} />
      </div>
    </div>
  );
};

export default FarmOrigin;
