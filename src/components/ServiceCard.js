import React from 'react';
import { BookOpen } from 'lucide-react';

const ServiceCard = ({ service, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">{service.price} RON</span>
          <span className="text-sm text-gray-500">{service.duration}</span>
        </div>
        <button 
          onClick={() => onSelect(service.id)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          Selectează Serviciul
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;