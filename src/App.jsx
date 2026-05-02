import { useState, useEffect } from "react";

// Deployed Apps Script Web App URL for the signatures sheet
const SIGNATURES_SHEETS_URL = "https://script.google.com/macros/s/AKfycbx-6mnpVlAwNjQU5Bchs8m2PDreAHrHmXjO3fDKSIov4ViQ2GC7leErKM9ZCxv1xLEh7A/exec";

// Background-check upload Apps Script + provider link
const FILE_UPLOADS_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxOYruVCS82PsGz-wAimHe4-xV6D0z1_FTGOqS04LVF4NfB9HCgOOs2H8p77rJj31yj/exec";
const BACKGROUND_CHECK_PROVIDER_URL = "https://www.fdle.state.fl.us/criminal-history-records/florida-checks";

// Pre-employment intake form Apps Script (replace placeholder when deployed)
const INTAKE_APPS_SCRIPT_URL = "REPLACE_ME_INTAKE_APPS_SCRIPT_URL";

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
// Layout: rows 1 + 2 are 2-up; row 3 (payroll) spans full width via fullWidth flag.
const PORTAL_SECTIONS = [
  {
    id: "rules",
    title: "Conduct, Rules & Policies",
    icon: "book",
    description: "Read A3's coaches personal conduct policy, rules, and the consequences for 1st, 2nd, and 3rd offenses.",
    href: "/rules",
    status: "active",
  },
  {
    id: "signature",
    title: "Conduct Policy Signature",
    icon: "pen",
    description: "Sign and acknowledge the A3 Coaches Personal Conduct Policy on the record. Reviewed quarterly.",
    href: "/sign",
    status: "active",
  },
  {
    id: "background",
    title: "Background Checks",
    icon: "magnifier",
    description: "Take your annual FDLE background check and upload the result page (Passed/Failed + Name + Date).",
    href: "/background",
    status: "active",
  },
  {
    id: "certifications",
    title: "Certifications",
    icon: "cap",
    description: "Annual concussion and heat illness certifications — upload your completion screenshot or certificate.",
    href: "/certifications",
    status: "active",
  },
  {
    id: "payroll",
    title: "Payroll & Onboarding",
    icon: "dollar",
    description: "Independent contractor status, W-9, pay schedule, Zelle setup, reimbursements, travel, and the full missed-days + fines mechanics.",
    href: "/payroll",
    status: "active",
    fullWidth: true,
  },
  {
    id: "intake",
    title: "Coach Pre-Employment Intake",
    icon: "clipboard",
    description: "One-time risk and compliance intake — identity, background check authorization, driving record, prior issues, references, safeguarding acknowledgements, and final certification.",
    href: "/intake",
    status: "active",
    fullWidth: true,
  },
];

