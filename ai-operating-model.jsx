import { useState } from "react";

const COLORS = {
  bg: "#0d0f14",
  surface: "#13161e",
  surface2: "#1a1e28",
  border: "#252a38",
  accent: "#00c9a7",
  accentDim: "#00c9a720",
  amber: "#f4a340",
  amberDim: "#f4a34020",
  blue: "#4d9de0",
  blueDim: "#4d9de020",
  purple: "#9b72cf",
  purpleDim: "#9b72cf20",
  red: "#e05c5c",
  text: "#e8eaf0",
  textMuted: "#7a8099",
  textDim: "#4a5068",
};

const NAV = ["Overview", "Team Roles", "AI Toolchain", "Compound Chain", "Champions", "Metrics & Governance"];

const roles = [
  {
    id: "bsa",
    title: "Business Systems Analyst",
    abbr: "BSA",
    color: COLORS.accent,
    dim: COLORS.accentDim,
    tools: ["Claude (claude.ai)", "M365 Copilot"],
    produces: ["requirements.md", "user stories", "acceptance criteria", "regulatory mapping"],
    consumes: ["Business need", "Regulatory text", "Stakeholder notes"],
    aiMoments: [
      "Draft requirements from meeting notes",
      "Map OSFI/Basel clauses to functional requirements",
      "Self-review spec for completeness before handoff",
      "Generate structured AC from vague business language",
    ],
    upstream: [],
    downstream: ["dev"],
  },
  {
    id: "dev",
    title: "Developer",
    abbr: "Dev",
    color: COLORS.blue,
    dim: COLORS.blueDim,
    tools: ["GitHub Copilot (inline)", "Claude (complex logic)", "VS Code / Visual Studio"],
    produces: ["design.md", "code + PR", "PR description"],
    consumes: ["requirements.md", "CLAUDE.md / copilot-instructions.md", "pipeline YAML"],
    aiMoments: [
      "Generate design artifact from requirements",
      "Copilot inline for boilerplate / pattern repetition",
      "Claude for complex business logic (SA-CCR, CVA calc)",
      "AI-drafted PR description with traceability IDs",
    ],
    upstream: ["bsa"],
    downstream: ["qa"],
  },
  {
    id: "qa",
    title: "QA / QE Engineer",
    abbr: "QA/QE",
    color: COLORS.amber,
    dim: COLORS.amberDim,
    tools: ["Claude (claude.ai)", "GitHub Copilot (test scaffolding)"],
    produces: ["test-plan.md", "test automation scaffolding", "Requirements Gap Report → BSA"],
    consumes: ["requirements.md", "design.md", "PR diff"],
    aiMoments: [
      "Generate test cases from requirements + design",
      "Scaffold automation from test-plan.md",
      "Produce Requirements Gap Report to feed back to BSA",
      "JIRA/JTMF test case population from plan",
    ],
    upstream: ["dev"],
    downstream: ["prod"],
  },
  {
    id: "prod",
    title: "Prod Support",
    abbr: "Prod",
    color: COLORS.purple,
    dim: COLORS.purpleDim,
    tools: ["Claude (claude.ai)"],
    produces: ["runbook.md", "alert playbooks", "Operability Review → Dev"],
    consumes: ["requirements.md", "design.md", "test-plan.md"],
    aiMoments: [
      "Generate runbook from full artifact chain",
      "Surface operability gaps before code merges",
      "Draft alert playbooks from design decisions",
      "Post-incident: trace gaps back to artifact chain",
    ],
    upstream: ["qa"],
    downstream: [],
  },
];

