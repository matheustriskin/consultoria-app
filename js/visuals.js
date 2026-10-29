/**
 * Motor de Demonstração Visual e Biomecânica dos Exercícios - Professor Raian Bispo
 * Exibe GIFs demonstrativos em loop e SVGs biomecânicos com ativação muscular
 */

const ExerciseVisuals = {
  /**
   * Retorna o componente visual do exercício:
   * Prioridade: GIF animado de alta performance local;
   * Fallback: SVG biomecânico interativo com ativação muscular pulsante.
   */
  getExerciseMediaHtml(exerciseId, svgType = "generic") {
    const gifSrc = `assets/exercises/${exerciseId}.gif`;
    const fallbackId = `svg_fallback_${exerciseId}_${Math.floor(Math.random() * 1000)}`;

    return `
      <div class="exercise-media-container" style="background: #090d16; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08); text-align: center; position: relative;">
        <!-- Demonstração Animada em GIF -->
        <img src="${gifSrc}" 
             alt="Demonstração do Exercício" 
             class="exercise-demonstration-gif"
             style="width: 100%; max-height: 290px; object-fit: contain; display: block; margin: 0 auto; background: #000;"
             onerror="this.style.display='none'; document.getElementById('${fallbackId}').style.display='block';">
             
        <!-- Fallback Biomecânico em SVG caso a imagem demore ou falhe -->
        <div id="${fallbackId}" style="display: none; padding: 12px;">
          ${this.getSvgForExercise(svgType)}
        </div>
      </div>
    `;
  },

  generateExerciseSVG(svgType) {
    return this.getSvgForExercise(svgType);
  },

  togglePlayAnimation() {
    // Utilitário para controle de animações
  },

  getSvgForExercise(svgType) {
    switch (svgType) {
      case "bench_press":
      case "incline_press":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 160" style="max-height: 200px; width: 100%;">
            <rect x="30" y="110" width="140" height="12" rx="3" fill="#334155"/>
            <rect x="50" y="122" width="10" height="25" fill="#1e293b"/>
            <rect x="140" y="122" width="10" height="25" fill="#1e293b"/>
            <path d="M 50 105 L 145 105" stroke="#64748b" stroke-width="14" stroke-linecap="round"/>
            <circle cx="45" cy="102" r="9" fill="#94a3b8"/>
            <circle cx="85" cy="100" r="10" fill="#ef4444"/>
            <g class="anim-bench-press">
              <rect x="40" y="45" width="90" height="6" rx="2" fill="#e2e8f0"/>
              <rect x="32" y="32" width="8" height="32" rx="3" fill="#3b82f6"/>
              <rect x="130" y="32" width="8" height="32" rx="3" fill="#3b82f6"/>
              <path d="M 85 102 L 65 72 L 55 48" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none"/>
              <path d="M 85 102 L 105 72 L 115 48" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none"/>
            </g>
          </svg>
        `;

      case "squat":
      case "box_squat":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 180" style="max-height: 200px; width: 100%;">
            <line x1="20" y1="165" x2="180" y2="165" stroke="#334155" stroke-width="3"/>
            <circle cx="100" cy="30" r="9" fill="#94a3b8"/>
            <line x1="100" y1="38" x2="92" y2="85" stroke="#64748b" stroke-width="12" stroke-linecap="round"/>
            <line x1="92" y1="85" x2="118" y2="120" stroke="#10b981" stroke-width="12" stroke-linecap="round"/>
            <line x1="118" y1="120" x2="110" y2="165" stroke="#94a3b8" stroke-width="9" stroke-linecap="round"/>
            <rect x="55" y="45" width="90" height="6" rx="2" fill="#f59e0b"/>
          </svg>
        `;

      case "deadlift":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 180" style="max-height: 200px; width: 100%;">
            <line x1="20" y1="165" x2="180" y2="165" stroke="#334155" stroke-width="3"/>
            <circle cx="95" cy="50" r="9" fill="#94a3b8"/>
            <line x1="95" y1="58" x2="115" y2="105" stroke="#ef4444" stroke-width="12" stroke-linecap="round"/>
            <line x1="115" y1="105" x2="98" y2="135" stroke="#10b981" stroke-width="11" stroke-linecap="round"/>
            <line x1="98" y1="135" x2="100" y2="165" stroke="#64748b" stroke-width="9" stroke-linecap="round"/>
            <line x1="95" y1="62" x2="88" y2="140" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
            <circle cx="88" cy="140" r="16" fill="#3b82f6"/>
          </svg>
        `;

      case "lat_pulldown":
      case "pullup":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 180" style="max-height: 200px; width: 100%;">
            <rect x="95" y="10" width="10" height="150" fill="#334155"/>
            <circle cx="85" cy="85" r="9" fill="#94a3b8"/>
            <path d="M 85 95 L 85 130" stroke="#64748b" stroke-width="10" stroke-linecap="round"/>
            <path d="M 82 98 Q 72 110 82 122" stroke="#f59e0b" stroke-width="8" fill="none"/>
            <path d="M 45 42 L 100 38 L 155 42" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round"/>
          </svg>
        `;

      case "bent_row":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 170" style="max-height: 200px; width: 100%;">
            <line x1="20" y1="160" x2="180" y2="160" stroke="#334155" stroke-width="3"/>
            <circle cx="80" cy="55" r="9" fill="#94a3b8"/>
            <line x1="80" y1="62" x2="120" y2="95" stroke="#f59e0b" stroke-width="12" stroke-linecap="round"/>
            <line x1="120" y1="95" x2="105" y2="135" stroke="#64748b" stroke-width="10" stroke-linecap="round"/>
            <line x1="105" y1="135" x2="110" y2="160" stroke="#64748b" stroke-width="9" stroke-linecap="round"/>
            <line x1="88" y1="70" x2="100" y2="105" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
            <circle cx="100" cy="105" r="12" fill="#3b82f6"/>
          </svg>
        `;

      case "shoulder_press":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 180" style="max-height: 200px; width: 100%;">
            <line x1="30" y1="165" x2="170" y2="165" stroke="#334155" stroke-width="3"/>
            <circle cx="100" cy="70" r="9" fill="#94a3b8"/>
            <line x1="100" y1="80" x2="100" y2="130" stroke="#64748b" stroke-width="12" stroke-linecap="round"/>
            <circle cx="85" cy="88" r="8" fill="#ef4444"/>
            <circle cx="115" cy="88" r="8" fill="#ef4444"/>
            <rect x="50" y="30" width="100" height="6" rx="2" fill="#e2e8f0"/>
            <rect x="42" y="18" width="8" height="30" rx="3" fill="#3b82f6"/>
            <rect x="150" y="18" width="8" height="30" rx="3" fill="#3b82f6"/>
          </svg>
        `;

      case "leg_press":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 170" style="max-height: 200px; width: 100%;">
            <line x1="30" y1="140" x2="160" y2="40" stroke="#334155" stroke-width="6"/>
            <circle cx="32" cy="85" r="8" fill="#94a3b8"/>
            <path d="M 38 95 L 60 120" stroke="#64748b" stroke-width="10" stroke-linecap="round"/>
            <path d="M 60 120 L 95 85 L 125 58" stroke="#3b82f6" stroke-width="9" stroke-linecap="round" fill="none"/>
          </svg>
        `;

      case "fly":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 160" style="max-height: 200px; width: 100%;">
            <circle cx="100" cy="70" r="9" fill="#94a3b8"/>
            <circle cx="100" cy="85" r="12" fill="#ef4444"/>
            <path d="M 50 85 Q 75 70 100 85 Q 125 70 150 85" stroke="#38bdf8" stroke-width="7" stroke-linecap="round" fill="none"/>
            <circle cx="48" cy="85" r="8" fill="#3b82f6"/>
            <circle cx="152" cy="85" r="8" fill="#3b82f6"/>
          </svg>
        `;

      case "plank":
      case "abs":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 150" style="max-height: 180px; width: 100%;">
            <line x1="20" y1="125" x2="180" y2="125" stroke="#334155" stroke-width="3"/>
            <circle cx="45" cy="82" r="8" fill="#94a3b8"/>
            <line x1="50" y1="88" x2="140" y2="92" stroke="#64748b" stroke-width="11" stroke-linecap="round"/>
            <rect x="75" y="85" width="35" height="12" rx="3" fill="#f59e0b"/>
            <line x1="50" y1="92" x2="52" y2="125" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
            <line x1="140" y1="92" x2="155" y2="125" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
          </svg>
        `;

      case "calf_raise":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 180" style="max-height: 200px; width: 100%;">
            <line x1="40" y1="160" x2="160" y2="160" stroke="#334155" stroke-width="3"/>
            <circle cx="100" cy="30" r="8" fill="#94a3b8"/>
            <line x1="100" y1="38" x2="100" y2="90" stroke="#64748b" stroke-width="11" stroke-linecap="round"/>
            <line x1="100" y1="90" x2="100" y2="140" stroke="#3b82f6" stroke-width="11" stroke-linecap="round"/>
            <circle cx="100" cy="120" r="9" fill="#ef4444"/>
            <line x1="100" y1="140" x2="108" y2="158" stroke="#64748b" stroke-width="6"/>
          </svg>
        `;

      case "cardio":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 170" style="max-height: 190px; width: 100%;">
            <circle cx="110" cy="35" r="9" fill="#94a3b8"/>
            <line x1="108" y1="44" x2="95" y2="90" stroke="#64748b" stroke-width="10" stroke-linecap="round"/>
            <line x1="95" y1="90" x2="70" y2="120" stroke="#ef4444" stroke-width="9" stroke-linecap="round"/>
            <line x1="70" y1="120" x2="55" y2="155" stroke="#64748b" stroke-width="7" stroke-linecap="round"/>
            <line x1="95" y1="90" x2="125" y2="115" stroke="#ef4444" stroke-width="9" stroke-linecap="round"/>
            <line x1="125" y1="115" x2="140" y2="148" stroke="#64748b" stroke-width="7" stroke-linecap="round"/>
            <path d="M 85 55 L 70 80 L 58 75" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none"/>
            <path d="M 105 55 L 128 75 L 140 68" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none"/>
          </svg>
        `;

      case "bicep_curl":
      case "forearms":
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 170" style="max-height: 180px; width: 100%;">
            <circle cx="100" cy="38" r="8" fill="#94a3b8"/>
            <line x1="100" y1="46" x2="100" y2="110" stroke="#64748b" stroke-width="11" stroke-linecap="round"/>
            <path d="M 100 55 L 115 88 L 110 58" stroke="#38bdf8" stroke-width="7" stroke-linecap="round" fill="none"/>
            <circle cx="115" cy="72" r="8" fill="#ef4444"/>
            <circle cx="110" cy="55" r="9" fill="#3b82f6"/>
          </svg>
        `;

      default:
        return `
          <svg class="exercise-svg-anim" viewBox="0 0 200 160" style="max-height: 180px; width: 100%;">
            <rect x="60" y="75" width="80" height="10" rx="3" fill="#94a3b8"/>
            <rect x="45" y="55" width="18" height="50" rx="4" fill="#3b82f6"/>
            <rect x="35" y="62" width="12" height="36" rx="3" fill="#60a5fa"/>
            <rect x="137" y="55" width="18" height="50" rx="4" fill="#3b82f6"/>
            <rect x="153" y="62" width="12" height="36" rx="3" fill="#60a5fa"/>
          </svg>
        `;
    }
  }
};

// Exportar com ambos os nomes para compatibilidade global
window.ExerciseVisuals = ExerciseVisuals;
window.VisualBiomechanics = ExerciseVisuals;
