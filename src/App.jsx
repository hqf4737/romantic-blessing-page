import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sha256 } from "js-sha256";

const PASSWORD_SALT = "romantic-blessing-page:";
const PASSWORD_DIGEST = [
  "997352dec18cdd3b",
  "aed6a64c35de5e39",
  "13b3c78ad0655103",
  "7623fb85b10151da"
].join("");

const tracks = [
  {
    title: "张国荣 - 明月夜",
    src: new URL("../assets/music/张国荣 - 明月夜.mp3", import.meta.url).href
  },
  {
    title: "徐化文（四熹丸子） - 远去的列车",
    src: new URL("../assets/music/徐化文（四熹丸子） - 远去的列车.mp3", import.meta.url).href
  },
  {
    title: "王菲 - 如愿",
    src: new URL("../assets/music/王菲 - 如愿.mp3", import.meta.url).href
  },
  {
    title: "袖姬 - 遇见一个人",
    src: new URL("../assets/music/袖姬 - 遇见一个人.mp3", import.meta.url).href
  }
];

const DEFAULT_TRACK_INDEX = Math.max(
  tracks.findIndex((track) => track.title === "徐化文（四熹丸子） - 远去的列车"),
  0
);

// Default development target: private version only.
const privateLines = [
  { type: "main", x: 50, y: 43.5, start: 0.05, gap: 0.24, step: 0.28, words: ["我希望", "我的", "女朋友，"] },
  { type: "main", x: 50, y: 48.4, start: 1.05, gap: 0.24, step: 0.28, words: ["永远", "被这个世界", "温柔以待……"] },
  { type: "blessing", x: 21.3, y: 15.6, start: 2.0, step: 0.2, words: ["天天", "开心"] },
  { type: "blessing", x: 78.7, y: 15.6, start: 2.42, step: 0.2, words: ["一生", "平安"] },
  { type: "blessing", x: 13.4, y: 37.35, start: 3.0, step: 0.2, words: ["没有", "烦恼"] },
  { type: "blessing", x: 86.6, y: 37.35, start: 3.42, step: 0.2, words: ["万事", "顺遂"] },
  { type: "blessing", x: 20.8, y: 83.1, start: 4.0, step: 0.2, words: ["被人", "偏爱"] },
  { type: "blessing", x: 79.2, y: 83.1, start: 4.42, step: 0.2, words: ["笑容", "常在"] },
  { type: "blessing", x: 50, y: 24.2, start: 5.0, step: 0.2, words: ["健康", "快乐"] },
  { type: "blessing", x: 50, y: 75.8, start: 5.42, step: 0.2, words: ["心想", "事成"] },
  { type: "blessing", x: 29.6, y: 31.0, start: 6.0, step: 0.2, words: ["永远", "漂亮"] },
  { type: "blessing", x: 70.4, y: 31.0, start: 6.42, step: 0.2, words: ["所遇", "皆温柔"] },
  { type: "blessing", x: 30.6, y: 69.0, start: 7.0, step: 0.2, words: ["岁岁", "无忧"] },
  { type: "blessing", x: 69.4, y: 69.0, start: 7.42, step: 0.2, words: ["梦想", "成真"] },
  { type: "final", x: 50, y: 59.9, start: 8.0, gap: 0.2, step: 0.3, words: ["愿你", "被爱，", "被珍惜，"] },
  { type: "final", x: 50, y: 64.85, start: 8.62, gap: 0.2, step: 0.2, words: ["也愿", "未来", "一直", "有我。"] }
];

