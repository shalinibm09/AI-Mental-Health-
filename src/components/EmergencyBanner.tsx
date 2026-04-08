import React from 'react';
import { AlertTriangle, Phone, ShieldAlert } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg animate-pulse">
      <div className="flex items-start gap-3">
        <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="text-red-800 font-semibold text-sm">Immediate Help Needed?</h3>
          <p className="text-red-700 text-xs mt-1 leading-relaxed">
            If you are in immediate danger of harming yourself or others, please call emergency services (911 in the US) or go to the nearest emergency room.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a 
              href="tel:988" 
              className="inline-flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-red-700 transition-colors"
            >
              <Phone size={12} /> Call 988 (Suicide & Crisis Lifeline)
            </a>
            <button className="text-red-600 text-xs font-medium hover:underline">
              View more resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
