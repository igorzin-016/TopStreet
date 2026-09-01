import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Home,
  Info,
  Image as ImageIcon,
  UserCheck,
  MapPin,
  ChevronDown,
  Gauge,
  Zap,
  Flag,
  Timer,
  PlayCircle,
  X,
  ArrowRight,
  Car,
  ShieldCheck,
  Trophy,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Fuel,
  Wind,
  Trophy as SponsorTire,
  Dumbbell,
  Droplet,
  Sandwich,
  Wrench,
  Layers,
  Spade,
  Mountain,
  Flame,
  Award,
  Truck,
  Phone,
  Navigation,
  MessageCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                      */
/* ------------------------------------------------------------------ */
const C = {
  base: "#171615",
  surface: "#201F1D",
  surface2: "#2A2926",
  surface3: "#37352F",
  line: "#4A473F",
  red: "#E42313",
  redDark: "#8C1509",
  amber: "#FFB627",
  green: "#C6FF4D",
  greenDark: "#7CA82E",
  text: "#F3F1EA",
  textMute: "#A6A196",
  textFaint: "#6E6A60",
};

const FONT_DISPLAY = "'Space Grotesk', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_BODY = "'Inter', sans-serif";
const LOGO_SRC = "/top-street-logo.png";

const SECTIONS = [
  { id: "home", label: "Início", icon: Home },
  { id: "sobre", label: "Sobre", icon: Info },
  { id: "patrocinadores", label: "Patrocinadores", icon: Award },
  { id: "midia", label: "Mí­dia", icon: ImageIcon },
  { id: "pilotos", label: "Pilotos", icon: UserCheck },
  { id: "contato", label: "Contato", icon: MapPin },
];

