import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

export function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">お問い合わせ</h1>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
          <p className="text-sm text-white/80 leading-relaxed">
            ご意見・不具合報告・削除依頼などは、以下の連絡先へお願いします。
          </p>
          <a
            href="mailto:contact@todospace.net"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm hover:bg-white/10 transition-colors"
          >
            <Mail className="h-4 w-4" />
            contact@todospace.net
          </a>
        </div>
      </div>
    </div>
  );
}
