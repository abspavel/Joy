const fs = require('fs');
let code = fs.readFileSync('src/sections/SkillsCertificationsSection.tsx', 'utf8');

const modalStart = code.indexOf('{/* Lightbox Modal */}');
if (modalStart !== -1) {
  const newModal = `{/* Lightbox Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in-up"
          style={{ animationDuration: '0.2s' }}
          onClick={() => setSelectedCert(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-amber-400 transition-colors z-[101] bg-white/10 hover:bg-white/20 p-2.5 rounded-full border border-white/20 shadow-2xl cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCert(null);
            }}
            aria-label="Close modal"
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
          <img decoding="async" 
            src={selectedCert}
            alt="Certificate Preview"
            className="max-w-[92vw] max-h-[85vh] object-contain rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/20 animate-badge-in"
            style={{ animationDuration: '0.3s' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}`;
  code = code.substring(0, modalStart) + newModal;
  fs.writeFileSync('src/sections/SkillsCertificationsSection.tsx', code);
}
