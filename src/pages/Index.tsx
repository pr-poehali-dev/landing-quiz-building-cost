import { useState } from "react";
import Icon from "@/components/ui/icon";

const PRICE_PER_SQM = 15000;

/* ─────────────────── DATA ─────────────────── */

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
  { num: "300+", desc: "Реализовали премиум проектов — в нашем портфеле более 300 зданий под ключ" },
  { num: "40 Дн.", desc: "За всего 40 дней мы обеспечиваем поставку и монтаж быстровозводимых зданий SMALL BOX для малого и среднего бизнеса" },
  { num: "500+ ТЫС.КВ.М", desc: "Запроектированных объектов в нашем портфеле и более 300 тыс.кв.м построенных объектов BIG BOX" },
  { num: "60+", desc: "Запроектировали многоуровневых паркингов на 50000 машиномест и построили более 20 паркингов на 5000 машиномест" },
];

type Step = "intro" | "purpose" | "region" | "params" | "services" | "contacts" | "result";

interface FormData {
  buildingType: string;
  region: string;
  length: number;
  width: number;
  height: number;
  services: string[];
  name: string;
  phone: string;
  email: string;
}

const QUIZ_STEPS: Step[] = ["purpose", "region", "params", "services", "contacts"];

/* ─────────────────── ROOT ─────────────────── */

