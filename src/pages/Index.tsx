import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface AudioTrack {
  id: string;
  name: string;
  category: 'music' | 'sfx' | 'voice';
  duration: number;
  matchScore: number;
  tags: string[];
  tempo?: string;
}

interface AnalysisResult {
  timestamp: string;
  scene: string;
  emotion: string;
  actions: string[];
  confidence: number;
  recommendedAudio: string[];
}

const Index = () => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<AudioTrack[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const mockAudioLibrary: AudioTrack[] = [
    { id: '1', name: 'Epic Cinematic Trailer', category: 'music', duration: 180, matchScore: 95, tags: ['epic', 'dramatic', 'orchestral'], tempo: 'Medium' },
    { id: '2', name: 'Upbeat Corporate', category: 'music', duration: 240, matchScore: 88, tags: ['upbeat', 'positive', 'business'], tempo: 'Fast' },
    { id: '3', name: 'Ambient Technology', category: 'music', duration: 200, matchScore: 82, tags: ['tech', 'modern', 'minimal'], tempo: 'Slow' },
    { id: '4', name: 'Lo-Fi Chill Beats', category: 'music', duration: 190, matchScore: 79, tags: ['chill', 'relaxed', 'lofi'], tempo: 'Medium' },
    { id: '5', name: 'Whoosh Transition', category: 'sfx', duration: 2, matchScore: 91, tags: ['transition', 'swoosh'], tempo: undefined },
    { id: '6', name: 'City Traffic Ambience', category: 'sfx', duration: 30, matchScore: 78, tags: ['urban', 'background'], tempo: undefined },
    { id: '7', name: 'Glass Break', category: 'sfx', duration: 1, matchScore: 85, tags: ['impact', 'dramatic'], tempo: undefined },
    { id: '8', name: 'Door Close', category: 'sfx', duration: 1, matchScore: 80, tags: ['foley', 'realistic'], tempo: undefined },
    { id: '9', name: 'Professional Male Voice', category: 'voice', duration: 15, matchScore: 93, tags: ['narrator', 'deep', 'clear'], tempo: undefined },
    { id: '10', name: 'Energetic Female Voice', category: 'voice', duration: 12, matchScore: 90, tags: ['upbeat', 'friendly'], tempo: undefined },
    { id: '11', name: 'British Accent Narrator', category: 'voice', duration: 20, matchScore: 87, tags: ['accent', 'professional'], tempo: undefined },
  ];

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedVideo(file);
      setAnalysisResults([]);
      setSelectedTracks([]);
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
            { 
              timestamp: '00:00-00:05', 
              scene: 'Opening Shot', 
              emotion: 'Excited', 
              actions: ['Camera Pan', 'Fast Movement'], 
              confidence: 95,
              recommendedAudio: ['Epic Cinematic Trailer', 'Whoosh Transition']
            },
            { 
              timestamp: '00:05-00:15', 
              scene: 'Product Demo', 
              emotion: 'Professional', 
              actions: ['Close-up', 'Slow Motion'], 
              confidence: 92,
              recommendedAudio: ['Upbeat Corporate', 'Professional Male Voice']
            },
            { 
              timestamp: '00:15-00:20', 
              scene: 'Transition', 
              emotion: 'Dynamic', 
              actions: ['Cut', 'Zoom'], 
              confidence: 88,
              recommendedAudio: ['Whoosh Transition', 'Glass Break']
            },
            { 
              timestamp: '00:20-00:30', 
              scene: 'Closing', 
              emotion: 'Inspiring', 
              actions: ['Wide Shot', 'Fade Out'], 
              confidence: 90,
              recommendedAudio: ['Ambient Technology', 'Lo-Fi Chill Beats']
            },
          ]);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const autoMatchAudio = () => {
    const topMatches = mockAudioLibrary.filter(track => track.matchScore > 85);
    setSelectedTracks(topMatches);
  };

  const addTrackToTimeline = (track: AudioTrack) => {
    if (!selectedTracks.find(t => t.id === track.id)) {
      setSelectedTracks([...selectedTracks, track]);
    }
  };

  const removeTrackFromTimeline = (trackId: string) => {
    setSelectedTracks(selectedTracks.filter(t => t.id !== trackId));
  };

  const filteredLibrary = mockAudioLibrary.filter(track => {
    const matchesSearch = track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || track.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-purple-600 rounded-xl">
                <Icon name="Wand2" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Audio Match AI
                </h1>
                <p className="text-xs text-muted-foreground">Умный подбор аудио для видео</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                AI Ready
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-6 border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon name="Upload" className="text-primary" size={24} />
                </div>
                <h2 className="text-xl font-semibold">Загрузка и анализ видео</h2>
              </div>

              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-all duration-300 bg-background/50">
                {uploadedVideo ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="p-4 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                        <Icon name="Video" className="text-primary" size={40} />
                      </div>
                      <div className="absolute -top-1 -right-1/3 left-1/3">
                        <Badge className="bg-green-500 text-white border-0">✓ Загружено</Badge>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{uploadedVideo.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(uploadedVideo.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing} 
                        className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                      >
                        <Icon name="Brain" size={18} />
                        {isAnalyzing ? 'Анализирую видео...' : 'Запустить AI-анализ'}
                      </Button>
                      <Button variant="outline" onClick={() => setUploadedVideo(null)}>
                        Заменить файл
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                      <Icon name="Upload" className="text-muted-foreground" size={40} />
                    </div>
                    <div>
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <span className="text-primary font-semibold hover:underline text-lg">Выберите видео</span>
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
                    <p className="text-sm text-muted-foreground">MP4, MOV, AVI • До 500MB</p>
                  </div>
                )}
              </div>

              {isAnalyzing && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Sparkles" className="text-primary animate-pulse" size={16} />
                      <span className="text-muted-foreground">Анализирую контент видео...</span>
                    </div>
                    <span className="font-semibold text-primary">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    AI определяет сцены, эмоции, действия и подбирает подходящее аудио
                  </p>
                </div>
              )}
            </Card>

            {analysisResults.length > 0 && (
              <Card className="p-6 border-green-500/20 bg-gradient-to-br from-card to-green-950/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Icon name="Sparkles" className="text-primary" size={24} />
                    <h3 className="text-xl font-semibold">Результаты AI-анализа</h3>
                    <Badge variant="outline" className="ml-2 border-green-500/50 text-green-400">
                      {analysisResults.length} сцен
                    </Badge>
                  </div>
                  <Button 
                    onClick={autoMatchAudio} 
                    className="gap-2 bg-gradient-to-r from-primary to-purple-600"
                  >
                    <Icon name="Wand2" size={18} />
                    Автоподбор аудио
                  </Button>
                </div>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {analysisResults.map((result, idx) => (
                      <Card 
                        key={idx} 
                        className="p-4 bg-accent/30 border-primary/20 hover:border-primary/40 transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className="gap-1">
                                  <Icon name="Clock" size={12} />
                                  {result.timestamp}
                                </Badge>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                  {result.scene}
                                </Badge>
                                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                                  {result.emotion}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {result.actions.map((action, i) => (
                                  <span key={i} className="text-xs px-2 py-1 bg-background/50 rounded-md border border-border">
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
                          <Separator />
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Рекомендуемое аудио:</p>
                            <div className="flex flex-wrap gap-2">
                              {result.recommendedAudio.map((audioName, i) => {
                                const track = mockAudioLibrary.find(t => t.name === audioName);
                                return track ? (
                                  <Button
                                    key={i}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addTrackToTimeline(track)}
                                    className="gap-1 text-xs h-7"
                                  >
                                    <Icon name="Plus" size={12} />
                                    {audioName}
                                  </Button>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            )}

            {selectedTracks.length > 0 && (
              <Card className="p-6 border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon name="Layout" className="text-primary" size={24} />
                    <h3 className="text-xl font-semibold">Таймлайн</h3>
                    <Badge variant="secondary">{selectedTracks.length} треков</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedTracks([])}>
                      <Icon name="Trash2" size={16} />
                    </Button>
                    <Button className="gap-2 bg-gradient-to-r from-primary to-purple-600">
                      <Icon name="Download" size={18} />
                      Экспорт проекта
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3 pr-4">
                    {selectedTracks.map(track => (
                      <TimelineTrack 
                        key={track.id} 
                        track={track} 
                        onRemove={() => removeTrackFromTimeline(track.id)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-primary/20 bg-gradient-to-br from-card to-card/50 sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon name="Library" className="text-primary" size={24} />
                </div>
                <h2 className="text-xl font-semibold">Библиотека аудио</h2>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    placeholder="Поиск по треках и тегам..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-background/50">
                    <TabsTrigger value="all">Все</TabsTrigger>
                    <TabsTrigger value="music">🎵</TabsTrigger>
                    <TabsTrigger value="sfx">🔊</TabsTrigger>
                    <TabsTrigger value="voice">🎤</TabsTrigger>
                  </TabsList>

                  <ScrollArea className="h-[500px] mt-4">
                    <div className="space-y-2 pr-4">
                      {filteredLibrary.length > 0 ? (
                        filteredLibrary.map(track => (
                          <AudioTrackCard 
                            key={track.id} 
                            track={track} 
                            onAdd={() => addTrackToTimeline(track)}
                            isAdded={selectedTracks.some(t => t.id === track.id)}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Icon name="SearchX" size={48} className="mx-auto mb-2 opacity-50" />
                          <p>Ничего не найдено</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Tabs>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const AudioTrackCard = ({ 
  track, 
  onAdd, 
  isAdded 
}: { 
  track: AudioTrack; 
  onAdd: () => void;
  isAdded: boolean;
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'music': return 'Music';
      case 'sfx': return 'Volume2';
      case 'voice': return 'Mic';
      default: return 'AudioLines';
    }
  };

  return (
    <Card className={`p-3 transition-all cursor-pointer group ${
      isAdded 
        ? 'bg-primary/10 border-primary/50' 
        : 'hover:bg-accent/50 hover:border-primary/30'
    }`}>
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg transition-colors ${
            isAdded ? 'bg-primary/20' : 'bg-primary/10 group-hover:bg-primary/20'
          }`}>
            <Icon name={getCategoryIcon(track.category)} className="text-primary" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{track.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{track.duration}s</span>
              {track.tempo && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{track.tempo}</span>
                </>
              )}
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary shrink-0">
            {track.matchScore}%
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1">
          {track.tags.map((tag, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-background/50 rounded border border-border">
              {tag}
            </span>
          ))}
        </div>
        <Button 
          size="sm" 
          className="w-full gap-2" 
          onClick={onAdd}
          disabled={isAdded}
          variant={isAdded ? "secondary" : "default"}
        >
          <Icon name={isAdded ? "Check" : "Plus"} size={16} />
          {isAdded ? 'Добавлен' : 'Добавить'}
        </Button>
      </div>
    </Card>
  );
};

const TimelineTrack = ({ 
  track, 
  onRemove 
}: { 
  track: AudioTrack; 
  onRemove: () => void;
}) => {
  const [volume, setVolume] = useState([75]);

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-medium">{track.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {track.category.toUpperCase()}
              </Badge>
              <span className="text-xs text-muted-foreground">{track.duration}s</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
            onClick={onRemove}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
        
        <div className="h-16 bg-accent/30 rounded-lg flex items-center justify-center overflow-hidden relative">
          <div className="flex items-end gap-1 h-full py-2">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary/60 rounded-full"
                style={{
                  height: `${20 + Math.random() * 80}%`,
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
          <span className="text-sm text-muted-foreground w-12 text-right font-mono">{volume[0]}%</span>
        </div>
      </div>
    </Card>
  );
};

export default Index;
