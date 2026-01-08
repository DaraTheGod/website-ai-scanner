import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle,
  AlertOctagon,
  Loader2,
  Globe
} from "lucide-react";
import { cn } from "./lib/utils";

interface ScanResult {
  risk: string;
  score: number;
  reasons: string[];
}

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scanSite = async () => {
    if (!url) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post("http://localhost:8000/scan", { url });
      setResult(res.data);
    } catch (err) {
      setError("Failed to scan the website. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 75) return "text-red-500";
    if (score > 40) return "text-yellow-500";
    return "text-green-500";
  };

  const getScoreBg = (score: number) => {
    if (score > 75) return "bg-red-500";
    if (score > 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high": return <AlertOctagon className="w-6 h-6 text-red-500" />;
      case "medium": return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default: return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen p-5 w-full flex flex-col items-center justify-center relative overflow-hidden bg-background text-foreground antialiased selection:bg-primary/20">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl px-4"
      >
        <div className="text-center mb-8 space-y-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4 ring-1 ring-primary/20"
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            AI Website Scanner
          </h1>
          <p className="text-muted-foreground text-lg">
            Analyze website safety instantly with advanced AI
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl ring-1 ring-white/5">
          <div className="flex flex-col space-y-4">
            <div className="relative group">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && scanSite()}
                className="w-full bg-secondary/50 border border-white/5 rounded-xl py-4 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/50 focus:bg-secondary/80 transition-all placeholder:text-muted-foreground/50"
              />
            </div>

            <button
              onClick={scanSite}
              disabled={loading || !url}
              className={cn(
                "w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all",
                "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-50 disabled:pointer-events-none"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Scan Website
                </>
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 flex items-center gap-3"
              >
                <AlertOctagon className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 space-y-6"
              >
                <div className="h-px w-full bg-white/5" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/30 border border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="text-sm text-muted-foreground mb-1">Risk Level</span>
                    <div className="flex items-center gap-2">
                      {getRiskIcon(result.risk)}
                      <span className="text-xl font-bold capitalize">{result.risk}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary/30 border border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="text-sm text-muted-foreground mb-1">Safety Score</span>
                    <span className={cn("text-2xl font-bold", getScoreColor(result.score))}>
                      {100 - result.score}/100
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Threat Level</span>
                    <span className="font-mono text-muted-foreground">{result.score}%</span>
                  </div>
                  <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full rounded-full", getScoreBg(result.score))}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Analysis Report
                  </h3>
                  <div className="space-y-2">
                    {result.reasons.length === 0 ? (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-200 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        No obvious threats detected.
                      </div>
                    ) : (
                      result.reasons.map((reason, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-3 rounded-lg bg-secondary/30 border border-white/5 text-sm text-muted-foreground flex items-start gap-3"
                        >
                          <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          {reason}
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground/30 mt-8">
          Powered by Advanced AI Scanning Engine • Built by{' '}
          <a
            href="https://daraportfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Chhinchheang Dara
          </a>{' '}
          • Secure & Private
        </p>

      </motion.div>
    </div>
  );
}

export default App;