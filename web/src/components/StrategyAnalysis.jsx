import './StrategyAnalysis.css'

function StrategyAnalysis({ videos }) {
  const extractStrategies = () => {
    const strategies = {
      canais: {},
      estrategias: {},
      crescimento: [],
      licoes: []
    }

    videos.forEach(video => {
      const text = video.analysis.toLowerCase()
      
      // Canais de divulgação
      const canaisRegex = /canais?.*?de divulga[çc]ão:([^0-9]*?)(?=\d\.|estratégias|$)/i
      const match = video.analysis.match(canaisRegex)
      if (match) {
        const canalText = match[1]
        if (canalText.includes('tiktok')) strategies.canais['TikTok'] = (strategies.canais['TikTok'] || 0) + 1
        if (canalText.includes('instagram')) strategies.canais['Instagram'] = (strategies.canais['Instagram'] || 0) + 1
        if (canalText.includes('email')) strategies.canais['Email'] = (strategies.canais['Email'] || 0) + 1
        if (canalText.includes('youtube')) strategies.canais['YouTube'] = (strategies.canais['YouTube'] || 0) + 1
        if (canalText.includes('facebook')) strategies.canais['Facebook'] = (strategies.canais['Facebook'] || 0) + 1
        if (canalText.includes('organic') || canalText.includes('seo')) strategies.canais['SEO/Organic'] = (strategies.canais['SEO/Organic'] || 0) + 1
      }
    })

    return strategies
  }

  const stats = extractStrategies()
  const topCanais = Object.entries(stats.canais)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <div className="strategy-analysis">
      <div className="analysis-container">
        <div className="analysis-card">
          <h2>📊 Canais de Divulgação Mais Utilizados</h2>
          <div className="chart">
            {topCanais.map(([canal, count]) => (
              <div key={canal} className="chart-item">
                <div className="chart-label">{canal}</div>
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ width: `${(count / topCanais[0][1]) * 100}%` }}
                  >
                    <span className="chart-value">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analysis-card">
          <h2>💡 Insights Principais</h2>
          <div className="insights">
            <div className="insight-item">
              <span className="insight-icon">🎯</span>
              <div>
                <h3>Estratégia Multi-Canal</h3>
                <p>A maioria dos produtos bem-sucedidos usa múltiplos canais de divulgação</p>
              </div>
            </div>
            <div className="insight-item">
              <span className="insight-icon">📱</span>
              <div>
                <h3>Presença em Redes Sociais</h3>
                <p>TikTok e Instagram são os canais com maior taxa de crescimento</p>
              </div>
            </div>
            <div className="insight-item">
              <span className="insight-icon">🤝</span>
              <div>
                <h3>Parcerias e Influenciadores</h3>
                <p>Colaborações são uma estratégia comum para acelerar crescimento</p>
              </div>
            </div>
            <div className="insight-item">
              <span className="insight-icon">📊</span>
              <div>
                <h3>Análise de Dados</h3>
                <p>Produtos que crescem mais rápido usam dados para otimizar estratégias</p>
              </div>
            </div>
          </div>
        </div>

        <div className="analysis-card full-width">
          <h2>📈 Padrões de Crescimento</h2>
          <div className="patterns">
            <div className="pattern">
              <h3>1️⃣ MVP + Marketing Direto</h3>
              <p>Desenvolver um MVP simples e começar a divulgar imediatamente, não esperar perfeição</p>
            </div>
            <div className="pattern">
              <h3>2️⃣ Comunidade First</h3>
              <p>Construir uma comunidade engajada é mais importante que números de download/user iniciais</p>
            </div>
            <div className="pattern">
              <h3>3️⃣ Feedback Loop</h3>
              <p>Ouvir feedback dos primeiros usuários e iterar rápido é essencial para retenção</p>
            </div>
            <div className="pattern">
              <h3>4️⃣ Conteúdo Educativo</h3>
              <p>Criar conteúdo sobre o problema que resolve atrai usuários mais qualificados</p>
            </div>
          </div>
        </div>

        <div className="analysis-card full-width">
          <h2>✅ Checklist de Estratégias</h2>
          <div className="checklist">
            <div className="check-item">
              <input type="checkbox" checked={true} readOnly />
              <span>Definir o público-alvo principal</span>
            </div>
            <div className="check-item">
              <input type="checkbox" checked={true} readOnly />
              <span>Escolher 2-3 canais principais para começar</span>
            </div>
            <div className="check-item">
              <input type="checkbox" checked={true} readOnly />
              <span>Criar conteúdo que resonate com o problema</span>
            </div>
            <div className="check-item">
              <input type="checkbox" checked={true} readOnly />
              <span>Engajar ativamente com early adopters</span>
            </div>
            <div className="check-item">
              <input type="checkbox" checked={true} readOnly />
              <span>Medir e otimizar continuamente</span>
            </div>
            <div className="check-item">
              <input type="checkbox" checked={true} readOnly />
              <span>Expandir para mais canais após validação</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StrategyAnalysis