const chainSteps = [
  { step: 1, role: "BSA", color: COLORS.accent, artifact: "requirements.md", desc: "Business need + regulatory text → structured requirements with REQ-### IDs", tool: "Claude" },
  { step: 2, role: "BSA", color: COLORS.accent, artifact: "Self-review", desc: "Claude reviews own spec for gaps, missing AC, edge cases before handoff", tool: "Claude" },
  { step: 3, role: "Dev", color: COLORS.blue, artifact: "design.md", desc: "requirements.md consumed → design with DES-### IDs tracing to REQ-###", tool: "Claude + Copilot" },
  { step: 4, role: "Dev", color: COLORS.blue, artifact: "Code + PR", desc: "requirements.md + design.md as Copilot context → implementation + AI PR description", tool: "Copilot inline" },
  { step: 5, role: "QA/QE", color: COLORS.amber, artifact: "test-plan.md", desc: "requirements + design + PR diff → TC-### IDs tracing to REQ/DES", tool: "Claude" },
  { step: 6, role: "QA/QE", color: COLORS.amber, artifact: "Test automation", desc: "test-plan.md → scaffolded test code committed to repo", tool: "Claude + Copilot" },
  { step: 7, role: "Prod", color: COLORS.purple, artifact: "runbook.md", desc: "Full artifact chain → runbook with RB-### IDs, alert playbooks", tool: "Claude" },
  { step: 8, role: "All", color: COLORS.textMuted, artifact: "Chain review", desc: "All roles: AI cross-checks artifacts for contradictions/gaps", tool: "Claude" },
];

const feedbackLoops = [
  { from: "QA/QE", to: "BSA", artifact: "Requirements Gap Report", color: COLORS.amber, desc: "Test generation surfaces missing AC → BSA updates requirements.md" },
  { from: "Prod", to: "Dev", artifact: "Operability Review", color: COLORS.purple, desc: "Runbook generation surfaces monitoring/rollback gaps → Dev fixes before merge" },
  { from: "Incident", to: "All", artifact: "Post-Incident Chain Trace", color: COLORS.red, desc: "Claude maps incident back to artifact chain to update AC, design, tests, runbook" },
];

const guardrails = [
  { category: "Code Quality", items: ["ruff (linting)", "mypy (type checking)", "bandit (security scanning)", "CLAUDE.md — machine-readable AI instructions"], color: COLORS.blue },
  { category: "AI Tool Governance", items: ["GitHub Copilot — enterprise licensed, premium token budget", "Claude — claude.ai (browser), no sensitive data in prompts", "M365 Copilot — BSA use cases, O365 tenant boundary", "No third-party AI tools without OSFI B-10/B-13 review"], color: COLORS.accent },
  { category: "Regulatory", items: ["OSFI B-10/B-13 data residency compliance", "Basel III / BCBS 239 data lineage requirements", "Audit traceability: REQ → DES → TC → RB chain", "SA-CCR / CVA / FRTB — AI assists, human validates"], color: COLORS.amber },
  { category: "Repo Standards", items: ["CLAUDE.md + copilot-instructions.md per repo", "Python: ruff/mypy/bandit toolchain enforced", "YAML/Pydantic config patterns for pipeline artifacts", "CODEOWNERS controls for regulated pipeline configs"], color: COLORS.purple },
];

const metrics = [
  { label: "Requirement → Test Traceability", target: "95%+", cadence: "Per sprint", tier: "Quality" },
  { label: "Requirements Gap Rate", target: "< 10%", cadence: "Per sprint", tier: "Quality" },
  { label: "AI Assist Rate (PR descriptions)", target: "80%+", cadence: "Monthly", tier: "Adoption" },
  { label: "Artifact Chain Completeness", target: "100% before UAT", cadence: "Per Jira", tier: "Quality" },
  { label: "Copilot Accept Rate", target: "≥ 30%", cadence: "Monthly", tier: "Adoption" },
  { label: "Test Automation Coverage", target: "Trend ↑", cadence: "Monthly", tier: "Quality" },
  { label: "Runbook Generation Time", target: "Trend ↓", cadence: "Quarterly", tier: "Efficiency" },
  { label: "Chain Retro: Breakpoints", target: "0 recurring", cadence: "Quarterly", tier: "Health" },
];

const maturityLevels = [
  { level: "L0", label: "Ad Hoc", desc: "AI used individually, no shared patterns", color: COLORS.red },
  { level: "L1", label: "Enabled", desc: "Tool access + templates in place, inconsistent use", color: COLORS.amber },
  { level: "L2", label: "Compound", desc: "Artifact chain operating, feedback loops active", color: COLORS.accent },
  { level: "L3", label: "Self-Improving", desc: "Chain retros drive continuous improvement, ROI measured", color: COLORS.blue },
];

