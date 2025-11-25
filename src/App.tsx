import './styles/index.css';
import { Hero } from './components/Hero';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ExportPDF } from './components/ExportPDF';
import { ParticlesBackground } from './components/ParticlesBackground';

function App() {
  return (
    <div className="app">
      <ParticlesBackground />
      <LanguageSwitcher />
      <ExportPDF />
      <Hero />
      <Skills />
      <Experience />
    </div>
  );
}

export default App;


