import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  MapPin, 
  Users, 
  Sliders, 
  Film, 
  Tv, 
  Compass, 
  ArrowRight, 
  Calendar, 
  Layers, 
  Mic, 
  Download, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==========================================
// TYPES & INTERFACES
// ==========================================

interface Scene {
  id: number;
  title: string;
  sub: string;
  timeStart: number;
  timeEnd: number;
  imageUrl: string;
  voiceover: string;
  visualDirection: string;
  cameraMovement: string;
  soundCue: string;
  highlightText: string;
}

interface TimelineStep {
  phase: string;
  hours: string;
  description: string;
  keyDeliverable: string;
}

interface CustomEventData {
  sceneTitle: string;
  visualDescription: string;
  voiceoverText: string;
  musicCrescendo: string;
  timeline: TimelineStep[];
  luxuryCurationInsights: string;
}

// ==========================================
// STATIC ASSETS & FALLBACKS
// ==========================================

const BASE_SCENES: Scene[] = [
  {
    id: 1,
    title: "IGNITION",
    sub: "0 – 5 seconds",
    timeStart: 0,
    timeEnd: 5,
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200", // Gold sparkling lights in darkness
    voiceover: "Every unforgettable moment... begins with a vision.",
    visualDirection: "The screen is completely black. A single spark ignites in darkness. Golden particles swirl through the air, forming a futuristic glowing 'A'.",
    cameraMovement: "Slow cinematic push-in, orbital camera rotation.",
    soundCue: "Soft piano with deep ambient synth pad; massive bass impact at 5.0s.",
    highlightText: "A vision is born."
  },
  {
    id: 2,
    title: "TRANSFORMATION",
    sub: "5 – 10 seconds",
    timeStart: 5,
    timeEnd: 10,
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200", // Premium floral wedding venue
    voiceover: "A wedding venue transformed... corporate stages built from dreams... a concert stage exploding with lights.",
    visualDirection: "Fast aesthetic cuts: A premium wedding venue in full bloom; a high-tech corporate stage glowing with giant LED walls; a concert stage exploding.",
    cameraMovement: "Fast whip-pans, majestic low-angle drone fly-overs.",
    soundCue: "Epic orchestral brass, fast strings, dynamic modern electronic beats.",
    highlightText: "Transforming spaces."
  },
  {
    id: 3,
    title: "CREATION",
    sub: "10 – 18 seconds",
    timeStart: 10,
    timeEnd: 18,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200", // Production setup/mixing desk
    voiceover: "From dream... to reality.",
    visualDirection: "Behind-the-scenes precision: Crew communicating through headsets, custom stage rigged, LED screens aligning, pyrotechnics tested, guests smiling.",
    cameraMovement: "Macro focal lengths, slow steady-cam slider reveals.",
    soundCue: "Rhythmic mechanical ticks, driving low bass synthesizer notes.",
    highlightText: "Engineering history."
  },
  {
    id: 4,
    title: "THE SPECTRUM",
    sub: "18 – 25 seconds",
    timeStart: 18,
    timeEnd: 25,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200", // Festival crowd lasers
    voiceover: "Every element perfectly synchronized... a symphony of light, sound, and human celebration.",
    visualDirection: "The ultimate peak. Fireworks exploding over high-end pavilions, lasers painting the sky, VIP red carpet arrivals, crowd cheering.",
    cameraMovement: "Dramatic circular crane sweep, soaring aerial drone overview.",
    soundCue: "Majestic orchestral crescendo, soaring horns, high-impact synthesizers.",
    highlightText: "An epic crescendo."
  },
  {
    id: 5,
    title: "LEGACY",
    sub: "25 – 30 seconds",
    timeStart: 25,
    timeEnd: 30,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200", // Black marble texture background
    voiceover: "AVENTRA... We Don't Just Organize Events... We Create History.",
    visualDirection: "The majestic AVENTRA logo appears in polished gold on a black marble backplate. 'Creating Experiences. Inspiring Memories.' shines beneath.",
    cameraMovement: "Subtle slow cinematic zoom, gold reflection metallic sheen sweep.",
    soundCue: "Harmonious chord resolution, ending on a singular crystalline chime.",
    highlightText: "Where extraordinary begins."
  }
];

// ==========================================
// PROCEDURAL AUDIO SYNTHESIZER
// ==========================================

class AventraAudioEngine {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private oscillatorNode: OscillatorNode | null = null;
  private noiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private activeInterval: any = null;
  private currentSceneIdx: number = -1;

