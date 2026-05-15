'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, Download, Share2, Loader2, ArrowRight, Mail, Phone, User, Home, MoveHorizontal } from 'lucide-react';

const QUOTE_URL = 'https://phantomsound.com/start-a-project/';

export default function HomeLightingVisualizer() {
  const [step, setStep] = useState('landing');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const sliderRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target.result);
      setStep('form');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target.result);
      setStep('form');
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Required';
    if (!formData.email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Please enter a valid email';
    if (!formData.phone.trim()) errs.phone = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setStep('processing');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Generation failed');
      setGeneratedImage(data.generatedImage);
      setStep('result');
    } catch (err) {
      console.error(err);
      alert('Something went wrong generating your image. Please try again.');
      setStep('form');
    }
  };

  const handleSliderMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pos)));
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      handleSliderMove(clientX);
    };
    const handleUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchend', handleUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging]);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'my-home-illuminated.jpg';
    link.click();
  };

  const shareImage = async () => {
    if (navigator.share) {
      try {
        const res = await fetch(generatedImage);
        const blob = await res.blob();
        const file = new File([blob], 'my-home-illuminated.jpg', { type: 'image/jpeg' });
        await navigator.share({
          title: 'My home, illuminated by Phantom',
          text: 'Check out what my home could look like at night with professional landscape lighting!',
          files: [file],
        });
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    } else {
      alert('Sharing not supported on this browser. Tap Download to save the image and share it manually.');
    }
  };

  const reset = () => {
    setStep('landing');
    setUploadedImage(null);
    setGeneratedImage(null);
    setFormData({ name: '', email: '', phone: '' });
    setErrors({});
    setSliderPos(50);
  };

  return (
    <div className="min-h-screen w-full" style={{
      background: 'radial-gradient(ellipse at top, #0f1a2e 0%, #050a14 50%, #02060d 100%)',
      fontFamily: "'Cormorant Garamond', Georgia, serif"
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        .sans { font-family: 'Inter', sans-serif; }
        .gold-text {
          background: linear-gradient(135deg, #f4d27a 0%, #e8b95c 50%, #c9933a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glow {
          box-shadow: 0 0 60px rgba(244, 210, 122, 0.15), 0 0 120px rgba(244, 210, 122, 0.08);
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .shimmer { animation: shimmer 3s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .float { animation: float 4s ease-in-out infinite; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.8s ease-out forwards; }
        .stars::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(1px 1px at 20% 30%, white, transparent),
            radial-gradient(1px 1px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 80% 20%, white, transparent),
            radial-gradient(1px 1px at 40% 80%, white, transparent),
            radial-gradient(2px 2px at 90% 50%, rgba(255,255,255,0.6), transparent);
          background-size: 200px 200px;
          opacity: 0.4;
          pointer-events: none;
        }
      `}</style>

      <header className="relative z-20 w-full px-6 py-5 md:px-10 md:py-6 flex items-center justify-between">
        <a href="https://phantomsound.com" target="_blank" rel="noopener noreferrer" className="block">
          <img src="/phantom-logo.png" alt="Phantom" className="h-7 md:h-9 w-auto" />
        </a>
        <a href={QUOTE_URL} target="_blank" rel="noopener noreferrer" className="sans hidden md:inline-block text-xs tracking-[0.2em] uppercase text-amber-200/70 hover:text-amber-200 transition-colors">
          Start a Project →
        </a>
      </header>

      {step === 'landing' && (
        <div className="relative stars overflow-hidden">
          <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
            <div className="fade-up text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-200/20 mb-8 sans text-xs tracking-[0.2em] uppercase text-amber-100/70">
                <Sparkles className="w-3 h-3" /> AI Lighting Preview
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[0.95] mb-6">
                See your home<br />
                <span className="italic gold-text">illuminated</span>
              </h1>
              <p className="sans text-lg md:text-xl text-slate-300/80 max-w-2xl mx-auto mb-12 font-light">
                Upload a daytime photo of your home. We'll show you exactly how it could look at night with professional landscape lighting — facade washes, path lights, and architectural accents.
              </p>
              <button
                onClick={() => setStep('upload')}
                className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-br from-amber-200 to-amber-500 text-slate-900 sans font-medium tracking-wide rounded-sm glow hover:scale-[1.02] transition-transform"
              >
                Begin Your Preview
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="sans text-xs text-slate-400/60 mt-6 tracking-wider uppercase">Free · Takes under a minute</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-24">
              {[
                { num: '01', title: 'Upload', desc: 'Snap or upload a daytime photo of your home from any device.' },
                { num: '02', title: 'Transform', desc: 'Our AI renders a photorealistic nighttime version with custom lighting.' },
                { num: '03', title: 'Compare', desc: 'Slide between before and after. Share with friends or request a quote.' }
              ].map((item, i) => (
                <div key={i} className="fade-up" style={{ animationDelay: `${0.2 * (i + 1)}s`, opacity: 0 }}>
                  <div className="gold-text text-2xl font-light mb-3">{item.num}</div>
                  <h3 className="text-2xl text-white mb-2 font-light">{item.title}</h3>
                  <p className="sans text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'upload' && (
        <div className="flex items-center justify-center px-6 py-12 min-h-[calc(100vh-100px)]">
          <div className="max-w-2xl w-full fade-up">
            <div className="text-center mb-10">
              <p className="sans text-xs tracking-[0.3em] uppercase text-amber-200/60 mb-4">Step One</p>
              <h2 className="text-4xl md:text-5xl text-white font-light mb-3">
                Show us <span className="italic gold-text">your home</span>
              </h2>
              <p className="sans text-slate-400">A clear, well-framed daytime photo works best.</p>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="relative border border-amber-200/20 hover:border-amber-200/50 rounded-sm p-16 text-center cursor-pointer transition-all bg-slate-900/30 backdrop-blur group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="float">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-amber-200/30 flex items-center justify-center group-hover:border-amber-200/60 transition-all">
                  <Upload className="w-6 h-6 text-amber-200/80" />
                </div>
              </div>
              <p className="text-white text-xl font-light mb-2">Drop your photo here</p>
              <p className="sans text-sm text-slate-400">or click to browse · JPG, PNG, HEIC</p>
            </div>

            <button onClick={() => setStep('landing')} className="sans text-sm text-slate-500 hover:text-slate-300 mt-8 mx-auto block transition-colors">
              ← Back
            </button>
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="flex items-center justify-center px-6 py-12 min-h-[calc(100vh-100px)]">
          <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center fade-up">
            <div className="relative">
              <img src={uploadedImage} alt="Your home" className="w-full rounded-sm shadow-2xl" />
              <div className="absolute -bottom-3 -right-3 px-3 py-1 bg-amber-200 text-slate-900 sans text-xs tracking-wider uppercase">Your photo</div>
            </div>

            <div>
              <p className="sans text-xs tracking-[0.3em] uppercase text-amber-200/60 mb-4">Step Two</p>
              <h2 className="text-3xl md:text-4xl text-white font-light mb-2">
                Where should we<br /><span className="italic gold-text">send the preview?</span>
              </h2>
              <p className="sans text-sm text-slate-400 mb-8">We'll generate your nighttime image and send a copy you can save and share.</p>

              <div className="space-y-5">
                <Field icon={<User className="w-4 h-4" />} label="Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} error={errors.name} />
                <Field icon={<Mail className="w-4 h-4" />} label="Email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} error={errors.email} />
                <Field icon={<Phone className="w-4 h-4" />} label="Phone" type="tel" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} error={errors.phone} />
              </div>

              <button
                onClick={handleSubmit}
                className="group w-full mt-8 inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-br from-amber-200 to-amber-500 text-slate-900 sans font-medium tracking-wide rounded-sm hover:scale-[1.01] transition-transform"
              >
                Generate My Preview
                <Sparkles className="w-4 h-4" />
              </button>
              <p className="sans text-xs text-slate-500 mt-3 text-center">By submitting you agree to be contacted about your project.</p>
            </div>
          </div>
        </div>
      )}

      {step === 'processing' && (
        <div className="flex items-center justify-center px-6 min-h-[calc(100vh-100px)]">
          <div className="text-center fade-up">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border border-amber-200/20"></div>
              <Loader2 className="w-24 h-24 text-amber-200 animate-spin" strokeWidth={1} />
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-amber-200 shimmer" />
            </div>
            <h2 className="text-4xl text-white font-light mb-3">
              Lighting <span className="italic gold-text">your home</span>
            </h2>
            <p className="sans text-slate-400 max-w-md mx-auto">
              Our AI is placing uplights along the facade, path lighting through your landscape, and a deep evening sky. This takes about 25 seconds.
            </p>
          </div>
        </div>
      )}

      {step === 'result' && (
        <div className="px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto fade-up">
            <div className="text-center mb-10">
              <p className="sans text-xs tracking-[0.3em] uppercase text-amber-200/60 mb-4">Your Preview</p>
              <h2 className="text-4xl md:text-5xl text-white font-light mb-3">
                Your home, <span className="italic gold-text">illuminated</span>
              </h2>
              <p className="sans text-slate-400 inline-flex items-center gap-2">
                <MoveHorizontal className="w-4 h-4" /> Drag the handle to compare
              </p>
            </div>

            <div
              ref={sliderRef}
              className="relative w-full rounded-sm overflow-hidden shadow-2xl glow select-none"
              style={{ aspectRatio: '4/3', cursor: isDragging ? 'grabbing' : 'default' }}
            >
              <img src={uploadedImage} alt="Daytime" className="absolute inset-0 w-full h-full object-cover" draggable={false} />

              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
                <img src={generatedImage} alt="Nighttime" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
              </div>

              <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-slate-900 sans text-xs tracking-wider uppercase rounded-sm">Before</div>
              <div className="absolute top-4 right-4 px-3 py-1 bg-amber-200 text-slate-900 sans text-xs tracking-wider uppercase rounded-sm">After</div>

              <div className="absolute top-0 bottom-0 w-0.5 bg-amber-200 pointer-events-none" style={{ left: `${sliderPos}%` }}>
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-200 shadow-2xl flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
                  onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onTouchStart={() => { setIsDragging(true); }}
                  style={{ boxShadow: '0 0 30px rgba(244, 210, 122, 0.6)' }}
                >
                  <MoveHorizontal className="w-5 h-5 text-slate-900" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mt-10">
              <button onClick={downloadImage} className="sans inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-amber-200 to-amber-500 text-slate-900 font-medium rounded-sm hover:scale-[1.02] transition-transform">
                <Download className="w-4 h-4" /> Download
              </button>
              <button onClick={shareImage} className="sans inline-flex items-center gap-2 px-6 py-3 border border-amber-200/40 text-amber-200 font-medium rounded-sm hover:bg-amber-200/10 transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <a href={QUOTE_URL} target="_blank" rel="noopener noreferrer" className="sans inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-medium rounded-sm hover:bg-slate-100 transition-colors">
                <Home className="w-4 h-4" /> Request a Real Quote
              </a>
            </div>

            <button onClick={reset} className="sans text-sm text-slate-500 hover:text-slate-300 mt-10 mx-auto block transition-colors">
              Try another photo →
            </button>
          </div>
        </div>
      )}

      <footer className="relative z-10 w-full px-6 py-8 text-center">
        <p className="sans text-xs tracking-[0.2em] uppercase text-slate-500/60">
          AI Lighting Preview · powered by <a href="https://phantomsound.com" target="_blank" rel="noopener noreferrer" className="text-amber-200/70 hover:text-amber-200 transition-colors">Phantom</a>
        </p>
      </footer>
    </div>
  );
}

function Field({ icon, label, value, onChange, type = 'text', error }) {
  return (
    <div>
      <label className="sans text-xs tracking-[0.2em] uppercase text-slate-400 mb-2 flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`sans w-full bg-slate-900/40 border-b ${error ? 'border-red-400/60' : 'border-amber-200/20 focus:border-amber-200/60'} text-white px-0 py-2 outline-none transition-colors`}
      />
      {error && <p className="sans text-xs text-red-400/80 mt-1">{error}</p>}
    </div>
  );
}