// ── Icons (inline SVG, currentColor stroke) ──
const ICONS = {
  book: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  pen: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  magnifier: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  cap: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6" />
      <path d="M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  dollar: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  clipboard: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1z" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="9" y1="15" x2="13" y2="15" />
    </svg>
  ),
};

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
    id: "player-meetings",
    title: "Player Meetings",
    summary: "Never meet a player alone. Always have a second coach present. Mandatory reporting if you see misconduct.",
    policy:
      "A coach should never meet with a player alone in an office or closed-off portion of the facility. With no witnesses, players often misinterpret, misunderstand, misremember, or accuse coaches of saying things they never said. Always have a second coach in any meeting with you, especially if that meeting has to do with something negative happening to the player. Positive meetings can also be great in the moment, but if the player ends up struggling they will say 'You promised me I would always be a starter on this team at our last meeting.' You always need a second coach for safety and witnesses. NO private 1-on-1 meetings. NO closed-door training. NO physical discipline or inappropriate contact. ALL COACHES HAVE A MANDATORY REPORTING OBLIGATION IF THEY SEE MISCONDUCT. YOU CANNOT HAVE ANOTHER COACH'S BACK — lack of reporting makes you complicit.",
    consequences: [
      { offense: "1st", action: "Immediate documented warning. Removal from active coaching duties pending review. If misconduct is suspected, leadership escalates immediately." },
      { offense: "2nd", action: "Suspension or dismissal depending on the nature of the violation. Failure to report a witnessed incident is grounds for dismissal regardless of count." },
      { offense: "3rd", action: "Dismissal from staff." },
    ],
  },
  {
    id: "social-media",
    title: "Social Media Behavior & Presence",
    summary: "Assume parents are always watching. Posts represent A3 — illegal activity, inflammatory content, or extreme political content jeopardize your standing.",
    policy:
      "Posts on social media are at your own risk and are always assumed to represent the coaching staff at A3 Academy. Pictures of illegal activities, inflammatory posts, extremely political or extreme content, and interactions with players and the baseball community are always reviewed. You must assume parents are always watching your posts and making decisions about whether they want their child to be around you.",
    consequences: [
      { offense: "1st", action: "Documented conversation. Post deletion required if specifically called out." },
      { offense: "2nd", action: "Written warning + leadership meeting." },
      { offense: "3rd", action: "Suspension or dismissal. Severity depends on content — illegal activity or content involving minors accelerates penalties." },
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
      <div style={{
        ...styles.heroSection,
        minHeight: 320,
        backgroundImage: "linear-gradient(180deg, rgba(5,10,20,0.45) 0%, rgba(13,37,82,0.88) 100%), url(/pics/coaches.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
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
                ...(s.fullWidth ? { gridColumn: "1 / -1" } : {}),
              }}
              onClick={() => isActive && navigate(s.href)}
              role={isActive ? "button" : undefined}
              tabIndex={isActive ? 0 : undefined}
            >
              {s.icon && (
                <div style={styles.portalCardIcon}>{ICONS[s.icon]}</div>
              )}
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

// ── Upload type configs ──
// step1 + requirementsCallout are thunks (functions returning JSX) so the
// `styles` reference inside them is evaluated lazily at render time, not
// during module load (avoids TDZ since styles is defined further down).
const UPLOAD_TYPES = {
  "background-check": {
    title: "Background Check",
    eyebrow: "STAFF RESOURCES",
    leadCopy: "Required annually per A3 policy and the municipalities A3 works with.",
    category: "Background Check",
    provider: {
      url: BACKGROUND_CHECK_PROVIDER_URL,
      label: "Open FDLE Background Check →",
      step1: () => (
        <>
          <p style={styles.payrollText}>
            A3 uses the Florida Department of Law Enforcement (FDLE) for annual background checks. On the FDLE site, please select <strong>Instant Search</strong>. The cost is usually around <strong>$24</strong>.
          </p>
          <p style={styles.payrollText}>
            When you reach the result page, <strong>do not close it</strong> — you'll need to capture it for upload in Step 3.
          </p>
        </>
      ),
    },
    requirements: ["RESULT — Passed or Failed", "NAME — your full legal name", "DATE — the date the result was issued"],
    requirementsCallout: () => (
      <><strong>A receipt of payment is not enough.</strong> A3 needs to see the actual result with your name and the date clearly visible — not just proof that you paid for the check.</>
    ),
    uploadLabel: "Background Check Result (image or PDF)",
    submitLabel: "Upload Background Check",
    successLabel: "Background Check Uploaded",
  },
  concussion: {
    title: "Concussion Certification",
    eyebrow: "STAFF RESOURCES · CERTIFICATION",
    leadCopy: "Annual NFHS Concussion in Sports certification. Free online course, takes about 30 minutes.",
    category: "Concussion Certification",
    provider: {
      url: "https://nfhslearn.com/courses/concussion-in-sports-2",
      label: "Open NFHS Concussion Course →",
      step1: () => (
        <>
          <p style={styles.payrollText}>
            Take the <strong>"Concussion in Sports"</strong> course on the NFHS Learning Center. The course is free, takes about 30 minutes, and ends with a certificate of completion.
          </p>
          <p style={styles.payrollText}>
            When the certificate appears, <strong>save it as a PDF</strong> or take a screenshot. You'll upload it in Step 3.
          </p>
        </>
      ),
    },
    requirements: ["NAME — your full legal name", "DATE — the completion date", "Course title — Concussion in Sports"],
    requirementsCallout: () => (
      <>The certificate page from NFHS includes all three. <strong>A receipt of registration is not enough</strong> — we need the actual certificate showing you completed the course.</>
    ),
    uploadLabel: "Concussion Certificate (image or PDF)",
    submitLabel: "Upload Concussion Certification",
    successLabel: "Concussion Certification Uploaded",
  },
  heat: {
    title: "Heat Illness Certification",
    eyebrow: "STAFF RESOURCES · CERTIFICATION",
    leadCopy: "Annual NFHS Heat Illness Prevention certification. Free online course, takes about 30 minutes.",
    category: "Heat Illness Certification",
    provider: {
      url: "https://nfhslearn.com/courses/heat-illness-prevention-2",
      label: "Open NFHS Heat Illness Course →",
      step1: () => (
        <>
          <p style={styles.payrollText}>
            Take the <strong>"Heat Illness Prevention"</strong> course on the NFHS Learning Center. The course is free, takes about 30 minutes, and ends with a certificate of completion.
          </p>
          <p style={styles.payrollText}>
            When the certificate appears, <strong>save it as a PDF</strong> or take a screenshot. You'll upload it in Step 3.
          </p>
        </>
      ),
    },
    requirements: ["NAME — your full legal name", "DATE — the completion date", "Course title — Heat Illness Prevention"],
    requirementsCallout: () => (
      <>The certificate page from NFHS includes all three. <strong>A receipt of registration is not enough</strong> — we need the actual certificate showing you completed the course.</>
    ),
    uploadLabel: "Heat Illness Certificate (image or PDF)",
    submitLabel: "Upload Heat Illness Certification",
    successLabel: "Heat Illness Certification Uploaded",
  },
  "cpr-first-aid": {
    title: "CPR & First Aid Certification",
    eyebrow: "STAFF RESOURCES · CERTIFICATION",
    leadCopy: "Annual CPR and First Aid certification. Free online course with downloadable certificate.",
    category: "CPR / First Aid Certification",
    provider: {
      url: "https://www.firstaidforfree.com/",
      label: "Open First Aid for Free →",
      step1: () => (
        <>
          <p style={styles.payrollText}>
            Take a CPR and First Aid course on <strong>First Aid for Free</strong>. The site offers multiple free courses (Basic CPR, Pediatric First Aid, AED, etc.) — pick the one most appropriate for working with youth athletes.
          </p>
          <p style={styles.payrollText}>
            When the certificate appears, <strong>save it as a PDF</strong> or take a screenshot. You'll upload it in Step 3.
          </p>
        </>
      ),
    },
    requirements: ["NAME — your full legal name", "DATE — the completion date", "Course title — the specific CPR/First Aid course taken"],
    requirementsCallout: () => (
      <>The certificate page from First Aid for Free includes all three. <strong>A receipt of registration is not enough</strong> — we need the actual certificate showing you completed the course.</>
    ),
    uploadLabel: "CPR / First Aid Certificate (image or PDF)",
    submitLabel: "Upload CPR & First Aid Certification",
    successLabel: "CPR & First Aid Certification Uploaded",
  },
};

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

// ── Page: Generic Upload (used for background check + certs) ──
function UploadPage({ typeId, backHref, backLabel }) {
  const t = UPLOAD_TYPES[typeId];
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
        category: t.category,
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
        <button style={styles.backLink} onClick={() => navigate(backHref || "/")}>← {backLabel || "Coaches Portal"}</button>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✓</div>
          <div style={styles.successTitle}>{t.successLabel}</div>
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
      <button style={styles.backLink} onClick={() => navigate(backHref || "/")}>← {backLabel || "Coaches Portal"}</button>

      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroEyebrow}>{t.eyebrow}</div>
          <div style={styles.heroTagline}>{t.title}</div>
          <div style={styles.heroLead}>{t.leadCopy}</div>
        </div>
      </div>

      <div style={styles.sectionLabel}>Step 1 · Complete the Course</div>
      <div style={styles.payrollCard}>
        {t.provider.step1()}
        <a
          href={t.provider.url}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.providerBtn}
        >
          {t.provider.label}
        </a>
      </div>

      <div style={styles.sectionLabel}>Step 2 · Capture the Result</div>
      <div style={{ ...styles.payrollCard, borderLeft: `3px solid ${colors.danger}` }}>
        <div style={styles.criticalLabel}>Important · What we need to see</div>
        <p style={styles.payrollText}>
          Take a screenshot or save a PDF of the result page. It must clearly show all of:
        </p>
        <ul style={styles.bulletList}>
          {t.requirements.map((r, i) => <li key={i}><strong>{r.split(" — ")[0]}</strong> — {r.split(" — ")[1]}</li>)}
        </ul>
        <div style={styles.dangerCallout}>{t.requirementsCallout()}</div>
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
          <div style={{ ...styles.fileSelected, color: colors.textMuted, fontStyle: "italic", marginTop: 6 }}>
            The system will fuzzy-match your name to existing folders to prevent typos creating duplicate folders.
          </div>
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>{t.uploadLabel} <span style={styles.req}>*</span></label>
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
          {uploading ? "Uploading..." : t.submitLabel}
        </button>
      </div>
    </>
  );
}