  constructor() {}

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.masterVolume.connect(this.ctx.destination);
      this.startSynthesizerLoop();
    } catch (e) {
      console.warn("Failed to initiate Web Audio Synthesizer", e);
    }
  }

  setMute(isMuted: boolean) {
    if (!this.ctx || !this.masterVolume) return;
    const target = isMuted ? 0 : 0.08;
    this.masterVolume.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.1);
  }

  private startSynthesizerLoop() {
    if (!this.ctx || !this.masterVolume) return;

    // Create a rhythmic tick & drone loop
    this.activeInterval = setInterval(() => {
      this.playProceduralPulse();
    }, 450);
  }

  playProceduralPulse() {
    if (!this.ctx || !this.masterVolume || this.ctx.state === "suspended") return;
    const now = this.ctx.currentTime;

    try {
      // Scene-dependent synthesis
      if (this.currentSceneIdx === 0) {
        // Scene 1: Deep cosmic low drone & single high soft bells
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(110, now); // Low sub note
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.4);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.masterVolume);
        osc.start(now);
        osc.stop(now + 0.4);

        // Soft gold sparkle chime pulse
        if (Math.random() > 0.6) {
          const chime = this.ctx.createOscillator();
          const chimeGain = this.ctx.createGain();
          chime.type = "triangle";
          chime.frequency.setValueAtTime(880, now);
          chimeGain.gain.setValueAtTime(0.02, now);
          chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          chime.connect(chimeGain);
          chimeGain.connect(this.masterVolume);
          chime.start(now);
          chime.stop(now + 0.8);
        }
      } else if (this.currentSceneIdx === 1 || this.currentSceneIdx === 2) {
        // Scene 2 & 3: Driving modern tech pulses (ticking filter & rhythmic synth-bass)
        const bass = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bass.type = "sawtooth";
        
        // Dynamic notes (minor progression)
        const notes = [110, 130.81, 146.83, 164.81];
        const randomNote = notes[Math.floor(now * 2.2) % notes.length];
        bass.frequency.setValueAtTime(randomNote, now);
        
        // High cut-off filter to keep it luxurious and deep
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(150, now + 0.3);

        bassGain.gain.setValueAtTime(0.04, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        bass.connect(filter);
        filter.connect(bassGain);
        bassGain.connect(this.masterVolume);
        
        bass.start(now);
        bass.stop(now + 0.35);

        // Hi-hat tick
        const tick = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tick.type = "sine";
        tick.frequency.setValueAtTime(10000, now);
        tickGain.gain.setValueAtTime(0.008, now);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        tick.connect(tickGain);
        tickGain.connect(this.masterVolume);
        tick.start(now);
        tick.stop(now + 0.06);

      } else if (this.currentSceneIdx === 3) {
        // Scene 4: Epic Orchestral Crescendo (majestic multi-oscillator chords!)
        const frequencies = [220, 277.18, 329.63, 440]; // A major cinematic chord
        frequencies.forEach((freq) => {
          const chordOsc = this.ctx!.createOscillator();
          const chordGain = this.ctx!.createGain();
          chordOsc.type = "sawtooth";
          chordOsc.frequency.setValueAtTime(freq, now);
          chordOsc.frequency.linearRampToValueAtTime(freq * 1.01, now + 0.4);

          // Lux filter sweep
          const filter = this.ctx!.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(300, now);
          filter.frequency.exponentialRampToValueAtTime(1800, now + 0.4);

          chordGain.gain.setValueAtTime(0.02, now);
          chordGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

          chordOsc.connect(filter);
          filter.connect(chordGain);
          chordGain.connect(this.masterVolume!);

          chordOsc.start(now);
          chordOsc.stop(now + 0.45);
        });

        // Add sweeping brass pad
        const brass = this.ctx.createOscillator();
        const brassGain = this.ctx.createGain();
        brass.type = "triangle";
        brass.frequency.setValueAtTime(554.37, now); // C#5 luxury note
        brassGain.gain.setValueAtTime(0.03, now);
        brassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        brass.connect(brassGain);
        brassGain.connect(this.masterVolume);
        brass.start(now);
        brass.stop(now + 0.7);

      } else {
        // Scene 5 & Custom: Crystalline chime and deep comforting base
        if (Math.floor(now * 10) % 8 === 0) {
          const bell = this.ctx.createOscillator();
          const bellGain = this.ctx.createGain();
          bell.type = "sine";
          // Golden ratio harmonics
          bell.frequency.setValueAtTime(1320, now);
          bellGain.gain.setValueAtTime(0.03, now);
          bellGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          bell.connect(bellGain);
          bellGain.connect(this.masterVolume);
          bell.start(now);
          bell.stop(now + 1.25);
        }

        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = "sine";
        sub.frequency.setValueAtTime(82.41, now); // E2 sweet note
        subGain.gain.setValueAtTime(0.04, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        sub.connect(subGain);
        subGain.connect(this.masterVolume);
        sub.start(now);
        sub.stop(now + 0.85);
      }
    } catch (err) {
      console.error("Pulse creation failed", err);
    }
  }

  triggerBassDrop() {
    if (!this.ctx || !this.masterVolume || this.ctx.state === "suspended") return;
    const now = this.ctx.currentTime;
    try {
      const drop = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      drop.type = "sine";
      drop.frequency.setValueAtTime(160, now);
      drop.frequency.exponentialRampToValueAtTime(30, now + 1.2); // Sweeps to deep ground rumble

      dropGain.gain.setValueAtTime(0.12, now);
      dropGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      drop.connect(dropGain);
      dropGain.connect(this.masterVolume);
      drop.start(now);
      drop.stop(now + 1.2);
    } catch (e) {
      console.warn("Bass drop failed", e);
    }
  }

  updateSceneIndex(idx: number) {
    this.currentSceneIdx = idx;
    if (idx === 1 && this.ctx) {
      // Trigger immense impact sound when transitioning to high-energy scenes
      this.triggerBassDrop();
    }
  }

  destroy() {
    if (this.activeInterval) {
      clearInterval(this.activeInterval);
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

// ==========================================
// CANVASES FOR LIVE GOLDEN SPARKS
// ==========================================

interface Spark {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
  gravity?: number;
}

const SparkParticleCanvas: React.FC<{
  isPlaying: boolean;
  currentTime: number;
  activeSceneIndex: number;
}> = ({ isPlaying, currentTime, activeSceneIndex }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = canvas.parentElement?.clientHeight || 450;
    };

    window.addEventListener("resize", handleResize);

    // Initial spark burst function
    const triggerSparkBurst = (x: number, y: number, count = 30, speedMult = 1, forceColor?: string) => {
      const colors = ["#f59e0b", "#fbbf24", "#fcd34d", "#ffffff", "#d97706"];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 4 + 1) * speedMult;
        sparksRef.current.push({
          x,
          y,
          size: Math.random() * 3 + 1,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed - 0.5,
          alpha: 1,
          color: forceColor || colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          maxLife: Math.random() * 60 + 30,
          gravity: 0.05
        });
      }
    };

    let lastSceneIdx = activeSceneIndex;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Handle Scene Changes for explosion triggers
      if (activeSceneIndex !== lastSceneIdx) {
        if (activeSceneIndex === 0) {
          // Spark ignition center
          triggerSparkBurst(width / 2, height / 2, 70, 1.8);
        } else if (activeSceneIndex === 3) {
          // Epic Fireworks trigger random spots
          for (let i = 0; i < 4; i++) {
            setTimeout(() => {
              triggerSparkBurst(
                Math.random() * width,
                Math.random() * (height * 0.6) + height * 0.1,
                40,
                1.5
              );
            }, i * 400);
          }
        } else if (activeSceneIndex === 1) {
          // Rapid flash sparkles
          triggerSparkBurst(width * 0.25, height * 0.5, 30, 1);
          triggerSparkBurst(width * 0.75, height * 0.5, 30, 1);
        }
        lastSceneIdx = activeSceneIndex;
      }

      // Continuous generator depending on active scene state
      if (isPlaying) {
        if (activeSceneIndex === 0) {
          // Spiral vortex sparks
          const colors = ["#fcd34d", "#f59e0b", "#ffffff"];
          const angle = Date.now() * 0.01;
          const radius = Math.sin(Date.now() * 0.002) * 40 + 20;
          sparksRef.current.push({
            x: width / 2 + Math.cos(angle) * radius,
            y: height / 2 + Math.sin(angle) * radius,
            size: Math.random() * 2.5 + 1,
            speedX: (Math.random() - 0.5) * 1.5,
            speedY: -Math.random() * 2 - 0.5,
            alpha: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 0,
            maxLife: Math.random() * 50 + 20
          });
        } else if (activeSceneIndex === 3) {
          // Intense firework drifts
          if (Math.random() < 0.3) {
            triggerSparkBurst(Math.random() * width, height * 0.9, 10, 0.8, "#f59e0b");
          }
        } else {
          // Standard upward luxury gold dust float
          if (Math.random() < 0.15) {
            sparksRef.current.push({
              x: Math.random() * width,
              y: height + 10,
              size: Math.random() * 2 + 0.5,
              speedX: (Math.random() - 0.5) * 0.8,
              speedY: -Math.random() * 1.5 - 0.4,
              alpha: Math.random() * 0.5 + 0.5,
              color: "#fbbf24",
              life: 0,
              maxLife: Math.random() * 120 + 80
            });
          }
        }
      }

      // Draw and Update Sparks
      sparksRef.current = sparksRef.current.filter((spark) => {
        spark.life++;
        spark.x += spark.speedX;
        spark.y += spark.speedY;
        if (spark.gravity) {
          spark.speedY += spark.gravity;
        }
        spark.alpha = 1 - spark.life / spark.maxLife;

        ctx.save();
        ctx.globalAlpha = Math.max(0, spark.alpha);
        ctx.fillStyle = spark.color;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();

        // Elegant glow overlay for larger particle stars
        if (spark.size > 2) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = spark.color;
          ctx.arc(spark.x, spark.y, spark.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        return spark.life < spark.maxLife && spark.y > -20 && spark.x > -20 && spark.x < width + 20;
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, activeSceneIndex]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-20 w-full h-full"
    />
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [scenes, setScenes] = useState<Scene[]>(BASE_SCENES);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [voiceOverEnabled, setVoiceOverEnabled] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);

  // Form states
  const [eventType, setEventType] = useState<string>("Bespoke Wedding");
  const [aestheticTheme, setAestheticTheme] = useState<string>("Imperial Black Marble & Orchids");
  const [customVision, setCustomVision] = useState<string>("");
  const [guestCount, setGuestCount] = useState<number>(350);
  const [location, setLocation] = useState<string>("Vatican-adjacent Historic Palace");

  // AI Storyboard output
  const [aiResponse, setAiResponse] = useState<CustomEventData | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Audio Engine reference
  const synthEngineRef = useRef<AventraAudioEngine | null>(null);

  // Speech TTS safety
  const speechCancelRef = useRef<(() => void) | null>(null);

  // Initialize synth engine on play
  const ensureAudioEngineInit = () => {
    if (!synthEngineRef.current) {
      synthEngineRef.current = new AventraAudioEngine();
      synthEngineRef.current.init();
      synthEngineRef.current.setMute(isMuted);
    }
  };

  // Sound Engine mute trigger
  useEffect(() => {
    if (synthEngineRef.current) {
      synthEngineRef.current.setMute(isMuted);
    }
  }, [isMuted]);

  // Handle Playback Interval
  useEffect(() => {
    let interval: any = null;
    const totalDuration = scenes[scenes.length - 1].timeEnd;

    if (isPlaying) {
      ensureAudioEngineInit();
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          let nextTime = prev + 0.1;
          if (nextTime >= totalDuration) {
            if (isLooping) {
              return 0; // Reset
            } else {
              setIsPlaying(false);
              return totalDuration;
            }
          }
          return parseFloat(nextTime.toFixed(1));
        });
      }, 100);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isLooping, scenes]);

  // Calculate Active Scene Index based on Current Time
  useEffect(() => {
    const idx = scenes.findIndex(
      (s) => currentTime >= s.timeStart && currentTime < s.timeEnd
    );
    if (idx !== -1 && idx !== activeSceneIdx) {
      setActiveSceneIdx(idx);
      if (synthEngineRef.current) {
        synthEngineRef.current.updateSceneIndex(idx);
      }

      // TTS voiceover sync
      if (voiceOverEnabled && isPlaying) {
        triggerNarratorVoice(scenes[idx].voiceover);
      }
    }
  }, [currentTime, scenes]);

  // Handle Mute/Play states when component unmounts
  useEffect(() => {
    return () => {
      if (synthEngineRef.current) {
        synthEngineRef.current.destroy();
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Browser TTS engine call
  const triggerNarratorVoice = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop current

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Find rich cinematic US voice or similar if present
    const deepVoice = voices.find(
      (v) => v.name.includes("Google US English") || 
             v.name.includes("Natural") || 
             v.name.includes("Daniel") || 
             v.name.includes("Male")
    );
    if (deepVoice) {
      utterance.voice = deepVoice;
    }
    
    utterance.rate = 0.82;   // Deep majestic slow tempo
    utterance.pitch = 0.78;  // High-class heavy voice pitch
    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    ensureAudioEngineInit();
    if (synthEngineRef.current && synthEngineRef.current.playProceduralPulse) {
      // Warm restart AudioContext on gesture
      const ctx = (synthEngineRef.current as any).ctx;
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
    }

    if (!isPlaying) {
      // Trigger voiceover for active scene on start
      if (voiceOverEnabled) {
        triggerNarratorVoice(scenes[activeSceneIdx].voiceover);
      }
    } else {
      window.speechSynthesis?.cancel();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setActiveSceneIdx(0);
    if (synthEngineRef.current) {
      synthEngineRef.current.updateSceneIndex(0);
    }
    window.speechSynthesis?.cancel();
    if (isPlaying) {
      if (voiceOverEnabled) triggerNarratorVoice(scenes[0].voiceover);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    const idx = scenes.findIndex((s) => val >= s.timeStart && val < s.timeEnd);
    if (idx !== -1) {
      setActiveSceneIdx(idx);
      if (synthEngineRef.current) {
        synthEngineRef.current.updateSceneIndex(idx);
      }
    }
    if (isPlaying && voiceOverEnabled && idx !== -1) {
      triggerNarratorVoice(scenes[idx].voiceover);
    }
  };

  // Connect to Express backend to run server-side Gemini API
  const handleGenerateCustomStoryboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          aestheticTheme,
          customVision: customVision || "An ultra-premium immersive gala pulling out all the stops.",
          guestCount,
          location
        })
      });

      if (!res.ok) {
        throw new Error("Server responded with error setting up custom storyboard.");
      }

      const data: CustomEventData = await res.json();
      setAiResponse(data);

      // Create Scene 6!
      const scene6: Scene = {
        id: 6,
        title: "CLIENT CODA",
        sub: "30 – 36 seconds",
        timeStart: 30,
        timeEnd: 36,
        // Match chosen aesthetic
        imageUrl: eventType.toLowerCase().includes("wedding") 
          ? "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200"
          : eventType.toLowerCase().includes("concert")
          ? "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200"
          : "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200",
        voiceover: data.voiceoverText,
        visualDirection: `${data.sceneTitle}: ${data.visualDescription}`,
        cameraMovement: "Bespoke cinematic macro-sweep, AI stabilized hyper-pan.",
        soundCue: data.musicCrescendo,
        highlightText: data.sceneTitle
      };

      // Append scene 6 to scenes list
      setScenes([...BASE_SCENES, scene6]);

      // Jump playback directly to T-30s so the user can see their custom sequence play out!
      setCurrentTime(30);
      setActiveSceneIdx(5);
      setIsPlaying(true);
      if (voiceOverEnabled) {
        // Delay slightly for dramatic impact
        setTimeout(() => {
          triggerNarratorVoice(data.voiceoverText);
        }, 500);
      }

    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintTimeline = () => {
    window.print();
  };

  return (
    <div id="aventra-root" className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D4AF37] selection:text-black relative overflow-x-hidden">
      
      {/* LUXURY GOLD GLOW AMBIENCE */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-[#D4AF37] opacity-[0.04] rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[55%] h-[55%] bg-[#C5A059] opacity-[0.06] rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)]" />
      </div>

      {/* HEADER BAR (PREMIUM NAVIGATION) */}
      <nav className="relative z-50 w-full p-6 md:p-8 flex flex-col md:flex-row justify-between items-center border-b border-white/10 bg-[#050505]/90 backdrop-blur-md gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-serif tracking-[0.2em] text-[#D4AF37] select-none flex items-center justify-center md:justify-start gap-2.5 font-bold">
            AVENTRA
            <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
          </h1>
          <p className="text-[9px] tracking-[0.4em] text-neutral-400 font-mono uppercase mt-1">
            Where Extraordinary Begins
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-[10px] uppercase tracking-[0.3em] font-medium opacity-80">
          <a href="#hero" className="hover:text-[#D4AF37] transition-colors">The Vision</a>
          <a href="#theater" className="hover:text-[#D4AF37] transition-colors">Commercial Player</a>
          <a href="#curator" className="hover:text-[#D4AF37] transition-colors">Concierge Planner</a>
          <a href="#services" className="hover:text-[#D4AF37] transition-colors">Bespoke Services</a>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase px-2 py-1 bg-white/[0.03] border border-[#D4AF37]/20 rounded">
            STORYBOARD v4.2
          </span>
          <div className="w-12 h-[1px] bg-[#D4AF37] hidden sm:block" />
        </div>
      </nav>

      {/* DYNAMIC BOLD TYPOGRAPHY HERO LANDING (SECTION 0: INTRO) */}
      <section id="hero" className="relative z-10 w-full pt-16 pb-12 flex flex-col items-center justify-center px-6 md:px-20 text-center max-w-7xl mx-auto">
        <div className="space-y-6 max-w-4xl">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.8em] text-[#D4AF37] mb-2 opacity-90 font-mono">
            Where Extraordinary Begins
          </p>
          
          <h1 className="text-[54px] sm:text-[90px] md:text-[140px] font-serif leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#EAD091] via-[#D4AF37] to-[#8A6E2F] select-none uppercase font-bold">
            AVENTRA
          </h1>
          
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-6" />
          
          <p className="max-w-2xl mx-auto text-base md:text-xl font-light tracking-wide italic opacity-75 leading-relaxed font-serif text-neutral-300">
            Every unforgettable moment... begins with a vision. From the whisper of a dream to the reality of history.
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main id="theater" className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-12 relative z-10">
        
        {/* SECTION 1: INTERACTIVE VIEWPORT THEATER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* THE CINEMATIC THEATER (9 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* VIEWPORT CARD FRAME */}
            <div className="relative group rounded-2xl border border-white/10 bg-neutral-950/40 overflow-hidden shadow-2xl gold-glow transition-all duration-700">
              
              {/* GLASS SHINE HOVER EFFECT */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/0 via-[#D4AF37]/5 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              {/* SCREEN TOP BEZEL */}
              <div className="bg-[#050505]/90 px-4 py-3 border-b border-white/10 flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                  <span>AVENTRA COMMERCIAL SYSTEM</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>RESOLVING: 4K HDR ULTRA-REALISTIC</span>
                  <span>T-MINUS COUNT: {currentTime}s</span>
                </div>
              </div>

              {/* VIDEO VIEWFINDER AREA (16:9 Aspect Ratio) */}
              <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
                
                {/* DYNAMIC BACKDROP SLIDESHOW WITH KEN BURNS EFFECT */}
                <AnimatePresence mode="wait">
                  {scenes.map((sc, index) => {
                    const isActive = activeSceneIdx === index;
                    if (!isActive) return null;
                    return (
                      <motion.div
                        key={sc.id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1.01 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full"
                      >
                        {/* THE CINEMATIC IMAGE WITH DARK LUXURY GRADIENT OVERLAY */}
                        <img
                          src={sc.imageUrl}
                          alt={sc.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover origin-center opacity-70 filter brightness-90 saturate-[0.65] contrast-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
                        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/30 to-black" />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* PROCEDURAL INTERACTIVE GOLD SPARKS CANVAS */}
                <SparkParticleCanvas 
                  isPlaying={isPlaying} 
                  currentTime={currentTime} 
                  activeSceneIndex={activeSceneIdx} 
                />

                {/* LIVE WATERMARK / LOGO OVERLAY */}
                <div className="absolute top-6 left-6 z-30 pointer-events-none flex items-center gap-2">
                  <div className="h-5 w-px bg-[#D4AF37]" />
                  <span className="font-serif text-sm tracking-[0.3em] text-neutral-200">AVENTRA CINEMATIC</span>
                </div>

                <div className="absolute top-6 right-6 z-30 font-mono text-[10px] tracking-widest text-[#D4AF37]/90 bg-black/60 px-2 py-1 rounded border border-white/10">
                  SCENE 0{activeSceneIdx + 1} / 0{scenes.length}
                </div>

                {/* ACTIVE SCENE OVERLAY LABELS */}
                <div className="absolute inset-x-0 bottom-0 z-30 p-6 md:p-8 flex flex-col justify-end text-center md:text-left gap-4 bg-gradient-to-t from-black via-black/90 to-transparent">
                  <div className="max-w-2xl">
                    <span className="text-xs font-mono tracking-[0.4em] text-[#D4AF37] uppercase">
                      Active Chapter: {scenes[activeSceneIdx].title}
                    </span>
                    
                    <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-white mt-1 leading-snug">
                      "{scenes[activeSceneIdx].highlightText}"
                    </h2>

                    {/* STORYBOARD CLOSED-CAPTION VOICE-OVER */}
                    <div className="mt-3 min-h-[44px]">
                      <p className="text-sm md:text-base text-neutral-300 italic font-serif leading-relaxed text-[#EAD091] pl-3 border-l border-[#D4AF37]/50">
                        {scenes[activeSceneIdx].voiceover}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PAUSED OVERLAY OVERVIEW */}
                {!isPlaying && currentTime === 0 && (
                  <div className="absolute inset-0 z-40 bg-black/85 flex flex-col items-center justify-center text-center p-6 gap-4">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div 
                        className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center cursor-pointer hover:bg-[#D4AF37]/20 transition-all duration-300 active:scale-95" 
                        onClick={handleTogglePlay}
                      >
                        <Play className="w-8 h-8 text-[#D4AF37] fill-[#D4AF37] ml-1" />
                      </div>
                      <h3 className="font-serif text-xl tracking-widest text-[#D4AF37] uppercase mt-2">
                        Play Brand Commercial
                      </h3>
                      <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                        Immerse yourself in our cinematic 30-second master narrative. Unmute the procedural audio synth and voice narrator for full Hollywood-level impact.
                      </p>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* PLAYBACK CONTROLS DECK */}
              <div className="bg-[#050505]/95 p-4 border-t border-white/10 flex flex-col md:flex-row items-center gap-4">
                
                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
                  <button
                    onClick={handleTogglePlay}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#EAD091] text-black text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-black" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-black" /> Play Commercial
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    title="Reset Timeline"
                    className="p-2.5 rounded-lg border border-white/10 hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* PROGRESS SLIDER */}
                <div className="flex items-center gap-3 flex-1 w-full font-mono text-xs text-neutral-400">
                  <span>00:00</span>
                  <input
                    type="range"
                    min="0"
                    max={scenes[scenes.length - 1].timeEnd}
                    step="0.1"
                    value={currentTime}
                    onChange={handleScrub}
                    className="flex-1 accent-[#D4AF37] bg-neutral-900 h-1.5 rounded-lg appearance-none cursor-pointer hover:bg-neutral-800 transition-all"
                  />
                  <span>
                    00:{scenes[scenes.length - 1].timeEnd < 10 ? `0${scenes[scenes.length - 1].timeEnd}` : scenes[scenes.length - 1].timeEnd}:00
                  </span>
                </div>

                {/* AUDIO CONTROLS */}
                <div className="flex items-center gap-2 justify-center w-full md:w-auto">
                  
                  {/* SOUNDTRACK VOLUME */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    title={isMuted ? "Unmute Procedural Soundtrack" : "Mute Procedural Soundtrack"}
                    className={`p-2 rounded-lg border transition-all cursor-pointer ${
                      isMuted 
                        ? "border-white/5 text-neutral-600" 
                        : "border-white/10 hover:border-[#D4AF37]/40 text-[#D4AF37]"
                    }`}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* VOICE NARRATION TOGGLE */}
                  <button
                    onClick={() => setVoiceOverEnabled(!voiceOverEnabled)}
                    title={voiceOverEnabled ? "Mute Narrator Voiceover" : "Enable Narrator Voiceover"}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer ${
                      voiceOverEnabled
                        ? "border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/10"
                        : "border-white/10 text-neutral-500"
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Narrator</span>
                  </button>

                  {/* LOOP TOGGLE */}
                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`px-3 py-2 rounded-lg border text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer ${
                      isLooping
                        ? "border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/10"
                        : "border-white/10 text-neutral-500"
                    }`}
                  >
                    Loop
                  </button>
                </div>

              </div>

            </div>

            {/* QUICK LEGEND AND DETAILS */}
            <div className="bg-[#050505]/40 border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-[#D4AF37]">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-semibold">Interactive Curation Tips</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Move the gold playhead to scrub scenes, or click any scene card in the panel to fast-forward!
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] font-mono text-neutral-500 border border-white/5 px-2 py-0.5 rounded">
                  Web Audio Synthesizer
                </span>
                <span className="text-[10px] font-mono text-neutral-500 border border-white/5 px-2 py-0.5 rounded">
                  HTML5 Particles
                </span>
              </div>
            </div>

          </div>

          {/* THE STORYBOARD STORY SCENES (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg tracking-wider text-[#D4AF37] uppercase font-semibold">
                Commercial Scenes
              </h3>
              <span className="font-mono text-xs text-neutral-500">
                {scenes.length} Sequence Cards
              </span>
            </div>

            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
              {scenes.map((sc, index) => {
                const isActive = activeSceneIdx === index;
                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      setCurrentTime(sc.timeStart);
                      setActiveSceneIdx(index);
                      if (synthEngineRef.current) {
                        synthEngineRef.current.updateSceneIndex(index);
                      }
                      if (voiceOverEnabled) {
                        triggerNarratorVoice(sc.voiceover);
                      }
                    }}
                    className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col gap-2 overflow-hidden ${
                      isActive
                        ? "border-[#D4AF37]/75 bg-[#D4AF37]/5 shadow-lg scale-[1.02] gold-glow"
                        : "border-white/5 bg-neutral-950/30 hover:border-[#D4AF37]/30 hover:scale-[1.01]"
                    }`}
                  >
                    {/* Background glow strip */}
                    <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${isActive ? "bg-[#D4AF37]" : "bg-neutral-800 group-hover:bg-neutral-600"}`} />

                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#D4AF37] tracking-widest font-bold uppercase">
                        SCENE 0{sc.id} • {sc.title}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-500 tracking-wider">
                        {sc.sub}
                      </span>
                    </div>

                    <h4 className="font-serif text-sm font-semibold tracking-wide text-neutral-200">
                      {sc.highlightText}
                    </h4>

                    {isActive && (
                      <motion.p 
                        layoutId="activeSub"
                        className="text-xs text-neutral-400 leading-relaxed italic pr-2"
                      >
                        {sc.visualDirection}
                      </motion.p>
                    )}

                    <div className="flex items-center gap-4 mt-1 pt-2 border-t border-white/5 text-[10px] font-mono text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Film className="w-3 h-3 text-[#D4AF37]/70" />
                        <span>Visual Draft</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>Start: {sc.timeStart}s</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* SECTION 2: AI STORYBOARD CURATOR SECTION */}
        <section id="curator" className="border-t border-white/10 pt-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* PLANNER CONCIERGE PANEL (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div>
                <h3 className="font-serif text-2xl tracking-wide text-[#D4AF37] uppercase flex items-center gap-2 font-bold">
                  <Compass className="w-6 h-6 text-[#D4AF37]" />
                  AVENTRA CONCIERGE
                </h3>
                <p className="text-xs text-neutral-400 tracking-wider font-mono uppercase mt-1">
                  Curate Your Dream Event Narrative
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed mt-3">
                  Pitch your event scale and theme. Our generative design suite will create a custom 6th scene in our cinematic commercial and a master 48-hour operational staging countdown timeline.
                </p>
              </div>

              <form onSubmit={handleGenerateCustomStoryboard} className="space-y-4 bg-neutral-950/40 p-6 rounded-2xl border border-white/10">
                
                {/* Event Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Event Category
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-neutral-200 outline-none focus:border-[#D4AF37] transition-colors"
                  >
                    <option value="Bespoke Wedding">Ultra-Premium Bespoke Wedding</option>
                    <option value="Global Tech Summit">Exclusive Corporate/Tech Summit</option>
                    <option value="Arena Rock Concert">Immersive Stadium Music Festival</option>
                    <option value="Brand Launch & Activations">High-End Luxury Brand Launch</option>
                    <option value="State Political Banquet">Dignified International State Dinner</option>
                    <option value="Private Island Soiree">Elite Private Island Gala</option>
                  </select>
                </div>

                {/* Aesthetic Theme */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Luxury Design Aesthetic
                  </label>
                  <select
                    value={aestheticTheme}
                    onChange={(e) => setAestheticTheme(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-neutral-200 outline-none focus:border-[#D4AF37] transition-colors"
                  >
                    <option value="Imperial Black Marble & Orchids">Imperial Black Marble & White Orchids</option>
                    <option value="Ethereal Golden Meadow & Candlelight">Ethereal Golden Meadow & Floating Candlelight</option>
                    <option value="Cyberpunk Neon Holographic Spectacle">Cyberpunk Neon Holographic Spectacle</option>
                    <option value="Cosmic Starry Night Volumetric Lighting">Cosmic Starry Night & Volumetric Sparkles</option>
                    <option value="Royal Renaissance Chateau & Gilded Accents">Royal Renaissance Chateau & Gilded Accents</option>
                  </select>
                </div>

                {/* Grid Inputs for capacity & location */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Guests */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Guest Capacity
                    </label>
                    <input
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-neutral-200 outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  {/* Location */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Venues Context
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-neutral-200 outline-none focus:border-[#D4AF37] transition-colors"
                      placeholder="e.g. Dubai desert dune resort"
                    />
                  </div>
                </div>

                {/* Custom Vision */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Special Custom Elements / Vision
                  </label>
                  <textarea
                    value={customVision}
                    onChange={(e) => setCustomVision(e.target.value)}
                    rows={3}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-neutral-200 outline-none focus:border-[#D4AF37] transition-colors resize-none placeholder:text-neutral-700"
                    placeholder="e.g. A suspended botanical glass pavilion over reflecting ponds with flying mechanical drone butterflies dispersing bespoke fragrances."
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#EAD091] text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-neutral-600 border-t-amber-500 rounded-full animate-spin" />
                      Consulting Lead Director...
                    </>
                  ) : (
                    <>
                      Create Custom Coda & operational blueprint
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {generationError && (
                  <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg flex items-start gap-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{generationError}</p>
                  </div>
                )}

              </form>

            </div>

            {/* GENERATIVE AI BLUEPRINT DISPLAY (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg tracking-wider text-[#D4AF37] uppercase font-semibold">
                  MASTER STRATEGY BLUEPRINT
                </h3>
                {aiResponse && (
                  <button
                    onClick={handlePrintTimeline}
                    className="flex items-center gap-1.5 text-xs font-mono text-[#D4AF37] hover:text-[#EAD091] transition-all border border-[#D4AF37]/20 px-3 py-1 rounded bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Print Master Brief
                  </button>
                )}
              </div>

              {/* DYNAMIC CARD INNER CONTAINER */}
              <div className="relative min-h-[400px] rounded-2xl border border-white/10 bg-neutral-950/20 p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-xl">
                
                {/* BLACK STONE VEIN EFFECT */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />

                {!aiResponse ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
                    <div className="p-4 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-[#D4AF37]/60 mb-2">
                      <Tv className="w-10 h-10" />
                    </div>
                    <h4 className="font-serif text-base text-neutral-300">
                      No Bespoke Proposal Loaded
                    </h4>
                    <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
                      Select your specifications on the concierge desk to generate a customized commercial addition (Scene 6) and operational timeline.
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6 relative z-10"
                  >
                    
                    {/* Scene 6 Overview banner */}
                    <div className="p-4 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                          COMMERCIAL UPDATE: PLAYABLE CODA UNLOCKED
                        </span>
                        <h4 className="font-serif text-base font-bold text-white mt-1">
                          Scene 6: {aiResponse.sceneTitle}
                        </h4>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-1 rounded">
                          T-30s to T-36s
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-1 rounded">
                          Dynamic Coda
                        </span>
                      </div>
                    </div>

                    {/* Script Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/5">
                        <h5 className="font-mono text-[10px] uppercase text-[#D4AF37] tracking-wider font-semibold">
                          Visual Sequence & Camera Move
                        </h5>
                        <p className="text-neutral-300 leading-relaxed mt-2 italic font-serif">
                          {aiResponse.visualDescription}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/5">
                        <h5 className="font-mono text-[10px] uppercase text-[#D4AF37] tracking-wider font-semibold">
                          Sound Cue & Audio Beat
                        </h5>
                        <p className="text-neutral-300 leading-relaxed mt-2">
                          {aiResponse.musicCrescendo}
                        </p>
                      </div>
                    </div>

                    {/* countdown scheduling */}
                    <div className="space-y-3">
                      <h5 className="font-mono text-[10px] uppercase text-[#D4AF37] tracking-widest font-semibold">
                        AVENTRA OPERATIONAL COUNTDOWN BLUEPRINT
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {aiResponse.timeline.map((step, idx) => (
                          <div key={idx} className="p-4 bg-neutral-950/80 border border-white/5 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-[10px] text-[#D4AF37] font-bold">
                                  {step.hours}
                                </span>
                                <span className="text-[10px] font-mono text-neutral-500">
                                  Step 0{idx + 1}
                                </span>
                              </div>
                              <h6 className="font-serif text-xs font-semibold text-neutral-200">
                                {step.phase}
                              </h6>
                              <p className="text-[11px] text-neutral-400 leading-normal mt-2">
                                {step.description}
                              </p>
                            </div>
                            <div className="border-t border-white/5 pt-2 mt-2 text-[10px] font-mono text-[#D4AF37]/70">
                              Target: {step.keyDeliverable}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Editorial Curatorial Coda */}
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] border-l-4 border-l-[#D4AF37]/80">
                      <h5 className="font-serif text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                        Director Curation Insights
                      </h5>
                      <p className="text-xs text-neutral-300 leading-relaxed mt-2 italic font-serif">
                        "{aiResponse.luxuryCurationInsights}"
                      </p>
                    </div>

                  </motion.div>
                )}

              </div>

            </div>

          </div>

        </section>

        {/* SECTION 3: SIGNATURE SERVICE CATEGORIES (FOUR COLUMNS FROM DESIGN HTML) */}
        <section id="services" className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/10 mt-12 bg-white/[0.01]">
          <div className="group border-r border-b lg:border-b-0 border-white/10 p-8 flex flex-col gap-4 hover:bg-white/[0.02] transition-colors duration-300">
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] opacity-60 font-mono">01 / Elite</span>
            <h3 className="text-xl font-serif tracking-wide text-neutral-100">Luxury Events</h3>
            <p className="text-[10px] leading-relaxed opacity-40 uppercase tracking-tighter text-neutral-300 font-mono">
              Curated for the distinguished few.
            </p>
          </div>
          <div className="group border-r border-b lg:border-b-0 border-white/10 p-8 flex flex-col gap-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300">
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] opacity-60 font-mono">02 / Impact</span>
            <h3 className="text-xl font-serif tracking-wide text-neutral-100">Global Summits</h3>
            <p className="text-[10px] leading-relaxed opacity-40 uppercase tracking-tighter text-neutral-300 font-mono">
              Architecting change on a global scale.
            </p>
          </div>
          <div className="group border-r border-b sm:border-b-0 border-white/10 p-8 flex flex-col gap-4 hover:bg-white/[0.02] transition-colors duration-300">
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] opacity-60 font-mono">03 / Spectacle</span>
            <h3 className="text-xl font-serif tracking-wide text-neutral-100">Cinematic Galas</h3>
            <p className="text-[10px] leading-relaxed opacity-40 uppercase tracking-tighter text-neutral-300 font-mono">
              Where art meets technical perfection.
            </p>
          </div>
          <div className="group p-8 flex flex-col gap-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300">
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] opacity-60 font-mono">04 / Legacy</span>
            <h3 className="text-xl font-serif tracking-wide text-neutral-100">Royal Weddings</h3>
            <p className="text-[10px] leading-relaxed opacity-40 uppercase tracking-tighter text-neutral-300 font-mono">
              Creating memories that transcend time.
            </p>
          </div>
        </section>

        {/* BRASS ACCENT STRIP / BRAND VISION */}
        <section className="border-t border-white/10 pt-16 pb-6 text-center max-w-4xl mx-auto flex flex-col gap-6 relative z-10">
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="w-12 h-px bg-[#D4AF37]/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          </div>
          <blockquote className="font-serif text-2xl md:text-3xl italic tracking-wide text-neutral-200 font-light leading-relaxed">
            "Creating Experiences. Inspiring Memories. We Don't Just Organize Events... We Create History."
          </blockquote>
          <p className="font-mono text-xs text-[#D4AF37] uppercase tracking-[0.4em] font-semibold">
            Luxury Events • Weddings • Corporate • Political • Concerts • Brand Activations
          </p>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full p-8 md:p-12 flex flex-col md:flex-row justify-between items-center bg-[#080808] border-t border-white/5 text-xs text-neutral-500 font-mono mt-12 gap-6">
        <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">
          © 2026 AVENTRA INTERNATIONAL. ALL RIGHTS RESERVED.
        </div>
        <div className="text-[11px] font-serif italic tracking-widest text-[#D4AF37]">
          "We Don't Just Organize Events... We Create History."
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] opacity-75 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all cursor-pointer font-serif italic">In</div>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] opacity-75 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all cursor-pointer font-serif italic">Ig</div>
        </div>
      </footer>

    </div>
  );
}
