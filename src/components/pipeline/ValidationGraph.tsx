import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Info,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface GraphNode {
  id: string;
  category: 'document' | 'extraction' | 'rule' | 'result';
  title: string;
  subtitle: string;
  status: 'pass' | 'fail' | 'attention' | 'neutral';
  detail?: string;
  targetField?: string;
}

export const ValidationGraph: React.FC = () => {
  const { activeApplication, navigateToApplication } = useApp();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const isCorrection = activeApplication.status === 'correction_required';

  const documentNodes: GraphNode[] = [
    {
      id: 'doc_pan',
      category: 'document',
      title: 'PAN Card Scan',
      subtitle: 'rahul_pan_card_front.pdf (97% OCR)',
      status: 'pass',
      detail: 'Cryptographic document scan ingested with 97% optical confidence score.',
    },
    {
      id: 'doc_addr',
      category: 'document',
      title: 'Address Proof',
      subtitle: isCorrection ? 'Damaged Utility Scan (22% OCR)' : 'BESCOM Utility Bill (99% OCR)',
      status: isCorrection ? 'fail' : 'pass',
      detail: isCorrection
        ? 'Original scan blurred. Optical confidence floor breached (22% vs 85% required).'
        : 'Replacement electricity bill verified with 99% optical recognition.',
      targetField: 'documents.address_proof',
    },
    {
      id: 'doc_id',
      category: 'document',
      title: 'National Identity Proof',
      subtitle: 'identity_verification_card.pdf',
      status: 'pass',
      detail: 'Aadhaar / National ID verified and matching registry checksum.',
    },
  ];

  const extractionNodes: GraphNode[] = [
    {
      id: 'ext_pan',
      category: 'extraction',
      title: 'Extract PAN Number',
      subtitle: 'Value: "ABCDE1234F"',
      status: 'pass',
      detail: 'Extracted with 99% confidence from top tax code sector.',
    },
    {
      id: 'ext_name',
      category: 'extraction',
      title: 'Extract Legal Name',
      subtitle: 'Value: "Rahul K. Sharma"',
      status: 'pass',
      detail: 'Extracted full legal name including middle initial "K."',
    },
    {
      id: 'ext_addr',
      category: 'extraction',
      title: 'Extract Premises Text',
      subtitle: isCorrection ? 'Failed (Illegible Scan)' : 'Suite 402, Innovate Tower',
      status: isCorrection ? 'fail' : 'pass',
      detail: isCorrection ? 'OCR engine could not parse text tokens.' : 'Premises address matched application record.',
    },
  ];

  const ruleNodes: GraphNode[] = [
    {
      id: 'rule_format',
      category: 'rule',
      title: 'PAN Format Rule',
      subtitle: 'RULE_PAN_FORMAT_001',
      status: 'pass',
      detail: 'Alphanumeric regex check: 5 uppercase + 4 digits + 1 uppercase letter passed.',
    },
    {
      id: 'rule_name_consistency',
      category: 'rule',
      title: 'Cross-Name Consistency',
      subtitle: 'RULE_NAME_MATCH_001',
      status: isCorrection ? 'fail' : 'pass',
      detail: isCorrection
        ? 'Levenshtein similarity 0.86 below 0.92 floor ("Rahul Sharma" vs "Rahul K. Sharma").'
        : 'Name discrepancy resolved. 100% string alignment verified.',
      targetField: 'applicantName',
    },
    {
      id: 'rule_mandatory_addr',
      category: 'rule',
      title: 'Address Mandatory Check',
      subtitle: 'RULE_ADDR_PROOF_002',
      status: isCorrection ? 'fail' : 'pass',
      detail: isCorrection
        ? 'Mandatory address proof requirement failed due to unreadable document.'
        : 'Valid proof uploaded and verified.',
      targetField: 'documents.address_proof',
    },
  ];

  const resultNodes: GraphNode[] = [
    {
      id: 'res_1',
      category: 'result',
      title: 'Format Verification',
      subtitle: 'PASS ✓',
      status: 'pass',
      detail: 'Tax and identification formats comply with MCA guidelines.',
    },
    {
      id: 'res_2',
      category: 'result',
      title: 'Consistency Result',
      subtitle: isCorrection ? 'CORRECTION REQUIRED ⚠' : 'PASS ✓',
      status: isCorrection ? 'fail' : 'pass',
      detail: isCorrection ? 'Middle initial mismatch requires applicant confirmation.' : 'Cross-document consistency passed.',
    },
    {
      id: 'res_3',
      category: 'result',
      title: 'Document Completeness',
      subtitle: isCorrection ? 'ACTION NEEDED ✗' : 'PASS ✓',
      status: isCorrection ? 'fail' : 'pass',
      detail: isCorrection ? 'Missing valid address proof.' : 'All mandatory document proofs in place.',
    },
  ];

  const getNodeBadge = (status: GraphNode['status']) => {
    switch (status) {
      case 'pass':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">PASS</span>;
      case 'fail':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">FAIL</span>;
      case 'attention':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">ATTENTION</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">READY</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Interactive Validation Graph
            </h2>
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              {activeApplication.id}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            End-to-end topological execution path: Document Intake → Optical Extraction → Rule Engine → Decision Result.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigateToApplication(activeApplication.id, 'correction_workspace')}
          >
            Fix in Workspace
          </Button>
        </div>
      </div>

      {/* Main Graph Canvas */}
      <Card className="p-6 bg-slate-950 text-white border-slate-800 shadow-2xl overflow-x-auto">
        <div className="min-w-[900px] space-y-8">
          {/* Column Headers */}
          <div className="grid grid-cols-4 gap-6 pb-3 border-b border-slate-800 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>1. Ingested Documents</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>2. Optical Extraction</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>3. Validation Rules</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>4. Execution Result</span>
            </div>
          </div>

          {/* Node Grid Columns */}
          <div className="grid grid-cols-4 gap-6 items-start">
            {/* Column 1: Documents */}
            <div className="space-y-4">
              {documentNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedNode?.id === node.id
                      ? 'border-blue-500 bg-blue-950/80 ring-2 ring-blue-500/40 shadow-lg'
                      : node.status === 'fail'
                      ? 'border-rose-800/80 bg-rose-950/40 hover:border-rose-600'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{node.title}</h4>
                    {getNodeBadge(node.status)}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{node.subtitle}</p>
                </div>
              ))}
            </div>

            {/* Column 2: Extractions */}
            <div className="space-y-4">
              {extractionNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedNode?.id === node.id
                      ? 'border-blue-500 bg-blue-950/80 ring-2 ring-blue-500/40 shadow-lg'
                      : node.status === 'fail'
                      ? 'border-rose-800/80 bg-rose-950/40 hover:border-rose-600'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{node.title}</h4>
                    {getNodeBadge(node.status)}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-1 truncate">{node.subtitle}</p>
                </div>
              ))}
            </div>

            {/* Column 3: Rules */}
            <div className="space-y-4">
              {ruleNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedNode?.id === node.id
                      ? 'border-blue-500 bg-blue-950/80 ring-2 ring-blue-500/40 shadow-lg'
                      : node.status === 'fail'
                      ? 'border-rose-800/80 bg-rose-950/40 hover:border-rose-600 animate-pulse-subtle'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{node.title}</h4>
                    {getNodeBadge(node.status)}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-1 truncate">{node.subtitle}</p>
                </div>
              ))}
            </div>

            {/* Column 4: Results */}
            <div className="space-y-4">
              {resultNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedNode?.id === node.id
                      ? 'border-blue-500 bg-blue-950/80 ring-2 ring-blue-500/40 shadow-lg'
                      : node.status === 'fail'
                      ? 'border-rose-800/80 bg-rose-950/40 hover:border-rose-600'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{node.title}</h4>
                    {getNodeBadge(node.status)}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{node.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Node Inspection Panel */}
        {selectedNode && (
          <div className="mt-8 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase font-bold text-blue-400">
                  Node Inspector: {selectedNode.category.toUpperCase()}
                </span>
                <span className="font-bold text-white">{selectedNode.title}</span>
              </div>
              <p className="text-slate-300 text-xs">{selectedNode.detail}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {selectedNode.status === 'fail' && (
                <Button
                  size="xs"
                  variant="primary"
                  onClick={() => navigateToApplication(activeApplication.id, 'correction_workspace')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Fix This Discrepancy
                </Button>
              )}
              <Button
                size="xs"
                variant="outline"
                onClick={() => setSelectedNode(null)}
                className="bg-slate-800 text-slate-300 border-slate-700"
              >
                Close Inspector
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
