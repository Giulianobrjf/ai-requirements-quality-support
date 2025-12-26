import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('generation');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dots, setDots] = useState('');

  // Efeito para os 3 pontinhos piscando
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setDots(prev => (prev.length < 3 ? prev + '.' : ''));
      }, 500);
    } else {
      setDots('');
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleProcess = async () => {
    if (!text) {
      setResult('⚠️ **Aviso:** Por favor, digite o texto primeiro.');
      return;
    }
    setLoading(true);
    setResult('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/process', {
        text: text,
        mode: mode
      });
      setResult(response.data.result);
    } catch (error) {
      setResult('**Erro:** Falha ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="content-wrapper">
        <header className="header">
          <h1>Validador de Requisitos</h1>
          <button 
            className="theme-toggle" 
            onClick={() => setDarkMode(!darkMode)}
            title="Alternar Tema"
          >
            {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
          </button>
        </header>

        <div className="control-panel">
          <div className="radio-group">
            <label className={`radio-card ${mode === 'generation' ? 'active' : ''}`}>
              <input
                type="radio"
                value="generation"
                checked={mode === 'generation'}
                onChange={(e) => setMode(e.target.value)}
              />
              <span>Gerar Requisitos</span>
            </label>

            <label className={`radio-card ${mode === 'analysis' ? 'active' : ''}`}>
              <input
                type="radio"
                value="analysis"
                checked={mode === 'analysis'}
                onChange={(e) => setMode(e.target.value)}
              />
              <span>Auditar Qualidade</span>
            </label>
          </div>
        </div>

        <textarea
          className="main-input"
          placeholder={mode === 'generation' ? "Ex: Como cliente, quero ver meu histórico..." : "Cole os requisitos para auditoria..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <button
          className={`process-button ${loading ? 'loading' : ''}`}
          onClick={handleProcess}
          disabled={loading}
        >
          {loading ? `Pensando${dots}` : 'Executar Processamento'}
        </button>

        {result && (
          <div className="result-section fade-in">
            <hr />
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;