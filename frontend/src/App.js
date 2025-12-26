import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css'; 

function App() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('generation');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!text) return;
    setLoading(true);
    setResult('Pensando...');

    try {
      // Chama o seu backend Python
      const response = await axios.post('http://127.0.0.1:8000/process', {
        text: text,
        mode: mode
      });
      setResult(response.data.result);
    } catch (error) {
      console.error(error);
      setResult('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header>
        <h1>Validador de Requisitos com IA</h1>
      </header>

      <div style={{ margin: '20px 0', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <label style={{ marginRight: '20px', cursor: 'pointer' }}>
          <input 
            type="radio" 
            value="generation" 
            checked={mode === 'generation'} 
            onChange={(e) => setMode(e.target.value)} 
          />
          <strong> Modo 1:</strong> Gerar Requisitos (User Story)
        </label>
        
        <label style={{ cursor: 'pointer' }}>
          <input 
            type="radio" 
            value="analysis" 
            checked={mode === 'analysis'} 
            onChange={(e) => setMode(e.target.value)} 
          />
          <strong> Modo 2:</strong> Analisar Qualidade
        </label>
      </div>

      <textarea
        style={{ width: '100%', height: '150px', padding: '10px', fontSize: '16px' }}
        placeholder={mode === 'generation' ? "Cole sua User Story aqui..." : "Cole os requisitos para a IA analisar..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button 
        onClick={handleProcess} 
        disabled={loading}
        style={{ 
          marginTop: '15px', 
          padding: '10px 20px', 
          fontSize: '16px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Processando...' : 'Executar Processamento'}
      </button>

      {result && (
        <div style={{ marginTop: '30px', textAlign: 'left' }}>
          <h3>Resultado da IA:</h3>
          <div style={{ background: '#e9ecef', padding: '20px', borderRadius: '8px', lineHeight: '1.6' }}>
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;