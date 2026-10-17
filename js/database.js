/**
 * Base de Dados & Camada de Armazenamento da Consultoria Esportiva
 * Integração local com persistência em LocalStorage e compatibilidade com Google Drive
 */

// 1. BIBLIOTECA DE EXERCÍCIOS COM REPRESENTAÇÃO BIOMECÂNICA VISUAL (SVG DINÂMICO)
const EXERCISE_LIBRARY = [
  {
    id: "supino_reto",
    nome: "Supino Reto com Barra",
    grupo: "Peitoral",
    sinergistas: "Deltoide Anterior, Tríceps",
    equipamento: "Banco reto e barra",
    nivel: "Intermediário/Avançado",
    execucao: "Escápulas em adução e depressão. Desça a barra controladamente até a linha dos mamilos e empurre explosivo sem projetar os ombros.",
    svgType: "bench_press",
    videoHint: "Foco no arco torácico e pés firmes no chão"
  },
  {
    id: "supino_inclinado_halteres",
    nome: "Supino Inclinado com Halteres",
    grupo: "Peitoral",
    sinergistas: "Porção Clavicular do Peitoral, Deltoide Anterior, Tríceps",
    equipamento: "Banco inclinado a 30°-45° e halteres",
    nivel: "Todos",
    execucao: "Abaixe os halteres abrindo o peito até a linha do queixo/ombro e suba convergindo suavemente no topo sem bater os pesos.",
    svgType: "incline_press",
    videoHint: "Não exceda 45 graus de inclinação para não sobrecarregar o deltoide"
  },
  {
    id: "crossover_polia",
    nome: "Crossover na Polia Média",
    grupo: "Peitoral",
    sinergistas: "Deltoide Anterior",
    equipamento: "Crossover / Polia Dupla",
    nivel: "Todos",
    execucao: "Tronco levemente inclinado à frente. Cotovelos semi-flexionados. Cruze as mãos na frente do tronco contraindo o peitoral no pico.",
    svgType: "fly",
    videoHint: "Mantenha o ângulo dos cotovelos congelado durante todo o movimento"
  },
  {
    id: "puxada_alta",
    nome: "Puxada Alta Frontal (Lat Pulldown)",
    grupo: "Dorsal",
    sinergistas: "Bíceps Braquial, Braquiorradial, Redondo Maior",
    equipamento: "Polia Alta com Barra Reta",
    nivel: "Iniciante a Avançado",
    execucao: "Pegada aberta pronada. Inicie o movimento deprimindo as escápulas e puxe a barra na direção da fúrcula esternal sem balançar o tronco.",
    svgType: "lat_pulldown",
    videoHint: "Puxe com os cotovelos apontando para o chão, não para trás"
  },
  {
    id: "remada_curvada",
    nome: "Remada Curvada Pronada com Barra",
    grupo: "Dorsal",
    sinergistas: "Trapézio, Romboides, Deltoide Posterior, Bíceps",
    equipamento: "Barra Olímpica e anilhas",
    nivel: "Avançado",
    execucao: "Tronco inclinado a 45°, coluna neutra e joelhos semi-flexionados. Puxe a barra em direção ao umbigo espremendo as escápulas.",
    svgType: "bent_row",
    videoHint: "Mantenha o core 100% ativo para proteger a lombar"
  },
  {
    id: "agachamento_livre",
    nome: "Agachamento Livre com Barra",
    grupo: "Quadríceps",
    sinergistas: "Glúteo Máximo, Isquiotibiais, Eretores da Espinha",
    equipamento: "Rack de agachamento e barra",
    nivel: "Intermediário/Avançado",
    execucao: "Pés na largura dos ombros, pontas levemente para fora. Inicie quebrando o quadril e joelhos juntos, descendo até paralelo ou mais com coluna neutra.",
    svgType: "squat",
    videoHint: "Joelhos devem sempre acompanhar a linha das pontas dos pés"
  },
  {
    id: "leg_press_45",
    nome: "Leg Press 45°",
    grupo: "Quadríceps",
    sinergistas: "Glúteos, Isquiotibiais",
    equipamento: "Máquina Leg Press 45",
    nivel: "Iniciante a Avançado",
    execucao: "Lombar e glúteos 100% colados no encosto. Desça a plataforma até 90° de flexão de joelho sem deixar a pelve retroverter. Empurre pelo calcanhar.",
    svgType: "leg_press",
    videoHint: "Nunca trave os joelhos (hiperextensão) no topo do movimento"
  },
  {
    id: "mesa_flexora",
    nome: "Mesa Flexora Deitada",
    grupo: "Isquiotibiais",
    sinergistas: "Gastrocnêmio",
    equipamento: "Máquina mesa flexora",
    nivel: "Todos",
    execucao: "Deite de bruços, almofada logo acima dos calcanhares. Flexione os joelhos trazendo a almofada em direção ao glúteo. Segure 1s na contração.",
    svgType: "leg_curl",
    videoHint: "Não descole o quadril do banco durante a fase concêntrica"
  },
  {
    id: "desenvolvimento_halteres",
    nome: "Desenvolvimento de Ombros com Halteres",
    grupo: "Deltoide",
    sinergistas: "Tríceps, Trapézio",
    equipamento: "Banco reto ou 80° e halteres",
    nivel: "Todos",
    execucao: "Cotovelos a 45° no plano escapular. Empurre os halteres para cima estendendo os braços sem tocar os pesos no topo.",
    svgType: "shoulder_press",
    videoHint: "Evite abrir os cotovelos a 90° no plano frontal para proteger o manguito"
  },
  {
    id: "rosca_direta",
    nome: "Rosca Direta com Barra W",
    grupo: "Bíceps",
    sinergistas: "Braquial, Braquiorradial",
    equipamento: "Barra W",
    nivel: "Todos",
    execucao: "Cotovelos colados ao lado do tronco. Flexione os antebraços erguendo a barra sem projetar os cotovelos para frente.",
    svgType: "bicep_curl",
    videoHint: "Controle a descida em 2 a 3 segundos para máxima quebra de fibras"
  },
  {
    id: "triceps_testa",
    nome: "Tríceps Testa com Halteres",
    grupo: "Tríceps",
    sinergistas: "Ancôneo",
    equipamento: "Banco plano e halteres",
    nivel: "Todos",
    execucao: "Braços verticais ou levemente inclinados para trás. Flexione apenas os cotovelos levando os halteres ao lado da cabeça.",
    svgType: "tricep_extension",
    videoHint: "Mantenha os cotovelos apontados para o teto, sem abrir excessivamente"
  },
  {
    id: "box_squat_cadeira",
    nome: "Sentar e Levantar da Cadeira (Box Squat)",
    grupo: "Quadríceps / Glúteo",
    sinergistas: "Core",
    equipamento: "Cadeira firme / Banco",
    nivel: "Iniciante / Reabilitação",
    execucao: "Toque o glúteo de forma suave e controlada na cadeira e levante empurrando pelo calcanhar sem usar as mãos.",
    svgType: "box_squat",
    videoHint: "Ideal para alunos iniciantes com dor articular ou peso elevado"
  }
];