// ── Page: Certifications Index ──
const CERTIFICATIONS = [
  {
    id: "concussion",
    title: "Concussion Certification",
    description: "NFHS Concussion in Sports — free online course, ~30 minutes. Required annually.",
    href: "/certifications/concussion",
  },
  {
    id: "heat",
    title: "Heat Illness Certification",
    description: "NFHS Heat Illness Prevention — free online course, ~30 minutes. Required annually.",
    href: "/certifications/heat",
  },
  {
    id: "cpr-first-aid",
    title: "CPR & First Aid Certification",
    description: "First Aid for Free — free online CPR + First Aid course with a downloadable certificate. Required annually.",
    href: "/certifications/cpr-first-aid",
  },
];

function CertificationsIndex() {
  return (
    <>
      <button style={styles.backLink} onClick={() => navigate("/")}>← Coaches Portal</button>

      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroEyebrow}>STAFF RESOURCES</div>
          <div style={styles.heroTagline}>Certifications</div>
          <div style={styles.heroLead}>
            Annual certifications required for A3 coaches. Take each course, then upload your certificate here.
          </div>
        </div>
      </div>

      <div style={styles.sectionLabel}>Available Certifications</div>
      <div style={styles.portalGrid}>
        {CERTIFICATIONS.map((c) => (
          <div
            key={c.id}
            style={{ ...styles.portalCard, ...styles.portalCardActive }}
            onClick={() => navigate(c.href)}
            role="button"
            tabIndex={0}
          >
            <div style={styles.portalCardHeader}>
              <div style={styles.portalCardTitle}>{c.title}</div>
              <span style={styles.portalBadgeActive}>OPEN</span>
            </div>
            <div style={styles.portalCardDescription}>{c.description}</div>
            <div style={styles.portalCardCTA}>Open →</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Page: Pre-Employment Intake ──
const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

const DISCLOSURE_QUESTIONS = [
  { id: "arrested", label: "Have you ever been arrested?" },
  { id: "chargedCrime", label: "Have you ever been charged with a crime?" },
  { id: "convictedCrime", label: "Have you ever been convicted of a crime?" },
  { id: "minorMisconduct", label: "Have you ever been accused of misconduct involving a minor?" },
  { id: "firedCoachingJob", label: "Have you ever been fired from a coaching job?" },
  { id: "askedToResign", label: "Have you ever been asked to resign?" },
  { id: "suspendedFromTeam", label: "Have you ever been suspended from a team or organization?" },
  { id: "underInvestigation", label: "Are you currently under investigation for anything?" },
];

const BP_RATINGS = [
  { value: "1", label: "1 — Poor / can't throw" },
  { value: "2", label: "2 — Below average" },
  { value: "3", label: "3 — Average" },
  { value: "4", label: "4 — Above average" },
  { value: "5", label: "5 — Elite — I throw a ton of strikes, my arm feels great, and I can throw for a long time" },
];

const FUNGO_RATINGS = [
  { value: "1", label: "1 — Poor / I can't hit fungos" },
  { value: "2", label: "2 — Below average" },
  { value: "3", label: "3 — Average" },
  { value: "4", label: "4 — Above average" },
  { value: "5", label: "5 — Elite — I can hit infield and outfield fungos with high accuracy" },
];

const COACHING_AREAS = ["Hitting", "Infield", "Outfield", "Pitching", "Catching", "Game Management"];

function IntakePage() {
  const [form, setForm] = useState({
    fullLegalName: "", dob: "",
    dlNumber: "", dlState: "", dlFront: null, dlBack: null,
    currentAddress: "",
    drivingIssues: "", drivingExplanation: "",
    priorIssues: {}, priorIssuesExplanation: "",
    socialHandles: "", socialMediaConsent: false,
    sg_no1on1: false, sg_noClosedDoor: false, sg_noDiscipline: false, sg_mandatoryReporting: false,
    da_noDrugsAlcohol: false, da_noImpairment: false, da_subjectToRemoval: false,
    bpRating: "", fungoRating: "",
    strength1: "", strength2: "", strength3: "", weakest: "",
    medicalConditions: "",
    finalCertify: false, signature: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const setIssue = (id, val) =>
    setForm((f) => ({ ...f, priorIssues: { ...f.priorIssues, [id]: val } }));

  const dateLabel = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const allSafeguarding = form.sg_no1on1 && form.sg_noClosedDoor && form.sg_noDiscipline && form.sg_mandatoryReporting;
  const allDrugAlcohol = form.da_noDrugsAlcohol && form.da_noImpairment && form.da_subjectToRemoval;
  const allDisclosuresAnswered = DISCLOSURE_QUESTIONS.every((q) => form.priorIssues[q.id] === "yes" || form.priorIssues[q.id] === "no");
  const anyDisclosureYes = DISCLOSURE_QUESTIONS.some((q) => form.priorIssues[q.id] === "yes");
  const drivingExplained = form.drivingIssues === "no" || (form.drivingIssues === "yes" && form.drivingExplanation.trim().length > 1);
  const issuesExplained = !anyDisclosureYes || form.priorIssuesExplanation.trim().length > 1;

  const isValid =
    form.fullLegalName.trim().length > 1 &&
    form.dob &&
    form.dlNumber.trim().length > 0 &&
    form.dlState &&
    form.dlFront &&
    form.dlBack &&
    form.currentAddress.trim().length > 5 &&
    form.drivingIssues &&
    drivingExplained &&
    allDisclosuresAnswered &&
    issuesExplained &&
    form.socialMediaConsent &&
    allSafeguarding &&
    allDrugAlcohol &&
    form.bpRating && form.fungoRating &&
    form.strength1 && form.strength2 && form.strength3 && form.weakest &&
    form.finalCertify &&
    form.signature.trim().length > 1;

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const coachName = form.fullLegalName.trim();
      // Upload license front + back to file-upload script
      const dlFrontData = await fileToBase64(form.dlFront);
      await fetch(FILE_UPLOADS_APPS_SCRIPT_URL, {
        method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "Driver License - Front",
          coachName, fileName: form.dlFront.name,
          mimeType: form.dlFront.type || "application/octet-stream",
          fileData: dlFrontData,
        }),
      });
      const dlBackData = await fileToBase64(form.dlBack);
      await fetch(FILE_UPLOADS_APPS_SCRIPT_URL, {
        method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "Driver License - Back",
          coachName, fileName: form.dlBack.name,
          mimeType: form.dlBack.type || "application/octet-stream",
          fileData: dlBackData,
        }),
      });

      // Flatten and submit text data to intake script
      const payload = {
        timestamp: new Date().toLocaleString(),
        signatureDate: dateLabel,
        fullLegalName: coachName,
        dob: form.dob,
        driverLicenseNumber: form.dlNumber,
        driverLicenseState: form.dlState,
        currentAddress: form.currentAddress,
        drivingIssues: form.drivingIssues,
        drivingExplanation: form.drivingExplanation || "",
        ...Object.fromEntries(
          DISCLOSURE_QUESTIONS.map((q) => [`disclosure_${q.id}`, form.priorIssues[q.id] || ""])
        ),
        priorIssuesExplanation: form.priorIssuesExplanation || "",
        socialHandles: form.socialHandles,
        socialMediaConsent: form.socialMediaConsent ? "Yes" : "No",
        safeguarding_no1on1: form.sg_no1on1 ? "Yes" : "No",
        safeguarding_noClosedDoor: form.sg_noClosedDoor ? "Yes" : "No",
        safeguarding_noDiscipline: form.sg_noDiscipline ? "Yes" : "No",
        safeguarding_mandatoryReporting: form.sg_mandatoryReporting ? "Yes" : "No",
        drugAlcohol_noUseBeforeOrDuring: form.da_noDrugsAlcohol ? "Yes" : "No",
        drugAlcohol_noImpairment: form.da_noImpairment ? "Yes" : "No",
        drugAlcohol_subjectToRemoval: form.da_subjectToRemoval ? "Yes" : "No",
        bp_rating: form.bpRating,
        fungo_rating: form.fungoRating,
        coaching_strength_1: form.strength1,
        coaching_strength_2: form.strength2,
        coaching_strength_3: form.strength3,
        coaching_weakest: form.weakest,
        medicalConditions: form.medicalConditions || "",
        finalCertify: form.finalCertify ? "Yes" : "No",
        signature: form.signature.trim(),
      };
      await fetch(INTAKE_APPS_SCRIPT_URL, {
        method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Intake submit error:", err);
      setSubmitError("Submission failed. Please try again or contact A3.");
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
          <div style={styles.successTitle}>Intake Submitted</div>
          {submitError && <p style={{ color: colors.warning, fontSize: 13, marginBottom: 12 }}>{submitError}</p>}
          <p style={styles.successText}>
            Thanks, {form.fullLegalName.split(" ")[0]}. A3 leadership will review your intake and follow up. Your driver's license images are stored in your {new Date().getFullYear()} folder.
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
          <div style={styles.heroEyebrow}>ONE-TIME · NEW HIRE</div>
          <div style={styles.heroTagline}>Coach Pre-Employment Intake</div>
          <div style={styles.heroLead}>
            Risk and compliance intake required before working with A3 athletes. All fields marked <span style={styles.req}>*</span> are required.
          </div>
        </div>
      </div>

      <div style={{ ...styles.dangerCallout, marginBottom: 24 }}>
        <strong>Sensitive information:</strong> This form collects identity, driver's license, and disclosure information. Submissions are reviewed by A3 leadership only.
      </div>

      {/* 1. Identity */}
      <div style={styles.sectionLabel}>1 · Identity Verification</div>
      <div style={styles.formCard}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Full Legal Name <span style={styles.req}>*</span></label>
          <input style={styles.input} type="text" value={form.fullLegalName} onChange={(e) => set("fullLegalName")(e.target.value)} placeholder="As shown on your ID" required />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Date of Birth <span style={styles.req}>*</span></label>
          <input style={styles.input} type="date" value={form.dob} onChange={(e) => set("dob")(e.target.value)} required />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Driver's License Number <span style={styles.req}>*</span></label>
          <input style={styles.input} type="text" value={form.dlNumber} onChange={(e) => set("dlNumber")(e.target.value)} required />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Issuing State <span style={styles.req}>*</span></label>
          <select style={styles.input} value={form.dlState} onChange={(e) => set("dlState")(e.target.value)} required>
            <option value="">Select...</option>
            {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Driver's License — Front <span style={styles.req}>*</span></label>
          <input style={styles.fileInput} type="file" accept="image/*,application/pdf" onChange={(e) => set("dlFront")(e.target.files[0] || null)} required />
          {form.dlFront && <div style={styles.fileSelected}>Selected: {form.dlFront.name}</div>}
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Driver's License — Back <span style={styles.req}>*</span></label>
          <input style={styles.fileInput} type="file" accept="image/*,application/pdf" onChange={(e) => set("dlBack")(e.target.files[0] || null)} required />
          {form.dlBack && <div style={styles.fileSelected}>Selected: {form.dlBack.name}</div>}
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Current Address <span style={styles.req}>*</span></label>
          <textarea style={{ ...styles.input, fontFamily: font, minHeight: 70 }} value={form.currentAddress} onChange={(e) => set("currentAddress")(e.target.value)} placeholder="Street, City, State, ZIP" required />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Do you have any DUIs, reckless driving charges, or multiple speeding tickets that would prevent you from safely transporting players in A3 vans? <span style={styles.req}>*</span></label>
          <div style={styles.radioRow}>
            {["no", "yes"].map((v) => (
              <button
                key={v} type="button"
                onClick={() => set("drivingIssues")(v)}
                style={{ ...styles.radioBtn, ...(form.drivingIssues === v ? styles.radioBtnActive : {}) }}
              >
                {v === "no" ? "No" : "Yes"}
              </button>
            ))}
          </div>
          {form.drivingIssues === "yes" && (
            <div style={{ marginTop: 12 }}>
              <label style={styles.label}>Please explain <span style={styles.req}>*</span></label>
              <textarea style={{ ...styles.input, fontFamily: font, minHeight: 80 }} value={form.drivingExplanation} onChange={(e) => set("drivingExplanation")(e.target.value)} required />
            </div>
          )}
        </div>
      </div>

      {/* 2. Prior Issues */}
      <div style={styles.sectionLabel}>2 · Prior Issues / Disclosure</div>
      <div style={styles.formCard}>
        <p style={styles.payrollText}>
          Honesty up front protects you and protects A3. Any "Yes" requires explanation below.
        </p>
        {DISCLOSURE_QUESTIONS.map((q) => (
          <div key={q.id} style={styles.fieldGroup}>
            <label style={styles.label}>{q.label} <span style={styles.req}>*</span></label>
            <div style={styles.radioRow}>
              {["no", "yes"].map((v) => (
                <button
                  key={v} type="button"
                  onClick={() => setIssue(q.id, v)}
                  style={{ ...styles.radioBtn, ...(form.priorIssues[q.id] === v ? styles.radioBtnActive : {}) }}
                >
                  {v === "no" ? "No" : "Yes"}
                </button>
              ))}
            </div>
          </div>
        ))}
        {anyDisclosureYes && (
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Explanation for any "Yes" answers above <span style={styles.req}>*</span></label>
            <textarea style={{ ...styles.input, fontFamily: font, minHeight: 100 }} value={form.priorIssuesExplanation} onChange={(e) => set("priorIssuesExplanation")(e.target.value)} required />
          </div>
        )}
      </div>

      {/* 3. Social Media */}
      <div style={styles.sectionLabel}>3 · Social Media Review Disclosure</div>
      <div style={styles.formCard}>
        <p style={styles.payrollText}>
          A3 manually reviews coach social media for behavior, language, political/extreme content, and how you interact with kids and players. List every active handle.
        </p>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Social Media Handles</label>
          <textarea
            style={{ ...styles.input, fontFamily: font, minHeight: 90 }}
            value={form.socialHandles}
            onChange={(e) => set("socialHandles")(e.target.value)}
            placeholder={"Instagram: @yourhandle\nX/Twitter: @yourhandle\nTikTok: @yourhandle\nFacebook: full name + URL\nLinkedIn: URL"}
          />
        </div>
        <div style={styles.checkRow} onClick={() => set("socialMediaConsent")(!form.socialMediaConsent)}>
          <div style={{ ...styles.checkbox, ...(form.socialMediaConsent ? styles.checkboxChecked : {}) }}>
            {form.socialMediaConsent && <span style={{ color: "#fff", fontSize: 14, lineHeight: 1 }}>✓</span>}
          </div>
          <span style={styles.checkLabel}>I understand A3 Academy will review my public social media presence as part of this intake and on an ongoing basis.</span>
        </div>
      </div>

      {/* 4. Safeguarding */}
      <div style={styles.sectionLabel}>4 · Safeguarding / Minor Protection</div>
      <div style={styles.formCard}>
        {[
          { key: "sg_no1on1", label: "I will not engage in private 1-on-1 texting with players without a parent included." },
          { key: "sg_noClosedDoor", label: "I will not conduct closed-door or privately isolated training with a player." },
          { key: "sg_noDiscipline", label: "I will not use physical discipline or any inappropriate contact with players." },
          { key: "sg_mandatoryReporting", label: "I have a mandatory reporting obligation if I see misconduct, and I will report it to A3 leadership immediately." },
        ].map(({ key, label }) => (
          <div key={key} style={styles.checkRow} onClick={() => set(key)(!form[key])}>
            <div style={{ ...styles.checkbox, ...(form[key] ? styles.checkboxChecked : {}) }}>
              {form[key] && <span style={{ color: "#fff", fontSize: 14, lineHeight: 1 }}>✓</span>}
            </div>
            <span style={styles.checkLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* 5. Drug / Alcohol */}
      <div style={styles.sectionLabel}>5 · Drug & Alcohol Policy</div>
      <div style={styles.formCard}>
        {[
          { key: "da_noDrugsAlcohol", label: "I will not use drugs or alcohol before or during coaching." },
          { key: "da_noImpairment", label: "I will never be impaired while transporting players." },
          { key: "da_subjectToRemoval", label: "I understand I am subject to removal from staff for violations of this policy." },
        ].map(({ key, label }) => (
          <div key={key} style={styles.checkRow} onClick={() => set(key)(!form[key])}>
            <div style={{ ...styles.checkbox, ...(form[key] ? styles.checkboxChecked : {}) }}>
              {form[key] && <span style={{ color: "#fff", fontSize: 14, lineHeight: 1 }}>✓</span>}
            </div>
            <span style={styles.checkLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* 6. Baseball Ability */}
      <div style={styles.sectionLabel}>6 · Baseball Ability</div>
      <div style={styles.formCard}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Rate your BP (batting practice) ability <span style={styles.req}>*</span></label>
          <select style={styles.input} value={form.bpRating} onChange={(e) => set("bpRating")(e.target.value)} required>
            <option value="">Select...</option>
            {BP_RATINGS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Rate your fungo ability <span style={styles.req}>*</span></label>
          <select style={styles.input} value={form.fungoRating} onChange={(e) => set("fungoRating")(e.target.value)} required>
            <option value="">Select...</option>
            {FUNGO_RATINGS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Your strongest area as a coach <span style={styles.req}>*</span></label>
          <select style={styles.input} value={form.strength1} onChange={(e) => set("strength1")(e.target.value)} required>
            <option value="">Select...</option>
            {COACHING_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Your 2nd strongest area <span style={styles.req}>*</span></label>
          <select style={styles.input} value={form.strength2} onChange={(e) => set("strength2")(e.target.value)} required>
            <option value="">Select...</option>
            {COACHING_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Your 3rd strongest area <span style={styles.req}>*</span></label>
          <select style={styles.input} value={form.strength3} onChange={(e) => set("strength3")(e.target.value)} required>
            <option value="">Select...</option>
            {COACHING_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Your weakest area on this list <span style={styles.req}>*</span></label>
          <select style={styles.input} value={form.weakest} onChange={(e) => set("weakest")(e.target.value)} required>
            <option value="">Select...</option>
            {COACHING_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* 7. Medical */}
      <div style={styles.sectionLabel}>7 · Medical / Physical Readiness</div>
      <div style={styles.formCard}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Any conditions that limit standing long hours, throwing BP, or sustained physical activity?</label>
          <textarea style={{ ...styles.input, fontFamily: font, minHeight: 80 }} value={form.medicalConditions} onChange={(e) => set("medicalConditions")(e.target.value)} placeholder="Optional. Leave blank if none." />
        </div>
      </div>

      {/* 8. Final Certification */}
      <div style={styles.sectionLabel}>8 · Final Certification</div>
      <div style={styles.formCard}>
        <div style={styles.checkRow} onClick={() => set("finalCertify")(!form.finalCertify)}>
          <div style={{ ...styles.checkbox, ...(form.finalCertify ? styles.checkboxChecked : {}) }}>
            {form.finalCertify && <span style={{ color: "#fff", fontSize: 14, lineHeight: 1 }}>✓</span>}
          </div>
          <span style={styles.checkLabel}>I certify all information provided is true. I understand any false or omitted information may result in termination.</span>
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Typed Signature (Full Legal Name) <span style={styles.req}>*</span></label>
          <input
            style={{ ...styles.input, fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive", fontSize: 24, fontStyle: "italic", padding: "12px 14px" }}
            type="text"
            value={form.signature}
            onChange={(e) => set("signature")(e.target.value)}
            placeholder="Type your full legal name"
            required
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Date</label>
          <div style={styles.staticField}>{dateLabel}</div>
        </div>
        {submitError && <div style={{ color: colors.danger, fontSize: 13, marginBottom: 12 }}>{submitError}</div>}
        <button
          style={{ ...styles.primaryBtn, ...(isValid && !submitting ? {} : styles.btnDisabled) }}
          disabled={!isValid || submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Submitting..." : "Submit Intake"}
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
  } else if (path === "/intake" || path.startsWith("/intake/")) {
    page = <IntakePage />;
  } else if (path === "/background" || path.startsWith("/background/")) {
    page = <UploadPage typeId="background-check" />;
  } else if (path === "/certifications/concussion") {
    page = <UploadPage typeId="concussion" backHref="/certifications" backLabel="Certifications" />;
  } else if (path === "/certifications/heat") {
    page = <UploadPage typeId="heat" backHref="/certifications" backLabel="Certifications" />;
  } else if (path === "/certifications/cpr-first-aid") {
    page = <UploadPage typeId="cpr-first-aid" backHref="/certifications" backLabel="Certifications" />;
  } else if (path === "/certifications" || path.startsWith("/certifications/")) {
    page = <CertificationsIndex />;
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
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
  portalCardIcon: {
    color: colors.accent,
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
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
