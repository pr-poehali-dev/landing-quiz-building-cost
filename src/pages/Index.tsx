import { useState } from "react";
import Icon from "@/components/ui/icon";

const PRICE_PER_SQM = 15000;

const buildingTypes = [
  { id: "warehouse", label: "Склад", icon: "Warehouse", coeff: 1.0 },
  { id: "office", label: "Офис", icon: "Building2", coeff: 1.3 },
  { id: "production", label: "Производство", icon: "Factory", coeff: 1.2 },
  { id: "retail", label: "Торговый", icon: "ShoppingBag", coeff: 1.25 },
  { id: "residential", label: "Жилое", icon: "Home", coeff: 1.4 },
  { id: "agricultural", label: "Сельхоз", icon: "Tractor", coeff: 0.9 },
];

const materialTypes = [
  { id: "metal", label: "Металлоконструкции", icon: "Layers", coeff: 1.0 },
  { id: "concrete", label: "Железобетон", icon: "Building", coeff: 1.2 },
  { id: "wood", label: "Дерево / СИП", icon: "TreePine", coeff: 0.85 },
  { id: "sandwich", label: "Сэндвич-панели", icon: "LayoutGrid", coeff: 0.95 },
];

const deadlineOptions = [
  { id: "asap", label: "Как можно скорее", icon: "Zap" },
  { id: "3months", label: "До 3 месяцев", icon: "Clock" },
  { id: "6months", label: "До 6 месяцев", icon: "CalendarDays" },
  { id: "year", label: "До года", icon: "Calendar" },
];

const features = [
  { icon: "Shield", title: "Гарантия 10 лет", desc: "На все конструкции и работы" },
  { icon: "Award", title: "Опыт 15 лет", desc: "Более 500 реализованных объектов" },
  { icon: "Truck", title: "Собственное производство", desc: "Металлоконструкции изготавливаем сами" },
  { icon: "Headphones", title: "Поддержка 24/7", desc: "Персональный менеджер на весь срок" },
  { icon: "BarChart3", title: "Сдача в срок", desc: "98% объектов сданы без задержек" },
  { icon: "Banknote", title: "Рассрочка 0%", desc: "Удобный график платежей" },
];

type Step = "intro" | "type" | "area" | "floors" | "material" | "deadline" | "contacts" | "result";

interface FormData {
  buildingType: string;
  area: number;
  floors: number;
  material: string;
  deadline: string;
  name: string;
  phone: string;
  email: string;
}

const STEPS: Step[] = ["type", "area", "floors", "material", "deadline", "contacts"];
const STEP_LABELS = ["Тип", "Площадь", "Этажи", "Материал", "Сроки", "Контакты"];

