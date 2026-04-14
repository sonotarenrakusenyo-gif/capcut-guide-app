import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [, setLocation] = useLocation();
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1>404</h1>
        <p>ページが見つかりません</p>
        <Button onClick={() => setLocation("/")}>ホームへ戻る</Button>
      </div>
    </div>
  );
}
