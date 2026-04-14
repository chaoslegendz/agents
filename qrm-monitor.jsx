import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const PIPELINES = [
  {
    id: "qrm.pipeline.eod_risk",
    name: "QRM End-of-Day Risk",
    owner: "qrm_platform",
    tags: ["tier1", "regulatory", "FRTB"],
    slaDeadline: "21:30",
    slaStatus: "ON_TRACK",
    bufferMinutes: 38,
    businessDate: "2026-04-14",
    lastRun: { runId: "run-4821", status: "RUNNING", startTime: "18:02:11", durationSeconds: 5421 },
    steps: { complete: 4, running: 1, pending: 3, failed: 0 },
    estimatedCompletion: "20:47",
  },
  {
    id: "qrm.pipeline.var_calc",
    name: "VaR Calculation",
    owner: "market_risk",
    tags: ["tier1", "basel", "daily"],
    slaDeadline: "22:00",
    slaStatus: "AT_RISK",
    bufferMinutes: 12,
    businessDate: "2026-04-14",
    lastRun: { runId: "run-4822", status: "RUNNING", startTime: "18:45:00", durationSeconds: 3610 },
    steps: { complete: 2, running: 1, pending: 4, failed: 1 },
    estimatedCompletion: "21:51",
  },
  {
    id: "qrm.pipeline.sa_ccr",
    name: "SA-CCR Exposure",
    owner: "counterparty_risk",
    tags: ["tier1", "regulatory", "SA-CCR"],
    slaDeadline: "20:00",
    slaStatus: "MET",
    bufferMinutes: 0,
    businessDate: "2026-04-14",
    lastRun: { runId: "run-4818", status: "SUCCESS", startTime: "16:10:00", durationSeconds: 6823 },
    steps: { complete: 7, running: 0, pending: 0, failed: 0 },
    estimatedCompletion: "18:04",
  },
  {
    id: "qrm.pipeline.cva_run",
    name: "CVA / BA-CVA",
    owner: "xva_desk",
    tags: ["tier2", "CVA", "OTC"],
    slaDeadline: "23:00",
    slaStatus: "BREACHED",
    bufferMinutes: -18,
    businessDate: "2026-04-14",
    lastRun: { runId: "run-4820", status: "FAILED", startTime: "17:30:00", durationSeconds: 2910 },
    steps: { complete: 3, running: 0, pending: 2, failed: 2 },
    estimatedCompletion: null,
  },
  {
    id: "qrm.pipeline.bcbs239_lineage",
    name: "BCBS 239 Lineage",
    owner: "data_governance",
    tags: ["tier2", "BCBS239", "weekly"],
    slaDeadline: "09:00",
    slaStatus: "MET",
    bufferMinutes: 0,
    businessDate: "2026-04-14",
    lastRun: { runId: "run-4810", status: "SUCCESS", startTime: "07:01:00", durationSeconds: 3240 },
    steps: { complete: 5, running: 0, pending: 0, failed: 0 },
    estimatedCompletion: "07:55",
  },
];