export default function OperatingModel() {
  const [activeNav, setActiveNav] = useState(0);
  const [activeRole, setActiveRole] = useState(null);
  const [currentMaturity, setCurrentMaturity] = useState(1);

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', 'Courier New', monospace", background: COLORS.bg, minHeight: "100vh", color: COLORS.text }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "20px 28px 16px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 11, color: COLORS.accent, letterSpacing: 3, textTransform: "uppercase" }}>Treasury Technology</span>
          <span style={{ color: COLORS.border }}>|</span>
          <span style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 }}>Corporate Technology · Big Six</span>
        </div>
        <h1 style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 700, letterSpacing: -0.5, fontFamily: "'IBM Plex Sans', sans-serif" }}>
          AI Operating Model
          <span style={{ fontSize: 13, fontWeight: 400, color: COLORS.textMuted, marginLeft: 14 }}>v1.0 · 2026</span>
        </h1>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${COLORS.border}`, overflowX: "auto" }}>
        {NAV.map((n, i) => (
          <button
            key={n}
            onClick={() => setActiveNav(i)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "12px 18px", fontSize: 11, letterSpacing: 1,
              color: activeNav === i ? COLORS.accent : COLORS.textMuted,
              borderBottom: `2px solid ${activeNav === i ? COLORS.accent : "transparent"}`,
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {n.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px 28px", maxWidth: 960, margin: "0 auto" }}>

        {/* OVERVIEW */}
        {activeNav === 0 && (
          <div>
            <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.7, marginBottom: 24, maxWidth: 680 }}>
              A compound engineering operating model for a treasury tech team of BSAs, Developers, QA/QE Engineers, and Prod Support. AI is embedded at every handoff — not bolted on at the end.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Core Principle", value: "Artifact chain, not point-in-time AI use", color: COLORS.accent },
                { label: "Tool Philosophy", value: "Right tool per role — Copilot for code, Claude for reasoning", color: COLORS.blue },
                { label: "Regulatory Posture", value: "AI assists, human validates. Full traceability required.", color: COLORS.amber },
                { label: "Quality Gate", value: "No Jira moves without complete artifact chain", color: COLORS.purple },
              ].map(c => (
                <div key={c.label} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${c.color}`, borderRadius: 6, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 2, marginBottom: 6 }}>{c.label.toUpperCase()}</div>
                  <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}>{c.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.textMuted, marginBottom: 14 }}>THE COMPOUND CHAIN — AT A GLANCE</div>
              <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
                {[
                  { role: "BSA", color: COLORS.accent, artifact: "requirements.md" },
                  { role: "Dev", color: COLORS.blue, artifact: "design.md + code" },
                  { role: "QA/QE", color: COLORS.amber, artifact: "test-plan.md" },
                  { role: "Prod", color: COLORS.purple, artifact: "runbook.md" },
                ].map((s, i) => (
                  <div key={s.role} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ background: s.color + "22", border: `1px solid ${s.color}`, borderRadius: 6, padding: "8px 16px", minWidth: 90 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.role}</div>
                        <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 3 }}>{s.artifact}</div>
                      </div>
                    </div>
                    {i < 3 && (
                      <div style={{ padding: "0 8px", color: COLORS.textDim, fontSize: 16 }}>→</div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: COLORS.textMuted, fontStyle: "italic" }}>
                Each artifact is structured (markdown/YAML), versioned in the repo, and AI-readable — so downstream roles consume, not reconstruct.
              </div>
            </div>

            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "18px 20px" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.textMuted, marginBottom: 14 }}>TEAM MATURITY — WHERE ARE YOU NOW?</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {maturityLevels.map((m, i) => (
                  <button
                    key={m.level}
                    onClick={() => setCurrentMaturity(i)}
                    style={{
                      background: currentMaturity === i ? m.color + "22" : "transparent",
                      border: `1px solid ${currentMaturity === i ? m.color : COLORS.border}`,
                      borderRadius: 6, padding: "10px 14px", cursor: "pointer", textAlign: "left", minWidth: 140,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: currentMaturity === i ? m.color : COLORS.textMuted }}>{m.level} · {m.label}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4, lineHeight: 1.4 }}>{m.desc}</div>
                  </button>
                ))}
              </div>
              {currentMaturity < 3 && (
                <div style={{ marginTop: 14, fontSize: 12, color: COLORS.textMuted, borderTop: `1px solid ${COLORS.border}`, paddingTop: 12 }}>
                  <span style={{ color: maturityLevels[currentMaturity + 1]?.color }}>↑ Next level ({maturityLevels[currentMaturity + 1]?.label}):</span>{" "}
                  {currentMaturity === 0 && "Deploy templates + tool access. Pick one champion per role to pilot."}
                  {currentMaturity === 1 && "Activate the artifact chain on 2–3 features. Run your first chain retro."}
                  {currentMaturity === 2 && "Instrument metrics. Champions lead retros. ROI reported to leadership."}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TEAM ROLES */}
        {activeNav === 1 && (
          <div>
            <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 20 }}>Click a role to expand. Each role has a distinct AI moment profile and artifact responsibility.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {roles.map(r => (
                <div key={r.id}>
                  <button
                    onClick={() => setActiveRole(activeRole === r.id ? null : r.id)}
                    style={{
                      width: "100%", background: activeRole === r.id ? r.dim : COLORS.surface,
                      border: `1px solid ${activeRole === r.id ? r.color : COLORS.border}`,
                      borderRadius: 8, padding: "14px 18px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ background: r.color + "22", border: `1px solid ${r.color}`, borderRadius: 4, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: r.color }}>{r.abbr}</div>
                      <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 600, fontFamily: "'IBM Plex Sans', sans-serif" }}>{r.title}</div>
                    </div>
                    <span style={{ color: r.color, fontSize: 16 }}>{activeRole === r.id ? "−" : "+"}</span>
                  </button>

                  {activeRole === r.id && (
                    <div style={{ background: COLORS.surface2, border: `1px solid ${r.color}30`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: "18px 20px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 2, marginBottom: 8 }}>AI TOOLS</div>
                          {r.tools.map(t => (
                            <div key={t} style={{ fontSize: 12, color: COLORS.text, marginBottom: 4, display: "flex", gap: 8 }}>
                              <span style={{ color: r.color }}>◆</span>{t}
                            </div>
                          ))}
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 2, marginBottom: 8 }}>PRODUCES</div>
                          {r.produces.map(p => (
                            <div key={p} style={{ fontSize: 12, color: COLORS.text, marginBottom: 4, display: "flex", gap: 8 }}>
                              <span style={{ color: r.color }}>→</span>{p}
                            </div>
                          ))}
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 2, marginBottom: 8 }}>CONSUMES</div>
                          {r.consumes.map(c => (
                            <div key={c} style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4, display: "flex", gap: 8 }}>
                              <span style={{ color: COLORS.textDim }}>←</span>{c}
                            </div>
                          ))}
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 2, marginBottom: 8 }}>TOP AI MOMENTS</div>
                          {r.aiMoments.map((m, i) => (
                            <div key={i} style={{ fontSize: 12, color: COLORS.text, marginBottom: 5, paddingLeft: 14, borderLeft: `2px solid ${r.color}50`, lineHeight: 1.4 }}>{m}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI TOOLCHAIN */}
        {activeNav === 2 && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[
                { tool: "GitHub Copilot", tier: "Enterprise Licensed", primaryRoles: "Dev, QA/QE", color: COLORS.blue, useCases: ["Inline code completion in VS Code / Visual Studio", "Test scaffolding from test-plan.md", "copilot-instructions.md for repo-level context", "Premium token budget — use for complex reasoning too"] },
                { tool: "Claude (claude.ai)", tier: "Browser — No Code Injection", primaryRoles: "BSA, QA/QE, Prod, Dev", color: COLORS.accent, useCases: ["Requirements drafting + self-review", "Complex business logic explanation", "Artifact generation (design.md, runbook.md)", "Regulatory text → structured requirements"] },
                { tool: "M365 Copilot", tier: "Enterprise O365 Tenant", primaryRoles: "BSA primarily", color: COLORS.purple, useCases: ["Meeting notes → action items", "Confluence / SharePoint document drafting", "Teams meeting summaries", "Email drafting for stakeholder comms"] },
                { tool: "JTMF / Jira", tier: "Test Management Platform", primaryRoles: "QA/QE", color: COLORS.amber, useCases: ["Structured test case storage (replacing Excel)", "TC-### traceability to requirements", "Test evidence linked to SharePoint", "AI-populate test cases from test-plan.md"] },
              ].map(t => (
                <div key={t.tool} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderTop: `3px solid ${t.color}`, borderRadius: 8, padding: "16px 18px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: t.color, fontFamily: "'IBM Plex Sans', sans-serif", marginBottom: 3 }}>{t.tool}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 10, display: "flex", gap: 10 }}>
                    <span>{t.tier}</span>
                    <span style={{ color: COLORS.border }}>|</span>
                    <span>Roles: {t.primaryRoles}</span>
                  </div>
                  {t.useCases.map((u, i) => (
                    <div key={i} style={{ fontSize: 12, color: COLORS.text, marginBottom: 5, display: "flex", gap: 8, lineHeight: 1.4 }}>
                      <span style={{ color: t.color, flexShrink: 0 }}>·</span>{u}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.amber}40`, borderLeft: `3px solid ${COLORS.amber}`, borderRadius: 6, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.amber, marginBottom: 6 }}>OSFI / DATA RESIDENCY NOTE</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6 }}>
                No customer data, counterparty data, or regulatory position data in AI prompts via browser tools. Enterprise tools (Copilot, M365) operate within bank tenant. Claude browser use: architecture, templates, reasoning — not live data. Validate any AI output before it enters regulated workflows (SA-CCR, CVA, FRTB).
              </div>
            </div>
          </div>
        )}

        {/* COMPOUND CHAIN */}
        {activeNav === 3 && (
          <div>
            <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 20 }}>
              The chain converts AI from additive (each role uses AI independently) to multiplicative (each step builds on the last). The artifact is the baton.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 24 }}>
              {chainSteps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 0 }}>
                  <div style={{ width: 3, background: i < chainSteps.length - 1 ? s.color : "transparent", alignSelf: "stretch", marginLeft: 20, marginRight: 0, borderRadius: 2 }} />
                  <div style={{
                    flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderLeft: `3px solid ${s.color}`, borderRadius: "0 8px 8px 0",
                    padding: "12px 16px", marginLeft: 8,
                    display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <div style={{ fontSize: 10, color: COLORS.textDim, minWidth: 18 }}>0{s.step}</div>
                    <div style={{ background: s.color + "20", border: `1px solid ${s.color}`, borderRadius: 4, padding: "2px 8px", fontSize: 10, color: s.color, minWidth: 36, textAlign: "center" }}>{s.role}</div>
                    <div style={{ minWidth: 130, fontSize: 12, color: s.color, fontWeight: 600 }}>{s.artifact}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, flex: 1, lineHeight: 1.4 }}>{s.desc}</div>
                    <div style={{ fontSize: 10, color: COLORS.textDim, whiteSpace: "nowrap" }}>{s.tool}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "18px 20px" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.textMuted, marginBottom: 14 }}>FEEDBACK LOOPS — THE REVERSE CHAIN</div>
              <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
                Compound engineering isn't purely forward. These reverse flows catch defects before they propagate.
              </p>
              {feedbackLoops.map((f, i) => (
                <div key={i} style={{ background: COLORS.bg, border: `1px solid ${f.color}40`, borderRadius: 6, padding: "12px 14px", marginBottom: 8, display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 180 }}>
                    <span style={{ fontSize: 11, color: f.color, fontWeight: 700 }}>{f.from}</span>
                    <span style={{ color: COLORS.textDim }}>←</span>
                    <span style={{ fontSize: 11, color: COLORS.textMuted }}>{f.to}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: f.color, marginBottom: 3 }}>{f.artifact}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHAMPIONS */}
        {activeNav === 4 && (
          <div>
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "18px 20px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.accent, marginBottom: 6 }}>FOUNDING PRINCIPLE</div>
              <div style={{ fontSize: 18, color: COLORS.text, fontFamily: "'IBM Plex Sans', sans-serif", fontStyle: "italic", lineHeight: 1.5 }}>
                "Central AI gives you the map. Your champion knows the terrain."
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {[
                { title: "What a Champion Is", items: ["Embedded within their role (BSA, Dev, QA, Prod)", "Primary contact for AI questions on the team", "Pilot new patterns before team-wide rollout", "Runs retros and surfaces what's working / not"], color: COLORS.accent },
                { title: "What a Champion Is Not", items: ["A prompt engineer or dedicated AI role", "A blocker — they accelerate, not gate", "Responsible for tool access or licensing", "A replacement for the central AI program"], color: COLORS.red },
                { title: "Champion Responsibilities", items: ["Own the prompt library for their role", "Run chain retros quarterly", "Submit ROI data to AVP monthly", "Onboard new team members to the chain", "Escalate enterprise blockers (tool access, policy)"], color: COLORS.blue },
                { title: "Champion Selection Criteria", items: ["Intrinsic curiosity about AI — not assigned", "Strong in their functional role first", "Communicates clearly across roles", "One champion per role minimum (BSA, Dev, QA, Prod)"], color: COLORS.purple },
              ].map(c => (
                <div key={c.title} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderTop: `3px solid ${c.color}`, borderRadius: 8, padding: "16px 18px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: c.color, marginBottom: 10, fontFamily: "'IBM Plex Sans', sans-serif" }}>{c.title}</div>
                  {c.items.map((item, i) => (
                    <div key={i} style={{ fontSize: 12, color: COLORS.text, marginBottom: 5, display: "flex", gap: 8, lineHeight: 1.4 }}>
                      <span style={{ color: c.color, flexShrink: 0 }}>·</span>{item}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "18px 20px" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.textMuted, marginBottom: 14 }}>CHAMPION CADENCE</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { freq: "Weekly", action: "Quick check-in: What's the AI win this sprint?", color: COLORS.accent },
                  { freq: "Monthly", action: "Submit ROI data + prompt library updates", color: COLORS.blue },
                  { freq: "Quarterly", action: "Chain retro — what compounded well, what broke?", color: COLORS.amber },
                  { freq: "Annually", action: "Operating model review — maturity level assessment", color: COLORS.purple },
                ].map(c => (
                  <div key={c.freq} style={{ background: COLORS.bg, border: `1px solid ${c.color}40`, borderRadius: 6, padding: "10px 14px", minWidth: 180 }}>
                    <div style={{ fontSize: 10, color: c.color, letterSpacing: 1, marginBottom: 4 }}>{c.freq.toUpperCase()}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.4 }}>{c.action}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* METRICS & GOVERNANCE */}
        {activeNav === 5 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.textMuted, marginBottom: 12 }}>KEY METRICS</div>
              <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 110px 80px", padding: "8px 16px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 10, color: COLORS.textDim, letterSpacing: 1 }}>
                  <span>METRIC</span><span>TARGET</span><span>CADENCE</span><span>TIER</span>
                </div>
                {metrics.map((m, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 110px 80px", padding: "10px 16px", borderBottom: i < metrics.length - 1 ? `1px solid ${COLORS.border}` : "none", fontSize: 12 }}>
                    <span style={{ color: COLORS.text }}>{m.label}</span>
                    <span style={{ color: COLORS.accent }}>{m.target}</span>
                    <span style={{ color: COLORS.textMuted }}>{m.cadence}</span>
                    <span style={{ color: { Quality: COLORS.blue, Adoption: COLORS.amber, Efficiency: COLORS.accent, Health: COLORS.purple }[m.tier] || COLORS.textMuted, fontSize: 10 }}>{m.tier}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.textMuted, marginBottom: 12 }}>GUARDRAILS BY CATEGORY</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {guardrails.map(g => (
                  <div key={g.category} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${g.color}`, borderRadius: 6, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: g.color, marginBottom: 8 }}>{g.category}</div>
                    {g.items.map((item, i) => (
                      <div key={i} style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4, display: "flex", gap: 8 }}>
                        <span style={{ color: COLORS.textDim }}>·</span>{item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "18px 20px" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.textMuted, marginBottom: 12 }}>QUARTERLY CHAIN RETRO — AGENDA</div>
              {[
                ["10 min", "What compounded well?", "Name 1–2 features where the chain strengthened output"],
                ["10 min", "Where did the chain break?", "Which role, artifact, or handoff was the weak link?"],
                ["10 min", "ROI snapshot", "Hours saved, traceability %, gap rate, Copilot accept rate"],
                ["10 min", "Next quarter action", "1 targeted change to the chain — specific, not vague"],
              ].map(([time, title, detail], i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${COLORS.border}` : "none" }}>
                  <div style={{ fontSize: 10, color: COLORS.textDim, minWidth: 48 }}>{time}</div>
                  <div>
                    <div style={{ fontSize: 12, color: COLORS.text, fontWeight: 600, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "12px 28px", display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.textDim }}>
        <span>Treasury Technology · AI Operating Model v1.0</span>
        <span style={{ color: COLORS.accent }}>Compound Engineering Framework</span>
      </div>
    </div>
  );
}
