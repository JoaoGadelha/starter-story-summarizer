import './VideoCard.css'

function VideoCard({ video, onSelect }) {
  const extractHighlights = (analysis) => {
    const lines = analysis.split('\n').slice(0, 8)
    return lines.join('\n').slice(0, 200) + '...'
  }

  return (
    <div className="video-card" onClick={onSelect}>
      <div className="card-header">
        <h3 className="card-title">{video.title}</h3>
      </div>
      <div className="card-body">
        <p className="card-preview">{extractHighlights(video.analysis)}</p>
      </div>
      <div className="card-footer">
        <span className="card-date">{new Date(video.publishedAt).toLocaleDateString('pt-BR')}</span>
        <button className="card-btn">Ver Análise →</button>
      </div>
    </div>
  )
}

export default VideoCard
