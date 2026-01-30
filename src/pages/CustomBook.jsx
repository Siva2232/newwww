// src/pages/CustomBook.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, X, ChevronRight, ChevronLeft, Check, 
  Sparkles, Camera, BookOpen, User, Phone, 
  Mail, Layers, MessageSquare, Image as ImageIcon 
} from "lucide-react";

const whatsappNumber = "9746683778";

const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
  </svg>
);

const bookTypes = [
  "Wedding Album", "Family Memory Book", "Baby Album", 
  "Travel Photo Book", "Anniversary Edition", "Custom Theme",
];

export default function CustomBook() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", 
    bookType: bookTypes[0], pages: "40", message: ""
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.phone.trim()) return alert("Basic details required.");
    }
    if (currentStep === 2 && files.length < 5) return alert("Upload at least 5 photos.");
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleFilesAdd = (newFiles) => {
    const validFiles = newFiles.filter(f => f.type.startsWith("image/"));
    if (files.length + validFiles.length > 50) return alert("Max 50 images.");
    setFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const submitEnquiry = () => {
    const text = encodeURIComponent(
      `✨ New Custom Book Inquiry ✨\n\n` +
      `👤 Name: ${formData.name}\n📱 WhatsApp: ${formData.phone}\n` +
      `📖 Type: ${formData.bookType}\n📄 Pages: ${formData.pages}\n🖼️ Photos: ${files.length}\n` +
      `💬 Notes: ${formData.message || "None"}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-950 pb-20 selection:bg-amber-100">
      {/* HERO SECTION */}
      <section className="relative h-[45vh] min-h-[400px] bg-slate-950 flex items-center overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1544365390-34f40776b7e6?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/80 to-[#FDFCFB]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <span className="text-amber-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Handcrafted Legacies</span>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
              Design Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Masterpiece</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* STEPPER & FORM CONTAINER */}
      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-20">
        {/* FLOATING STEPPER */}
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-full p-2 shadow-2xl shadow-slate-200/50 mb-12 flex justify-between items-center max-w-2xl mx-auto">
          {[1, 2, 3].map(step => (
            <div key={step} className="flex items-center gap-3 px-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                currentStep >= step ? "bg-slate-950 text-amber-400 scale-110 shadow-lg shadow-amber-500/20" : "bg-slate-100 text-slate-400"
              }`}>
                {currentStep > step ? <Check size={14} /> : step}
              </div>
              <span className={`hidden sm:block text-[9px] font-black uppercase tracking-widest ${currentStep >= step ? "text-slate-900" : "text-slate-300"}`}>
                {step === 1 ? "Details" : step === 2 ? "Gallery" : "Confirm"}
              </span>
            </div>
          ))}
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white rounded-[4rem] shadow-[0_80px_100px_-30px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-10 md:p-20 flex-1"
            >
              {currentStep === 1 && (
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Personal <br/> Blueprint</h2>
                    <InputField label="Name" icon={User} placeholder="Full Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                    <InputField label="WhatsApp" icon={Phone} placeholder="+91" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                  </div>
                  <div className="space-y-6 pt-2">
                    <SelectField label="Album Type" icon={Layers} options={bookTypes} value={formData.bookType} onChange={v => setFormData({...formData, bookType: v})} />
                    <SelectField label="Capacity" icon={BookOpen} options={["20 Pages", "40 Pages", "60 Pages"]} value={formData.pages} onChange={v => setFormData({...formData, pages: v})} />
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><MessageSquare size={12}/> Vision & Notes</label>
                      <textarea className="w-full bg-slate-50 rounded-3xl p-6 text-sm font-medium h-32 focus:ring-2 focus:ring-amber-500/10 border-none" placeholder="Color preferences, themes..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-10">
                  <div className="text-center max-w-md mx-auto">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Media Library</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Upload 5-50 High-Resolution Photos</p>
                  </div>
                  
                  <div 
                    onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={e => { e.preventDefault(); setDragActive(false); handleFilesAdd(Array.from(e.dataTransfer.files)); }}
                    className={`border-2 border-dashed rounded-[3rem] p-16 text-center transition-all ${dragActive ? "border-amber-500 bg-amber-50/30" : "border-slate-100 bg-slate-50"}`}
                  >
                    <input type="file" multiple hidden id="f-upload" onChange={e => handleFilesAdd(Array.from(e.target.files))} />
                    <label htmlFor="f-upload" className="cursor-pointer group">
                      <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Camera className="text-amber-500" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest block">Choose from device</span>
                    </label>
                  </div>

                  {previews.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2 mt-10">
                      {previews.map((url, i) => (
                        <div key={i} className="group relative aspect-square rounded-xl overflow-hidden shadow-md">
                          <img src={url} className="w-full h-full object-cover" />
                          <button onClick={() => removeImage(i)} className="absolute inset-0 bg-rose-500/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><X size={14}/></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="max-w-2xl mx-auto space-y-12">
                   <div className="text-center">
                    <Sparkles size={40} className="text-amber-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Final Curation</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ReviewCard icon={User} label="Client" value={formData.name} />
                    <ReviewCard icon={Layers} label="Style" value={formData.bookType} />
                    <ReviewCard icon={BookOpen} label="Format" value={formData.pages} />
                    <ReviewCard icon={ImageIcon} label="Gallery" value={`${files.length} Photos`} />
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Note to Designer</p>
                    <p className="text-sm font-medium italic">"{formData.message || "Ready for design review."}"</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* FOOTER ACTIONS */}
          <div className="px-10 md:px-20 py-10 border-t border-slate-50 flex items-center justify-between bg-white">
            <button 
              onClick={() => setCurrentStep(s => s - 1)}
              className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${currentStep === 1 ? "opacity-0" : "text-slate-400 hover:text-slate-950"}`}
            >
              <ChevronLeft size={16}/> Back
            </button>
            
            <button 
              onClick={currentStep === 3 ? submitEnquiry : handleNext}
              className={`flex items-center gap-4 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl ${
                currentStep === 3 ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-slate-950 text-white shadow-slate-200"
              }`}
            >
              {currentStep === 3 ? <><WhatsAppIcon size={18}/> Send Inquiry</> : <>Next Phase <ChevronRight size={16}/></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-3">
    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Icon size={12}/> {label}</label>
    <input {...props} onChange={e => props.onChange(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all" />
  </div>
);

const SelectField = ({ label, icon: Icon, options, value, onChange }) => (
  <div className="space-y-3">
    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Icon size={12}/> {label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 appearance-none">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const ReviewCard = ({ icon: Icon, label, value }) => (
  <div className="bg-slate-50 p-6 rounded-3xl flex items-center gap-5 border border-slate-100 shadow-sm">
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm"><Icon size={20}/></div>
    <div>
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-black uppercase tracking-tight">{value}</p>
    </div>
  </div>
);