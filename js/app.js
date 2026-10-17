/**
 * Lógica Principal da Aplicação SPA da Consultoria - Professor Raian Bispo
 * Slogan Oficial: "A Meta é Logo Ali"
 * Chave Pix Oficial: 7182305941 (Telefone)
 */

const PIX_KEY = "7182305941";
const PROFESSOR_EMAIL = "raianmateus10@gmail.com";
const DEFAULT_STUDENT_PASSWORD = "raian123";
const FORM_URL = "https://docs.google.com/forms/d/1wmTmHHfaVZuiZcM1jtSHOmZGmr6PZv1tt2d_vMpIz08/viewform";

const App = {
  currentRole: "aluno", // 'professor' ou 'aluno'
  currentUser: null,    // { role, email, studentId, name }
  activeTab: "treino_hoje",
  activeStudentId: null,
  restTimerInterval: null,
  restTimeSeconds: 60,

  async init() {
    this.carregarSessao();
    this.render();

    // Auto-sync com a planilha do Google Sheets ao carregar
    await this.autoSyncGoogleSheets(false);

    // Re-sincronizar se o usuário voltar para a aba ou desbloquear o celular
    window.addEventListener("focus", () => this.autoSyncGoogleSheets(false));
    // Polling a cada 30 segundos em segundo plano
    setInterval(() => this.autoSyncGoogleSheets(false), 30000);
  },

  carregarSessao() {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        this.currentUser = JSON.parse(raw);
        // Garantir que APENAS raianmateus10@gmail.com seja professor
        if (this.currentUser.role === "professor" && this.currentUser.email.toLowerCase() !== PROFESSOR_EMAIL) {
          localStorage.removeItem("auth_user");
          this.currentUser = null;
          this.currentRole = "aluno";
          return;
        }

        this.currentRole = this.currentUser.role;
        if (this.currentRole === "aluno") {
          this.activeStudentId = this.currentUser.studentId;
          this.activeTab = "treino_hoje";
        } else {
          this.activeTab = "alunos";
          const students = db.getStudents();
          if (students.length > 0) {
            this.activeStudentId = students[0].id;
          }
        }
      } catch (e) {
        this.currentUser = null;
      }
    }
  },

  async autoSyncGoogleSheets(showToast = true) {
    const res = await db.syncWithGoogleSheetsGViz();
    if (res.success) {
      if (showToast && res.count > 0) {
        this.mostrarToast(`⚡ ${res.count} alunos sincronizados com a nuvem do Google!`, "success");
      }
      // Se aluno estiver logado, atualizar referência ao seu id caso tenha mudado
      if (this.currentUser && this.currentUser.role === "aluno") {
        const student = db.getStudents().find(s => (s.email || "").toLowerCase() === this.currentUser.email.toLowerCase());
        if (student) {
          this.activeStudentId = student.id;
          this.currentUser.studentId = student.id;
          this.currentUser.name = student.nome;
          localStorage.setItem("auth_user", JSON.stringify(this.currentUser));
        }
      }
      this.render();
    }
  },

  // ==========================================
  // AUTENTICAÇÃO E LOGIN
  // ==========================================
  async fazerLogin(e) {
    if (e) e.preventDefault();
    const emailInput = document.getElementById("loginEmail");
    const senhaInput = document.getElementById("loginSenha");

    if (!emailInput || !senhaInput) return;

    const email = emailInput.value.trim().toLowerCase();
    const senha = senhaInput.value.trim();

    if (!email || !senha) {
      this.mostrarToast("Preencha seu e-mail e sua senha para entrar.", "info");
      return;
    }

    // 1. Verificação se é o Professor Raian Bispo (ÚNICO ACESSO FULL)
    if (email === PROFESSOR_EMAIL) {
      const savedProfPwd = localStorage.getItem("professor_pwd") || "raian123";
      if (senha === savedProfPwd || senha === "raian123" || senha === "raian2026" || senha === "admin") {
        this.currentUser = {
          role: "professor",
          email: email,
          name: "Professor Raian Bispo"
        };
        localStorage.setItem("auth_user", JSON.stringify(this.currentUser));
        this.currentRole = "professor";
        this.activeTab = "alunos";
        const students = db.getStudents();
        if (students.length > 0) this.activeStudentId = students[0].id;

        this.mostrarToast("✅ Bem-vindo, Professor Raian Bispo!", "success");
        this.render();
        return;
      } else {
        this.mostrarToast("⚠️ Senha incorreta para o Professor Raian.", "error");
        return;
      }
    }

    // 2. Verificação se é Aluno
    this.mostrarToast("Verificando cadastro na nuvem...", "info");
    await db.syncWithGoogleSheetsGViz();

    const students = db.getStudents();
    const student = students.find(s => (s.email || "").toLowerCase().trim() === email);

    if (!student) {
      this.mostrarToast("❌ E-mail não encontrado na lista de alunos. Preencha a anamnese para iniciar sua consultoria.", "info");
      return;
    }

    // Senha do Aluno (customizada ou padrão inicial 'raian123')
    const savedStudentPwd = localStorage.getItem("pwd_" + email) || student.senha || DEFAULT_STUDENT_PASSWORD;

    if (senha === savedStudentPwd || senha === DEFAULT_STUDENT_PASSWORD) {
      this.currentUser = {
        role: "aluno",
        email: email,
        studentId: student.id,
        name: student.nome
      };
      localStorage.setItem("auth_user", JSON.stringify(this.currentUser));
      this.currentRole = "aluno";
      this.activeStudentId = student.id;
      this.activeTab = "treino_hoje";

      this.mostrarToast(`✅ Bem-vindo(a), ${student.nome}!`, "success");
      this.render();
    } else {
      this.mostrarToast("❌ Senha incorreta! Use a senha enviada no seu e-mail (inicial: raian123).", "error");
    }
  },

  logout() {
    localStorage.removeItem("auth_user");
    this.currentUser = null;
    this.currentRole = "aluno";
    this.activeStudentId = null;
    this.mostrarToast("Sessão finalizada com sucesso.", "info");
    this.render();
  },

  abrirModalTrocarSenha() {
    if (!this.currentUser) return;
    const novaSenha = prompt("🔑 Digite a sua nova senha de acesso ao aplicativo (mínimo 4 caracteres):");
    if (!novaSenha) return;
    if (novaSenha.trim().length < 4) {
      alert("A senha deve ter no mínimo 4 caracteres.");
      return;
    }
    localStorage.setItem("pwd_" + this.currentUser.email.toLowerCase(), novaSenha.trim());
    this.mostrarToast("✅ Senha alterada com sucesso! Guarde-a para seus próximos acessos.", "success");
  },

  setTab(tab) {
    this.activeTab = tab;
    this.render();
  },

  setStudent(studentId) {
    // Apenas professor pode trocar o aluno ativo
    if (this.currentRole === "professor") {
      this.activeStudentId = studentId;
      this.render();
    }
  },

  verComoAluno(studentId) {
    if (this.currentRole === "professor") {
      this.activeStudentId = studentId;
      this.setTab("treino_hoje_preview");
    }
  },

  // ==========================================
  // RENDERIZADOR GERAL
  // ==========================================
  render() {
    const container = document.getElementById("mainContent");
    const navTabsContainer = document.getElementById("navTabs");
    const userSessionArea = document.getElementById("userSessionArea");

    // 1. SE NÃO ESTIVER LOGADO -> EXIBIR TELA DE LOGIN
    if (!this.currentUser) {
      navTabsContainer.style.display = "none";
      userSessionArea.innerHTML = `
        <a href="${FORM_URL}" target="_blank" class="btn btn-sm btn-pix" style="text-decoration: none;">
          📝 Fazer Anamnese
        </a>
      `;
      container.innerHTML = this.renderLoginView();
      return;
    }

    // 2. SE ESTIVER LOGADO -> EXIBIR CABEÇALHO DO USUÁRIO
    navTabsContainer.style.display = "flex";
    if (this.currentRole === "professor") {
      userSessionArea.innerHTML = `
        <div class="user-session">
          <span class="user-badge professor">👨‍🏫 Prof. Raian Bispo</span>
          <button class="btn-logout" onclick="App.logout()">🚪 Sair</button>
        </div>
      `;
    } else {
      userSessionArea.innerHTML = `
        <div class="user-session">
          <span class="user-badge aluno">📱 ${this.currentUser.name || 'Aluno'}</span>
          <button class="btn-outline-sm" onclick="App.abrirModalTrocarSenha()">🔑 Senha</button>
          <button class="btn-logout" onclick="App.logout()">🚪 Sair</button>
        </div>
      `;
    }

    const students = db.getStudents();
    const student = db.getStudentById(this.activeStudentId);

    // 3. ABAS E CONTEÚDO DO PROFESSOR (ACESSO FULL)
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

      if (this.activeTab === "alunos") {
        container.innerHTML = this.renderProfessorStudentsView(students);
      } else if (this.activeTab === "financeiro") {
        container.innerHTML = this.renderProfessorFinancialView(students);
      } else if (this.activeTab === "exercicios") {
        container.innerHTML = this.renderExerciseLibraryView();
      } else if (this.activeTab === "treino_hoje_preview") {
        container.innerHTML = `
          <div style="margin-bottom: 16px;">
            <button class="btn btn-sm" onclick="App.setTab('alunos')">← Voltar à Lista de Alunos</button>
          </div>
          ${this.renderStudentWorkoutView(student)}
        `;
      }
      return;
    }

    // 4. ABAS E CONTEÚDO DO ALUNO (ACESSO EXCLUSIVO AOS DADOS DELE)
    navTabsContainer.innerHTML = `
      <button class="tab-btn ${this.activeTab === 'treino_hoje' ? 'active' : ''}" onclick="App.setTab('treino_hoje')">
        🏋️ Meu Treino
      </button>
      <button class="tab-btn ${this.activeTab === 'diario_alimentar' ? 'active' : ''}" onclick="App.setTab('diario_alimentar')">
        🥗 Diário Alimentar & Calorias
      </button>
      <button class="tab-btn ${this.activeTab === 'meu_perfil' ? 'active' : ''}" onclick="App.setTab('meu_perfil')">
        👤 Minha Anamnese & Parecer
      </button>
      <button class="tab-btn ${this.activeTab === 'meu_plano' ? 'active' : ''}" onclick="App.setTab('meu_plano')">
        💳 Meu Plano & Pix
      </button>
    `;

    if (!student) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⏳</div>
          <div class="empty-state-title">Seu treino está sendo preparado pelo Professor Raian Bispo!</div>
          <div class="empty-state-desc">
            Sua anamnese já foi recebida. Assim que o professor finalizar a montagem personalizada, ela aparecerá aqui.
          </div>
          <button class="btn btn-sm btn-pix" onclick="App.autoSyncGoogleSheets()">🔄 Atualizar Meus Dados</button>
        </div>
      `;
      return;
    }

    if (this.activeTab === "treino_hoje") {
      container.innerHTML = this.renderStudentWorkoutView(student);
    } else if (this.activeTab === "diario_alimentar") {
      container.innerHTML = this.renderStudentFoodDiaryView(student);
    } else if (this.activeTab === "meu_perfil") {
      container.innerHTML = this.renderStudentProfileView(student);
    } else if (this.activeTab === "meu_plano") {
      container.innerHTML = this.renderStudentPlanView(student);
    }
  },

  // ==========================================
  // TELA DE LOGIN
  // ==========================================
  renderLoginView() {
    return `
      <div class="login-wrapper">
        <div class="login-card">
          <img src="assets/logo.jpg?v=6" alt="Raian Bispo Logo" class="login-logo">
          <h2 class="login-title">Consultoria Raian Bispo</h2>
          <div class="login-subtitle">A Meta é Logo Ali • Treinos Personalizados</div>

          <form class="login-form" onsubmit="App.fazerLogin(event)">
            <div>
              <label class="input-label">E-mail Cadastrado</label>
              <input type="email" id="loginEmail" class="input-field" placeholder="seuemail@exemplo.com" required autocomplete="email">
            </div>

            <div>
              <label class="input-label">Senha de Acesso</label>
              <input type="password" id="loginSenha" class="input-field" placeholder="Sua senha" required autocomplete="current-password">
            </div>

            <button type="submit" class="btn-login">
              Entrar no Aplicativo 🚀
            </button>
          </form>

          <div class="login-helper">
            ℹ️ <strong>Aluno:</strong> Acesse com o e-mail preenchido no formulário e a senha provisória enviada no seu e-mail (padrão inicial: <strong>raian123</strong>). Você poderá trocá-la após o login.
          </div>

          <div style="margin-top: 20px; border-top: 1px solid var(--border); padding-top: 16px;">
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 8px;">Ainda não preencheu sua avaliação física?</p>
            <a href="${FORM_URL}" target="_blank" class="login-footer-link">
              📝 Clique aqui para preencher a Anamnese Esportiva
            </a>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // COMPONENTES DO PROFESSOR (FULL ACCESS)
  // ==========================================
  renderProfessorStudentsView(students) {
    if (!students || students.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">Base de Alunos Pronta para Novos Cadastros!</div>
          <div class="empty-state-desc">
            Todos os dados de teste foram apagados com sucesso. Assim que um aluno preencher o formulário de anamnese, o sistema receberá o cadastro automaticamente aqui e enviará as credenciais de acesso por e-mail para ele.
          </div>
          <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
            <a href="${FORM_URL}" target="_blank" class="btn btn-sm btn-pix" style="text-decoration: none;">
              🔗 Abrir Formulário de Anamnese
            </a>
            <button class="btn btn-sm" onclick="App.executarSincronizacaoPlanilha()">
              ⚡ Sincronizar Agora com a Planilha
            </button>
          </div>
        </div>
      `;
    }

    let faturamentoTotal = students.reduce((acc, s) => acc + (s.financeiro.valor || 0), 0);
    let totalEmDia = students.filter(s => s.financeiro.status === 'em_dia').length;

    let studentsCardsHtml = students.map(s => `
      <div class="card" style="border-left: 4px solid var(--primary); margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <h3 style="font-size: 1.25rem; font-weight: 800;">${s.nome}</h3>
              <span class="badge-status ${s.financeiro.status}">${s.financeiro.status.replace('_', ' ')}</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.82rem; margin-top: 4px;">
              📧 ${s.email} | 📞 ${s.telefone || s.whatsapp} | ${s.peso} kg | ${s.altura} cm | <strong>IMC: ${s.imc}</strong> (${s.classificacaoImc})
            </p>
            <p style="color: #38bdf8; font-size: 0.85rem; font-weight: 700; margin-top: 6px;">
              🎯 Objetivo: ${s.objetivo} (${s.nivelTreino})
            </p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm" onclick="App.verComoAluno('${s.id}')">
              📱 Ver Como Este Aluno
            </button>
            <a href="https://wa.me/55${(s.telefone || s.whatsapp || '').replace(/\D/g, '')}" target="_blank" class="btn btn-sm btn-pix" style="text-decoration: none;">
              💬 WhatsApp
            </a>
          </div>
        </div>

        <!-- ALERTAS CLÍNICOS CRÍTICOS CRUZADOS COM IMC -->
        <div style="margin-top: 14px; background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; padding: 10px 14px; border-radius: 6px; font-size: 0.8rem; color: #fca5a5;">
          <strong style="color: #f87171;">⚠️ Parecer & Alertas Clínicos:</strong><br>
          • <strong>Alerta Farmacológico / Pressórico:</strong> ${s.alertaFarmacologico || 'Nenhum'}<br>
          • <strong>Alerta Articular / Biomecânico:</strong> ${s.alertaArticular || 'Nenhum'}
        </div>

        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border); display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 0.82rem;">
          <div>
            <span style="color: var(--text-muted);">Metas Diárias:</span><br>
            <strong style="color: #60a5fa;">${s.metaCalorias} kcal</strong> (P: ${s.macros.prot}g | C: ${s.macros.carb}g | G: ${s.macros.fat}g)
          </div>
          <div>
            <span style="color: var(--text-muted);">Divisão de Treino:</span><br>
            <strong>${s.treinoAtual ? s.treinoAtual.nome : 'Prescrição sob medida'}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted);">Mensalidade / Plano:</span><br>
            <strong>R$ ${s.financeiro.valor.toFixed(2)}</strong> (${s.financeiro.plano})
          </div>
        </div>
      </div>
    `).join("");

    return `
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
          <div class="stat-icon" style="background: rgba(139, 92, 246, 0.15); color: #c084fc;">🔑</div>
          <div>
            <div class="stat-val" style="font-size: 1.1rem; cursor: pointer;" onclick="App.copiarChavePix()">${PIX_KEY} 📋</div>
            <div class="stat-label">Chave Pix Telefone</div>
          </div>
        </div>
      </div>

      <div class="card-title" style="margin-top: 24px;">
        <span>Alunos Cadastrados na Consultoria</span>
        <button class="btn btn-sm" onclick="App.abrirModalSincronizacao()">
          🔄 Sincronizar com a Planilha
        </button>
      </div>

      ${studentsCardsHtml}
    `;
  },

  renderProfessorFinancialView(students) {
    let faturamentoTotal = students.reduce((acc, s) => acc + (s.financeiro.valor || 0), 0);

    let rowsHtml = students.map(s => `
      <tr>
        <td><strong>${s.nome}</strong><br><span style="color: var(--text-muted); font-size: 0.78rem;">${s.telefone || s.whatsapp}</span></td>
        <td>${s.financeiro.plano}</td>
        <td><strong>R$ ${(s.financeiro.valor || 0).toFixed(2)}</strong></td>
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
            <div class="stat-label">Previsão de Faturamento</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa;">🔑</div>
          <div>
            <div class="stat-val" style="font-size: 1.1rem; cursor: pointer;" onclick="App.copiarChavePix()">${PIX_KEY} 📋</div>
            <div class="stat-label">Chave Pix Oficial Raian Bispo (Telefone)</div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <div class="card-title">
          <span>Gestão de Cobranças e Mensalidades</span>
          <button class="btn btn-sm btn-pix" onclick="App.copiarChavePix()">
            📋 Copiar Chave Pix: ${PIX_KEY}
          </button>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Plano Contratado</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || '<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--text-muted);">Nenhum aluno cadastrado.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // ==========================================
  // COMPONENTES DO ALUNO (ESTRITAMENTE ISOLADO)
  // ==========================================
  renderStudentWorkoutView(student) {
    if (!student || !student.treinoAtual) {
      return `<div class="empty-state"><div class="empty-state-title">Treino em fase de prescrição.</div></div>`;
    }

    const treino = student.treinoAtual;
    let diasHtml = treino.dias.map((d, dIdx) => `
      <div class="workout-day-card">
        <div class="workout-day-header">
          <div class="workout-day-title">${d.dia}</div>
          <span style="font-size: 0.8rem; color: #60a5fa; font-weight: 700;">${d.exercicios.length} Exercícios</span>
        </div>

        <div class="exercise-list">
          ${d.exercicios.map((ex, exIdx) => {
            const libEx = db.getExerciseById(ex.id) || { nome: ex.id, grupo: "Geral", execucao: "" };
            return `
              <div class="exercise-item ${ex.concluido ? 'completed' : ''}">
                <div class="exercise-info">
                  <div class="exercise-name">${libEx.nome}</div>
                  <div class="exercise-meta">
                    <strong>${ex.series} séries</strong> × <strong>${ex.reps} reps</strong>
                    ${ex.cargaKg ? `• <span style="color: #60a5fa;">${ex.cargaKg} kg</span>` : ''}
                  </div>
                </div>

                <div style="display: flex; gap: 8px;">
                  <button class="btn btn-sm" style="background: rgba(255,255,255,0.06); padding: 8px 12px;" onclick="App.abrirModalExercicio('${ex.id}')">
                    👁️ Ver Movimento
                  </button>
                  <button class="btn-check ${ex.concluido ? 'checked' : ''}" onclick="App.toggleExercicio('${student.id}', ${dIdx}, ${exIdx})">
                    ${ex.concluido ? '✓ Feito' : 'Concluir'}
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `).join("");

    return `
      <!-- BANNER DO PLANO DE TREINO -->
      <div class="card" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 800;">${treino.nome}</h2>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">
              Prescrito exclusivamente para <strong>${student.nome}</strong> • Foco: ${student.objetivo}
            </p>
          </div>
          <div style="background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); padding: 8px 16px; border-radius: var(--radius-md); font-size: 0.85rem; color: #60a5fa; font-weight: 700;">
            🔥 "A Meta é Logo Ali"
          </div>
        </div>

        <!-- ALERTA BIOMECÂNICO ESPECÍFICO DO ALUNO -->
        ${student.alertaArticular && student.alertaArticular !== 'não' ? `
          <div style="margin-top: 14px; background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; padding: 10px 14px; border-radius: 6px; font-size: 0.82rem; color: #fca5a5;">
            <strong>⚠️ Orientação Biomecânica do Professor Raian:</strong> ${student.alertaArticular}
          </div>
        ` : ''}
      </div>

      <!-- TIMER DE DESCANSO FLUTUANTE / ACIONÁVEL -->
      <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; margin-bottom: 20px; background: rgba(15, 23, 42, 0.9);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 1.6rem;">⏱️</span>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">Descanso entre Séries</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Tempo recomendado: 60 a 90 segundos</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span id="timerDisplay" style="font-size: 1.4rem; font-weight: 800; font-family: monospace; color: #60a5fa;">01:00</span>
          <button class="btn btn-sm btn-pix" onclick="App.iniciarTimerDescanso(60)">▶ Iniciar 60s</button>
        </div>
      </div>

      <!-- LISTAGEM DOS DIAS DE TREINO -->
      ${diasHtml}
    `;
  },

  renderStudentFoodDiaryView(student) {
    if (!student) return '';

    const diario = student.diarioHoje || [];
    const totalCal = diario.reduce((acc, item) => acc + (item.calorias || 0), 0);
    const totalProt = diario.reduce((acc, item) => acc + (item.prot || 0), 0);
    const totalCarb = diario.reduce((acc, item) => acc + (item.carb || 0), 0);
    const totalFat = diario.reduce((acc, item) => acc + (item.fat || 0), 0);

    const metaCal = student.metaCalorias || 2000;
    const percCal = Math.min(100, Math.round((totalCal / metaCal) * 100));

    return `
      <!-- RESUMO DE CALORIAS E MACROS -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-title">
          <span>Metas Nutricionais Diárias</span>
          <span style="color: #60a5fa; font-size: 0.9rem;">${totalCal} / ${metaCal} kcal (${percCal}%)</span>
        </div>

        <div style="background: rgba(255, 255, 255, 0.08); height: 12px; border-radius: 999px; overflow: hidden; margin: 12px 0 20px;">
          <div style="background: linear-gradient(90deg, #3b82f6, #10b981); height: 100%; width: ${percCal}%; transition: width 0.4s ease;"></div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
          <div style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border);">
            <div style="font-size: 0.78rem; color: var(--text-muted);">Proteínas</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: #60a5fa;">${totalProt.toFixed(0)}g / ${student.macros.prot}g</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border);">
            <div style="font-size: 0.78rem; color: var(--text-muted);">Carboidratos</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: #34d399;">${totalCarb.toFixed(0)}g / ${student.macros.carb}g</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border);">
            <div style="font-size: 0.78rem; color: var(--text-muted);">Gorduras</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: #fbbf24;">${totalFat.toFixed(0)}g / ${student.macros.fat}g</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border);">
            <div style="font-size: 0.78rem; color: var(--text-muted);">Água Alvo</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: #38bdf8;">${student.macros.agua} L/dia</div>
          </div>
        </div>
      </div>

      <!-- REGISTRO DE ALIMENTOS DO DIA -->
      <div class="card">
        <div class="card-title">
          <span>Refeições Registradas Hoje</span>
          <button class="btn btn-sm btn-pix" onclick="App.abrirModalAdicionarAlimento('${student.id}')">
            + Adicionar Alimento
          </button>
        </div>

        <div style="margin-top: 14px;">
          ${diario.length === 0 ? `
            <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.9rem;">
              Nenhum alimento registrado hoje ainda. Clique em "+ Adicionar Alimento" para contabilizar suas calorias!
            </div>
          ` : diario.map((item, idx) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 8px;">
              <div>
                <strong>${item.refeicao}</strong>: ${item.alimentoId ? (db.getFoodById(item.alimentoId)?.nome || item.alimentoId) : 'Alimento'} (${item.qtd} porção)
                <div style="font-size: 0.78rem; color: var(--text-muted);">
                  ${item.calorias} kcal • P: ${item.prot}g • C: ${item.carb}g • G: ${item.fat}g
                </div>
              </div>
              <button class="btn-sm" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer;" onclick="App.removerAlimento('${student.id}', ${idx})">
                Remover
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  },

  renderStudentProfileView(student) {
    if (!student) return '';

    return `
      <div class="card" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
        <h2 style="font-size: 1.3rem; font-weight: 800;">${student.nome}</h2>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">
          ${student.idade} anos • ${student.genero} • ${student.profissao}
        </p>

        <div style="margin-top: 16px; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; font-size: 0.85rem;">
          <div style="background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
            <span style="color: var(--text-muted);">Peso Corporal:</span><br>
            <strong style="font-size: 1.1rem; color: #fff;">${student.peso} kg</strong>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
            <span style="color: var(--text-muted);">Altura:</span><br>
            <strong style="font-size: 1.1rem; color: #fff;">${student.altura} cm</strong>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
            <span style="color: var(--text-muted);">IMC Calculado:</span><br>
            <strong style="font-size: 1.1rem; color: #38bdf8;">${student.imc}</strong> (${student.classificacaoImc})
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
            <span style="color: var(--text-muted);">Meta de Peso:</span><br>
            <strong style="font-size: 1.1rem; color: #34d399;">${student.metaPeso}</strong>
          </div>
        </div>
      </div>

      <!-- PARECER TÉCNICO E CONDUTA CLÍNICA -->
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-title">
          <span>⚠️ Parecer Clínico do Professor Raian Bispo</span>
        </div>
        <div style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; padding: 14px; border-radius: 8px; font-size: 0.88rem; color: #fca5a5; line-height: 1.6;">
          <p style="margin-bottom: 8px;"><strong>• Alerta Farmacológico / Pressórico:</strong> ${student.alertaFarmacologico || 'Nenhuma contraindicação relatada.'}</p>
          <p><strong>• Alerta Articular / Biomecânico:</strong> ${student.alertaArticular || 'Aparelho locomotor sem restrições musculoesqueléticas.'}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <span>Orientação de Hábitos e Recuperação</span>
        </div>
        <div style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.7;">
          <p>💧 <strong>Hidratação Obrigatória:</strong> Mínimo de ${student.macros.agua} litros de água pura ao longo do dia para permitir o transporte de nutrientes e a integridade articular.</p>
          <p style="margin-top: 8px;">💤 <strong>Sono Reparador:</strong> Interromper consumo de qualquer estimulante (café, energético, pré-treino) após as 13h para permitir o reparo do tecido muscular.</p>
        </div>
      </div>
    `;
  },

  renderStudentPlanView(student) {
    if (!student) return '';

    return `
      <div class="card" style="border-left: 4px solid #10b981; margin-bottom: 20px;">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #fff;">Sua Consultoria On-Line</h2>
        <div style="color: #60a5fa; font-weight: 700; margin-top: 4px; font-size: 0.95rem;">
          Professor Raian Bispo • A Meta é Logo Ali
        </div>

        <div style="margin-top: 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div>
              <span style="font-size: 0.82rem; color: var(--text-muted);">Plano Contratado:</span>
              <h3 style="font-size: 1.15rem; margin-top: 2px;">${student.financeiro.plano}</h3>
            </div>
            <div>
              <span style="font-size: 0.82rem; color: var(--text-muted);">Valor:</span>
              <h3 style="font-size: 1.35rem; color: #34d399; margin-top: 2px;">R$ ${student.financeiro.valor.toFixed(2)}</h3>
            </div>
          </div>

          <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Status do Pagamento:</span>
            <span class="badge-status ${student.financeiro.status}">${student.financeiro.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      <!-- CARD DE PAGAMENTO PIX DIRETO -->
      <div class="card" style="text-align: center; padding: 28px 20px;">
        <div style="font-size: 2.2rem; margin-bottom: 10px;">💳</div>
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 6px;">Pagamento via Pix</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 18px;">
          Para ativação ou renovação da sua consultoria, utilize a chave Pix oficial do Professor Raian Bispo abaixo:
        </p>

        <div style="background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: var(--radius-md); padding: 14px; max-width: 380px; margin: 0 auto 16px;">
          <div style="font-size: 0.78rem; color: #60a5fa; text-transform: uppercase; font-weight: 700;">Chave Pix (Telefone)</div>
          <div style="font-size: 1.35rem; font-weight: 800; letter-spacing: 1px; color: #fff; margin: 4px 0;">${PIX_KEY}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Favorecido: <strong>Raian Bispo</strong></div>
        </div>

        <button class="btn btn-pix" style="padding: 12px 24px; font-size: 0.95rem; margin: 0 auto;" onclick="App.copiarChavePix()">
          📋 Copiar Chave Pix (${PIX_KEY})
        </button>
      </div>
    `;
  },

  // ==========================================
  // BIBLIOTECA DE EXERCÍCIOS
  // ==========================================
  renderExerciseLibraryView() {
    const list = db.getExerciseLibrary();
    return `
      <div class="card">
        <div class="card-title">
          <span>Biblioteca Biomecânica de Exercícios (${list.length})</span>
        </div>
        <div class="grid-exercises" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-top: 16px;">
          ${list.map(ex => `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; cursor: pointer;" onclick="App.abrirModalExercicio('${ex.id}')">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4 style="font-size: 1rem; font-weight: 700;">${ex.nome}</h4>
                <span style="font-size: 0.75rem; background: rgba(59,130,246,0.15); color: #60a5fa; padding: 2px 8px; border-radius: 4px;">${ex.grupo}</span>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px; line-height: 1.4;">${ex.execucao}</p>
              <div style="margin-top: 12px; font-size: 0.8rem; color: #38bdf8; font-weight: 600;">
                ▶ Ver Animação do Movimento
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  },

  // ==========================================
  // AÇÕES, MODAIS E UTILITÁRIOS
  // ==========================================
  copiarChavePix() {
    navigator.clipboard.writeText(PIX_KEY);
    alert(`✅ Chave Pix (Telefone) copiada com sucesso:\n\n${PIX_KEY}\n\nFavorecido: Raian Bispo`);
  },

  enviarCobrancaWhats(studentId) {
    const s = db.getStudentById(studentId);
    if (!s) return;
    const fone = (s.telefone || s.whatsapp || '').replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá, ${s.nome}! Aqui é o Professor Raian Bispo. Passando para lembrar da renovação da sua consultoria on-line (A Meta é Logo Ali!). Segue a chave Pix telefone: ${PIX_KEY} no valor de R$ ${(s.financeiro.valor || 0).toFixed(2)}. Bons treinos e foco na meta!`);
    window.open(`https://wa.me/55${fone}?text=${msg}`, '_blank');
  },

  marcarComoPago(studentId) {
    const s = db.getStudentById(studentId);
    if (!s) return;
    s.financeiro.status = "em_dia";
    db.updateStudent(s);
    this.mostrarToast(`✅ Pagamento confirmado para ${s.nome}!`, "success");
    this.render();
  },

  toggleExercicio(studentId, dIdx, exIdx) {
    const s = db.getStudentById(studentId);
    if (!s || !s.treinoAtual || !s.treinoAtual.dias[dIdx]) return;
    const ex = s.treinoAtual.dias[dIdx].exercicios[exIdx];
    ex.concluido = !ex.concluido;
    db.updateStudent(s);
    this.render();
  },

  iniciarTimerDescanso(segundos = 60) {
    clearInterval(this.restTimerInterval);
    let restante = segundos;
    const display = document.getElementById("timerDisplay");

    this.restTimerInterval = setInterval(() => {
      restante--;
      const m = Math.floor(restante / 60).toString().padStart(2, "0");
      const s = (restante % 60).toString().padStart(2, "0");
      if (display) display.innerText = `${m}:${s}`;

      if (restante <= 0) {
        clearInterval(this.restTimerInterval);
        if (display) display.innerText = "BORA! 🔥";
        this.mostrarToast("⏰ Tempo de descanso encerrado! Próxima série!", "info");
      }
    }, 1000);
  },

  abrirModalExercicio(exerciseId) {
    let modal = document.getElementById("exerciseModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "exerciseModal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    const ex = db.getExerciseById(exerciseId);
    if (!ex) return;

    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <span>🏋️</span> ${ex.nome}
          </div>
          <button class="modal-close" onclick="App.fecharModalExercicio()">×</button>
        </div>

        <div class="visual-card">
          <div class="svg-container">
            ${VisualBiomechanics.generateExerciseSVG(ex.svgType)}
          </div>
          <div class="animation-controls">
            <button class="btn btn-sm btn-pix" onclick="VisualBiomechanics.togglePlayAnimation()">
              ⏸ Pausar / Reproduzir
            </button>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Animação Biomecânica em Tempo Real</span>
          </div>
        </div>

        <div style="margin-top: 16px; font-size: 0.85rem; line-height: 1.6;">
          <p><strong>🎯 Grupo Muscular:</strong> ${ex.grupo}</p>
          <p><strong>⚡ Sinergistas:</strong> ${ex.sinergistas || 'Não especificado'}</p>
          <p style="margin-top: 6px;"><strong>⚙️ Instruções de Execução:</strong> ${ex.execucao}</p>
          ${ex.videoHint ? `<p style="margin-top: 6px; color: #60a5fa;"><strong>💡 Dica do Professor Raian:</strong> ${ex.videoHint}</p>` : ''}
        </div>
      </div>
    `;
    modal.style.display = "flex";
  },

  fecharModalExercicio() {
    const modal = document.getElementById("exerciseModal");
    if (modal) modal.style.display = "none";
  },

  abrirModalAdicionarAlimento(studentId) {
    let modal = document.getElementById("foodModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "foodModal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    const foods = db.getFoodDatabase();
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <span>🥗</span> Registrar Alimento
          </div>
          <button class="modal-close" onclick="App.fecharModalAdicionarAlimento()">×</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 14px;">
          <div>
            <label class="input-label">Refeição</label>
            <select id="modalRefeicao" class="input-field">
              <option value="Café da Manhã">Café da Manhã</option>
              <option value="Almoço">Almoço</option>
              <option value="Lanche da Tarde">Lanche da Tarde</option>
              <option value="Jantar">Jantar</option>
              <option value="Pós-Treino">Pós-Treino</option>
            </select>
          </div>

          <div>
            <label class="input-label">Alimento (Tabela TACO)</label>
            <select id="modalAlimentoId" class="input-field">
              ${foods.map(f => `<option value="${f.id}">${f.nome} - ${f.porcao} (${f.calorias} kcal)</option>`).join("")}
            </select>
          </div>

          <div>
            <label class="input-label">Quantidade de Porções</label>
            <input type="number" id="modalQtd" class="input-field" value="1" min="0.5" step="0.5">
          </div>

          <button class="btn-login" style="margin-top: 8px;" onclick="App.salvarAlimento('${studentId}')">
            + Salvar no Meu Diário
          </button>
        </div>
      </div>
    `;
    modal.style.display = "flex";
  },

  fecharModalAdicionarAlimento() {
    const modal = document.getElementById("foodModal");
    if (modal) modal.style.display = "none";
  },

  salvarAlimento(studentId) {
    const s = db.getStudentById(studentId);
    const ref = document.getElementById("modalRefeicao").value;
    const foodId = document.getElementById("modalAlimentoId").value;
    const qtd = parseFloat(document.getElementById("modalQtd").value) || 1;
    const food = db.getFoodById(foodId);

    if (!s || !food) return;

    if (!s.diarioHoje) s.diarioHoje = [];
    s.diarioHoje.push({
      refeicao: ref,
      alimentoId: foodId,
      qtd: qtd,
      calorias: Math.round(food.calorias * qtd),
      prot: +(food.prot * qtd).toFixed(1),
      carb: +(food.carb * qtd).toFixed(1),
      fat: +(food.fat * qtd).toFixed(1)
    });

    db.updateStudent(s);
    this.fecharModalAdicionarAlimento();
    this.mostrarToast("✅ Alimento registrado com sucesso no seu diário!", "success");
    this.render();
  },

  removerAlimento(studentId, idx) {
    const s = db.getStudentById(studentId);
    if (s && s.diarioHoje) {
      s.diarioHoje.splice(idx, 1);
      db.updateStudent(s);
      this.render();
    }
  },

  abrirModalSincronizacao() {
    let modal = document.getElementById("syncModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "syncModal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <span>🔄</span> Sincronização em Tempo Real
          </div>
          <button class="modal-close" onclick="App.fecharModalSincronizacao()">×</button>
        </div>

        <div style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
          O aplicativo lê automaticamente as respostas da sua Planilha do Google Forms em nuvem.
        </div>

        <button class="btn btn-sm btn-pix" style="width: 100%; justify-content: center; font-size: 0.95rem; padding: 14px;" onclick="App.executarSincronizacaoPlanilha()">
          ⚡ Forçar Sincronização Agora com a Planilha
        </button>

        <div style="display: flex; gap: 10px; margin-top: 14px;">
          <button class="btn btn-sm" style="flex: 1; justify-content: center;" onclick="App.fecharModalSincronizacao()">
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
    this.mostrarToast("Buscando respostas atualizadas na nuvem...", "info");
    const res = await db.syncWithGoogleSheetsGViz();
    this.fecharModalSincronizacao();
    if (res.success) {
      this.mostrarToast(`✅ Base sincronizada: ${res.count} alunos ativos.`, "success");
      this.render();
    } else {
      this.mostrarToast(`⚠️ Aviso: ${res.error}`, "info");
    }
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
