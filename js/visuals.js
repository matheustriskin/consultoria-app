/**
 * Motor de Renderização Biomecânica Visual dos Exercícios
 * Gera SVGs animados interativos destacando grupos musculares em ação
 */

const ExerciseVisuals = {
  getSvgForExercise(svgType) {
    switch (svgType) {
      case "bench_press":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 160">
            <!-- Banco -->
            <rect x="30" y="110" width="140" height="12" rx="3" fill="#334155"/>
            <rect x="50" y="122" width="10" height="25" fill="#1e293b"/>
            <rect x="140" y="122" width="10" height="25" fill="#1e293b"/>
            
            <!-- Corpo do Atleta deitado -->
            <path d="M 50 105 L 145 105" stroke="#64748b" stroke-width="14" stroke-linecap="round"/>
            <circle cx="45" cy="102" r="9" fill="#94a3b8"/> <!-- Cabeça -->
            
            <!-- Músculo Alvo: Peitoral (Brilho e pulso) -->
            <circle cx="85" cy="100" r="10" class="muscle-glow-peito"/>
            
            <!-- Braços e Barra com animação -->
            <g class="anim-bench-press">
              <!-- Barra e Anilhas -->
              <line x1="85" y1="35" x2="85" y2="92" stroke="#94a3b8" stroke-width="3" stroke-dasharray="2,2"/>
              <rect x="40" y="45" width="90" height="6" rx="2" fill="#e2e8f0"/>
              <rect x="32" y="32" width="8" height="32" rx="3" fill="#3b82f6"/> <!-- Anilha Esq -->
              <rect x="130" y="32" width="8" height="32" rx="3" fill="#3b82f6"/> <!-- Anilha Dir -->
              
              <!-- Braços empurrando -->
              <path d="M 85 102 L 65 72 L 55 48" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none"/>
              <path d="M 85 102 L 105 72 L 115 48" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none"/>
            </g>
          </svg>
        `;

      case "squat":
      case "box_squat":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 180">
            <!-- Chão -->
            <line x1="20" y1="165" x2="180" y2="165" stroke="#334155" stroke-width="3"/>
            ${svgType === 'box_squat' ? '<rect x="45" y="105" width="30" height="58" rx="4" fill="#475569"/>' : ''}
            
            <!-- Atleta Agachando com animação -->
            <g class="anim-squat">
              <!-- Barra nos ombros -->
              <rect x="65" y="38" width="70" height="6" rx="2" fill="#e2e8f0"/>
              <rect x="60" y="26" width="6" height="30" rx="2" fill="#10b981"/>
              <rect x="134" y="26" width="6" height="30" rx="2" fill="#10b981"/>
              
              <!-- Tronco e Cabeça -->
              <circle cx="100" cy="30" r="9" fill="#94a3b8"/>
              <line x1="100" y1="38" x2="92" y2="85" stroke="#64748b" stroke-width="12" stroke-linecap="round"/>
              
              <!-- Quadríceps Ativo (Músculo Brilhando) -->
              <line x1="92" y1="85" x2="118" y2="120" class="muscle-glow-quad" stroke-width="12" stroke-linecap="round"/>
              
              <!-- Pernas -->
              <line x1="118" y1="120" x2="110" y2="165" stroke="#94a3b8" stroke-width="9" stroke-linecap="round"/>
              <!-- Pé -->
              <line x1="105" y1="165" x2="125" y2="165" stroke="#64748b" stroke-width="5" stroke-linecap="round"/>
            </g>
          </svg>
        `;

      case "lat_pulldown":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 180">
            <!-- Máquina -->
            <rect x="95" y="10" width="10" height="150" fill="#334155"/>
            <rect x="70" y="155" width="60" height="8" rx="2" fill="#1e293b"/>
            <rect x="60" y="115" width="40" height="10" rx="2" fill="#475569"/> <!-- Banco -->
            
            <!-- Atleta Sentado -->
            <circle cx="85" cy="85" r="9" fill="#94a3b8"/>
            <path d="M 85 95 L 85 130 L 65 140 L 65 160" stroke="#64748b" stroke-width="10" stroke-linecap="round" fill="none"/>
            
            <!-- Dorsal Ativo -->
            <path d="M 82 98 Q 72 110 82 122" stroke="#f59e0b" stroke-width="8" class="muscle-glow-dorsal" fill="none"/>
            
            <!-- Barra e Cabos com Animação de Puxada -->
            <g class="anim-pulldown">
              <line x1="100" y1="15" x2="100" y2="40" stroke="#e2e8f0" stroke-width="2"/>
              <path d="M 45 42 L 100 38 L 155 42" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round"/>
              <!-- Braços puxando -->
              <path d="M 85 98 L 65 65 L 55 42" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" fill="none"/>
              <path d="M 85 98 L 115 65 L 145 42" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" fill="none"/>
            </g>
          </svg>
        `;

      case "leg_press":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 170">
            <!-- Estrutura 45 graus -->
            <line x1="30" y1="140" x2="160" y2="40" stroke="#334155" stroke-width="6"/>
            <!-- Encosto -->
            <rect x="35" y="100" width="40" height="12" rx="3" transform="rotate(-35 35 100)" fill="#1e293b"/>
            
            <!-- Atleta -->
            <circle cx="32" cy="85" r="8" fill="#94a3b8"/>
            <path d="M 38 95 L 60 120" stroke="#64748b" stroke-width="10" stroke-linecap="round"/>
            
            <!-- Plataforma e Pernas com Animação -->
            <g class="anim-leg-press">
              <!-- Plataforma móvel -->
              <rect x="115" y="45" width="30" height="10" rx="2" transform="rotate(55 115 45)" fill="#e2e8f0"/>
              <circle cx="130" cy="55" r="14" fill="#3b82f6"/> <!-- Anilhas -->
              
              <!-- Coxa e Perna (Quadríceps brilhando) -->
              <path d="M 60 120 L 95 85 L 125 58" class="muscle-glow-quad" stroke-width="9" stroke-linecap="round" fill="none"/>
            </g>
          </svg>
        `;

      default:
        // Ícone genérico de halteres dinâmico
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 160">
            <g class="anim-generic-pulse">
              <rect x="60" y="75" width="80" height="10" rx="3" fill="#94a3b8"/>
              <rect x="45" y="55" width="18" height="50" rx="4" fill="#3b82f6"/>
              <rect x="35" y="62" width="12" height="36" rx="3" fill="#60a5fa"/>
              <rect x="137" y="55" width="18" height="50" rx="4" fill="#3b82f6"/>
              <rect x="153" y="62" width="12" height="36" rx="3" fill="#60a5fa"/>
              <circle cx="100" cy="80" r="18" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4"/>
            </g>
          </svg>
        `;
    }
  }
};
