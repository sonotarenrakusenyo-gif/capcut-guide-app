import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { Loader2, Play } from 'lucide-react';
import { Streamdown } from 'streamdown';

export default function YouTubeManualGenerator() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [timestamp, setTimestamp] = useState('00:00:00');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedManual, setGeneratedManual] = useState<any>(null);
  
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  const generateManualMutation = trpc.youtube.generateManual.useMutation({
    onSuccess: (data: any) => {
      setGeneratedManual(data);
      toast.success('マニュアルが生成されました！');
    },
    onError: (error: any) => {
      toast.error(`エラー: ${error.message}`);
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const saveManualMutation = trpc.youtube.saveManual.useMutation({
    onSuccess: (data: any) => {
      toast.success('マニュアルが保存されました！');
      navigate(`/article/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(`保存エラー: ${error.message}`);
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">ログインが必要です</h2>
          <p className="text-muted-foreground mb-6">
            YouTube連携マニュアルを生成するにはログインしてください。
          </p>
          <Button onClick={() => navigate('/login')} className="w-full">
            ログインする
          </Button>
        </Card>
      </div>
    );
  }

  const handleGenerateManual = async () => {
    if (!youtubeUrl.trim()) {
      toast.error('YouTubeのURLを入力してください');
      return;
    }

    // YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//;
    if (!youtubeRegex.test(youtubeUrl)) {
      toast.error('有効なYouTubeのURLを入力してください');
      return;
    }

    setIsLoading(true);
    generateManualMutation.mutate({
      youtubeUrl,
      timestamp
    });
  };

  const handleSaveManual = async () => {
    if (!generatedManual) return;
    
    saveManualMutation.mutate({
      title: generatedManual.title,
      content: generatedManual.content,
      category: 'youtube',
      youtubeUrl,
      timestamp
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <Play className="w-8 h-8 text-blue-500" />
            YouTube連携マニュアル生成
          </h1>
          <p className="text-muted-foreground">
            YouTube動画のURLとタイムスタンプを入力すると、CapCutの実践マニュアルを自動生成します。
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                YouTube動画URL
              </label>
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                例：https://www.youtube.com/watch?v=dQw4w9WgXcQ
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                タイムスタンプ（開始時刻）
              </label>
              <Input
                type="text"
                placeholder="HH:MM:SS"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                例：00:14:30（14分30秒から）
              </p>
            </div>

            <Button
              onClick={handleGenerateManual}
              disabled={isLoading || !youtubeUrl.trim()}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                'マニュアルを生成'
              )}
            </Button>
          </div>
        </Card>

        {/* Generated Manual Preview */}
        {generatedManual && (
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{generatedManual.title}</h2>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  YouTube実践
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  自動生成
                </span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-6">
              <Streamdown>{generatedManual.content}</Streamdown>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleSaveManual}
                disabled={saveManualMutation.isPending}
                className="flex-1"
              >
                {saveManualMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  'マニュアルを保存'
                )}
              </Button>
              <Button
                onClick={() => setGeneratedManual(null)}
                variant="outline"
                className="flex-1"
              >
                キャンセル
              </Button>
            </div>
          </Card>
        )}

        {/* Info Section */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <h3 className="font-bold mb-2">💡 使い方のコツ</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• CapCutの編集テクニックを紹介している動画が最適です</li>
            <li>• タイムスタンプで特定のテクニックの開始時刻を指定できます</li>
            <li>• 生成されたマニュアルは編集・削除が可能です</li>
            <li>• 複数の動画から複数のマニュアルを生成できます</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