// 2. TABELA TACO (ALIMENTOS BRASILEIROS PARA O CONTADOR DE CALORIAS)
const TACO_FOOD_DATABASE = [
  { id: "arroz_branco", nome: "Arroz Branco Cozido", porcao: "100g", calorias: 128, prot: 2.5, carb: 28.1, fat: 0.2, categoria: "Carboidratos" },
  { id: "arroz_integral", nome: "Arroz Integral Cozido", porcao: "100g", calorias: 124, prot: 2.6, carb: 25.8, fat: 1.0, categoria: "Carboidratos" },
  { id: "feijao_carioca", nome: "Feijão Carioca Cozido (50% grão/caldo)", porcao: "100g", calorias: 76, prot: 4.8, carb: 13.6, fat: 0.5, categoria: "Leguminosas" },
  { id: "frango_grelhado", nome: "Peito de Frango Grelhado", porcao: "100g", calorias: 159, prot: 32.0, carb: 0.0, fat: 2.5, categoria: "Proteínas" },
  { id: "patinho_moido", nome: "Patinho Bovino Grelhado/Moído", porcao: "100g", calorias: 219, prot: 35.9, carb: 0.0, fat: 7.3, categoria: "Proteínas" },
  { id: "tilapia_grelhada", nome: "Filé de Tilápia Grelhado", porcao: "100g", calorias: 128, prot: 26.1, carb: 0.0, fat: 2.7, categoria: "Proteínas" },
  { id: "ovo_cozido", nome: "Ovo de Galinha Inteiro Cozido", porcao: "1 unid (50g)", calorias: 78, prot: 6.5, carb: 0.6, fat: 5.3, categoria: "Proteínas" },
  { id: "clara_ovo", nome: "Clara de Ovo Cozida", porcao: "1 unid (35g)", calorias: 17, prot: 3.9, carb: 0.3, fat: 0.1, categoria: "Proteínas" },
  { id: "pao_frances", nome: "Pão Francês Tradicional", porcao: "1 unid (50g)", calorias: 150, prot: 4.0, carb: 29.3, fat: 1.6, categoria: "Carboidratos" },
  { id: "pao_integral", nome: "Pão de Forma Integral", porcao: "2 fatias (50g)", calorias: 126, prot: 5.2, carb: 22.0, fat: 1.8, categoria: "Carboidratos" },
  { id: "tapioca", nome: "Goma de Tapioca Pronta", porcao: "50g", calorias: 120, prot: 0.1, carb: 29.8, fat: 0.0, categoria: "Carboidratos" },
  { id: "aveia_flocos", nome: "Aveia em Flocos", porcao: "30g (2 colheres sopa)", calorias: 118, prot: 4.3, carb: 20.0, fat: 2.2, categoria: "Carboidratos" },
  { id: "banana_prata", nome: "Banana Prata", porcao: "1 unid média (70g)", calorias: 68, prot: 0.9, carb: 18.2, fat: 0.1, categoria: "Frutas" },
  { id: "maca", nome: "Maçã Gala com casca", porcao: "1 unid média (130g)", calorias: 72, prot: 0.4, carb: 19.5, fat: 0.2, categoria: "Frutas" },
  { id: "batata_inglesa", nome: "Batata Inglesa Cozida", porcao: "100g", calorias: 52, prot: 1.2, carb: 11.9, fat: 0.1, categoria: "Carboidratos" },
  { id: "batata_doce", nome: "Batata Doce Cozida", porcao: "100g", calorias: 77, prot: 0.6, carb: 18.4, fat: 0.1, categoria: "Carboidratos" },
  { id: "azeite_oliva", nome: "Azeite de Oliva Extravirgem", porcao: "1 colher sopa (10ml)", calorias: 88, prot: 0.0, carb: 0.0, fat: 10.0, categoria: "Gorduras" },
  { id: "pasta_amendoim", nome: "Pasta de Amendoim Integral", porcao: "1 colher sopa (15g)", calorias: 94, prot: 4.3, carb: 2.9, fat: 7.5, categoria: "Gorduras" },
  { id: "whey_protein", nome: "Whey Protein Concentrado 80%", porcao: "1 scoop (30g)", calorias: 120, prot: 24.0, carb: 2.5, fat: 1.5, categoria: "Suplementos" },
  { id: "leite_desnatado", nome: "Leite Desnatado", porcao: "1 copo (200ml)", calorias: 70, prot: 6.0, carb: 10.0, fat: 0.2, categoria: "Laticínios" },
  { id: "iogurte_natural", nome: "Iogurte Natural Desnatado", porcao: "1 pote (170g)", calorias: 75, prot: 6.8, carb: 10.2, fat: 0.5, categoria: "Laticínios" },
  { id: "castanha_caju", nome: "Castanha de Caju Torrada", porcao: "15g (5 unidades)", calorias: 86, prot: 2.7, carb: 4.5, fat: 6.5, categoria: "Gorduras" }
];