const RUN_DETAIL = {
  runId: "run-4821",
  pipelineId: "qrm.pipeline.eod_risk",
  pipelineName: "QRM End-of-Day Risk",
  businessDate: "2026-04-14",
  status: "RUNNING",
  triggeredBy: "sp-scheduler-prod",
  triggerType: "SCHEDULE",
  gitSha: "a3f9c21",
  startTime: "18:02:11",
  steps: [
    {
      stepId: "extract_positions",
      name: "Extract Risk Positions",
      executor: "DATABRICKS",
      jobId: "dbs-job-2241",
      status: "SUCCEEDED",
      startTime: "18:02:15",
      endTime: "18:07:43",
      durationSeconds: 328,
      rowCount: 145230,
      bytesWritten: 48291023,
      retryAttempts: 0,
      depends: [],
    },
    {
      stepId: "extract_mktdata",
      name: "Extract Market Data",
      executor: "QRM",
      jobId: "qrm-etl-in-0091",
      status: "SUCCEEDED",
      startTime: "18:02:15",
      endTime: "18:09:01",
      durationSeconds: 406,
      rowCount: 892400,
      bytesWritten: 112048192,
      retryAttempts: 1,
      depends: [],
    },
    {
      stepId: "validate_positions",
      name: "DQ: Positions Gate",
      executor: "DATABRICKS",
      jobId: "dbs-job-2242",
      status: "SUCCEEDED",
      startTime: "18:07:45",
      endTime: "18:12:10",
      durationSeconds: 265,
      rowCount: 145230,
      bytesWritten: null,
      retryAttempts: 0,
      depends: ["extract_positions"],
    },
    {
      stepId: "validate_mktdata",
      name: "DQ: Market Data Gate",
      executor: "DATABRICKS",
      jobId: "dbs-job-2243",
      status: "SUCCEEDED",
      startTime: "18:09:03",
      endTime: "18:14:55",
      durationSeconds: 352,
      rowCount: 892400,
      bytesWritten: null,
      retryAttempts: 0,
      depends: ["extract_mktdata"],
    },
    {
      stepId: "qrm_compute",
      name: "QRM Risk Compute",
      executor: "QRM",
      jobId: "qrm-compute-0441",
      status: "RUNNING",
      startTime: "18:15:02",
      endTime: null,
      durationSeconds: null,
      rowCount: null,
      bytesWritten: null,
      retryAttempts: 0,
      depends: ["validate_positions", "validate_mktdata"],
    },
    {
      stepId: "load_results",
      name: "Load to Stage 3",
      executor: "AUTOSYS",
      jobId: "aut-load-risk-99",
      status: "PENDING",
      startTime: null,
      endTime: null,
      durationSeconds: null,
      rowCount: null,
      bytesWritten: null,
      retryAttempts: 0,
      depends: ["qrm_compute"],
    },
    {
      stepId: "publish_pnl",
      name: "Publish P&L Report",
      executor: "AUTOSYS",
      jobId: "aut-pub-pnl-12",
      status: "PENDING",
      startTime: null,
      endTime: null,
      durationSeconds: null,
      rowCount: null,
      bytesWritten: null,
      retryAttempts: 0,
      depends: ["load_results"],
    },
    {
      stepId: "sla_signal",
      name: "SLA Completion Signal",
      executor: "AUTOSYS",
      jobId: "aut-sla-sig-04",
      status: "PENDING",
      startTime: null,
      endTime: null,
      durationSeconds: null,
      rowCount: null,
      bytesWritten: null,
      retryAttempts: 0,
      depends: ["publish_pnl"],
    },
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fmtDuration = (s) => {
  if (!s) return "—";
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`;
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
};

const fmtBytes = (b) => {
  if (!b) return "—";
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  return `${(b / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const fmtRows = (n) => {
  if (!n) return "—";
  return n >= 1000000 ? `${(n / 1000000).toFixed(2)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n;
};

const now = () => {
  const d = new Date();
  return d.toLocaleTimeString("en-CA", { hour12: false });
};

// ─── STATUS CONFIGS ───────────────────────────────────────────────────────────

const STATUS_CFG = {
  SUCCEEDED: { color: "#22c55e", bg: "rgba(34,197,94,0.12)", label: "SUCCESS", dot: "#22c55e" },
  SUCCESS:   { color: "#22c55e", bg: "rgba(34,197,94,0.12)", label: "SUCCESS", dot: "#22c55e" },
  RUNNING:   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "RUNNING", dot: "#f59e0b", pulse: true },
  FAILED:    { color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "FAILED", dot: "#ef4444" },
  PENDING:   { color: "#64748b", bg: "rgba(100,116,139,0.10)", label: "PENDING", dot: "#64748b" },
};

const SLA_CFG = {
  ON_TRACK: { color: "#22c55e", label: "ON TRACK" },
  AT_RISK:  { color: "#f59e0b", label: "AT RISK" },
  MET:      { color: "#3b82f6", label: "MET" },
  BREACHED: { color: "#ef4444", label: "BREACHED" },
};

const EXEC_CFG = {
  QRM:        { color: "#a78bfa", bg: "rgba(167,139,250,0.15)", label: "QRM" },
  DATABRICKS: { color: "#fb923c", bg: "rgba(251,146,60,0.15)", label: "DATABRICKS" },
  AUTOSYS:    { color: "#38bdf8", bg: "rgba(56,189,248,0.15)", label: "AUTOSYS" },
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status, small }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.PENDING;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: small ? "2px 7px" : "3px 10px",
      borderRadius: 3, fontSize: small ? 10 : 11, fontWeight: 700,
      letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace",
      color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.color}33`,
    }}>
      <span style={{
        width: small ? 5 : 6, height: small ? 5 : 6, borderRadius: "50%",
        background: cfg.dot, flexShrink: 0,
        animation: cfg.pulse ? "pulse-dot 1.4s ease-in-out infinite" : "none",
      }} />
      {cfg.label}
    </span>
  );
}

// ─── EXECUTOR BADGE ───────────────────────────────────────────────────────────

function ExecBadge({ executor }) {
  const cfg = EXEC_CFG[executor] || { color: "#94a3b8", bg: "rgba(148,163,184,0.15)", label: executor };
  return (
    <span style={{
      padding: "2px 7px", borderRadius: 3, fontSize: 10, fontWeight: 700,
      letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace",
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}33`,
    }}>
      {cfg.label}
    </span>
  );
}

// ─── SLA BADGE ────────────────────────────────────────────────────────────────

function SlaBadge({ status }) {
  const cfg = SLA_CFG[status] || SLA_CFG.ON_TRACK;
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 2, fontSize: 10, fontWeight: 800,
      letterSpacing: "0.12em", fontFamily: "'JetBrains Mono', monospace",
      color: cfg.color, border: `1px solid ${cfg.color}55`,
    }}>
      {cfg.label}
    </span>
  );
}

// ─── STEP PROGRESS BAR ────────────────────────────────────────────────────────

function StepBar({ steps }) {
  const total = steps.complete + steps.running + steps.pending + steps.failed;
  return (
    <div style={{ display: "flex", gap: 1, height: 4, width: "100%", borderRadius: 2, overflow: "hidden" }}>
      {steps.failed > 0 && (
        <div style={{ flex: steps.failed, background: "#ef4444" }} />
      )}
      {steps.complete > 0 && (
        <div style={{ flex: steps.complete, background: "#22c55e" }} />
      )}
      {steps.running > 0 && (
        <div style={{ flex: steps.running, background: "#f59e0b", animation: "shimmer 1.5s ease-in-out infinite" }} />
      )}
      {steps.pending > 0 && (
        <div style={{ flex: steps.pending, background: "#334155" }} />
      )}
    </div>
  );
}

// ─── PIPELINE CARD ────────────────────────────────────────────────────────────

function PipelineCard({ pipeline, selected, onClick, role }) {
  const total = pipeline.steps.complete + pipeline.steps.running + pipeline.steps.pending + pipeline.steps.failed;
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? "rgba(248,250,252,0.04)" : "rgba(248,250,252,0.015)",
        border: selected ? "1px solid rgba(248,250,252,0.2)" : "1px solid rgba(248,250,252,0.07)",
        borderRadius: 6, padding: "14px 16px", cursor: "pointer",
        transition: "all 0.15s ease",
        boxShadow: selected ? "0 0 0 1px rgba(99,102,241,0.4) inset" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 3 }}>
            {pipeline.name}
          </div>
          <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
            {pipeline.id}
          </div>
        </div>
        <StatusBadge status={pipeline.lastRun.status} small />
      </div>

      <StepBar steps={pipeline.steps} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <SlaBadge status={pipeline.slaStatus} />
          {pipeline.slaStatus === "ON_TRACK" && (
            <span style={{ fontSize: 10, color: "#64748b" }}>+{pipeline.bufferMinutes}m buffer</span>
          )}
          {pipeline.slaStatus === "BREACHED" && (
            <span style={{ fontSize: 10, color: "#ef4444" }}>{Math.abs(pipeline.bufferMinutes)}m over</span>
          )}
          {pipeline.slaStatus === "AT_RISK" && (
            <span style={{ fontSize: 10, color: "#f59e0b" }}>{pipeline.bufferMinutes}m left</span>
          )}
        </div>
        <div style={{ fontSize: 10, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
          SLA {pipeline.slaDeadline}
        </div>
      </div>

      {(role === "PROD_SUPPORT" || role === "L3") && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(248,250,252,0.06)" }}>
          <span style={{ fontSize: 10, color: "#64748b" }}>
            ✓ {pipeline.steps.complete} · ▶ {pipeline.steps.running} · ◌ {pipeline.steps.pending}
            {pipeline.steps.failed > 0 && <span style={{ color: "#ef4444" }}> · ✗ {pipeline.steps.failed}</span>}
          </span>
        </div>
      )}

      {pipeline.tags && (
        <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
          {pipeline.tags.map(t => (
            <span key={t} style={{
              fontSize: 9, color: "#475569", padding: "1px 5px",
              border: "1px solid rgba(248,250,252,0.07)", borderRadius: 2,
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em",
            }}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DAG FLOW VIEW ────────────────────────────────────────────────────────────

function DagFlowView({ steps, onSelectStep, selectedStep }) {
  // Compute columns (topological levels)
  const levels = {};
  const assigned = new Set();

  const assignLevel = (stepId, visited = new Set()) => {
    if (levels[stepId] !== undefined) return levels[stepId];
    if (visited.has(stepId)) return 0;
    visited.add(stepId);
    const step = steps.find(s => s.stepId === stepId);
    if (!step || step.depends.length === 0) {
      levels[stepId] = 0;
      return 0;
    }
    const maxParent = Math.max(...step.depends.map(d => assignLevel(d, new Set(visited))));
    levels[stepId] = maxParent + 1;
    return levels[stepId];
  };

  steps.forEach(s => assignLevel(s.stepId));

  const maxLevel = Math.max(...Object.values(levels));
  const cols = Array.from({ length: maxLevel + 1 }, (_, i) =>
    steps.filter(s => levels[s.stepId] === i)
  );

  const NODE_W = 156;
  const NODE_H = 68;
  const COL_GAP = 64;
  const ROW_GAP = 14;

  const nodePos = {};
  cols.forEach((col, ci) => {
    const colH = col.length * NODE_H + (col.length - 1) * ROW_GAP;
    col.forEach((step, ri) => {
      nodePos[step.stepId] = {
        x: ci * (NODE_W + COL_GAP),
        y: ri * (NODE_H + ROW_GAP),
        colH,
      };
    });
  });

  const totalW = (maxLevel + 1) * (NODE_W + COL_GAP) - COL_GAP;
  const maxColH = Math.max(...cols.map(col =>
    col.length * NODE_H + (col.length - 1) * ROW_GAP
  ));

  // Center each column vertically
  cols.forEach((col, ci) => {
    const colH = col.length * NODE_H + (col.length - 1) * ROW_GAP;
    const offset = (maxColH - colH) / 2;
    col.forEach((step, ri) => {
      nodePos[step.stepId].y = offset + ri * (NODE_H + ROW_GAP);
    });
  });

  // Edges
  const edges = [];
  steps.forEach(step => {
    step.depends.forEach(dep => {
      const from = nodePos[dep];
      const to = nodePos[step.stepId];
      if (from && to) {
        const x1 = from.x + NODE_W;
        const y1 = from.y + NODE_H / 2;
        const x2 = to.x;
        const y2 = to.y + NODE_H / 2;
        const mx = (x1 + x2) / 2;
        edges.push({ from: dep, to: step.stepId, x1, y1, x2, y2, mx,
          color: STATUS_CFG[step.status]?.color || "#475569" });
      }
    });
  });

  return (
    <div style={{ overflowX: "auto", overflowY: "visible", paddingBottom: 8 }}>
      <div style={{ position: "relative", width: totalW + 24, height: maxColH + 24, minHeight: 200 }}>
        {/* SVG edges */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: totalW + 24, height: maxColH + 24, overflow: "visible", pointerEvents: "none" }}>
          {edges.map((e, i) => (
            <g key={i}>
              <path
                d={`M ${e.x1} ${e.y1} C ${e.mx} ${e.y1}, ${e.mx} ${e.y2}, ${e.x2} ${e.y2}`}
                fill="none"
                stroke={e.color}
                strokeWidth={1.5}
                strokeOpacity={0.35}
                strokeDasharray={e.color === "#64748b" ? "4 3" : "none"}
              />
              <circle cx={e.x2} cy={e.y2} r={3} fill={e.color} opacity={0.5} />
            </g>
          ))}
        </svg>

        {/* Nodes */}
        {steps.map(step => {
          const pos = nodePos[step.stepId];
          const cfg = STATUS_CFG[step.status] || STATUS_CFG.PENDING;
          const ecfg = EXEC_CFG[step.executor] || {};
          const isSelected = selectedStep?.stepId === step.stepId;

          return (
            <div
              key={step.stepId}
              onClick={() => onSelectStep(isSelected ? null : step)}
              style={{
                position: "absolute",
                left: pos.x, top: pos.y,
                width: NODE_W, height: NODE_H,
                background: isSelected ? "rgba(99,102,241,0.15)" : "rgba(15,23,42,0.9)",
                border: isSelected
                  ? "1.5px solid rgba(99,102,241,0.8)"
                  : `1.5px solid ${cfg.color}44`,
                borderRadius: 6, padding: "9px 11px",
                cursor: "pointer", boxSizing: "border-box",
                transition: "all 0.15s ease",
                backdropFilter: "blur(4px)",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0", marginBottom: 5,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {step.name}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <ExecBadge executor={step.executor} />
                <StatusBadge status={step.status} small />
              </div>
              {step.status === "RUNNING" && (
                <div style={{ marginTop: 6, height: 2, background: "#1e293b", borderRadius: 1, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: "40%", background: "#f59e0b",
                    animation: "progress-slide 1.5s ease-in-out infinite",
                  }} />
                </div>
              )}
              {step.status === "SUCCEEDED" && step.durationSeconds && (
                <div style={{ marginTop: 4, fontSize: 9, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
                  {fmtDuration(step.durationSeconds)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP DETAIL PANEL ────────────────────────────────────────────────────────

function StepDetailPanel({ step, onClose, role }) {
  if (!step) return null;

  const rows = [
    { label: "Step ID", value: step.stepId },
    { label: "Job ID", value: step.jobId },
    { label: "Executor", value: <ExecBadge executor={step.executor} /> },
    { label: "Status", value: <StatusBadge status={step.status} /> },
    { label: "Start Time", value: step.startTime || "—" },
    { label: "End Time", value: step.endTime || "—" },
    { label: "Duration", value: fmtDuration(step.durationSeconds) },
    { label: "Retry Attempts", value: step.retryAttempts ?? "—" },
    { label: "Row Count", value: fmtRows(step.rowCount) },
    { label: "Bytes Written", value: fmtBytes(step.bytesWritten) },
    { label: "Depends On", value: step.depends.length > 0 ? step.depends.join(", ") : "None" },
  ];

  return (
    <div style={{
      background: "#0b1422", border: "1px solid rgba(248,250,252,0.1)",
      borderRadius: 8, padding: "16px 18px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{step.name}</div>
          <div style={{ fontSize: 10, color: "#475569", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{step.stepId}</div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: "#64748b",
          fontSize: 16, cursor: "pointer", padding: "2px 6px",
        }}>✕</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map(row => (
          <div key={row.label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "6px 10px",
            background: "rgba(248,250,252,0.025)",
            borderRadius: 4,
          }}>
            <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
              {row.label}
            </span>
            <span style={{ fontSize: 11, color: "#cbd5e1", fontFamily: "'JetBrains Mono', monospace" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {role === "L3" && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 10, color: "#475569", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>
            EXECUTOR LOG (stub)
          </div>
          <div style={{
            background: "#060d1a", border: "1px solid rgba(248,250,252,0.07)",
            borderRadius: 4, padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: "#64748b", lineHeight: 1.8,
          }}>
            <div style={{ color: "#22c55e" }}>[18:15:02] Submitted to QRM compute endpoint</div>
            <div>[18:15:03] Job registered: qrm-compute-0441</div>
            <div>[18:15:18] Poll #1 → status=QUEUED</div>
            <div>[18:15:33] Poll #2 → status=RUNNING</div>
            <div>[18:15:48] Poll #3 → status=RUNNING · progress=12%</div>
            <div style={{ color: "#f59e0b" }}>[18:16:03] Poll #4 → status=RUNNING · progress=28%</div>
            <div style={{ color: "#94a3b8" }}>[18:16:18] ...</div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button style={{
              padding: "6px 14px", borderRadius: 4, fontSize: 11,
              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444", cursor: "pointer", fontWeight: 600,
            }}>Force Kill</button>
            <button style={{
              padding: "6px 14px", borderRadius: 4, fontSize: 11,
              background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)",
              color: "#f59e0b", cursor: "pointer", fontWeight: 600,
            }}>Retry Step</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STEP TIMELINE (LIST VIEW) ────────────────────────────────────────────────

function StepTimeline({ steps, onSelect, selected, role }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {steps.map((step, i) => {
        const cfg = STATUS_CFG[step.status] || STATUS_CFG.PENDING;
        const isSelected = selected?.stepId === step.stepId;
        return (
          <div
            key={step.stepId}
            onClick={() => onSelect(isSelected ? null : step)}
            style={{
              display: "grid", gridTemplateColumns: "28px 1fr auto auto",
              gap: "0 12px", alignItems: "center",
              padding: "8px 12px",
              background: isSelected ? "rgba(99,102,241,0.1)" : "rgba(248,250,252,0.02)",
              border: isSelected ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(248,250,252,0.05)",
              borderRadius: 5, cursor: "pointer", transition: "all 0.12s",
            }}
          >
            {/* Step number + status dot */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{
                width: 22, height: 22, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: cfg.bg, border: `1.5px solid ${cfg.color}55`,
                fontSize: 9, fontWeight: 700, color: cfg.color,
                fontFamily: "'JetBrains Mono', monospace",
              }}>{i + 1}</span>
              {i < steps.length - 1 && (
                <div style={{ width: 1, height: 10, background: "rgba(248,250,252,0.08)" }} />
              )}
            </div>

            {/* Name + executor */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{step.name}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
                <ExecBadge executor={step.executor} />
                {role !== "BUSINESS" && (
                  <span style={{ fontSize: 10, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
                    {step.jobId}
                  </span>
                )}
              </div>
            </div>

            {/* Duration */}
            <div style={{ textAlign: "right" }}>
              {step.durationSeconds ? (
                <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
                  {fmtDuration(step.durationSeconds)}
                </span>
              ) : step.status === "RUNNING" ? (
                <span style={{ fontSize: 10, color: "#f59e0b", fontFamily: "'JetBrains Mono', monospace", animation: "pulse-dot 1.4s ease-in-out infinite" }}>
                  running…
                </span>
              ) : null}
            </div>

            {/* Status */}
            <StatusBadge status={step.status} small />
          </div>
        );
      })}
    </div>
  );
}

// ─── SLA SUMMARY STRIP ────────────────────────────────────────────────────────

function SlaSummaryStrip({ pipelines }) {
  const counts = { MET: 0, ON_TRACK: 0, AT_RISK: 0, BREACHED: 0 };
  pipelines.forEach(p => counts[p.slaStatus]++);

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {[
        { key: "MET", label: "Met", color: "#3b82f6" },
        { key: "ON_TRACK", label: "On Track", color: "#22c55e" },
        { key: "AT_RISK", label: "At Risk", color: "#f59e0b" },
        { key: "BREACHED", label: "Breached", color: "#ef4444" },
      ].map(({ key, label, color }) => (
        <div key={key} style={{
          padding: "6px 14px", borderRadius: 5,
          background: "rgba(248,250,252,0.03)",
          border: `1px solid ${color}33`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        }}>
          <span style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
            {counts[key]}
          </span>
          <span style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.08em" }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function QrmMonitor() {
  const [role, setRole] = useState("PROD_SUPPORT");
  const [selectedPipeline, setSelectedPipeline] = useState(PIPELINES[0]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [view, setView] = useState("DAG"); // DAG | LIST
  const [filterExec, setFilterExec] = useState(null);
  const [clock, setClock] = useState(now());
  const [execFilter, setExecFilter] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setClock(now()), 1000);
    return () => clearInterval(t);
  }, []);

  const filteredSteps = execFilter
    ? RUN_DETAIL.steps.filter(s => s.executor === execFilter)
    : RUN_DETAIL.steps;

  return (
    <div style={{
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      background: "#060d1a",
      minHeight: "100vh",
      color: "#e2e8f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap');

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes shimmer {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        @keyframes progress-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(360%); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0b1422; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        button:hover { opacity: 0.85; }
      `}</style>

      {/* ── TOP NAV ── */}
      <div style={{
        borderBottom: "1px solid rgba(248,250,252,0.08)",
        background: "rgba(6,13,26,0.95)",
        backdropFilter: "blur(8px)",
        position: "sticky", top: 0, zIndex: 100,
        padding: "0 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, color: "#fff",
              }}>Q</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.01em" }}>
                  QRM Orchestration Monitor
                </div>
                <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace" }}>
                  TREASURY TECHNOLOGY · PROD
                </div>
              </div>
            </div>

            <div style={{ width: 1, height: 28, background: "rgba(248,250,252,0.08)" }} />

            {/* Business date */}
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
              BIZ DATE: <span style={{ color: "#94a3b8" }}>2026-04-14</span>
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Role switcher */}
            <div style={{ display: "flex", background: "rgba(248,250,252,0.04)", borderRadius: 5, padding: 2, gap: 1 }}>
              {["BUSINESS", "PROD_SUPPORT", "L3"].map(r => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setSelectedStep(null); }}
                  style={{
                    padding: "4px 10px", borderRadius: 4, border: "none",
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
                    cursor: "pointer", transition: "all 0.12s",
                    background: role === r ? "rgba(99,102,241,0.3)" : "transparent",
                    color: role === r ? "#a5b4fc" : "#475569",
                  }}
                >
                  {r === "PROD_SUPPORT" ? "PROD SUP" : r}
                </button>
              ))}
            </div>

            {/* Clock */}
            <div style={{
              fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
              color: "#475569", padding: "3px 8px",
              border: "1px solid rgba(248,250,252,0.07)", borderRadius: 4,
            }}>
              {clock}
            </div>

            {/* Refresh indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#22c55e",
                animation: "pulse-dot 2s ease-in-out infinite",
              }} />
              <span style={{ fontSize: 10, color: "#475569" }}>LIVE</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "310px 1fr", minHeight: "calc(100vh - 52px)" }}>

        {/* ── LEFT SIDEBAR: PIPELINE LIST ── */}
        <div style={{
          borderRight: "1px solid rgba(248,250,252,0.07)",
          background: "rgba(6,13,26,0.5)",
          padding: "16px 12px", display: "flex", flexDirection: "column", gap: 10,
          overflowY: "auto",
        }}>
          {/* SLA Summary */}
          <div>
            <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 8 }}>
              SLA SUMMARY · BATCH {">"}18:00
            </div>
            <SlaSummaryStrip pipelines={PIPELINES} />
          </div>

          <div style={{ height: 1, background: "rgba(248,250,252,0.06)" }} />

          {/* Pipeline list */}
          <div>
            <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 8 }}>
              PIPELINES · {PIPELINES.length} ACTIVE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {PIPELINES.map(p => (
                <PipelineCard
                  key={p.id}
                  pipeline={p}
                  selected={selectedPipeline?.id === p.id}
                  onClick={() => { setSelectedPipeline(p); setSelectedStep(null); }}
                  role={role}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN AREA ── */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>

          {selectedPipeline && (
            <>
              {/* Run Header */}
              <div style={{
                background: "rgba(248,250,252,0.02)", border: "1px solid rgba(248,250,252,0.08)",
                borderRadius: 8, padding: "14px 18px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>
                      {selectedPipeline.name}
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <StatusBadge status={selectedPipeline.lastRun.status} />
                      <SlaBadge status={selectedPipeline.slaStatus} />
                      {role !== "BUSINESS" && (
                        <>
                          <span style={{ fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
                            {RUN_DETAIL.runId}
                          </span>
                          <span style={{ fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
                            git:{RUN_DETAIL.gitSha}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      {[
                        { label: "START", value: selectedPipeline.lastRun.startTime },
                        { label: "SLA DEADLINE", value: selectedPipeline.slaDeadline },
                        { label: "EST COMPLETE", value: selectedPipeline.estimatedCompletion || "—" },
                        { label: "TRIGGER", value: RUN_DETAIL.triggerType },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em", marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#94a3b8" }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step progress bar */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: "#475569" }}>
                      Step progress: {selectedPipeline.steps.complete} of {
                        selectedPipeline.steps.complete + selectedPipeline.steps.running + selectedPipeline.steps.pending + selectedPipeline.steps.failed
                      } complete
                    </span>
                    {selectedPipeline.slaStatus === "ON_TRACK" && (
                      <span style={{ fontSize: 10, color: "#22c55e" }}>+{selectedPipeline.bufferMinutes}m SLA buffer</span>
                    )}
                    {selectedPipeline.slaStatus === "BREACHED" && (
                      <span style={{ fontSize: 10, color: "#ef4444" }}>SLA breached by {Math.abs(selectedPipeline.bufferMinutes)}m</span>
                    )}
                    {selectedPipeline.slaStatus === "AT_RISK" && (
                      <span style={{ fontSize: 10, color: "#f59e0b" }}>Only {selectedPipeline.bufferMinutes}m of SLA buffer remaining</span>
                    )}
                  </div>
                  <div style={{ height: 6, background: "#0f172a", borderRadius: 3, overflow: "hidden" }}>
                    <StepBar steps={selectedPipeline.steps} />
                  </div>
                </div>
              </div>

              {/* Executor filter + View toggle */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#475569", letterSpacing: "0.08em" }}>EXECUTOR</span>
                  {[null, "QRM", "DATABRICKS", "AUTOSYS"].map(e => {
                    const ecfg = e ? EXEC_CFG[e] : null;
                    return (
                      <button
                        key={e || "ALL"}
                        onClick={() => setExecFilter(e)}
                        style={{
                          padding: "3px 10px", borderRadius: 4, border: "none",
                          fontSize: 10, fontWeight: 700, cursor: "pointer",
                          letterSpacing: "0.07em",
                          background: execFilter === e
                            ? (ecfg ? ecfg.bg : "rgba(248,250,252,0.1)")
                            : "rgba(248,250,252,0.03)",
                          color: execFilter === e
                            ? (ecfg ? ecfg.color : "#e2e8f0")
                            : "#475569",
                          border: execFilter === e
                            ? `1px solid ${ecfg ? ecfg.color + "55" : "rgba(248,250,252,0.2)"}`
                            : "1px solid rgba(248,250,252,0.07)",
                        }}
                      >
                        {e || "ALL"}
                      </button>
                    );
                  })}
                </div>

                {/* View toggle */}
                <div style={{ display: "flex", background: "rgba(248,250,252,0.04)", borderRadius: 5, padding: 2, gap: 1 }}>
                  {["DAG", "LIST"].map(v => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      style={{
                        padding: "4px 12px", borderRadius: 3, border: "none",
                        fontSize: 10, fontWeight: 700, cursor: "pointer",
                        background: view === v ? "rgba(248,250,252,0.1)" : "transparent",
                        color: view === v ? "#e2e8f0" : "#475569",
                      }}
                    >
                      {v === "DAG" ? "⬡ FLOW" : "≡ LIST"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main view area */}
              <div style={{ display: "grid", gridTemplateColumns: selectedStep ? "1fr 320px" : "1fr", gap: 16 }}>
                {/* DAG or LIST */}
                <div style={{
                  background: "rgba(248,250,252,0.015)", border: "1px solid rgba(248,250,252,0.07)",
                  borderRadius: 8, padding: "18px",
                }}>
                  <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 14 }}>
                    {view === "DAG" ? "JOB DEPENDENCY FLOW" : "STEP SEQUENCE"}
                    {execFilter && <span style={{ color: EXEC_CFG[execFilter]?.color }}> · FILTERED: {execFilter}</span>}
                  </div>

                  {view === "DAG" ? (
                    <DagFlowView
                      steps={filteredSteps}
                      onSelectStep={setSelectedStep}
                      selectedStep={selectedStep}
                    />
                  ) : (
                    <StepTimeline
                      steps={filteredSteps}
                      onSelect={setSelectedStep}
                      selected={selectedStep}
                      role={role}
                    />
                  )}
                </div>

                {/* Step detail panel */}
                {selectedStep && (
                  <StepDetailPanel
                    step={selectedStep}
                    onClose={() => setSelectedStep(null)}
                    role={role}
                  />
                )}
              </div>

              {/* L3 / Prod Support: audit footer */}
              {(role === "L3" || role === "PROD_SUPPORT") && (
                <div style={{
                  background: "rgba(248,250,252,0.015)", border: "1px solid rgba(248,250,252,0.07)",
                  borderRadius: 8, padding: "12px 16px",
                  display: "flex", gap: 24, alignItems: "center",
                }}>
                  <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.08em" }}>AUDIT</div>
                  {[
                    { label: "Triggered By", value: RUN_DETAIL.triggeredBy },
                    { label: "Trigger Type", value: RUN_DETAIL.triggerType },
                    { label: "Git SHA", value: RUN_DETAIL.gitSha },
                    { label: "Business Date", value: RUN_DETAIL.businessDate },
                    { label: "Run ID", value: RUN_DETAIL.runId },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.09em" }}>{label}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
