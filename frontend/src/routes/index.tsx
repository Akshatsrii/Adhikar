import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="grid gap-16">
      <section className="grid items-center gap-10 md:grid-cols-[3fr_2fr]">
        <div>
          <p className="text-sm font-medium tracking-wide text-[var(--color-saffron-deep)]">
            AI for government benefits
          </p>
          <h1 className="mt-3 text-4xl leading-tight text-[var(--color-ink)] md:text-5xl">
            Find every scheme you qualify for.
            <br />
            Make sure the money actually reaches you.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
            Adhikar reads your profile and life events, matches you against verified
            government schemes with a transparent rule engine, and catches the paperwork
            mistakes that cause approved benefits to quietly fail at disbursement.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/register" className="btn-primary">
              Create your profile
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md border border-[var(--color-line)] px-5 py-2.5 text-[15px] font-medium text-[var(--color-ink)] hover:border-[var(--color-saffron)]"
            >
              I already have an account
            </Link>
          </div>
        </div>

        <div className="card">
          <p className="text-sm font-medium text-[var(--color-ink-soft)]">Why it's different</p>
          <ul className="mt-4 space-y-3 text-[15px] text-[var(--color-ink)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-govgreen)]">✓</span>
              Deterministic eligibility — never a guess
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-govgreen)]">✓</span>
              Family-level optimization, conflicts flagged
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-govgreen)]">✓</span>
              Document + DBT readiness checks before you submit
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
