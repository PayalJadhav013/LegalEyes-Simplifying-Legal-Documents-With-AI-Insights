import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, Search, Sparkles, AlertTriangle, Send, Plus, Bot, LogIn, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const BASE = "/api";

interface Message { role: "user" | "assistant"; content: string; }
interface DocMeta { documentId: string; fileName: string; chunksStored: number; status: string; }

const quickActions = [
  { icon: FileSearch,    label: "Summarize document",      action: "summarise" },
  { icon: Search,        label: "Highlight key clauses",   action: "highlight" },
  { icon: Sparkles,      label: "Simplify to plain language", action: "simplify" },
  { icon: AlertTriangle, label: "Find risks & red flags",  action: "risks"     },
];

const AIAnalyser = () => {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [input,      setInput]      = useState("");
  const [docMeta,    setDocMeta]    = useState<DocMeta | null>(null);
  const [uploading,  setUploading]  = useState(false);
  const [chatLoading,setChatLoading]= useState(false);
  const fileRef   = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!loading && !user) setShowAuthDialog(true); }, [loading, user]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, chatLoading]);

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  const handleUpload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const r = await fetch(`${BASE}/documents/upload`, { method: "POST", headers: authHeaders(), body: form });
      if (!r.ok) throw new Error((await r.json()).error || "Upload failed");
      const meta = await r.json();
      setDocMeta(meta);
      setMessages([{ role: "assistant", content: `✅ "${meta.fileName}" is ready!\n📦 ${meta.chunksStored} semantic chunks indexed.\n\nAsk me anything about this document, or use the quick action buttons.` }]);
      toast.success("Document uploaded and indexed!");
    } catch (e: any) {
      toast.error(e.message);
    }
    setUploading(false);
  };

  const sendMessage = async (text: string, action?: string) => {
    if (!text.trim() || chatLoading) return;
    const userMsg: Message = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setChatLoading(true);
    try {
      const r = await fetch(`${BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
          documentId: docMeta?.documentId || null,
          action: action || null,
        }),
      });
      if (!r.ok) throw new Error((await r.json()).error || "Chat failed");
      const data = await r.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      toast.error(e.message);
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ " + e.message }]);
    }
    setChatLoading(false);
  };

  const removeDoc = async () => {
    if (docMeta) {
      await fetch(`${BASE}/documents/${docMeta.documentId}`, { method: "DELETE", headers: authHeaders() }).catch(() => {});
    }
    setDocMeta(null);
    setMessages([]);
    toast.success("Document removed");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 flex flex-col items-center px-4 max-w-3xl mx-auto w-full py-8">
        <motion.div initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ type:"spring", duration:0.6 }}
          className="w-20 h-20 rounded-2xl bg-gradient-gold flex items-center justify-center mb-6 shadow-lg gold-glow">
          <Bot className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
          AI Document Analyser
        </h1>
        <p className="text-muted-foreground text-center max-w-lg mb-6">
          Upload a legal document and get instant AI-powered insights.
        </p>

        {/* Upload / Doc chip */}
        {!docMeta ? (
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            className={`w-full max-w-xl border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6
              ${uploading ? "border-gold/40 bg-gold/5" : "border-border hover:border-gold/50 hover:bg-secondary/30"}`}
          >
            <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx"
              onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])}
              className="hidden" />
            <div className="text-4xl mb-2">{uploading ? "⏳" : "📂"}</div>
            <p className="text-foreground/70 font-medium">{uploading ? "Indexing document…" : "Drop file or click to upload"}</p>
            <p className="text-muted-foreground text-sm mt-1">PDF · DOCX · TXT · Max 20 MB</p>
          </div>
        ) : (
          <div className="w-full max-w-xl flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 mb-6">
            <span className="text-2xl">📄</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{docMeta.fileName}</p>
              <p className="text-xs text-muted-foreground">{docMeta.chunksStored} chunks indexed · {docMeta.status}</p>
            </div>
            <button onClick={removeDoc} className="text-muted-foreground hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-xl mb-6">
          {quickActions.map(a => (
            <motion.button key={a.label} whileHover={{ y:-2 }} whileTap={{ scale:0.98 }}
              onClick={() => docMeta ? sendMessage(a.label, a.action) : toast.error("Upload a document first")}
              className="flex items-center gap-3 px-5 py-4 rounded-xl bg-card border border-border text-foreground/80 text-sm font-medium hover:border-gold/40 transition-all text-left">
              <a.icon className="w-5 h-5 text-gold shrink-0" />
              {a.label}
            </motion.button>
          ))}
        </div>

        {/* Chat messages */}
        {messages.length > 0 && (
          <div className="w-full max-w-xl space-y-4 mb-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${m.role === "user"
                    ? "bg-gradient-gold text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border text-foreground/90 rounded-bl-sm"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-muted-foreground italic">
                  LegalEyes is analysing…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 shadow-sm focus-within:border-gold/50 transition-all">
            <button onClick={() => fileRef.current?.click()}
              className="shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-4 h-4" />
            </button>
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder={docMeta ? "Ask about your document…" : "Upload a document or ask a legal question…"}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
              disabled={chatLoading} />
            <button onClick={() => sendMessage(input)} disabled={chatLoading || !input.trim()}
              className="shrink-0 w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center text-primary-foreground hover:opacity-80 transition-opacity disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            LegalEyes AI can make mistakes. Always verify with a qualified legal professional.
          </p>
        </div>
      </div>

      <Dialog open={showAuthDialog && !loading && !user} onOpenChange={open => {
        setShowAuthDialog(open);
        if (!open && !user) navigate("/");
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              <LogIn className="w-5 h-5 text-gold" /> Login Required
            </DialogTitle>
            <DialogDescription>
              You need to be logged in to use the AI Document Analyser.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={() => navigate("/login")} className="bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2">
              <LogIn className="w-4 h-4" /> Login
            </Button>
            <Button variant="outline" onClick={() => navigate("/signup")}>Create Account</Button>
            <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground">Go Back Home</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIAnalyser;
