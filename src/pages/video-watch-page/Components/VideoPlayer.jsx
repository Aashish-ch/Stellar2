import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoPlayer = ({ video, onFullscreen }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('1080p');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const qualityOptions = [
    { value: '2160p', label: '4K (2160p)' },
    { value: '1440p', label: 'QHD (1440p)' },
    { value: '1080p', label: 'FHD (1080p)' },
    { value: '720p', label: 'HD (720p)' },
    { value: '480p', label: 'SD (480p)' },
    { value: '360p', label: 'LD (360p)' }
  ];

  const speedOptions = [
    { value: 0.25, label: '0.25x' },
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: 'Normal' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' }
  ];

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video?.currentTime);
    const handleDurationChange = () => setDuration(video?.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('durationchange', handleDurationChange);
    video?.addEventListener('play', handlePlay);
    video?.addEventListener('pause', handlePause);

    return () => {
      video?.removeEventListener('timeupdate', handleTimeUpdate);
      video?.removeEventListener('durationchange', handleDurationChange);
      video?.removeEventListener('play', handlePlay);
      video?.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef?.current;
    if (video?.paused) {
      video?.play();
    } else {
      video?.pause();
    }
  };

  const handleSeek = (e) => {
    const video = videoRef?.current;
    const rect = e?.currentTarget?.getBoundingClientRect();
    const pos = (e?.clientX - rect?.left) / rect?.width;
    video.currentTime = pos * duration;
  };

  const handleVolumeChange = (newVolume) => {
    const video = videoRef?.current;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef?.current;
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef?.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
      onFullscreen?.(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      onFullscreen?.(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef?.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full aspect-video object-cover"
        src={video?.videoUrl}
        poster={video?.thumbnail}
        onClick={togglePlay}
        onLoadedMetadata={() => setDuration(videoRef?.current?.duration)}
      />
      {/* Play/Pause Overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Icon name="Play" size={32} color="white" />
          </div>
        )}
      </div>
      {/* Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Progress Bar */}
        <div className="mb-4">
          <div 
            className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-primary rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
            </Button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                <Icon 
                  name={isMuted ? "VolumeX" : volume > 0.5 ? "Volume2" : "Volume1"} 
                  size={20} 
                />
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e?.target?.value))}
                className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Time */}
            <span className="text-white text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quality */}
            <div className="relative group/quality">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                {quality}
              </Button>
              <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg py-2 opacity-0 group-hover/quality:opacity-100 transition-opacity">
                {qualityOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => setQuality(option?.value)}
                    className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/20 ${
                      quality === option?.value ? 'text-primary' : 'text-white'
                    }`}
                  >
                    {option?.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed */}
            <div className="relative group/speed">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                {playbackSpeed}x
              </Button>
              <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg py-2 opacity-0 group-hover/speed:opacity-100 transition-opacity">
                {speedOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => {
                      setPlaybackSpeed(option?.value);
                      videoRef.current.playbackRate = option?.value;
                    }}
                    className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/20 ${
                      playbackSpeed === option?.value ? 'text-primary' : 'text-white'
                    }`}
                  >
                    {option?.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              <Icon name={isFullscreen ? "Minimize" : "Maximize"} size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;