// 3. BASE DE DADOS DOS ALUNOS (PRÉ-CARREGADOS COM OS DADOS REAIS DO GOOGLE DRIVE)
const INITIAL_STUDENTS = [
  {
    id: "aluno_raian",
    nome: "Raian Mateus Santos Bispo",
    email: "raianmateus10@gmail.com",
    whatsapp: "71 9 82305941",
    idade: 27,
    genero: "Masculino",
    peso: 103,
    altura: 180,
    imc: 31.79,
    classificacaoImc: "Composição Atlética (Atleta)",
    metaPeso: "Ganho Limpo (Lean Bulk)",
    objetivo: "Hipertrofia Máxima",
    nivelTreino: "Avançado (> 2 anos)",
    profissao: "Professor de Educação Física",
    nivelTrabalho: "Ativo / Pesado",
    tmb: 2025,
    get: 3240,
    metaCalorias: 3490,
    macros: { prot: 210, carb: 448, fat: 95, agua: 4.0 },
    financeiro: {
      plano: "Consultoria Premium Completa",
      valor: 250.00,
      vencimento: "2026-11-10",
      status: "em_dia", // em_dia, a_vencer, atrasado
      metodo: "Pix",
      historico: [
        { data: "2026-10-10", valor: 250.00, status: "Pago", comprovante: "PIX-1010-RAIAN" }
      ]
    },
    treinoAtual: {
      nome: "Push / Pull / Legs (PPL Avançado 3x)",
      dias: [
        {
          dia: "Treino A - Push (Peito, Ombros e Tríceps)",
          exercicios: [
            { id: "supino_reto", series: 4, reps: "6 a 8", cargaKg: 40, concluido: true },
            { id: "supino_inclinado_halteres", series: 3, reps: "8 a 10", cargaKg: 28, concluido: true },
            { id: "crossover_polia", series: 3, reps: "12 a 15", cargaKg: 15, concluido: false },
            { id: "desenvolvimento_halteres", series: 4, reps: "8 a 10", cargaKg: 22, concluido: false },
            { id: "triceps_testa", series: 4, reps: "10 a 12", cargaKg: 14, concluido: false }
          ]
        },
        {
          dia: "Treino B - Pull (Costas, Deltoide Posterior e Bíceps)",
          exercicios: [
            { id: "puxada_alta", series: 4, reps: "8 a 10", cargaKg: 70, concluido: false },
            { id: "remada_curvada", series: 4, reps: "8", cargaKg: 35, concluido: false },
            { id: "rosca_direta", series: 4, reps: "8 a 10", cargaKg: 16, concluido: false }
          ]
        },
        {
          dia: "Treino C - Legs (Inferiores Completos)",
          exercicios: [
            { id: "agachamento_livre", series: 4, reps: "6 a 8", cargaKg: 50, concluido: false },
            { id: "leg_press_45", series: 4, reps: "10 a 12", cargaKg: 240, concluido: false },
            { id: "mesa_flexora", series: 4, reps: "10 a 12", cargaKg: 45, concluido: false }
          ]
        }
      ]
    },
    diarioHoje: [
      { refeicao: "Café da Manhã", alimentoId: "ovo_cozido", qtd: 3, calorias: 234, prot: 19.5, carb: 1.8, fat: 15.9 },
      { refeicao: "Café da Manhã", alimentoId: "pao_frances", qtd: 2, calorias: 300, prot: 8.0, carb: 58.6, fat: 3.2 },
      { refeicao: "Pós-Treino (05h05)", alimentoId: "whey_protein", qtd: 1.2, calorias: 144, prot: 28.8, carb: 3.0, fat: 1.8 },
      { refeicao: "Almoço", alimentoId: "frango_grelhado", qtd: 2, calorias: 318, prot: 64.0, carb: 0.0, fat: 5.0 },
      { refeicao: "Almoço", alimentoId: "arroz_branco", qtd: 2.5, calorias: 320, prot: 6.2, carb: 70.2, fat: 0.5 },
      { refeicao: "Almoço", alimentoId: "feijao_carioca", qtd: 1.5, calorias: 114, prot: 7.2, carb: 20.4, fat: 0.7 }
    ]
  },
  {
    id: "aluno_maylon",
    nome: "Maylon",
    email: "matheus.smarciel@gmail.com",
    whatsapp: "11 986076369",
    idade: 30,
    genero: "Masculino",
    peso: 125,
    altura: 185,
    imc: 36.52,
    classificacaoImc: "Obesidade Grau 2",
    metaPeso: "Chegar a 100 kg",
    objetivo: "Emagrecimento / Definição",
    nivelTreino: "Iniciante (< 6 meses)",
    profissao: "Sedentário",
    nivelTrabalho: "Sedentário",
    tmb: 2261,
    get: 2826,
    metaCalorias: 2276,
    macros: { prot: 188, carb: 212, fat: 75, agua: 4.4 },
    financeiro: {
      plano: "Consultoria Mensal",
      valor: 200.00,
      vencimento: "2026-10-20",
      status: "a_vencer",
      metodo: "Pix",
      historico: [
        { data: "2026-09-20", valor: 200.00, status: "Pago", comprovante: "PIX-MAYLON-09" }
      ]
    },
    treinoAtual: {
      nome: "Adaptação Anatômica & Proteção Articular 3x",
      dias: [
        {
          dia: "Treino A - Inferiores & Core Seguro",
          exercicios: [
            { id: "leg_press_45", series: 4, reps: "10 a 12", cargaKg: 80, concluido: true },
            { id: "box_squat_cadeira", series: 3, reps: "12", cargaKg: 0, concluido: true },
            { id: "mesa_flexora", series: 4, reps: "12", cargaKg: 25, concluido: false }
          ]
        },
        {
          dia: "Treino B - Superiores Empurrar e Puxar",
          exercicios: [
            { id: "puxada_alta", series: 4, reps: "10", cargaKg: 40, concluido: false },
            { id: "desenvolvimento_halteres", series: 3, reps: "10", cargaKg: 10, concluido: false }
          ]
        }
      ]
    },
    diarioHoje: [
      { refeicao: "Café da Manhã", alimentoId: "ovo_cozido", qtd: 2, calorias: 156, prot: 13.0, carb: 1.2, fat: 10.6 },
      { refeicao: "Almoço", alimentoId: "frango_grelhado", qtd: 1.8, calorias: 286, prot: 57.6, carb: 0.0, fat: 4.5 },
      { refeicao: "Almoço", alimentoId: "arroz_branco", qtd: 1.5, calorias: 192, prot: 3.7, carb: 42.1, fat: 0.3 }
    ]
  },
  {
    id: "aluno_matheus",
    nome: "Matheus Santana",
    email: "matheus.smarciel@gmail.com",
    whatsapp: "11 999999999",
    idade: 30,
    genero: "Masculino",
    peso: 130,
    altura: 179,
    imc: 40.57,
    classificacaoImc: "Obesidade Grau 3 (Mórbida)",
    metaPeso: "Chegar a 90 kg",
    objetivo: "Emagrecimento / Saúde",
    nivelTreino: "Iniciante",
    profissao: "Tecnologia",
    nivelTrabalho: "Sedentário",
    tmb: 2274,
    get: 2843,
    metaCalorias: 2293,
    macros: { prot: 170, carb: 235, fat: 75, agua: 4.6 },
    financeiro: {
      plano: "Consultoria Trimestral",
      valor: 550.00,
      vencimento: "2026-10-05",
      status: "atrasado",
      metodo: "Pix",
      historico: [
        { data: "2026-07-05", valor: 550.00, status: "Pago", comprovante: "PIX-MATHEUS-07" }
      ]
    },
    treinoAtual: {
      nome: "Treino em Casa Sem Impacto 3x",
      dias: [
        {
          dia: "Treino A - Membros Inferiores & Core Seguro",
          exercicios: [
            { id: "box_squat_cadeira", series: 3, reps: "10 a 12", cargaKg: 0, concluido: true }
          ]
        }
      ]
    },
    diarioHoje: []
  },
  {
    id: "aluno_raianderson",
    nome: "Raianderson",
    email: "matheus.smarciel@gmail.com",
    whatsapp: "11986076369",
    idade: 28,
    genero: "Masculino",
    peso: 120,
    altura: 180,
    imc: 37.04,
    classificacaoImc: "Obesidade Grau 2",
    metaPeso: "Chegar a 90 kg (-30 kg)",
    objetivo: "Emagrecimento / Definição Muscular",
    nivelTreino: "Iniciante (Menos de 6 meses)",
    profissao: "Tecnologia",
    nivelTrabalho: "Sedentário",
    tmb: 2190,
    get: 2956,
    metaCalorias: 2400,
    macros: { prot: 180, carb: 260, fat: 70, agua: 4.2 },
    financeiro: {
      plano: "Consultoria Mensal",
      valor: 200.00,
      vencimento: "2026-11-17",
      status: "em_dia",
      metodo: "Pix",
      historico: [
        { data: "2026-10-17", valor: 200.00, status: "Pago", comprovante: "PIX-RAIANDERSON" }
      ]
    },
    treinoAtual: {
      nome: "Treino Academia 3x (Baixo Impacto Articular)",
      dias: [
        {
          dia: "Treino A - Superiores (Peitoral & Costas)",
          exercicios: [
            { id: "supino_reto", series: 4, reps: "10 a 12", cargaKg: 40, concluido: false },
            { id: "puxada_alta", series: 4, reps: "10 a 12", cargaKg: 45, concluido: false }
          ]
        },
        {
          dia: "Treino B - Membros Inferiores Protegidos (Evitar impacto)",
          exercicios: [
            { id: "leg_press_45", series: 4, reps: "12 a 15", cargaKg: 80, concluido: false }
          ]
        }
      ]
    },
    diarioHoje: [
      { refeicao: "Café da Manhã", alimentoId: "ovos_mexidos", qtd: 3, calorias: 210, prot: 18, carb: 2, fat: 15 },
      { refeicao: "Almoço", alimentoId: "peito_frango_grelhado", qtd: 2, calorias: 320, prot: 62, carb: 0, fat: 6 }
    ]
  }
];

