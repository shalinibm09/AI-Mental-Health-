import React, { useState } from 'react';
import { UserMetadata } from '../services/geminiService';
import { X, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface MetadataFormProps {
  onSubmit: (metadata: UserMetadata) => void;
  onClose: () => void;
}

export const MetadataForm: React.FC<MetadataFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<UserMetadata>({
    location: '',
    ageBracket: '',
    preferredLanguage: 'English',
    priorDiagnoses: '',
    medications: '',
    environment: 'Alone',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-stone-50 px-6 py-4 border-bottom border-stone-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Info size={18} className="text-stone-400" />
            <h2 className="font-semibold text-stone-800">Personalize Your Support</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-stone-500 text-xs leading-relaxed">
            Providing a little context helps me offer more relevant resources and coping strategies. This information is only used for this session.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Location (Country)</label>
              <input
                type="text"
                placeholder="e.g. USA"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Age Bracket</label>
              <select
                className="w-full px-3 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
                value={formData.ageBracket}
                onChange={(e) => setFormData({ ...formData, ageBracket: e.target.value })}
              >
                <option value="">Select...</option>
                <option value="Under 18">Under 18</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-50">35-50</option>
                <option value="50+">50+</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Immediate Environment</label>
            <div className="flex gap-2">
              {['Alone', 'With others', 'In public'].map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => setFormData({ ...formData, environment: env })}
                  className={cn(
                    "flex-1 py-2 text-xs rounded-xl border transition-all",
                    formData.environment === env 
                      ? "bg-stone-800 text-white border-stone-800" 
                      : "bg-white text-stone-600 border-stone-100 hover:bg-stone-50"
                  )}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Prior Diagnoses (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Anxiety, Depression"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-200"
              value={formData.priorDiagnoses}
              onChange={(e) => setFormData({ ...formData, priorDiagnoses: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-stone-800 text-white py-3 rounded-xl font-medium hover:bg-stone-900 transition-colors mt-4"
          >
            Start Conversation
          </button>
        </form>
      </div>
    </div>
  );
};
