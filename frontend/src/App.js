import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
// IMPORTANTE: Importa o plugin de tabelas
import remarkGfm from 'remark-gfm';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('generation');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!text) {
          setResult('⚠️ **Aviso:** Por favor, digite o texto primeiro.');
          return;
    };
    setLoading(true);
    setResult('Processando...');

    try {
      const response = await axios.post('http://127.0.0.1:8000/process', {
        text: text,
        mode: mode
      });
      setResult(response.data.result);
    } catch (error) {
      console.error(error);
      setResult('**Erro Crítico:** Falha ao conectar com o servidor Backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#2c3e50' }}>Validador de Requisitos com IA</h1>
      </header>

      <div style={{ margin: '20px 0', padding: '15px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <label style={{ marginRight: '20px', cursor: 'pointer', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center' }}>
          <input
            type="radio"
            value="generation"
            checked={mode === 'generation'}
            onChange={(e) => setMode(e.target.value)}
            style={{ marginRight: '8px' }}
          />
          Gerar Requisitos
        </label>

        <label style={{ cursor: 'pointer', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center' }}>
          <input
            type="radio"
            value="analysis"
            checked={mode === 'analysis'}
            onChange={(e) => setMode(e.target.value)}
            style={{ marginRight: '8px' }}
          />
          Auditar Qualidade
        </label>
      </div>

      <textarea
        style={{ width: '100%', height: '150px', padding: '15px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'monospace' }}
        placeholder={mode === 'generation' ? "Ex: Como cliente, quero ver meu histórico de pedidos para saber o que já comprei." : "Cole os requisitos aqui para a IA analisar..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <button
        onClick={handleProcess}
        disabled={loading}
        style={{
          marginTop: '15px',
          padding: '12px 25px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: loading ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
          transition: 'background-color 0.3s'
        }}
      >
        {loading ? 'Pensando...' : 'Executar Processamento'}
      </button>

      {/* Área de Resultado */}
      {result && (
        <div style={{ marginTop: '40px', textAlign: 'left' }}>
          <h3 style={{ color: '#2c3e50', borderBottom: '2px solid #007bff', paddingBottom: '10px', display: 'inline-block' }}>
            Resultado da Análise:
          </h3>
          
          {/* AQUI ESTÁ A MÁGICA: Adicionamos uma classe CSS e o plugin */}
          <div className="markdown-result">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;