// Gerenciador de Estado no LocalStorage
class DatabaseManager {
  constructor() {
    this.storageKey = "consultoria_fitness_db_v2";
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      this.save({
        students: INITIAL_STUDENTS,
        exerciseLibrary: EXERCISE_LIBRARY,
        foodDatabase: TACO_FOOD_DATABASE,
        currentUserRole: "professor", // 'professor' ou 'aluno'
        activeStudentId: "aluno_raian" // aluno selecionado
      });
    }
  }

  get() {
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  save(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getStudents() {
    return this.get().students;
  }

  getStudentById(id) {
    return this.get().students.find(s => s.id === id);
  }

  updateStudent(student) {
    const data = this.get();
    const idx = data.students.findIndex(s => s.id === student.id);
    if (idx !== -1) {
      data.students[idx] = student;
      this.save(data);
    }
  }

  getExerciseById(id) {
    return EXERCISE_LIBRARY.find(e => e.id === id);
  }

  getFoodById(id) {
    return TACO_FOOD_DATABASE.find(f => f.id === id);
  }

  async syncWithGoogleAppsScript(apiUrl) {
    try {
      const resp = await fetch(apiUrl);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      if (data.status === "success" && Array.isArray(data.alunos)) {
        const currentData = this.get();
        // Merge or replace students
        const formattedStudents = data.alunos.map(aluno => {
          const id = "aluno_" + aluno.nome.toLowerCase().replace(/\s+/g, '_').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const existing = currentData.students.find(s => s.id === id);
          return {
            id: id,
            nome: aluno.nome,
            email: aluno.email,
            whatsapp: aluno.telefone,
            idade: aluno.idade,
            genero: aluno.genero,
            peso: aluno.peso,
            altura: aluno.altura,
            imc: aluno.imc,
            classificacaoImc: aluno.imc >= 30 ? "Obesidade" : aluno.imc >= 25 ? "Sobrepeso" : "Eutrófico",
            metaPeso: aluno.metaPeso,
            objetivo: aluno.objetivo,
            nivelTreino: "Iniciante",
            profissao: "Geral",
            nivelTrabalho: "Moderado",
            tmb: aluno.tmb,
            get: aluno.get,
            metaCalorias: aluno.metasNutricionais.calorias,
            macros: {
              prot: aluno.metasNutricionais.proteinas,
              carb: aluno.metasNutricionais.carboidratos,
              fat: aluno.metasNutricionais.gorduras,
              agua: aluno.metasNutricionais.agua
            },
            financeiro: existing ? existing.financeiro : {
              plano: "Consultoria Mensal",
              valor: 150.00,
              vencimento: aluno.financeiro.vencimento,
              status: aluno.financeiro.status,
              metodo: "Pix",
              historico: []
            },
            treinoAtual: existing ? existing.treinoAtual : {
              nome: "Treino Personalizado 3x",
              dias: [
                {
                  dia: "Treino A - Superiores & Força",
                  exercicios: [
                    { id: "supino_reto", series: 4, reps: "10 a 12", cargaKg: 0, concluido: false },
                    { id: "puxada_alta", series: 4, reps: "10 a 12", cargaKg: 0, concluido: false }
                  ]
                }
              ]
            },
            diarioHoje: existing ? existing.diarioHoje : []
          };
        });

        currentData.students = formattedStudents;
        this.save(currentData);
        return { success: true, count: formattedStudents.length };
      } else {
        throw new Error(data.message || "Formato de dados inválido.");
      }
    } catch (err) {
      console.error("Erro na sincronização:", err);
      return { success: false, error: err.message };
    }
  }

  resetToDefault() {
    this.save({
      students: INITIAL_STUDENTS,
      exerciseLibrary: EXERCISE_LIBRARY,
      foodDatabase: TACO_FOOD_DATABASE,
      currentUserRole: "professor",
      activeStudentId: "aluno_raian"
    });
  }
}

// Export global instance
window.db = new DatabaseManager();

