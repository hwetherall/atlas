"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./AtlasProcessDeck.module.css";

const SLIDE_COUNT = 13;

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type SlideProps = {
  number: number;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

function Slide({ number, eyebrow, title, children, className }: SlideProps) {
  return (
    <article
      className={cx(styles.slide, className)}
      data-slide={number}
      aria-label={"Slide " + number + ": " + title}
    >
      <div className={styles.brand}>ATLAS</div>
      <div className={styles.eyebrow}>{eyebrow}</div>
      <h2 className={styles.slideTitle}>{title}</h2>
      <div className={styles.titleRule} />
      <div className={styles.slideBody}>{children}</div>
      <div className={styles.footer}>MARKET RESEARCH · CLAIM BY CLAIM</div>
      <div className={styles.pageNumber}>{String(number).padStart(2, "0")}</div>
    </article>
  );
}

const firstPassCells = [
  ["WHERE", "Germany market", "Working estimate", "DE", "Research active", "active"],
  ["WHERE", "Netherlands market", "Working estimate", "NL", "Research active", "active"],
  ["FOR WHAT", "Hyperscale share", "Working estimate", "HS", "Definition open", "error"],
  ["FOR WHOM", "Large customers", "Working estimate", "LC", "Evidence open", "error"],
  ["REACH", "Serviceable share", "Assumption", "SA", "User-set", "assumption"],
  ["YEAR 1", "Obtainable share", "Assumption", "Y1", "User-set", "assumption"],
] as const;

const factRecords = [
  {
    id: "germany",
    nodeId: "geo.DE",
    axis: "Geography",
    claim: "Germany market",
    value: "€336M*",
    range: "€300–€370M*",
    unit: "EUR_M",
    confidence: "Inferred",
    state: "Active",
    stateTone: "active",
    asOf: "2026",
    definition:
      "Manufacturer revenue from rack-mounted PDUs installed in German data-centre facilities. Installation location determines the demand geography; manufacturing origin and owner headquarters remain separate metadata.",
    evidence: [
      "Regional market benchmark",
      "Installed-capacity triangulation",
      "Operator-footprint cross-check",
    ],
    error:
      "Public sources often report supplier location, invoice location or owner headquarters—not the final installation location required by this definition.",
    next:
      "Can facility-level shipments or project data verify where cross-border sales were ultimately installed?",
    revision: "Pass 03 · installation-based attribution locked; cross-border allocation remains a risk.",
  },
  {
    id: "netherlands",
    nodeId: "geo.NL",
    axis: "Geography",
    claim: "Netherlands market",
    value: "€156M*",
    range: "€135–€180M*",
    unit: "EUR_M",
    confidence: "Inferred",
    state: "Stable",
    stateTone: "stable",
    asOf: "2026",
    definition:
      "Manufacturer revenue from rack-mounted PDUs sold into Dutch data-centre facilities, excluding revenue merely booked through a Dutch entity.",
    evidence: [
      "Regional market benchmark",
      "Data-centre capacity share",
      "Local operator footprint",
    ],
    error:
      "Booking location can overstate the market if cross-border sales are counted as Dutch demand.",
    next:
      "Do facility-level shipment estimates confirm that booked revenue reflects Dutch installations?",
    revision: "Pass 02 · geographic definition locked; independent estimates converge.",
  },
  {
    id: "hyperscale",
    nodeId: "seg.hyperscale",
    axis: "Application",
    claim: "Hyperscale share",
    value: "34%*",
    range: "29–39%*",
    unit: "ratio",
    confidence: "Inferred",
    state: "Active",
    stateTone: "active",
    asOf: "2026",
    definition:
      "Share of scoped rack-PDU demand serving hyperscale facilities; the segment describes the application, not the buyer type.",
    evidence: [
      "Capacity mix by facility type",
      "Deployment-intensity benchmark",
      "Supplier segment commentary",
    ],
    error:
      "Some sources classify large colocation campuses as hyperscale, which can double-count demand.",
    next:
      "Which facility-level definition keeps hyperscale and colocation mutually exclusive?",
    revision: "Pass 03 · taxonomy conflict identified; segment definition remains open.",
  },
  {
    id: "large-customers",
    nodeId: "cust.operator-large",
    axis: "Buyer type",
    claim: "Large customers",
    value: "40%*",
    range: "33–47%*",
    unit: "ratio",
    confidence: "Unknown",
    state: "Risk",
    stateTone: "risk",
    asOf: "2026",
    definition:
      "Share purchased directly by large operators; integrators and distributors remain separate buyer types even when they serve the same facility.",
    evidence: [
      "Channel-mix benchmark",
      "Public account references",
      "Supplier route-to-market commentary",
    ],
    error:
      "Public evidence does not reveal the direct-versus-channel split with enough precision.",
    next:
      "Has web research reached its ceiling—and should this be routed to supplier or buyer interviews?",
    revision: "Pass 04 · public sources exhausted; residual uncertainty flagged for routing.",
  },
] as const;

const loopSteps = [
  ["01", "State the claim", "Put a number, scope and confidence in the cell."],
  ["02", "Observe it", "Inspect sources, definitions and contradictions."],
  ["03", "Find the error", "Ask what could make this number materially wrong."],
  ["04", "Research the error", "Target the weakest assumption—not the whole report."],
  ["05", "Update the claim", "Revise the value, range, source and confidence."],
] as const;

const difficulty = [
  {
    level: "CLEAR",
    example: "EV sales · New Zealand",
    description: "A clear boundary and observable sales make the answer converge quickly.",
    loops: "Few loops",
    tone: "green",
  },
  {
    level: "MIXED",
    example: "Rack PDU · Central Europe",
    description:
      "The region, manufacturers and buyer mix all need explicit definitions and cross-checks.",
    loops: "Several loops",
    tone: "blue",
  },
  {
    level: "SPARSE",
    example: "Cryptocurrency markets · developing world",
    description:
      "The scope is contested: Congo is clearly included; China may not be. ‘Crypto market’ has multiple meanings, while reliable Zambian data is exceptionally scarce.",
    loops: "Many loops",
    tone: "amber",
  },
] as const;

export default function AtlasProcessDeck() {
  const [current, setCurrent] = useState(0);
  const [overview, setOverview] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const rootRef = useRef<HTMLElement>(null);

  const goTo = useCallback((index: number, exitOverview = true) => {
    const next = Math.max(0, Math.min(SLIDE_COUNT - 1, index));
    setCurrent(next);
    if (exitOverview) setOverview(false);
    window.history.replaceState(null, "", "#slide-" + (next + 1));
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const previous = useCallback(() => goTo(current - 1), [current, goTo]);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await rootRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const fromHash = Number(window.location.hash.replace("#slide-", ""));
    if (Number.isFinite(fromHash) && fromHash >= 1 && fromHash <= SLIDE_COUNT) {
      setCurrent(fromHash - 1);
    } else {
      window.history.replaceState(null, "", "#slide-1");
    }

    const onHashChange = () => {
      const value = Number(window.location.hash.replace("#slide-", ""));
      if (Number.isFinite(value) && value >= 1 && value <= SLIDE_COUNT) {
        setCurrent(value - 1);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.matches(
          "button, a, input, textarea, select, summary, [popover], [contenteditable='true']",
        )
      ) return;

      if (["ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        next();
      } else if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
        event.preventDefault();
        previous();
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(SLIDE_COUNT - 1);
      } else if (event.key.toLowerCase() === "o") {
        event.preventDefault();
        setOverview((value) => !value);
      } else if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        void toggleFullscreen();
      } else if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        window.print();
      } else if (event.key === "Escape" && overview) {
        setOverview(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, next, overview, previous, toggleFullscreen]);

  function handlePointerDown(event: React.PointerEvent) {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: React.PointerEvent) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || overview) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 54 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) next();
    else previous();
  }

  const slides = [
    <article
      key="title"
      className={cx(styles.slide, styles.titleSlide)}
      data-slide={1}
      aria-label="Slide 1: A market number is earned"
    >
      <div className={styles.titleGrid} aria-hidden="true" />
      <div className={styles.titleMain}>
        <div className={styles.titleBrand}>ATLAS</div>
        <div className={styles.titleEyebrow}>HOW THE RESEARCH ENGINE WORKS</div>
        <h1 className={styles.heroTitle}>
          A market number is not found.
          <br />
          <em>It is earned.</em>
        </h1>
        <p className={styles.heroLead}>
          Atlas improves a market model one claim at a time—until the only
          uncertainty left is the risk that research cannot remove.
        </p>
        <div className={styles.heroThesis}>
          <span>ONE QUESTION</span>
          <strong>→</strong>
          <span>MANY CLAIMS</span>
          <strong>→</strong>
          <span>DEFENDABLE MODEL</span>
        </div>
      </div>
      <div className={styles.titleLoop} aria-label="Atlas research loop">
        <div className={styles.loopHalo} aria-hidden="true" />
        <strong>LOOP</strong>
        <ol>
          <li><span>01</span>Observe</li>
          <li><span>02</span>Question</li>
          <li><span>03</span>Research</li>
          <li><span>04</span>Update</li>
        </ol>
        <p>until evidence stops changing the answer</p>
      </div>
      <div className={styles.titleFooter}>ATLAS · MARKET SIZE &amp; SHAPE</div>
    </article>,

    <Slide
      key="problem"
      number={2}
      eyebrow="The problem Atlas solves"
      title="The headline is clean. The uncertainty is not."
    >
      <p className={styles.lead}>
        A market report compresses dozens of scoped claims into one polished number.
        If one boundary is wrong, every downstream decision inherits the error.
      </p>
      <div className={styles.problemLayout}>
        <div className={styles.polishedAnswer}>
          <span>POLISHED OUTPUT</span>
          <strong>€1.2B</strong>
          <p>Central European rack-PDU market</p>
          <em>Looks decisive</em>
        </div>
        <div className={styles.problemReveal} aria-hidden="true">
          <span>HIDES</span>
          <strong>→</strong>
        </div>
        <div className={styles.hiddenClaims}>
          <div className={styles.hiddenClaimsHeader}>
            <span>UNDERNEATH THE HEADLINE</span>
            <strong>Four unresolved claims</strong>
          </div>
          {[
            ["SCOPE", "Which products and substitutes count as a PDU?"],
            ["GEOGRAPHY", "Manufacture, installation, invoice location or owner HQ?"],
            ["EVIDENCE", "Direct observation—or a proxy carrying hidden assumptions?"],
            ["TIME", "Which year, currency, revenue basis and price level?"],
          ].map(([label, question]) => (
            <div className={styles.hiddenClaimRow} key={label}>
              <small>{label}</small>
              <p>{question}</p>
              <em>UNRESOLVED</em>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.problemThesis}>
        <strong>THE REAL PROBLEM</strong>
        <span>Hidden uncertainty cannot be inspected, improved or acted upon.</span>
        <em>Atlas turns the headline back into the claims that create it.</em>
      </div>
    </Slide>,

    <Slide
      key="intake"
      number={3}
      eyebrow="01 · Frame the problem"
      title="The research starts with a decision, not a search."
    >
      <p className={styles.lead}>
        Documents provide context. A brief questionnaire closes the gaps. Together,
        they define exactly what Atlas needs to measure.
      </p>
      <div className={styles.intakeLayout}>
        <div className={styles.inputColumn}>
          <div className={styles.inputBlock}>
            <span>INPUT A</span>
            <h3>Documents</h3>
            <p>Product notes · market reports · venture profile · prior research</p>
          </div>
          <div className={styles.inputBlock}>
            <span>INPUT B</span>
            <h3>Brief questionnaire</h3>
            <p>Where? · for what use? · for whom? · over what time horizon?</p>
          </div>
        </div>
        <div className={styles.mergeArrow} aria-hidden="true">→</div>
        <div className={styles.scopeContract}>
          <span>RESEARCH CONTRACT</span>
          <h3>One scoped market question</h3>
          <div className={styles.scopeRows}>
            <div><small>WHAT</small><strong>Rack power distribution</strong></div>
            <div><small>WHERE</small><strong>Central Europe</strong></div>
            <div><small>FOR WHOM</small><strong>Target buyer set</strong></div>
            <div><small>OUTPUT</small><strong>Size, shape and risk</strong></div>
          </div>
        </div>
      </div>
      <p className={styles.bottomClaim}>
        Better boundaries prevent false precision later.
      </p>
    </Slide>,

    <Slide
      key="fact-bank"
      number={4}
      eyebrow="02 · Build the first pass"
      title="The first pass creates a fact bank—not a final answer."
    >
      <p className={styles.lead}>
        Atlas fills the model quickly enough to expose what is known, what is assumed,
        and which cells deserve the next research pass.
      </p>
      <div className={styles.factBankLayout}>
        <div className={styles.factGrid}>
          {firstPassCells.map(([axis, label, status, code, state, tone], index) => (
            <div className={cx(styles.factCell, index < 4 && styles.factCellActive)} key={label}>
              <div className={styles.factCellTop}>
                <span>{axis}</span>
                <strong>{code}</strong>
              </div>
              <h3>{label}</h3>
              <p>{status}</p>
              <div className={styles.factCellState}>
                <span className={styles[tone]}>{state}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.factAnatomy}>
          <span>EVERY CELL CARRIES</span>
          <ol>
            <li><strong>01</strong> Value or range</li>
            <li><strong>02</strong> Market definition</li>
            <li><strong>03</strong> Evidence + as-of</li>
            <li><strong>04</strong> Confidence + rationale</li>
            <li><strong>05</strong> Open error + next question</li>
          </ol>
          <p>The initial estimate is a starting hypothesis with provenance—not a hidden guess.</p>
        </div>
      </div>
    </Slide>,

    <Slide
      key="fact-record"
      number={5}
      eyebrow="Inside the fact bank"
      title="A fact bank cell is a compact, auditable research record."
    >
      <p className={styles.lead}>
        Click any row to open the full record. Hover or focus a column label to see
        why it exists.
      </p>
      <div className={styles.factRecordLayout}>
        <div className={styles.factRecordTable}>
          <div className={styles.factRecordHeader}>
            <span
              className={styles.factHint}
              tabIndex={0}
              data-tooltip="The precise, scoped statement Atlas is trying to support."
            >
              Claim <sup>?</sup>
            </span>
            <span
              className={styles.factHint}
              tabIndex={0}
              data-tooltip="The current best estimate. It remains editable until the evidence stabilises."
            >
              Working value <sup>?</sup>
            </span>
            <span
              className={styles.factHint}
              tabIndex={0}
              data-tooltip="A judgement about evidence quality—not a claim that the number is exact."
            >
              Confidence <sup>?</sup>
            </span>
            <span
              className={styles.factHint}
              tabIndex={0}
              data-tooltip="Stable, active, or risk tells Atlas whether to keep researching or route the uncertainty."
            >
              State <sup>?</sup>
            </span>
            <span aria-hidden="true" />
          </div>
          {factRecords.map((record) => (
            <button
              type="button"
              className={styles.factRecordRow}
              popoverTarget={"fact-record-" + record.id}
              aria-label={"Open fact record: " + record.claim}
              key={record.id}
            >
              <span>
                <small>{record.axis}</small>
                <strong>{record.claim}</strong>
              </span>
              <b>{record.value}</b>
              <em>{record.confidence}</em>
              <i className={styles[record.stateTone]}>{record.state}</i>
              <span className={styles.openRecordArrow} aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div className={styles.recordContents}>
          <span>ONE RECORD CONTAINS</span>
          <ol>
            <li><strong>01</strong><span>Identity</span><small>id · dimension · scope</small></li>
            <li><strong>02</strong><span>Claim</span><small>value · range · unit · as-of</small></li>
            <li><strong>03</strong><span>Evidence</span><small>sources · definition · confidence</small></li>
            <li><strong>04</strong><span>Research state</span><small>open error · next question · revision log</small></li>
          </ol>
          <p>Nothing important is trapped in a footnote or hidden behind a headline number.</p>
        </div>
      </div>
      <p className={styles.recordFootnote}>
        * Illustrative values from the demo ledger. The record anatomy is the point.
      </p>

      {factRecords.map((record) => (
        <aside
          id={"fact-record-" + record.id}
          className={styles.factRecordPopover}
          popover="auto"
          aria-label={record.claim + " fact record"}
          key={"popover-" + record.id}
        >
          <header className={styles.recordPopoverHeader}>
            <div>
              <span>FACT RECORD · {record.nodeId}</span>
              <h3>{record.claim}</h3>
              <p>{record.axis} · illustrative anatomy</p>
            </div>
            <button
              type="button"
              popoverTarget={"fact-record-" + record.id}
              popoverTargetAction="hide"
              aria-label={"Close " + record.claim + " fact record"}
            >
              ×
            </button>
          </header>

          <div className={styles.recordMetrics}>
            <div><span>WORKING VALUE</span><strong>{record.value}</strong></div>
            <div><span>PLAUSIBLE RANGE</span><strong>{record.range}</strong></div>
            <div><span>UNIT</span><strong>{record.unit}</strong></div>
            <div><span>AS OF</span><strong>{record.asOf}</strong></div>
            <div><span>CONFIDENCE</span><strong>{record.confidence}</strong></div>
            <div><span>STATE</span><strong>{record.state}</strong></div>
          </div>

          <div className={styles.recordPopoverBody}>
            <section>
              <span>MARKET DEFINITION</span>
              <p>{record.definition}</p>
            </section>
            <section>
              <span>EVIDENCE STACK · ILLUSTRATIVE</span>
              <ul>
                {record.evidence.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          </div>

          <div className={styles.recordResearchState}>
            <section>
              <span>OPEN ERROR</span>
              <p>{record.error}</p>
            </section>
            <section>
              <span>NEXT RESEARCH QUESTION</span>
              <p>{record.next}</p>
            </section>
          </div>

          <footer className={styles.recordRevision}>
            <span>REVISION LOG</span>
            <strong>{record.revision}</strong>
          </footer>
        </aside>
      ))}
    </Slide>,

    <Slide
      key="loop"
      number={6}
      eyebrow="03 · Run the reasoning engine"
      title="Every important cell runs its own evidence loop."
    >
      <p className={styles.lead}>
        Atlas does not repeat the broad market question. It asks the next question
        that can make one specific claim more accurate.
      </p>
      <div className={styles.loopProcess}>
        {loopSteps.map(([number, title, detail], index) => (
          <div className={styles.loopStep} key={number}>
            <div className={cx(styles.loopNumber, index === 2 && styles.loopNumberError)}>{number}</div>
            <h3>{title}</h3>
            <p>{detail}</p>
            {index < loopSteps.length - 1 ? <span className={styles.stepArrow}>→</span> : null}
          </div>
        ))}
      </div>
      <div className={styles.loopDecision}>
        <div>
          <span>CAN MORE WEB EVIDENCE CHANGE THE CLAIM?</span>
          <strong>YES → run another targeted pass</strong>
        </div>
        <div>
          <span>HAS THE EVIDENCE CEILING BEEN REACHED?</span>
          <strong>YES → record the residual risk</strong>
        </div>
      </div>
    </Slide>,

    <Slide
      key="germany-loop"
      number={7}
      eyebrow="A fact cell in motion"
      title="One PDU can produce three different market answers."
    >
      <p className={styles.lead}>
        Made in Austria. Installed in the Netherlands. Owned by a German company.
        Atlas cannot size Germany until it chooses what geography means.
      </p>
      <div className={styles.caseStudyLayout}>
        <section className={styles.attributionPanel}>
          <span className={styles.caseKicker}>THE SAME PDU</span>
          <div className={styles.assetJourney}>
            <div><b>AT</b><small>MADE IN</small><strong>Austria</strong></div>
            <i>→</i>
            <div><b>NL</b><small>INSTALLED IN</small><strong>Netherlands</strong></div>
            <i>→</i>
            <div><b>DE</b><small>OWNED FROM</small><strong>Germany</strong></div>
          </div>
          <h3>Which geography owns the value?</h3>
          <div className={styles.attributionRules}>
            <div>
              <span>Production view</span>
              <strong>Austria</strong>
              <em>origin</em>
            </div>
            <div className={styles.selectedRule}>
              <span>Deployment demand</span>
              <strong>Netherlands</strong>
              <em>selected</em>
            </div>
            <div>
              <span>Buyer-HQ view</span>
              <strong>Germany</strong>
              <em>ownership</em>
            </div>
          </div>
          <p className={styles.attributionPrinciple}>
            For this demand-market question, Atlas counts the PDU in NL. AT and DE
            remain addressable metadata—not extra geography share.
          </p>
        </section>

        <section className={styles.caseLoopPanel}>
          <div className={styles.caseLoopHeader}>
            <span>GERMANY FACT CELL · FOUR PASSES</span>
            <strong>Broad → bounded → defendable</strong>
          </div>
          {[
            [
              "00",
              "BROAD & MESSY",
              "‘German PDU market’",
              "€200–500M*",
              "Manufacturing, invoicing, ownership and installation are blended.",
            ],
            [
              "01",
              "DEFINE THE UNIT",
              "Revenue from rack PDUs installed in German facilities",
              "€260–430M*",
              "Installation becomes the geography key; product and year are locked.",
            ],
            [
              "02",
              "RESEARCH THE ERROR",
              "Remove cross-border bookings; triangulate deployments",
              "€290–390M*",
              "Facility capacity, installed racks and supplier footprints are compared.",
            ],
            [
              "03",
              "DEFENDABLE CELL",
              "Germany-installed rack-PDU revenue",
              "€336M*",
              "Range €300–370M · Inferred · Risk: no verified installation-level shipment series.",
            ],
          ].map(([pass, label, claim, value, detail], index) => (
            <div
              className={cx(styles.casePassRow, index === 3 && styles.casePassFinal)}
              key={pass}
            >
              <div className={styles.casePassNumber}>{pass}</div>
              <div className={styles.casePassCopy}>
                <span>{label}</span>
                <strong>{claim}</strong>
                <p>{detail}</p>
              </div>
              <b>{value}</b>
            </div>
          ))}
        </section>
      </div>
      <p className={styles.caseFootnote}>
        * Illustrative walkthrough. Defendable means precisely scoped, supported,
        bounded—and honest about the risk that remains.
      </p>
    </Slide>,

    <Slide
      key="cell-level"
      number={8}
      eyebrow="Why the cell matters"
      title="The unit of work is the claim—not the report."
    >
      <p className={styles.lead}>
        Broad research blends strong and weak evidence into one answer. Cell-level
        loops put effort exactly where uncertainty can move the market model.
      </p>
      <div className={styles.comparisonLayout}>
        <div className={styles.broadResearch}>
          <span>BROAD LOOP</span>
          <h3>“How large is the Central European market?”</h3>
          <div className={styles.broadBlob}>
            <i />
            <i />
            <i />
            <strong>ONE BLENDED ANSWER</strong>
          </div>
          <p>Definitions, source quality and missing cuts are hard to isolate.</p>
        </div>
        <div className={styles.vsMarker}>VS</div>
        <div className={styles.cellResearch}>
          <div className={styles.cellResearchHeader}>
            <span>ATLAS LOOPS</span>
            <strong>Effort follows uncertainty</strong>
          </div>
          {[
            ["Germany", "Sources converge inside the range", "stable"],
            ["Netherlands", "Definition and geography locked", "stable"],
            ["Hyperscale", "Researchable taxonomy error remains", "active"],
            ["Large customers", "At the public-evidence ceiling", "risk"],
          ].map(([name, result, status]) => (
            <div className={styles.cellResearchRow} key={name}>
              <strong>{name}</strong>
              <span>{result}</span>
              <em className={styles[status]}>{status}</em>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.statusLegend}>
        <div className={styles.statusStable}>
          <strong>STABLE</strong>
          <span>Definition locked · independent sources converge · range stops moving</span>
        </div>
        <div className={styles.statusActive}>
          <strong>ACTIVE</strong>
          <span>Researchable error remains · next question is explicit · another pass may move the value</span>
        </div>
        <div className={styles.statusRisk}>
          <strong>RISK</strong>
          <span>Evidence ceiling reached · uncertainty still matters · route beyond web research</span>
        </div>
      </div>
    </Slide>,

    <Slide
      key="difficulty"
      number={9}
      eyebrow="Research depth"
      title="Difficulty changes the number of loops, not the method."
    >
      <p className={styles.lead}>
        Some markets converge quickly. Others need repeated definition, triangulation
        and segmentation before the model becomes trustworthy.
      </p>
      <div className={styles.difficultyGrid}>
        {difficulty.map((item, index) => (
          <div className={cx(styles.difficultyCard, styles["difficulty" + item.tone])} key={item.level}>
            <div className={styles.difficultyTop}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.level}</strong>
            </div>
            <h3>{item.example}</h3>
            <p>{item.description}</p>
            <div className={styles.loopMeter}>
              {Array.from({ length: 5 }, (_, meterIndex) => (
                <i className={meterIndex <= index + 1 ? styles.meterOn : undefined} key={meterIndex} />
              ))}
            </div>
            <em>{item.loops}</em>
          </div>
        ))}
      </div>
      <p className={styles.bottomClaim}>
        Atlas adapts the research depth without changing the evidence standard.
      </p>
    </Slide>,

    <Slide
      key="risk"
      number={10}
      eyebrow="The stopping rule"
      title="Atlas separates fixable error from irreducible risk."
    >
      <p className={styles.lead}>
        The loop ends only when another web search is unlikely to change the claim.
        What remains is preserved as decision risk—not polished away.
      </p>
      <div className={styles.ceilingLayout}>
        <div className={styles.researchableSide}>
          <span>BEFORE THE CEILING</span>
          <h3>Research can still reduce error</h3>
          <ul>
            <li>Unclear market definition</li>
            <li>Outdated or single-source estimate</li>
            <li>Contradictory evidence</li>
            <li>Missing geography or segment cut</li>
          </ul>
          <div className={styles.researchArrow}>MORE TARGETED RESEARCH →</div>
        </div>
        <div className={styles.evidenceCeiling}>
          <strong>EVIDENCE<br />CEILING</strong>
          <span>web research stops adding information</span>
        </div>
        <div className={styles.residualSide}>
          <span>AFTER THE CEILING</span>
          <h3>Residual uncertainty becomes risk</h3>
          <ul>
            <li>Unpublished commercial data</li>
            <li>Future buyer behavior</li>
            <li>No accepted industry boundary</li>
            <li>Assumption only a participant can test</li>
          </ul>
          <div className={styles.riskDefinition}>RISK = uncertainty that can still change the decision</div>
        </div>
      </div>
    </Slide>,

    <Slide
      key="dashboard"
      number={11}
      eyebrow="04 · Compute the market"
      title="The dashboard is a live model of the evidence."
    >
      <p className={styles.lead}>
        The fact bank feeds a deterministic model. Change a scope or assumption and
        Atlas recomputes the market—and explains the delta.
      </p>
      <div className={styles.modelLayout}>
        <div className={styles.modelInputs}>
          <span>FACT BANK</span>
          {[
            ["GEOGRAPHY", "Germany · Netherlands · …"],
            ["APPLICATION", "Hyperscale · Edge · …"],
            ["BUYER", "Large customer · Integrator · …"],
            ["ASSUMPTIONS", "Serviceable · Obtainable"],
          ].map(([label, value]) => (
            <div key={label}>
              <small>{label}</small>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <div className={styles.computeCore}>
          <span>REASONING ENGINE</span>
          <code>
            TAM = base × geography
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;× segment × buyer
            <br />
            SAM = TAM × serviceable
            <br />
            YAM = SAM × obtainable
          </code>
          <p>No static headline. Every output is derived.</p>
        </div>
        <div className={styles.dashboardOutput}>
          <span>LIVE DASHBOARD</span>
          <div className={styles.funnelLine}><small>TAM</small><i /></div>
          <div className={styles.funnelLine}><small>SAM</small><i /></div>
          <div className={styles.funnelLine}><small>YAM</small><i /></div>
          <div className={styles.deltaReadout}>
            <small>SCENARIO DELTA</small>
            <strong>Which claim moved the answer?</strong>
          </div>
        </div>
      </div>
      <div className={styles.liveLeverBar}>
        <span>Toggle Germany</span><i>→</i><span>Focus hyperscale</span><i>→</i><span>Select large buyers</span><i>→</i><strong>see the impact instantly</strong>
      </div>
    </Slide>,

    <Slide
      key="handoff"
      number={12}
      eyebrow="05 · Route what remains"
      title="When web research stops, Atlas chooses the next evidence source."
    >
      <p className={styles.lead}>
        An unresolved risk is not a failed result. It becomes a structured handoff
        to the Suite of Software Solutions—the SSS.
      </p>
      <div className={styles.handoffLayout}>
        <div className={styles.atlasBoundary}>
          <span>ATLAS OWNS</span>
          <strong>Web research loop</strong>
          <p>Search · triangulate · refine · document</p>
          <div className={styles.boundaryResult}>
            <small>OUTPUT</small>
            <b>Explicit residual risk</b>
          </div>
        </div>
        <div className={styles.handoffArrow}>→</div>
        <div className={styles.sssRoutes}>
          <span>SSS OWNS WHAT COMES NEXT</span>
          {[
            ["01", "Speak to an expert", "Tacit knowledge or unpublished practice"],
            ["02", "Buy evidence", "Specialist data, report or proprietary source"],
            ["03", "Monitor", "A fact that will resolve with time"],
            ["04", "Test in market", "A behavior only action can reveal"],
          ].map(([number, title, detail], index) => (
            <div className={cx(styles.routeRow, index === 0 && styles.routeRowActive)} key={number}>
              <strong>{number}</strong>
              <h3>{title}</h3>
              <p>{detail}</p>
            </div>
          ))}
        </div>
      </div>
      <p className={styles.bottomClaim}>
        Atlas knows when to keep searching—and when searching is no longer the answer.
      </p>
    </Slide>,

    <article
      key="close"
      className={cx(styles.slide, styles.closeSlide)}
      data-slide={13}
      aria-label="Slide 13: Atlas earns a defendable market model"
    >
      <div className={styles.closeBrand}>ATLAS</div>
      <div className={styles.closeEyebrow}>THE IDEA IN ONE LINE</div>
      <h2>
        Research the market
        <br />
        <em>claim by claim</em>
        <br />
        until uncertainty is in the right place.
      </h2>
      <div className={styles.closeFlow}>
        {[
          ["01", "Documents + questions"],
          ["02", "Initial fact bank"],
          ["03", "Cell-level loops"],
          ["04", "Live market model"],
          ["05", "Risk handoff"],
        ].map(([number, label], index) => (
          <div key={number}>
            <span>{number}</span>
            <strong>{label}</strong>
            {index < 4 ? <i>→</i> : null}
          </div>
        ))}
      </div>
      <div className={styles.closeOutcomes}>
        <div><span>✓</span><strong>VERIFIED FACT</strong></div>
        <div><span>~</span><strong>EXPLICIT ASSUMPTION</strong></div>
        <div><span>→</span><strong>ROUTED RISK</strong></div>
      </div>
      <p className={styles.closeClaim}>
        The output is not artificial certainty. It is a defendable number with a
        traceable path to what must happen next.
      </p>
      <div className={styles.closeFooter}>ATLAS · MARKET SIZE &amp; SHAPE · 13</div>
    </article>,
  ];

  return (
    <main
      ref={rootRef}
      className={styles.deckApp}
      aria-label="Atlas research loop presentation"
    >
      <div
        className={styles.stageWrap}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <section
          className={cx(styles.stage, overview && styles.overview)}
          aria-live="polite"
          aria-label={
            overview
              ? "Slide overview"
              : "Showing slide " + (current + 1) + " of " + SLIDE_COUNT
          }
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={cx(
                styles.slideSlot,
                !overview && index === current && styles.activeSlot,
              )}
              aria-hidden={!overview && index !== current}
              onClick={() => {
                if (overview) goTo(index);
              }}
              onKeyDown={(event) => {
                if (overview && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  goTo(index);
                }
              }}
              role={overview ? "button" : undefined}
              tabIndex={overview ? 0 : -1}
            >
              {slide}
            </div>
          ))}
        </section>
      </div>

      <nav className={styles.controls} aria-label="Presentation controls">
        <div className={styles.deckIdentity}>
          <strong>ATLAS</strong>
          <span>
            {String(current + 1).padStart(2, "0")} / {SLIDE_COUNT}
          </span>
        </div>

        <div
          className={styles.progress}
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={SLIDE_COUNT}
          aria-valuenow={current + 1}
          aria-label={"Slide " + (current + 1) + " of " + SLIDE_COUNT}
        >
          <span style={{ width: ((current + 1) / SLIDE_COUNT) * 100 + "%" }} />
        </div>

        <div className={styles.controlButtons}>
          <button
            type="button"
            onClick={previous}
            disabled={current === 0 || overview}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            disabled={current === SLIDE_COUNT - 1 || overview}
            aria-label="Next slide"
          >
            →
          </button>
          <button
            type="button"
            onClick={() => setOverview((value) => !value)}
            aria-pressed={overview}
          >
            {overview ? "Close overview" : "Overview"}
          </button>
          <button type="button" onClick={() => void toggleFullscreen()}>
            {fullscreen ? "Exit fullscreen" : "Fullscreen"}
          </button>
          <button type="button" onClick={() => window.print()}>
            Print
          </button>
        </div>

        <div className={styles.keyboardHint}>
          ← → navigate · O overview · F fullscreen · P print
        </div>
      </nav>
    </main>
  );
}
