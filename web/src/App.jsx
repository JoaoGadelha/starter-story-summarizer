import { useState, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import VideoCard from './components/VideoCard'
import StrategyAnalysis from './components/StrategyAnalysis'
import './App.css'

function App() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [view, setView] = useState('grid')

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
      const response = await fetch(`${apiUrl}/videos`)
      const data = await response.json()
      setVideos(data)
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Carregando análises...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎬 Análise de Estratégias - Starter Story</h1>
          <p>Extração de técnicas de divulgação e marketing dos vídeos</p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-number">{videos.length}</span>
            <span className="stat-label">Vídeos Analisados</span>
          </div>
        </div>
      </header>

      <div className="controls">
        <button 
          className={`view-btn ${view === 'grid' ? 'active' : ''}`}
          onClick={() => setView('grid')}
        >
          📊 Grade
        </button>
        <button 
          className={`view-btn ${view === 'analysis' ? 'active' : ''}`}
          onClick={() => setView('analysis')}
        >
          📈 Análise Consolidada
        </button>
      </div>

      {view === 'grid' ? (
        <div className="videos-grid">
          {videos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video}
              onSelect={() => setSelectedVideo(video)}
            />
          ))}
        </div>
      ) : (
        <StrategyAnalysis videos={videos} />
      )}

      {selectedVideo && (
        <div className="modal" onClick={() => setSelectedVideo(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h2>{selectedVideo.title}</h2>
                <a href={`https://youtube.com/watch?v=${selectedVideo.videoId}`} target="_blank" rel="noopener noreferrer" className="youtube-link-header">
                  🎬 Ver no YouTube
                </a>
              </div>
              <button className="close-btn" onClick={() => setSelectedVideo(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="analysis-content">
                <ReactMarkdown>{selectedVideo.analysis}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
