import HeroRoot from '@/components/hero/HeroRoot'
import InquiryForm from '@/components/ui/InquiryForm'
import Reveal from '@/components/ui/Reveal'
import ThangkaExperience from '@/components/ui/ThangkaExperience'

const WHATSAPP_HREF = 'https://wa.me/15715030608'
const CONTACT_EMAIL = 'ashishforllc@gmail.com'

const ARTIFACT_REF = 'Eleven-Headed Thousand-Armed Avalokiteshvara Thangka'

const iconographyNotes = [
  {
    title: 'Eleven faces',
    body: 'Stacked heads signal the ability to perceive suffering in every direction. In traditional readings, the uppermost head is associated with Amitabha Buddha.',
  },
  {
    title: 'Radiating arms',
    body: 'The surrounding field of hands turns compassion into action: seeing, reaching, blessing, protecting, and responding without limit.',
  },
  {
    title: 'Hands at the heart',
    body: 'The central joined hands hold the vow at the center of the image. The figure is not only majestic; it is devotional and inwardly still.',
  },
  {
    title: 'Black and gold ground',
    body: 'The dark field gives the painting gravity and depth, while gold linework makes the figure appear to emerge from the surface.',
  },
]

export default function Home() {
  return (
    <>
      <HeroRoot />

      <main className="bg-[var(--color-ink)] text-[var(--color-cream)]">
        <ArtifactSection />
        <ContextSection />
        <MaterialsSection />
        <InquireSection />
        <SiteFooter />
      </main>
    </>
  )
}

// ───────────────────────── Section primitives ─────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.42em] text-[var(--color-cream-3)] sm:text-[11px]">
      {children}
    </p>
  )
}

function Display({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={`font-display text-[clamp(2.25rem,5.4vw,4rem)] leading-[1.05] text-[var(--color-cream)] ${className}`}
    >
      {children}
    </h2>
  )
}

// ───────────────────────── Sections ─────────────────────────

function ArtifactSection() {
  return (
    <section
      id="artifact"
      className="relative mx-auto flex max-w-5xl flex-col items-center gap-16 px-5 py-28 sm:gap-20 sm:px-6 md:py-40"
    >
      <Reveal>
        <Eyebrow>Thangka · Kathmandu Valley</Eyebrow>
      </Reveal>

      <Reveal delay={0.08} className="flex w-full justify-center">
        <ThangkaExperience
          artworkSrc="/artifacts/thangka-centerpiece.jpg"
          textureSrc="/artifacts/thangka-centerpiece-close.jpg"
          panoramaSrc="/artifacts/thangka-360-room.png"
          alt="Thousand-Armed Avalokiteshvara thangka with red brocade border"
          priority
        />
      </Reveal>

      <div className="max-w-2xl px-2 text-center">
        <Reveal delay={0.05}>
          <h1 className="font-display mb-6 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] text-[var(--color-cream)]">
            Thousand-Armed Avalokiteshvara Thangka
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mb-10 text-[15px] text-[var(--color-cream-3)]">
            Kathmandu Valley atelier · artist documentation pending
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto max-w-xl text-[17px] leading-[1.7] text-[var(--color-cream-2)] sm:text-[18px]">
            A black-and-gold meditation painting centered on Avalokiteshvara,
            the bodhisattva of compassion, with eleven faces and a halo-like
            field of hands rendered in luminous gold linework.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="w-full">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 border-y border-[var(--hairline)] py-7 text-[12px] uppercase tracking-[0.28em] text-[var(--color-cream-3)] sm:flex-row sm:items-center sm:justify-between">
          <span>One available · inquire for price</span>
          <a
            href="#inquire"
            className="link-editorial self-start text-[var(--color-cream)] sm:self-auto"
          >
            Inquire
          </a>
        </div>
      </Reveal>
    </section>
  )
}

