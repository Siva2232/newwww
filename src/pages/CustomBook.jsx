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
  "Wedding Album",
  "Family Memory Book",
  "Baby Album",
  "Travel Photo Book",
  "Anniversary Edition",
  "Year in Review",
  "Custom Theme",
];

export default function CustomBook() {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bookType, setBookType] = useState(bookTypes[0]);
  const [pages, setPages] = useState("40");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name.trim() || !phone.trim()) return alert("Name and WhatsApp number are required!");
    }
    if (currentStep === 2) {
      if (files.length < 5) return alert("Please upload at least 5 photos to continue.");
    }
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleFilesAdd = (newFiles) => {
    const validFiles = newFiles.filter((f) => f.type.startsWith("image/"));
    if (files.length + validFiles.length > 50) return alert("Maximum 50 images allowed.");
    setFiles([...files, ...validFiles]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const submitEnquiry = () => {
    const text = encodeURIComponent(
      `Hi StudioMemories! ✨\n\nI'd like to create a custom photo book.\n\n` +
      `👤 Name: ${name}\n📱 Phone: ${phone}\n` +
      `${email.trim() ? `📧 Email: ${email}\n` : ""}` +
      `📖 Book Type: ${bookType}\n📄 Pages: ${pages}\n🖼️ Images: ${files.length}\n\n` +
      `💬 Message: ${message.trim() || "No additional requests"}\n\n` +
      `I'll attach the photos now. Excited for your design ideas! 🌟`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-slate-900 pb-20">
      {/* Hero Header with Cinematic Parallax Feel */}
<section className="relative h-[40vh] min-h-[300px] overflow-hidden bg-slate-950 flex items-center group">
      {/* Background Image with subtle zoom */}
      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        src="https://www.pikperfect.com/assets/images/towebp/3.1_professional_wedding_album/professional-wedding-album.jpg"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        alt="Custom Photo Book"
      />
      
      {/* Sleek Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="h-[2px] w-8 bg-amber-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">
              Premium Customization
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black text-white leading-[1.1] uppercase italic tracking-tighter"
          >
            Create Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Legacy Book
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-slate-300 text-sm font-medium max-w-sm leading-relaxed"
          >
            Professional design. Handcrafted quality. 
            Ready in 3 simple steps.
          </motion.p>
        </div>
      </div>

      {/* Modern Scroll Indicator (Optional) */}
      <div className="absolute bottom-6 right-10 hidden md:flex items-center gap-4">
         <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Scroll for details</span>
         <div className="w-[1px] h-12 bg-gradient-to-b from-amber-500 to-transparent" />
      </div>
    </section>
      {/* Main Form Area */}
      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10">
        {/* Floating Progress Tracker */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-4 shadow-2xl shadow-slate-200/50 mb-10 border border-white flex items-center justify-around max-w-3xl mx-auto">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500 ${
                currentStep >= step ? "bg-slate-900 text-amber-400 scale-110" : "bg-slate-100 text-slate-400"
              }`}>
                {currentStep > step ? <Check size={20} /> : step}
              </div>
              <span className={`hidden md:block text-[10px] font-black uppercase tracking-widest ${
                currentStep >= step ? "text-slate-900" : "text-slate-300"
              }`}>
                {step === 1 ? "Basics" : step === 2 ? "Upload" : "Finish"}
              </span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-50 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="p-8 md:p-16"
            >
              {/* Header inside Form */}
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic">
                  {currentStep === 1 && "The Blueprint"}
                  {currentStep === 2 && "The Gallery"}
                  {currentStep === 3 && "Final Review"}
                </h2>
                <div className="h-1 w-12 bg-amber-500 mx-auto mt-2 rounded-full" />
              </div>

              {/* STEP 1: PREFERENCES */}
              {currentStep === 1 && (
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <InputField label="Full Name" icon={User} value={name} onChange={setName} placeholder="Your name" />
                    <InputField label="WhatsApp Number" icon={Phone} value={phone} onChange={setPhone} placeholder="+91" />
                    <InputField label="Email Address" icon={Mail} value={email} onChange={setEmail} placeholder="Optional" />
                  </div>
                  <div className="space-y-6">
                    <SelectField label="Album Type" icon={Layers} value={bookType} onChange={setBookType} options={bookTypes} />
                    <SelectField label="Page Count" icon={BookOpen} value={pages} onChange={setPages} options={["20 pages", "40 pages", "60 pages", "100+ pages"]} />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        <MessageSquare size={12}/> Notes & Theme
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-slate-50 rounded-2xl p-5 border-none focus:ring-2 focus:ring-amber-500/20 text-sm font-medium h-24 transition-all"
                        placeholder="E.g., Vintage gold accents, floral theme..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: UPLOAD */}
              {currentStep === 2 && (
                <div className="max-w-4xl mx-auto">
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFilesAdd(Array.from(e.dataTransfer.files)); }}
                    className={`border-2 border-dashed rounded-[3rem] p-12 text-center transition-all cursor-pointer ${
                      dragActive ? "border-amber-500 bg-amber-50/50" : "border-slate-200 bg-slate-50 hover:bg-slate-100/50"
                    }`}
                  >
                    <input type="file" multiple accept="image/*" onChange={(e) => handleFilesAdd(Array.from(e.target.files))} className="hidden" id="file-up" />
                    <label htmlFor="file-up" className="cursor-pointer">
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6 text-amber-500">
                        <Camera size={32} strokeWidth={2.5}/>
                      </div>
                      <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">Drag & Drop Your Memories</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">JPG, PNG up to 50 files</p>
                    </label>
                  </div>

                  {previews.length > 0 && (
                    <div className="mt-12 space-y-4">
                      <div className="flex items-center justify-between px-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{previews.length} Selection(s)</span>
                        <button onClick={() => {setFiles([]); setPreviews([]);}} className="text-[10px] font-black text-rose-500 uppercase hover:underline">Clear All</button>
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {previews.map((url, i) => (
                          <div key={i} className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                            <img src={url} className="w-full h-full object-cover" alt="prev" />
                            <button onClick={() => removeImage(i)} className="absolute inset-0 bg-rose-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                              <X size={16}/>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: REVIEW */}
              {currentStep === 3 && (
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="bg-amber-50 rounded-[2.5rem] p-8 text-center border border-amber-100 shadow-inner">
                    <Sparkles size={48} className="text-amber-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-black tracking-tighter uppercase italic mb-2">Ready to Build!</h3>
                    <p className="text-sm font-medium text-slate-600">Your custom blueprint is ready. Our designers will review your selection and reach out on WhatsApp with a draft.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <ReviewCard label="Album" value={bookType} icon={Layers} />
                    <ReviewCard label="Pages" value={pages} icon={BookOpen} />
                    <ReviewCard label="Photos" value={`${files.length} Selected`} icon={ImageIcon} />
                    <ReviewCard label="User" value={name} icon={User} />
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="mt-16 flex items-center justify-between border-t border-slate-50 pt-10">
                <button
                  onClick={handleBack}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    currentStep === 1 ? "opacity-0 pointer-events-none" : "text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <ChevronLeft size={16}/> Previous
                </button>

                <button
                  onClick={currentStep === 3 ? submitEnquiry : handleNext}
                  className={`flex items-center gap-4 px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl ${
                    currentStep === 3 
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200" 
                    : "bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 shadow-slate-200"
                  }`}
                >
                  {currentStep === 3 ? (
                    <>
                      <WhatsAppIcon size={20} /> Confirm via WhatsApp
                    </>
                  ) : (
                    <>
                      Next Stage <ChevronRight size={18}/>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Subcomponents for Cleanliness
const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
      <Icon size={12}/> {label}
    </label>
    <input {...props} className="w-full bg-slate-50 rounded-2xl px-6 py-4 border-none focus:ring-2 focus:ring-amber-500/20 text-sm font-bold transition-all" />
  </div>
);

const SelectField = ({ label, icon: Icon, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
      <Icon size={12}/> {label}
    </label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 rounded-2xl px-6 py-4 border-none focus:ring-2 focus:ring-amber-500/20 text-sm font-bold transition-all appearance-none">
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

const ReviewCard = ({ label, value, icon: Icon }) => (
  <div className="bg-slate-50 p-6 rounded-3xl flex items-center gap-4 border border-slate-100 shadow-sm">
    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
      <Icon size={18}/>
    </div>
    <div>
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-black text-slate-900 uppercase truncate max-w-[120px]">{value}</p>
    </div>
  </div>
);