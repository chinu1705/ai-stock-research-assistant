"use client";

import { useState, useEffect, use } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MemoPreview } from "@/components/memo/MemoPreview";
import { Spinner } from "@/components/ui/Spinner";
import { FileText } from "lucide-react";

interface MemoData {
  id: string;
  title: string;
  thesis: string;
  valuation: string;
  peerAnalysis: string;
  riskAssessment: string;
  catalysts: string;
  recommendation: string;
  targetPrice?: number;
  timeHorizon: string;
  confidence: number;
  createdAt: string;
}

export default function MemoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [memo, setMemo] = useState<MemoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMemo();
  }, [id]);

  const fetchMemo = async () => {
    try {
      const res = await fetch(`/api/memo/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMemo(data);
      } else {
        setError("Memo not found");
      }
    } catch {
      setError("Failed to load memo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-20">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-red-400 text-xs font-mono">{error}</p>
          </div>
        ) : memo ? (
          <MemoPreview memo={memo} />
        ) : null}
      </div>
    </AppShell>
  );
}
