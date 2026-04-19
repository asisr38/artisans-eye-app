import Image from 'next/image'
import HeroRoot from '@/components/hero/HeroRoot'
import InquiryForm from '@/components/ui/InquiryForm'
import Placeholder from '@/components/ui/Placeholder'

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
      className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-24 md:py-32"
    >
      <div className="relative aspect-[4/5] w-full max-w-2xl overflow-hidden bg-black">
        <Image
          src="/artifacts/IMG_0447.JPG"
          alt="Thangka — working photograph (to be replaced with studio scan)"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded bg-amber-400/90 px-2 py-1 font-mono text-[10px] font-semibold tracking-wide text-black">
          DRAFT PHOTO
        </span>
      </div>

      <div className="max-w-2xl text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-white/50">
          Thangka · Kathmandu Valley
        </p>
        <h1 className="mb-4 text-4xl font-light leading-tight tracking-tight md:text-5xl">
          <Placeholder>PIECE TITLE — e.g. Medicine Buddha Mandala</Placeholder>
        </h1>
        <p className="mb-6 text-white/70">
          By <Placeholder>ARTISAN NAME</Placeholder>,{' '}
          <Placeholder>REGION — e.g. Patan, Lalitpur</Placeholder>
        </p>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-white/80">
          <Placeholder>
            ONE-SENTENCE LEDE — what makes THIS piece worth flying across the world
            for. Keep it specific. Avoid &ldquo;sacred,&rdquo; &ldquo;ancient,&rdquo;
            &ldquo;mystical.&rdquo;
          </Placeholder>
        </p>
      </div>

      <div className="mt-4 flex w-full max-w-2xl items-center justify-between border-y border-white/10 py-6 font-mono text-xs uppercase tracking-wider text-white/60">
        <span>
          Inquire for price — <Placeholder>APPROX USD RANGE</Placeholder>
        </span>
        <a href="#inquire" className="text-white transition-colors hover:text-amber-400">
          Inquire →
        </a>
      </div>

      <div className="mt-8 w-full max-w-2xl rounded border border-dashed border-white/20 bg-white/[0.02] p-8 text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-white/40">
          3D viewer
        </p>
        <p className="text-sm text-white/60">
          Deep-zoom iconography tour lands in PR 4. Until then, the working photo above
          stands in for the final presentation.
        </p>
      </div>
    </section>
  )
}

function ArtisanSection() {
  return (
    <section className="border-t border-white/5 bg-[#0A0A0D]">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-[minmax(0,1fr)_1.4fr] md:py-32">
        <div className="aspect-[4/5] w-full overflow-hidden bg-white/[0.03]">
          <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.25em] text-white/40">
            <Placeholder>ARTISAN PHOTO</Placeholder>
          </div>
        </div>

        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-white/50">
            The Artisan
          </p>
          <h2 className="mb-6 text-3xl font-light tracking-tight md:text-4xl">
            <Placeholder>ARTISAN NAME</Placeholder>
          </h2>

          <dl className="mb-8 grid grid-cols-2 gap-y-4 border-y border-white/10 py-6 text-sm">
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
          </dl>

          <div className="space-y-4 text-white/75">
            <p>
              <Placeholder>
                PARAGRAPH 1 — how the artisan came to this craft. Specific. One event,
                one teacher, one year.
              </Placeholder>
            </p>
            <p>
              <Placeholder>
                PARAGRAPH 2 — how they work now. Materials, routine, the part of the
                process they care most about.
              </Placeholder>
            </p>
          </div>

          <blockquote className="mt-8 border-l-2 border-amber-400/60 pl-6 text-lg italic text-white/85">
            &ldquo;<Placeholder>DIRECT QUOTE — 1-2 sentences, in their voice</Placeholder>&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  )
}

function ContextSection() {
  return (
    <section className="border-t border-white/5">
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-white/50">
          Cultural Context
        </p>
        <h2 className="mb-8 text-3xl font-light tracking-tight md:text-4xl">
          What this thangka depicts
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-white/80">
          <p>
            <Placeholder>
              ICONOGRAPHY — the central figure, the symbols around them, what each means.
              Write this as if explaining to a curious buyer, not an academic.
            </Placeholder>
          </p>
          <p>
            <Placeholder>
              TRADITION — where this style comes from, how long it&rsquo;s been practiced
              in the region, what&rsquo;s distinctive about this artisan&rsquo;s take on it.
            </Placeholder>
          </p>
          <p>
            <Placeholder>
              USE — how a thangka like this would be lived with. Hung in a shrine room,
              displayed in a gallery wall, used in practice. Give the buyer a picture of
              it in their life.
            </Placeholder>
          </p>
        </div>
      </div>
    </section>
  )
}

function MaterialsSection() {
  return (
    <section className="border-t border-white/5 bg-[#0A0A0D]">
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-white/50">
          The Piece
        </p>
        <h2 className="mb-10 text-3xl font-light tracking-tight md:text-4xl">
          Materials &amp; dimensions
        </h2>

        <dl className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
          <Row label="Materials">
            <Placeholder>
              e.g. natural mineral pigments, 24k gold leaf, cotton canvas, silk brocade
              border
            </Placeholder>
          </Row>
          <Row label="Dimensions (unframed)">
            <Placeholder>W × H — e.g. 45 × 60 cm</Placeholder>
          </Row>
          <Row label="Dimensions (with brocade)">
            <Placeholder>W × H</Placeholder>
          </Row>
          <Row label="Time to make">
            <Placeholder>e.g. approximately 4 months</Placeholder>
          </Row>
          <Row label="Condition">
            <Placeholder>new / as-painted</Placeholder>
          </Row>
          <Row label="Ships from">
            United States · worldwide on request
          </Row>
        </dl>
      </div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/10 pb-4">
      <dt className="mb-1 font-mono text-xs uppercase tracking-wider text-white/50">
        {label}
      </dt>
      <dd className="text-white/85">{children}</dd>
    </div>
  )
}

function InquireSection() {
  return (
    <section id="inquire" className="border-t border-white/5">
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-white/50">
            Acquire
          </p>
          <h2 className="mb-4 text-3xl font-light tracking-tight md:text-4xl">
            Inquire to purchase
          </h2>
          <p className="mx-auto max-w-xl text-white/65">
            One piece, one buyer. Tell us a little about what draws you to this thangka —
            we&rsquo;ll respond personally within one business day.
          </p>
        </div>

        <InquiryForm artifact={ARTIFACT_REF} whatsAppHref={WHATSAPP_HREF} />

        <p className="mt-12 text-center text-sm text-white/45">
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