// Public version is intentionally separate. Update this only when /public should change.
const publicLines = [
  { type: "main", x: 50, y: 43.5, start: 0.05, gap: 0.24, step: 0.28, words: ["我希望", "我爱的人，"] },
  { type: "main", x: 50, y: 48.4, start: 1.05, gap: 0.24, step: 0.28, words: ["永远", "被这个世界", "温柔以待……"] },
  { type: "blessing", x: 21.3, y: 15.6, start: 2.0, step: 0.2, words: ["天天", "开心"] },
  { type: "blessing", x: 78.7, y: 15.6, start: 2.42, step: 0.2, words: ["一生", "平安"] },
  { type: "blessing", x: 13.4, y: 37.35, start: 3.0, step: 0.2, words: ["没有", "烦恼"] },
  { type: "blessing", x: 86.6, y: 37.35, start: 3.42, step: 0.2, words: ["万事", "顺遂"] },
  { type: "blessing", x: 20.8, y: 83.1, start: 4.0, step: 0.2, words: ["被人", "偏爱"] },
  { type: "blessing", x: 79.2, y: 83.1, start: 4.42, step: 0.2, words: ["笑容", "常在"] },
  { type: "blessing", x: 50, y: 24.2, start: 5.0, step: 0.2, words: ["健康", "快乐"] },
  { type: "blessing", x: 50, y: 75.8, start: 5.42, step: 0.2, words: ["心想", "事成"] },
  { type: "blessing", x: 29.6, y: 31.0, start: 6.0, step: 0.2, words: ["永远", "漂亮"] },
  { type: "blessing", x: 70.4, y: 31.0, start: 6.42, step: 0.2, words: ["所遇", "皆温柔"] },
  { type: "blessing", x: 30.6, y: 69.0, start: 7.0, step: 0.2, words: ["岁岁", "无忧"] },
  { type: "blessing", x: 69.4, y: 69.0, start: 7.42, step: 0.2, words: ["梦想", "成真"] },
  { type: "final", x: 50, y: 59.9, start: 8.0, gap: 0.2, step: 0.3, words: ["愿你", "被爱，", "被珍惜，"] },
  { type: "final", x: 50, y: 64.85, start: 8.62, gap: 0.2, step: 0.2, words: ["也愿", "未来", "一直", "有我。"] }
];

function getIsPublicVersion() {
  if (typeof window === "undefined") {
    return false;
  }

  const pathname = window.location.pathname.replace(/\/+$/, "");
  const searchParams = new URLSearchParams(window.location.search);

  return pathname.endsWith("/public") || searchParams.get("public") === "1";
}

function getBlessingLines(isPublicVersion) {
  return isPublicVersion ? publicLines : privateLines;
}

function Icon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    "aria-hidden": true
  };

  switch (name) {
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect width="14" height="11" x="5" y="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "music":
      return (
        <svg {...common}>
          <path d="M9 18V5l10-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="16" cy="16" r="3" />
        </svg>
      );
    case "next":
      return (
        <svg {...common}>
          <path d="m7 6 7 6-7 6V6Z" />
          <path d="M17 6v12" />
        </svg>
      );
    case "pause":
      return (
        <svg {...common}>
          <path d="M8 5v14M16 5v14" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <path d="m8 5 11 7-11 7V5Z" />
        </svg>
      );
    case "prev":
      return (
        <svg {...common}>
          <path d="M7 6v12" />
          <path d="m17 6-7 6 7 6V6Z" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...common}>
          <path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <path d="M21 3v6h-6" />
        </svg>
      );
    case "speaker":
      return (
        <svg {...common}>
          <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
          <path d="M16 9.5a4 4 0 0 1 0 5" />
          <path d="M18.5 7a7 7 0 0 1 0 10" />
        </svg>
      );
    case "muted":
      return (
        <svg {...common}>
          <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
          <path d="m18 9 4 4M22 9l-4 4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
  }
}

function hashPassword(password) {
  return sha256(`${PASSWORD_SALT}${password}`);
}

function wrapTrack(index) {
  return (index + tracks.length) % tracks.length;
}

