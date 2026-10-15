import Image from 'next/image'
import GalleryExperience from '@/components/gallery/GalleryExperience'
import ArtworkStudy from '@/components/gallery/ArtworkStudy'
import InquiryForm from '@/components/ui/InquiryForm'

const artifact = 'Eleven-Headed Thousand-Armed Avalokiteshvara Thangka'

function EyeMark() {
  return (
    <svg width="38" height="26" viewBox="0 0 38 26" fill="none" aria-hidden="true">
      <path
        d="M2 13S8 3 19 3s17 10 17 10-6 10-17 10S2 13 2 13Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="19" cy="13" r="6.4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="19" cy="13" r="2.1" fill="currentColor" />
    </svg>
  )
}

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to artwork
      </a>
      <header className="site-header">
        <a href="#" className="brand-link" aria-label="The Artisan’s Eye, home">
          <EyeMark />
          <span>
            The Artisan’s Eye<span className="brand-caption">Nepali handcraft, considered.</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#study">The work</a>
          <a href="#story">Our approach</a>
          <a className="header-inquire" href="#inquire">
            Inquire <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
      <main id="main">
        <GalleryExperience />
        <div className="exhibition-strip">
          <span>The first study</span>
          <p>Thousand-Armed Avalokiteshvara</p>
          <a href="/room">
            Walk through the gallery <span aria-hidden="true">↗</span>
          </a>
        </div>
        <section id="study" className="study-section">
          <ArtworkStudy />
        </section>
        <section id="story" className="approach-section">
          <div className="approach-heading">
            <span className="section-number">02 / The Artisan’s Eye</span>
            <h2>
              A place for the work.
              <br />
              And the hands behind it.
            </h2>
          </div>
          <div className="approach-body">
            <p className="large-copy">
              An object carries more than its shape. It carries a way of making, a place, and a
              person.
            </p>
            <p>
              We are building a small, considered home for Nepali handcraft. Each piece deserves the
              space to be seen, its story to be heard, and a conversation before it finds its next
              home.
            </p>
            <p className="documentation-note">
              For this first thangka, the artist’s name and making history are still being
              documented. We will share verified details as they become available.
            </p>
          </div>
        </section>
        <section className="piece-section" aria-labelledby="piece-heading">
          <div className="piece-photo">
            <Image
              src="/artifacts/thangka-centerpiece-close.jpg"
              alt="Close photograph of the thangka’s painted detail and textile surface"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className="piece-record">
            <span className="section-number">03 / Object record</span>
            <h2 id="piece-heading">
              The work,
              <br />
              in context.
            </h2>
            <p>
              Eleven-Headed, Thousand-Armed Avalokiteshvara. A black-and-gold composition with a red
              brocade surround.
            </p>
            <dl>
              <div>
                <dt>Form</dt>
                <dd>Thangka painting</dd>
              </div>
              <div>
                <dt>Depicted figure</dt>
                <dd>Avalokiteshvara</dd>
              </div>
              <div>
                <dt>Artist</dt>
                <dd>Documentation in progress</dd>
              </div>
              <div>
                <dt>Measurements</dt>
                <dd>Verification in progress</dd>
              </div>
              <div>
                <dt>Condition & materials</dt>
                <dd>Request the detailed record</dd>
              </div>
              <div>
                <dt>Price & availability</dt>
                <dd>By personal inquiry</dd>
              </div>
            </dl>
            <p className="record-note">
              The digital room is an exhibition study. Display scale is illustrative.
            </p>
          </div>
        </section>
        <section id="inquire" className="inquiry-section">
          <div className="inquiry-copy">
            <span className="section-number">04 / Begin a conversation</span>
            <h2>
              Some things
              <br />
              begin with
              <br />
              <em>a question.</em>
            </h2>
            <p>
              For availability, pricing, dimensions, or simply to learn more about the piece, write
              to us directly.
            </p>
            <a href="mailto:ashishforllc@gmail.com" className="text-link">
              Email the gallery <span aria-hidden="true">↗</span>
            </a>
          </div>
          <InquiryForm artifact={artifact} whatsAppHref="https://wa.me/15715030608" />
        </section>
      </main>
      <footer className="site-footer">
        <a href="#" className="brand-link">
          <EyeMark />
          <span>The Artisan’s Eye</span>
        </a>
        <p>A considered home for Nepali handcraft.</p>
        <a href="#main">Back to the work ↑</a>
      </footer>
    </>
  )
}
