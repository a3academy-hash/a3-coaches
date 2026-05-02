import { useState, useEffect } from "react";

// Deployed Apps Script Web App URL for the signatures sheet
const SIGNATURES_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxrFBOzqIsYhMaxPorEcXvSkPZYnaUuvvHC7IFJIuIj-6MTgAJbpPqaOFGzQ6egv3mL0A/exec";

// Background-check upload Apps Script + provider link
const FILE_UPLOADS_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx-6mnpVlAwNjQU5Bchs8m2PDreAHrHmXjO3fDKSIov4ViQ2GC7leErKM9ZCxv1xLEh7A/exec";
const BACKGROUND_CHECK_PROVIDER_URL = "https://www.fdle.state.fl.us/criminal-history-records/florida-checks";

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
    description: "Take your annual background check and upload the result page (Passed/Failed + Name + Date).",
    href: "/background",
    status: "active",
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
    description: "Sign and acknowledge the A3 Coaches Personal Conduct Policy on the record. Reviewed quarterly.",
    href: "/sign",
    status: "active",
  },
  {
    id: "payroll",
    title: "Payroll & Onboarding",
    description: "Independent contractor status, W-9, pay schedule, Zelle setup, reimbursements, travel, and the full missed-days + fines mechanics.",
    href: "/payroll",
    status: "active",
  },
];

