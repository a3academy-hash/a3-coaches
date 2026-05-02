import { useState, useEffect } from "react";

// ── URL routing (no router lib) ──
function useUrlPath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return path;
}

function navigate(href) {
  if (href === window.location.pathname) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  window.history.pushState({}, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0 });
}

// ── Portal sections (home page) ──
const PORTAL_SECTIONS = [
  {
    id: "rules",
    title: "Conduct, Rules & Policies",
    description: "Read A3's coaches personal conduct policy, rules, and the consequences for 1st, 2nd, and 3rd offenses.",
    href: "/rules",
    status: "active",
  },
  {
    id: "background",
    title: "Background Checks",
    description: "Submit and renew your background check on file with A3 Academy.",
    status: "coming-soon",
  },
  {
    id: "certifications",
    title: "Certifications",
    description: "Coaching, first aid, and concussion certifications — upload, view, and renew.",
    status: "coming-soon",
  },
  {
    id: "signature",
    title: "Conduct Policy Signature",
    description: "Sign and acknowledge the A3 Coaches Personal Conduct Policy on the record.",
    status: "coming-soon",
  },
  {
    id: "w9",
    title: "W-9 / Tax Forms",
    description: "Submit and update your W-9 and other onboarding tax paperwork.",
    status: "coming-soon",
  },
  {
    id: "onboarding",
    title: "Onboarding",
    description: "First-day orientation, facility tour, payroll setup, and program overview.",
    status: "coming-soon",
  },
];