function PasswordGate({ onUnlock }) {
  const inputRef = useRef(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (isChecking) {
      return;
    }

    setIsChecking(true);
    setError("");

    try {
      const digest = hashPassword(password.trim());

      if (digest === PASSWORD_DIGEST) {
        onUnlock();
        return;
      }

      setError("密码不对");
      setPassword("");
      inputRef.current?.focus();
    } catch {
      setError("当前浏览器不支持安全校验");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <main className="stage lock-screen" aria-label="密码进入">
      <form className="lock-form" onSubmit={handleSubmit}>
        <div className="lock-mark" aria-hidden="true">
          <Icon name="lock" />
        </div>
        <label className="lock-label" htmlFor="password">
          请输入密码
        </label>
        <input
          ref={inputRef}
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          aria-invalid={Boolean(error)}
        />
        <button className="enter-button" type="submit" disabled={isChecking}>
          进入
        </button>
        <p className="lock-error" role="alert">
          {error}
        </p>
      </form>
    </main>
  );
}

function HomeMenu({ isOpen, onToggle }) {
  return (
    <nav className={`site-menu ${isOpen ? "is-open" : ""}`} aria-label="页面菜单">
      <button
        className="icon-button menu-toggle"
        type="button"
        title={isOpen ? "收起菜单" : "打开菜单"}
        aria-label={isOpen ? "收起菜单" : "打开菜单"}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <Icon name={isOpen ? "close" : "menu"} />
      </button>
      <div className="menu-panel">
        <button className="menu-item" type="button" onClick={onToggle}>
          主页
        </button>
      </div>
    </nav>
  );
}

function BlessingLines({ blessingLines, replayKey }) {
  return blessingLines.map((line, lineIndex) => (
    <div
      className={`text-line ${line.type}`}
      key={`${replayKey}-${lineIndex}`}
      style={{
        "--x": `${line.x}%`,
        "--y": `${line.y}%`,
        "--gap": `${line.gap ?? 0.18}em`
      }}
    >
      {line.words.map((word, wordIndex) => (
        <span
          className="word"
          key={`${word}-${wordIndex}`}
          style={{
            "--delay": `${line.start + wordIndex * line.step}s`,
            "--dx": `${(wordIndex % 2 === 0 ? -1 : 1) * (8 + wordIndex * 2)}px`
          }}
        >
          {word}
        </span>
      ))}
    </div>
  ));
}

function Sparkles({ replayKey }) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 100 }, (_, index) => {
        const size = 1 + Math.random() * 2.4;

        return {
          alpha: 0.16 + Math.random() * 0.42,
          delay: Math.random() * 7.8,
          duration: 1.8 + Math.random() * 2.8,
          id: `${replayKey}-${index}`,
          size,
          x: 2 + Math.random() * 96,
          y: 4 + Math.random() * 92
        };
      }),
    [replayKey]
  );

  return sparkles.map((spark) => (
    <i
      className="spark"
      key={spark.id}
      style={{
        "--alpha": spark.alpha,
        "--delay": `${spark.delay}s`,
        "--duration": `${spark.duration}s`,
        "--size": `${spark.size}px`,
        "--x": `${spark.x}%`,
        "--y": `${spark.y}%`
      }}
    />
  ));
}

function FloatingControls({
  currentTrack,
  isMuted,
  isPlaying,
  isPlayerOpen,
  isToolsOpen,
  onNext,
  onPrev,
  onReplay,
  onToggleMute,
  onTogglePlay,
  onTogglePlayer,
  onToggleTools
}) {
  return (
    <div className={`float-tools ${isToolsOpen ? "is-open" : ""}`}>
      <section className="music-player" aria-label="背景音乐播放器" hidden={!isPlayerOpen}>
        <div className="track-name">{tracks[currentTrack].title}</div>
        <div className="player-controls">
          <button className="icon-button player-button" type="button" title="上一首" aria-label="上一首" onClick={onPrev}>
            <Icon name="prev" />
          </button>
          <button className="icon-button player-button" type="button" title="播放/暂停" aria-label="播放/暂停" onClick={onTogglePlay}>
            <Icon name={isPlaying ? "pause" : "play"} />
          </button>
          <button className="icon-button player-button" type="button" title="下一首" aria-label="下一首" onClick={onNext}>
            <Icon name="next" />
          </button>
          <button className="icon-button player-button" type="button" title="静音" aria-label="静音" onClick={onToggleMute}>
            <Icon name={isMuted ? "muted" : "speaker"} />
          </button>
        </div>
      </section>
      <div className="fab-actions" aria-label="快捷按钮">
        <button className="icon-button fab-button" type="button" title="重播" aria-label="重播" onClick={onReplay}>
          <Icon name="refresh" />
        </button>
        <button
          className={`icon-button fab-button ${isPlayerOpen ? "is-active" : ""}`}
          type="button"
          title="播放器"
          aria-label="播放器"
          aria-expanded={isPlayerOpen}
          onClick={onTogglePlayer}
        >
          <Icon name="music" />
        </button>
      </div>
      <button
        className="icon-button fab-toggle"
        type="button"
        title={isToolsOpen ? "收起快捷按钮" : "打开快捷按钮"}
        aria-label={isToolsOpen ? "收起快捷按钮" : "打开快捷按钮"}
        aria-expanded={isToolsOpen}
        onClick={onToggleTools}
      >
        <Icon name={isToolsOpen ? "close" : "plus"} />
      </button>
    </div>
  );
}

