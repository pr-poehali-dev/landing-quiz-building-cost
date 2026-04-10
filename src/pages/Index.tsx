import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

/* ─────────────── CONSTANTS ─────────────── */
const ACCENT = "#E07E34";
const PRICE_PER_SQM = 15000;

const BUILDING_WORDS = [
  "зданий", "складов", "ангаров", "цехов", "офисов",
  "медицинских зданий", "магазинов", "кафе и ресторанов",
  "торговых зданий", "административных зданий", "автомоек",
  "зданий для транспорта", "автосервисов", "автосалонов",
  "сельхоз зданий", "ферм", "спортивных сооружений",
];

const CITIES_RU = [
  "Москва","Санкт-Петербург","Новосибирск","Екатеринбург","Казань","Нижний Новгород",
  "Челябинск","Красноярск","Самара","Уфа","Ростов-на-Дону","Краснодар","Омск","Воронеж",
  "Пермь","Волгоград","Саратов","Тюмень","Тольятти","Ижевск","Барнаул","Ульяновск",
  "Иркутск","Хабаровск","Владивосток","Махачкала","Томск","Оренбург","Кемерово","Новокузнецк",
  "Рязань","Астрахань","Набережные Челны","Пенза","Липецк","Киров","Чебоксары","Тула",
  "Калининград","Брянск","Курск","Иваново","Магнитогорск","Тверь","Ставрополь","Белгород",
  "Архангельск","Сочи","Владимир","Сургут","Нижний Тагил","Якутск","Улан-Удэ","Чита",
  "Смоленск","Вологда","Орёл","Кострома","Нижневартовск","Мурманск","Петрозаводск",
  "Новороссийск","Рыбинск","Таганрог","Калуга","Псков","Великий Новгород","Балашиха",
  "Химки","Подольск","Люберцы","Красногорск","Мытищи","Одинцово","Домодедово","Электросталь",
  "Королёв","Орехово-Зуево","Раменское","Жуковский","Коломна","Ногинск","Серпухов",
  "Дзержинск","Арзамас","Саров","Бор","Балахна","Городец","Кстово","Павлово",
  "Нижний Новгород","Дмитров","Истра","Солнечногорск","Волжский","Энгельс","Балаково",
  "Стерлитамак","Нефтекамск","Октябрьский","Бугульма","Альметьевск","Нижнекамск",
  "Набережные Челны","Зеленодольск","Чистополь","Бугульма","Заинск","Лениногорск",
];

const buildingTypes = [
  { id: "production", label: "Производственные и промышленные здания", coeff: 1.2 },
  { id: "warehouse", label: "Склады и ангары", coeff: 1.0 },
  { id: "retail", label: "Магазины и торговые здания", coeff: 1.25 },
  { id: "transport", label: "Здания для транспорта", coeff: 1.1 },
  { id: "agricultural", label: "Сельскохозяйственные здания", coeff: 0.9 },
  { id: "other", label: "Другое", coeff: 1.0 },
];

const additionalServices = [
  { id: "land", label: "Подбор земельного участка" },
  { id: "assessment", label: "Оценка пригодности участка для реализации проекта" },
  { id: "design", label: "Проектирование и получение разрешения на строительство" },
  { id: "supply", label: "Поставка комплекта здания" },
  { id: "delivery", label: "Доставка комплекта здания до стройплощадки" },
  { id: "assembly", label: "Монтаж здания" },
  { id: "handover", label: "Сдача в эксплуатацию" },
];

const features = [
  { num: "300+", desc: "Реализованных проектов промышленных и коммерческих зданий по всей России" },
  { num: "40 дней", desc: "Всего за 40 дней мы обеспечиваем поставку и монтаж быстровозводимых зданий SMALL BOX для малого и среднего бизнеса" },
  { num: "500+ тыс.кв.м", desc: "Запроектированных объектов в нашем портфеле и более 300 тыс.кв.м построенных объектов BIG BOX" },
  { num: "60+", desc: "Запроектировали многоуровневых паркингов на 50000 машиномест и построили более 20 паркингов на 9000 машиномест" },
];