// ── Rules data (12 categories) ──
const RULES = [
  {
    id: "attendance",
    title: "Attendance",
    policy:
      "Coaches are expected at every scheduled session — practices, games, hitting sessions, small group work, fundraisers, and travel trips. Absences must be communicated to leadership at least 24 hours in advance unless it is a true emergency. Showing up is the foundation of every other rule on this page.",
    consequences: [
      { offense: "1st", action: "Documented warning. Same-day pay deducted." },
      { offense: "2nd", action: "Formal meeting with leadership. Suspension from the next training block." },
      { offense: "3rd", action: "Dismissal from staff." },
    ],
    draft: true,
  },
  {
    id: "timeliness",
    title: "Timeliness",
    policy:
      "It is mandatory that A3's coaches arrive at a bare minimum of 15 minutes prior to the start of any report time. Published report times are for players to follow. Arriving 15 minutes early sets the example, lets coaches check who isn't on time, lets coaches plan and communicate with each other and players, and lets coaches check in with players off the field.",
    ideal:
      "A3's coaches are there 20+ minutes early so that when the players who are 15 minutes early arrive, coaches are there to greet them — not walking alongside them from the cars.",
    consequences: [
      { offense: "1st", action: "Verbal correction, documented in coach file." },
      { offense: "2nd", action: "Written warning. $50 deducted from next pay cycle." },
      { offense: "3rd", action: "One-week suspension. Repeat offenses lead to dismissal." },
    ],
  },
  {
    id: "language",
    title: "Language",
    policy:
      "Coaches must be aware of the language they are using and not set an example that using curse words daily is a proper way to communicate. Curse words, if ever used, must be carefully chosen or used as a slip-up — with retraction or apology. Curse words used as part of a speech may happen from time to time. Curse words directed at a specific player to demean, criticize, challenge, or embarrass him are strictly prohibited.",
    ideal:
      "A3's coaches are examples that curse words are not necessary to get a critical point across, and respect from the players was earned in other ways.",
    consequences: [
      { offense: "1st", action: "Verbal/written correction. Cursing directed at a player → immediate suspension regardless of count." },
      { offense: "2nd", action: "Written warning + fine." },
      { offense: "3rd", action: "Suspension or dismissal depending on severity and context." },
    ],
  },
  {
    id: "dress-code",
    title: "Dress Code",
    policy:
      "A3's coaches make their best effort to maintain a healthy and first-class physical appearance as an example to players. Coaches should be properly shaven and groomed. Coaches' clothes should be properly washed and worn. Coaches do not break rules players aren't allowed to break (2 chains max, no earrings).",
    ideal:
      "Short of personal health problems, A3's coaches are doing their best to stay in shape, take care of their bodies, and earn respect from the players in every way they present themselves.",
    consequences: [
      { offense: "1st", action: "Verbal correction on the spot." },
      { offense: "2nd", action: "Sent home to change. Documented." },
      { offense: "3rd", action: "Written warning + leadership meeting." },
    ],
  },
  {
    id: "alcohol-drugs",
    title: "Alcohol & Drugs",
    policy:
      "Under no circumstance, whatsoever, may A3 coaches consume drugs or alcohol of any kind in front of players. Under no circumstance may A3 coaches do any work in the facility on a school day while any drugs or alcohol have been consumed. Under no circumstance may A3 coaches consume alcohol while wearing A3 gear. Once you have a single sip of alcohol, you are not allowed to report to any facilities, games, fields, or offices for the remainder of the day. Reporting to practice, games, hitting sessions, small group hitting, 1-on-1 work, fundraisers, travel trips, office work, or any A3 venue while drugs or alcohol are in your system at all is an immediate, fireable offense.",
    ideal:
      "A3's coaches don't feel the need to drink routinely during daytime hours and remain healthy, in good physical condition, and ready to bring energy the next day.",
    consequences: [
      { offense: "1st", action: "Immediate dismissal. There is no second chance on this policy." },
      { offense: "2nd", action: "—" },
      { offense: "3rd", action: "—" },
    ],
    severity: "high",
  },
  {
    id: "vaping-smoking",
    title: "Vaping & Smoking",
    policy:
      "Vaping and smoking is prohibited anywhere on A3 grounds, at the facility, at practices, in dugouts, in a hotel with the door open with players anywhere near, or on a bus or in the van — with or without players present. Coaches may vape or smoke in private: off A3 premises (not in the office), in their cars privately, at home, in their hotel room with the door closed, or at non-A3 events in their personal lives.",
    ideal:
      "A3's coaches are adult men who can do what they please in their private lives. Coaches understand the difference between public and private — and the perception of vaping or smoking in front of parents, players, or in the office.",
    consequences: [
      { offense: "1st", action: "Verbal correction. Leave the area to dispose." },
      { offense: "2nd", action: "Written warning + fine." },
      { offense: "3rd", action: "Suspension. Repeat → dismissal." },
    ],
  },
  {
    id: "energy-drinks",
    title: "Energy Drinks",
    policy:
      "Energy drinks are banned at A3 — for players and coaches. They are extremely harmful, cause more problems than benefits, and set a bad example that the rules apply to the kids but not the coaches. If players are not allowed to drink something, neither are coaches. Coaches may consume energy drinks in their cars, at home, etc., but should never step foot on A3 premises, in vans, at games, or in dugouts with these drinks in hand or in a bag.",
    ideal:
      "Coaches have energy because they had a good night's sleep, are on healthy diets, and have routines that let them feel great and sustain energy naturally — which also saves money.",
    consequences: [
      { offense: "1st", action: "Verbal correction. Drink discarded." },
      { offense: "2nd", action: "Written warning in coach file." },
      { offense: "3rd", action: "Suspension or fine." },
    ],
  },
  {
    id: "decorum",
    title: "Decorum",
    subtitle: "Trolling · Criticism · Disciplining",
    policy:
      "Coaches do not engage in 'trolling' — picking out player flaws to hurt them, get under their skin, call them out, or make them uncomfortable. Coaching a player through his flaws and challenging him is one thing; making fun of his height, weight, arm strength, hitting flaws, yips, or position ability is hugely detrimental to his career. Coaches do not criticize the program or other coaches in front of players or to others in the community — grievances belong in private leadership meetings, never undermined to players. Coaches actively discipline players when standards break — making excuses for them undermines culture.",
    ideal:
      "A3's coaches are tough when they need to be — they call things out, challenge players — but ultimately the player never questions that the coach loves him and wants him to succeed. Coaches hold standards UNEMOTIONALLY, without curse words or explosive outrage, and curb trolling among players to keep the environment positive.",
    consequences: [
      { offense: "1st", action: "Documented conversation with leadership." },
      { offense: "2nd", action: "Written warning + structured improvement plan." },
      { offense: "3rd", action: "Suspension or dismissal — public bashing of program or targeted trolling of players accelerates penalties." },
    ],
  },
  {
    id: "facility-stewardship",
    title: "Facility & Equipment Stewardship",
    policy:
      "Coaches pay attention to details and own the following areas: language and yelling around parents in the stands; closing the facility (doors locked, gate locked, properly shut down each day); spotless dugouts (players assigned as captains rather than generic asks); safe driving (road laws, seatbelts, no speeding); baseball management (searched for every practice, zipped up, put back); cage cleanup (Hit Trax off, computer shut down, baseballs back in buckets); and monitoring that players complete their daily tasks.",
    ideal:
      "A3's coaches take personal pride and responsibility in noticing the little things without being asked. Little things out of place bother A3's coaches because they are investing their hearts into this.",
    consequences: [
      { offense: "1st", action: "Verbal correction. Documented if recurring." },
      { offense: "2nd", action: "Written warning + retraining on the relevant protocol." },
      { offense: "3rd", action: "Suspension or fine. Repeat negligence → dismissal." },
    ],
  },
  {
    id: "playing-time",
    title: "Playing Time Management",
    policy:
      "Coaches manage playing time fairly and intentionally. Decisions are made in the player's developmental interest and the team's success — not based on personal favorites or relationships outside the program. Playing time decisions are documented and explained to players (and parents when appropriate) when asked.",
    consequences: [
      { offense: "1st", action: "Documented review with the coordinator. Conversation with affected players where appropriate." },
      { offense: "2nd", action: "Game suspension + meeting with leadership. Playing-time decisions reviewed by coordinator going forward." },
      { offense: "3rd", action: "Removal from playing-time decisions for the remainder of the season." },
    ],
    draft: true,
  },
  {
    id: "arm-management",
    title: "Arm Management",
    policy:
      "Pitcher arm care is non-negotiable. Coaches follow A3's pitch-count, rest-day, and off-season throwing protocols at all times. No pitcher is pushed past his prescribed limit for the sake of winning a game. Velocity work, bullpens, and live ABs are tracked and reported to the pitching coordinator.",
    consequences: [
      { offense: "1st", action: "Documented review. Mandatory re-training on pitch-count protocols." },
      { offense: "2nd", action: "Written warning. Removed from pitching decisions; coordinator approves all bullpens for that coach's pitchers going forward." },
      { offense: "3rd", action: "Dismissal from any pitching-coach role. Continued violations lead to dismissal from staff." },
    ],
    draft: true,
  },
  {
    id: "character-communication",
    title: "Character Building & Communication",
    policy:
      "A3's mission isn't just better players — it's better young men. Coaches model character daily: integrity, work ethic, accountability, respect for opponents and umpires, and care off the field. Coaches communicate timely concerns to leadership about a player's mental state, desire to leave the program, and any off-the-field issues that could harm the player or A3's reputation in the community.",
    ideal:
      "A3's coaches can trust A3 leadership not to blow up their trust and are willing to share more information to help A3 create an environment that better serves an athlete or protects our other athletes. The default is 'let's think how to address this.'",
    consequences: [
      { offense: "1st", action: "Documented conversation. The pattern is the focus, not a single act." },
      { offense: "2nd", action: "Written warning + leadership meeting." },
      { offense: "3rd", action: "Suspension or removal from staff." },
    ],
  },
];