export default function App() {
  const audioRef = useRef(null);
  const isPublicVersion = useMemo(() => getIsPublicVersion(), []);
  const blessingLines = useMemo(() => getBlessingLines(isPublicVersion), [isPublicVersion]);
  const [isUnlocked, setIsUnlocked] = useState(isPublicVersion);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [trackIndex, setTrackIndex] = useState(DEFAULT_TRACK_INDEX);

  const isAudioPlaying = useCallback(() => {
    const audio = audioRef.current;
    return Boolean(audio && !audio.paused);
  }, []);

  const playAudio = useCallback(async ({ showPlayer = true } = {}) => {
    const audio = audioRef.current;

    if (!audio) {
      return false;
    }

    if (showPlayer) {
      setIsPlayerOpen(true);
    }

    try {
      await audio.play();
      setIsPlaying(true);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }, []);

  const loadTrack = useCallback(
    (index, shouldPlay = false, showPlayer = shouldPlay) => {
      const nextIndex = wrapTrack(index);
      const audio = audioRef.current;

      setTrackIndex(nextIndex);

      if (audio) {
        audio.src = tracks[nextIndex].src;
        audio.muted = isMuted;
        audio.load();
      }

      if (shouldPlay) {
        void playAudio({ showPlayer });
      }
    },
    [isMuted, playAudio]
  );

  const pauseAudio = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const unlockPage = useCallback(() => {
    void playAudio({ showPlayer: false });
    setIsUnlocked(true);
  }, [playAudio]);

  function replay() {
    setReplayKey((value) => value + 1);
  }

  function toggleTools() {
    setIsToolsOpen((value) => {
      const next = !value;

      if (!next) {
        setIsPlayerOpen(false);
      }

      return next;
    });
  }

  function togglePlayer() {
    setIsPlayerOpen((value) => !value);
  }

  function togglePlay() {
    if (isPlaying) {
      pauseAudio();
      return;
    }

    void playAudio();
  }

  function toggleMute() {
    setIsMuted((value) => {
      const next = !value;

      if (audioRef.current) {
        audioRef.current.muted = next;
      }

      return next;
    });
  }

  function nextTrack() {
    loadTrack(trackIndex + 1, isAudioPlaying());
  }

  function prevTrack() {
    loadTrack(trackIndex - 1, isAudioPlaying());
  }

  function handleEnded() {
    loadTrack(trackIndex + 1, true, false);
  }

  return (
    <>
      {isUnlocked ? (
        <main className="stage" id="home" aria-label="愿你被爱，被珍惜，也愿未来一直有我。">
          <Sparkles replayKey={replayKey} />
          <div className="shooting-light" key={`light-${replayKey}`} />
          <HomeMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen((value) => !value)} />
          <BlessingLines blessingLines={blessingLines} replayKey={replayKey} />
          <FloatingControls
            currentTrack={trackIndex}
            isMuted={isMuted}
            isPlaying={isPlaying}
            isPlayerOpen={isPlayerOpen}
            isToolsOpen={isToolsOpen}
            onNext={nextTrack}
            onPrev={prevTrack}
            onReplay={replay}
            onToggleMute={toggleMute}
            onTogglePlay={togglePlay}
            onTogglePlayer={togglePlayer}
            onToggleTools={toggleTools}
          />
        </main>
      ) : (
        <PasswordGate onUnlock={unlockPage} />
      )}
      <audio
        ref={audioRef}
        src={tracks[trackIndex].src}
        muted={isMuted}
        onEnded={handleEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        preload="auto"
      />
    </>
  );
}