const projects = [
  {
    name: "Склад для хранения металлоизделий, 18×30×6 м",
    area: "540 кв.м", cat: "Склады и ангары",
    region: "Россия, Ярославская обл., г. Рыбинск",
    images: [
      "https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/files/a704af06-674a-4806-be3a-3b078fdaaad2.jpg",
      "https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/files/8faf3eb4-16e4-4e35-aadb-32ef939e16e4.jpg",
    ],
    params: { "Назначение": "Склад и ангар", "Длина": "30 м", "Ширина": "18 м", "Высота": "6 м", "Площадь": "540 кв.м", "Тип стен": "Сэндвич-панели" },
  },
  {
    name: "Производственный цех, 24×48×8 м",
    area: "1152 кв.м", cat: "Производственные здания",
    region: "Россия, Московская обл., г. Подольск",
    images: [
      "https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/files/c15697f2-aadf-46fb-a916-87dc8ca0bce8.jpg",
      "https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/files/b5a4cf59-76ed-4116-b0c2-e8610c28ad06.jpg",
    ],
    params: { "Назначение": "Производств. здание", "Длина": "48 м", "Ширина": "24 м", "Высота": "8 м", "Площадь": "1152 кв.м", "Тип стен": "Профлист" },
  },
  {
    name: "Торговый центр, 30×60×6 м",
    area: "1800 кв.м", cat: "Магазины и торговые здания",
    region: "Россия, Краснодарский край, г. Сочи",
    images: [
      "https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/files/4b7b45ea-2000-4061-90b5-39ceff4bfa25.jpg",
      "https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/files/7036453e-0542-43fe-998e-034f2c2009b6.jpg",
    ],
    params: { "Назначение": "Торговое здание", "Длина": "60 м", "Ширина": "30 м", "Высота": "6 м", "Площадь": "1800 кв.м", "Тип стен": "Сэндвич-панели" },
  },
  {
    name: "Автосервис с автомойкой, 12×24×4.8 м",
    area: "288 кв.м", cat: "Здания для транспорта",
    region: "Россия, Свердловская обл., г. Екатеринбург",
    images: [
      "https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/files/ba6ab489-6a59-4b70-aa95-e4c7f31862c3.jpg",
      "https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/files/badd2099-80b1-41ce-a425-1e5088ee699a.jpg",
    ],
    params: { "Назначение": "Здание для транспорта", "Длина": "24 м", "Ширина": "12 м", "Высота": "4.8 м", "Площадь": "288 кв.м", "Тип стен": "Сэндвич-панели" },
  },
];

const RESULT_GALLERY = [
  "https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/files/a704af06-674a-4806-be3a-3b078fdaaad2.jpg",
  "https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/files/c15697f2-aadf-46fb-a916-87dc8ca0bce8.jpg",
  "https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/files/7036453e-0542-43fe-998e-034f2c2009b6.jpg",
  "https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/files/ba6ab489-6a59-4b70-aa95-e4c7f31862c3.jpg",
  "https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/files/8faf3eb4-16e4-4e35-aadb-32ef939e16e4.jpg",
];

type Step = "intro" | "purpose" | "region" | "params" | "config" | "services" | "contacts" | "result";
const QUIZ_STEPS: Step[] = ["purpose", "region", "params", "config", "services", "contacts"];

interface FormData {
  buildingType: string;
  region: string;
  length: number;
  width: number;
  height: number;
  wallType: string;
  cranBeam: string;
  services: string[];
  name: string;
  phone: string;
  email: string;
}

