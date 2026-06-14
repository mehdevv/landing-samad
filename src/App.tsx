import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { type AffiliateRef, useAffiliateRef } from "@/lib/affiliate";
import { registerForLive } from "@/lib/register";
import bgHero from "@/assets/bg-hero.jpg";
import bgTopics from "@/assets/bg-topics.jpg";
import samadPhoto from "@/assets/samad.jpg";
import mehdiPhoto from "@/assets/mehdi.jpg";

const REASONS = [
  "أريد تعلّم Vibe Coding من الصفر",
  "أريد استعماله لتنمية مشروعي",
  "أريد تقديمه كخدمة لعملائي",
  "فضول حول الأدوات وسير العمل",
  "تمت توصيتي من شخص ما",
];

const TOPICS = [
  { n: "٠١", t: "ما هو Vibe Coding؟", d: "الطريقة الجديدة للبناء" },
  { n: "٠٢", t: "الأدوات المجانية والمدفوعة", d: "الـ stack كاملًا، بوضوح" },
  { n: "٠٣", t: "البيع للشركات", d: "حوّل المهارة إلى دخل" },
  { n: "٠٤", t: "تنمية مشروعك الخاص", d: "ابنِ لنفسك" },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function scrollToForm() {
  document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App({ affiliateRef }: { affiliateRef?: AffiliateRef }) {
  useReveal();
  useParallax();
  return (
    <main className="min-h-screen bg-paper text-ink" dir="rtl">
      <ScrollProgress />
      <Corners />
      <Nav />
      <Hero />
      <Divider />
      <Hosts />
      <Divider />
      <RegisterForm affiliateRef={affiliateRef} />
      <Divider />
      <About />
      <Divider />
      <Topics />
      <Footer />
    </main>
  );
}

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p / 100})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px bg-line/40">
      <div
        ref={ref}
        className="h-full origin-right bg-[linear-gradient(to_left,var(--color-nld-yellow),var(--color-pluss-blue))] transition-transform duration-100 ease-out"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

function Corners() {
  const base = "pointer-events-none fixed z-[55] h-5 w-5 border-ink/80";
  return (
    <>
      <span className={`${base} top-3 left-3 border-t border-l`} />
      <span className={`${base} top-3 right-3 border-t border-r`} />
      <span className={`${base} bottom-3 left-3 border-b border-l`} />
      <span className={`${base} bottom-3 right-3 border-b border-r`} />
      <div
        dir="ltr"
        className="pointer-events-none fixed bottom-5 left-6 z-[55] hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-ink/70 sm:flex"
      >
        <span className="live-dot" />
        <span>REC · LIVE</span>
      </div>
      <div
        dir="ltr"
        className="pointer-events-none fixed bottom-5 right-6 z-[55] hidden font-mono text-[10px] uppercase tracking-[0.28em] text-ink/60 sm:block"
      >
        CH 01 · GOOGLE MEET
      </div>
    </>
  );
}

function LiveBadge() {
  return (
    <span
      dir="ltr"
      className="inline-flex items-center gap-2 border border-line bg-paper/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-ink backdrop-blur-sm"
    >
      <span className="live-dot" />
      <span>On Air</span>
    </span>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10">
        <div className="flex items-center gap-4">
          <LiveBadge />
          <div className="hidden text-[11px] font-medium uppercase tracking-[0.22em] text-ink sm:block" dir="ltr">
            NLD Creative <span className="mx-2 text-ink-muted">×</span> Pluss.dev
          </div>
        </div>
        <button
          onClick={scrollToForm}
          className="group inline-flex items-center gap-2 border border-ink px-4 py-2 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
        >
          <span>انضم إلى البث</span>
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}

function useParallax() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-parallax]");
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        els.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax || "0.2");
          const rect = el.getBoundingClientRect();
          const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
}