/* ------------------------------------------------------------------ */
/*  GLOBAL STYLE / FONT INJECTION                                      */
/* ------------------------------------------------------------------ */
function GlobalStyle() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <style>{`
      .ts-root { font-family: ${FONT_BODY}; background:${C.base}; color:${C.text}; }
      .ts-display { font-family: ${FONT_DISPLAY}; }
      .ts-mono { font-family: ${FONT_MONO}; }
      .ts-noise {
        background-image: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.035), transparent 40%),
                           radial-gradient(circle at 80% 60%, rgba(255,255,255,0.03), transparent 45%),
                           repeating-linear-gradient(115deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px);
      }
      @keyframes ts-blur-stream {
        0% { transform: translateX(-10%); opacity: 0; }
        15% { opacity: .55; }
        85% { opacity: .55; }
        100% { transform: translateX(110%); opacity: 0; }
      }
      .ts-stream { animation: ts-blur-stream 2.4s linear infinite; }
      @keyframes ts-flicker { 0%,100%{opacity:1} 50%{opacity:.55} }
      .ts-flicker { animation: ts-flicker 1.6s ease-in-out infinite; }
      @keyframes ts-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      .ts-float { animation: ts-float 5s ease-in-out infinite; }
      .ts-scrollbar::-webkit-scrollbar{ height:6px; width:6px; }
      .ts-scrollbar::-webkit-scrollbar-thumb{ background:${C.line}; border-radius:4px; }
      @media (prefers-reduced-motion: reduce) {
        .ts-stream, .ts-flicker, .ts-float, .ts-anim { animation: none !important; transition: none !important; }
      }
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
/*  SCROLL PROGRESS STRIP  (the "drag strip" signature element)        */
/* ------------------------------------------------------------------ */
const MARKERS = [
  { label: "60'", at: 0.06 },
  { label: "330'", at: 0.22 },
  { label: "1/8", at: 0.4 },
  { label: "1000'", at: 0.62 },
  { label: "1/4 MI", at: 0.92 },
];

function ScrollStrip({ progress }) {
  const pct = Math.min(Math.max(progress, 0), 1);
  const et = (9.9 - pct * 5.35).toFixed(3); // simulated elapsed time, drops as you "race" down the page
  const mph = Math.round(pct * 214);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[70]"
      style={{ height: 5, background: C.surface2, borderBottom: `1px solid ${C.line}` }}
    >
      <div
        className="h-full"
        style={{
          width: `${pct * 100}%`,
          background: `linear-gradient(90deg, ${C.red}, ${C.amber} 60%, ${C.green})`,
          transition: "width 60ms linear",
        }}
      />
      {/* car marker */}
      <div
        className="absolute top-0 -translate-y-1/2"
        style={{ left: `calc(${pct * 100}% - 10px)`, transition: "left 60ms linear" }}
      >
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: 20,
            height: 20,
            background: C.base,
            border: `2px solid ${pct > 0.9 ? C.green : C.red}`,
            boxShadow: `0 0 12px ${pct > 0.9 ? C.green : C.red}66`,
          }}
        >
          <Car size={11} color={pct > 0.9 ? C.green : C.red} />
        </div>
      </div>

      {/* markers, desktop only */}
      <div className="hidden md:block">
        {MARKERS.map((m) => (
          <div
            key={m.label}
            className="absolute top-2 ts-mono"
            style={{
              left: `${m.at * 100}%`,
              fontSize: 9,
              letterSpacing: 1,
              color: pct >= m.at ? C.text : C.textFaint,
              transform: "translateX(-50%)",
            }}
          >
            {m.label}
          </div>
        ))}
      </div>

      {/* telemetry readout */}
      <div
        className="hidden sm:flex fixed top-2 right-4 items-center gap-3 ts-mono px-3 py-1 rounded-full"
        style={{
          fontSize: 11,
          background: "rgba(32,31,29,0.72)",
          border: `1px solid ${C.line}`,
          backdropFilter: "blur(8px)",
          color: C.textMute,
        }}
      >
        <span>
          ET <b style={{ color: C.text }}>{pct > 0.01 ? et : "9.900"}</b>s
        </span>
        <span style={{ color: C.line }}>/</span>
        <span>
          <b style={{ color: C.text }}>{mph}</b> MPH
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FLOATING NAV                                                       */
/* ------------------------------------------------------------------ */
function FloatingNav({ active, onNavigate }) {
  return (
    <nav className="fixed top-6 left-0 right-0 z-[60] flex justify-center px-4">
      <div
        className="flex items-center gap-1 rounded-full px-2 py-2"
        style={{
          background: "rgba(32,31,29,0.65)",
          border: `1px solid ${C.line}`,
          backdropFilter: "blur(14px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
        }}
      >
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className="flex items-center gap-1.5 rounded-full transition-all duration-300 px-2.5 sm:px-4 py-2"
              style={{
                background: isActive ? C.red : "transparent",
                color: isActive ? "#fff" : C.textMute,
              }}
            >
              <Icon size={15} />
              <span className="hidden sm:inline ts-display text-xs tracking-wide uppercase" style={{ fontWeight: 600 }}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  CHRISTMAS TREE (staging lights) â€” recurring motif                  */
/* ------------------------------------------------------------------ */
function TreeLights() {
  const [step, setStep] = useState(-1); // -1 idle, 0-2 amber, 3 green, 4 hold
  useEffect(() => {
    let i = -1;
    const seq = () => {
      i += 1;
      setStep(i % 6);
    };
    const id = setInterval(seq, 550);
    return () => clearInterval(id);
  }, []);

  const dots = [0, 1, 2]; // three ambers
  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="flex items-center gap-1 mb-1">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: 7,
              height: 7,
              background: step >= 0 ? C.amber : C.surface3,
              boxShadow: step >= 0 ? `0 0 8px ${C.amber}` : "none",
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        {dots.map((d) => (
          <div
            key={d}
            className="rounded-full"
            style={{
              width: 16,
              height: 16,
              background: step > d ? C.amber : C.surface3,
              boxShadow: step > d ? `0 0 14px ${C.amber}` : "none",
              transition: "all .15s ease",
            }}
          />
        ))}
      </div>
      <div
        className="rounded-full mt-1"
        style={{
          width: 20,
          height: 20,
          background: step >= 4 ? C.green : C.surface3,
          boxShadow: step >= 4 ? `0 0 20px ${C.green}` : "none",
          transition: "all .15s ease",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DIAGONAL SECTION WRAPPER                                           */
/* ------------------------------------------------------------------ */
function Section({ id, innerRef, children, bg = C.base, className = "" }) {
  return (
    <section
      id={id}
      ref={innerRef}
      className={`relative w-full ${className}`}
      style={{ background: bg }}
    >
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO / HOME                                                        */
/* ------------------------------------------------------------------ */
function Hero({ innerRef, onNavigate }) {
  return (
    <Section id="home" innerRef={innerRef} bg={C.base} className="min-h-screen overflow-hidden">
      <div className="absolute inset-0 ts-noise" />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${C.base} 0%, ${C.surface} 55%, ${C.base} 100%)`,
        }}
      />
      {/* asphalt lane lines */}
      <div className="absolute bottom-0 left-0 right-0 h-[38%] opacity-40" style={{
        background: `repeating-linear-gradient(90deg, transparent 0 60px, ${C.line} 60px 64px)`,
        maskImage: "linear-gradient(to top, black, transparent)",
      }} />

      {/* speed streaks */}
      <div className="absolute inset-0 pointer-events-none">
        {[18, 34, 52, 68, 82].map((top, i) => (
          <div
            key={i}
            className="ts-stream absolute h-[2px] rounded-full"
            style={{
              top: `${top}%`,
              left: 0,
              width: `${18 + i * 6}%`,
              background: i % 2 === 0 ? C.red : C.amber,
              animationDelay: `${i * 0.35}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-24 pb-16">
        <div
          className="ts-mono uppercase text-xs tracking-[0.35em] mb-6 px-3 py-1 rounded-full"
          style={{ color: C.amber, border: `1px solid ${C.amber}44` }}
        >
          Autódromo de Tarumã · RS
        </div>

        <img
          src={LOGO_SRC}
          alt="Top Street"
          className="w-full max-w-[min(390px,72vw)] h-auto object-contain"
          style={{ filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.32))" }}
        />
        <p
          className="ts-mono uppercase tracking-[0.3em] mt-4"
          style={{ color: C.textMute, fontSize: 13 }}
        >
          Etapa Tarumã Arrancada Oficial
        </p>

        <div className="my-10">
          <TreeLights />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => { window.location.href = "/inscricao"; }}
            className="ts-display uppercase tracking-wide text-sm font-semibold px-8 py-4 transition-transform duration-200 hover:scale-[1.04]"
            style={{
              background: C.red,
              color: "#fff",
              clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)",
            }}
          >
            Inscrever veículo
          </button>
          <button
            onClick={() => onNavigate("sobre")}
            className="ts-display uppercase tracking-wide text-sm font-semibold px-8 py-4 transition-colors duration-200"
            style={{
              color: C.text,
              border: `1px solid ${C.line}`,
              clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)",
            }}
          >
            Ver Cronograma
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8 sm:gap-16 mt-16 ts-mono">
          {[
            ["9.2s", "Recorde 1/4 milha"],
            ["220", "km/h Vel. Máx."],
            ["180+", "Pilotos"],
          ].map(([n, l]) => (
            <div key={l} className="flex flex-col items-center">
              <span style={{ fontSize: "clamp(1.4rem,3vw,2rem)", color: C.text, fontWeight: 700 }}>{n}</span>
              <span style={{ fontSize: 10, color: C.textFaint, letterSpacing: 1 }} className="uppercase mt-1">
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 ts-float">
        <ChevronDown size={22} color={C.textFaint} />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  SOBRE O EVENTO                                                     */
/* ------------------------------------------------------------------ */
const SCHEDULE = [
  { day: "Sábado", date: "26/09", items: ["10h · Abertura dos portões", "18h · Encerramento"] },
];

const CATEGORIES = [
  { name: "Arrancada 201 m · No Prep", desc: "A única modalidade oficial do Top Street RS", icon: Flag },
];

function Sobre({ innerRef }) {
  return (
    <Section id="sobre" innerRef={innerRef} bg={C.surface} className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Sobre o Evento" title="A pista, o traçado, o desafio" />

        <div className="grid md:grid-cols-2 gap-10 mt-16">
          <div
            className="p-8"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${C.line}`,
              clipPath: "polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)",
            }}
          >
            <h3 className="ts-display uppercase text-xl mb-4" style={{ color: C.red }}>
              Autódromo de Tarumã
            </h3>
            <p style={{ color: C.textMute, lineHeight: 1.7 }}>
              Um dos traçados mais tradicionais do automobilismo gaúcho recebe a etapa Top
              Street com reta de 201 metros (1/8 de milha), cronometragem eletrônica e
              infraestrutura completa de box para equipes e pilotos.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                ["Local", "Viamão, RS"],
                ["Pista", "1/4 milha oficial"],
                ["Cronometragem", "Eletrônica FIA-spec"],
                ["Entrada", "Portão 2 - Box"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="ts-mono uppercase text-[10px] tracking-widest" style={{ color: C.textFaint }}>
                    {k}
                  </div>
                  <div className="ts-display text-sm mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="ts-display uppercase text-xl mb-6" style={{ color: C.text }}>
              Cronograma
            </h3>
            <div className="relative pl-8">
              <div className="absolute left-[7px] top-1 bottom-1 w-px" style={{ background: C.line }} />
              {SCHEDULE.map((d, i) => (
                <div key={d.day} className="relative mb-8 last:mb-0">
                  <div
                    className="absolute -left-8 top-1 rounded-full"
                    style={{ width: 15, height: 15, background: C.base, border: `2px solid ${C.red}` }}
                  />
                  <div className="flex items-baseline gap-3">
                    <span className="ts-display uppercase font-semibold">{d.day}</span>
                    <span className="ts-mono text-xs" style={{ color: C.textFaint }}>
                      {d.date}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {d.items.map((it) => (
                      <li key={it} className="ts-mono text-xs" style={{ color: C.textMute }}>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h3 className="ts-display uppercase text-xl mt-20 mb-8" style={{ color: C.text }}>
          Categorias em pista
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.name}
                className="p-5 transition-colors duration-200 hover:bg-white/[0.04]"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${C.line}`,
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 8% 100%, 0 82%)",
                }}
              >
                <Icon size={18} color={C.amber} />
                <div className="ts-display uppercase text-sm mt-3 font-semibold">{c.name}</div>
                <div className="text-xs mt-1" style={{ color: C.textMute }}>
                  {c.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  MÍDIA â€” asymmetric gallery                                         */
/* ------------------------------------------------------------------ */
const GALLERY = [
  { seed: "topstreet1", span: "sm:col-span-2 sm:row-span-2", video: true },
  { seed: "topstreet2", span: "" },
  { seed: "topstreet3", span: "" },
  { seed: "topstreet4", span: "sm:row-span-2", video: true },
  { seed: "topstreet5", span: "sm:col-span-2" },
  { seed: "topstreet6", span: "" },
  { seed: "topstreet7", span: "" },
];

function Midia({ innerRef }) {
  const [open, setOpen] = useState(null);
  return (
    <Section id="midia" innerRef={innerRef} bg={C.base} className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Mídia" title="Registros da pista" />

        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[140px] sm:auto-rows-[160px] gap-3 mt-16">
          {GALLERY.map((g, i) => (
            <button
              key={g.seed}
              onClick={() => setOpen(i)}
              className={`relative overflow-hidden group ${g.span}`}
              style={{ border: `1px solid ${C.line}` }}
            >
              <img
                src={`https://picsum.photos/seed/${g.seed}/640/640`}
                alt="Registro do evento Top Street"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: "rgba(23,22,21,0.55)" }}
              >
                {g.video ? (
                  <PlayCircle size={30} color="#fff" />
                ) : (
                  <span className="ts-mono text-[10px] uppercase tracking-widest text-white">Ampliar</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-6"
          style={{ background: "rgba(10,10,9,0.9)" }}
          onClick={() => setOpen(null)}
        >
          <button className="absolute top-6 right-6" onClick={() => setOpen(null)}>
            <X size={26} color="#fff" />
          </button>
          <img
            src={`https://picsum.photos/seed/${GALLERY[open].seed}/1000/1000`}
            alt="Registro ampliado"
            className="max-h-[80vh] max-w-[90vw] object-contain"
            style={{ border: `1px solid ${C.line}` }}
          />
        </div>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  ÁREA DOS PILOTOS                                                    */
/* ------------------------------------------------------------------ */
const REQUISITOS = [
  "Capacete Snell/FIA em dia",
  "Cinto de segurança homologado",
  "Extintor de incêndio a bordo",
  "Vistoria técnica obrigatória na sexta",
];

const PASSOS = [
  ["01", "Cadastro do piloto", "Envie seus dados e categoria de disputa"],
  ["02", "Vistoria do veículo", "Inspeção técnica presencial no autódromo"],
  ["03", "Credenciamento", "Retirada de pulseira e adesivos oficiais"],
];

function Pilotos({ innerRef }) {
  return (
    <Section id="pilotos" innerRef={innerRef} bg={C.surface} className="py-28 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `linear-gradient(${C.line}22 1px, transparent 1px), linear-gradient(90deg, ${C.line}22 1px, transparent 1px)`,
          backgroundSize: "42px 42px",
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading eyebrow="Área dos Pilotos" title="Cadastramento e credenciamento" accent={C.green} />

        <div className="grid md:grid-cols-2 gap-10 mt-16">
          <div>
            <h3 className="ts-display uppercase text-lg mb-5 flex items-center gap-2">
              <ShieldCheck size={18} color={C.green} /> Requisitos técnicos
            </h3>
            <ul className="space-y-3">
              {REQUISITOS.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm" style={{ color: C.textMute }}>
                  <CheckCircle2 size={16} color={C.green} className="mt-0.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-3 gap-4 mt-10 ts-mono">
              {[
                ["R$ 350", "Inscrição"],
                ["24/08", "Prazo final"],
                ["1", "Modalidade"],
              ].map(([n, l]) => (
                <div
                  key={l}
                  className="p-4 text-center"
                  style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.line}` }}
                >
                  <div style={{ color: C.green, fontWeight: 700 }}>{n}</div>
                  <div className="uppercase text-[9px] mt-1" style={{ color: C.textFaint }}>
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="ts-display uppercase text-lg mb-5">Como participar</h3>
            <div className="space-y-6">
              {PASSOS.map(([num, title, desc]) => (
                <div key={num} className="flex gap-4">
                  <span className="ts-mono text-2xl font-bold" style={{ color: C.line }}>
                    {num}
                  </span>
                  <div>
                    <div className="ts-display uppercase text-sm font-semibold">{title}</div>
                    <div className="text-xs mt-1" style={{ color: C.textMute }}>
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => { window.location.href = "/inscricao"; }}
              className="mt-10 w-full ts-display uppercase tracking-wide text-sm font-bold px-8 py-5 transition-transform duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
              style={{
                background: C.green,
                color: C.base,
                clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)",
              }}
            >
              Inscrever Veículo / Credenciamento <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTATO / LOCALIZAÇÃO                                               */
/* ------------------------------------------------------------------ */
function RealMap() {
  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden" style={{ border: `1px solid ${C.line}`, borderRadius: 8 }}>
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.923485744837!2d-51.0253456!3d-30.067756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95199bb6937e1935%3A0x6bba3bc30f9d9c22!2sAut%C3%B3dromo%20Internacional%20de%20Tarum%C3%A3!5e0!3m2!1spt-BR!2sbr!4v1715000000000!5m2!1spt-BR!2sbr" width="100%" height="100%" style={{ border: 0, minHeight: "300px", borderRadius: "8px" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mapa do Autódromo Internacional de Tarumã" />
    </div>
  );
}

function Contato({ innerRef }) {
  return (
    <Section id="contato" innerRef={innerRef} bg={C.base} className="pt-28 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Contato" title="Como chegar até a pista" />

        <div className="grid md:grid-cols-2 gap-10 mt-16 items-start">
          <RealMap />

          <div>
            <div className="space-y-4 ts-mono text-sm" style={{ color: C.textMute }}>
              <div className="flex items-center gap-3">
                <Calendar size={16} color={C.textFaint} /> 26 de setembro de 2026
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} color={C.textFaint} /> Evento das 10h às 18h
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} color={C.textFaint} /> Autódromo Internacional de Tarumã - Rod. RS-040, km 27, Viamão - RS
              </div>
            </div>
            <p className="ts-mono uppercase tracking-[0.22em] text-[10px] mt-8 mb-3" style={{ color: C.textFaint }}>Inscrições e informações no WhatsApp</p>
            <div className="flex flex-col gap-2">
              <a className="inline-flex items-center gap-3 rounded-full px-4 py-3 text-sm transition-colors hover:bg-white/10" style={{ border: `1px solid ${C.line}`, color: C.text }} href="https://wa.me/5551999060748" target="_blank" rel="noreferrer"><MessageCircle size={17} color={C.green} /> WhatsApp Rodrigo</a>
              <a className="inline-flex items-center gap-3 rounded-full px-4 py-3 text-sm transition-colors hover:bg-white/10" style={{ border: `1px solid ${C.line}`, color: C.text }} href="https://wa.me/5551992974560" target="_blank" rel="noreferrer"><MessageCircle size={17} color={C.green} /> WhatsApp Vinícius</a>
            </div>
            <div className="flex items-center gap-3 mt-8">
              {[
                { Icon: Phone, href: "tel:+550000000000", label: "Ligar para o evento" },
                { Icon: Navigation, href: "https://maps.app.goo.gl/placeholder", label: "Abrir rota no Maps" },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10" style={{ border: `1px solid ${C.line}` }}><Icon size={17} /></a>
              ))}
            </div>
            {/* informações oficiais do evento */}
            <div className="hidden">
              <div className="flex items-center gap-3">
                <Calendar size={16} color={C.textFaint} /> 12â€“14 de setembro
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} color={C.textFaint} /> Portões abrem às 9h
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} color={C.textFaint} /> Autódromo Internacional de Tarumã - Rod. RS-040, km 27, Viamão - RS
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              {[ImageIcon, PlayCircle, MapPin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10"
                  style={{ border: `1px solid ${C.line}` }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: `1px solid ${C.line}` }}>
          <div className="order-3 flex items-center gap-3 ts-mono text-[9px] uppercase tracking-[0.18em] sm:order-none" style={{ color: C.textFaint }}>
            <a href="/admin" className="transition-colors hover:text-white">Área da organização</a>
            <span aria-hidden="true">·</span>
            <a href="/acesso" className="opacity-60 transition-opacity hover:opacity-100">Acesso do piloto</a>
          </div>
          <img src={LOGO_SRC} alt="Top Street" className="h-8 w-auto object-contain" />
          <div className="ts-mono text-[11px]" style={{ color: C.textFaint }}>
            © 2026 Top Street · Etapa Tarumã · Todos os direitos reservados
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  PATROCINADORES                                                     */
/* ------------------------------------------------------------------ */
const SPONSORS = [
  { name: "Esquina Pneus", tag: "Borracharia", icon: SponsorTire },
  { name: "Rodrigo Farelo", tag: "Personal Trainer", icon: Dumbbell },
  { name: "MangSul", tag: "Materiais p/ postos", icon: Droplet },
  { name: "Redline Performance", tag: "Preparação", icon: Flag },
  { name: "Xis Boa Vista", tag: "Lanches", icon: Sandwich },
  { name: "Meta Motors", tag: "Concessionária", icon: Gauge },
  { name: "Retificadora Master", tag: "Retífica de motores", icon: Wrench },
  { name: "GUGU Suspensões Racing", tag: "Suspensão", icon: Layers },
  { name: "Naipe Auto Center", tag: "Auto Center", icon: Spade },
  { name: "Repasse Auto RS", tag: "Veículos", icon: Car },
  { name: "Cutelaria Encosta da Serra", tag: "Cutelaria artesanal", icon: Mountain },
  { name: "Lave no Forte", tag: "Estética automotiva", icon: Flame },
  { name: "Forged Series", tag: "Rodas forjadas", icon: Award },
  { name: "Marcão Repasses", tag: "Veículos", icon: Truck },
];

function Patrocinadores({ innerRef }) {
  return (
    <Section id="patrocinadores" innerRef={innerRef} bg={C.surface} className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(45deg, ${C.text} 25%, transparent 25%, transparent 75%, ${C.text} 75%), linear-gradient(45deg, ${C.text} 25%, transparent 25%, transparent 75%, ${C.text} 75%)`, backgroundSize: "26px 26px", backgroundPosition: "0 0, 13px 13px" }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center"><div className="ts-display uppercase font-bold px-10 py-3 mb-4" style={{ background: C.red, color: "#fff", fontSize: "clamp(1.6rem,4.5vw,2.6rem)", letterSpacing: "0.02em", clipPath: "polygon(3% 0, 100% 0, 97% 100%, 0% 100%)", boxShadow: `0 10px 30px ${C.red}44` }}>Patrocinadores</div><p className="ts-mono uppercase tracking-[0.3em] text-xs" style={{ color: C.textMute }}>Top Street RS 3ª Etapa 2026</p></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-16">{SPONSORS.map((s) => { const Icon = s.icon; return <div key={s.name} className="flex flex-col items-center justify-center text-center p-5 gap-2 transition-transform duration-200 hover:scale-[1.04]" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.line}`, clipPath: "polygon(0 0, 100% 0, 100% 88%, 90% 100%, 0 100%)", minHeight: 130 }}><Icon size={22} color={C.amber} /><span className="ts-display uppercase text-xs font-semibold leading-tight">{s.name}</span><span className="ts-mono text-[9px] uppercase tracking-widest" style={{ color: C.textFaint }}>{s.tag}</span></div>; })}</div>
        <p className="text-center ts-mono text-xs mt-12" style={{ color: C.textFaint }}>Quer patrocinar a próxima etapa? Fale com a organização pelo WhatsApp da bio.</p>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  SHARED HEADING                                                     */
/* ------------------------------------------------------------------ */
function SectionHeading({ eyebrow, title, accent = C.red }) {
  return (
    <div>
      <div
        className="ts-mono uppercase text-xs tracking-[0.35em] inline-block px-3 py-1 rounded-full mb-4"
        style={{ color: accent, border: `1px solid ${accent}44` }}
      >
        {eyebrow}
      </div>
      <h2 className="ts-display uppercase" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 700 }}>
        {title}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APP                                                                 */
/* ------------------------------------------------------------------ */
export default function TopStreetLanding() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("home");
  const refs = useRef({});

  const handleScroll = useCallback(() => {
    const h = document.documentElement;
    const scrollTop = h.scrollTop || document.body.scrollTop;
    const scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
    setProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.4 }
    );
    Object.values(refs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const goTo = (id) => {
    refs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="ts-root ts-scrollbar">
      <GlobalStyle />
      <ScrollStrip progress={progress} />
      <FloatingNav active={active} onNavigate={goTo} />

      <Hero innerRef={(el) => (refs.current.home = el)} onNavigate={goTo} />
      <Sobre innerRef={(el) => (refs.current.sobre = el)} />
      <Patrocinadores innerRef={(el) => (refs.current.patrocinadores = el)} />
      <Midia innerRef={(el) => (refs.current.midia = el)} />
      <Pilotos innerRef={(el) => (refs.current.pilotos = el)} />
      <Contato innerRef={(el) => (refs.current.contato = el)} />
    </div>
  );
}
