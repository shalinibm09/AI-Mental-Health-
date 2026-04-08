import React from 'react';
import { Wind, Anchor, Brain, Moon, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface Exercise {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: string[];
  time: string;
}

const EXERCISES: Exercise[] = [
  {
    id: 'breathing',
    title: '4-4-6 Breathing',
    icon: <Wind size={18} />,
    description: 'Slow down your heart rate and calm your nervous system.',
    steps: [
      'Inhale slowly for 4 seconds.',
      'Hold your breath for 4 seconds.',
      'Exhale slowly for 6 seconds.',
      'Repeat 5 times.'
    ],
    time: '3 min'
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding',
    icon: <Anchor size={18} />,
    description: 'Reconnect with the present moment using your senses.',
    steps: [
      'Acknowledge 5 things you see.',
      'Acknowledge 4 things you can touch.',
      'Acknowledge 3 things you hear.',
      'Acknowledge 2 things you can smell.',
      'Acknowledge 1 thing you can taste.'
    ],
    time: '5 min'
  },
  {
    id: 'reframing',
    title: 'Thought Reframing',
    icon: <Brain size={18} />,
    description: 'Challenge negative thought patterns.',
    steps: [
      'Identify the negative thought.',
      'Ask: "Is there evidence this is 100% true?"',
      'Ask: "What would I tell a friend in this situation?"',
      'Write a more balanced version of the thought.'
    ],
    time: '10 min'
  }
];

export const CopingTools: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] uppercase tracking-wider font-bold text-stone-400 px-2">Quick Coping Tools</h3>
      <div className="space-y-3">
        {EXERCISES.map((ex) => (
          <div 
            key={ex.id}
            className="group bg-white border border-stone-100 p-4 rounded-2xl hover:border-stone-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-stone-50 rounded-lg text-stone-600 group-hover:bg-stone-800 group-hover:text-white transition-colors">
                {ex.icon}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-stone-800">{ex.title}</h4>
                <span className="text-[10px] text-stone-400">{ex.time}</span>
              </div>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed mb-3">
              {ex.description}
            </p>
            <ul className="space-y-1.5">
              {ex.steps.map((step, i) => (
                <li key={i} className="text-[11px] text-stone-600 flex gap-2">
                  <span className="text-stone-300 font-mono">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