// ── Rules data (12 categories) ──
const RULES = [
  {
    id: "attendance",
    title: "Attendance",
    summary: "Show up on time. Communicate absences to your campus director or head coach as early as possible. No-shows are taken seriously.",
    policy:
      "Coaches are expected at every scheduled session — practices, games, hitting sessions, small group work, fundraisers, and travel trips. Absences must be communicated to your campus director or head coach as far in advance as possible. A3 distinguishes between excused absences (illness, family emergencies, pre-approved time off) and no-shows (no notice or approval). Excused absences are understood, but pay docking for replacement coverage may still apply if absences become a pattern — see Payroll & Onboarding for the full pay mechanics. The consequences below cover no-shows and unexcused absences.",
    consequences: [
      { offense: "1st", action: "Immediate pay docking for the missed day. Documented warning. Possible fine under the conduct policy." },
      { offense: "2nd", action: "Formal meeting with leadership. Additional fine. Suspension from the next scheduled block." },
      { offense: "3rd", action: "Removal from staff." },
    ],
  },
  {
    id: "timeliness",
    title: "Timeliness",
    summary: "Arrive 15+ minutes before any published report time. Players' published times are for them, not coaches.",
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
    summary: "Self-correct curse-word slips. Know your audience — minimal cursing at middle school. Abusive language targeting a player is strictly prohibited.",
    policy:
      "Coaches must be aware of the language they are using and not set an example that using curse words daily is a proper way to communicate. Curse words, if ever used, must be carefully chosen or used as a slip-up — with retraction or apology. Coaches should always attempt to correct themselves and change their word usage if a curse word slips out during daily communication. As a general rule of thumb, there is very little tolerance for cursing at the middle school age level. Know your audience! A premier coach working with 18–19 year olds may have more cursing than a middle school group as a rule of thumb, but we are always striving to minimize cursing. Abusive language targeting a player is strictly prohibited.",
    ideal:
      "A3's coaches are examples that curse words are not necessary to get a critical point across, and respect from the players was earned in other ways.",
    consequences: [
      { offense: "1st", action: "Cursing directed or targeted at a middle school player: immediate suspension. Otherwise, verbal/written correction." },
      { offense: "2nd", action: "Written warning and fine." },
      { offense: "3rd", action: "Suspension or dismissal depending on severity and context." },
    ],
  },
  {
    id: "dress-code",
    title: "Dress Code",
    summary: "Maintain first-class appearance — groomed, clean, in shape. Don't break rules players can't break (2 chains max, no earrings).",
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
    summary: "Never on premises, in A3 gear, or in your system at any A3 venue. Single sip → off duty for the day.",
    policy:
      "Under no circumstance, whatsoever, may A3 coaches consume drugs or alcohol of any kind in front of players. Under no circumstance may A3 coaches do any work in the facility on a school day while any drugs or alcohol have been consumed. Under no circumstance may A3 coaches consume alcohol while wearing A3 gear. Once you have a single sip of alcohol, you are not allowed to report to any facilities, games, fields, or offices for the remainder of the day. Reporting to practice, games, hitting sessions, small group hitting, 1-on-1 work, fundraisers, travel trips, office work, or any A3 venue while drugs or alcohol are in your system at all is grounds for immediate suspension.",
    ideal:
      "A3's coaches don't feel the need to drink routinely during daytime hours and remain healthy, in good physical condition, and ready to bring energy the next day.",
    consequences: [
      { offense: "1st", action: "Immediate suspension." },
      { offense: "2nd", action: "Dismissal from staff." },
      { offense: "3rd", action: "—" },
    ],
  },
  {
    id: "vaping-smoking",
    title: "Vaping & Smoking",
    summary: "Never on A3 grounds, in vans, dugouts, or near players. Private use (off-premises) is fine.",
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
    summary: "Banned at A3 for coaches and players. Never in hand or in a bag on premises, in vans, at games, or in dugouts.",
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
    summary: "No trolling players. No bashing the program or coaches in front of players or in the community. Hold standards UNEMOTIONALLY.",
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
    summary: "Lock up. Clean dugouts and cages. Account for baseballs. Drive safely. Notice the little things without being asked.",
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
    summary: "Fair, intentional, documented. Never based on personal favorites or outside relationships.",
    policy:
      "Coaches manage playing time fairly and intentionally. Decisions are made in the player's developmental interest and the team's success — not based on personal favorites or relationships outside the program. Playing time decisions are documented and explained to players (and parents when appropriate) when asked.",
    consequences: [
      { offense: "1st", action: "Documented review with the coordinator. Conversation with affected players where appropriate." },
      { offense: "2nd", action: "Game suspension + meeting with leadership. Playing-time decisions reviewed by coordinator going forward." },
      { offense: "3rd", action: "Removal from playing-time decisions for the remainder of the season." },
    ],
  },
  {
    id: "arm-management",
    title: "Arm Management",
    summary: "Strict adherence to A3 pitch counts, rest days, and throwing protocols. No pitcher pushed past his limit to win a game.",
    policy:
      "Pitcher arm care is non-negotiable. Coaches follow A3's pitch-count, rest-day, and off-season throwing protocols at all times. No pitcher is pushed past his prescribed limit for the sake of winning a game. Velocity work, bullpens, and live ABs are tracked and reported to the pitching coordinator.",
    consequences: [
      { offense: "1st", action: "Documented review. Mandatory re-training on pitch-count protocols." },
      { offense: "2nd", action: "Written warning. Removed from pitching decisions; coordinator approves all bullpens for that coach's pitchers going forward." },
      { offense: "3rd", action: "Dismissal from any pitching-coach role. Continued violations lead to dismissal from staff." },
    ],
  },
  {
    id: "character-communication",
    title: "Character Building & Communication",
    summary: "Model character daily — integrity, work ethic, accountability, respect. Communicate concerns about players to leadership timely.",
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
          Coaches acknowledge this policy <strong>quarterly</strong> by initialing every section and signing on the record. Sign for the current quarter below.
        </div>
        <button
          style={{ ...styles.primaryBtn, marginTop: 14, maxWidth: 280 }}
          onClick={() => navigate("/sign")}
        >
          Sign Quarterly Acknowledgement →
        </button>
      </div>
    </>
  );
}

// ── Page: Sign ──
function getQuarterLabel() {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3) + 1;
  return `Q${q} ${now.getFullYear()}`;
}