/* ─────────────── COMPONENT ─────────────── */
export default function Index() {
  const [step, setStep] = useState<Step>("intro");
  const [form, setForm] = useState<Partial<FormData>>({
    length: 24, width: 18, height: 3.6,
    wallType: "", cranBeam: "Нет",
    services: ["supply"],
  });
  const [animating, setAnimating] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [regionInput, setRegionInput] = useState("");
  const [regionSuggestions, setRegionSuggestions] = useState<string[]>([]);
  const [wordIdx, setWordIdx] = useState(0);
  const [wordFade, setWordFade] = useState(true);
  const [projectModal, setProjectModal] = useState<typeof projects[0] | null>(null);
  const [modalImgIdx, setModalImgIdx] = useState(0);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [nameErr, setNameErr] = useState(false);
  const [phoneErr, setPhoneErr] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setWordFade(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % BUILDING_WORDS.length);
        setWordFade(true);
      }, 300);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goTo = (next: Step) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 220);
  };

  const quizIdx = QUIZ_STEPS.indexOf(step as Step);
  const stepNum = quizIdx + 1;
  const totalSteps = QUIZ_STEPS.length;

  const prevStep = () => {
    if (quizIdx <= 0) { goTo("intro"); return; }
    goTo(QUIZ_STEPS[quizIdx - 1]);
  };
  const nextStep = () => {
    if (quizIdx < QUIZ_STEPS.length - 1) goTo(QUIZ_STEPS[quizIdx + 1]);
  };

  const area = (form.length ?? 24) * (form.width ?? 18);

  const calculatePrice = () => {
    const building = buildingTypes.find((b) => b.id === form.buildingType);
    const coeff = building?.coeff ?? 1.0;
    const wallCoeff = form.wallType === "Сэндвич панели" ? 1.1 : 1.0;
    const cranCoeff = form.cranBeam === "Да" ? 1.15 : 1.0;
    return Math.round(area * PRICE_PER_SQM * coeff * wallCoeff * cranCoeff);
  };

  const formatPrice = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

  const handleRegionInput = (val: string) => {
    setRegionInput(val);
    setForm((f) => ({ ...f, region: val }));
    if (val.length >= 2) {
      const filtered = CITIES_RU.filter((c) =>
        c.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 8);
      setRegionSuggestions(filtered);
    } else {
      setRegionSuggestions([]);
    }
  };

  const handlePhoneInput = (val: string) => {
    let digits = val.replace(/\D/g, "");
    if (digits.startsWith("8")) digits = "7" + digits.slice(1);
    if (!digits.startsWith("7") && digits.length > 0) digits = "7" + digits;
    digits = digits.slice(0, 11);
    let masked = "";
    if (digits.length > 0) masked = "+7";
    if (digits.length > 1) masked += " (" + digits.slice(1, 4);
    if (digits.length >= 4) masked += ") " + digits.slice(4, 7);
    if (digits.length >= 7) masked += "-" + digits.slice(7, 9);
    if (digits.length >= 9) masked += "-" + digits.slice(9, 11);
    setForm((f) => ({ ...f, phone: masked }));
  };

  const toggleService = (id: string) => {
    setForm((f) => {
      const prev = f.services ?? [];
      return { ...f, services: prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id] };
    });
  };

  const handleSubmit = () => {
    let ok = true;
    if (!form.name?.trim()) { setNameErr(true); ok = false; } else setNameErr(false);
    const phoneDigits = (form.phone ?? "").replace(/\D/g, "");
    if (phoneDigits.length < 11) { setPhoneErr(true); ok = false; } else setPhoneErr(false);
    if (!ok) return;
    goTo("result");
    setTimeout(() => setShowThankYou(true), 800);
  };

  const isQuizStep = QUIZ_STEPS.includes(step as Step);
  const isLastQuizStep = step === "contacts";

  return (
    <div className="min-h-screen bg-[#f2f2f2] font-golos text-[#1a1a1a]">

      {/* ══════ HEADER ══════ */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-center leading-none bg-[#1a1a1a] px-2 py-1.5 rounded">
              <span className="font-extrabold text-[11px] tracking-widest" style={{ color: ACCENT }}>EVRAZ</span>
              <span className="text-white font-bold text-[9px] tracking-widest">STEEL</span>
              <span className="font-extrabold text-[11px] tracking-widest" style={{ color: ACCENT }}>BOX</span>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <p className="text-[11px] text-gray-500 leading-tight max-w-[180px]">
              Российский разработчик и поставщик полнокомплектных быстровозводимых зданий на металлическом каркасе
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-center text-xs text-gray-500">
            <span className="font-semibold text-gray-700 mb-0.5">Время и график работы</span>
            <span>Пн — Пт&nbsp;&nbsp;&nbsp;09:30 — 18:00</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end text-xs">
              <a href="tel:+78003026529" className="font-bold text-gray-800 text-sm transition-colors" style={{}} onMouseEnter={e => e.currentTarget.style.color = ACCENT} onMouseLeave={e => e.currentTarget.style.color = ""}>
                +7 (800) 302-65-29
              </a>
              <a href="mailto:sales.box2@evrazsteel.ru" className="text-[11px] hover:underline" style={{ color: ACCENT }}>
                sales.box2@evrazsteel.ru
              </a>
            </div>
            <a href="https://t.me/evrazsteelbox" className="hidden md:flex items-center gap-1.5 bg-[#229ED9] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#1a8ec4] transition-colors">
              <Icon name="Send" size={13} />Telegram
            </a>
            <button onClick={() => goTo("purpose")} className="text-xs font-semibold border border-gray-400 text-gray-700 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
              onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.color = ""; }}>
              Обратный звонок
            </button>
          </div>
        </div>
      </header>

      {/* ══════ INTRO ══════ */}
      {step === "intro" && (
        <>
          <section className="relative overflow-hidden bg-white">
            <div className="absolute inset-0">
              <img
                src="https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/bucket/9a2f42b7-bc84-4919-bac7-80278dd6a296.jpg"
                alt="bg"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-white/80" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-6 text-[#1a1a1a]">
                    <span className="block">Проектирование, производство и строительство</span>
                    <span className="block my-1">
                      быстровозводимых{" "}
                      <span
                        style={{
                          color: ACCENT,
                          display: "inline-block",
                          minWidth: "22ch",
                          transition: "opacity 0.3s ease",
                          opacity: wordFade ? 1 : 0,
                        }}
                      >
                        {BUILDING_WORDS[wordIdx]}
                      </span>
                    </span>
                    <span className="block">
                      под ключ за <span style={{ color: ACCENT }}>40 дней</span>
                    </span>
                  </h1>
                  <p className="text-gray-600 text-base mb-8">
                    Пройдите тест за <strong>1 минуту</strong> чтобы узнать стоимость и получить расчет
                  </p>
                  <button
                    onClick={() => goTo("purpose")}
                    className="inline-flex items-center gap-3 text-white font-bold text-sm tracking-widest uppercase px-8 py-4 transition-colors"
                    style={{ backgroundColor: ACCENT }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#c96d27")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = ACCENT)}
                  >
                    РАССЧИТАТЬ СТОИМОСТЬ →
                  </button>
                </div>

                <div className="space-y-5">
                  {features.map((f) => (
                    <div key={f.num} className="flex items-start gap-3">
                      <div className="font-extrabold text-xl md:text-2xl leading-none shrink-0 min-w-[120px]" style={{ color: ACCENT }}>
                        {f.num}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed pt-0.5">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
            <h2 className="text-xl font-bold mb-6">Примеры реализованных проектов:</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {projects.map((p) => (
                <div key={p.name} onClick={() => { setProjectModal(p); setModalImgIdx(0); }}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="relative h-40 overflow-hidden">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {p.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                        +{p.images.length - 1} фото
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 leading-tight">{p.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <Icon name="MapPin" size={11} />{p.region}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-sm font-bold text-gray-700">{p.area}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{p.cat}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="bg-white border-t border-gray-200 sticky bottom-0 z-40">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
              <p className="text-sm md:text-base font-medium text-gray-700">
                Пройдите тест за <strong>1 минуту</strong> чтобы узнать стоимость вашего здания
              </p>
              <button onClick={() => goTo("purpose")}
                className="shrink-0 text-white font-bold text-sm tracking-wider uppercase px-6 py-3 transition-colors whitespace-nowrap"
                style={{ backgroundColor: ACCENT }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#c96d27")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = ACCENT)}>
                РАССЧИТАТЬ →
              </button>
            </div>
          </div>
        </>
      )}

      {/* ══════ PROJECT MODAL ══════ */}
      {projectModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setProjectModal(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative bg-gray-100 h-64 md:h-72">
              <img src={projectModal.images[modalImgIdx]} alt="" className="w-full h-full object-cover" />
              {projectModal.images.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  {projectModal.images.map((_, i) => (
                    <button key={i} onClick={() => setModalImgIdx(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === modalImgIdx ? "bg-white scale-125" : "bg-white/50"}`} />
                  ))}
                </div>
              )}
              {modalImgIdx > 0 && (
                <button onClick={() => setModalImgIdx(i => i - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center">
                  <Icon name="ChevronLeft" size={18} />
                </button>
              )}
              {modalImgIdx < projectModal.images.length - 1 && (
                <button onClick={() => setModalImgIdx(i => i + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center">
                  <Icon name="ChevronRight" size={18} />
                </button>
              )}
              <button onClick={() => setProjectModal(null)}
                className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center">
                <Icon name="X" size={16} />
              </button>
            </div>
            <div className="p-6">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">КАРТОЧКА ПРОЕКТА</div>
              <h3 className="font-bold text-lg mb-4">{projectModal.name}</h3>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="font-semibold text-gray-500 text-xs mb-2 uppercase tracking-wide">Характеристики</div>
                  {Object.entries(projectModal.params).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-gray-500 text-xs mb-2 uppercase tracking-wide">Детали</div>
                  <div className="flex items-center gap-2 py-1.5"><Icon name="CheckCircle" size={14} style={{ color: ACCENT }} /><span className="text-gray-600 text-xs">Статус: Завершено</span></div>
                  <div className="flex items-center gap-2 py-1.5"><Icon name="Tag" size={14} style={{ color: ACCENT }} /><span className="text-gray-600 text-xs">Категория: {projectModal.cat}</span></div>
                  <div className="flex items-center gap-2 py-1.5"><Icon name="Maximize" size={14} style={{ color: ACCENT }} /><span className="text-gray-600 text-xs">Площадь: {projectModal.area}</span></div>
                  <div className="flex items-center gap-2 py-1.5"><Icon name="MapPin" size={14} style={{ color: ACCENT }} /><span className="text-gray-600 text-xs">{projectModal.region}</span></div>
                </div>
              </div>
              <button onClick={() => { setProjectModal(null); goTo("purpose"); }}
                className="mt-5 w-full text-white font-bold text-sm uppercase tracking-wide py-3 transition-colors"
                style={{ backgroundColor: ACCENT }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#c96d27")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = ACCENT)}>
                Рассчитать похожее здание →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════ QUIZ ══════ */}
      {isQuizStep && (
        <div className="min-h-[calc(100vh-64px)] flex flex-col py-6 px-4">
          <div className={`max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col transition-all duration-220 ${animating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>

            {/* Nav */}
            <div className="px-8 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <button onClick={prevStep} className="text-sm hover:underline flex items-center gap-1" style={{ color: ACCENT }}>
                ← Назад
              </button>
              {!isLastQuizStep && (
                <button onClick={nextStep} className="text-sm hover:underline" style={{ color: ACCENT }}>
                  Следующая →
                </button>
              )}
            </div>

            {/* Body */}
            <div className="px-8 py-8 flex-1">

              {/* 1: PURPOSE */}
              {step === "purpose" && (
                <div>
                  <h2 className="text-xl font-semibold text-center mb-8">Назначение здания:</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {buildingTypes.map((b) => (
                      <button key={b.id}
                        onClick={() => { setForm((f) => ({ ...f, buildingType: b.id })); setTimeout(() => goTo("region"), 200); }}
                        className={`flex flex-col items-center justify-center text-center p-4 rounded-xl border-2 text-sm leading-tight min-h-[80px] transition-all active:scale-95 ${form.buildingType === b.id ? "bg-orange-50 font-semibold" : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-orange-50"}`}
                        style={{ borderColor: form.buildingType === b.id ? ACCENT : undefined }}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2: REGION */}
              {step === "region" && (
                <div>
                  <h2 className="text-xl font-semibold text-center mb-8">Регион строительства</h2>
                  <div className="max-w-sm mx-auto" ref={regionRef}>
                    <div className="relative">
                      <input
                        type="text"
                        value={regionInput}
                        onChange={(e) => handleRegionInput(e.target.value)}
                        placeholder="Начните вводить название города..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
                        onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                        onBlur={e => (e.currentTarget.style.borderColor = regionInput ? ACCENT : "#d1d5db")}
                      />
                      {regionSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 mt-1 overflow-hidden">
                          {regionSuggestions.map((c) => (
                            <button key={c}
                              onClick={() => { setForm((f) => ({ ...f, region: c })); setRegionInput(c); setRegionSuggestions([]); }}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 border-b border-gray-50 last:border-0 transition-colors">
                              {c}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 3: PARAMS */}
              {step === "params" && (
                <div>
                  <h2 className="text-xl font-semibold text-center mb-8">Параметры здания</h2>
                  <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-6">
                    <div>
                      <label className="block text-xs text-gray-500 font-medium text-center mb-2">Длина, м</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[24, 30, 36, 42, 48, 54].map((v) => (
                          <button key={v} onClick={() => setForm((f) => ({ ...f, length: v }))}
                            className={`py-2 rounded-lg text-sm font-semibold border-2 transition-all ${form.length === v ? "bg-orange-50" : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-orange-50"}`}
                            style={{ borderColor: form.length === v ? ACCENT : undefined, color: form.length === v ? ACCENT : undefined }}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 font-medium text-center mb-2">Ширина, м</label>
                      <div className="flex flex-col gap-1.5">
                        {[12, 18, 24].map((v) => (
                          <button key={v} onClick={() => setForm((f) => ({ ...f, width: v }))}
                            className={`py-2 rounded-lg text-sm font-semibold border-2 transition-all ${form.width === v ? "bg-orange-50" : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-orange-50"}`}
                            style={{ borderColor: form.width === v ? ACCENT : undefined, color: form.width === v ? ACCENT : undefined }}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 font-medium text-center mb-2">Высота, м</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[3.6, 4.8, 6, 7.2, 8.4, 9.6, 10.8, 12].map((v) => (
                          <button key={v} onClick={() => setForm((f) => ({ ...f, height: v }))}
                            className={`py-2 rounded-lg text-sm font-semibold border-2 transition-all ${form.height === v ? "bg-orange-50" : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-orange-50"}`}
                            style={{ borderColor: form.height === v ? ACCENT : undefined, color: form.height === v ? ACCENT : undefined }}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-center bg-orange-50 border rounded-xl py-4 max-w-xs mx-auto" style={{ borderColor: ACCENT + "55" }}>
                    <div className="text-xs text-gray-500 mb-1">Площадь здания</div>
                    <div className="text-3xl font-extrabold" style={{ color: ACCENT }}>{area.toLocaleString("ru")} м²</div>
                    <div className="text-xs text-gray-400 mt-1">{form.length ?? 24} × {form.width ?? 18} м</div>
                  </div>
                </div>
              )}

              {/* 4: CONFIG */}
              {step === "config" && (
                <div>
                  <h2 className="text-xl font-semibold text-center mb-8">Варианты комплектаций</h2>
                  <div className="max-w-md mx-auto space-y-7">
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-3">Тип стен и кровли:</div>
                      <div className="grid grid-cols-2 gap-3">
                        {["Профилированный лист", "Сэндвич панели"].map((opt) => (
                          <button key={opt} onClick={() => setForm((f) => ({ ...f, wallType: opt }))}
                            className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${form.wallType === opt ? "bg-orange-50" : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-orange-50"}`}
                            style={{ borderColor: form.wallType === opt ? ACCENT : undefined, color: form.wallType === opt ? ACCENT : undefined }}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-3">Наличие кран-балки 5 тонн:</div>
                      <div className="grid grid-cols-2 gap-3">
                        {["Да", "Нет"].map((opt) => (
                          <button key={opt} onClick={() => setForm((f) => ({ ...f, cranBeam: opt }))}
                            className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${form.cranBeam === opt ? "bg-orange-50" : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-orange-50"}`}
                            style={{ borderColor: form.cranBeam === opt ? ACCENT : undefined, color: form.cranBeam === opt ? ACCENT : undefined }}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5: SERVICES */}
              {step === "services" && (
                <div>
                  <h2 className="text-xl font-semibold text-center mb-8">Дополнительные услуги</h2>
                  <div className="space-y-3 max-w-lg mx-auto">
                    {additionalServices.map((s) => {
                      const checked = (form.services ?? []).includes(s.id);
                      return (
                        <label key={s.id} className="flex items-center gap-3 cursor-pointer group">
                          <div onClick={() => toggleService(s.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "border-[#E07E34] bg-[#E07E34]" : "border-gray-300 group-hover:border-[#E07E34]"}`}>
                            {checked && <Icon name="Check" size={11} className="text-white" />}
                          </div>
                          <span className="text-sm text-gray-700">{s.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6: CONTACTS */}
              {step === "contacts" && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    {/* Gallery */}
                    <div className="relative bg-gray-100 rounded-xl overflow-hidden h-44 mb-4">
                      <img src={RESULT_GALLERY[galleryIdx]} alt="" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                        {RESULT_GALLERY.slice(0, 3).map((_, i) => (
                          <button key={i} onClick={() => setGalleryIdx(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === galleryIdx ? "bg-white scale-125" : "bg-white/50"}`} />
                        ))}
                      </div>
                      {galleryIdx > 0 && (
                        <button onClick={() => setGalleryIdx(i => Math.max(0, i - 1))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-6 h-6 rounded-full flex items-center justify-center">
                          <Icon name="ChevronLeft" size={14} />
                        </button>
                      )}
                      {galleryIdx < 2 && (
                        <button onClick={() => setGalleryIdx(i => Math.min(2, i + 1))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-6 h-6 rounded-full flex items-center justify-center">
                          <Icon name="ChevronRight" size={14} />
                        </button>
                      )}
                    </div>

                    {/* Characteristics */}
                    <div className="text-xs text-gray-500 space-y-1.5">
                      <div className="font-semibold text-gray-700 mb-2 text-sm">Характеристики</div>
                      {[
                        { label: "Назначение", value: buildingTypes.find(b => b.id === form.buildingType)?.label?.split(" ").slice(0,2).join(" ") ?? "—" },
                        { label: "Площадь", value: `${area.toLocaleString("ru")} м²` },
                        { label: "Длина", value: `${form.length ?? 24} м` },
                        { label: "Ширина", value: `${form.width ?? 18} м` },
                        { label: "Высота", value: `${form.height ?? 3.6} м` },
                        { label: "Тип стен", value: form.wallType || "—" },
                        { label: "Кран-балка", value: form.cranBeam || "Нет" },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between">
                          <span>{row.label}</span>
                          <span className="font-medium text-gray-700 text-right max-w-[130px] truncate">{row.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Blurred price */}
                    <div className="mt-4 relative rounded-xl overflow-hidden border border-gray-200">
                      <div className="bg-orange-50 px-4 py-3">
                        <div className="text-xs text-gray-400 mb-1">Стоимость здания</div>
                        <div className="text-2xl font-extrabold blur-sm select-none" style={{ color: ACCENT }}>
                          {formatPrice(calculatePrice())}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5 blur-sm">
                          {Math.round(calculatePrice() / area).toLocaleString("ru")} ₽ / кв.м
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
                        <div className="text-xs text-gray-600 font-medium text-center px-4">
                          <Icon name="Lock" size={14} className="mx-auto mb-1 text-gray-400" />
                          Заполните форму, чтобы узнать стоимость
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div>
                    <h2 className="text-xl font-semibold mb-5">Узнать стоимость здания</h2>
                    <div className="space-y-3">
                      <div className="relative">
                        <Icon name="User" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Ваше имя *" value={form.name ?? ""}
                          onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setNameErr(false); }}
                          className={`w-full border-b pl-8 pr-3 py-2.5 text-sm focus:outline-none transition-colors bg-transparent ${nameErr ? "border-red-400" : "border-gray-300"}`}
                          onFocus={e => !nameErr && (e.currentTarget.style.borderColor = ACCENT)}
                          onBlur={e => (e.currentTarget.style.borderColor = nameErr ? "#f87171" : "#d1d5db")}
                        />
                        {nameErr && <div className="text-red-400 text-xs mt-0.5">Обязательное поле</div>}
                      </div>
                      <div className="relative">
                        <Icon name="Phone" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="tel" placeholder="Телефон * (+7 999 000-00-00)" value={form.phone ?? ""}
                          onChange={e => { handlePhoneInput(e.target.value); setPhoneErr(false); }}
                          className={`w-full border-b pl-8 pr-3 py-2.5 text-sm focus:outline-none transition-colors bg-transparent ${phoneErr ? "border-red-400" : "border-gray-300"}`}
                          onFocus={e => !phoneErr && (e.currentTarget.style.borderColor = ACCENT)}
                          onBlur={e => (e.currentTarget.style.borderColor = phoneErr ? "#f87171" : "#d1d5db")}
                        />
                        {phoneErr && <div className="text-red-400 text-xs mt-0.5">Введите корректный номер</div>}
                      </div>
                      <div className="relative">
                        <Icon name="Mail" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="email" placeholder="Email (необязательно)" value={form.email ?? ""}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full border-b border-gray-300 pl-8 pr-3 py-2.5 text-sm focus:outline-none transition-colors bg-transparent"
                          onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                          onBlur={e => (e.currentTarget.style.borderColor = "#d1d5db")}
                        />
                      </div>
                      <div className="pt-1 space-y-2">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input type="checkbox" className="mt-0.5" defaultChecked style={{ accentColor: ACCENT }} />
                          <span className="text-xs text-gray-500">
                            Я согласен на{" "}
                            <a href="#" className="underline" style={{ color: ACCENT }}>обработку персональных данных</a>
                          </span>
                        </label>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input type="checkbox" className="mt-0.5" style={{ accentColor: ACCENT }} />
                          <span className="text-xs text-gray-500">
                            Согласен на получение информационных и рекламных сообщений (необязательно)
                          </span>
                        </label>
                      </div>
                      <button onClick={handleSubmit}
                        className="w-full text-white font-bold text-sm tracking-wide uppercase py-3 mt-1 transition-colors"
                        style={{ backgroundColor: ACCENT }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#c96d27")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = ACCENT)}>
                        Узнать стоимость
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-400">{stepNum}/{totalSteps}</span>
              {!isLastQuizStep && (
                <button onClick={nextStep} className="text-sm hover:underline font-medium" style={{ color: ACCENT }}>
                  Следующая →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════ RESULT ══════ */}
      {step === "result" && (
        <div className="min-h-[calc(100vh-64px)] flex flex-col py-6 px-4">
          <div className={`max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 transition-all duration-220 ${animating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>
            <div className="px-8 pt-6 pb-4 border-b border-gray-100">
              <button onClick={() => goTo("contacts")} className="text-sm hover:underline flex items-center gap-1" style={{ color: ACCENT }}>
                ← Назад
              </button>
            </div>

            <div className="px-8 py-8 grid md:grid-cols-2 gap-8">
              <div>
                <div className="relative bg-gray-100 rounded-xl overflow-hidden h-48 mb-4">
                  <img src={RESULT_GALLERY[galleryIdx]} alt="" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                    {RESULT_GALLERY.map((_, i) => (
                      <button key={i} onClick={() => setGalleryIdx(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === galleryIdx ? "bg-white scale-125" : "bg-white/50"}`} />
                    ))}
                  </div>
                  {galleryIdx > 0 && (
                    <button onClick={() => setGalleryIdx(i => Math.max(0, i - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-7 h-7 rounded-full flex items-center justify-center">
                      <Icon name="ChevronLeft" size={15} />
                    </button>
                  )}
                  {galleryIdx < RESULT_GALLERY.length - 1 && (
                    <button onClick={() => setGalleryIdx(i => Math.min(RESULT_GALLERY.length - 1, i + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-7 h-7 rounded-full flex items-center justify-center">
                      <Icon name="ChevronRight" size={15} />
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-500 space-y-1.5">
                  <div className="font-semibold text-gray-700 mb-2 text-sm">Характеристики</div>
                  {[
                    { label: "Назначение", value: buildingTypes.find(b => b.id === form.buildingType)?.label?.split(" ").slice(0,2).join(" ") ?? "—" },
                    { label: "Площадь", value: `${area.toLocaleString("ru")} м²` },
                    { label: "Длина", value: `${form.length ?? 24} м` },
                    { label: "Ширина", value: `${form.width ?? 18} м` },
                    { label: "Высота", value: `${form.height ?? 3.6} м` },
                    { label: "Тип стен", value: form.wallType || "—" },
                    { label: "Кран-балка", value: form.cranBeam || "Нет" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between">
                      <span>{row.label}</span>
                      <span className="font-medium text-gray-700">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-400 mb-1">Стоимость здания ⓘ</div>
                  <div className="text-3xl font-extrabold text-[#1a1a1a]">{formatPrice(calculatePrice())}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {Math.round(calculatePrice() / area).toLocaleString("ru")} ₽ / кв.м
                  </div>
                  <p className="text-xs text-gray-400 mt-3">* стоимость дополнительных услуг будет рассчитана менеджером</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Узнать стоимость здания</h2>
                <div className="space-y-3 mb-5">
                  {[
                    { icon: "User", val: form.name ?? "" },
                    { icon: "Phone", val: form.phone ?? "" },
                    { icon: "Mail", val: form.email ?? "" },
                    { icon: "MapPin", val: form.region ?? "" },
                  ].filter(f => f.val).map((f) => (
                    <div key={f.icon} className="relative">
                      <Icon name={f.icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <div className="border-b border-gray-200 pl-8 pr-3 py-2.5 text-sm text-gray-700">{f.val}</div>
                    </div>
                  ))}
                </div>
                <button className="w-full text-white font-bold text-sm uppercase tracking-wide py-3 transition-colors"
                  style={{ backgroundColor: ACCENT }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#c96d27")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = ACCENT)}>
                  Узнать стоимость
                </button>
                <button onClick={() => goTo("intro")}
                  className="w-full mt-3 flex items-center justify-end gap-2 text-sm font-medium hover:underline" style={{ color: ACCENT }}>
                  Продолжить на сайте →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ THANK YOU MODAL ══════ */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setShowThankYou(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <Icon name="X" size={18} />
            </button>
            <h3 className="text-lg font-bold mb-2">Благодарим за интерес к решениям!</h3>
            <p className="text-sm text-gray-600 mb-4">Запрос успешно отправлен. В ближайшее время наш менеджер свяжется с вами, чтобы обсудить все детали.</p>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center mb-4">
              <div className="text-2xl mb-2">🎁</div>
              <p className="text-sm font-semibold text-gray-700">Вам подарок!</p>
              <p className="text-xs text-gray-500 mt-1">Эскиз 3D-визуализации вашего здания — бесплатно</p>
            </div>
            <p className="text-xs text-center text-gray-400 mb-4">Больше готовых решений на нашем сайте</p>
            <button onClick={() => { setShowThankYou(false); goTo("intro"); }}
              className="w-full text-white font-bold text-sm uppercase tracking-wide py-3 transition-colors"
              style={{ backgroundColor: ACCENT }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#c96d27")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = ACCENT)}>
              На главную
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
