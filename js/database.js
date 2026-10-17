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

// 3. BASE DE DADOS DOS ALUNOS (Zerada para cadastros reais via Google Forms)
const INITIAL_STUDENTS = [];

// Gerenciador de Estado no LocalStorage
class DatabaseManager {
  constructor() {
    this.storageKey = "consultoria_fitness_db_v3";
    this.init();
  }

  init() {
    // Remover resíduos de versões de teste com dados fictícios
    localStorage.removeItem("consultoria_fitness_db_v1");
    localStorage.removeItem("consultoria_fitness_db_v2");

    let raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      this.save({
        students: [],
        exerciseLibrary: EXERCISE_LIBRARY,
        foodDatabase: TACO_FOOD_DATABASE,
        currentUserRole: "professor",
        activeStudentId: null
      });
    } else {
      try {
        const data = JSON.parse(raw);
        // Filtrar e expurgar qualquer ID residual fictício de teste
        const testIds = ["aluno_raian", "aluno_maylon", "aluno_carlos", "aluno_matheus", "aluno_raianderson"];
        data.students = (data.students || []).filter(s => !testIds.includes(s.id));
        if (data.students.length === 0) {
          data.activeStudentId = null;
        } else if (!data.students.some(s => s.id === data.activeStudentId)) {
          data.activeStudentId = data.students[0].id;
        }
        this.save(data);
      } catch (e) {
        this.resetToDefault();
      }
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

  async syncWithGoogleSheetsGViz(spreadsheetId = "1MrWTVNZumGQDIq04QSOEMbSqxkc5scWFf4Ik6qRgY-w") {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const text = await res.text();
      const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/s);
      if (!match) throw new Error("Formato de resposta inválido do Google Sheets.");
      const parsed = JSON.parse(match[1]);
      if (!parsed.table || !parsed.table.rows) return { success: false, error: "Sem dados retornados." };

      const cols = parsed.table.cols.map(c => (c.label || '').trim());
      const colIndexPlano = cols.findIndex(l => l.toLowerCase().includes("plano"));
      const rows = parsed.table.rows;
      const currentData = this.get();
      const updatedStudents = [];

      rows.forEach((r, idx) => {
        const cells = r.c ? r.c.map(c => (c && c.v !== undefined && c.v !== null) ? c.v : '') : [];
        if (cells.length < 3) return;

        const nome = String(cells[2] || '').trim();
        if (!nome || nome.toLowerCase() === 'nome completo') return;

        const email = String(cells[1] || '').trim();
        const whatsapp = String(cells[3] || '').replace('.0', '').trim();
        const genero = String(cells[5] || 'Masculino');
        const peso = parseFloat(cells[8]) || 70;
        let altura = parseFloat(cells[9]) || 170;
        if (altura > 0 && altura < 3) altura = Math.round(altura * 100);
        const metaPeso = String(cells[10] || '').replace('.0', '');
        const objetivo = String(cells[13] || 'Emagrecimento / Definição');
        const incomodo = String(cells[14] || '');
        const patologias = String(cells[16] || '');
        const medicamentos = String(cells[17] || '');
        const lesoes = String(cells[18] || '');
        const experiencia = String(cells[21] || 'Iniciante');
        const localTreino = String(cells[24] || 'Academia');
        const sono = String(cells[36] || '6 a 7 horas');

        // Plano Desejado da pergunta
        let planoDesejado = "Plano Mensal - 3 vezes na semana (R$ 200/mês)";
        if (colIndexPlano !== -1 && cells[colIndexPlano]) {
          planoDesejado = String(cells[colIndexPlano]).trim();
        } else if (cells.length > 42 && cells[42]) {
          planoDesejado = String(cells[42]).trim();
        }

        // Dias de treino estritamente determinados pelo plano
        let diasPlano = 3;
        if (planoDesejado.includes("2 vezes") || planoDesejado.includes("2x")) diasPlano = 2;
        else if (planoDesejado.includes("3 vezes") || planoDesejado.includes("3x")) diasPlano = 3;
        else if (planoDesejado.includes("4 vezes") || planoDesejado.includes("4x")) diasPlano = 4;
        else if (planoDesejado.includes("5 vezes") || planoDesejado.includes("5x")) diasPlano = 5;

        // Valor do plano
        let valorPlano = 200.0;
        if (planoDesejado.includes("150")) valorPlano = 150.0;
        else if (planoDesejado.includes("200")) valorPlano = 200.0;
        else if (planoDesejado.includes("250")) valorPlano = 250.0;
        else if (planoDesejado.includes("300")) valorPlano = 300.0;
        else if (planoDesejado.includes("450")) valorPlano = 450.0;

        const alturaM = altura / 100;
        const imc = (peso > 0 && alturaM > 0) ? +(peso / (alturaM * alturaM)).toFixed(2) : 0;
        let classImc = "Peso Normal";
        if (imc >= 40) classImc = "Obesidade Grau 3 (Mórbida)";
        else if (imc >= 35) classImc = "Obesidade Grau 2";
        else if (imc >= 30) classImc = "Obesidade Grau 1";
        else if (imc >= 25) classImc = "Sobrepeso";

        // Cruzamento de IMC e Alertas Clínicos
        const textoGeral = (patologias + " " + medicamentos + " " + incomodo).toLowerCase();
        let alertaFarmacologico = "não";
        let itensP = [];
        if (textoGeral.includes("hipertens")) itensP.push("Hipertensão Arterial diagnosticada");
        if (textoGeral.includes("monster") || textoGeral.includes("energét") || textoGeral.includes("cafeína") || textoGeral.includes("red bull")) itensP.push("Consumo de Estimulantes / Energético");
        if (textoGeral.includes("colesterol") || textoGeral.includes("triglicer")) itensP.push("Colesterol ou Triglicerídeos alterados");
        if (textoGeral.includes("diabetes") || textoGeral.includes("insulina")) itensP.push("Diabetes / Resistência à Insulina");
        if (medicamentos.length > 2 && !medicamentos.toLowerCase().includes("não") && !medicamentos.toLowerCase().includes("nao")) itensP.push(`Medicamentos: ${medicamentos}`);
        if (itensP.length > 0) alertaFarmacologico = itensP.join("; ");

        let alertaArticular = "não";
        let itensA = [];
        if (imc >= 35) {
          itensA.push(`Sobrecarga articular crítica por IMC ${imc} (${classImc}): Suspender corrida e impacto nos joelhos e coluna`);
        } else if (imc >= 30) {
          itensA.push(`Atenção à sobrecarga articular por IMC ${imc} (${classImc}): Priorizar cadeia cinética fechada e esteira plana`);
        }
        if (lesoes.length > 2 && !lesoes.toLowerCase().includes("não") && !lesoes.toLowerCase().includes("nao") && !lesoes.toLowerCase().includes("nenhum")) {
          itensA.push(`Lesão relatada: ${lesoes}`);
        }
        if (itensA.length > 0) alertaArticular = itensA.join("; ");

        // Metas Metabólicas
        const isMasc = genero.toLowerCase().includes('masc');
        const tmb = Math.round((10 * peso) + (6.25 * altura) - (5 * 28) + (isMasc ? 5 : -161));
        const get = Math.round(tmb * 1.35);
        let calorias = get;
        let prot = Math.round(peso * 1.6);
        let fat = Math.round(peso * 0.7);
        if (objetivo.toLowerCase().includes('hipertrofia')) {
          calorias = Math.round(get + 250);
          prot = Math.round(peso * 2.0);
        } else {
          calorias = Math.round(get - 500);
        }
        const carb = Math.max(50, Math.round((calorias - (prot * 4 + fat * 9)) / 4));

        // Prescrição de Treino Estritamente de Acordo com o Plano
        let treinoDiasArray = [];
        if (diasPlano === 2) {
          treinoDiasArray = [
            {
              dia: "Treino A - Superiores Completos & Core",
              exercicios: [
                { id: "supino_reto", series: 4, reps: "10 a 12", cargaKg: 0, concluido: false },
                { id: "puxada_alta", series: 4, reps: "10 a 12", cargaKg: 0, concluido: false },
                { id: "crossover_polia", series: 3, reps: "12 a 15", cargaKg: 0, concluido: false }
              ]
            },
            {
              dia: "Treino B - Inferiores Protegidos & Cardio",
              exercicios: [
                { id: "leg_press_45", series: 4, reps: "12 a 15", cargaKg: 0, concluido: false }
              ]
            }
          ];
        } else if (diasPlano === 4) {
          treinoDiasArray = [
            {
              dia: "Treino A - Superior Força (Empurrar & Puxar)",
              exercicios: [
                { id: "supino_reto", series: 4, reps: "8 a 10", cargaKg: 0, concluido: false },
                { id: "remada_curvada", series: 4, reps: "8 a 10", cargaKg: 0, concluido: false },
                { id: "puxada_alta", series: 3, reps: "10", cargaKg: 0, concluido: false }
              ]
            },
            {
              dia: "Treino B - Inferiores (Foco Quadríceps)",
              exercicios: [
                { id: "leg_press_45", series: 4, reps: "10 a 12", cargaKg: 0, concluido: false }
              ]
            },
            {
              dia: "Treino C - Superior Hipertrofia & Detalhes",
              exercicios: [
                { id: "supino_inclinado_halteres", series: 4, reps: "10 a 12", cargaKg: 0, concluido: false },
                { id: "crossover_polia", series: 3, reps: "12 a 15", cargaKg: 0, concluido: false },
                { id: "puxada_alta", series: 4, reps: "10", cargaKg: 0, concluido: false }
              ]
            },
            {
              dia: "Treino D - Inferiores & Posterior",
              exercicios: [
                { id: "leg_press_45", series: 4, reps: "12 a 15", cargaKg: 0, concluido: false }
              ]
            }
          ];
        } else if (diasPlano === 5) {
          treinoDiasArray = [
            {
              dia: "Treino A - Peitoral & Deltoide",
              exercicios: [
                { id: "supino_reto", series: 4, reps: "10", cargaKg: 0, concluido: false },
                { id: "supino_inclinado_halteres", series: 4, reps: "10", cargaKg: 0, concluido: false },
                { id: "crossover_polia", series: 3, reps: "12", cargaKg: 0, concluido: false }
              ]
            },
            {
              dia: "Treino B - Dorsais & Trapézio",
              exercicios: [
                { id: "puxada_alta", series: 4, reps: "10", cargaKg: 0, concluido: false },
                { id: "remada_curvada", series: 4, reps: "10", cargaKg: 0, concluido: false }
              ]
            },
            {
              dia: "Treino C - Quadríceps & Panturrilha",
              exercicios: [
                { id: "leg_press_45", series: 4, reps: "10 a 12", cargaKg: 0, concluido: false }
              ]
            },
            {
              dia: "Treino D - Ombros & Braços",
              exercicios: [
                { id: "crossover_polia", series: 3, reps: "12", cargaKg: 0, concluido: false }
              ]
            },
            {
              dia: "Treino E - Posterior de Coxa & Glúteos",
              exercicios: [
                { id: "leg_press_45", series: 4, reps: "12", cargaKg: 0, concluido: false }
              ]
            }
          ];
        } else {
          // 3x na semana (Padrão)
          treinoDiasArray = [
            {
              dia: "Treino A - Superiores & Força",
              exercicios: [
                { id: "supino_reto", series: 4, reps: "10 a 12", cargaKg: 0, concluido: false },
                { id: "puxada_alta", series: 4, reps: "10 a 12", cargaKg: 0, concluido: false }
              ]
            },
            {
              dia: "Treino B - Membros Inferiores Protegidos",
              exercicios: [
                { id: "leg_press_45", series: 4, reps: "12 a 15", cargaKg: 0, concluido: false }
              ]
            },
            {
              dia: "Treino C - Full Body & Estabilidade",
              exercicios: [
                { id: "supino_inclinado_halteres", series: 3, reps: "10 a 12", cargaKg: 0, concluido: false },
                { id: "puxada_alta", series: 3, reps: "10 a 12", cargaKg: 0, concluido: false }
              ]
            }
          ];
        }

        const studentId = "aluno_" + nome.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const existing = currentData.students ? currentData.students.find(s => s.id === studentId) : null;

        updatedStudents.push({
          id: studentId,
          nome: nome,
          email: email,
          whatsapp: whatsapp,
          idade: 28,
          genero: genero,
          peso: peso,
          altura: altura,
          imc: imc,
          classificacaoImc: classImc,
          metaPeso: metaPeso ? `Chegar a ${metaPeso} kg` : "Não informada",
          objetivo: objetivo,
          nivelTreino: experiencia,
          profissao: String(cells[6] || 'Não informado'),
          nivelTrabalho: String(cells[7] || 'Moderado'),
          patologias: patologias,
          medicamentos: medicamentos,
          lesoes: lesoes,
          alertaFarmacologico: alertaFarmacologico,
          alertaArticular: alertaArticular,
          tmb: tmb,
          get: get,
          metaCalorias: calorias,
          macros: {
            prot: prot,
            carb: carb,
            fat: fat,
            agua: +(peso * 0.035).toFixed(1)
          },
          financeiro: existing ? existing.financeiro : {
            plano: planoDesejado,
            valor: valorPlano,
            vencimento: "10/" + (new Date().getMonth() + 1).toString().padStart(2, "0") + "/2026",
            status: "em_dia",
            metodo: "Pix",
            historico: []
          },
          treinoAtual: existing ? existing.treinoAtual : {
            nome: `Prescrição Raian Bispo (${diasPlano}x na Semana)`,
            dias: treinoDiasArray
          },
          diarioHoje: existing ? existing.diarioHoje : []
        });
      });

      currentData.students = updatedStudents;
      if (updatedStudents.length === 0) {
        currentData.activeStudentId = null;
      } else if (!currentData.students.some(s => s.id === currentData.activeStudentId)) {
        currentData.activeStudentId = currentData.students[0].id;
      }
      this.save(currentData);
      return { success: true, count: updatedStudents.length };
    } catch (err) {
      console.warn("Falha no sync com GViz:", err);
      return { success: false, error: err.message };
    }
  }

  resetToDefault() {
    this.save({
      students: [],
      exerciseLibrary: EXERCISE_LIBRARY,
      foodDatabase: TACO_FOOD_DATABASE,
      currentUserRole: "professor",
      activeStudentId: null
    });
  }
}

// Export global instance
window.db = new DatabaseManager();

