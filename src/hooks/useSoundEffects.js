import { useCallback, useRef, useEffect } from 'react';

const sounds = {
  laserFire: `${import.meta.env.BASE_URL}sounds/laser-fire.mp3`,
  torpedoFire: `${import.meta.env.BASE_URL}sounds/torpedo-fire.mp3`,
  shieldHit: `${import.meta.env.BASE_URL}sounds/shield-hit.mp3`,
  hyperdriveCharge: `${import.meta.env.BASE_URL}sounds/hyperdrive-charge.mp3`,
  alarmCritical: `${import.meta.env.BASE_URL}sounds/alarm-critical.mp3`,
};

export function useSoundEffects() {
  const audioCache = useRef({});
  const isMuted = useRef(false);

  // Preload audio files
  useEffect(() => {
    Object.entries(sounds).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audioCache.current[key] = audio;
    });

    // Check if user has muted sounds (stored in localStorage)
    const mutedState = localStorage.getItem('spaceCombatSoundsMuted');
    if (mutedState === 'true') {
      isMuted.current = true;
    }
  }, []);

  const play = useCallback((soundName, volume = 0.5) => {
    if (isMuted.current) return;
    
    const audio = audioCache.current[soundName];
    if (audio) {
      // Clone the audio to allow overlapping sounds
      const soundInstance = audio.cloneNode();
      soundInstance.volume = volume;
      soundInstance.play().catch(err => {
        // Silently fail if autoplay is blocked
        console.warn('Sound playback failed:', err);
      });
    }
  }, []);

  const toggleMute = useCallback(() => {
    isMuted.current = !isMuted.current;
    localStorage.setItem('spaceCombatSoundsMuted', isMuted.current.toString());
    return isMuted.current;
  }, []);

  const getMutedState = useCallback(() => {
    return isMuted.current;
  }, []);

  return { play, toggleMute, getMutedState };
}