function Hero() {
  return (
    <section className="grain relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 will-change-transform" data-parallax="0.18">
        <img
          src={bgHero}
          alt=""
          aria-hidden
          width={1920}
          height={1280}
          className="h-[115%] w-full object-cover opacity-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/60 via-paper/40 to-paper" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col items-center justify-center px-6 py-24 text-center sm:px-10">
        <div className="fade-up flex items-center gap-3" dir="ltr">
          <span className="live-dot" />
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink-muted">
            Live Event &nbsp;/&nbsp; Tuesday Night &nbsp;/&nbsp; Google Meet
          </p>
        </div>

        <h1
          className="fade-up mt-10 text-balance text-5xl font-light leading-[1.15] tracking-[-0.01em] text-ink sm:text-6xl md:text-7xl lg:text-[5.25rem]"
          style={{ animationDelay: "120ms" }}
        >
          ابنِ أسرع.
          <br />
          بِع أذكى.
          <br />
          <span className="italic">برمج بِـ Vibe.</span>
        </h1>

        <p
          className="fade-up mt-10 max-w-xl text-base font-light leading-loose text-ink-soft sm:text-lg"
          style={{ animationDelay: "240ms" }}
        >
          ليلة واحدة. اثنان من البنّائين. نظرة واضحة على كيف يعيد Vibe Coding كتابة طريقة
          صناعة المنتجات — وكيف تحوّل ذلك إلى دخل حقيقي.
        </p>

        <div className="fade-up mt-12" style={{ animationDelay: "360ms" }}>
          <button
            onClick={scrollToForm}
            className="group inline-flex items-center gap-3 bg-ink px-7 py-4 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink hover:outline hover:outline-1 hover:outline-ink"
          >
            <span>احجز مقعدك</span>
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
          </button>
        </div>

        <div
          className="fade-up mt-24 flex flex-col items-center gap-4 text-sm text-ink-muted sm:flex-row sm:gap-6"
          style={{ animationDelay: "480ms" }}
        >
          <span>
            <span className="text-ink">عبد الصمد</span>
            <span className="mx-2 text-ink-muted">—</span>
            <span dir="ltr">NLD Creative</span>
          </span>
          <span className="hidden h-4 w-px bg-line sm:block" />
          <span>
            <span className="text-ink">مهدي</span>
            <span className="mx-2 text-ink-muted">—</span>
            <span dir="ltr">Pluss.dev</span>
          </span>
        </div>
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-10">
      <div className="rule" />
    </div>
  );
}

function SectionLabel({ children, ltr = false }: { children: React.ReactNode; ltr?: boolean }) {
  const base = "reveal text-ink-muted";
  const cls = ltr
    ? `${base} font-mono text-[11px] uppercase tracking-[0.3em]`
    : `${base} text-sm font-medium text-ink-soft`;
  return (
    <p className={cls} dir={ltr ? "ltr" : undefined}>
      {children}
    </p>
  );
}

function About() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-32 sm:px-10 sm:py-40">
      <SectionLabel>عن هذا البث</SectionLabel>
      <p
        className="reveal mt-10 max-w-3xl text-balance text-2xl font-light leading-[1.7] tracking-[-0.005em] text-ink-soft sm:text-3xl"
        style={{ transitionDelay: "120ms" }}
      >
        Vibe Coding Live جلسة مجانية ومباشرة للبنّائين والمستقلين وكل من يهتمّ بصناعة
        المنتجات. سنشارك كيف نشحن منتجاتنا بسرعة لم تكن ممكنة من قبل، والأدوات التي
        نعتمد عليها، وكيف نحوّل هذه الحرفة إلى عمل للعملاء ومشاريع خاصة. ساعة واحدة.
        أسئلة مفتوحة. أحضر دفترك.
      </p>
    </section>
  );
}

