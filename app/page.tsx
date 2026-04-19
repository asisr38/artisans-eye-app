import HeroRoot from '@/components/hero/HeroRoot'
import InquiryForm from '@/components/ui/InquiryForm'
import Placeholder from '@/components/ui/Placeholder'
import Reveal from '@/components/ui/Reveal'
import ParallaxImage from '@/components/ui/ParallaxImage'
import StickyArtisan from '@/components/ui/StickyArtisan'

const WHATSAPP_HREF = 'https://wa.me/15715030608'
const CONTACT_EMAIL = 'ashishforllc@gmail.com'

// Working title used in the inquiry email subject. Swap to the real piece
// name when the thangka arrives.
const ARTIFACT_REF = 'Thangka — placeholder listing'

export default function Home() {
  return (
    <>
      <HeroRoot />

      <main className="bg-[#0D0D10] text-white">
        <ArtifactSection />
        <ArtisanSection />
        <ContextSection />
        <MaterialsSection />
        <InquireSection />
        <SiteFooter />
      </main>
    </>
  )
}

// ───────────────────────── Sections ─────────────────────────
//
// All copy with a <Placeholder> marker must be replaced before this page
// is shared publicly. Grep for "Placeholder" to find every slot.

function ArtifactSection() {
  return (
    <section
      id="artifact"
      className="relative mx-auto flex max-w-5xl flex-col items-center gap-14 px-6 py-32 md:py-40"
    >
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">
          Thangka · Kathmandu Valley
        </p>
      </Reveal>

      <Reveal delay={0.08} className="flex w-full justify-center">
        <ParallaxImage
          src="/artifacts/IMG_0447.JPG"
          alt="Thangka — working photograph (to be replaced with studio scan)"
          priority
          sizes="(max-width: 768px) 100vw, 640px"
          badge="DRAFT PHOTO"
        />
      </Reveal>

      <div className="max-w-2xl text-center">
        <Reveal delay={0.05}>
          <h1 className="mb-5 text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-white md:text-6xl">
            <Placeholder>PIECE TITLE — e.g. Medicine Buddha Mandala</Placeholder>
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mb-8 text-white/55">
            By <Placeholder>ARTISAN NAME</Placeholder>,{' '}
            <Placeholder>REGION — e.g. Patan, Lalitpur</Placeholder>
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto max-w-xl text-[19px] leading-relaxed text-white/80">
            <Placeholder>
              ONE-SENTENCE LEDE — what makes THIS piece worth flying across the world
              for. Keep it specific. Avoid &ldquo;sacred,&rdquo; &ldquo;ancient,&rdquo;
              &ldquo;mystical.&rdquo;
            </Placeholder>
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="w-full">
        <div className="mx-auto mt-4 flex w-full max-w-2xl items-center justify-between border-y border-white/10 py-6 font-mono text-xs uppercase tracking-wider text-white/60">
          <span>
            Inquire for price — <Placeholder>APPROX USD RANGE</Placeholder>
          </span>
          <a
            href="#inquire"
            className="group inline-flex items-center gap-2 text-white transition-colors hover:text-amber-400"
          >
            Inquire
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.15} className="w-full">
        <div className="mx-auto mt-8 w-full max-w-2xl rounded-sm border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/35">
            3D viewer
          </p>
          <p className="text-sm text-white/55">
            Deep-zoom iconography tour lands in PR 4. Until then, the working photo above
            stands in for the final presentation.
          </p>
        </div>
      </Reveal>
    </section>
  )
}