// ── Header ──
function Header() {
  return (
    <div style={styles.header}>
      <div style={styles.logoRow} onClick={() => navigate("/")} role="button" tabIndex={0}>
        <img src="/pics/a3-logo.png" alt="A3 Academy" style={styles.logoMark} />
        <div style={styles.brandText}>
          <div style={styles.brandSub}>A3 ACADEMY</div>
          <div style={styles.brandYear}>COACHES</div>
        </div>
      </div>
      <div style={styles.headerTagline}>
        <span style={styles.internalBadge}>INTERNAL</span> Coaches Portal
      </div>
    </div>
  );
}

// ── Footer ──
function Footer() {
  return (
    <div style={styles.footer}>
      A3 Academy · Internal Coaches Portal · Tampa &amp; Jacksonville, FL
    </div>
  );
}

// ── Page: Home ──
function HomePage() {
  return (
    <>
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroEyebrow}>STAFF RESOURCES</div>
          <div style={styles.heroTagline}>Coaches Portal</div>
          <div style={styles.heroLead}>
            Conduct policy, rules and consequences, onboarding, certifications, and tax paperwork — everything A3 coaches need in one place.
          </div>
        </div>
      </div>

      <div style={styles.sectionLabel}>Sections</div>
      <div style={styles.portalGrid}>
        {PORTAL_SECTIONS.map((s) => {
          const isActive = s.status === "active";
          return (
            <div
              key={s.id}
              style={{
                ...styles.portalCard,
                ...(isActive ? styles.portalCardActive : styles.portalCardInactive),
              }}
              onClick={() => isActive && navigate(s.href)}
              role={isActive ? "button" : undefined}
              tabIndex={isActive ? 0 : undefined}
            >
              <div style={styles.portalCardHeader}>
                <div style={styles.portalCardTitle}>{s.title}</div>
                {isActive ? (
                  <span style={styles.portalBadgeActive}>OPEN</span>
                ) : (
                  <span style={styles.portalBadgeSoon}>SOON</span>
                )}
              </div>
              <div style={styles.portalCardDescription}>{s.description}</div>
              {isActive && <div style={styles.portalCardCTA}>Open →</div>}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Page: Rules ──
function RulesPage() {
  return (
    <>
      <button style={styles.backLink} onClick={() => navigate("/")}>
        ← Coaches Portal
      </button>

      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroEyebrow}>A3 ACADEMY</div>
          <div style={styles.heroTagline}>Coaches Conduct, Rules &amp; Policies</div>
          <div style={styles.heroLead}>
            The standards every A3 coach is expected to meet — and the consequences for failing them.
          </div>
        </div>
      </div>

      <div style={styles.sectionLabel}>Mission</div>
      <div style={styles.infoBox}>
        A3 Academy strives to have the best coaching staff in the nation — and that starts with our coaches being <strong>professional, organized, and caring at all times</strong>. Being the best coach does not mean simply showing up and being a guru. A3's coaches go above and beyond in serving as role models for young men, and above and beyond in caring for our equipment, vehicles, the facility, and the facilities we rent.
      </div>

      <div style={styles.sectionLabel}>Jump To</div>
      <div style={styles.tocCard}>
        {RULES.map((r) => (
          <a
            key={r.id}
            href={`#${r.id}`}
            style={styles.tocLink}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(r.id);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {r.title}
          </a>
        ))}
      </div>

      <div style={styles.sectionLabel}>Categories</div>
      {RULES.map((rule) => (
        <div key={rule.id} id={rule.id} style={styles.ruleCard}>
          <div style={styles.ruleHeader}>
            <div>
              <div style={styles.ruleTitle}>{rule.title}</div>
              {rule.subtitle && <div style={styles.ruleSubtitle}>{rule.subtitle}</div>}
            </div>
            {rule.draft && <span style={styles.draftBadge}>DRAFT</span>}
            {rule.severity === "high" && <span style={styles.severityBadge}>ZERO TOLERANCE</span>}
          </div>

          <div style={styles.rulePolicy}>{rule.policy}</div>

          {rule.ideal && (
            <div style={styles.idealCallout}>
              <span style={styles.idealLabel}>IDEAL · </span>
              {rule.ideal}
            </div>
          )}

          <div style={styles.consequencesLabel}>Consequences</div>
          <div style={styles.consequencesGrid}>
            {rule.consequences.map((c) => (
              <div
                key={c.offense}
                style={{
                  ...styles.consequenceCell,
                  ...(c.action === "—" ? styles.consequenceCellEmpty : {}),
                }}
              >
                <div style={styles.consequenceOffense}>{c.offense} Offense</div>
                <div style={styles.consequenceAction}>{c.action}</div>
              </div>
            ))}
          </div>

          {rule.draft && (
            <div style={styles.draftNote}>
              Draft language — final wording and consequences subject to leadership review.
            </div>
          )}
        </div>
      ))}

      <div style={styles.policyAcknowledgement}>
        <div style={styles.policyAckLabel}>Policy Acknowledgement</div>
        <div style={styles.policyAckText}>
          Once digital signature is set up, every coach will sign and acknowledge this policy on the record before reporting for any A3 work. Until then, coaches are expected to read, understand, and uphold every standard above.
        </div>
      </div>
    </>
  );
}

// ── App ──
export default function App() {
  const path = useUrlPath();

  let page;
  if (path === "/rules" || path.startsWith("/rules/")) {
    page = <RulesPage />;
  } else {
    page = <HomePage />;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Header />
        {page}
        <Footer />
      </div>
    </div>
  );
}

// ── STYLES ──
const colors = {
  bg: "#050a14",
  card: "#0d1929",
  cardBorder: "#1a2a47",
  cardBorderStrong: "#2a4170",
  accent: "#2d70d0",
  accentDeep: "#0d2552",
  accentSoft: "#a8c8e8",
  accentGlow: "rgba(45, 112, 208, 0.18)",
  warning: "#e8a020",
  danger: "#d24a4a",
  text: "#e8edf5",
  textMuted: "#8a96aa",
  input: "#0f1d33",
};

const font = "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif";

const styles = {
  page: {
    minHeight: "100vh",
    background: colors.bg,
    fontFamily: font,
    color: colors.text,
    padding: "24px 16px",
  },
  container: {
    maxWidth: 760,
    margin: "0 auto",
  },

  // Header
  header: {
    textAlign: "center",
    marginBottom: 32,
    paddingBottom: 24,
    borderBottom: `1px solid ${colors.cardBorder}`,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 10,
    cursor: "pointer",
  },
  logoMark: {
    width: 96,
    height: 96,
    objectFit: "contain",
    display: "block",
    clipPath: "circle(48% at center)",
  },
  brandText: {
    textAlign: "left",
    lineHeight: 1,
  },
  brandSub: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 4,
    color: colors.accentSoft,
    marginBottom: 4,
  },
  brandYear: {
    fontSize: 36,
    fontWeight: 900,
    letterSpacing: 2,
    color: colors.text,
    lineHeight: 1,
    textShadow: `0 0 24px ${colors.accentGlow}`,
  },
  headerTagline: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  internalBadge: {
    background: colors.warning,
    color: "#0c0f14",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.5,
    padding: "3px 8px",
    borderRadius: 4,
  },

  // Hero
  heroSection: {
    position: "relative",
    minHeight: 240,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 14,
    marginBottom: 32,
    background: `linear-gradient(135deg, ${colors.card} 0%, ${colors.accentDeep} 100%)`,
    overflow: "hidden",
    display: "flex",
    alignItems: "flex-end",
  },
  heroOverlay: {
    width: "100%",
    padding: "32px 26px 28px",
    textAlign: "center",
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 3,
    color: colors.accentSoft,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  heroTagline: {
    fontSize: 30,
    fontWeight: 900,
    letterSpacing: 1,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 1.15,
  },
  heroLead: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 1.55,
    maxWidth: 560,
    margin: "0 auto",
    fontWeight: 500,
  },

  // Section labels
  sectionLabel: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.accentSoft,
    marginBottom: 14,
    marginTop: 12,
  },

  // Back link
  backLink: {
    background: "transparent",
    border: "none",
    color: colors.accentSoft,
    fontSize: 13,
    fontWeight: 700,
    fontFamily: font,
    cursor: "pointer",
    padding: "6px 0",
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  // Portal cards (home)
  portalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
    marginBottom: 32,
  },
  portalCard: {
    background: colors.card,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 12,
    padding: "20px 22px",
    transition: "border-color 0.15s, transform 0.15s",
  },
  portalCardActive: {
    cursor: "pointer",
    borderLeft: `3px solid ${colors.accent}`,
  },
  portalCardInactive: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  portalCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  portalCardTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: colors.text,
    lineHeight: 1.25,
  },
  portalBadgeActive: {
    background: colors.accent,
    color: "#fff",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.5,
    padding: "3px 8px",
    borderRadius: 4,
    flexShrink: 0,
  },
  portalBadgeSoon: {
    background: colors.cardBorder,
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.5,
    padding: "3px 8px",
    borderRadius: 4,
    flexShrink: 0,
  },
  portalCardDescription: {
    fontSize: 13.5,
    color: colors.textMuted,
    lineHeight: 1.55,
    marginBottom: 12,
  },
  portalCardCTA: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.accent,
    letterSpacing: 0.3,
  },

  // Info box
  infoBox: {
    background: colors.input,
    border: `1px solid ${colors.cardBorder}`,
    borderLeft: `3px solid ${colors.accent}`,
    borderRadius: 8,
    padding: "16px 20px",
    fontSize: 14.5,
    color: colors.text,
    lineHeight: 1.65,
    marginBottom: 28,
  },

  // TOC
  tocCard: {
    background: colors.card,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 10,
    padding: "16px 18px",
    marginBottom: 28,
    display: "flex",
    flexWrap: "wrap",
    gap: "10px 14px",
  },
  tocLink: {
    fontSize: 13.5,
    fontWeight: 600,
    color: colors.accentSoft,
    textDecoration: "none",
    padding: "4px 8px",
    borderRadius: 6,
    background: colors.input,
    border: `1px solid ${colors.cardBorder}`,
    cursor: "pointer",
  },

  // Rule cards
  ruleCard: {
    background: colors.card,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 12,
    padding: "24px 24px 20px",
    marginBottom: 18,
    scrollMarginTop: 16,
  },
  ruleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 14,
  },
  ruleTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: colors.text,
    lineHeight: 1.2,
  },
  ruleSubtitle: {
    fontSize: 12.5,
    color: colors.accentSoft,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 4,
  },
  draftBadge: {
    background: colors.warning,
    color: "#0c0f14",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.5,
    padding: "4px 9px",
    borderRadius: 4,
    flexShrink: 0,
  },
  severityBadge: {
    background: colors.danger,
    color: "#fff",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.5,
    padding: "4px 9px",
    borderRadius: 4,
    flexShrink: 0,
  },
  rulePolicy: {
    fontSize: 14.5,
    color: colors.text,
    lineHeight: 1.65,
    marginBottom: 16,
  },
  idealCallout: {
    background: colors.accentGlow,
    border: `1px solid ${colors.accent}55`,
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: 13.5,
    color: colors.text,
    lineHeight: 1.6,
    fontStyle: "italic",
    marginBottom: 18,
  },
  idealLabel: {
    fontWeight: 800,
    letterSpacing: 1.5,
    color: colors.accent,
    fontStyle: "normal",
  },
  consequencesLabel: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.accentSoft,
    marginBottom: 10,
  },
  consequencesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
    marginBottom: 4,
  },
  consequenceCell: {
    background: colors.input,
    border: `1px solid ${colors.cardBorderStrong}`,
    borderRadius: 8,
    padding: "12px 14px",
  },
  consequenceCellEmpty: {
    opacity: 0.35,
  },
  consequenceOffense: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.5,
    color: colors.accentSoft,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  consequenceAction: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 1.5,
  },
  draftNote: {
    marginTop: 12,
    fontSize: 12,
    color: colors.warning,
    fontStyle: "italic",
  },

  // Acknowledgement footer
  policyAcknowledgement: {
    background: colors.card,
    border: `1px solid ${colors.cardBorder}`,
    borderTop: `3px solid ${colors.accent}`,
    borderRadius: 10,
    padding: "20px 22px",
    marginTop: 14,
    marginBottom: 24,
  },
  policyAckLabel: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 2,
    color: colors.accentSoft,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  policyAckText: {
    fontSize: 13.5,
    color: colors.text,
    lineHeight: 1.6,
  },

  // Footer
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: colors.textMuted,
    padding: "24px 0",
    letterSpacing: 0.5,
  },
};
