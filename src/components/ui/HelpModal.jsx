import { useEffect, useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { trackerHelpContent } from '../../data/trackerHelpContent';

export default function HelpModal({ isOpen, onClose, initialTab = 'threatDie' }) {
  const tabs = [
    { id: 'threatDie', label: 'Threat Die', icon: '⚠' },
    { id: 'missionTracks', label: 'Mission Tracks', icon: '★' },
    { id: 'dangerClocks', label: 'Danger Clocks', icon: '⏰' }
  ];

  const [activeTab, setActiveTab] = useState(initialTab);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const content = trackerHelpContent[activeTab];

  const getSectionIcon = (type) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-accent-red" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-accent-cyan" />;
      default:
        return <Info className="w-5 h-5 text-accent-yellow" />;
    }
  };

  const getSectionBorderColor = (type) => {
    switch (type) {
      case 'danger':
        return 'border-accent-red';
      case 'success':
        return 'border-accent-cyan';
      default:
        return 'border-accent-yellow';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-[420px] h-full bg-bg-primary border-l-3 border-accent-cyan flex flex-col slide-in-right shadow-2xl">
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none scanlines opacity-30" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b-3 border-accent-cyan bg-bg-secondary">
          <h2 className="font-orbitron font-bold text-xl text-accent-cyan uppercase">
            Game Help
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent-cyan hover:text-bg-primary transition-all duration-200 border-2 border-accent-cyan"
            aria-label="Close help"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="relative z-10 flex border-b-3 border-accent-cyan bg-bg-secondary">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-3 font-orbitron text-xs uppercase transition-all duration-200 border-r-2 last:border-r-0 ${
                activeTab === tab.id
                  ? 'bg-accent-cyan text-bg-primary font-bold'
                  : 'bg-transparent text-text-primary hover:bg-accent-cyan/20 border-accent-cyan'
              }`}
            >
              <span className="block text-lg mb-1">{tab.icon}</span>
              <span className="block leading-tight">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title and Description */}
          <div>
            <h3 className="font-orbitron font-bold text-2xl text-accent-yellow mb-3">
              {content.title}
            </h3>
            <p className="text-text-primary leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Sections */}
          {content.sections.map((section, idx) => (
            <div
              key={idx}
              className={`border-3 ${getSectionBorderColor(section.type)} p-4 space-y-3 bg-bg-secondary/50`}
            >
              <div className="flex items-start gap-3">
                {getSectionIcon(section.type)}
                <h4 className="font-orbitron font-bold text-lg text-accent-cyan uppercase flex-1">
                  {section.heading}
                </h4>
              </div>

              {section.content && (
                <p className="text-text-primary leading-relaxed pl-8">
                  {section.content}
                </p>
              )}

              {section.items && (
                <ul className="space-y-2 pl-8">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-text-primary leading-relaxed flex items-start gap-2">
                      <span className="text-accent-yellow mt-1">•</span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.examples && (
                <div className="space-y-3 pl-8">
                  {section.examples.map((example, exIdx) => (
                    <div key={exIdx} className="text-text-primary">
                      {example.type && (
                        <span className="font-orbitron font-bold text-accent-yellow">
                          {example.type}:{' '}
                        </span>
                      )}
                      {example.segments && (
                        <span className="font-orbitron font-bold text-accent-red">
                          {example.segments} Segments:{' '}
                        </span>
                      )}
                      <span className="text-gray-300">{example.description}</span>
                    </div>
                  ))}
                </div>
              )}

              {section.note && (
                <div className="pl-8 pt-2 border-t-2 border-accent-yellow/30 mt-3">
                  <p className="text-accent-yellow italic text-sm leading-relaxed">
                    {section.note}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="relative z-10 px-6 py-3 border-t-3 border-accent-cyan bg-bg-secondary text-center">
          <p className="text-gray-500 text-xs font-orbitron uppercase">
            Press <span className="text-accent-cyan">ESC</span> to close
          </p>
        </div>
      </div>
    </div>
  );
}
