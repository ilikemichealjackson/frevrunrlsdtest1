import React, { useState, useRef, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom'
import { Play, Pause, SkipBack, SkipForward, Volume2, Home, Search, Library, PlusCircle, Heart, Music } from 'lucide-react'

// Mock data for songs with added color schemes
const allSongs = [
  { id: 1, title: 'Ethereal Echoes', artist: 'Luna Drift', file: '/music/song1.mp3', duration: 180, colors: { primary: '#4A0E4E', secondary: '#89229b', accent: '#c471ed' } },
  { id: 2, title: 'Neon Nights', artist: 'Cyber Punk', file: '/music/song2.mp3', duration: 210, colors: { primary: '#0A2342', secondary: '#2CA58D', accent: '#84BC9C' } },
  { id: 3, title: 'Velvet Dreams', artist: 'Midnight Mirage', file: '/music/song3.mp3', duration: 195, colors: { primary: '#2C0735', secondary: '#6B0F1A', accent: '#B91372' } },
  { id: 4, title: 'Cosmic Voyage', artist: 'Stellar Winds', file: '/music/song4.mp3', duration: 225, colors: { primary: '#0B3D91', secondary: '#1E5F74', accent: '#4CC9F0' } },
  { id: 5, title: 'Electric Pulse', artist: 'Neon Pulse', file: '/music/song5.mp3', duration: 188, colors: { primary: '#240046', secondary: '#3C096C', accent: '#5A189A' } },
]

function AudioWave({ accentColor }) {
  return (
    <svg className="w-full h-8" viewBox="0 0 200 40">
      {[...Array(20)].map((_, i) => (
        <rect
          key={i}
          x={i * 10}
          y={20 - Math.random() * 20}
          width="4"
          height={Math.random() * 20 + 5}
          fill={accentColor}
          opacity={0.7 + Math.random() * 0.3}
        >
          <animate
            attributeName="height"
            values={`${Math.random() * 20 + 5};${Math.random() * 20 + 5};${Math.random() * 20 + 5}`}
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values={`${20 - Math.random() * 20};${20 - Math.random() * 20};${20 - Math.random() * 20}`}
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </svg>
  )
}

function SongList({ songs, currentSong, setCurrentSong, setIsPlaying, toggleFavorite, favorites, accentColor }) {
  return (
    <ul className="space-y-2">
      {songs.map(song => (
        <li
          key={song.id}
          className={`py-4 px-6 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-between ${
            currentSong.id === song.id ? `bg-opacity-80 shadow-md` : 'hover:bg-opacity-20'
          }`}
          style={{
            backgroundColor: currentSong.id === song.id ? accentColor : 'transparent',
            color: currentSong.id === song.id ? '#ffffff' : 'inherit',
          }}
        >
          <div className="flex items-center flex-grow" onClick={() => {
            setCurrentSong(song)
            setIsPlaying(true)
          }}>
            <Music size={24} className="mr-4" style={{ color: currentSong.id === song.id ? '#ffffff' : accentColor }} />
            <div>
              <div className="font-semibold">{song.title}</div>
              <div className={`text-sm ${currentSong.id === song.id ? 'text-gray-200' : 'text-gray-400'}`}>{song.artist}</div>
            </div>
          </div>
          <button
            onClick={() => toggleFavorite(song.id)}
            className={`p-2 rounded-full ${favorites.includes(song.id) ? 'text-red-500' : 'text-gray-400'} hover:bg-opacity-20`}
            style={{ backgroundColor: currentSong.id === song.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent' }}
          >
            <Heart size={20} fill={favorites.includes(song.id) ? 'currentColor' : 'none'} />
          </button>
        </li>
      ))}
    </ul>
  )
}

function HomePage({ songs, currentSong, setCurrentSong, setIsPlaying, toggleFavorite, favorites, accentColor }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Home</h1>
      <SongList
        songs={songs}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        setIsPlaying={setIsPlaying}
        toggleFavorite={toggleFavorite}
        favorites={favorites}
        accentColor={accentColor}
      />
    </div>
  )
}

function DiscoverPage({ songs, currentSong, setCurrentSong, setIsPlaying, toggleFavorite, favorites, accentColor }) {
  const [searchTerm, setSearchTerm] = useState('')
  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Discover</h1>
      <input
        type="text"
        placeholder="Search songs or artists..."
        className="w-full p-2 mb-4 bg-opacity-20 bg-black rounded-lg text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <SongList
        songs={filteredSongs}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        setIsPlaying={setIsPlaying}
        toggleFavorite={toggleFavorite}
        favorites={favorites}
        accentColor={accentColor}
      />
    </div>
  )
}

function FavoritesPage({ songs, currentSong, setCurrentSong, setIsPlaying, toggleFavorite, favorites, accentColor }) {
  const favoriteSongs = songs.filter(song => favorites.includes(song.id))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      <SongList
        songs={favoriteSongs}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        setIsPlaying={setIsPlaying}
        toggleFavorite={toggleFavorite}
        favorites={favorites}
        accentColor={accentColor}
      />
    </div>
  )
}

function LibraryPage({ playlists, setPlaylists, accentColor }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Library</h1>
      <ul className="space-y-2">
        {playlists.map(playlist => (
          <li key={playlist.id} className="py-2 px-4 bg-opacity-20 bg-black rounded-lg transition-all duration-300 hover:bg-opacity-30">
            {playlist.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CreatePlaylistPage({ setPlaylists, accentColor }) {
  const [playlistName, setPlaylistName] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (playlistName.trim()) {
      setPlaylists(prev => [...prev, { id: Date.now(), name: playlistName.trim() }])
      setPlaylistName('')
      navigate('/library')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Playlist</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter playlist name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          className="w-full p-2 bg-opacity-20 bg-black rounded-lg text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-80"
          style={{ backgroundColor: accentColor }}
        >
          Create Playlist
        </button>
      </form>
    </div>
  )
}

export default function MusicStreamer() {
  const [currentSong, setCurrentSong] = useState(allSongs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [favorites, setFavorites] = useState([])
  const [playlists, setPlaylists] = useState([{ id: 1, name: 'My Playlist' }])
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [isPlaying, currentSong])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    audio.addEventListener('timeupdate', updateProgress)
    return () => audio.removeEventListener('timeupdate', updateProgress)
  }, [])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const playNext = () => {
    const currentIndex = allSongs.findIndex(song => song.id === currentSong.id)
    const nextSong = allSongs[(currentIndex + 1) % allSongs.length]
    setCurrentSong(nextSong)
    setIsPlaying(true)
  }

  const playPrevious = () => {
    const currentIndex = allSongs.findIndex(song => song.id === currentSong.id)
    const previousSong = allSongs[(currentIndex - 1 + allSongs.length) % allSongs.length]
    setCurrentSong(previousSong)
    setIsPlaying(true)
  }

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  return (
    <Router>
      <div 
        className="flex flex-col h-screen text-white transition-all duration-700"
        style={{
          background: `linear-gradient(to bottom right, ${currentSong.colors.primary}, ${currentSong.colors.secondary})`
        }}
      >
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-black bg-opacity-20 p-4 rounded-tr-3xl shadow-lg backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-6 px-4">Melodify</h2>
            <ul>
              <li className="mb-2">
                <Link to="/" className="flex items-center py-3 px-4 hover:bg-white hover:bg-opacity-10 rounded-xl transition-all duration-200">
                  <Home size={20} className="mr-3" style={{ color: currentSong.colors.accent }} />
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/discover" className="flex items-center py-3 px-4 hover:bg-white hover:bg-opacity-10 rounded-xl transition-all duration-200">
                  <Search size={20} className="mr-3" style={{ color: currentSong.colors.accent }} />
                  Discover
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/favorites" className="flex items-center py-3 px-4 hover:bg-white hover:bg-opacity-10 rounded-xl transition-all duration-200">
                  <Heart size={20} className="mr-3" style={{ color: currentSong.colors.accent }} />
                  My Favorites
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/library" className="flex items-center py-3 px-4 hover:bg-white hover:bg-opacity-10 rounded-xl transition-all duration-200">
                  <Library size={20} className="mr-3" style={{ color: currentSong.colors.accent }} />
                  Library
                </Link>
              </li>
              <li>
                <Link to="/create-playlist" className="flex items-center py-3 px-4 hover:bg-white hover:bg-opacity-10 rounded-xl transition-all duration-200">
                  <PlusCircle size={20} className="mr-3" style={{ color: currentSong.colors.accent }} />
                  Create Playlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Main content */}
          <div className="flex-1 bg-black bg-opacity-20 p-8 overflow-y-auto rounded-tl-3xl shadow-inner backdrop-blur-md">
            <Routes>
              <Route path="/" element={<HomePage songs={allSongs} currentSong={currentSong} setCurrentSong={setCurrentSong} setIsPlaying={setIsPlaying} toggleFavorite={toggleFavorite} favorites={favorites} accentColor={currentSong.colors.accent} />} />
              <Route path="/discover" element={<DiscoverPage songs={allSongs} currentSong={currentSong} setCurrentSong={setCurrentSong} setIsPlaying={setIsPlaying} toggleFavorite={toggleFavorite} favorites={favorites} accentColor={currentSong.colors.accent} />} />
              <Route path="/favorites" element={<FavoritesPage songs={allSongs} currentSong={currentSong} setCurrent

Song={setCurrentSong} setIsPlaying={setIsPlaying} toggleFavorite={toggleFavorite} favorites={favorites} accentColor={currentSong.colors.accent} />} />
              <Route path="/library" element={<LibraryPage playlists={playlists} setPlaylists={setPlaylists} accentColor={currentSong.colors.accent} />} />
              <Route path="/create-playlist" element={<CreatePlaylistPage setPlaylists={setPlaylists} accentColor={currentSong.colors.accent} />} />
            </Routes>
          </div>
        </div>

        {/* Player controls */}
        <div className="h-28 bg-black bg-opacity-30 border-t border-white border-opacity-10 flex flex-col justify-end px-4 pb-4 relative backdrop-blur-md">
          <div className="absolute top-0 left-0 right-0">
            <AudioWave accentColor={currentSong.colors.accent} />
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-1 mb-4">
            <div
              className="h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: currentSong.colors.accent }}
            ></div>
          </div>
          <div className="flex items-center">
            <div className="w-1/3 flex items-center">
              <Music size={40} className="mr-4" style={{ color: currentSong.colors.accent }} />
              <div>
                <div className="font-semibold">{currentSong.title}</div>
                <div className="text-sm text-gray-300">{currentSong.artist}</div>
              </div>
            </div>
            <div className="w-1/3 flex justify-center items-center space-x-6">
              <button onClick={playPrevious} className="text-white hover:text-opacity-80 transition-colors duration-200">
                <SkipBack size={28} />
              </button>
              <button
                onClick={togglePlay}
                className="text-white rounded-full p-4 transition-colors duration-200 shadow-lg"
                style={{ backgroundColor: currentSong.colors.accent }}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
              <button onClick={playNext} className="text-white hover:text-opacity-80 transition-colors duration-200">
                <SkipForward size={28} />
              </button>
            </div>
            <div className="w-1/3 flex justify-end items-center">
              <Volume2 size={24} className="text-white mr-2" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24"
                style={{ accentColor: currentSong.colors.accent }}
              />
            </div>
          </div>
          <audio ref={audioRef} src={currentSong.file} />
        </div>
      </div>
    </Router>
  )
}