import { motion } from "framer-motion";
import { ArrowUpRight, Award, CalendarDays, CarFront, Droplet, Dumbbell, Flame, Flag, Layers, MapPin, Mountain, Sandwich, ShieldCheck, Spade, Truck, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const sponsors: Array<[string, string, LucideIcon]> = [
  ["Esquina Pneus", "Borracharia", Award],
  ["Rodrigo Farelo", "Personal Trainer", Dumbbell],
  ["MangSul", "Materiais p/ postos", Droplet],
  ["Redline Performance", "Preparação", Flag],
  ["Xis Boa Vista", "Lanches", Sandwich],
  ["Meta Motors", "Concessionária", CarFront],
  ["Retificadora Master", "Retífica de motores", Wrench],
  ["GUGU Suspensões Racing", "Suspensão", Layers],
  ["Naipe Auto Center", "Auto Center", Spade],
  ["Repasse Auto RS", "Veículos", Truck],
  ["Cutelaria Encosta da Serra", "Cutelaria artesanal", Mountain],
  ["Lave no Forte", "Estética automotiva", Flame],
  ["Forged Series", "Rodas forjadas", Award],
  ["Marcão Repasses", "Veículos", Truck],
];

const navigation = [
  ["Home", "#home"], ["Sobre", "#sobre"], ["Patrocinadores", "#patrocinadores"],
  ["Mídia", "#midia"], ["Pilotos", "#pilotos"], ["Contato", "#contato"],
];

const particles = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 61) % 100}%`,
  delay: (index % 7) * 0.65,
  duration: 5 + (index % 5),
}));

function AnimatedHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden px-5 pb-20 pt-12 sm:px-8 lg:px-12">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow hero-glow-green" aria-hidden="true" />
      <div className="hero-glow hero-glow-blue" aria-hidden="true" />
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {particles.map((particle) => (
          <motion.span key={particle.id} className="hero-particle" style={{ left: particle.left, top: particle.top }} animate={{ opacity: [0.1, 0.75, 0.1], y: [-10, 18, -10] }} transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }} />
        ))}
        <motion.div className="speed-line speed-line-one" animate={{ x: ["-20vw", "120vw"] }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }} />
        <motion.div className="speed-line speed-line-two" animate={{ x: ["110vw", "-25vw"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }} />
      </div>
      <div className="relative mx-auto w-full max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400 backdrop-blur-md"><span className="h-1.5 w-1.5 rounded-full bg-[#00e560] shadow-[0_0_12px_#00e560]" />Top Street · Etapa Tarumã</div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-[#00e560]">Credenciamento de evento</p>
          <h1 className="font-display max-w-3xl text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-transparent [background:linear-gradient(120deg,#fff_12%,#a6abb2_52%,#666b73_100%)] bg-clip-text sm:text-7xl lg:text-[6.8rem]">CREDENCIAMENTO OFICIAL</h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">Etapa Tarumã - Rio Grande do Sul <span className="text-zinc-600">|</span> Setembro 2026</p>
          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a href="#pilotos" className="group inline-flex h-12 items-center gap-3 rounded-full border border-[#00e560]/70 bg-[#00e560]/[0.06] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#6dffad] transition hover:border-[#00e560] hover:bg-[#00e560]/[0.14] hover:shadow-[0_0_28px_rgba(0,229,96,0.15)]"><CarFront size={17} strokeWidth={1.8} />Inscrição de pilotos<ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
            <button className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 transition hover:border-white/25 hover:text-zinc-300">Ingressos público geral<span className="ml-1 rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[9px] normal-case tracking-normal text-zinc-400">Em breve</span></button>
          </div>
        </motion.div>
        <div className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/[0.08] pt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600"><span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-zinc-500" />Acesso seguro</span><span className="inline-flex items-center gap-2"><CalendarDays size={14} className="text-zinc-500" />Setembro 2026</span><a className="inline-flex items-center gap-2 transition hover:text-[#00e560]" href="https://www.google.com/maps/search/?api=1&query=Aut%C3%B3dromo%20de%20Tarum%C3%A3%2C%20Autodromo%20de%20Tarum%C3%A3%20-%20Jardim%20Viamar%2C%20Viam%C3%A3o%20-%20RS%2C%2094416%2C%20Brasil" target="_blank" rel="noreferrer"><MapPin size={14} className="text-zinc-500" />Autódromo de Tarumã · Ver no Maps</a></div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return <main className="min-h-screen overflow-hidden bg-[#0a0a0a] text-white"><header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12"><a href="#home" className="group flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#00e560]/30 bg-[#00e560]/10 text-[#00e560] transition group-hover:bg-[#00e560]/20"><CarFront size={19} /></span><span className="font-display text-sm font-bold uppercase tracking-[0.12em]">Top <span className="text-[#00e560]">Street</span></span></a><nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex">{navigation.map(([item, href], index) => <a key={item} href={href} className={`rounded-full px-3 py-2 text-[10px] font-medium transition ${index === 0 ? "bg-white/10 text-white" : "text-zinc-500 hover:bg-white/[0.08] hover:text-zinc-200"}`}>{item}</a>)}</nav><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Powered by <span className="text-zinc-400">EasyCrow</span></span></header><div id="home"><AnimatedHero /></div><section id="patrocinadores" className="relative overflow-hidden border-t border-white/[0.06] bg-[#201f1d] px-5 py-24 sm:px-8 lg:px-12"><div className="sponsor-checker absolute inset-0 opacity-[0.04]" /><div className="relative mx-auto max-w-6xl"><div className="flex flex-col items-center text-center"><div className="font-display mb-4 px-8 py-3 text-2xl font-bold uppercase tracking-tight text-white shadow-[0_10px_30px_rgba(228,35,19,0.25)] [background:#e42313] [clip-path:polygon(3%_0,100%_0,97%_100%,0_100%)] sm:text-4xl">Patrocinadores</div><p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">Top Street RS · 3ª Etapa 2026</p></div><div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{sponsors.map(([name, tag, Icon]) => <div key={name as string} className="flex min-h-[130px] flex-col items-center justify-center gap-2 border border-[#4a473f] bg-white/[0.03] p-4 text-center transition hover:-translate-y-1 hover:bg-white/[0.06]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 90% 100%, 0 100%)" }}><Icon size={22} className="text-[#ffb627]" /><span className="font-display text-[11px] font-semibold uppercase leading-tight">{name}</span><span className="text-[9px] uppercase tracking-[0.16em] text-zinc-500">{tag}</span></div>)}</div><p className="mt-10 text-center text-xs text-zinc-600">Quer patrocinar a próxima etapa? Fale com a organização.</p></div></section><footer className="border-t border-white/[0.06] px-5 py-5 text-center text-[10px] tracking-[0.18em] text-zinc-700">Powered by EasyCrow</footer></main>;
}
