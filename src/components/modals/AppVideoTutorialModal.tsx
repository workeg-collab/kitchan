import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  X, 
  Sparkles, 
  Compass, 
  Box, 
  Ruler, 
  Palette, 
  Scissors, 
  Calculator, 
  Keyboard, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Video,
  Layers,
  HelpCircle,
  Eye,
  ShieldCheck,
  MousePointer,
  Radio,
  DoorOpen,
  Sliders,
  Grid,
  FileSpreadsheet
} from 'lucide-react';

interface TutorialChapter {
  id: string;
  title: string;
  duration: string;
  icon: React.ReactNode;
  color: string;
  spokenNarration: string; // النص العربي المشروح بصوت نسائي واضح
  description: string;
  keyPoints: string[];
  proTips: string[];
}

export const AppVideoTutorialModal: React.FC = () => {
  const { isVideoTutorialOpen, setIsVideoTutorialOpen } = useUIStore();

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);

  const chapters: TutorialChapter[] = [
    {
      id: 'drawing-2d',
      title: '1. المخطط الهندسي 2D والرسم الذكي',
      duration: '01:15',
      icon: <Compass size={18} className="text-blue-500" />,
      color: 'blue',
      spokenNarration: 'أهلاً بك في برنامج فرنتشر كاد برو. يمكنك في مساحة العمل ثنائية الأبعاد رسم الغرفة وتعديل المقاسات وسماكة الجدار. يتميز البرنامج بنظام مغناطيسي ذكي يقوم بمحاذاة الوحدات تلقائياً مع الجدران لمنع أي تداخل. كما يمكنك استخدام الزووم والتحريك وإظهار خطوط الأبعاد والمسافات بسهولة.',
      description: 'طريقة رسم وتعديل أبعاد الغرفة، استخدام المغناطيس الذكي Snap to Grid & Wall، وإظهار خطوط الأبعاد والمسافات.',
      keyPoints: [
        'انقر على أداة "الغرفة" أو زر القلم لتعديل أبعاد الجدران وسماكتها بدقة.',
        'المحاذاة المغناطيسية تمنع تداخل الوحدات وتلصقها بالجدار تلقائياً بمجرد الاقتراب.',
        'استخدم عجلة الماوس للزووم والزر الأيمن أو شريط الأدوات العائم للتحريك والتوسيط.'
      ],
      proTips: [
        'اختصار الكيبورد: اضغط على زر المسافة (Space) للتوسيط وملاءمة الشاشة.',
        'أيقونة المسطرة في الشريط العائم تُظهر وتخفي خطوط المقاسات والمسافات البينية بنقرة واحدة.'
      ]
    },
    {
      id: 'blocks-cabinets',
      title: '2. إضافة البلوكات وتعديل المقاسات',
      duration: '01:40',
      icon: <Box size={18} className="text-purple-500" />,
      color: 'purple',
      spokenNarration: 'لإضافة الوحدات، افتح درج الكتالوج الجانبي واختر الكابينة المناسبة سواء سفلية، علوية، أو دواليب طولية. عند تحديد أي وحدة تظهر لوحة الخصائص لتعديل العرض والارتفاع والعمق ومنسوب الارتفاع عن الأرض. يمكنك تدوير الكابينة تسعين درجة بالضغط على حرف آر، أو نسخها فوراً بالضغط على كنترول مع دي.',
      description: 'سحب وإفلات الوحدات والدواليب، تعديل العرض والارتفاع والعمق، التدوير 90°، والتكرار السريع.',
      keyPoints: [
        'افتح درج الكتالوج الجانبي واختر نوع الوحدة (سفلية / علوية / دواليب طولية / سرائر / تسريحات).',
        'انقر على أي كابينة لتظهر لوحة الخصائص المباشرة لتعديل العرض، الارتفاع، العمق، والمنسوب Z عن الأرض.',
        'أزرار الإجراءات السريعة: تدوير 90° بنقرة، نسخ وتكرار القطعة، أو حذفها.'
      ],
      proTips: [
        'اختصار تدوير الوحدة: اضغط حرف "R" على الكيبورد لتدوير الكابينة المحددة 90 درجة فوراً.',
        'اختصار التكرار السريع: اضغط "Ctrl + D" لنسخ الوحدة بنفس المقاسات والإعدادات.'
      ]
    },
    {
      id: '3d-camera',
      title: '3. المنظور 3D وزوايا الكاميرا وفتح الضلف',
      duration: '01:20',
      icon: <Eye size={18} className="text-amber-500" />,
      color: 'amber',
      spokenNarration: 'المنظور ثلاثي الأبعاد يعطيك تجربة واقعية مذهلة مع الإضاءة والظلال. يمكنك استخدام المساقط الهندسية السريعة مثل المسقط العلوي، الواجهة الأمامية، أو الأيزومترك. ولرؤية التقسيم الداخلي، اضغط على زر الباب ليتم فتح جميع الضلف والأدراج ثلاثية الأبعاد ومعاينة الأرفف الداخلية.',
      description: 'التجوال ثلاثي الأبعاد الواقعي، المساقط الهندسية (علوي / أمامي / أيزومترك)، ومعاينة فتح وإغلاق الأبواب.',
      keyPoints: [
        'التبديل بين 2D و 3D متاح دائماً من الشريط العائم في أعلى منتصف الشاشة.',
        'المساقط السريعة في الشريط العائم تتيح الانتقال بين (منظور حر، مسقط رأسي Top، واجهة أمامية Front، وأيزومترك هندسي Isometric).',
        'زر الباب 🚪 يفتح جميع ضلف الكبائن والأدراج والقلابات 3D لمعاينة الأرفف والتوزيع الداخلي.'
      ],
      proTips: [
        'انقر بالزر الأيسر واسحب لتدوير المشهد، وبالزر الأيمن للتحريك، وعجلة الماوس للتقريب.',
        'عند تحديد أي كابينة في 3D يظهر شريط تحكم عائم لرفع المنسوب أو ضبط العرض دون الحاجة للرجوع لـ 2D.'
      ]
    },
    {
      id: 'hidden-tools',
      title: '4. الأدوات المخفية وتوسيع مساحة الرسم 100%',
      duration: '00:55',
      icon: <Sparkles size={18} className="text-indigo-500" />,
      color: 'indigo',
      spokenNarration: 'للحصول على أقصى راحة أثناء العمل، يمكنك إخفاء درج الكتالوج الجانبي وتثبيته للاستمتاع بكامل مساحة الشاشة مائة بالمائة للرسم. كما أن لوحة الخصائص تختفي تلقائياً عند عدم تحديد أي عنصر. يوفر لك الشريط العلوي أزرار التراجع والإعادة والحفظ السحابي وتعديل اسم المشروع بنقرة واحدة.',
      description: 'كيف تخفي اللوحات الجانبية بضغطة زر وتستمتع بـ 100% من الشاشة للتصميم، وأهم الاختصارات.',
      keyPoints: [
        'زر الإخفاء ✕ أو زر التثبيت 📌 في درج الكتالوج يتيح إغلاق اللوحة الجانبية تماماً للحصول على أقصى مساحة رسم ممكنة.',
        'لوحة الخصائص اليمنى تختفي تلقائياً عند إلغاء تحديد العناصر لتفريغ مساحة العمل.',
        'أزرار التراجع والإعادة (Ctrl+Z / Ctrl+Y) وزر الحفظ السحابي السريع أعلى الشاشة.'
      ],
      proTips: [
        'انقر على اسم المشروع في الشريط العلوي لتعديله مباشرة بنقرة واحدة.',
        'زر تبديل وحدة القياس (سم / مم) يحول جميع الأرقام في البرنامج والمخططات فوراً.'
      ]
    },
    {
      id: 'materials-pricing',
      title: '5. تسعير الخامات (خشب / كلادينج) والمتر المربع لوش الوحدات',
      duration: '01:30',
      icon: <Calculator size={18} className="text-emerald-500" />,
      color: 'emerald',
      spokenNarration: 'في قسم الأسعار، يمكنك الاختيار بين المحاسبة بالمتر المربع لوش الوحدات بحساب العرض في الارتفاع بدون العمق، أو المحاسبة بالمتر الطولي. كما يمكنك تحديد نوع الخامة سواء خشب أو كلادينج ألوميتال أو خشمونيوم، ليتم ضبط أسعار المتر والمواصفات الفنية وطباعة عرض سعر رسمي وشامل للعميل.',
      description: 'حساب التكلفة بالمتر المربع لوش الوحدات (W × H بدون العمق) أو بالمتر الطولي مع اختيار نوع الخامة وتوليد عرض السعر.',
      keyPoints: [
        'التبديل بين المحاسبة بالمتر المربع لوش الوحدات (العرض × الارتفاع مع استبعاد العمق) أو بالمتر الطولي.',
        'اختيار خامة التصنيع (خشب إيجر، كلادينج ألوميتال Alubond، خشمونيوم، أكريليك) يضبط أسعار المتر والمواصفات الفنية تلقائياً.',
        'جدول تفصيلي يوضح مسطح واجهة كل وحدة، المتر الطولي، وتكلفتها الفردية مع زر طباعة عرض سعر رسمي.'
      ],
      proTips: [
        'يمكنك إضافة خامات جديدة وتعديل أسعار الألواح من زر "الخامات والإعدادات ⚙️".',
        'عرض السعر يذكر اسم الخامة والمواصفات الفنية المعتمدة للضلف والشاسيه والرخام تلقائياً.'
      ]
    },
    {
      id: 'cutting-manufacturing',
      title: '6. جداول التقطيع والـ BOM وتوزيع الألواح',
      duration: '01:10',
      icon: <Scissors size={18} className="text-rose-500" />,
      color: 'rose',
      spokenNarration: 'محرك التقطيع الآلي يقوم بحساب مقاسات جميع قطع الألواح من أجناب وقيعان ورفوف وضلف بعد خصم سماكة شريط الحرف. ويوفر لك خريطة توزيع الألواح لتقليل الهالك في الورشة، مع إمكانية تصدير كشوفات الإكسل وملفات الأوتوكاد دي إكس إف المتوافقة مع ماكينات السي إن سي.',
      description: 'استخراج تفصيل قص الألواح، أطوال القشاط، عدد الألواح المطلوبة، وتصدير ملفات PDF و Excel و DXF.',
      keyPoints: [
        'محرك التقطيع يحسب أبعاد كل جنب، قاع، سقف، رف، وضلفة بعد خصم الخلوصات وسماكة شريط الحرف.',
        'توزيع الألواح (Nesting) يوضح خريطة القص ونسبة الهالك لتقليل الفاقد في الورشة.',
        'تصدير كشوفات التقطيع بصيغة CSV أو PDF فني معتمد بضغطة زر واحدة.'
      ],
      proTips: [
        'يمكنك تعديل سماكة الألواح وطريقة التجميع (تجميع لطش أو نائم) من نافذة إعدادات التصنيع.',
        'ملفات الـ DXF المستخرجة متوافقة 100% مع ماكينات الـ CNC وبرامج الأوتوكاد.'
      ]
    }
  ];

  const currentChapter = chapters[activeChapterIndex];

  // Arabic Female Voice Speech Synthesis
  const speakNarration = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;  // calm, clear pacing
    utterance.pitch = 1.15; // slightly higher pitch for smooth, pleasant female tone

    // Try finding Arabic female voice in available browser voices
    const voices = window.speechSynthesis.getVoices();
    const arabicVoices = voices.filter(v => v.lang.startsWith('ar'));
    
    // Look for female voice identifiers
    const femaleVoice = arabicVoices.find(v => 
      v.name.toLowerCase().includes('laila') ||
      v.name.toLowerCase().includes('zeina') ||
      v.name.toLowerCase().includes('hoda') ||
      v.name.toLowerCase().includes('salma') ||
      v.name.toLowerCase().includes('nour') ||
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('maged')
    ) || arabicVoices[0];

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  // Trigger speech on chapter change or when opened
  useEffect(() => {
    if (isVideoTutorialOpen && isPlaying && !isMuted) {
      speakNarration(currentChapter.spokenNarration);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeChapterIndex, isVideoTutorialOpen, isPlaying, isMuted, speakNarration, currentChapter.spokenNarration]);

  // Progress Bar Animation
  useEffect(() => {
    let interval: any;
    if (isPlaying && isVideoTutorialOpen) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveChapterIndex((curr) => (curr + 1) % chapters.length);
            return 0;
          }
          return prev + 1;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isVideoTutorialOpen, activeChapterIndex, chapters.length]);

  if (!isVideoTutorialOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md font-sans select-none animate-in fade-in duration-200 ${isFullscreen ? 'p-0' : 'p-3 sm:p-6 overflow-y-auto'}`}>
      <div className={`bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isFullscreen ? 'w-screen h-screen rounded-none' : 'w-full max-w-5xl rounded-3xl max-h-[92vh]'}`}>
        
        {/* ========================================================================= */}
        {/* 1. MODAL HEADER                                                           */}
        {/* ========================================================================= */}
        <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/30">
              <Video size={20} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black flex items-center gap-2">
                <span>فيديو ودليل الشرح الشامل لبرنامج فرنتشر كاد برو</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-600 text-white rounded-full font-bold">صوت أنثى عربي 🎙️</span>
              </h2>
              <p className="text-[11px] text-slate-300 mt-0.5">
                مقاطع تفاعلية حية من واجهة التطبيق مع شرح صوتي احترافي لجميع الأدوات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen / Cinema Mode Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title={isFullscreen ? 'تصغير الشاشة' : 'تكبير الفيديو ملء الشاشة'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setIsVideoTutorialOpen(false);
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title="إغلاق نافذة الشرح"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN BODY (INTERACTIVE SCREEN CLIP PLAYER + CHAPTERS)                   */}
        {/* ========================================================================= */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT/CENTER: Animated High-Fidelity Web App Screen Clip (7-8 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col bg-slate-950 p-4 sm:p-5 overflow-y-auto">
            {/* SCREEN CLIP CONTAINER */}
            <div className={`relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between group ${isFullscreen ? 'h-[65vh]' : 'aspect-video'}`}>
              
              {/* --- ACTUAL INTERACTIVE APPLICATION SCREEN CLIPS --- */}

              {/* CLIP 1: 2D FLOOR PLAN & SNAP GUIDES */}
              {currentChapter.id === 'drawing-2d' && (
                <div className="absolute inset-0 bg-slate-100 flex flex-col overflow-hidden p-4">
                  {/* Mini Canvas Header */}
                  <div className="flex items-center justify-between bg-white/90 p-2 rounded-xl border border-slate-200 shadow-xs mb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Compass size={16} className="text-blue-600" />
                      <span>المخطط الهندسي 2D (أبعاد الغرفة: 4.00m × 3.20m)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                      <Grid size={12} />
                      <span>Snap: 50mm (Active)</span>
                    </div>
                  </div>

                  {/* SVG CAD Drawing Area */}
                  <div className="flex-1 bg-white rounded-2xl border-2 border-slate-300 relative p-4 flex items-center justify-center">
                    <div className="relative w-[85%] h-[80%] border-4 border-slate-700 bg-slate-50/50 rounded-lg">
                      {/* Dimensions Lines */}
                      <div className="absolute -top-6 inset-x-0 flex items-center justify-center text-xs font-mono font-bold text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200">
                        ↔ 4000 mm (الجدار الرئيسي A)
                      </div>
                      <div className="absolute -right-10 inset-y-0 flex items-center justify-center text-xs font-mono font-bold text-purple-600 bg-purple-50/80 px-1 py-2 rounded border border-purple-200 [writing-mode:vertical-rl]">
                        ↕ 3200 mm
                      </div>

                      {/* Snapped Base Cabinets */}
                      <div className="absolute top-0 left-4 w-32 h-16 bg-blue-600/90 text-white rounded text-[10px] font-mono font-bold flex flex-col items-center justify-center border border-white shadow-md animate-pulse">
                        <span>[B-01] درج 3 أدراج</span>
                        <span>900×600 mm</span>
                      </div>
                      <div className="absolute top-0 left-38 w-24 h-16 bg-blue-500 text-white rounded text-[10px] font-mono font-bold flex flex-col items-center justify-center border border-white shadow-md">
                        <span>[B-02] كابينة حوض</span>
                        <span>600×600 mm</span>
                      </div>
                      <div className="absolute top-0 left-64 w-28 h-16 bg-amber-500 text-white rounded text-[10px] font-mono font-bold flex flex-col items-center justify-center border border-white shadow-md">
                        <span>[APP-01] بوتاجاز بلت إن</span>
                        <span>750×600 mm</span>
                      </div>

                      {/* Simulated Moving Cursor */}
                      <div className="absolute top-10 left-44 z-20 flex items-center gap-1.5 transition-all duration-700">
                        <MousePointer size={18} className="text-red-500 fill-red-500 animate-bounce" />
                        <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">المحاذاة التلقائية للجدار</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CLIP 2: ADDING CABINETS & RESIZING */}
              {currentChapter.id === 'blocks-cabinets' && (
                <div className="absolute inset-0 bg-slate-900 flex overflow-hidden">
                  {/* Left Catalog Tool Rail & Drawer */}
                  <div className="w-56 bg-white border-r border-slate-200 p-3 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-black text-purple-700 mb-2 flex items-center gap-1">
                        <Box size={14} />
                        <span>كتالوج الوحدات السفلية</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="p-2 bg-purple-50 border border-purple-300 rounded-xl text-purple-900 font-bold shadow-xs">
                          📦 كابينة 3 أدراج (90cm)
                        </div>
                        <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold">
                          📦 كابينة ضلفة قلاب (60cm)
                        </div>
                        <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold">
                          📦 برج أفران ومايكروويف
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono text-center">اسحب أو انقر للإضافة</div>
                  </div>

                  {/* Inspector Panel */}
                  <div className="flex-1 bg-slate-100 p-4 flex flex-col justify-center items-center">
                    <div className="bg-white p-4 rounded-2xl border-2 border-purple-500 shadow-xl max-w-xs w-full space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">[CAB-01]</span>
                        <span className="text-xs font-bold text-slate-900">تعديل المقاسات</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[11px]">
                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                          <span className="text-[9px] text-slate-400 block">العرض</span>
                          <strong className="text-purple-700 text-sm">90 سم</strong>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                          <span className="text-[9px] text-slate-400 block">الارتفاع</span>
                          <strong className="text-slate-800 text-sm">90 سم</strong>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                          <span className="text-[9px] text-slate-400 block">العمق</span>
                          <strong className="text-slate-800 text-sm">60 سم</strong>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="flex-1 bg-purple-600 text-white text-center py-1 rounded-lg text-xs font-bold shadow-xs">تدوير 90° (R)</span>
                        <span className="flex-1 bg-blue-600 text-white text-center py-1 rounded-lg text-xs font-bold shadow-xs">تكرار (Ctrl+D)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CLIP 3: 3D PHOTOREALISTIC VIEW & ANIMATED DOORS */}
              {currentChapter.id === '3d-camera' && (
                <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-4 text-white">
                  <div className="flex items-center justify-between bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <Eye size={16} />
                      <span>منظور ثلاثي الأبعاد 3D واقعي</span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-lg text-xs font-bold">
                      <DoorOpen size={13} />
                      <span>الأبواب مفتوحة للمعاينة</span>
                    </div>
                  </div>

                  {/* 3D Visual Rendering Representation */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-72 h-44 bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-800 rounded-2xl border-2 border-amber-400 shadow-2xl p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="w-20 h-28 bg-amber-100/90 rounded border border-amber-400 p-1 text-[9px] text-slate-900 font-bold flex flex-col justify-around rotate-6 transform origin-left shadow-lg">
                          <span>🚪 ضلفة مفتوحة</span>
                          <span className="text-amber-700">أرفف ليد داخلية</span>
                        </div>
                        <div className="w-24 h-16 bg-slate-900 text-white rounded border border-white/30 p-1 text-[9px] font-bold text-center">
                          رخام كلكتا جولد
                        </div>
                      </div>
                      <div className="text-[10px] text-center font-mono text-amber-300 bg-black/60 py-1 rounded">
                        زاوية الرؤية: أيزومترك هندسي Isometric 30°
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CLIP 4: HIDDEN TOOLS & FULLSCREEN */}
              {currentChapter.id === 'hidden-tools' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-slate-900 to-slate-950 flex flex-col justify-between p-4 text-white">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">مساحة عمل خالية 100% للرسم والتصميم</span>
                    <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-lg font-bold">الشريط العائم النشط</span>
                  </div>

                  <div className="flex justify-center items-center gap-3">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
                      <span className="text-2xl block mb-1">📌</span>
                      <strong className="text-xs text-white">تثبيت وإخفاء الكتالوج</strong>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
                      <span className="text-2xl block mb-1">⌨️</span>
                      <strong className="text-xs text-white">اختصارات الكيبورد</strong>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
                      <span className="text-2xl block mb-1">💾</span>
                      <strong className="text-xs text-white">حفظ سحابي فوري</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* CLIP 5: PRICING (SQUARE METERS W x H vs LINEAR) */}
              {currentChapter.id === 'materials-pricing' && (
                <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-4 text-white">
                  <div className="flex items-center justify-between bg-black/60 p-2 rounded-xl border border-emerald-400/40">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Calculator size={16} />
                      <span>حاسبة التكاليف: المتر المربع لوش الوحدات (W × H)</span>
                    </span>
                    <span className="text-xs bg-emerald-600 px-2 py-0.5 rounded text-white font-bold">الخامة: كلادينج ألوميتال Alubond</span>
                  </div>

                  <div className="bg-white text-slate-900 p-3 rounded-2xl shadow-xl max-w-sm mx-auto w-full space-y-2 text-xs">
                    <div className="flex justify-between font-bold border-b pb-1">
                      <span>وش الكبائن (العرض × الارتفاع):</span>
                      <span className="text-emerald-700 font-mono text-sm">8.40 م²</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>سعر م² الكلادينج المعتمد:</span>
                      <span className="font-mono">4,600 ج.م</span>
                    </div>
                    <div className="flex justify-between font-black text-blue-600 border-t pt-1 text-sm">
                      <span>الإجمالي المطلوب:</span>
                      <span className="font-mono">38,640 ج.م</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CLIP 6: CUTTING LIST & BOM */}
              {currentChapter.id === 'cutting-manufacturing' && (
                <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-4 text-white">
                  <div className="flex items-center justify-between bg-black/60 p-2 rounded-xl border border-rose-400/40">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <Scissors size={16} />
                      <span>خريطة تقطيع الألواح وتفصيل الـ BOM</span>
                    </span>
                    <span className="text-xs bg-rose-600 px-2 py-0.5 rounded text-white font-bold">تصدير DXF & PDF</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">عدد الألواح المطلوبة</span>
                      <strong className="text-rose-400 text-lg font-mono">4 ألواح</strong>
                    </div>
                    <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">شريط الحرف (القشاط)</span>
                      <strong className="text-amber-400 text-lg font-mono">68.5 م.ط</strong>
                    </div>
                    <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">نسبة الفاقد والهالك</span>
                      <strong className="text-emerald-400 text-lg font-mono">8.2%</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Video Header Overlay */}
              <div className="relative z-10 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-bold font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>{currentChapter.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Voice Narration Pulse Indicator */}
                  {isSpeaking && !isMuted && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-600/90 text-white rounded-lg text-[10px] font-bold animate-pulse border border-white/30">
                      <Radio size={12} className="animate-spin" />
                      <span>صوت أنثى يشرح الآن 🎙️</span>
                    </div>
                  )}

                  <div className="text-[11px] font-mono text-slate-300 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                    {currentChapter.duration}
                  </div>
                </div>
              </div>

              {/* Bottom Video Controls Bar */}
              <div className="relative z-10 p-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col gap-2">
                {/* Progress Bar */}
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newProgress = Math.round((clickX / rect.width) * 100);
                    setProgress(Math.max(0, Math.min(100, newProgress)));
                  }}
                  className="w-full h-1.5 bg-slate-700/80 hover:h-2.5 rounded-full overflow-hidden cursor-pointer transition-all"
                >
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsPlaying(!isPlaying);
                        if (isPlaying && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        } else if (!isPlaying) {
                          speakNarration(currentChapter.spokenNarration);
                        }
                      }}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition"
                      title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الشرح'}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>

                    <button
                      onClick={() => {
                        setProgress(0);
                        speakNarration(currentChapter.spokenNarration);
                      }}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition"
                      title="إعادة الشرح من البداية"
                    >
                      <RotateCcw size={15} />
                    </button>

                    {/* Mute / Unmute Female Voice */}
                    <button
                      onClick={() => {
                        const nextMuted = !isMuted;
                        setIsMuted(nextMuted);
                        if (nextMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        } else if (!nextMuted) {
                          speakNarration(currentChapter.spokenNarration);
                        }
                      }}
                      className={`p-1.5 rounded-lg transition flex items-center gap-1 text-[11px] font-bold ${
                        !isMuted ? 'bg-rose-600/80 text-white' : 'text-slate-400 hover:bg-white/20'
                      }`}
                      title={isMuted ? 'تشغيل الصوت النسائي' : 'كتم الصوت'}
                    >
                      {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      <span className="hidden sm:inline">{isMuted ? 'الصوت مكتوم' : 'صوت أنثى مفعّل'}</span>
                    </button>

                    {/* Replay Narration Button */}
                    <button
                      onClick={() => speakNarration(currentChapter.spokenNarration)}
                      className="px-2 py-1 bg-white/15 hover:bg-white/25 rounded-lg text-[10px] font-bold text-slate-200 transition"
                      title="إعادة تشغيل الصوت"
                    >
                      🔊 إعادة الصوت
                    </button>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <button
                      onClick={() => {
                        setActiveChapterIndex((prev) => (prev > 0 ? prev - 1 : chapters.length - 1));
                        setProgress(0);
                      }}
                      className="p-1 hover:bg-white/20 rounded"
                      title="الدرس السابق"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <span>{activeChapterIndex + 1} / {chapters.length}</span>
                    <button
                      onClick={() => {
                        setActiveChapterIndex((prev) => (prev + 1) % chapters.length);
                        setProgress(0);
                      }}
                      className="p-1 hover:bg-white/20 rounded"
                      title="الدرس التالي"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition ml-1"
                      title={isFullscreen ? 'تصغير' : 'تكبير الشاشة'}
                    >
                      {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter Explanatory Notes & Pro Tips */}
            <div className="mt-4 space-y-3 text-right">
              {/* Voice Subtitles Banner */}
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-xs text-amber-200 flex items-start gap-2">
                <Radio size={16} className="text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <strong className="text-white block mb-0.5">التعليق الصوتي النسائي الحالي:</strong>
                  <p className="text-slate-300 leading-relaxed font-sans">{currentChapter.spokenNarration}</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>الخطوات وطرق التعامل مع هذه الأداة:</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentChapter.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro Tips Badge */}
              <div className="bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-800/40 p-3.5 rounded-2xl text-xs text-purple-200">
                <h4 className="font-bold flex items-center gap-1.5 text-purple-300 mb-1">
                  <Sparkles size={14} className="text-amber-300" />
                  <span>نصيحة احترافية سريعة (Pro Tip):</span>
                </h4>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {currentChapter.proTips.map((tip, idx) => (
                    <li key={idx}>✨ {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: Chapter Navigation & Keyboard Shortcuts (4-5 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 bg-slate-50 border-r border-slate-200 flex flex-col h-full overflow-y-auto p-4 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-2.5">
                فصول الشرح التعليمي (انقر للانتقال):
              </h3>

              <div className="space-y-2">
                {chapters.map((ch, idx) => {
                  const isActive = activeChapterIndex === idx;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setActiveChapterIndex(idx);
                        setProgress(0);
                        setIsPlaying(true);
                      }}
                      className={`w-full p-3 rounded-2xl border text-right transition flex items-start justify-between group ${
                        isActive
                          ? 'bg-white border-rose-500 shadow-md shadow-rose-500/10'
                          : 'bg-white/60 hover:bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                          {ch.icon}
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold leading-snug ${isActive ? 'text-rose-600' : 'text-slate-900'}`}>
                            {ch.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                            {ch.description}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 shrink-0 font-bold mt-0.5">
                        {ch.duration}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Keyboard Shortcuts Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Keyboard size={15} className="text-blue-600" />
                <span>أهم اختصارات الكيبورد السريعة:</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-600 font-sans">تدوير 90°:</span>
                  <strong className="bg-white px-2 py-0.5 rounded shadow-2xs text-purple-700">R</strong>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-600 font-sans">تكرار القطعة:</span>
                  <strong className="bg-white px-2 py-0.5 rounded shadow-2xs text-blue-700">Ctrl+D</strong>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-600 font-sans">حذف المحدد:</span>
                  <strong className="bg-white px-2 py-0.5 rounded shadow-2xs text-red-600">Del</strong>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-slate-600 font-sans">تراجع خطوة:</span>
                  <strong className="bg-white px-2 py-0.5 rounded shadow-2xs text-slate-800">Ctrl+Z</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MODAL FOOTER                                                           */}
        {/* ========================================================================= */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <HelpCircle size={15} className="text-blue-600" />
            <span>هل تحتاج لمساعدة إضافية؟ فريق الدعم متاح عبر الإيميل: <strong>sales@pom-agency.online</strong></span>
          </div>

          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              setIsVideoTutorialOpen(false);
            }}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            إغلاق وبدء التصميم
          </button>
        </div>
      </div>
    </div>
  );
};