function SignPage() {
  const [coachName, setCoachName] = useState("");
  const [campus, setCampus] = useState("");
  const [initials, setInitials] = useState({});
  const [overallSignature, setOverallSignature] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const quarterLabel = getQuarterLabel();
  const dateLabel = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const allInitialed = RULES.every((r) => (initials[r.id] || "").trim().length >= 1);
  const isValid =
    coachName.trim().length > 1 &&
    campus &&
    allInitialed &&
    overallSignature.trim().length > 1 &&
    acknowledged;

  const setInitial = (id, val) =>
    setInitials((s) => ({ ...s, [id]: val.toUpperCase().slice(0, 4) }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    const initialsPayload = Object.fromEntries(
      RULES.map((r) => [`Initials: ${r.title}`, (initials[r.id] || "").toUpperCase()])
    );
    const payload = {
      timestamp: new Date().toLocaleString(),
      quarter: quarterLabel,
      coachName: coachName.trim(),
      campus,
      ...initialsPayload,
      overallSignature: overallSignature.trim(),
      signatureDate: dateLabel,
      acknowledgedAll: "Yes",
    };
    try {
      await fetch(SIGNATURES_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Sheet submit error:", err);
      setSubmitted(true);
      setSubmitError("Saved locally. Sheet sync may be delayed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <button style={styles.backLink} onClick={() => navigate("/")}>← Coaches Portal</button>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✓</div>
          <div style={styles.successTitle}>Signed for {quarterLabel}</div>
          {submitError && (
            <p style={{ color: colors.warning, fontSize: 13, marginBottom: 12 }}>{submitError}</p>
          )}
          <p style={styles.successText}>
            Thanks, {coachName.split(" ")[0]}. Your acknowledgement is on the record. We'll prompt the next review at the start of the next quarter.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <button style={styles.backLink} onClick={() => navigate("/")}>← Coaches Portal</button>

      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroEyebrow}>QUARTERLY · {quarterLabel}</div>
          <div style={styles.heroTagline}>Conduct Policy Acknowledgement</div>
          <div style={styles.heroLead}>
            Initial each section to acknowledge you've read and will uphold the policy. Sign at the bottom to record your acknowledgement for {quarterLabel}.
          </div>
        </div>
      </div>

      <div style={styles.infoBox}>
        Need to re-read the full policy?{" "}
        <a
          href="/rules"
          onClick={(e) => { e.preventDefault(); navigate("/rules"); }}
          style={styles.inlineLink}
        >
          Open the Conduct, Rules &amp; Policies page →
        </a>
      </div>

      <div style={styles.sectionLabel}>Coach Information</div>
      <div style={styles.formCard}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Full Name <span style={styles.req}>*</span></label>
          <input
            style={styles.input}
            type="text"
            value={coachName}
            onChange={(e) => setCoachName(e.target.value)}
            placeholder="First Last"
            required
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Campus <span style={styles.req}>*</span></label>
          <div style={styles.radioRow}>
            {["Tampa", "Jacksonville"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCampus(c)}
                style={{ ...styles.radioBtn, ...(campus === c ? styles.radioBtnActive : {}) }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.sectionLabel}>Acknowledge Each Section</div>
      <div style={styles.signList}>
        {RULES.map((rule, i) => {
          const filled = (initials[rule.id] || "").trim().length >= 1;
          return (
            <div
              key={rule.id}
              style={{
                ...styles.signRow,
                ...(filled ? styles.signRowFilled : {}),
              }}
            >
              <div style={styles.signRowMain}>
                <div style={styles.signRowIndex}>{String(i + 1).padStart(2, "0")}</div>
                <div style={styles.signRowText}>
                  <div style={styles.signRowTitle}>{rule.title}</div>
                  <div style={styles.signRowSummary}>{rule.summary}</div>
                </div>
              </div>
              <div style={styles.signRowInitials}>
                <label style={styles.signInitialsLabel}>Initials</label>
                <input
                  style={styles.signInitialsInput}
                  type="text"
                  value={initials[rule.id] || ""}
                  onChange={(e) => setInitial(rule.id, e.target.value)}
                  placeholder="MB"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.sectionLabel}>Sign &amp; Submit</div>
      <div style={styles.formCard}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Typed Signature (Full Legal Name) <span style={styles.req}>*</span></label>
          <input
            style={{
              ...styles.input,
              fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
              fontSize: 24,
              fontStyle: "italic",
              padding: "12px 14px",
            }}
            type="text"
            value={overallSignature}
            onChange={(e) => setOverallSignature(e.target.value)}
            placeholder="Type your full legal name"
            required
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Date</label>
          <div style={styles.staticField}>{dateLabel}</div>
        </div>
        <div style={styles.checkRow} onClick={() => setAcknowledged(!acknowledged)}>
          <div style={{ ...styles.checkbox, ...(acknowledged ? styles.checkboxChecked : {}) }}>
            {acknowledged && <span style={{ color: "#fff", fontSize: 14, lineHeight: 1 }}>✓</span>}
          </div>
          <span style={styles.checkLabel}>
            I have read, understood, and agree to uphold all sections of the A3 Coaches Personal Conduct Policy. I understand the consequences for violations as outlined.
          </span>
        </div>
        <button
          style={{ ...styles.primaryBtn, ...(isValid && !submitting ? {} : styles.btnDisabled) }}
          disabled={!isValid || submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Submitting..." : `Sign for ${quarterLabel}`}
        </button>
      </div>
    </>
  );
}

// ── Page: Payroll & Onboarding ──
const PAYROLL_SECTIONS = [
  { id: "contractor", title: "Independent Contractor Status" },
  { id: "pay-schedule", title: "Pay Schedule" },
  { id: "payment-methods", title: "Payment Methods" },
  { id: "reimbursements", title: "Reimbursements" },
  { id: "travel", title: "Travel & Road Trips" },
  { id: "missed-days", title: "Missed Days & Coverage" },
  { id: "fines", title: "Fines & Withholdings" },
];

function PayrollPage() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <button style={styles.backLink} onClick={() => navigate("/")}>← Coaches Portal</button>

      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroEyebrow}>STAFF RESOURCES</div>
          <div style={styles.heroTagline}>Payroll &amp; Onboarding</div>
          <div style={styles.heroLead}>
            How A3 pays its coaches, what to expect on the schedule, and what to know about taxes, travel, and missed days.
          </div>
        </div>
      </div>

      <div style={styles.sectionLabel}>Jump To</div>
      <div style={styles.tocCard}>
        {PAYROLL_SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            style={styles.tocLink}
            onClick={(e) => { e.preventDefault(); scrollTo(s.id); }}
          >
            {s.title}
          </a>
        ))}
      </div>

      {/* Independent Contractor */}
      <div id="contractor" style={styles.payrollCard}>
        <div style={styles.payrollTitle}>Independent Contractor Status</div>
        <p style={styles.payrollText}>
          All A3 Academy coaches are engaged as <strong>independent contractors, not employees</strong>. As a condition of being onboarded, each coach must complete and submit a <strong>Form W-9</strong> prior to their first payment. A3 Academy will issue a <strong>Form 1099</strong> by January 31 each year to every coach who meets the IRS reporting threshold for the prior calendar year.
        </p>
        <p style={styles.payrollText}>
          Because coaches are independent contractors, <strong>no taxes are withheld</strong> from any payment. Each coach is solely responsible for estimating, reporting, and paying their own federal, state, and self-employment taxes throughout the year. Coaches should consult a tax professional with any questions about their personal tax obligations.
        </p>
      </div>

      {/* Pay Schedule */}
      <div id="pay-schedule" style={styles.payrollCard}>
        <div style={styles.payrollTitle}>Pay Schedule</div>
        <p style={styles.payrollText}>
          Coaches are paid <strong>twice per month, on or around the 1st and the 15th</strong>, give or take a day if either date falls on a Sunday. All pay is issued <strong>in arrears</strong> — each payment covers work that was completed during the prior pay period. A3 Academy does not pay in advance under any circumstances.
        </p>
        <div style={styles.payrollCallout}>
          <strong>Missing a payment?</strong> Contact A3 Academy immediately. Our automated billing schedule may have expired on our end, and we'll need to re-establish it to release your payment.
        </div>
      </div>

      {/* Payment Methods */}
      <div id="payment-methods" style={styles.payrollCard}>
        <div style={styles.payrollTitle}>Payment Methods</div>
        <p style={styles.payrollText}>
          A3 Academy issues all coach payments electronically. The standard method is <strong>Zelle</strong>, and every coach is required to enroll in Zelle using the email address or phone number tied to their bank account in order to receive payments.
        </p>
        <p style={styles.payrollText}>
          In rare cases where Zelle is unavailable, A3 may issue payment via <strong>Venmo</strong> as a backup option. <strong>No other payment methods (check, cash, direct deposit, etc.) are offered.</strong>
        </p>
      </div>

      {/* Reimbursements */}
      <div id="reimbursements" style={styles.payrollCard}>
        <div style={styles.payrollTitle}>Reimbursements</div>
        <p style={styles.payrollText}>
          If a coach incurs an approved out-of-pocket expense on behalf of A3 Academy, reimbursement will be issued through the <strong>same channel as payroll</strong> (Zelle, or Venmo in rare cases). Reimbursable expenses must be pre-approved or fall within standard team operations, and coaches should <strong>retain receipts</strong> for any expense they intend to submit.
        </p>
      </div>

      {/* Travel */}
      <div id="travel" style={styles.payrollCard}>
        <div style={styles.payrollTitle}>Travel &amp; Road Trips</div>
        <p style={styles.payrollText}>
          A3 Academy provides <strong>lodging</strong> for coaches on all road trips that require an overnight stay. Coaches do not pay for hotel rooms out of pocket.
        </p>
        <p style={styles.payrollText}>
          For transportation, A3 typically provides <strong>charter bus service</strong> to and from road trip destinations. Coaches are expected to travel with the team on the provided transportation. In other instances, coaches may be asked to drive A3 vans and will be compensated for that role.
        </p>
        <div style={styles.payrollCallout}>
          <strong>Personal vehicles:</strong> If a coach chooses to drive personally instead of using the provided team transportation, their fuel and travel costs are <strong>not reimbursable</strong> — by opting out, the coach assumes full responsibility for their own travel expenses. Mileage and fuel are only reimbursable when A3 is not providing team transportation for that trip.
        </div>
      </div>

      {/* Missed Days */}
      <div id="missed-days" style={styles.payrollCard}>
        <div style={styles.payrollTitle}>Missed Days &amp; Coverage</div>
        <p style={styles.payrollText}>
          <strong>Pay is docked for missed days.</strong> When a coach is unable to work a scheduled session, practice, or game, another coach must be brought in to cover that slot — and that replacement coach must be compensated. As a result, the absent coach's pay will be reduced accordingly for the days they did not work.
        </p>
        <p style={styles.payrollText}>
          A3 Academy distinguishes between two types of absences:
        </p>

        <div style={styles.absenceCard}>
          <div style={styles.absenceLabel}>EXCUSED ABSENCES</div>
          <div style={styles.absenceText}>
            Illness, family emergencies, pre-approved time off, and similar legitimate reasons are considered excused. Occasional excused absences are understood and accepted — life happens. However, A3 still has to pay a replacement coach to cover the slot, so <strong>frequent excused absences will result in pay being docked to fund that coverage</strong>. An excused absence protects your standing as a coach, but it does not automatically protect your paycheck once absences become a pattern.
          </div>
        </div>

        <div style={{ ...styles.absenceCard, borderLeftColor: colors.danger }}>
          <div style={{ ...styles.absenceLabel, color: colors.danger }}>NO-SHOWS / UNEXCUSED ABSENCES</div>
          <div style={styles.absenceText}>
            Failing to show up for a scheduled commitment without prior notice or approval is treated far more seriously. <strong>No-shows result in immediate pay docking for the missed day plus possible fines under the personal conduct policy</strong>, and repeated no-shows may result in removal from the staff.
          </div>
        </div>

        <div style={styles.payrollCallout}>
          Coaches are expected to communicate absences to their campus director or head coach as far in advance as possible. <strong>The earlier the notice, the easier it is to arrange coverage</strong> — and the smaller the impact on the team and on your pay.
        </div>
      </div>

      {/* Fines */}
      <div id="fines" style={styles.payrollCard}>
        <div style={styles.payrollTitle}>Fines &amp; Withholdings</div>
        <p style={styles.payrollText}>
          A3 Academy maintains a <a href="/rules" onClick={(e) => { e.preventDefault(); navigate("/rules"); }} style={styles.inlineLink}>personal conduct policy</a> with associated fines for violations (e.g., late arrival to a field, dress code, professionalism, etc.). When a fine is issued, the amount will be <strong>deducted from the coach's next scheduled payment</strong>.
        </p>
        <p style={styles.payrollText}>
          For example, if a coach receives a <strong>$50 fine</strong> for arriving late to a field, their next paycheck will be reduced by $50. The same applies to fines of any amount ($100, $200, etc.). Coaches will be notified of any fine and the corresponding deduction <strong>prior to the affected pay period</strong>.
        </p>
      </div>
    </>
  );
}

// ── Page: Background Checks ──
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const idx = result.indexOf(",");
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function BackgroundCheckPage() {
  const [coachName, setCoachName] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isValid = coachName.trim().length > 1 && file;

  const handleSubmit = async () => {
    setUploading(true);
    setSubmitError("");
    try {
      const fileData = await fileToBase64(file);
      const payload = {
        category: "Background Check",
        coachName: coachName.trim(),
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        fileData,
      };
      await fetch(FILE_UPLOADS_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Upload error:", err);
      setSubmitError("Upload failed. Please try again or contact A3.");
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <button style={styles.backLink} onClick={() => navigate("/")}>← Coaches Portal</button>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✓</div>
          <div style={styles.successTitle}>Background Check Uploaded</div>
          {submitError && (
            <p style={{ color: colors.warning, fontSize: 13, marginBottom: 12 }}>{submitError}</p>
          )}
          <p style={styles.successText}>
            Thanks, {coachName.split(" ")[0]}. Your file is on record in your {new Date().getFullYear()} folder. A3 leadership will review it.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <button style={styles.backLink} onClick={() => navigate("/")}>← Coaches Portal</button>

      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroEyebrow}>STAFF RESOURCES</div>
          <div style={styles.heroTagline}>Background Checks</div>
          <div style={styles.heroLead}>
            Required annually per A3 policy and the municipalities A3 works with.
          </div>
        </div>
      </div>

      <div style={styles.sectionLabel}>Step 1 · Take the Background Check</div>
      <div style={styles.payrollCard}>
        <p style={styles.payrollText}>
          A3 uses the Florida Department of Law Enforcement (FDLE) for annual background checks. On the FDLE site, please select <strong>Instant Search</strong>. The cost is usually around <strong>$24</strong>.
        </p>
        <p style={styles.payrollText}>
          When you reach the result page, <strong>do not close it</strong> — you'll need to capture it for upload in Step 3.
        </p>
        <a
          href={BACKGROUND_CHECK_PROVIDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.providerBtn}
        >
          Open FDLE Background Check →
        </a>
      </div>

      <div style={styles.sectionLabel}>Step 2 · Capture the Result</div>
      <div style={{ ...styles.payrollCard, borderLeft: `3px solid ${colors.danger}` }}>
        <div style={styles.criticalLabel}>Important · What we need to see</div>
        <p style={styles.payrollText}>
          Take a screenshot or save a PDF of the <strong>result page</strong> from the provider. The image must clearly show all three of:
        </p>
        <ul style={styles.bulletList}>
          <li><strong>RESULT</strong> — Passed or Failed</li>
          <li><strong>NAME</strong> — your full legal name</li>
          <li><strong>DATE</strong> — the date the result was issued</li>
        </ul>
        <div style={styles.dangerCallout}>
          <strong>A receipt of payment is not enough.</strong> A3 needs to see the actual result with your name and the date clearly visible — not just proof that you paid for the check.
        </div>
      </div>

      <div style={styles.sectionLabel}>Step 3 · Upload</div>
      <div style={styles.formCard}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Full Name <span style={styles.req}>*</span></label>
          <input
            style={styles.input}
            type="text"
            value={coachName}
            onChange={(e) => setCoachName(e.target.value)}
            placeholder="First Last (matches your existing folder if you have one)"
            required
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Background Check Result (image or PDF) <span style={styles.req}>*</span></label>
          <input
            style={styles.fileInput}
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files[0] || null)}
            required
          />
          {file && (
            <div style={styles.fileSelected}>
              Selected: {file.name} ({Math.round(file.size / 1024)} KB)
            </div>
          )}
        </div>
        {submitError && (
          <div style={{ color: colors.danger, fontSize: 13, marginBottom: 12 }}>{submitError}</div>
        )}
        <button
          style={{ ...styles.primaryBtn, ...(isValid && !uploading ? {} : styles.btnDisabled) }}
          disabled={!isValid || uploading}
          onClick={handleSubmit}
        >
          {uploading ? "Uploading..." : "Upload Background Check"}
        </button>
      </div>
    </>
  );
}

// ── App ──
export default function App() {
  const path = useUrlPath();

  let page;
  if (path === "/sign" || path.startsWith("/sign/")) {
    page = <SignPage />;
  } else if (path === "/rules" || path.startsWith("/rules/")) {
    page = <RulesPage />;
  } else if (path === "/payroll" || path.startsWith("/payroll/")) {
    page = <PayrollPage />;
  } else if (path === "/background" || path.startsWith("/background/")) {
    page = <BackgroundCheckPage />;
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

  // Form (sign page)
  formCard: {
    background: colors.card,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 12,
    padding: "22px 22px",
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: colors.textMuted,
    marginBottom: 6,
  },
  req: {
    color: colors.accent,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: 15,
    fontFamily: font,
    background: colors.input,
    border: `1px solid ${colors.cardBorderStrong}`,
    borderRadius: 8,
    color: colors.text,
    outline: "none",
    boxSizing: "border-box",
  },
  staticField: {
    padding: "10px 14px",
    fontSize: 15,
    fontWeight: 600,
    background: colors.input,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 8,
    color: colors.textMuted,
  },
  radioRow: {
    display: "flex",
    gap: 10,
  },
  radioBtn: {
    padding: "10px 22px",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: font,
    border: `1px solid ${colors.cardBorderStrong}`,
    borderRadius: 8,
    background: colors.input,
    color: colors.textMuted,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  radioBtnActive: {
    borderColor: colors.accent,
    color: colors.accent,
    background: colors.accentGlow,
  },
  inlineLink: {
    color: colors.accent,
    fontWeight: 700,
    textDecoration: "none",
  },

  // Sign list (per-section initials)
  signList: {
    background: colors.card,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 12,
    padding: "4px 0",
    marginBottom: 24,
  },
  signRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    padding: "14px 18px",
    borderBottom: `1px solid ${colors.cardBorder}`,
    transition: "background 0.15s",
  },
  signRowFilled: {
    background: colors.accentGlow,
  },
  signRowMain: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  signRowIndex: {
    fontSize: 12,
    fontWeight: 800,
    color: colors.accentSoft,
    letterSpacing: 1,
    minWidth: 24,
    paddingTop: 2,
  },
  signRowText: {
    flex: 1,
    minWidth: 0,
  },
  signRowTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 1.3,
  },
  signRowSummary: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 1.5,
  },
  signRowInitials: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
    flexShrink: 0,
  },
  signInitialsLabel: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.5,
    color: colors.accentSoft,
    textTransform: "uppercase",
  },
  signInitialsInput: {
    width: 72,
    padding: "8px 10px",
    fontSize: 16,
    fontWeight: 800,
    fontFamily: font,
    background: colors.input,
    border: `1px solid ${colors.cardBorderStrong}`,
    borderRadius: 6,
    color: colors.accent,
    outline: "none",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // Checkbox
  checkRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 18,
    cursor: "pointer",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    border: `2px solid ${colors.cardBorderStrong}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
    transition: "all 0.15s",
  },
  checkboxChecked: {
    background: colors.accent,
    borderColor: colors.accent,
  },
  checkLabel: {
    fontSize: 13.5,
    color: colors.text,
    lineHeight: 1.55,
  },

  // Buttons
  primaryBtn: {
    width: "100%",
    padding: "14px 24px",
    fontSize: 16,
    fontWeight: 700,
    fontFamily: font,
    background: `linear-gradient(135deg, ${colors.accent}, #1a4d9e)`,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  btnDisabled: {
    opacity: 0.35,
    cursor: "not-allowed",
  },

  // Success
  successBox: {
    background: colors.card,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 14,
    padding: "32px 24px",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#2ecc71",
    color: "#fff",
    fontSize: 28,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "#2ecc71",
    marginBottom: 10,
  },
  successText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 1.6,
  },

  // Payroll page
  payrollCard: {
    background: colors.card,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 12,
    padding: "24px 24px 18px",
    marginBottom: 18,
    scrollMarginTop: 16,
  },
  payrollTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: colors.text,
    marginBottom: 14,
    lineHeight: 1.2,
  },
  payrollText: {
    fontSize: 14.5,
    color: colors.text,
    lineHeight: 1.7,
    marginBottom: 14,
  },
  payrollCallout: {
    background: colors.accentGlow,
    border: `1px solid ${colors.accent}55`,
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: 13.5,
    color: colors.text,
    lineHeight: 1.6,
    marginTop: 6,
    marginBottom: 6,
  },
  absenceCard: {
    background: colors.input,
    border: `1px solid ${colors.cardBorder}`,
    borderLeft: `3px solid ${colors.accent}`,
    borderRadius: 8,
    padding: "14px 16px",
    marginBottom: 12,
  },
  absenceLabel: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.5,
    color: colors.accentSoft,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  absenceText: {
    fontSize: 13.5,
    color: colors.text,
    lineHeight: 1.6,
  },

  // Background check page
  providerBtn: {
    display: "inline-block",
    padding: "12px 22px",
    fontSize: 15,
    fontWeight: 700,
    fontFamily: font,
    background: `linear-gradient(135deg, ${colors.accent}, #1a4d9e)`,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    textDecoration: "none",
    cursor: "pointer",
    marginTop: 4,
  },
  criticalLabel: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.danger,
    marginBottom: 10,
  },
  bulletList: {
    paddingLeft: 22,
    marginBottom: 14,
    color: colors.text,
    fontSize: 14,
    lineHeight: 1.8,
  },
  dangerCallout: {
    background: "rgba(210, 74, 74, 0.12)",
    border: `1px solid ${colors.danger}55`,
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: 13.5,
    color: colors.text,
    lineHeight: 1.6,
    marginTop: 6,
  },
  fileInput: {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    fontFamily: font,
    background: colors.input,
    border: `1px solid ${colors.cardBorderStrong}`,
    borderRadius: 8,
    color: colors.text,
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  fileSelected: {
    marginTop: 8,
    fontSize: 12.5,
    color: colors.accentSoft,
    fontWeight: 600,
  },
};