export default function Index() {
  const [step, setStep] = useState<Step>("intro");
  const [form, setForm] = useState<Partial<FormData>>({
    length: 12,
    width: 18,
    height: 3.6,
    services: ["supply"],
  });
  const [animating, setAnimating] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [regionInput, setRegionInput] = useState("");
  const [regionSuggestions, setRegionSuggestions] = useState<string[]>([]);

  const goTo = (next: Step) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 250);
  };

  const quizStepIdx = QUIZ_STEPS.indexOf(step as Step);
  const stepNum = quizStepIdx + 1;
  const totalSteps = QUIZ_STEPS.length;

  const calculatePrice = () => {
    const building = buildingTypes.find((b) => b.id === form.buildingType);
    const coeff = building?.coeff ?? 1.0;
    const area = (form.length ?? 12) * (form.width ?? 18);
    return Math.round(area * PRICE_PER_SQM * coeff);
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("ru-RU").format(n) + " ₽";

  const pricePerSqm = () => {
    const area = (form.length ?? 12) * (form.width ?? 18);
    if (area === 0) return 0;
    return Math.round(calculatePrice() / area);
  };

  const toggleService = (id: string) => {
    setForm((f) => {
      const prev = f.services ?? [];
      return {
        ...f,
        services: prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
      };
    });
  };

  const handleRegionInput = (val: string) => {
    setRegionInput(val);
    const cities = [
      "Москва", "Санкт-Петербург", "Нижний Новгород", "Новосибирск", "Екатеринбург",
      "Казань", "Краснодар", "Ростов-на-Дону", "Самара", "Уфа", "Пермь", "Волгоград",
      "Воронеж", "Красноярск", "Саратов", "Тюмень", "Тольятти", "Ижевск", "Барнаул",
    ];
    if (val.length >= 2) {
      setRegionSuggestions(cities.filter((c) => c.toLowerCase().startsWith(val.toLowerCase())));
    } else {
      setRegionSuggestions([]);
    }
  };

  const isQuizStep = QUIZ_STEPS.includes(step as Step);

  return (
    <div className="min-h-screen bg-[#f2f2f2] font-golos text-[#1a1a1a]">

      {/* ══════════ HEADER ══════════ */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-0.5">
                <span className="text-[#E8521A] font-extrabold text-sm tracking-wider">ЕВРАЗ</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[#4A5568] font-bold text-xs tracking-widest">STEEL</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[#E8521A] font-extrabold text-sm tracking-wider">BOX</span>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-gray-200 mx-2" />
            <p className="hidden sm:block text-xs text-gray-500 max-w-[180px] leading-tight">
              Российский разработчик и поставщик полнокомплектных быстровозводимых зданий на металлическом каркасе
            </p>
          </div>

          {/* Center: schedule */}
          <div className="hidden md:flex flex-col items-center text-xs text-gray-500">
            <span className="font-semibold text-gray-700 mb-0.5">Время и график работы</span>
            <span>Пн — Пт&nbsp;&nbsp;&nbsp;09:30 — 18:00</span>
          </div>

          {/* Right: contacts */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end text-xs">
              <a href="tel:+78003026529" className="font-bold text-gray-800 hover:text-[#E8521A] transition-colors text-sm">
                +7 (800) 302-65-29
              </a>
              <a href="mailto:sales.box@evrazsteel.ru" className="text-[#E8521A] hover:underline">
                sales.box@evrazsteel.ru
              </a>
            </div>
            <a
              href="https://t.me/evrazsteelbox"
              className="hidden md:flex items-center gap-1.5 bg-[#229ED9] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#1a8ec4] transition-colors"
            >
              <Icon name="Send" size={13} />
              Telegram
            </a>
            <button
              onClick={() => goTo("purpose")}
              className="text-xs font-semibold border border-gray-400 text-gray-700 px-3 py-1.5 rounded hover:border-[#E8521A] hover:text-[#E8521A] transition-colors whitespace-nowrap"
            >
              Обратный звонок
            </button>
          </div>
        </div>
      </header>

      {/* ══════════ INTRO / HERO ══════════ */}
      {step === "intro" && (
        <>
          {/* Hero section */}
          <section className="bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left */}
                <div>
                  <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center mb-0 overflow-hidden">
                    <img
                      src="https://cdn.poehali.dev/projects/a66bce2f-f3b3-49bb-90f6-105891880449/bucket/f51bccfe-5845-4c17-a884-c4e1cfb38d5b.png"
                      alt="Здание"
                      className="w-full h-full object-cover opacity-70"
                    />
                  </div>
                  <div className="mt-6">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                      Спроектируем, изготовим и построим здание за{" "}
                      <span className="text-[#E8521A]">40 дней</span>
                    </h1>
                    <p className="text-gray-600 text-lg mb-6">
                      Пройдите тест за <strong>1 минуту</strong> чтобы узнать стоимость и получить расчет
                    </p>
                    <button
                      onClick={() => goTo("purpose")}
                      className="inline-flex items-center gap-3 bg-[#E8521A] text-white font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#d4481a] transition-colors"
                    >
                      РАССЧИТАТЬ СТОИМОСТЬ →
                    </button>
                  </div>
                </div>

                {/* Right: stats */}
                <div className="space-y-5">
                  {features.map((f) => (
                    <div key={f.num} className="flex items-start gap-4">
                      <div className="text-[#E8521A] font-extrabold text-2xl md:text-3xl leading-none shrink-0 min-w-[90px]">
                        {f.num}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed pt-1">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Projects section */}
          <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
            <h2 className="text-xl font-bold mb-6">Примеры реализованных проектов:</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Склад для хранения металлоизделий, 18×30×6 м", area: "540 кв.м", cat: "Склады и ангары", region: "Россия, Ярославская обл., г. Рыбинск" },
                { name: "Производственный цех, 24×48×8 м", area: "1152 кв.м", cat: "Производственные здания", region: "Россия, Московская обл., г. Подольск" },
                { name: "Торговый центр, 30×60×6 м", area: "1800 кв.м", cat: "Магазины и торговые здания", region: "Россия, Краснодарский край, г. Сочи" },
              ].map((p) => (
                <div key={p.name} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="bg-gray-100 h-40 flex items-center justify-center">
                    <Icon name="Building2" size={48} className="text-gray-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 leading-tight">{p.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <Icon name="MapPin" size={11} />
                      {p.region}
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

          {/* Bottom CTA banner */}
          <div className="bg-white border-t border-gray-200 sticky bottom-0 z-40">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
              <p className="text-sm md:text-base font-medium text-gray-700">
                Пройдите тест за <strong>1 минуту</strong> чтобы узнать стоимость вашего здания
              </p>
              <button
                onClick={() => goTo("purpose")}
                className="shrink-0 bg-[#E8521A] text-white font-bold text-sm tracking-wider uppercase px-6 py-3 hover:bg-[#d4481a] transition-colors whitespace-nowrap"
              >
                РАССЧИТАТЬ →
              </button>
            </div>
          </div>
        </>
      )}

      {/* ══════════ QUIZ WRAPPER ══════════ */}
      {isQuizStep && (
        <div className="min-h-[calc(100vh-64px)] flex flex-col py-6 px-4">
          <div
            className={`max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col transition-all duration-250 ${
              animating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
            }`}
          >
            {/* Quiz header */}
            <div className="px-8 pt-7 pb-4 border-b border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const prev: Step[] = ["intro", ...QUIZ_STEPS];
                  const idx = prev.indexOf(step);
                  goTo(prev[Math.max(0, idx - 1)]);
                }}
                className="text-[#E8521A] text-sm hover:underline flex items-center gap-1"
              >
                ← Назад
              </button>
              {step !== "contacts" && (
                <button
                  onClick={() => {
                    const idx = QUIZ_STEPS.indexOf(step as Step);
                    if (idx < QUIZ_STEPS.length - 1) goTo(QUIZ_STEPS[idx + 1]);
                  }}
                  className="text-[#E8521A] text-sm hover:underline"
                >
                  Следующая →
                </button>
              )}
            </div>

            {/* Quiz body */}
            <div className="px-8 py-8 flex-1">

              {/* ── STEP 1: PURPOSE ── */}
              {step === "purpose" && (
                <div>
                  <h2 className="text-xl font-semibold text-center mb-8">Назначение здания:</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {buildingTypes.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setForm((f) => ({ ...f, buildingType: b.id }));
                          setTimeout(() => goTo("region"), 200);
                        }}
                        className={`flex flex-col items-center justify-center text-center p-4 rounded-xl border-2 text-sm leading-tight min-h-[80px] transition-all hover:border-[#E8521A] hover:bg-orange-50 active:scale-95 ${
                          form.buildingType === b.id
                            ? "border-[#E8521A] bg-orange-50 font-semibold"
                            : "border-gray-200 bg-gray-50 text-gray-700"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 2: REGION ── */}
              {step === "region" && (
                <div>
                  <h2 className="text-xl font-semibold text-center mb-8">Регион строительства</h2>
                  <div className="max-w-sm mx-auto relative">
                    <input
                      type="text"
                      value={regionInput}
                      onChange={(e) => handleRegionInput(e.target.value)}
                      placeholder="Нижний Но...."
                      className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E8521A] transition-colors"
                    />
                    {regionSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded shadow-lg z-20 mt-0.5">
                        {regionSuggestions.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setForm((f) => ({ ...f, region: c }));
                              setRegionInput(c);
                              setRegionSuggestions([]);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                    {form.region && !regionSuggestions.length && (
                      <div className="mt-1 border border-gray-200 rounded px-4 py-2.5 text-sm text-gray-700 bg-gray-50">
                        {form.region}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── STEP 3: PARAMS ── */}
              {step === "params" && (
                <div>
                  <h2 className="text-xl font-semibold text-center mb-8">Параметры здания</h2>
                  <div className="max-w-sm mx-auto space-y-5">
                    {(
                      [
                        { key: "length", label: "Длина", min: 6, max: 200, step: 0.5 },
                        { key: "width", label: "Ширина", min: 6, max: 100, step: 0.5 },
                        { key: "height", label: "Высота", min: 2.5, max: 20, step: 0.1 },
                      ] as const
                    ).map(({ key, label, min, max, step: s }) => (
                      <div key={key} className="flex items-center gap-4">
                        <label className="w-16 text-sm text-gray-600 font-medium">{label}</label>
                        <div className="flex-1">
                          <div className="text-xs text-gray-400 mb-1 text-center">Количество, м</div>
                          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                            <button
                              onClick={() =>
                                setForm((f) => ({
                                  ...f,
                                  [key]: Math.max(min, parseFloat(((f[key] as number) ?? min - s - s).toFixed(1)) - s),
                                }))
                              }
                              className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
                            >
                              ‹
                            </button>
                            <input
                              type="number"
                              value={form[key] ?? min}
                              min={min}
                              max={max}
                              step={s}
                              onChange={(e) =>
                                setForm((f) => ({ ...f, [key]: parseFloat(e.target.value) || min }))
                              }
                              className="flex-1 text-center py-2 text-sm font-semibold focus:outline-none border-x border-gray-300"
                            />
                            <button
                              onClick={() =>
                                setForm((f) => ({
                                  ...f,
                                  [key]: Math.min(max, parseFloat(((f[key] as number ?? min) + s).toFixed(1))),
                                }))
                              }
                              className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
                            >
                              ›
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-6">
                    Площадь: {((form.length ?? 12) * (form.width ?? 18)).toLocaleString("ru")} м²
                  </p>
                </div>
              )}

              {/* ── STEP 4: SERVICES ── */}
              {step === "services" && (
                <div>
                  <h2 className="text-xl font-semibold text-center mb-8">Дополнительные услуги</h2>
                  <div className="space-y-3 max-w-lg mx-auto">
                    {additionalServices.map((s) => {
                      const checked = (form.services ?? []).includes(s.id);
                      return (
                        <label
                          key={s.id}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div
                            onClick={() => toggleService(s.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                              checked ? "bg-[#E8521A] border-[#E8521A]" : "border-gray-300 group-hover:border-[#E8521A]"
                            }`}
                          >
                            {checked && <Icon name="Check" size={11} className="text-white" />}
                          </div>
                          <span className="text-sm text-gray-700">{s.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── STEP 5: CONTACTS ── */}
              {step === "contacts" && (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left: preview */}
                  <div>
                    <div className="bg-gray-100 rounded-lg h-44 flex items-center justify-center mb-4 overflow-hidden">
                      <Icon name="Building2" size={64} className="text-gray-300" />
                    </div>
                    <div className="text-xs text-gray-500 space-y-1.5">
                      <div className="font-semibold text-gray-700 mb-2">Характеристики</div>
                      <div className="flex justify-between">
                        <span>Назначение здания</span>
                        <span className="font-medium text-gray-700 text-right max-w-[120px]">
                          {buildingTypes.find((b) => b.id === form.buildingType)?.label ?? "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Длина</span>
                        <span className="font-medium text-gray-700">{form.length ?? 12} м</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ширина</span>
                        <span className="font-medium text-gray-700">{form.width ?? 18} м</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Высота</span>
                        <span className="font-medium text-gray-700">{form.height ?? 3.6} м</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: form */}
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Узнать стоимость здания</h2>
                    <div className="space-y-3">
                      <div className="relative">
                        <Icon name="User" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Ваше имя"
                          value={form.name ?? ""}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className="w-full border-b border-gray-300 focus:border-[#E8521A] pl-8 pr-3 py-2.5 text-sm focus:outline-none transition-colors bg-transparent"
                        />
                      </div>
                      <div className="relative">
                        <Icon name="Phone" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="E-mail или телефон"
                          value={form.phone ?? ""}
                          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                          className="w-full border-b border-gray-300 focus:border-[#E8521A] pl-8 pr-3 py-2.5 text-sm focus:outline-none transition-colors bg-transparent"
                        />
                      </div>
                      <div className="relative">
                        <Icon name="MapPin" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Регион"
                          value={form.region ?? ""}
                          onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                          className="w-full border-b border-gray-300 focus:border-[#E8521A] pl-8 pr-3 py-2.5 text-sm focus:outline-none transition-colors bg-transparent"
                        />
                      </div>

                      <div className="pt-2 space-y-2">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input type="checkbox" className="mt-0.5 accent-[#E8521A]" defaultChecked />
                          <span className="text-xs text-gray-500">
                            Я согласен на{" "}
                            <a href="#" className="text-[#E8521A] underline">
                              обработку персональных данных
                            </a>
                          </span>
                        </label>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input type="checkbox" className="mt-0.5 accent-[#E8521A]" defaultChecked />
                          <span className="text-xs text-gray-500">
                            Я даю согласие на получение информационных и рекламных сообщений и{" "}
                            <a href="#" className="text-[#E8521A] underline">
                              согласен
                            </a>{" "}
                            на обработку персональных данных для этих целей.
                          </span>
                        </label>
                      </div>

                      <button
                        onClick={() => {
                          goTo("result");
                          setTimeout(() => setShowThankYou(true), 1000);
                        }}
                        disabled={!form.name || !form.phone}
                        className="w-full bg-[#E8521A] text-white font-bold text-sm tracking-wide uppercase py-3 mt-2 hover:bg-[#d4481a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Узнать стоимость
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quiz footer: step counter */}
            <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">
                {stepNum}/{totalSteps}
              </span>
              <button
                onClick={() => {
                  const idx = QUIZ_STEPS.indexOf(step as Step);
                  if (idx < QUIZ_STEPS.length - 1) goTo(QUIZ_STEPS[idx + 1]);
                }}
                className="text-[#E8521A] text-sm hover:underline font-medium"
              >
                Следующая →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ RESULT ══════════ */}
      {step === "result" && (
        <div className="min-h-[calc(100vh-64px)] flex flex-col py-6 px-4">
          <div
            className={`max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 transition-all duration-250 ${
              animating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
            }`}
          >
            {/* Back */}
            <div className="px-8 pt-7 pb-4 border-b border-gray-100">
              <button
                onClick={() => goTo("contacts")}
                className="text-[#E8521A] text-sm hover:underline flex items-center gap-1"
              >
                ← Назад
              </button>
            </div>

            <div className="px-8 py-8 grid md:grid-cols-2 gap-8">
              {/* Left: summary */}
              <div>
                <div className="bg-gray-100 rounded-lg h-44 flex items-center justify-center mb-4 overflow-hidden">
                  <Icon name="Building2" size={64} className="text-gray-300" />
                </div>
                <div className="text-xs text-gray-500 space-y-1.5">
                  <div className="font-semibold text-gray-700 mb-2">Характеристики</div>
                  <div className="flex justify-between">
                    <span>Назначение здания</span>
                    <span className="font-medium text-gray-700 text-right max-w-[130px]">
                      {buildingTypes.find((b) => b.id === form.buildingType)?.label ?? "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Длина</span>
                    <span className="font-medium text-gray-700">{form.length ?? 12} м</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ширина</span>
                    <span className="font-medium text-gray-700">{form.width ?? 18} м</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Высота</span>
                    <span className="font-medium text-gray-700">{form.height ?? 3.6} м</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-400 mb-1">Стоимость здания ⓘ</div>
                  <div className="text-3xl font-extrabold text-gray-900">
                    {formatPrice(calculatePrice())}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {pricePerSqm().toLocaleString("ru")} ₽ / кв.м
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    * стоимость дополнительных услуг будет рассчитана менеджером
                  </p>
                </div>
              </div>

              {/* Right: contacts form / CTA */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Узнать стоимость здания</h2>
                <div className="space-y-3 mb-5">
                  <div className="relative">
                    <Icon name="User" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      value={form.name ?? ""}
                      readOnly
                      className="w-full border-b border-gray-300 pl-8 pr-3 py-2.5 text-sm focus:outline-none bg-transparent text-gray-700"
                    />
                  </div>
                  <div className="relative">
                    <Icon name="Phone" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="E-mail или телефон"
                      value={form.phone ?? ""}
                      readOnly
                      className="w-full border-b border-gray-300 pl-8 pr-3 py-2.5 text-sm focus:outline-none bg-transparent text-gray-700"
                    />
                  </div>
                  <div className="relative">
                    <Icon name="MapPin" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Регион"
                      value={form.region ?? ""}
                      readOnly
                      className="w-full border-b border-gray-300 pl-8 pr-3 py-2.5 text-sm focus:outline-none bg-transparent text-gray-700"
                    />
                  </div>
                </div>
                <button className="w-full bg-[#E8521A] text-white font-bold text-sm tracking-wide uppercase py-3 hover:bg-[#d4481a] transition-colors">
                  Узнать стоимость
                </button>
                <button
                  onClick={() => goTo("intro")}
                  className="w-full mt-3 flex items-center justify-end gap-2 text-[#E8521A] text-sm font-medium hover:underline"
                >
                  Продолжить на сайте →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ THANK YOU MODAL ══════════ */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowThankYou(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon name="X" size={18} />
            </button>
            <h3 className="text-lg font-bold mb-2">Благодарим за интерес к решениям!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Запрос успешно отправлен. В ближайшее время наш менеджер свяжется с вами, чтобы обсудить все детали.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center mb-4">
              <div className="text-2xl mb-2">🎁</div>
              <p className="text-sm font-semibold text-gray-700">Вам подарок!</p>
              <p className="text-xs text-gray-500 mt-1">Эскиз 3D-визуализации вашего здания — бесплатно</p>
            </div>
            <p className="text-xs text-center text-gray-400 mb-4">
              Больше готовых решений на нашем сайте
            </p>
            <button
              onClick={() => {
                setShowThankYou(false);
                goTo("intro");
              }}
              className="w-full bg-[#E8521A] text-white font-bold text-sm uppercase tracking-wide py-3 hover:bg-[#d4481a] transition-colors"
            >
              На главную
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
