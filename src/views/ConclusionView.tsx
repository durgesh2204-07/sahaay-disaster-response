import React, { useState } from 'react';
import {
  EIGHT_MEASUREMENT_PARAMETERS,
  FIVE_CORE_RESPONSE_DIMENSIONS,
  CAPABILITY_COMPARISON_MATRIX,
  FIVE_OUTCOME_CARDS,
  PIPELINE_STEPS,
  CONCLUSION_DATA,
  GRAPH_5_CORE_DIMENSIONS,
  GRAPH_8_PARAMETERS,
  CapabilityComparisonDataPoint,
} from '../data/conclusionData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from 'recharts';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Compass,
  AlertTriangle,
  Radio,
  FileText,
  MapPin,
  HeartHandshake,
  CloudRain,
  Smartphone,
  Package,
  Layers,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Info,
  Building2,
  Users,
  BarChart3,
} from 'lucide-react';

interface ConclusionViewProps {
  setCurrentTab: (tab: string) => void;
}

export const ConclusionView: React.FC<ConclusionViewProps> = ({ setCurrentTab }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'key_advantages'>('all');
  const [showVivaTip, setShowVivaTip] = useState<boolean>(true);
  const [graphDataset, setGraphDataset] = useState<'5_dimensions' | '8_parameters'>('5_dimensions');

  const activeGraphData: CapabilityComparisonDataPoint[] =
    graphDataset === '5_dimensions' ? GRAPH_5_CORE_DIMENSIONS : GRAPH_8_PARAMETERS;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 pt-6 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ========================================================================= */}
        {/* 1. TOP HEADER                                                             */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-black uppercase tracking-wider border border-teal-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>PROJECT EVALUATION & COMPARATIVE ANALYSIS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 font-['Outfit'] tracking-tight">
            SAHAAY — Impact & Comparative Analysis
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            A comprehensive, defensible review of how SAHAAY addresses critical disaster response bottlenecks by unifying citizens, volunteers, and municipal authorities into a single workflow.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 2. SECTION: PROPER COMPARISON GRAPH & 5 CORE RESPONSE DIMENSIONS          */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold mb-1">
                <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
                <span>Capability Comparison Graph</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
                {CONCLUSION_DATA.graphHeading}
              </h2>
              <p className="text-sm text-teal-800 font-bold mt-0.5">
                &gt; {CONCLUSION_DATA.graphSubtitle}
              </p>
            </div>

            {/* Toggle between 5 Core Dimensions and 8 Operational Parameters */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setGraphDataset('5_dimensions')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  graphDataset === '5_dimensions'
                    ? 'bg-white text-teal-900 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                5 Core Dimensions
              </button>
              <button
                onClick={() => setGraphDataset('8_parameters')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  graphDataset === '8_parameters'
                    ? 'bg-white text-teal-900 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                8 Parameters
              </button>
            </div>
          </div>

          {/* Clean Graph Legend with Red & Green Solution indicators */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-red-500 shadow-2xs"></span>
                <span className="font-bold text-slate-800">Existing Solution</span>
                <span className="text-[10px] text-red-600 font-semibold hidden sm:inline">(Siloed / Phone-based / Manual)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-2xs"></span>
                <span className="font-black text-slate-900">Our Solution (SAHAAY)</span>
                <span className="text-[10px] text-emerald-700 font-semibold hidden sm:inline">(Unified Real-Time Platform)</span>
              </div>
            </div>

            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Comparison Metric: Efficiency &amp; Coverage (%)
            </span>
          </div>

          {/* THE PROPER GRAPH CONTAINER */}
          <div className="w-full h-88 sm:h-96 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activeGraphData}
                margin={{ top: 25, right: 15, left: 5, bottom: 25 }}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  tick={{ fill: '#1e293b', fontSize: 11, fontWeight: 700 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(val: number) => `${val}%`}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  width={55}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as CapabilityComparisonDataPoint;
                      return (
                        <div className="bg-slate-950 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-2.5 max-w-xs z-50">
                          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                            <span className="text-lg">{data.icon}</span>
                            <span className="font-black text-sm font-['Outfit'] text-white">
                              {data.dimension}
                            </span>
                          </div>

                          <div className="space-y-2 text-[11px]">
                            {/* Existing Solution - Red */}
                            <div className="p-2 rounded-xl bg-red-950/40 border border-red-800/40 space-y-0.5">
                              <div className="flex items-center justify-between font-bold text-red-300">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                  <span>Existing Solution:</span>
                                </div>
                                <span className="font-black text-red-400 bg-red-900/60 px-1.5 py-0.2 rounded">
                                  {data.existingSolution}%
                                </span>
                              </div>
                              <p className="text-slate-300 pl-4 leading-snug">{data.existingLabel}</p>
                            </div>

                            {/* Our Solution - Green */}
                            <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 space-y-0.5">
                              <div className="flex items-center justify-between font-bold text-emerald-300">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                  <span>Our Solution (SAHAAY):</span>
                                </div>
                                <span className="font-black text-emerald-300 bg-emerald-900/60 px-1.5 py-0.2 rounded">
                                  {data.ourSolution}%
                                </span>
                              </div>
                              <p className="text-emerald-100 pl-4 font-medium leading-snug">{data.ourLabel}</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Red Bar for Existing Solution */}
                <Bar
                  dataKey="existingSolution"
                  name="Existing Solution"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                >
                  <LabelList
                    dataKey="existingSolution"
                    position="top"
                    formatter={(val: any) => `${val}%`}
                    style={{ fill: '#b91c1c', fontSize: '11px', fontWeight: 700 }}
                  />
                </Bar>
                {/* Green Bar for Our Solution (SAHAAY) */}
                <Bar
                  dataKey="ourSolution"
                  name="Our Solution (SAHAAY)"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                >
                  <LabelList
                    dataKey="ourSolution"
                    position="top"
                    formatter={(val: any) => `${val}%`}
                    style={{ fill: '#047857', fontSize: '11px', fontWeight: 800 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 5 CORE RESPONSE DIMENSION CARDS */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-3">
              Core Response Dimensions Breakdown
            </span>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
              {FIVE_CORE_RESPONSE_DIMENSIONS.map((dim) => (
                <div
                  key={dim.id}
                  className="bg-slate-50/80 hover:bg-teal-50/40 p-4 rounded-2xl border border-slate-200/80 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                      {dim.number}
                    </span>
                    <span className="text-xl" role="img" aria-label={dim.title}>
                      {dim.icon}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 font-['Outfit'] group-hover:text-teal-900 transition-colors">
                      {dim.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      {dim.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Built Feature</span>
                    <span className="text-[11px] font-medium text-teal-900 block leading-tight mt-0.5">
                      {dim.keyFeature}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SECTION: "WHAT SAHAAY BRINGS TOGETHER" PIPELINE                       */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-800/60 space-y-4 text-center">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-teal-300 font-mono block">
              OPERATIONAL WORKFLOW
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] mt-1 text-white">
              What SAHAAY Brings Together
            </h3>
          </div>

          {/* Thin horizontal pipeline visual */}
          <div className="pt-3 pb-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {PIPELINE_STEPS.map((item, idx) => (
              <React.Fragment key={item.step}>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 border border-teal-500/30 text-xs font-black font-mono text-teal-200 shadow-sm">
                  <span>{item.icon}</span>
                  <span className="tracking-wider">{item.step}</span>
                </div>
                {idx < PIPELINE_STEPS.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-teal-400 shrink-0 hidden sm:inline-block" />
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="text-sm sm:text-base font-bold text-teal-100/90 font-['Outfit'] pt-1 italic">
            “{CONCLUSION_DATA.pipelineSubtitle}”
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 4. SECTION: CAPABILITY COMPARISON MATRIX                                  */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold mb-1">
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span>Documented Capabilities vs. Researched Platforms</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
                Capability Comparison Matrix
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                Comparing documented functional capabilities across specialized crisis solutions and SAHAAY.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Capabilities (10)
              </button>
              <button
                onClick={() => setActiveFilter('key_advantages')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeFilter === 'key_advantages'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unique to SAHAAY
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs font-black text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-3 w-64">Disaster Response Capability</th>
                  <th className="py-3 px-3 text-center">112 ERSS<br/><span className="text-[10px] font-normal text-slate-600 normal-case">(Emergency Police/Fire/Ambulance)</span></th>
                  <th className="py-3 px-3 text-center">SACHET<br/><span className="text-[10px] font-normal text-slate-600 normal-case">(NDMA Alert Portal)</span></th>
                  <th className="py-3 px-3 text-center">Ushahidi<br/><span className="text-[10px] font-normal text-slate-600 normal-case">(Crowd Crisis Map)</span></th>
                  <th className="py-3 px-3 text-center">NGO / Social Sheets<br/><span className="text-[10px] font-normal text-slate-600 normal-case">(Dispersed Groups)</span></th>
                  <th className="py-3 px-3 text-center bg-teal-50 rounded-t-xl text-teal-900 border-x border-teal-200 font-extrabold">SAHAAY<br/><span className="text-[10px] text-teal-700 font-bold normal-case">(Unified Platform)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {CAPABILITY_COMPARISON_MATRIX.filter((row) =>
                  activeFilter === 'all' ? true : row.sahaay === 'yes' && (row.erss112 === 'no' || row.sachetNdma === 'no')
                ).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      <div>{row.capability}</div>
                      <div className="text-[10px] font-normal text-slate-600 mt-0.5">{row.note}</div>
                    </td>

                    {/* 112 ERSS */}
                    <td className="py-3 px-3 text-center">
                      <CapabilityBadge status={row.erss112} />
                    </td>

                    {/* SACHET */}
                    <td className="py-3 px-3 text-center">
                      <CapabilityBadge status={row.sachetNdma} />
                    </td>

                    {/* Ushahidi */}
                    <td className="py-3 px-3 text-center">
                      <CapabilityBadge status={row.ushahidi} />
                    </td>

                    {/* NGO / Standalone */}
                    <td className="py-3 px-3 text-center">
                      <CapabilityBadge status={row.standaloneNgo} />
                    </td>

                    {/* SAHAAY */}
                    <td className="py-3 px-3 text-center bg-teal-50/50 border-x border-teal-200">
                      <CapabilityBadge status={row.sahaay} isHighlight />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span><strong>✓ Native</strong> = Fully integrated out-of-the-box</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span><strong>Limited / Varies</strong> = Fragmented or requires manual third-party tools</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span><strong>✗ Not Available</strong> = Out-of-scope for platform</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-600 italic">
              Defensible comparative model based on documented system architectures.
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. SECTION: THE 8 MEANINGFUL PARAMETERS                                   */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Standardized Evaluation Criteria</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
              8 Core Evaluation Parameters
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              Measurable, clear-meaning parameters that directly evaluate real crisis performance without unsupported numbers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {EIGHT_MEASUREMENT_PARAMETERS.map((param) => (
              <div
                key={param.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-teal-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label={param.name}>
                    {param.icon}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 font-['Outfit']">
                    {param.name}
                  </h3>
                </div>

                <div className="text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    What you measure:
                  </span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {param.whatYouMeasure}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/70 space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-rose-600 font-bold block">Legacy Bottleneck:</span>
                    <span className="text-slate-500">{param.traditionalMethod}</span>
                  </div>
                  <div>
                    <span className="text-teal-700 font-extrabold block">SAHAAY Solution:</span>
                    <span className="text-slate-800 font-medium">{param.sahaayAdvantage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. SECTION: 5 OUTCOME CARDS                                               */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
              Core Response Outcomes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              High-level capabilities and benefits delivered by the SAHAAY architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {FIVE_OUTCOME_CARDS.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:border-teal-400 hover:shadow-md transition-all space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl" role="img" aria-label={card.title}>
                      {card.icon}
                    </span>
                    <span className="text-xs font-mono font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {card.number}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 font-['Outfit']">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {card.outcomeText}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 italic">
                  {card.technicalSubtext}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 7. SECTION: SAHAAY APPLICATION PREVIEW (INTERACTIVE UI PREVIEW)           */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold mb-1">
                <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                <span>Live System Integration</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
                📱 SAHAAY Application Preview
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                Test each functional module directly in the application to demonstrate live execution.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-100 px-3 py-1 rounded-xl self-start sm:self-auto">
              Interactive Testbed Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Citizen Emergency SOS */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">Module 01</span>
                <h4 className="text-sm font-black text-slate-900 font-['Outfit']">
                  Incident Reporting (SOS)
                </h4>
                <p className="text-xs text-slate-600 leading-snug">
                  1-tap emergency reports with photo evidence, live reverse geocoded GPS coordinates, and offline caching.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('citizen_dashboard')}
                className="w-full text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              >
                <span>Open Citizen Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Interactive GIS Danger Map */}
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700">Module 02</span>
                <h4 className="text-sm font-black text-slate-900 font-['Outfit']">
                  Situation Awareness (GIS)
                </h4>
                <p className="text-xs text-slate-600 leading-snug">
                  Leaflet geospatial map layering live incident markers, hazard polygons, evacuation centers, and responder routes.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('community_map')}
                className="w-full text-xs font-extrabold bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              >
                <span>Open Danger Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. Shelter & QR Bed Pass */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Module 03</span>
                <h4 className="text-sm font-black text-slate-900 font-['Outfit']">
                  Shelter Resource Booking
                </h4>
                <p className="text-xs text-slate-600 leading-snug">
                  Live occupancy counts for municipal shelters with automated QR pass generation for immediate family check-in.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('shelters')}
                className="w-full text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              >
                <span>Open Shelter Finder</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4. Volunteer & Relief Logistics */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">Module 04</span>
                <h4 className="text-sm font-black text-slate-900 font-['Outfit']">
                  Response Coordination
                </h4>
                <p className="text-xs text-slate-600 leading-snug">
                  Connects citizen requests with field volunteers for ration packages, first aid, and medical transport dispatch.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('requests')}
                className="w-full text-xs font-extrabold bg-amber-700 hover:bg-amber-800 text-white py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              >
                <span>Open Relief Logistics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 8. SECTION: VIVA / PROJECT REVIEW DEFENSE GUIDE                           */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-teal-800/60 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-teal-800/60 pb-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-black font-['Outfit'] text-white">
                Project Defense & Viva Guide
              </h3>
            </div>
            <button
              onClick={() => setShowVivaTip(!showVivaTip)}
              className="text-xs text-teal-300 hover:text-white cursor-pointer font-bold"
            >
              {showVivaTip ? 'Hide Reference' : 'Show Reference'}
            </button>
          </div>

          {showVivaTip && (
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-teal-500/20 space-y-1.5">
                <span className="text-[11px] font-bold text-teal-400 block uppercase tracking-wider">
                  Question: {CONCLUSION_DATA.vivaQuestion}
                </span>
                <p className="text-slate-100 font-medium italic">
                  {CONCLUSION_DATA.vivaAnswer}
                </p>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                💡 <em>Examiner Note:</em> Framing the comparison around unified multi-role workflow capabilities is statistically and academically sound, avoiding unsupported arbitrary numerical scorecards.
              </p>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 9. SECTION: BOTTOM LINE & FUTURE INTEGRATIONS                             */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-teal-900 text-white p-6 sm:p-8 text-center space-y-3 shadow-md border border-teal-800">
          <span className="text-xs font-black uppercase tracking-widest text-teal-300 font-mono">
            SAHAAY
          </span>
          <p className="text-base sm:text-lg md:text-xl font-black font-['Outfit'] text-white max-w-3xl mx-auto leading-snug">
            “{CONCLUSION_DATA.tagline}”
          </p>

          {/* Small Future-ready line */}
          <div className="pt-2 border-t border-teal-800/70 text-xs text-teal-200 font-medium">
            <span>{CONCLUSION_DATA.futureReadyText}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

interface CapabilityBadgeProps {
  status: 'yes' | 'partial' | 'no' | 'varies';
  isHighlight?: boolean;
}

const CapabilityBadge: React.FC<CapabilityBadgeProps> = ({ status, isHighlight }) => {
  if (status === 'yes') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-black ${
          isHighlight
            ? 'bg-teal-700 text-white shadow-2xs'
            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
        }`}
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-300 shrink-0" />
        <span>✓ Supported</span>
      </span>
    );
  }

  if (status === 'partial') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
        <span>Limited</span>
      </span>
    );
  }

  if (status === 'varies') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        <span>Varies</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-400">
      <span>✗ Not Available</span>
    </span>
  );
};
