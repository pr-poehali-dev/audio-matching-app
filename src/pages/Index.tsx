import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface AudioTrack {
  id: string;
  name: string;
  category: 'music' | 'sfx' | 'voice';
  duration: number;
  matchScore: number;
}

interface AnalysisResult {
  scene: string;
  emotion: string;
  actions: string[];
  confidence: number;
}

const Index = () => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<AudioTrack[]>([]);

  const mockAudioLibrary: AudioTrack[] = [
    { id: '1', name: 'Upbeat Electronic', category: 'music', duration: 180, matchScore: 95 },
    { id: '2', name: 'Dramatic Strings', category: 'music', duration: 240, matchScore: 88 },
    { id: '3', name: 'Ambient Space', category: 'music', duration: 200, matchScore: 82 },
    { id: '4', name: 'Whoosh Transition', category: 'sfx', duration: 2, matchScore: 91 },
    { id: '5', name: 'City Traffic', category: 'sfx', duration: 30, matchScore: 78 },
    { id: '6', name: 'Professional Voice', category: 'voice', duration: 15, matchScore: 93 },
  ];

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedVideo(file);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisResults([
            { scene: 'Opening Shot', emotion: 'Excited', actions: ['Camera Pan', 'Fast Movement'], confidence: 95 },
            { scene: 'Product Demo', emotion: 'Professional', actions: ['Close-up', 'Slow Motion'], confidence: 92 },
            { scene: 'Transition', emotion: 'Dynamic', actions: ['Cut', 'Zoom'], confidence: 88 },
          ]);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const autoMatchAudio = () => {
    const topMatches = mockAudioLibrary.filter(track => track.matchScore > 85);
    setSelectedTracks(topMatches);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Audio Match AI
          </h1>
          <p className="text-muted-foreground text-lg">Умный подбор аудио для вашего видео</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="Upload" className="text-primary" size={24} />
              </div>
              <h2 className="text-2xl font-semibold">Загрузка видео</h2>
            </div>

            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors">
              {uploadedVideo ? (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <Icon name="Video" className="text-primary" size={32} />
                  </div>
                  <p className="font-medium text-lg">{uploadedVideo.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedVideo.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button onClick={handleAnalyze} disabled={isAnalyzing} className="gap-2">
                    <Icon name="Brain" size={18} />
                    {isAnalyzing ? 'Анализирую...' : 'Запустить ИИ-анализ'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <Icon name="Upload" className="text-muted-foreground" size={32} />
                  </div>
                  <div>
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <span className="text-primary font-medium hover:underline">Выберите файл</span>
                      <span className="text-muted-foreground"> или перетащите сюда</span>
                    </label>
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoUpload}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">MP4, MOV, AVI до 500MB</p>
                </div>
              )}
            </div>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Анализ контента...</span>
                  <span className="font-medium">{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
            )}

            {analysisResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="Sparkles" className="text-primary" size={20} />
                    Результаты анализа
                  </h3>
                  <Button onClick={autoMatchAudio} variant="default" className="gap-2">
                    <Icon name="Wand2" size={18} />
                    Автоподбор
                  </Button>
                </div>
                <div className="space-y-3">
                  {analysisResults.map((result, idx) => (
                    <Card key={idx} className="p-4 bg-accent/30 border-primary/20">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{result.scene}</Badge>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                              {result.emotion}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {result.actions.map((action, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-background rounded-md">
                                {action}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{result.confidence}%</p>
                            <p className="text-xs text-muted-foreground">точность</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="Library" className="text-primary" size={24} />
              </div>
              <h2 className="text-xl font-semibold">Библиотека</h2>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="music">🎵</TabsTrigger>
                <TabsTrigger value="sfx">🔊</TabsTrigger>
                <TabsTrigger value="voice">🎤</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-2 mt-4">
                {mockAudioLibrary.map(track => (
                  <AudioTrackCard key={track.id} track={track} />
                ))}
              </TabsContent>

              <TabsContent value="music" className="space-y-2 mt-4">
                {mockAudioLibrary.filter(t => t.category === 'music').map(track => (
                  <AudioTrackCard key={track.id} track={track} />
                ))}
              </TabsContent>

              <TabsContent value="sfx" className="space-y-2 mt-4">
                {mockAudioLibrary.filter(t => t.category === 'sfx').map(track => (
                  <AudioTrackCard key={track.id} track={track} />
                ))}
              </TabsContent>

              <TabsContent value="voice" className="space-y-2 mt-4">
                {mockAudioLibrary.filter(t => t.category === 'voice').map(track => (
                  <AudioTrackCard key={track.id} track={track} />
                ))}
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {selectedTracks.length > 0 && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Icon name="Layout" className="text-primary" size={20} />
                Таймлайн ({selectedTracks.length} треков)
              </h3>
              <Button variant="default" className="gap-2">
                <Icon name="Download" size={18} />
                Экспорт проекта
              </Button>
            </div>
            <div className="space-y-3">
              {selectedTracks.map(track => (
                <TimelineTrack key={track.id} track={track} />
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const AudioTrackCard = ({ track }: { track: AudioTrack }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'music': return 'Music';
      case 'sfx': return 'Volume2';
      case 'voice': return 'Mic';
      default: return 'AudioLines';
    }
  };

  return (
    <Card className="p-3 hover:bg-accent/50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
          <Icon name={getCategoryIcon(track.category)} className="text-primary" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{track.name}</p>
          <p className="text-xs text-muted-foreground">{track.duration}s</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {track.matchScore}%
        </Badge>
      </div>
    </Card>
  );
};

const TimelineTrack = ({ track }: { track: AudioTrack }) => {
  const [volume, setVolume] = useState([75]);

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-medium">{track.name}</p>
            <p className="text-sm text-muted-foreground">{track.category.toUpperCase()}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Icon name="X" size={16} />
          </Button>
        </div>
        
        <div className="h-16 bg-accent/30 rounded-lg flex items-center justify-center overflow-hidden relative">
          <div className="flex items-end gap-1 h-full py-2">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary/60 rounded-full animate-pulse-wave"
                style={{
                  height: `${20 + Math.random() * 80}%`,
                  animationDelay: `${i * 0.03}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Icon name="Volume2" size={16} className="text-muted-foreground" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-12 text-right">{volume[0]}%</span>
        </div>
      </div>
    </Card>
  );
};

export default Index;