function Topics() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 will-change-transform" data-parallax="0.1">
        <img
          src={bgTopics}
          alt=""
          aria-hidden
          loading="lazy"
          width={1920}
          height={1280}
          className="h-[115%] w-full object-cover opacity-[0.35]"
        />
        <div className="absolute inset-0 bg-paper/70" />
      </div>
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-[0.18]" />

      <div className="relative mx-auto max-w-7xl px-6 py-32 sm:px-10 sm:py-40">
        <div className="mb-16">
          <SectionLabel>ما سنغطيه</SectionLabel>
        </div>

        <ul className="border-t border-line">
          {TOPICS.map((item, i) => (
            <li
              key={item.n}
              className="reveal group grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-6 border-b border-line py-8 sm:gap-12 sm:py-12"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-sm font-medium text-ink-muted sm:text-base">{item.n}</span>
              <h3 className="text-balance text-2xl font-light tracking-[-0.005em] text-ink sm:text-4xl md:text-5xl">
                {item.t}
              </h3>
              <span className="hidden text-end text-sm text-ink-muted md:block">
                {item.d}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Hosts() {
  const hosts = [
    {
      name: "عبد الصمد",
      brand: "NLD Creative",
      bio: "مُصمّم ومُنتج رقمي يبني علامات ومنتجات بحسٍّ فنّيّ هادئ ومُتقن.",
      image: samadPhoto,
      alt: "عبد الصمد",
      imageClass: "object-cover object-top",
    },
    {
      name: "مهدي",
      brand: "Pluss.dev",
      bio: "مهندس يحوّل Vibe Coding إلى مشاريع حقيقية وإيرادات حقيقية وسير عمل واضح.",
      image: mehdiPhoto,
      alt: "مهدي",
      imageClass: "object-cover object-top",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-32 sm:px-10 sm:py-40">
      <SectionLabel>المستضيفان</SectionLabel>
      <div className="mt-16 grid grid-cols-1 gap-16 sm:grid-cols-2 sm:gap-12">
        {hosts.map((h, i) => (
          <div
            key={h.name}
            className="reveal flex flex-col items-start gap-6"
            style={{ transitionDelay: `${120 + i * 120}ms` }}
          >
            <img
              src={h.image}
              alt={h.alt}
              className={`h-24 w-24 rounded-full border border-line ${h.imageClass}`}
            />
            <div>
              <h3 className="text-2xl font-light tracking-tight text-ink">{h.name}</h3>
              <p className="mt-1 text-[12px] tracking-[0.22em] text-ink-muted" dir="ltr">
                {h.brand}
              </p>
            </div>
            <p className="max-w-sm text-base font-light leading-loose text-ink-soft">{h.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RegisterForm({ affiliateRef }: { affiliateRef?: AffiliateRef }) {
  const ref = useAffiliateRef(affiliateRef);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await registerForLive({
        first_name: String(fd.get("first_name") || ""),
        last_name: String(fd.get("last_name") || ""),
        phone: String(fd.get("phone") || ""),
        email: String(fd.get("email") || ""),
        reason: String(fd.get("reason") || ""),
        ...(ref ? { ref } : {}),
      });
      setStatus("success");
      formRef.current?.reset();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "حدث خطأ ما. حاول مرة أخرى.");
      setStatus("error");
    }
  }

  return (
    <section id="register" className="brand-split-bg scroll-mt-16 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        <div className="reveal border-2 border-paper bg-paper p-8 shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:p-12 lg:p-14">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-pluss-blue">
              <span className="live-dot" />
              <span>احجز الآن — مجاني</span>
            </p>
            <h2 className="mt-6 text-balance text-3xl font-light leading-[1.2] tracking-[-0.01em] text-ink sm:text-4xl lg:text-5xl">
              مجاني للانضمام. المقاعد محدودة.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base font-light leading-loose text-ink-soft">
              اترك معلوماتك وسنرسل لك رابط Google Meet قبل بداية البث.
            </p>
          </div>

          <div className="reveal mt-10 sm:mt-12" style={{ transitionDelay: "120ms" }}>
            {status === "success" ? (
              <div className="border-2 border-ink bg-paper-soft p-10 text-center sm:p-12">
                <p className="text-sm font-medium text-ink-muted">مؤكَّد</p>
                <p className="mt-6 text-2xl font-light tracking-tight text-ink">
                  تم تأكيد حضورك. نراك يوم الثلاثاء. 🤍
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} className="space-y-6 sm:space-y-7">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7">
                  <Field label="الاسم الشخصي" name="first_name" autoComplete="given-name" required maxLength={100} />
                  <Field label="الاسم العائلي" name="last_name" autoComplete="family-name" required maxLength={100} />
                </div>
                <Field label="رقم الهاتف" name="phone" type="tel" autoComplete="tel" required maxLength={30} />
                <Field label="البريد الإلكتروني" name="email" type="email" autoComplete="email" required maxLength={255} />
                <SelectField label="لماذا تودّ الانضمام؟" name="reason" required options={REASONS} />

                {error && (
                  <p className="rounded border border-live/40 bg-live/5 px-4 py-3 text-sm font-light text-ink">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group mt-2 inline-flex w-full items-center justify-center gap-3 bg-pluss-blue px-7 py-5 text-sm font-medium text-paper transition-colors hover:bg-nld-yellow hover:text-ink disabled:opacity-50"
                >
                  <span>{status === "loading" ? "جارٍ الحجز…" : "أكّد مقعدي المجاني"}</span>
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
        dir={type === "email" || type === "tel" ? "ltr" : "rtl"}
        className="mt-2 block w-full border-2 border-line bg-paper-soft px-4 py-3.5 text-base font-light text-ink placeholder:text-ink-muted transition-colors focus:border-pluss-blue focus:bg-paper focus:outline-none"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="mt-2 block w-full appearance-none border-2 border-line bg-paper-soft px-4 py-3.5 pl-10 text-base font-light text-ink transition-colors focus:border-pluss-blue focus:bg-paper focus:outline-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230e0e0e' stroke-width='1.5'><path d='M6 9l6 6 6-6'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left 4px center",
        }}
      >
        <option value="" disabled>
          اختر سببًا
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-6 py-12 text-center sm:px-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-ink" dir="ltr">
          NLD Creative <span className="mx-2 text-ink-muted">×</span> Pluss.dev
        </p>
        <p className="mt-4 text-sm font-light text-ink-muted">
          بث مباشر مجاني &nbsp;·&nbsp; Google Meet &nbsp;·&nbsp; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
