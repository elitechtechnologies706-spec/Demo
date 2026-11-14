type MetricCardProps = {
  title: string;
  detail: string;
};

function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="page-title">{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

function MetricCard({ title, detail }: MetricCardProps) {
  return (
    <article className="soft-card" data-testid={`card-${title.toLowerCase().replaceAll(" ", "-")}`}>
      <h2>{title}</h2>
      <p>{detail}</p>
      <span className="tag">Live data after launch</span>
    </article>
  );
}

export function InceptionPage() {
  const milestones = [
    ["14 Dec", "Homepage"],
    ["End Jan", "Full Site"],
    ["15 Feb", "Approval"],
    ["29 Nov 2027", "Handover"],
  ];

  return (
    <main>
      <PageIntro
        eyebrow="Project Inception"
        title="Understanding and delivery plan"
        description="A shared outline of the project approach, milestones, dependencies, and content cadence."
      />
      <section className="section">
        <div className="container">
          <div className="content-grid">
            <article className="soft-card">
              <h2>Understanding</h2>
              <p>
                The work supports CRVPF communications, partner reporting,
                safeguarding, and impact visibility, with communications
                approval required before publication.
              </p>
            </article>
            <article className="soft-card">
              <h2>Methodology</h2>
              <p>
                Review the existing site and content, agree the structure with
                CRVPF, build and test in stages, train staff, and hand over the
                agreed materials and operating procedures.
              </p>
            </article>
          </div>

          <section className="soft-card" style={{ marginTop: 24 }}>
            <h2>Timeline</h2>
            <ol className="timeline" aria-label="Project timeline">
              {milestones.map(([date, task]) => (
                <li className="timeline-item" key={date}>
                  <strong>{date}</strong>
                  <span>{task}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="content-grid" style={{ marginTop: 24 }}>
            <article className="soft-card">
              <h2>Risks + Dependencies</h2>
              <ul className="check-list">
                <li>Live site and hosting access must be arranged for the audit.</li>
                <li>CRVPF Communications approval is required before publication.</li>
                <li>Approved stories, images, and report files are needed for final content.</li>
              </ul>
            </article>
            <article className="soft-card">
              <h2>Content Plan</h2>
              <ul className="check-list">
                <li>2 stories/month</li>
                <li>1 newsletter/month</li>
                <li>1 impact update/quarter</li>
              </ul>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

const auditAreas = [
  "WordPress",
  "Elementor",
  "Speed",
  "Mobile",
  "Broken Links",
  "SEO",
  "Security",
  "Backups",
  "Accessibility",
  "Hosting",
];

export function AuditPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Site Audit"
        title="Audit review"
        description="A review template for the live WordPress site. No live-site findings are assumed."
      />
      <section className="section">
        <div className="container">
          <p className="notice">
            To be confirmed after CRVPF gives live site access.
          </p>
          <div className="table-scroll">
            <table className="financial-table">
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Cause</th>
                  <th>Fix</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {auditAreas.map((area) => (
                  <tr key={area}>
                    <th scope="row">{area}</th>
                    <td>Awaiting live-site review</td>
                    <td>To be assessed after access</td>
                    <td>To be confirmed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

export function AnalyticsPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Analytics"
        title="Measurement overview"
        description="Analytics and Search Console reporting for the CRVPF site."
      />
      <section className="section">
        <div className="container">
          <div className="analytics-preview">
            <MetricCard title="Visitors" detail="GA4 · Not connected" />
            <MetricCard title="Top Pages" detail="GA4 + Search Console · Not connected" />
            <MetricCard title="Mobile vs Desktop" detail="GA4 · Not connected" />
            <MetricCard title="Downloads" detail="GA4 + Search Console · Not connected" />
          </div>
          <p className="notice" style={{ marginTop: 24 }}>
            Live data after launch.
          </p>
        </div>
      </section>
    </main>
  );
}

const hostingRows = ["Cost", "Speed", "Backup", "Support", "Security"];

export function HostingPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Hosting"
        title="Hosting comparison"
        description="i3C and alternative hosting will be compared before a recommendation is made."
      />
      <section className="section">
        <div className="container">
          <div className="table-scroll">
            <table className="financial-table">
              <thead>
                <tr>
                  <th>Criteria</th>
                  <th>i3C</th>
                  <th>Alternative</th>
                </tr>
              </thead>
              <tbody>
                {hostingRows.map((item) => (
                  <tr key={item}>
                    <th scope="row">{item}</th>
                    <td>To be tested</td>
                    <td>To be compared</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="notice" style={{ marginTop: 24 }}>
            Recommendation after testing. Hosting / Domain / Plugins at cost
            with receipts.
          </p>
        </div>
      </section>
    </main>
  );
}
