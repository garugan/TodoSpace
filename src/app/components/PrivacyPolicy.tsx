import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

export function PrivacyPolicy() {
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
          <h1 className="text-xl font-bold">プライバシーポリシー</h1>
        </div>

        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
          <section className="space-y-2">
            <h2 className="font-semibold">1. 取得する情報</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              TodoSpace は、ユーザーが入力したタスク情報をブラウザ内の
              localStorage に保存します。サーバーへタスク内容を送信・保存しません。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold">2. 利用目的</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              取得した情報は、タスクの表示・保存・管理のためにのみ利用します。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold">3. 外部サービス</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              本サービスは配信基盤として Cloudflare Pages を利用しています。アクセス解析を有効化している場合、匿名化されたアクセス情報が収集されることがあります。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold">4. ユーザーデータの削除</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              タスクデータはブラウザのサイトデータ削除機能で削除できます。
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold">5. お問い合わせ</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              本ポリシーに関するお問い合わせは、<a className="underline decoration-white/40 hover:decoration-white" href="/contact">お問い合わせページ</a>をご利用ください。
            </p>
          </section>

          <p className="text-xs text-white/50">最終更新日: 2026年3月7日</p>
        </div>
      </div>
    </div>
  );
}
