import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    const loginUrl = getLoginUrl();
    window.location.href = loginUrl;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <Card className="p-12 text-center border-0 bg-card/50 max-w-md backdrop-blur">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-2xl">CC</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">CapCut完全攻略</h1>
        <p className="text-muted-foreground mb-8">
          ログインして、お気に入り機能と学習進捗を保存してください。
        </p>

        <div className="space-y-4">
          <Button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3"
            size="lg"
          >
            Manus でログイン
          </Button>

          <p className="text-xs text-muted-foreground">
            ログインすることで、記事のお気に入り保存と学習進捗の追跡が可能になります。
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            ログインなしでも、すべての記事を読むことができます。
          </p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full"
          >
            ホームに戻る
          </Button>
        </div>
      </Card>
    </div>
  );
}
