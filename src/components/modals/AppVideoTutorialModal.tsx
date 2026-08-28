import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
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
  ShieldCheck
} from 'lucide-react';

interface TutorialChapter {
  id: string;
  title: string;
  duration: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  videoPreviewImg: string;
  keyPoints: string[];
  proTips: string[];
}

export const AppVideoTutorialModal: React.FC = () => {
  const { isVideoTutorialOpen, setIsVideoTutorialOpen } = useUIStore();

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const chapters: TutorialChapter[] = [
    {
      id: 'drawing-2d',
      title: '1. المخطط الهندسي 2D والرسم الذكي',
      duration: '01:15',
      icon: <Compass size={18} className="text-blue-500" />,
      color: 'blue',
      description: 'طريقة رسم وتعديل أبعاد الغرفة، استخدام المغناطيس الذكي Snap to Grid & Wall، وإظهار خطوط الأبعاد والمسافات.',
      videoPreviewImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
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
      description: 'سحب وإفلات الوحدات والدواليب، تعديل العرض والارتفاع والعمق، التدوير 90°، والتكرار السريع.',
      videoPreviewImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
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
      description: 'التجوال ثلاثي الأبعاد الواقعي، المساقط الهندسية (علوي / أمامي / أيزومترك)، ومعاينة فتح وإغلاق الأبواب.',
      videoPreviewImg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
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
      description: 'كيف تخفي اللوحات الجانبية بضغطة زر وتستمتع بـ 100% من الشاشة للتصميم، وأهم الاختصارات.',
      videoPreviewImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
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
      description: 'حساب التكلفة بالمتر المربع لوش الوحدات (W × H بدون العمق) أو بالمتر الطولي مع اختيار نوع الخامة وتوليد عرض السعر.',
      videoPreviewImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
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
      description: 'استخراج تفصيل قص الألواح، أطوال القشاط، عدد الألواح المطلوبة، وتصدير ملفات PDF و Excel و DXF.',
      videoPreviewImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
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

  // Simulated Video Progress Timer
  useEffect(() => {
    let interval: any;
    if (isPlaying && isVideoTutorialOpen) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Auto advance to next chapter
            setActiveChapterIndex((curr) => (curr + 1) % chapters.length);
            return 0;
          }
          return prev + 1;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isVideoTutorialOpen, activeChapterIndex, chapters.length]);

  if (!isVideoTutorialOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto font-sans select-none animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* ========================================================================= */}
        {/* 1. MODAL HEADER                                                           */}
        {/* ========================================================================= */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Video size={20} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black flex items-center gap-2">
                <span>دليل وفيديو الشرح الشامل لبرنامج فرنتشر كاد برو</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-600 text-white rounded-full">بالعربي</span>
              </h2>
              <p className="text-[11px] text-slate-300 mt-0.5">
                تعلم طرق الرسم الهندسي، التعامل مع البلوكات، الأدوات المخفية، وتسعير الخامات بالمتر المربع
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVideoTutorialOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            title="إغلاق نافذة الشرح"
          >
            <X size={20} />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN BODY (VIDEO SIMULATOR + CHAPTERS SIDEBAR)                         */}
        {/* ========================================================================= */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT/CENTER: Interactive Animated Video Player Screen (8 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col bg-slate-950 p-4 sm:p-5 overflow-y-auto">
            {/* Simulated Video Canvas */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between group">
              {/* Background Simulated UI Frame */}
              <img
                src={currentChapter.videoPreviewImg}
                alt={currentChapter.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Animated Interactive Visual Simulation Overlay */}
              <div className="relative z-10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>شرح عملي حي: {currentChapter.title}</span>
                </div>

                <div className="text-[11px] font-mono text-slate-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  {currentChapter.duration}
                </div>
              </div>

              {/* Center Animated Play / Pulse Indicator */}
              <div className="relative z-10 self-center flex flex-col items-center gap-2 text-center p-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 transition transform hover:scale-110 active:scale-95 border-2 border-white/40 cursor-pointer"
                  title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الشرح'}
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
                </button>
                <span className="text-xs font-bold text-white drop-shadow bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  {currentChapter.title}
                </span>
              </div>

              {/* Bottom Video Controls Bar */}
              <div className="relative z-10 p-3 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-2">
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
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      onClick={() => setProgress(0)}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition"
                      title="إعادة من البداية"
                    >
                      <RotateCcw size={15} />
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition"
                      title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <span className="text-[11px] font-mono text-slate-300">
                      {Math.floor((progress / 100) * 80)}s / 80s
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <button
                      onClick={() => setActiveChapterIndex((prev) => (prev > 0 ? prev - 1 : chapters.length - 1))}
                      className="p-1 hover:bg-white/20 rounded"
                      title="الدرس السابق"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <span>{activeChapterIndex + 1} / {chapters.length}</span>
                    <button
                      onClick={() => setActiveChapterIndex((prev) => (prev + 1) % chapters.length)}
                      className="p-1 hover:bg-white/20 rounded"
                      title="الدرس التالي"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter Explanatory Notes & Pro Tips */}
            <div className="mt-4 space-y-3 text-right">
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
                          ? 'bg-white border-blue-500 shadow-md shadow-blue-500/10'
                          : 'bg-white/60 hover:bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-blue-50' : 'bg-slate-100'}`}>
                          {ch.icon}
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold leading-snug ${isActive ? 'text-blue-600' : 'text-slate-900'}`}>
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
            onClick={() => setIsVideoTutorialOpen(false)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            إغلاق وبدء التصميم
          </button>
        </div>
      </div>
    </div>
  );
};