function ArtisanSection() {
  return (
    <StickyArtisan
      eyebrow="The Artisan"
      photoSlot={
        <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.25em] text-white/35">
          <Placeholder>ARTISAN PHOTO</Placeholder>
        </div>
      }
      name={<Placeholder>ARTISAN NAME</Placeholder>}
      meta={
        <>
          <dt className="font-mono uppercase tracking-wider text-white/50">Region</dt>
          <dd>
            <Placeholder>e.g. Patan, Lalitpur</Placeholder>
          </dd>
          <dt className="font-mono uppercase tracking-wider text-white/50">Practicing</dt>
          <dd>
            <Placeholder>YEARS — e.g. 22 years</Placeholder>
          </dd>
          <dt className="font-mono uppercase tracking-wider text-white/50">Lineage</dt>
          <dd>
            <Placeholder>SCHOOL / TEACHER — one line</Placeholder>
          </dd>
        </>
      }
      bio={
        <>
          <Reveal delay={0.05}>
            <p>
              <Placeholder>
                PARAGRAPH 1 — how the artisan came to this craft. Specific. One event,
                one teacher, one year.
              </Placeholder>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              <Placeholder>
                PARAGRAPH 2 — how they work now. Materials, routine, the part of the
                process they care most about.
              </Placeholder>
            </p>
          </Reveal>
        </>
      }
      quote={
        <>
          &ldquo;<Placeholder>DIRECT QUOTE — 1-2 sentences, in their voice</Placeholder>&rdquo;
        </>
      }
    />
  )
}

function ContextSection() {
  return (
    <section className="border-t border-white/5">
      <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
        <Reveal>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.35em] text-white/45">
            Cultural Context
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-12 text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-5xl">
            What this thangka depicts
          </h2>
        </Reveal>

        <div className="space-y-6 text-[19px] leading-relaxed text-white/80">
          <Reveal delay={0.1}>
            <p>
              <Placeholder>
                ICONOGRAPHY — the central figure, the symbols around them, what each means.
                Write this as if explaining to a curious buyer, not an academic.
              </Placeholder>
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p>
              <Placeholder>
                TRADITION — where this style comes from, how long it&rsquo;s been practiced
                in the region, what&rsquo;s distinctive about this artisan&rsquo;s take on it.
              </Placeholder>
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p>
              <Placeholder>
                USE — how a thangka like this would be lived with. Hung in a shrine room,
                displayed in a gallery wall, used in practice. Give the buyer a picture of
                it in their life.
              </Placeholder>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function MaterialsSection() {
  return (
    <section className="border-t border-white/5 bg-[#0A0A0D]">
      <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
        <Reveal>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.35em] text-white/45">
            The Piece
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-14 text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-5xl">
            Materials &amp; dimensions
          </h2>
        </Reveal>

        <dl className="grid grid-cols-1 gap-x-12 gap-y-2 md:grid-cols-2">
          <Row label="Materials" delay={0.05}>
            <Placeholder>
              e.g. natural mineral pigments, 24k gold leaf, cotton canvas, silk brocade
              border
            </Placeholder>
          </Row>
          <Row label="Dimensions (unframed)" delay={0.1}>
            <Placeholder>W × H — e.g. 45 × 60 cm</Placeholder>
          </Row>
          <Row label="Dimensions (with brocade)" delay={0.15}>
            <Placeholder>W × H</Placeholder>
          </Row>
          <Row label="Time to make" delay={0.2}>
            <Placeholder>e.g. approximately 4 months</Placeholder>
          </Row>
          <Row label="Condition" delay={0.25}>
            <Placeholder>new / as-painted</Placeholder>
          </Row>
          <Row label="Ships from" delay={0.3}>
            United States · worldwide on request
          </Row>
        </dl>
      </div>
    </section>
  )
}

function Row({
  label,
  children,
  delay = 0,
}: {
  label: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <Reveal delay={delay}>
      <div className="border-b border-white/10 py-5">
        <dt className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
          {label}
        </dt>
        <dd className="text-white/85">{children}</dd>
      </div>
    </Reveal>
  )
}

function InquireSection() {
  return (
    <section id="inquire" className="border-t border-white/5">
      <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
        <div className="mb-14 text-center">
          <Reveal>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.35em] text-white/45">
              Acquire
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mb-5 text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-5xl">
              Inquire to purchase
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto max-w-xl text-[17px] text-white/60">
              One piece, one buyer. Tell us a little about what draws you to this thangka —
              we&rsquo;ll respond personally within one business day.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <InquiryForm artifact={ARTIFACT_REF} whatsAppHref={WHATSAPP_HREF} />
        </Reveal>

        <p className="mt-14 text-center text-sm text-white/40">
          Or write directly to{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-white/70 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-10 text-xs text-white/40 md:flex-row">
        <span className="font-mono tracking-[0.2em] uppercase">
          The Artisan&rsquo;s Eye
        </span>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="transition-colors hover:text-white/70"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </footer>
  )
}