export default function Index() {
  const [step, setStep] = useState<Step>("intro");
  const [form, setForm] = useState<Partial<FormData>>({ floors: 1, area: 500 });
  const [animating, setAnimating] = useState(false);

  const goTo = (next: Step) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 300);
  };

  const currentStepIdx = STEPS.indexOf(step as Step);
  const progress =
    step === "intro" ? 0 : step === "result" ? 100 : ((currentStepIdx + 1) / STEPS.length) * 100;

  const calculatePrice = () => {
    const building = buildingTypes.find((b) => b.id === form.buildingType);
    const material = materialTypes.find((m) => m.id === form.material);
    const bCoeff = building?.coeff ?? 1;
    const mCoeff = material?.coeff ?? 1;
    const area = form.area ?? 500;
    const floors = form.floors ?? 1;
    return Math.round(area * floors * PRICE_PER_SQM * bCoeff * mCoeff);
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="min-h-screen bg-[#0d0d12] font-golos text-white overflow-x-hidden">
      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.18)_0%,transparent_70%)]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.12)_0%,transparent_70%)]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.08)_0%,transparent_70%)]" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)]">
            <Icon name="Building2" size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">СтройЭксперт</span>
        </div>
        <a
          href="tel:+78001234567"
          className="hidden md:flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
        >
          <Icon name="Phone" size={14} />
          8 800 123-45-67
        </a>
      </header>

      {/* PROGRESS BAR */}
      {step !== "intro" && step !== "result" && (
        <div className="relative z-10 max-w-2xl mx-auto px-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    i < currentStepIdx
                      ? "bg-orange-500 text-white"
                      : i === currentStepIdx
                      ? "bg-orange-500 text-white ring-4 ring-orange-500/30 scale-110"
                      : "bg-white/10 text-white/30"
                  }`}
                >
                  {i < currentStepIdx ? <Icon name="Check" size={11} /> : i + 1}
                </div>
                <span
                  className={`text-[10px] hidden sm:block ${
                    i === currentStepIdx ? "text-orange-400" : "text-white/25"
                  }`}
                >
                  {STEP_LABELS[i]}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main
        className={`relative z-10 transition-all duration-300 ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        {/* ── INTRO ── */}
        {step === "intro" && (
          <section className="max-w-5xl mx-auto px-6 pt-8 pb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 rounded-full px-4 py-1.5 text-sm text-orange-300 mb-6">
                  <Icon name="Zap" size={13} />
                  Расчёт за 2 минуты
                </div>
                <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight mb-5">
                  Узнайте стоимость{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                    вашего здания
                  </span>{" "}
                  прямо сейчас
                </h1>
                <p className="text-white/55 text-lg mb-8 leading-relaxed">
                  Ответьте на 5 вопросов — получите точный расчёт и коммерческое предложение. Бесплатно и без обязательств.
                </p>
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {["Склады", "Офисы", "Производство", "Торговые площади"].map((tag) => (
                    <span
                      key={tag}
                      className="bg-white/8 border border-white/12 rounded-full px-4 py-1.5 text-sm text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => goTo("type")}
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_rgba(249,115,22,0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Рассчитать стоимость
                  <Icon
                    name="ArrowRight"
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <p className="mt-4 text-white/30 text-sm flex items-center gap-1.5">
                  <Icon name="Lock" size={12} />
                  Данные в безопасности. Без спама.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: "500+", label: "Объектов построено", icon: "Building2" },
                  { num: "15 лет", label: "На рынке", icon: "Award" },
                  { num: "98%", label: "Сдача в срок", icon: "Clock" },
                  { num: "10 лет", label: "Гарантия", icon: "Shield" },
                ].map((stat) => (
                  <div
                    key={stat.num}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 hover:border-orange-500/30 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center mb-3 group-hover:bg-orange-500/25 transition-colors">
                      <Icon name={stat.icon} size={18} className="text-orange-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-white mb-1">{stat.num}</div>
                    <div className="text-white/45 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── STEP: TYPE ── */}
        {step === "type" && (
          <QuizCard title="Какой тип здания вам нужен?" subtitle="Выберите один вариант">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {buildingTypes.map((b) => (
                <OptionCard
                  key={b.id}
                  icon={b.icon}
                  label={b.label}
                  selected={form.buildingType === b.id}
                  onClick={() => {
                    setForm((f) => ({ ...f, buildingType: b.id }));
                    setTimeout(() => goTo("area"), 300);
                  }}
                />
              ))}
            </div>
          </QuizCard>
        )}

        {/* ── STEP: AREA ── */}
        {step === "area" && (
          <QuizCard title="Общая площадь здания" subtitle="Укажите площадь в квадратных метрах">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-baseline gap-2">
                  <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                    {(form.area ?? 500).toLocaleString("ru")}
                  </span>
                  <span className="text-2xl text-white/40 font-medium">м²</span>
                </div>
              </div>
              <input
                type="range"
                min={50}
                max={10000}
                step={50}
                value={form.area ?? 500}
                onChange={(e) => setForm((f) => ({ ...f, area: Number(e.target.value) }))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #f97316 0%, #fbbf24 ${
                    (((form.area ?? 500) - 50) / (10000 - 50)) * 100
                  }%, rgba(255,255,255,0.15) ${
                    (((form.area ?? 500) - 50) / (10000 - 50)) * 100
                  }%, rgba(255,255,255,0.15) 100%)`,
                }}
              />
              <div className="flex justify-between text-white/30 text-sm">
                <span>50 м²</span>
                <span>10 000 м²</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[200, 500, 1000, 2000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setForm((f) => ({ ...f, area: v }))}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      form.area === v
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-orange-500/50 hover:text-white"
                    }`}
                  >
                    {v.toLocaleString("ru")}
                  </button>
                ))}
              </div>
              <NavButtons onBack={() => goTo("type")} onNext={() => goTo("floors")} />
            </div>
          </QuizCard>
        )}

        {/* ── STEP: FLOORS ── */}
        {step === "floors" && (
          <QuizCard title="Количество этажей" subtitle="Выберите этажность здания">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setForm((f) => ({ ...f, floors: Math.max(1, (f.floors ?? 1) - 1) }))}
                  className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 text-2xl font-bold hover:bg-orange-500/20 hover:border-orange-500/50 transition-all active:scale-95 text-white"
                >
                  −
                </button>
                <div className="text-center">
                  <div className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                    {form.floors ?? 1}
                  </div>
                  <div className="text-white/40 text-sm mt-1">
                    {(form.floors ?? 1) === 1
                      ? "этаж"
                      : (form.floors ?? 1) < 5
                      ? "этажа"
                      : "этажей"}
                  </div>
                </div>
                <button
                  onClick={() => setForm((f) => ({ ...f, floors: Math.min(20, (f.floors ?? 1) + 1) }))}
                  className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 text-2xl font-bold hover:bg-orange-500/20 hover:border-orange-500/50 transition-all active:scale-95 text-white"
                >
                  +
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 5, 10].map((v) => (
                  <button
                    key={v}
                    onClick={() => setForm((f) => ({ ...f, floors: v }))}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      form.floors === v
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-orange-500/50 hover:text-white"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <NavButtons onBack={() => goTo("area")} onNext={() => goTo("material")} />
            </div>
          </QuizCard>
        )}

        {/* ── STEP: MATERIAL ── */}
        {step === "material" && (
          <QuizCard title="Основной материал конструкции" subtitle="Выберите предпочтительный материал">
            <div className="grid grid-cols-2 gap-3">
              {materialTypes.map((m) => (
                <OptionCard
                  key={m.id}
                  icon={m.icon}
                  label={m.label}
                  selected={form.material === m.id}
                  onClick={() => {
                    setForm((f) => ({ ...f, material: m.id }));
                    setTimeout(() => goTo("deadline"), 300);
                  }}
                />
              ))}
            </div>
            <div className="mt-4">
              <NavButtons
                onBack={() => goTo("floors")}
                onNext={() => goTo("deadline")}
                nextDisabled={!form.material}
              />
            </div>
          </QuizCard>
        )}

        {/* ── STEP: DEADLINE ── */}
        {step === "deadline" && (
          <QuizCard title="Желаемые сроки строительства" subtitle="Когда нужно завершить объект?">
            <div className="grid grid-cols-2 gap-3">
              {deadlineOptions.map((d) => (
                <OptionCard
                  key={d.id}
                  icon={d.icon}
                  label={d.label}
                  selected={form.deadline === d.id}
                  onClick={() => {
                    setForm((f) => ({ ...f, deadline: d.id }));
                    setTimeout(() => goTo("contacts"), 300);
                  }}
                />
              ))}
            </div>
            <div className="mt-4">
              <NavButtons
                onBack={() => goTo("material")}
                onNext={() => goTo("contacts")}
                nextDisabled={!form.deadline}
              />
            </div>
          </QuizCard>
        )}

        {/* ── STEP: CONTACTS ── */}
        {step === "contacts" && (
          <QuizCard title="Куда отправить расчёт?" subtitle="Введите контактные данные — пришлём детальное КП">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/45 mb-1.5">Ваше имя *</label>
                <input
                  type="text"
                  placeholder="Иван Петров"
                  value={form.name ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-white/45 mb-1.5">Телефон *</label>
                <input
                  type="tel"
                  placeholder="+7 (999) 000-00-00"
                  value={form.phone ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-white/45 mb-1.5">Email (необязательно)</label>
                <input
                  type="email"
                  placeholder="ivan@example.com"
                  value={form.email ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all"
                />
              </div>
              <button
                onClick={() => goTo("result")}
                disabled={!form.name || !form.phone}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold text-lg py-4 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <Icon name="Calculator" size={20} />
                Получить расчёт
              </button>
              <p className="text-center text-white/25 text-xs flex items-center justify-center gap-1.5">
                <Icon name="Lock" size={11} />
                Нажимая кнопку, вы соглашаетесь с политикой обработки данных
              </p>
              <div className="pt-1">
                <button
                  onClick={() => goTo("deadline")}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-white/8 hover:text-white transition-all text-sm"
                >
                  <Icon name="ArrowLeft" size={15} />
                  Назад
                </button>
              </div>
            </div>
          </QuizCard>
        )}

        {/* ── RESULT ── */}
        {step === "result" && (
          <section className="max-w-3xl mx-auto px-6 py-8 pb-24">
            {/* Success header */}
            <div className="text-center mb-10">
              <div className="inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 items-center justify-center mb-5 shadow-[0_0_50px_rgba(249,115,22,0.5)]">
                <Icon name="CheckCircle" size={40} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Расчёт готов!</h2>
              <p className="text-white/45">Наш менеджер свяжется с вами в течение 15 минут</p>
            </div>

            {/* Price card */}
            <div className="relative bg-gradient-to-br from-orange-500/20 to-amber-400/10 border border-orange-500/40 rounded-3xl p-8 mb-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(249,115,22,0.15)_0%,transparent_70%)]" />
              <div className="relative">
                <div className="text-white/50 text-xs mb-2 uppercase tracking-widest font-medium">
                  Ориентировочная стоимость строительства
                </div>
                <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 mb-5">
                  {formatPrice(calculatePrice())}
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5 text-sm">
                  {[
                    {
                      label: "Тип здания",
                      value: buildingTypes.find((b) => b.id === form.buildingType)?.label ?? "—",
                    },
                    { label: "Площадь", value: `${(form.area ?? 0).toLocaleString("ru")} м²` },
                    { label: "Этажей", value: String(form.floors ?? 1) },
                    {
                      label: "Материал",
                      value: materialTypes.find((m) => m.id === form.material)?.label ?? "—",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between bg-white/8 rounded-xl px-4 py-2.5"
                    >
                      <span className="text-white/45">{row.label}</span>
                      <span className="font-semibold text-white">{row.value}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-white/30 text-xs">
                  * Итоговая стоимость уточняется после осмотра участка и технического задания
                </p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="grid sm:grid-cols-2 gap-3 mb-12">
              <button className="bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold py-4 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.6)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                <Icon name="Phone" size={18} />
                Позвонить сейчас
              </button>
              <button className="bg-white/8 border border-white/15 text-white font-semibold py-4 rounded-2xl hover:bg-white/12 hover:border-orange-500/40 transition-all flex items-center justify-center gap-2">
                <Icon name="MessageSquare" size={18} />
                Написать в WhatsApp
              </button>
            </div>

            {/* UTP Block */}
            <div className="mb-12">
              <h3 className="text-2xl font-extrabold text-center mb-6">
                Почему выбирают{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                  СтройЭксперт
                </span>
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-orange-500/30 hover:bg-white/8 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center mb-3 group-hover:bg-orange-500/25 transition-colors">
                      <Icon name={f.icon} size={18} className="text-orange-400" />
                    </div>
                    <div className="font-bold mb-1 text-white">{f.title}</div>
                    <div className="text-white/45 text-sm">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contacts */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6 text-center text-white">
                Свяжитесь с нами любым удобным способом
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { icon: "Phone", label: "Телефон", value: "8 800 123-45-67", sub: "Бесплатно по России" },
                  { icon: "Mail", label: "Email", value: "info@stroy.ru", sub: "Ответим за 1 час" },
                  { icon: "MapPin", label: "Офис", value: "Москва, Строителей 1", sub: "Пн–Пт 9:00–18:00" },
                ].map((c) => (
                  <div key={c.label} className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center mx-auto mb-2">
                      <Icon name={c.icon} size={18} className="text-orange-400" />
                    </div>
                    <div className="text-white/35 text-xs uppercase tracking-wider mb-1">{c.label}</div>
                    <div className="font-semibold text-sm text-white mb-0.5">{c.value}</div>
                    <div className="text-white/35 text-xs">{c.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* ─── Sub-components ─── */

function QuizCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-4">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-1 text-white">{title}</h2>
        <p className="text-white/45 mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

function OptionCard({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-200 hover:scale-105 active:scale-95 ${
        selected
          ? "bg-orange-500/20 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
          : "bg-white/5 border-white/10 hover:border-orange-500/40 hover:bg-white/8"
      }`}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
          <Icon name="Check" size={10} className="text-white" />
        </div>
      )}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
          selected ? "bg-orange-500/30" : "bg-white/8"
        }`}
      >
        <Icon name={icon} size={22} className={selected ? "text-orange-400" : "text-white/55"} />
      </div>
      <span
        className={`text-sm font-semibold text-center leading-tight ${
          selected ? "text-white" : "text-white/65"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextDisabled,
}: {
  onBack?: () => void;
  onNext: (() => void) | null;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex gap-3 pt-2">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/55 hover:bg-white/8 hover:text-white transition-all text-sm"
        >
          <Icon name="ArrowLeft" size={15} />
          Назад
        </button>
      )}
      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          Далее
          <Icon name="ArrowRight" size={15} />
        </button>
      )}
    </div>
  );
}