function ContextSection() {
  return (
    <section className="border-t border-[var(--hairline)]">
      <div className="mx-auto max-w-3xl px-5 py-28 sm:px-6 md:py-40">
        <Reveal>
          <Eyebrow>Cultural Context</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <Display className="mb-12 mt-3">What this thangka depicts</Display>
        </Reveal>

        <div className="space-y-7 text-[17px] leading-[1.75] text-[var(--color-cream-2)] sm:text-[18px]">
          <Reveal delay={0.1}>
            <p>
              The central figure is identified by visible iconography as
              Eleven-Headed, Thousand-Armed Avalokiteshvara, known in Tibetan
              as Chenrezig. Avalokiteshvara is the bodhisattva of compassion:
              the awakened quality that sees suffering clearly and responds.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p>
              The eleven faces rise above the crown, looking outward in every
              direction. Around the body, the many arms open into a circular
              field. In many depictions of this form, eyes appear in the palms:
              a visual promise that compassion must both see and act.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p>
              This example is especially dramatic because it uses a black ground
              with gold drawing. The dark field quiets the image; the gold brings
              the figure forward slowly, detail by detail, as the viewer moves
              closer.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {iconographyNotes.map((note, index) => (
            <Reveal key={note.title} delay={0.08 + index * 0.04}>
              <article className="border border-[var(--hairline)] p-6">
                <h3 className="mb-3 font-display text-[24px] leading-tight text-[var(--color-cream)]">
                  {note.title}
                </h3>
                <p className="text-[15px] leading-[1.65] text-[var(--color-cream-2)]">
                  {note.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function MaterialsSection() {
  return (
    <section className="border-t border-[var(--hairline)] bg-[var(--color-ink-2)]">
      <div className="mx-auto max-w-3xl px-5 py-28 sm:px-6 md:py-40">
        <Reveal>
          <Eyebrow>The Piece</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <Display className="mb-14 mt-3">Materials &amp; dimensions</Display>
        </Reveal>

        <dl className="grid grid-cols-1 gap-x-12 gap-y-1 md:grid-cols-2">
          <Row label="Materials" delay={0.05}>
            Pigment and gold detailing on cloth, mounted with silk brocade
          </Row>
          <Row label="Dimensions (unframed)" delay={0.1}>
            Painted image measurements pending verification
          </Row>
          <Row label="Dimensions (with brocade)" delay={0.15}>
            Full textile measurements pending verification
          </Row>
          <Row label="Time to make" delay={0.2}>
            Artist documentation pending
          </Row>
          <Row label="Condition" delay={0.25}>
            Photographed with brocade mount; final condition notes available on inquiry
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
      <div className="border-b border-[var(--hairline)] py-6">
        <dt className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[var(--color-cream-3)]">
          {label}
        </dt>
        <dd className="text-[15px] text-[var(--color-cream)]">{children}</dd>
      </div>
    </Reveal>
  )
}

function InquireSection() {
  return (
    <section id="inquire" className="border-t border-[var(--hairline)]">
      <div className="mx-auto max-w-3xl px-5 py-28 sm:px-6 md:py-40">
        <div className="mb-16 text-center">
          <Reveal>
            <Eyebrow>Acquire</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <Display className="mb-6 mt-3">Inquire to purchase</Display>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto max-w-xl text-[16px] leading-[1.7] text-[var(--color-cream-2)] sm:text-[17px]">
              One piece, one buyer. Tell us a little about what draws you to this thangka -
              we&rsquo;ll respond personally within one business day.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <InquiryForm artifact={ARTIFACT_REF} whatsAppHref={WHATSAPP_HREF} />
        </Reveal>

        <p className="mt-16 text-center text-[13px] tracking-wide text-[var(--color-cream-3)]">
          Or write directly to{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="link-editorial text-[var(--color-cream)]"
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
    <footer className="border-t border-[var(--hairline)] bg-[var(--color-ink-2)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-10 text-[11px] uppercase tracking-[0.3em] text-[var(--color-cream-3)] md:flex-row">
        <span>The Artisan&rsquo;s Eye</span>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="link-editorial normal-case tracking-normal"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </footer>
  )
}
