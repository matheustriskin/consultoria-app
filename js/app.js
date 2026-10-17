/**
 * Lógica Principal da Aplicação SPA da Consultoria
 * Gerencia visualizações do Professor e do Aluno com isolamento e interatividade
 */

const App = {
  currentRole: "professor", // 'professor' ou 'aluno'
  activeTab: "alunos", // 'alunos', 'financeiro', 'treino_hoje', 'diario_alimentar'
  activeStudentId: "aluno_raian",
  restTimerInterval: null,
  restTimeSeconds: 60,

  async init() {
    this.bindEvents();
    this.render();
    // SINCRONIZAÇÃO AUTOMÁTICA EM TEMPO REAL AO ABRIR O APP
    await this.autoSyncGoogleSheets();
    // Re-sincronizar se o usuário voltar para a aba ou desbloquear o celular
    window.addEventListener("focus", () => this.autoSyncGoogleSheets());
    // Polling a cada 25 segundos
    setInterval(() => this.autoSyncGoogleSheets(false), 25000);
  },

  async autoSyncGoogleSheets(showToast = true) {
    const res = await db.syncWithGoogleSheetsGViz();
    if (res.success) {
      if (showToast) {
        this.mostrarToast(`⚡ ${res.count} alunos sincronizados com a nuvem do Google!`, "success");
      }
      this.render();
    }
  },

  bindEvents() {
    // Role switcher
    document.querySelectorAll(".role-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const role = e.currentTarget.dataset.role;
        this.switchRole(role);
      });
    });
  },

  switchRole(role) {
    this.currentRole = role;
    document.querySelectorAll(".role-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.role === role);
    });

    if (role === "professor") {
      this.activeTab = "alunos";
    } else {
      this.activeTab = "treino_hoje";
    }
    this.render();
  },

  setStudent(studentId) {
    this.activeStudentId = studentId;
    this.render();
  },

  setTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  render() {
    const container = document.getElementById("mainContent");
    const navTabsContainer = document.getElementById("navTabs");
    const student = db.getStudentById(this.activeStudentId);
    const students = db.getStudents();

    // 1. Renderizar Navegação de Abas
    if (this.currentRole === "professor") {
      navTabsContainer.innerHTML = `
        <button class="tab-btn ${this.activeTab === 'alunos' ? 'active' : ''}" onclick="App.setTab('alunos')">
          👥 Gestão de Alunos (${students.length})
        </button>
        <button class="tab-btn ${this.activeTab === 'financeiro' ? 'active' : ''}" onclick="App.setTab('financeiro')">
          💳 Módulo Financeiro & Mensalidades
        </button>
        <button class="tab-btn ${this.activeTab === 'exercicios' ? 'active' : ''}" onclick="App.setTab('exercicios')">
          🏋️ Biblioteca Biomecânica de Exercícios
        </button>
      `;
    } else {
      navTabsContainer.innerHTML = `
        <button class="tab-btn ${this.activeTab === 'treino_hoje' ? 'active' : ''}" onclick="App.setTab('treino_hoje')">
          🏋️ Meu Treino de Hoje
        </button>
        <button class="tab-btn ${this.activeTab === 'diario_alimentar' ? 'active' : ''}" onclick="App.setTab('diario_alimentar')">
          🥗 Diário Alimentar & Calorias
        </button>
        <button class="tab-btn ${this.activeTab === 'meu_perfil' ? 'active' : ''}" onclick="App.setTab('meu_perfil')">
          👤 Minha Anamnese & Metas
        </button>
      `;
    }

    // 2. Renderizar Conteúdo Conforme Papel e Aba
    if (this.currentRole === "professor") {
      if (this.activeTab === "alunos") {
        container.innerHTML = this.renderProfessorStudentsView(students);
      } else if (this.activeTab === "financeiro") {
        container.innerHTML = this.renderProfessorFinancialView(students);
      } else if (this.activeTab === "exercicios") {
        container.innerHTML = this.renderExerciseLibraryView();
      }
    } else {
      // VISÃO DO ALUNO (ESTRITAMENTE ISOLADA)
      if (this.activeTab === "treino_hoje") {
        container.innerHTML = this.renderStudentWorkoutView(student);
      } else if (this.activeTab === "diario_alimentar") {
        container.innerHTML = this.renderStudentFoodDiaryView(student);
      } else if (this.activeTab === "meu_perfil") {
        container.innerHTML = this.renderStudentProfileView(student);
      }
    }
  },

  // ==========================================
  // COMPONENTES DO PROFESSOR
  // ==========================================
  renderProfessorStudentsView(students) {
    let faturamentoTotal = students.reduce((acc, s) => acc + (s.financeiro.valor || 0), 0);
    let totalEmDia = students.filter(s => s.financeiro.status === 'em_dia').length;
    let totalPendentes = students.filter(s => s.financeiro.status !== 'em_dia').length;

    let studentsCardsHtml = students.map(s => `
      <div class="card" style="border-left: 4px solid var(--primary);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <h3 style="font-size: 1.25rem; font-weight: 800;">${s.nome}</h3>
              <span class="badge-status ${s.financeiro.status}">${s.financeiro.status.replace('_', ' ')}</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.82rem; margin-top: 4px;">
              ${s.idade} anos | ${s.peso} kg | ${s.altura} cm | <strong>IMC: ${s.imc}</strong> (${s.classificacaoImc})
            </p>
            <p style="color: #38bdf8; font-size: 0.85rem; font-weight: 700; margin-top: 6px;">
              🎯 Objetivo: ${s.objetivo} (${s.nivelTreino})
            </p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm" onclick="App.verComoAluno('${s.id}')">
              📱 Ver Como Este Aluno
            </button>
            <a href="https://wa.me/55${s.whatsapp.replace(/\D/g, '')}" target="_blank" class="btn btn-sm btn-pix" style="text-decoration: none;">
              💬 WhatsApp
            </a>
          </div>
        </div>

        <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border); display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 0.82rem;">
          <div>
            <span style="color: var(--text-muted);">Metas Diárias:</span><br>
            <strong style="color: #60a5fa;">${s.metaCalorias} kcal</strong> (P: ${s.macros.prot}g | C: ${s.macros.carb}g | G: ${s.macros.fat}g)
          </div>
          <div>
            <span style="color: var(--text-muted);">Divisão de Treino:</span><br>
            <strong>${s.treinoAtual ? s.treinoAtual.nome : 'Não prescrito'}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted);">Mensalidade / Plano:</span><br>
            <strong>R$ ${s.financeiro.valor.toFixed(2)}</strong> (${s.financeiro.plano})
          </div>
        </div>
      </div>
    `).join("");

    return `
      <!-- CARDS DE METRICAS PRINCIPAIS -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa;">👥</div>
          <div>
            <div class="stat-val">${students.length}</div>
            <div class="stat-label">Alunos Ativos</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">💰</div>
          <div>
            <div class="stat-val">R$ ${faturamentoTotal.toFixed(2)}</div>
            <div class="stat-label">Receita Recorrente</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24;">⚡</div>
          <div>
            <div class="stat-val">${totalEmDia} / ${students.length}</div>
            <div class="stat-label">Pagamentos em Dia</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(139, 92, 246, 0.15); color: #c084fc;">📋</div>
          <div>
            <div class="stat-val">100%</div>
            <div class="stat-label">Anamneses Cruzadas</div>
          </div>
        </div>
      </div>

      <div class="card-title">
        <span>Alunos Cadastrados na Consultoria</span>
        <button class="btn btn-sm" onclick="App.abrirModalSincronizacao()">
          🔄 Sincronizar com a Planilha
        </button>
      </div>

      ${studentsCardsHtml}
    `;
  },

  renderProfessorFinancialView(students) {
    let faturamentoTotal = students.reduce((acc, s) => acc + s.financeiro.valor, 0);

    let rowsHtml = students.map(s => `
      <tr>
        <td><strong>${s.nome}</strong><br><span style="color: var(--text-muted); font-size: 0.78rem;">${s.whatsapp}</span></td>
        <td>${s.financeiro.plano}</td>
        <td><strong>R$ ${s.financeiro.valor.toFixed(2)}</strong></td>
        <td>${s.financeiro.vencimento}</td>
        <td><span class="badge-status ${s.financeiro.status}">${s.financeiro.status.replace('_', ' ')}</span></td>
        <td>
          <button class="btn btn-sm btn-pix" onclick="App.marcarComoPago('${s.id}')">
            ✅ Marcar Pago
          </button>
          <button class="btn btn-sm" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa;" onclick="App.enviarCobrancaWhats('${s.id}')">
            📲 Lembrar Pix
          </button>
        </td>
      </tr>
    `).join("");

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">💵</div>
          <div>
            <div class="stat-val">R$ ${faturamentoTotal.toFixed(2)}</div>
            <div class="stat-label">Previsão do Mês</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa;">🔑</div>
          <div>
            <div class="stat-val" style="font-size: 1.1rem; cursor: pointer;" onclick="App.copiarChavePix()">matheus.smarciel@gmail.com 📋</div>
            <div class="stat-label">Chave Pix da Consultoria (Clique para copiar)</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Controle Financeiro de Alunos & Mensalidades</div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Plano Contratado</th>
                <th>Valor Mensal</th>
                <th>Próximo Vencimento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderExerciseLibraryView() {
    let exercisesHtml = EXERCISE_LIBRARY.map(ex => `
      <div class="exercise-card">
        <div class="exercise-visual-header">
          ${ExerciseVisuals.getSvgForExercise(ex.svgType)}
          <span class="exercise-tag">${ex.grupo}</span>
        </div>
        <div class="exercise-body">
          <div class="exercise-name">${ex.nome}</div>
          <div class="exercise-muscles">Sinergistas: ${ex.sinergistas} | Equipamento: ${ex.equipamento}</div>
          <p style="font-size: 0.82rem; line-height: 1.5; color: #cbd5e1; margin-top: auto;">
            <strong>Execução Biomecânica:</strong> ${ex.execucao}
          </p>
        </div>
      </div>
    `).join("");

    return `
      <div class="card-title">Biblioteca de Exercícios com Representação Biomecânica Animada</div>
      <div class="exercise-grid">
        ${exercisesHtml}
      </div>
    `;
  },

  // ==========================================
  // COMPONENTES DO ALUNO (ESTRITAMENTE ISOLADO)
  // ==========================================
  renderStudentWorkoutView(student) {
    if (!student || !student.treinoAtual) {
      return `<div class="card"><p>Nenhum treino prescrito para este aluno ainda.</p></div>`;
    }

    const treino = student.treinoAtual;
    const diaAtual = treino.dias[0]; // Treino A padrão

    let exerciciosHtml = diaAtual.exercicios.map((item, idx) => {
      const exInfo = db.getExerciseById(item.id) || {
        nome: item.id,
        grupo: "Geral",
        sinergistas: "Membros",
        svgType: "default",
        execucao: "Execute com boa postura e controle excêntrico."
      };

      return `
        <div class="exercise-card" id="ex_card_${idx}">
          <div class="exercise-visual-header">
            ${ExerciseVisuals.getSvgForExercise(exInfo.svgType)}
            <span class="exercise-tag">${exInfo.grupo}</span>
          </div>
          <div class="exercise-body">
            <div class="exercise-name">${exInfo.nome}</div>
            <div class="exercise-muscles">Alvo: ${exInfo.grupo} | Sinergistas: ${exInfo.sinergistas}</div>
            
            <div class="exercise-sets-tracker">
              <div>
                <span class="set-badge">${item.series} Séries x ${item.reps} reps</span>
              </div>
              <div class="load-input-box">
                <label style="font-size: 0.75rem; color: var(--text-muted);">Carga:</label>
                <input type="number" class="load-input" value="${item.cargaKg}" onchange="App.atualizarCarga('${student.id}', 0, ${idx}, this.value)">
                <span style="font-size: 0.8rem; font-weight: 700;">kg</span>
              </div>
              <button class="btn-complete-set ${item.concluido ? 'done' : ''}" onclick="App.toggleConcluido('${student.id}', 0, ${idx})">
                ${item.concluido ? '✓ Feito' : 'Concluir'}
              </button>
            </div>

            <p style="font-size: 0.78rem; color: #94a3b8; line-height: 1.4; margin-top: auto;">
              💡 <em>${exInfo.execucao}</em>
            </p>
          </div>
        </div>
      `;
    }).join("");

    return `
      <!-- SELETOR DO ALUNO (SIMULAÇÃO DE LOGIN) -->
      <div class="student-select-box">
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Aluno Conectado:</span>
          <h2 style="font-size: 1.25rem; font-weight: 800;">${student.nome}</h2>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">Alternar Aluno:</span>
          <select class="app-select" onchange="App.setStudent(this.value)">
            ${db.getStudents().map(s => `<option value="${s.id}" ${s.id === student.id ? 'selected' : ''}>${s.nome}</option>`).join("")}
          </select>
        </div>
      </div>

      <!-- CRONÔMETRO DE DESCANSO FLUTUANTE -->
      <div class="card" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; background: linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(15, 23, 42, 0.8));">
        <div>
          <h4 style="font-size: 1rem; font-weight: 800; color: #93c5fd;">⏱️ Cronômetro de Descanso entre Séries</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted);">Selecione o tempo após cada série para manter o estímulo hipertrófico ideal:</p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="btn btn-sm" style="background: rgba(255,255,255,0.06);" onclick="App.iniciarTimer(45)">45s</button>
          <button class="btn btn-sm" style="background: rgba(255,255,255,0.06);" onclick="App.iniciarTimer(60)">60s</button>
          <button class="btn btn-sm" style="background: rgba(255,255,255,0.06);" onclick="App.iniciarTimer(90)">90s</button>
          <div id="timerDisplay" style="font-size: 1.5rem; font-weight: 800; color: #38bdf8; min-width: 70px; text-align: center;">00:00</div>
        </div>
      </div>

      <!-- CABEÇALHO DO TREINO DO DIA -->
      <div class="card-title">
        <span>${diaAtual.dia}</span>
        <span style="font-size: 0.82rem; color: #34d399; font-weight: 700;">🟢 ${treino.nome}</span>
      </div>

      <div class="exercise-grid">
        ${exerciciosHtml}
      </div>
    `;
  },

  renderStudentFoodDiaryView(student) {
    if (!student) return "";

    const diario = student.diarioHoje || [];
    let totCalorias = Math.round(diario.reduce((acc, f) => acc + f.calorias, 0));
    let totProt = Math.round(diario.reduce((acc, f) => acc + f.prot, 0));
    let totCarb = Math.round(diario.reduce((acc, f) => acc + f.carb, 0));
    let totFat = Math.round(diario.reduce((acc, f) => acc + f.fat, 0));

    let percCalorias = Math.min(100, Math.round((totCalorias / student.metaCalorias) * 100));
    let percProt = Math.min(100, Math.round((totProt / student.macros.prot) * 100));
    let percCarb = Math.min(100, Math.round((totCarb / student.macros.carb) * 100));
    let percFat = Math.min(100, Math.round((totFat / student.macros.fat) * 100));

    let itensHtml = diario.map((item, idx) => {
      const food = db.getFoodById(item.alimentoId) || { nome: item.alimentoId };
      return `
        <div class="food-item-row">
          <div>
            <strong>${food.nome}</strong> (${item.qtd} porção)<br>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${item.refeicao} | P: ${item.prot.toFixed(1)}g | C: ${item.carb.toFixed(1)}g | G: ${item.fat.toFixed(1)}g</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <strong style="color: #38bdf8;">${Math.round(item.calorias)} kcal</strong>
            <button style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 16px;" onclick="App.removerAlimento('${student.id}', ${idx})">✕</button>
          </div>
        </div>
      `;
    }).join("");

    return `
      <!-- VISÃO GERAL DE CALORIAS E MACROS CONTABILIZADOS -->
      <div class="card calorie-overview-card">
        <div class="calorie-circle-box">
          <div class="calorie-big-num">${totCalorias}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700;">CONSUMIDAS DE ${student.metaCalorias} KCAL</div>
          <div style="font-size: 0.8rem; color: #10b981; font-weight: 700; margin-top: 6px;">
            ${student.metaCalorias - totCalorias > 0 ? `Restam ${student.metaCalorias - totCalorias} kcal hoje` : 'Meta calórica atingida!'}
          </div>
        </div>

        <div class="macro-bars-container">
          <!-- PROTEÍNAS -->
          <div class="macro-bar-item">
            <div class="macro-label-row">
              <span style="color: #f43f5e;">Proteínas</span>
              <span>${totProt}g / ${student.macros.prot}g (${percProt}%)</span>
            </div>
            <div class="progress-track"><div class="progress-fill fill-prot" style="width: ${percProt}%;"></div></div>
          </div>
          <!-- CARBOIDRATOS -->
          <div class="macro-bar-item">
            <div class="macro-label-row">
              <span style="color: #38bdf8;">Carboidratos</span>
              <span>${totCarb}g / ${student.macros.carb}g (${percCarb}%)</span>
            </div>
            <div class="progress-track"><div class="progress-fill fill-carb" style="width: ${percCarb}%;"></div></div>
          </div>
          <!-- GORDURAS -->
          <div class="macro-bar-item">
            <div class="macro-label-row">
              <span style="color: #eab308;">Gorduras</span>
              <span>${totFat}g / ${student.macros.fat}g (${percFat}%)</span>
            </div>
            <div class="progress-track"><div class="progress-fill fill-fat" style="width: ${percFat}%;"></div></div>
          </div>
        </div>
      </div>

      <!-- REGISTRADOR RÁPIDO DE ALIMENTOS (TABELA TACO) -->
      <div class="card">
        <div class="card-title">Registrar Alimento Consumido (Tabela TACO Integrada)</div>
        <input type="text" class="search-food-input" placeholder="🔍 Digite para buscar alimentos (ex: frango, arroz, ovo, aveia, whey...)" oninput="App.buscarAlimento(this.value)">
        
        <div id="foodSearchResults" class="food-results-list">
          <!-- Resultados dinâmicos da Tabela TACO -->
        </div>
      </div>

      <!-- ALIMENTOS REGISTRADOS HOJE -->
      <div class="card">
        <div class="card-title">Refeições Registradas Hoje</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${itensHtml.length > 0 ? itensHtml : '<p style="color: var(--text-muted); font-size: 0.9rem;">Nenhum alimento registrado ainda hoje. Busque e adicione acima!</p>'}
        </div>
      </div>
    `;
  },

  renderStudentProfileView(student) {
    return `
      <div class="card">
        <div class="card-title">Dados Clínicos & Anamnese do Aluno</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; font-size: 0.9rem;">
          <div><span style="color: var(--text-muted);">Nome:</span><br><strong>${student.nome}</strong></div>
          <div><span style="color: var(--text-muted);">Idade / Sexo:</span><br><strong>${student.idade} anos (${student.genero})</strong></div>
          <div><span style="color: var(--text-muted);">Peso Atual / Altura:</span><br><strong>${student.peso} kg / ${student.altura} cm</strong></div>
          <div><span style="color: var(--text-muted);">IMC:</span><br><strong>${student.imc} (${student.classificacaoImc})</strong></div>
          <div><span style="color: var(--text-muted);">Objetivo:</span><br><strong>${student.objetivo}</strong></div>
          <div><span style="color: var(--text-muted);">Meta de Peso:</span><br><strong>${student.metaPeso}</strong></div>
          <div><span style="color: var(--text-muted);">Nível de Treino:</span><br><strong>${student.nivelTreino}</strong></div>
          <div><span style="color: var(--text-muted);">Plano Contratado:</span><br><strong>${student.financeiro.plano} (R$ ${student.financeiro.valor.toFixed(2)})</strong></div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // AÇÕES INTERATIVAS
  // ==========================================
  verComoAluno(studentId) {
    this.activeStudentId = studentId;
    this.switchRole("aluno");
  },

  copiarChavePix() {
    navigator.clipboard.writeText("matheus.smarciel@gmail.com");
    alert("✅ Chave Pix copiada com sucesso: matheus.smarciel@gmail.com");
  },

  enviarCobrancaWhats(studentId) {
    const s = db.getStudentById(studentId);
    const msg = encodeURIComponent(`Olá, ${s.nome}! Passando para lembrar da renovação da sua consultoria fitness esportiva. Segue a chave Pix: matheus.smarciel@gmail.com no valor de R$ ${s.financeiro.valor.toFixed(2)}. Bons treinos!`);
    window.open(`https://wa.me/55${s.whatsapp.replace(/\D/g, '')}?text=${msg}`, '_blank');
  },

  marcarComoPago(studentId) {
    const s = db.getStudentById(studentId);
    s.financeiro.status = "em_dia";
    db.updateStudent(s);
    alert(`✅ Pagamento confirmado para ${s.nome}!`);
    this.render();
  },

  atualizarCarga(studentId, diaIdx, exIdx, carga) {
    const s = db.getStudentById(studentId);
    s.treinoAtual.dias[diaIdx].exercicios[exIdx].cargaKg = parseFloat(carga) || 0;
    db.updateStudent(s);
  },

  toggleConcluido(studentId, diaIdx, exIdx) {
    const s = db.getStudentById(studentId);
    const item = s.treinoAtual.dias[diaIdx].exercicios[exIdx];
    item.concluido = !item.concluido;
    db.updateStudent(s);
    this.render();
  },

  iniciarTimer(segundos) {
    clearInterval(this.restTimerInterval);
    let restante = segundos;
    const display = document.getElementById("timerDisplay");
    
    this.restTimerInterval = setInterval(() => {
      restante--;
      if (restante <= 0) {
        clearInterval(this.restTimerInterval);
        if (display) display.innerText = "PRONTO!";
        try { navigator.vibrate([200, 100, 200]); } catch(e){}
      } else {
        const mins = String(Math.floor(restante / 60)).padStart(2, '0');
        const secs = String(restante % 60).padStart(2, '0');
        if (display) display.innerText = `${mins}:${secs}`;
      }
    }, 1000);
  },

  buscarAlimento(termo) {
    const resultsContainer = document.getElementById("foodSearchResults");
    if (!termo || termo.length < 2) {
      resultsContainer.innerHTML = "";
      return;
    }

    const filtrados = TACO_FOOD_DATABASE.filter(f => f.nome.toLowerCase().includes(termo.toLowerCase())).slice(0, 5);
    
    resultsContainer.innerHTML = filtrados.map(f => `
      <div class="food-item-row" onclick="App.adicionarAlimento('${f.id}')">
        <div>
          <strong>${f.nome}</strong> (${f.porcao})<br>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${f.categoria} | P: ${f.prot}g | C: ${f.carb}g | G: ${f.fat}g</span>
        </div>
        <button class="btn btn-sm btn-pix">➕ Adicionar</button>
      </div>
    `).join("");
  },

  adicionarAlimento(foodId) {
    const student = db.getStudentById(this.activeStudentId);
    const food = db.getFoodById(foodId);
    if (!student || !food) return;

    if (!student.diarioHoje) student.diarioHoje = [];
    student.diarioHoje.push({
      refeicao: "Refeição Registrada",
      alimentoId: food.id,
      qtd: 1,
      calorias: food.calorias,
      prot: food.prot,
      carb: food.carb,
      fat: food.fat
    });

    db.updateStudent(student);
    this.render();
  },

  removerAlimento(studentId, idx) {
    const student = db.getStudentById(studentId);
    if (student && student.diarioHoje) {
      student.diarioHoje.splice(idx, 1);
      db.updateStudent(student);
      this.render();
    }
  },

  // ==========================================
  // SINCRONIZAÇÃO EM TEMPO REAL & NOTIFICAÇÕES
  // ==========================================
  abrirModalSincronizacao() {
    let modal = document.getElementById("syncModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "syncModal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    const students = db.getStudents();

    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <span>🔄</span> Sincronização em Tempo Real
          </div>
          <button class="modal-close" onclick="App.fecharModalSincronizacao()">×</button>
        </div>

        <div style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
          O aplicativo já está configurado para ler automaticamente a sua Planilha do Google Forms na nuvem em tempo real.
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
          <button class="btn btn-sm btn-pix" style="width: 100%; justify-content: center; font-size: 0.95rem; padding: 14px;" onclick="App.executarSincronizacaoPlanilha()">
            ⚡ Forçar Sincronização Agora com a Planilha
          </button>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 14px;">
          <button class="btn btn-sm" style="flex: 1; justify-content: center;" onclick="App.restaurarAlunosOriginais()">
            🔄 Restaurar Iniciais (${students.length})
          </button>
          <button class="btn btn-sm" style="background: rgba(239, 68, 68, 0.15); color: #f87171; justify-content: center;" onclick="App.fecharModalSincronizacao()">
            Fechar
          </button>
        </div>
      </div>
    `;
    modal.style.display = "flex";
  },

  fecharModalSincronizacao() {
    const modal = document.getElementById("syncModal");
    if (modal) modal.style.display = "none";
  },

  async executarSincronizacaoPlanilha() {
    this.mostrarToast("Buscando respostas atualizadas na planilha...", "info");
    const res = await db.syncWithGoogleSheetsGViz();
    if (res.success) {
      this.fecharModalSincronizacao();
      this.mostrarToast(`✅ ${res.count} alunos atualizados com sucesso da nuvem!`, "success");
      this.render();
    } else {
      this.mostrarToast(`⚠️ Erro na sincronização: ${res.error}`, "info");
    }
  },

  restaurarAlunosOriginais() {
    db.resetToDefault();
    this.fecharModalSincronizacao();
    this.mostrarToast("✅ Alunos restaurados com sucesso!", "success");
    this.render();
  },

  mostrarToast(mensagem, tipo = "info") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo}`;
    toast.innerHTML = mensagem;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.4s ease";
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
};

window.App = App;
document.addEventListener("DOMContentLoaded", () => App.init());
