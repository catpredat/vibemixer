export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  videoUrl: string;
  category: string;
  mood: 'Calm' | 'Moody' | 'Energetic' | 'Focus';
}

const BASE_URL = 'https://tekdgdhorxifqprmgued.supabase.co/storage/v1/object/public/audio';
const VIDEO_BASE_URL = `${BASE_URL}/Videos`;

export const MUSIC_LIBRARY: Track[] = [
  // Calm
  {
    id: 'calm-01',
    title: 'Morning Coffee',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/calm-01-morning-coffee.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/calm-01-sunny-window.mp4`,
    category: 'Calm',
    mood: 'Calm',
  },
  {
    id: 'calm-02',
    title: 'Soft Breeze',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/calm-02-soft-breeze.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/calm-02-ocean-waves.mp4`,
    category: 'Calm',
    mood: 'Calm',
  },
  {
    id: 'calm-03',
    title: 'Sunset Piano',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/calm-03-sunset-piano.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/calm-03-forest-path.mp4`,
    category: 'Calm',
    mood: 'Calm',
  },
  {
    id: 'calm-04',
    title: 'Acoustic Zen',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/calm-04-acoustic-zen.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/calm-01-sunny-window.mp4`,
    category: 'Calm',
    mood: 'Calm',
  },
  {
    id: 'calm-05',
    title: 'Silent Sky',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/calm-05-silent-sky.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/calm-02-ocean-waves.mp4`,
    category: 'Calm',
    mood: 'Calm',
  },
  // Energetic
  {
    id: 'energy-01',
    title: 'Neon Drive',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/energy-01-neon-drive.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/energy-01-cyberpunk-neon.mp4`,
    category: 'Energetic',
    mood: 'Energetic',
  },
  {
    id: 'energy-02',
    title: 'Synthwave Pulse',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/energy-02-synthwave-pulse.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/energy-02-fast-train.mp4`,
    category: 'Energetic',
    mood: 'Energetic',
  },
  {
    id: 'energy-03',
    title: 'Upbeat Flow',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/energy-03-upbeat-flow.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/energy-01-cyberpunk-neon.mp4`,
    category: 'Energetic',
    mood: 'Energetic',
  },
  {
    id: 'energy-04',
    title: 'Pixel Run',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/energy-04-pixel-run.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/energy-02-fast-train.mp4`,
    category: 'Energetic',
    mood: 'Energetic',
  },
  {
    id: 'energy-05',
    title: 'Bright Future',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/energy-05-bright-future.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/energy-01-cyberpunk-neon.mp4`,
    category: 'Energetic',
    mood: 'Energetic',
  },
  // Focus
  {
    id: 'focus-01',
    title: 'Deep Work',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/focus-01-deep-work.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/focus-01-coffee-steam.mp4`,
    category: 'Focus',
    mood: 'Focus',
  },
  {
    id: 'focus-02',
    title: 'Alpha Waves',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/focus-02-alpha-waves.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/focus-02-library-shelf.mp4`,
    category: 'Focus',
    mood: 'Focus',
  },
  {
    id: 'focus-03',
    title: 'Lofi Study',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/focus-03-lofi-study.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/focus-01-coffee-steam.mp4`,
    category: 'Focus',
    mood: 'Focus',
  },
  {
    id: 'focus-04',
    title: 'Coding Flow',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/focus-04-coding-flow.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/focus-02-library-shelf.mp4`,
    category: 'Focus',
    mood: 'Focus',
  },
  {
    id: 'focus-05',
    title: 'Minimal Beat',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/focus-05-minimal-beat.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/focus-01-coffee-steam.mp4`,
    category: 'Focus',
    mood: 'Focus',
  },
  // Moody
  {
    id: 'moody-01',
    title: 'Midnight Rain',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/moody-01-midnight-rain.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/moody-01-rainy-city.mp4`,
    category: 'Moody',
    mood: 'Moody',
  },
  {
    id: 'moody-02',
    title: 'City Lights',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/moody-02-city-lights.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/moody-02-night-drive.mp4`,
    category: 'Moody',
    mood: 'Moody',
  },
  {
    id: 'moody-03',
    title: 'Noir Jazz',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/moody-03-noir-jazz.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/moody-03-empty-cafe.mp4`,
    category: 'Moody',
    mood: 'Moody',
  },
  {
    id: 'moody-04',
    title: 'Lost Memories',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/moody-04-lost-memories.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/moody-01-rainy-city.mp4`,
    category: 'Moody',
    mood: 'Moody',
  },
  {
    id: 'moody-05',
    title: 'Empty Room',
    artist: 'VibeMixer',
    url: `${BASE_URL}/Music/moody-05-empty-room.mp3`,
    videoUrl: `${VIDEO_BASE_URL}/moody-02-night-drive.mp4`,
    category: 'Moody',
    mood: 'Moody',
  },
];

export const AMBIENT_SOUNDS = {
  rain: {
    id: 'rain',
    name: 'Rain',
    url: `${BASE_URL}/Sounds/Rain.mp3`,
    icon: 'CloudRain',
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    url: `${BASE_URL}/Sounds/Forest.mp3`,
    icon: 'Trees',
  },
  thunder: {
    id: 'thunder',
    name: 'Thunder',
    url: `${BASE_URL}/Sounds/Thunder.mp3`,
    icon: 'CloudLightning',
  },
  wind: {
    id: 'wind',
    name: 'Wind',
    url: `${BASE_URL}/Sounds/Wind.mp3`,
    icon: 'Wind',
  },
  waves: {
    id: 'waves',
    name: 'Beachwave',
    url: `${BASE_URL}/Sounds/Wave.mp3`,
    icon: 'Waves',
  },
  cafe: {
    id: 'cafe',
    name: 'Bar & Cafe',
    url: `${BASE_URL}/Sounds/Bar.mp3`,
    icon: 'Coffee',
  },
};
