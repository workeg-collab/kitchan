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
  Maximize,
  Tv
} from 'lucide-react';

interface TutorialChapter {
  id: string;
  title: string;
  duration: string;
  icon: React.ReactNode;
  color: string;
  spokenNarration: string; // نص الشرح بالعامية المصرية السلسة
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
  const [isFullscreen, setIsFullscreen] = useState(true); // افتراضياً شاشة سينمائية عريضة جداً وكبيرة
  const [userInteracted, setUserInteracted] = useState(false);

  const chapters: TutorialChapter[] = [
    {
      id: 'drawing-2d',
      title: '1. رسم المخطط 2D والمغناطيس الذكي',
      duration: '01:15',
      icon: <Compass size={20} className="text-blue-500" />,
      color: 'blue',
      spokenNarration: 'أهلاً بيك في فرنتشر كاد برو! أول خطوة بنعملها هي رسم أبعاد الغرفة ومقاسات الحوائط. البرنامج فيه ميزة ذكية جداً وهي المغناطيس التلقائي؛ أول ما تقرب أي كابينة من الحيطة بتثبت مكانها فوراً من غير أي تداخل. وكمان تقدر تتحكم في الزووم وتشوف مقاسات المسافات والفرغات بين الوحدات بكل سهولة.',
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
      title: '2. سحب البلوكات وتعديل المقاسات',
      duration: '01:40',
      icon: <Box size={20} className="text-purple-500" />,
      color: 'purple',
      spokenNarration: 'دلوقتي هنفتح الكتالوج من على الشمال ونختار الوحدات اللي محتاجينها، سواء وحدات سفلية، علوية، أو دواليب طولية. بمجرد ما تضغط على أي كابينة، بتظهرلك لوحة الخصائص عشان تعدل العرض، الارتفاع، والعمق بالمللي. وتقدر تلف الكابينة تسعين درجة بحرف الآر، أو تكررها فوراً بكنترول مع دي.',
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
      title: '3. الرؤية 3D وفتح الضلف والأدراج',
      duration: '01:20',
      icon: <Eye size={20} className="text-amber-500" />,
      color: 'amber',
      spokenNarration: 'عشان تشوف تصميمك كأنه حقيقة، اضغط على منظور ثري دي 3D. هتشوف الخامات والإضاءة وانعكاسات الرخام بجودة عالية. والأحلى من كده، زرار الباب اللي فوق بيفتحلك كل الضلف والأدراج والقلابات مع بعض عشان تعاين التوزيع الداخلي والأرفف.',
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
      title: '4. الأدوات السريعة وتكبير مساحة الرسم 100%',
      duration: '00:55',
      icon: <Sparkles size={20} className="text-indigo-500" />,
      color: 'indigo',
      spokenNarration: 'لو عايز شاشة كاملة مية في المية للرسم، اضغط على زرار التثبيت عشان تقفل درج الكتالوج وتستمتع بأكبر مساحة شغل مريحة لعينك. وشريط الأدوات اللي عايم في نص الشاشة بيوفرلك كل أدوات الكاميرا والزووم في مكان واحد.',
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
      title: '5. تسعير المتر المربع لوش الوحدات وخامات الكلادينج والخشب',
      duration: '01:30',
      icon: <Calculator size={20} className="text-emerald-500" />,
      color: 'emerald',
      spokenNarration: 'نيجي بقى لحساب التكلفة وعرض السعر. البرنامج بيديلك حرية الاختيار بين الحساب بالمتر المربع لوش الوحدات، يعني بنضرب العرض في الارتفاع لوش الكابينة وملناش دعوة بالعمق، أو الحساب بالمتر الطولي. وكمان بتحدد خامتك المعتمدة سواء خشب إيجر، أكريليك، أو كلادينج ألوميتال مقاوم للمياه، والبرنامج بيطلعلك عرض سعر رسمي جاهز للطباعة فوراً.',
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
      title: '6. كشوفات التقطيع والـ BOM وتوزيع الألواح',
      duration: '01:10',
      icon: <Scissors size={20} className="text-rose-500" />,
      color: 'rose',
      spokenNarration: 'وأخيراً للتصنيع، محرك التقطيع بيحسبلك مقاسات كل جنب وقاع ورف وضلفة بعد خصم شريط الحرف والقشاط، وبيرسملك خريطة توزيع الألواح عشان تقلل الهالك والفاقد في الورشة، وتقدر تصدر ملفات الإكسل وملفات الدي إكس إف للسي إن سي بضغطة زرار.',
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

  // Arabic Egyptian Female Voice Speech Engine
  const speakNarration = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      if (isMuted) return;

      const utterance = new SpeechSynthesisUtterance(text);
      // ضبط اللهجة المصرية والنبرة الأنثوية الانسيابية
      utterance.lang = 'ar-EG';
      utterance.rate = 0.90;  // إيقاع هادئ وانسيابي ومريح للأذن
      utterance.pitch = 1.25; // نبرة صوت نسائية ناعمة وواضحة جداً

      const voices = window.speechSynthesis.getVoices();
      
      // البحث عن الأصوات العربية ذات النبرة النسائية أو اللهجة المصرية
      const femaleArabicVoice = voices.find(v => 
        (v.lang.includes('ar-EG') || v.lang.includes('ar')) && (
          v.name.toLowerCase().includes('laila') ||
          v.name.toLowerCase().includes('zeina') ||
          v.name.toLowerCase().includes('hoda') ||
          v.name.toLowerCase().includes('salma') ||
          v.name.toLowerCase().includes('nour') ||
          v.name.toLowerCase().includes('mariam') ||
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('مريم') ||
          v.name.toLowerCase().includes('هدى') ||
          v.name.toLowerCase().includes('سلمى') ||
          v.name.toLowerCase().includes('ليلى')
        )
      ) || voices.find(v => v.lang.includes('ar-EG')) 
        || voices.find(v => v.lang.startsWith('ar'));

      if (femaleArabicVoice) {
        utterance.voice = femaleArabicVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  }, [isMuted]);

  // Start speech when chapter changes or on play
  useEffect(() => {
    if (isVideoTutorialOpen && isPlaying && !isMuted && userInteracted) {
      speakNarration(currentChapter.spokenNarration);
    } else if (!isPlaying || isMuted) {
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
  }, [activeChapterIndex, isVideoTutorialOpen, isPlaying, isMuted, userInteracted, speakNarration, currentChapter.spokenNarration]);

  // Progress Bar
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
      }, 450);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isVideoTutorialOpen, activeChapterIndex, chapters.length]);

  if (!isVideoTutorialOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-lg p-2 sm:p-4 font-sans select-none animate-in fade-in duration-200"
      onClick={() => {
        if (!userInteracted) {
          setUserInteracted(true);
          speakNarration(currentChapter.spokenNarration);
        }
      }}
    >
      <div className={`bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isFullscreen ? 'w-[98vw] h-[96vh] rounded-2xl' : 'w-[94vw] max-w-6xl h-[88vh] rounded-3xl'}`}>
        
        {/* ========================================================================= */}
        {/* 1. TOP CINEMA HEADER BAR                                                  */}
        {/* ========================================================================= */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <Tv size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  فيديو الشرح الشامل لبرنامج فرنتشر كاد برو
                </h2>
                <span className="text-[11px] font-mono px-2.5 py-0.5 bg-rose-600 text-white rounded-full font-bold shadow-sm">
                  صوت أنثى مصري انسيابي 🎙️🇪🇬
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                شاشة عرض سينمائية كبيرة توضح كل خطوة عملياً من داخل التطبيق
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Direct Female Voice Play CTA */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserInteracted(true);
                setIsMuted(false);
                setIsPlaying(true);
                speakNarration(currentChapter.spokenNarration);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-rose-600/30 border border-rose-400/40"
              title="تشغيل التعليق الصوتي النسائي المصري فوراً"
            >
              <Volume2 size={15} />
              <span>استمع للشرح بصوت المهندسة (مصري)</span>
            </button>

            {/* Toggle Fullscreen Size */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(!isFullscreen);
              }}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title={isFullscreen ? 'تصغير الشاشة' : 'تكبير الشاشة ملء الشاشة بالكامل'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize size={18} />}
            </button>

            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setIsVideoTutorialOpen(false);
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title="إغلاق الشرح"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. GRAND CINEMA MAIN BODY (LARGE VIDEO + SMART CHAPTERS)                  */}
        {/* ========================================================================= */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-950">
          
          {/* LEFT/CENTER: LARGE PROMINENT VIDEO CANVAS (8-9 COLS) */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col bg-slate-950 p-3 sm:p-4 overflow-y-auto">
            
            {/* THE LARGE GRAND VIDEO SCREEN CONTAINER */}
            <div className="relative w-full flex-1 min-h-[380px] sm:min-h-[440px] rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700 shadow-2xl flex flex-col justify-between group">
              
              {/* =================================================================== */}
              {/* ACTUAL LARGE SCALE CRISP APPLICATION CLIPS                          */}
              {/* =================================================================== */}

              {/* CLIP 1: 2D FLOOR PLAN & MAGNETIC WALL SNAP */}
              {currentChapter.id === 'drawing-2d' && (
                <div className="absolute inset-0 bg-slate-100 flex flex-col p-4 sm:p-6 overflow-hidden">
                  {/* Top Bar inside CAD */}
                  <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-300 shadow-sm mb-4">
                    <div className="flex items-center gap-3">
                      <Compass size={22} className="text-blue-600" />
                      <div>
                        <h4 className="text-sm font-black text-slate-900">مخطط المطبخ الهندسي 2D Plan</h4>
                        <span className="text-[11px] text-slate-500 font-mono">أبعاد الغرفة: 4000 مم × 3200 مم • سماكة الجدار: 200 مم</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                        <span>المغناطيس الذكي نشط (Snap Active)</span>
                      </span>
                    </div>
                  </div>

                  {/* High-Resolution CAD Floor Plan Drawing Canvas */}
                  <div className="flex-1 bg-white rounded-3xl border-2 border-slate-300 relative p-6 flex items-center justify-center shadow-inner">
                    <div className="relative w-[90%] h-[85%] border-4 border-slate-800 bg-slate-50 rounded-xl shadow-lg">
                      {/* Dimension Indicators */}
                      <div className="absolute -top-7 inset-x-0 flex items-center justify-center">
                        <span className="text-xs font-mono font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-300 shadow-xs">
                          ↔ الجدار الرئيسي: 4.00 متر (4000 mm)
                        </span>
                      </div>
                      <div className="absolute -right-12 inset-y-0 flex items-center justify-center">
                        <span className="text-xs font-mono font-black text-purple-700 bg-purple-100 px-1.5 py-3 rounded-full border border-purple-300 shadow-xs [writing-mode:vertical-rl]">
                          ↕ الجدار الجانبي: 3.20 متر (3200 mm)
                        </span>
                      </div>

                      {/* Large Snapped Cabinets */}
                      <div className="absolute top-0 left-6 w-44 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg p-2 flex flex-col justify-between border-2 border-white shadow-xl">
                        <div className="flex justify-between items-center text-xs font-black">
                          <span>[B-01] كابينة 3 أدراج</span>
                          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">سفلي</span>
                        </div>
                        <div className="text-center font-mono text-sm font-bold bg-black/30 rounded py-0.5">
                          90 سم × 60 سم
                        </div>
                      </div>

                      <div className="absolute top-0 left-52 w-36 h-24 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-2 flex flex-col justify-between border-2 border-white shadow-xl">
                        <div className="flex justify-between items-center text-xs font-black">
                          <span>[B-02] حوض مطبخ</span>
                          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">سفلي</span>
                        </div>
                        <div className="text-center font-mono text-sm font-bold bg-black/30 rounded py-0.5">
                          60 سم × 60 سم
                        </div>
                      </div>

                      <div className="absolute top-0 left-90 w-40 h-24 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-lg p-2 flex flex-col justify-between border-2 border-white shadow-xl">
                        <div className="flex justify-between items-center text-xs font-black">
                          <span>[APP-01] بوتاجاز بلت إن</span>
                          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">أجهزة</span>
                        </div>
                        <div className="text-center font-mono text-sm font-bold bg-black/30 rounded py-0.5">
                          75 سم × 60 سم
                        </div>
                      </div>

                      {/* Magnetic Snapping Animated Callout */}
                      <div className="absolute bottom-6 right-8 bg-slate-900/90 text-white px-4 py-2.5 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-2.5">
                        <MousePointer size={20} className="text-emerald-400 animate-bounce" />
                        <div>
                          <strong className="text-xs text-emerald-300 block">المحاذاة التلقائية:</strong>
                          <span className="text-[11px] text-slate-300">يتم قفل الكابينة على زاوية الجدار لمنع أي فراغات أو تداخل</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CLIP 2: ADDING CABINETS & RESIZING (سحب وتعديل المقاسات) */}
              {currentChapter.id === 'blocks-cabinets' && (
                <div className="absolute inset-0 bg-slate-900 flex overflow-hidden p-4 sm:p-6 gap-4">
                  {/* Big Left Catalog Panel */}
                  <div className="w-72 bg-white rounded-3xl border-2 border-purple-300 p-4 flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex items-center gap-2 pb-3 border-b border-purple-100 text-purple-900 font-black text-sm">
                        <Box size={20} className="text-purple-600" />
                        <span>كتالوج الكبائن والوحدات</span>
                      </div>
                      <div className="mt-3 space-y-2 text-xs">
                        <div className="p-3 bg-purple-50 border-2 border-purple-500 rounded-2xl text-purple-950 font-black shadow-md flex items-center justify-between">
                          <span>📦 كابينة 3 أدراج بلوم</span>
                          <span className="font-mono text-purple-700">90 سم</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold flex items-center justify-between">
                          <span>📦 وحدة حوض رخام</span>
                          <span className="font-mono text-slate-500">60 سم</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold flex items-center justify-between">
                          <span>📦 دولاب تخزين طولي</span>
                          <span className="font-mono text-slate-500">220 سم</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-100 text-purple-900 p-2.5 rounded-xl text-center text-xs font-bold">
                      ✨ اسحب الكابينة إلى المخطط مباشرة
                    </div>
                  </div>

                  {/* Big Live Property Inspector */}
                  <div className="flex-1 bg-slate-800 rounded-3xl border border-slate-700 p-6 flex flex-col justify-center items-center shadow-inner">
                    <div className="bg-white p-6 rounded-3xl border-2 border-purple-500 shadow-2xl max-w-md w-full space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-mono font-black bg-purple-600 text-white px-3 py-1 rounded-xl">[CAB-01] وحدة سفلية</span>
                        <h4 className="text-sm font-black text-slate-900">تعديل أبعاد الوحدة المحددة</h4>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center font-mono">
                        <div className="bg-purple-50 p-3 rounded-2xl border-2 border-purple-300">
                          <span className="text-[11px] text-purple-700 font-bold block mb-1 font-sans">العرض (W)</span>
                          <strong className="text-purple-950 text-xl font-black">90 سم</strong>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                          <span className="text-[11px] text-slate-500 font-bold block mb-1 font-sans">الارتفاع (H)</span>
                          <strong className="text-slate-900 text-xl font-black">90 سم</strong>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                          <span className="text-[11px] text-slate-500 font-bold block mb-1 font-sans">العمق (D)</span>
                          <strong className="text-slate-900 text-xl font-black">60 سم</strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button className="bg-purple-600 text-white py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5">
                          <span>تدوير 90 درجة (R)</span>
                        </button>
                        <button className="bg-blue-600 text-white py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5">
                          <span>تكرار سريع (Ctrl+D)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CLIP 3: 3D REALISTIC VIEW & OPENING DOORS (منظور 3D وفتح الضلف) */}
              {currentChapter.id === '3d-camera' && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between p-6 text-white overflow-hidden">
                  <div className="flex items-center justify-between bg-black/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-xl">
                    <div className="flex items-center gap-3">
                      <Eye size={22} className="text-amber-400" />
                      <div>
                        <h4 className="text-sm font-black text-amber-300">المنظور الواقعي ثلاثي الأبعاد 3D</h4>
                        <span className="text-xs text-slate-300">خامات أكريليك بولي لاك • رخام كلكتا جولد مع إضاءة دافئة</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-amber-500 text-slate-950 px-4 py-1.5 rounded-xl font-black text-xs shadow-lg shadow-amber-500/30">
                      <DoorOpen size={16} />
                      <span>الأبواب والأدراج مفتوحة للمعاينة</span>
                    </div>
                  </div>

                  {/* 3D Visual Rendering Card */}
                  <div className="flex-1 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-lg bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-800 rounded-3xl border-2 border-amber-400/80 shadow-2xl p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div className="w-36 h-40 bg-amber-50 rounded-2xl border-2 border-amber-500 p-2 text-slate-900 font-bold flex flex-col justify-between shadow-2xl rotate-3 transform origin-left">
                          <span className="text-xs text-amber-900 font-black">🚪 ضلفة مفتوحة</span>
                          <div className="space-y-1 text-[11px] text-slate-700 font-mono">
                            <div>• رف علوي (أكريليك)</div>
                            <div>• إضاءة LED داخلية</div>
                            <div>• مفصلات بلوم سوفت كلوز</div>
                          </div>
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded text-center">عمق 60 سم</span>
                        </div>

                        <div className="flex-1 bg-slate-900/90 text-white rounded-2xl border border-white/30 p-4 space-y-2">
                          <span className="text-xs font-black text-amber-300 block">سطح الرخام الطبيعي:</span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            كلكتا جولد إيطالي مع شطف دبل 4 سم ومجرى مياه، مطابق للمواصفات المعمارية.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 bg-black/70 py-2 px-4 rounded-xl flex items-center justify-between text-xs font-mono text-amber-300 border border-white/10">
                        <span>المسقط النشط: أيزومترك هندسي Isometric 30°</span>
                        <span>الإضاءة: Daylight 5500K</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CLIP 4: HIDDEN TOOLS & FULL SCREEN WORKSPACE */}
              {currentChapter.id === 'hidden-tools' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-slate-900 to-slate-950 flex flex-col justify-between p-6 text-white">
                  <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-indigo-300">مساحة عمل خالية 100% للرسم والتركيز</h4>
                      <p className="text-xs text-slate-300 mt-0.5">إخفاء القوائم الجانبية بضغطة زر والاستمتاع بأكبر مساحة تصميم</p>
                    </div>
                    <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg">
                      Шريط الأدوات العائم مفعّل
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto w-full">
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center space-y-2 shadow-xl">
                      <span className="text-4xl block">📌</span>
                      <strong className="text-sm text-white block font-black">تثبيت وإخفاء الكتالوج</strong>
                      <p className="text-xs text-slate-300">للحصول على 100% من مساحة الشاشة</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center space-y-2 shadow-xl">
                      <span className="text-4xl block">⌨️</span>
                      <strong className="text-sm text-white block font-black">اختصارات الكيبورد</strong>
                      <p className="text-xs text-slate-300">R للتدوير • Ctrl+D للتكرار • Del للحذف</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center space-y-2 shadow-xl">
                      <span className="text-4xl block">💾</span>
                      <strong className="text-sm text-white block font-black">حفظ سحابي فوري</strong>
                      <p className="text-xs text-slate-300">تحديث تلقائي لمشاريعك بدون قلق</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CLIP 5: PRICING (SQUARE METERS W x H vs LINEAR) */}
              {currentChapter.id === 'materials-pricing' && (
                <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-6 text-white">
                  <div className="flex items-center justify-between bg-black/70 px-5 py-3 rounded-2xl border border-emerald-400/40 shadow-xl">
                    <div>
                      <h4 className="text-sm font-black text-emerald-400 flex items-center gap-2">
                        <Calculator size={20} />
                        <span>طريقة حساب المتر المربع لوش الوحدات (W × H بدون العمق)</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">مع تحديد خامة التصنيع: كلادينج ألوميتال Alubond أو خشب إيجر</p>
                    </div>
                    <span className="bg-emerald-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-lg">
                      عرض سعر رسمي معتمد
                    </span>
                  </div>

                  <div className="bg-white text-slate-900 p-6 rounded-3xl shadow-2xl max-w-lg mx-auto w-full space-y-3">
                    <div className="flex justify-between items-center bg-purple-50 p-3 rounded-2xl border border-purple-200">
                      <div>
                        <span className="font-black text-xs text-purple-900 block">إجمالي مسطح وش الوحدات (W × H):</span>
                        <span className="text-[11px] text-purple-700">مجموع (العرض بالمتر × الارتفاع بالمتر) لجميع الكبائن</span>
                      </div>
                      <strong className="text-purple-950 font-mono text-xl font-black">8.40 م²</strong>
                    </div>

                    <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                      <div>
                        <span className="font-black text-xs text-emerald-900 block">سعر م² خامة كلادينج ألوميتال Alubond:</span>
                        <span className="text-[11px] text-emerald-700">مقاوم للمياه والحريق 100% مع شاسيه ألوميتال</span>
                      </div>
                      <strong className="text-emerald-950 font-mono text-lg font-black">4,600 ج.م</strong>
                    </div>

                    <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-2xl shadow-lg">
                      <span className="font-black text-sm">الإجمالي النهائي المطلوب:</span>
                      <strong className="text-amber-300 font-mono text-2xl font-black">38,640 ج.م</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* CLIP 6: CUTTING LIST & BOM (كشوفات التقطيع) */}
              {currentChapter.id === 'cutting-manufacturing' && (
                <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-6 text-white">
                  <div className="flex items-center justify-between bg-black/70 px-5 py-3 rounded-2xl border border-rose-400/40 shadow-xl">
                    <div>
                      <h4 className="text-sm font-black text-rose-400 flex items-center gap-2">
                        <Scissors size={20} />
                        <span>محرك التقطيع وتوزيع الألواح (Cutting List & Nesting)</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">تفصيل المقاسات، أطوال القشاط، وتصدير DXF للسي إن سي</p>
                    </div>
                    <span className="bg-rose-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-lg">
                      جاهز للتصنيع الفوري
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto w-full">
                    <div className="bg-slate-800 p-5 rounded-3xl border-2 border-rose-500/50 text-center space-y-1 shadow-xl">
                      <span className="text-xs text-slate-400 block font-bold">عدد الألواح المطلوبة</span>
                      <strong className="text-rose-400 text-3xl font-mono font-black">4 ألواح</strong>
                      <span className="text-[10px] text-slate-400 block font-mono">2800 × 2070 mm</span>
                    </div>

                    <div className="bg-slate-800 p-5 rounded-3xl border-2 border-amber-500/50 text-center space-y-1 shadow-xl">
                      <span className="text-xs text-slate-400 block font-bold">شريط الحرف (القشاط)</span>
                      <strong className="text-amber-400 text-3xl font-mono font-black">68.5 م.ط</strong>
                      <span className="text-[10px] text-slate-400 block">سماكة 2 مم</span>
                    </div>

                    <div className="bg-slate-800 p-5 rounded-3xl border-2 border-emerald-500/50 text-center space-y-1 shadow-xl">
                      <span className="text-xs text-slate-400 block font-bold">نسبة الهالك والفاقد</span>
                      <strong className="text-emerald-400 text-3xl font-mono font-black">8.2%</strong>
                      <span className="text-[10px] text-emerald-400 block">توفير ممتاز</span>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* TOP VIDEO OVERLAY BADGE                                             */}
              {/* =================================================================== */}
              <div className="relative z-10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 text-white text-xs font-black shadow-xl">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span>{currentChapter.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Female Voice Live Indicator */}
                  {isSpeaking && !isMuted && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold animate-pulse border border-white/30 shadow-lg">
                      <Radio size={14} className="animate-spin" />
                      <span>صوت المهندسة يشرح الآن 🎙️🇪🇬</span>
                    </div>
                  )}

                  <div className="text-xs font-mono font-bold text-slate-200 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    {currentChapter.duration}
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* BOTTOM VIDEO CONTROLS BAR                                           */}
              {/* =================================================================== */}
              <div className="relative z-10 p-4 bg-gradient-to-t from-black/95 via-black/85 to-transparent flex flex-col gap-2.5">
                {/* Progress Bar */}
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newProgress = Math.round((clickX / rect.width) * 100);
                    setProgress(Math.max(0, Math.min(100, newProgress)));
                  }}
                  className="w-full h-2 bg-slate-700/80 hover:h-3 rounded-full overflow-hidden cursor-pointer transition-all"
                >
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Video Control Buttons */}
                <div className="flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserInteracted(true);
                        setIsPlaying(!isPlaying);
                        if (isPlaying && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        } else if (!isPlaying) {
                          speakNarration(currentChapter.spokenNarration);
                        }
                      }}
                      className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition shadow-md shadow-rose-600/30 flex items-center gap-1 font-bold"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      <span>{isPlaying ? 'إيقاف' : 'تشغيل'}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserInteracted(true);
                        setProgress(0);
                        speakNarration(currentChapter.spokenNarration);
                      }}
                      className="p-2 hover:bg-white/20 rounded-xl transition flex items-center gap-1 text-slate-300"
                      title="إعادة الدرس من الأول"
                    >
                      <RotateCcw size={15} />
                      <span className="hidden sm:inline">إعادة</span>
                    </button>

                    {/* Mute / Unmute Female Voice */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserInteracted(true);
                        const nextMuted = !isMuted;
                        setIsMuted(nextMuted);
                        if (nextMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        } else if (!nextMuted) {
                          speakNarration(currentChapter.spokenNarration);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 text-xs font-bold ${
                        !isMuted ? 'bg-pink-600/80 text-white' : 'text-slate-400 bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      <span>{isMuted ? 'الصوت مكتوم' : 'صوت أنثى مصري مفعّل'}</span>
                    </button>
                  </div>

                  {/* Chapter Previous / Next & Fullscreen */}
                  <div className="flex items-center gap-2 font-mono text-xs font-bold">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserInteracted(true);
                        setActiveChapterIndex((prev) => (prev > 0 ? prev - 1 : chapters.length - 1));
                        setProgress(0);
                      }}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition"
                      title="الدرس السابق"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <span className="bg-black/60 px-2.5 py-1 rounded-lg border border-white/10">
                      {activeChapterIndex + 1} / {chapters.length}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserInteracted(true);
                        setActiveChapterIndex((prev) => (prev + 1) % chapters.length);
                        setProgress(0);
                      }}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition"
                      title="الدرس التالي"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFullscreen(!isFullscreen);
                      }}
                      className="p-2 hover:bg-white/20 rounded-xl transition ml-2 text-amber-300"
                      title={isFullscreen ? 'تصغير' : 'تكبير الشاشة'}
                    >
                      {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtitles & Egyptian Voice Narration Text Card */}
            <div className="mt-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs text-amber-200 flex items-start gap-3 shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-rose-600/30 border border-rose-400/40 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                <Radio size={16} className="animate-pulse" />
              </div>
              <div className="flex-1">
                <strong className="text-white text-xs font-black block mb-1">
                  نص التعليق الصوتي النسائي (باللهجة المصرية):
                </strong>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                  "{currentChapter.spokenNarration}"
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: CHAPTER LIST & SHORTCUTS (3-4 COLS) */}
          <div className="lg:col-span-4 xl:col-span-3 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-y-auto p-4 space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono mb-3">
                فصول الشرح التعليمي:
              </h3>

              <div className="space-y-2.5">
                {chapters.map((ch, idx) => {
                  const isActive = activeChapterIndex === idx;
                  return (
                    <button
                      key={ch.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserInteracted(true);
                        setActiveChapterIndex(idx);
                        setProgress(0);
                        setIsPlaying(true);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-right transition flex items-start justify-between group ${
                        isActive
                          ? 'bg-slate-800 border-rose-500 shadow-xl shadow-rose-500/20'
                          : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          {ch.icon}
                        </div>
                        <div>
                          <h4 className={`text-xs font-black leading-snug ${isActive ? 'text-rose-400' : 'text-white'}`}>
                            {ch.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-sans">
                            {ch.description}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400 shrink-0 font-bold mt-0.5">
                        {ch.duration}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Pro Tips & Shortcuts Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
              <h4 className="text-xs font-black text-white flex items-center gap-2">
                <Keyboard size={16} className="text-blue-400" />
                <span>أهم اختصارات الكيبورد:</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-sans">تدوير 90°:</span>
                  <strong className="bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded border border-purple-500/40">R</strong>
                </div>
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-sans">تكرار القطعة:</span>
                  <strong className="bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-500/40">Ctrl+D</strong>
                </div>
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-sans">حذف المحدد:</span>
                  <strong className="bg-red-900/60 text-red-300 px-2 py-0.5 rounded border border-red-500/40">Del</strong>
                </div>
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-sans">تراجع خطوة:</span>
                  <strong className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">Ctrl+Z</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MODAL FOOTER                                                           */}
        {/* ========================================================================= */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <HelpCircle size={15} className="text-rose-500" />
            <span>فريق الدعم الفني متاح دائماً عبر الإيميل: <strong className="text-white">sales@pom-agency.online</strong></span>
          </div>

          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              setIsVideoTutorialOpen(false);
            }}
            className="px-6 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-black transition shadow-lg shadow-rose-600/30"
          >
            إغلاق والبدء في التصميم 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
