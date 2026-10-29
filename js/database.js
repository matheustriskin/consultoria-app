/**
 * Base de Dados & Camada de Armazenamento da Consultoria Esportiva
 * Integração local com persistência em LocalStorage e compatibilidade com Google Drive
 */

// 1. BIBLIOTECA DE EXERCÍCIOS COM REPRESENTAÇÃO BIOMECÂNICA VISUAL (SVG DINÂMICO)
const EXERCISE_LIBRARY = [
  {
    "id": "abdominal_bicicleta",
    "nome": "Abdominal Bicicleta",
    "grupo": "Abdômen",
    "sinergistas": "Oblíquos, Reto Abdominal, Flexores de Quadril",
    "equipamento": "Colchonete / Peso Corporal",
    "nivel": "Iniciante a Intermediário",
    "execucao": "Deitado de costas, eleve pernas e tronco. Alterne flexionando um joelho em direção ao peito enquanto gira o tronco levando o cotovelo oposto ao joelho. Mantenha ritmo constante e contração contínua.",
    "svgType": "abs",
    "videoHint": "Foque na rotação torácica controlada, sem puxar a cervical com as mãos."
  },
  {
    "id": "abdominal_canivete",
    "nome": "Abdominal Canivete",
    "grupo": "Abdômen",
    "sinergistas": "Reto Femoral, Iliopsoas, Reto Abdominal Completo",
    "equipamento": "Colchonete",
    "nivel": "Intermediário/Avançado",
    "execucao": "Deitado com braços e pernas estendidos, flexione simultaneamente tronco e pernas até que as mãos toquem os pés no ponto mais alto, formando um 'V'. Retorne controlando a descida.",
    "svgType": "abs",
    "videoHint": "Evite bater a lombar no solo na descida; mantenha o abdômen tensionado."
  },
  {
    "id": "abdominal_crunch",
    "nome": "Abdominal Crunch",
    "grupo": "Abdômen",
    "sinergistas": "Reto Abdominal (ênfase superior)",
    "equipamento": "Colchonete",
    "nivel": "Iniciante",
    "execucao": "Deitado de costas com joelhos dobrados e pés apoiados no chão. Flexione o tronco aproximando as costelas da pelve, mantendo a lombar em contato com o solo e soltando o ar na subida.",
    "svgType": "abs",
    "videoHint": "Não force o pescoço; mantenha um punho de distância entre o queixo e o esterno."
  },
  {
    "id": "abdominal_infra",
    "nome": "Abdominal Infra (Elevação de Pernas no Solo)",
    "grupo": "Abdômen",
    "sinergistas": "Reto Abdominal Inferior, Flexores do Quadril",
    "equipamento": "Colchonete",
    "nivel": "Iniciante a Intermediário",
    "execucao": "Deitado no colchonete com pernas estendidas e mãos sob os glúteos ou ao lado do corpo. Eleve as pernas retas até 90 graus e desça lentamente sem arquear a lombar.",
    "svgType": "abs",
    "videoHint": "Controle a fase excêntrica; não permita que a coluna lombar descole do solo."
  },
  {
    "id": "abdominal_obliquo",
    "nome": "Abdominal Oblíquo",
    "grupo": "Abdômen",
    "sinergistas": "Oblíquo Interno, Oblíquo Externo",
    "equipamento": "Colchonete",
    "nivel": "Iniciante",
    "execucao": "Deitado de lado ou de costas com pernas inclinadas lateralmente. Flexione o tronco lateralmente encurtando a distância entre a crista ilíaca e as costelas inferiores.",
    "svgType": "abs",
    "videoHint": "Concentre a força estritamente nos flancos laterais, sem puxar a cabeça."
  },
  {
    "id": "abdominal_supra_solo",
    "nome": "Abdominal Supra no Solo",
    "grupo": "Abdômen",
    "sinergistas": "Reto Abdominal, Transverso do Abdômen",
    "equipamento": "Colchonete",
    "nivel": "Iniciante",
    "execucao": "Pés no solo, mãos cruzadas sobre o peito ou nas têmporas. Enrole a coluna vértebra por vértebra elevando as escápulas do chão e aperte o abdômen no ápice por 1 segundo.",
    "svgType": "abs",
    "videoHint": "Expulse o ar completamente no pico de contração para ativação máxima."
  },
  {
    "id": "elevacao_pernas_suspenso",
    "nome": "Elevação de Pernas Suspenso",
    "grupo": "Abdômen",
    "sinergistas": "Reto Abdominal, Antebraços (pegada), Flexores de Quadril",
    "equipamento": "Barra Fixa",
    "nivel": "Avançado",
    "execucao": "Pendurado na barra fixa com pegada pronada e corpo estável. Eleve as pernas estendidas ou semiflexionadas enrolando a pelve em direção ao tórax, sem balanço.",
    "svgType": "abs",
    "videoHint": "O segredo biomecânico é retroverter a pelve, não apenas levantar as pernas."
  },
  {
    "id": "prancha_abdominal",
    "nome": "Prancha Abdominal",
    "grupo": "Abdômen",
    "sinergistas": "Transverso do Abdômen, Glúteos, Ombros, Quadríceps",
    "equipamento": "Colchonete",
    "nivel": "Todos",
    "execucao": "Apoie os antebraços e as pontas dos pés no chão. Mantenha o corpo em uma linha reta da cabeça aos calcanhares, glúteos contraídos e umbigo puxado para dentro.",
    "svgType": "plank",
    "videoHint": "Não deixe o quadril despencar nem subir excessivamente; mantenha tensão isométrica contínua."
  },
  {
    "id": "prancha_lateral",
    "nome": "Prancha Lateral",
    "grupo": "Abdômen",
    "sinergistas": "Oblíquos, Quadrado Lombar, Glúteo Médio",
    "equipamento": "Colchonete",
    "nivel": "Intermediário",
    "execucao": "Deitado de lado apoiado sobre um antebraço com cotovelo sob o ombro. Eleve o quadril do solo formando uma linha reta e segure pelo tempo determinado mantendo a respiração contínua.",
    "svgType": "plank",
    "videoHint": "Alinhe cabeça, tronco e pernas no mesmo plano sem rotacionar o quadril."
  },
  {
    "id": "russian_twist",
    "nome": "Russian Twist",
    "grupo": "Abdômen",
    "sinergistas": "Oblíquos, Reto Abdominal, Flexores de Quadril",
    "equipamento": "Colchonete (opcional anilha/halter)",
    "nivel": "Intermediário",
    "execucao": "Sentado no solo com joelhos flexionados e calcanhares ligeiramente fora do chão. Incline o tronco a 45 graus e gire o tronco de um lado para o outro tocando as mãos próximo ao chão.",
    "svgType": "abs",
    "videoHint": "A rotação deve vir da caixa torácica e cintura, não apenas dos braços."
  },
  {
    "id": "flexao_punho_barra",
    "nome": "Flexão de Punho com Barra",
    "grupo": "Antebraços",
    "sinergistas": "Flexores do Punho e Dedos",
    "equipamento": "Barra reta ou W e banco",
    "nivel": "Todos",
    "execucao": "Antebraços apoiados sobre as coxas ou sobre o banco com as palmas voltadas para cima. Deixe a barra descer até a ponta dos dedos e depois flexione o punho no arco completo.",
    "svgType": "forearms",
    "videoHint": "Amplitude completa com movimento estritamente na articulação do punho."
  },
  {
    "id": "flexao_punho_halteres",
    "nome": "Flexão de Punho com Halteres",
    "grupo": "Antebraços",
    "sinergistas": "Flexor Radial e Ulnar do Carpo",
    "equipamento": "Halteres e banco",
    "nivel": "Todos",
    "execucao": "Antebraços repousados sobre banco ou pernas com punhos livres na borda. Flexione os halteres para cima contraindo a face interna do antebraço.",
    "svgType": "forearms",
    "videoHint": "Excelente para corrigir assimetrias de força e volume entre os braços."
  },
  {
    "id": "rolamento_punho",
    "nome": "Rolamento de Punho (Wrist Roller)",
    "grupo": "Antebraços",
    "sinergistas": "Flexores e Extensores do Carpo, Deltoide Anterior (isométrico)",
    "equipamento": "Barra com corda e anilha (Wrist Roller)",
    "nivel": "Intermediário/Avançado",
    "execucao": "Segure o rolo à frente com braços estendidos ou semiflexionados. Gire o cilindro alternando as mãos para enrolar a corda até o topo e desenrole com máximo controle.",
    "svgType": "forearms",
    "videoHint": "Não use impulso; sinta a queimação isométrica e dinâmica nos antebraços."
  },
  {
    "id": "rosca_punho_inversa",
    "nome": "Rosca de Punho Inversa",
    "grupo": "Antebraços",
    "sinergistas": "Extensores do Punho, Braquiorradial",
    "equipamento": "Barra ou halteres",
    "nivel": "Todos",
    "execucao": "Antebraços apoiados no banco com as palmas voltadas para baixo (pegada pronada). Eleve a barra estendendo os punhos para cima e desça de forma lenta.",
    "svgType": "forearms",
    "videoHint": "Essencial para proteger os cotovelos contra epicondilite e equilibrar a articulação."
  },
  {
    "id": "rosca_punho_sentado",
    "nome": "Rosca de Punho Sentado",
    "grupo": "Antebraços",
    "sinergistas": "Flexores profundos e superficiais dos dedos",
    "equipamento": "Halteres ou barra",
    "nivel": "Iniciante a Intermediário",
    "execucao": "Sentado em um banco reto, apoie os antebraços sobre as coxas deixando as mãos ultrapassarem os joelhos. Execute a flexão e extensão controlada do punho.",
    "svgType": "forearms",
    "videoHint": "Mantenha os antebraços firmemente fixados contra as coxas."
  },
  {
    "id": "barra_fixa",
    "nome": "Barra Fixa (Pull-up)",
    "grupo": "Costas",
    "sinergistas": "Latíssimo do Dorso, Bíceps, Braquial, Redondo Maior, Romboides",
    "equipamento": "Barra Fixa",
    "nivel": "Intermediário/Avançado",
    "execucao": "Pegada pronada com largura superior à dos ombros. Deprima as escápulas e puxe o corpo para cima até que o queixo ultrapasse a barra. Desça de forma controlada até quase a extensão total.",
    "svgType": "pullup",
    "videoHint": "Puxe com os cotovelos em direção aos bolsos traseiros, não apenas com os braços."
  },
  {
    "id": "puxada_alta_frente",
    "nome": "Puxada Alta (Pulley Frente)",
    "grupo": "Costas",
    "sinergistas": "Latíssimo do Dorso, Bíceps Braquial, Braquiorradial, Redondo Maior",
    "equipamento": "Polia Alta com Barra Reta",
    "nivel": "Todos",
    "execucao": "Pegada aberta pronada. Inicie o movimento deprimindo as escápulas e puxe a barra na direção da fúrcula esternal sem balançar excessivamente o tronco.",
    "svgType": "lat_pulldown",
    "videoHint": "Puxe com os cotovelos apontando para o chão, focando na expansão dorsal."
  },
  {
    "id": "puxada_baixa_pulley",
    "nome": "Puxada Baixa (Pulley Sentado)",
    "grupo": "Costas",
    "sinergistas": "Romboides, Trapézio Médio/Inferior, Latíssimo, Bíceps",
    "equipamento": "Polia Baixa com Triângulo ou Barra",
    "nivel": "Todos",
    "execucao": "Pés na plataforma com joelhos levemente destravados. Coluna neutra ereta. Puxe o triângulo em direção ao abdômen inferior espremendo as escápulas atrás.",
    "svgType": "bent_row",
    "videoHint": "Mantenha o peito aberto e nunca redondeie a lombar durante o movimento."
  },
  {
    "id": "remada_baixa",
    "nome": "Remada Baixa",
    "grupo": "Costas",
    "sinergistas": "Latíssimo do Dorso, Romboides, Bíceps",
    "equipamento": "Máquina de Remada Baixa / Cabo",
    "nivel": "Todos",
    "execucao": "Sentado com tronco a 90 graus, puxe a pegada em direção à cintura mantendo os cotovelos rentes ao tronco. Retorne controlando o peso sem projetar os ombros à frente.",
    "svgType": "bent_row",
    "videoHint": "Inicie o movimento pelas escápulas antes de flexionar os cotovelos."
  },
  {
    "id": "remada_curvada_barra",
    "nome": "Remada Curvada com Barra",
    "grupo": "Costas",
    "sinergistas": "Trapézio, Romboides, Latíssimo, Deltoide Posterior, Core",
    "equipamento": "Barra Olímpica e anilhas",
    "nivel": "Intermediário/Avançado",
    "execucao": "Tronco inclinado a cerca de 45 graus, coluna absolutamente neutra e joelhos semiflexionados. Puxe a barra em direção ao umbigo aproximando as escápulas.",
    "svgType": "bent_row",
    "videoHint": "Mantenha o abdômen e eretores da espinha 100% ativados para proteger a coluna."
  },
  {
    "id": "remada_unilateral_halter",
    "nome": "Remada Unilateral com Halter (Serrote)",
    "grupo": "Costas",
    "sinergistas": "Latíssimo do Dorso, Redondo Maior, Romboides, Bíceps",
    "equipamento": "Halter e banco reto",
    "nivel": "Todos",
    "execucao": "Apoie joelho e mão de um lado no banco. Com as costas paralelas ao solo, puxe o halter com o braço livre em direção ao quadril, mantendo o cotovelo próximo ao corpo.",
    "svgType": "bent_row",
    "videoHint": "Não rode a coluna na subida; puxe com o dorsal e esmague a escápula no topo."
  },
  {
    "id": "pullover_halter_costas",
    "nome": "Pullover com Halter",
    "grupo": "Costas",
    "sinergistas": "Latíssimo do Dorso, Serrátil Anterior, Tríceps (porção longa)",
    "equipamento": "Halter e banco reto",
    "nivel": "Intermediário",
    "execucao": "Deitado transversalmente ou reto sobre o banco segurando o halter com as duas mãos acima do peito. Abaixe o peso para trás da cabeça em arco até sentir o alongamento do dorsal e retorne.",
    "svgType": "fly",
    "videoHint": "Mantenha os cotovelos com ligeira flexão fixa durante todo o trajeto."
  },
  {
    "id": "pulldown_corda",
    "nome": "Pulldown com Corda",
    "grupo": "Costas",
    "sinergistas": "Latíssimo do Dorso, Redondo Maior, Tríceps (cabeça longa)",
    "equipamento": "Polia Alta com corda",
    "nivel": "Todos",
    "execucao": "De pé com tronco levemente inclinado à frente. Braços quase estendidos segurando as pontas da corda. Puxe para baixo em arco em direção às coxas abrindo a corda no final.",
    "svgType": "lat_pulldown",
    "videoHint": "Foco exclusivo no latíssimo do dorso, sem dobrar excessivamente os cotovelos."
  },
  {
    "id": "levantamento_terra",
    "nome": "Levantamento Terra",
    "grupo": "Costas",
    "sinergistas": "Eretores da Espinha, Glúteos, Isquiotibiais, Trapézio, Quadríceps",
    "equipamento": "Barra Olímpica e anilhas",
    "nivel": "Avançado",
    "execucao": "Pés na largura do quadril, barra colada nas canelas. Segure a barra, trave as escápulas e empurre o chão com os pés estendendo quadril e joelhos juntos até a posição ereta.",
    "svgType": "deadlift",
    "videoHint": "Coluna rígida e neutra em todo o percurso. A barra deve viajar colada ao corpo."
  },
  {
    "id": "hiperextensao_lombar",
    "nome": "Hiperextensão Lombar",
    "grupo": "Costas",
    "sinergistas": "Eretores da Coluna, Glúteo Máximo, Isquiotibiais",
    "equipamento": "Banco Romano 45° ou Colchonete",
    "nivel": "Iniciante a Intermediário",
    "execucao": "Apoie o quadril na almofada. Desça o tronco flexionando o quadril mantendo a coluna alinhada. Suba estendendo a coluna até o alinhamento com as pernas sem hiperextender.",
    "svgType": "deadlift",
    "videoHint": "Evite estender além da linha neutra da coluna para preservar as vértebras lombares."
  },
  {
    "id": "desenvolvimento_arnold",
    "nome": "Desenvolvimento Arnold",
    "grupo": "Ombro",
    "sinergistas": "Deltoide Anterior, Deltoide Lateral, Tríceps Braquial",
    "equipamento": "Halteres e banco com encosto",
    "nivel": "Intermediário/Avançado",
    "execucao": "Inicie com os halteres na altura do queixo e palmas voltadas para você. Ao empurrar para cima, gire os punhos para que as palmas fiquem para frente no topo do movimento.",
    "svgType": "shoulder_press",
    "videoHint": "Faça a transição de rotação fluida durante a elevação vertical."
  },
  {
    "id": "desenvolvimento_barra",
    "nome": "Desenvolvimento com Barra",
    "grupo": "Ombro",
    "sinergistas": "Deltoide Anterior e Lateral, Tríceps, Trapézio Superior",
    "equipamento": "Barra Olímpica e banco ou em pé",
    "nivel": "Intermediário/Avançado",
    "execucao": "Barra apoiada sobre a clavícula superior. Empurre a barra verticalmente até a extensão dos braços enquanto encaixa a cabeça ligeiramente à frente no ponto de bloqueio.",
    "svgType": "shoulder_press",
    "videoHint": "Glúteos e abdômen firmes para evitar arqueamento lombar compensatório."
  },
  {
    "id": "desenvolvimento_halteres",
    "nome": "Desenvolvimento com Halteres",
    "grupo": "Ombro",
    "sinergistas": "Deltoide Anterior, Deltoide Médio, Tríceps",
    "equipamento": "Halteres e banco a 75°-85°",
    "nivel": "Todos",
    "execucao": "Sentado com coluna bem apoiada, empurre os halteres para cima no plano escapular até quase encostar no topo sem travar bruscamente os cotovelos.",
    "svgType": "shoulder_press",
    "videoHint": "Mantenha os cotovelos cerca de 30 graus à frente do plano do corpo."
  },
  {
    "id": "elevacao_frontal",
    "nome": "Elevação Frontal",
    "grupo": "Ombro",
    "sinergistas": "Deltoide Anterior, Peitoral Clavicular",
    "equipamento": "Halteres ou barra",
    "nivel": "Iniciante a Intermediário",
    "execucao": "De pé com halteres repousando sobre as coxas. Eleve os braços à frente até a linha dos olhos com cotovelos quase esticados e desça com controle.",
    "svgType": "shoulder_press",
    "videoHint": "Não balance o quadril; isole completamente a porção frontal do ombro."
  },
  {
    "id": "elevacao_lateral",
    "nome": "Elevação Lateral",
    "grupo": "Ombro",
    "sinergistas": "Deltoide Lateral, Supraespinhal",
    "equipamento": "Halteres",
    "nivel": "Todos",
    "execucao": "Em pé com ligeira inclinação do tronco à frente. Eleve os halteres pelos lados até a linha dos ombros, liderando o movimento com os cotovelos.",
    "svgType": "shoulder_press",
    "videoHint": "Pense em empurrar as paredes com os cotovelos, sem encolher o pescoço."
  },
  {
    "id": "elevacao_lateral_inclinada",
    "nome": "Elevação Lateral Inclinada",
    "grupo": "Ombro",
    "sinergistas": "Deltoide Posterior, Romboides, Trapézio",
    "equipamento": "Halteres e banco inclinado ou curvado",
    "nivel": "Intermediário",
    "execucao": "Deitado de bruços em banco inclinado ou tronco inclinado a 45 graus. Abra os braços para os lados trazendo os cotovelos para trás na linha do ombro.",
    "svgType": "fly",
    "videoHint": "Fundamental para a saúde do manguito rotador e equilíbrio postural dos ombros."
  },
  {
    "id": "face_pull_ombro",
    "nome": "Face Pull",
    "grupo": "Ombro",
    "sinergistas": "Deltoide Posterior, Trapézio Médio/Inferior, Infraspinhal",
    "equipamento": "Polia com corda na altura dos olhos",
    "nivel": "Todos",
    "execucao": "Segure as pontas da corda com pegada neutra. Puxe em direção ao rosto, abrindo as mãos e rodando externamente os ombros até os cotovelos ficarem altos e para trás.",
    "svgType": "lat_pulldown",
    "videoHint": "Foco na rotação externa no final da puxada para fortalecer a postura."
  },
  {
    "id": "remada_alta_ombro",
    "nome": "Remada Alta",
    "grupo": "Ombro",
    "sinergistas": "Deltoide Lateral, Trapézio Superior, Bíceps",
    "equipamento": "Barra ou polia baixa",
    "nivel": "Intermediário",
    "execucao": "Pegada aberta na largura dos ombros. Puxe a barra rente ao corpo elevando os cotovelos até a linha média do peito, sem ultrapassar a linha dos ombros.",
    "svgType": "bent_row",
    "videoHint": "Use pegada moderadamente afastada para não pinçar os tendões do manguito rotador."
  },
  {
    "id": "panturrilha_em_pe_maquina",
    "nome": "Panturrilha em Pé na Máquina",
    "grupo": "Panturrilha",
    "sinergistas": "Gastrocnêmio Medial e Lateral, Sóleo",
    "equipamento": "Máquina de Panturrilha em Pé",
    "nivel": "Todos",
    "execucao": "Apoie os ombros nas almofadas e pontas dos pés na borda da plataforma. Desça os calcanhares para máximo alongamento e suba na ponta dos pés pausando 1 segundo no topo.",
    "svgType": "calf_raise",
    "videoHint": "Joelhos estendidos (sem hiperextender) para recrutamento máximo do gastrocnêmio."
  },
  {
    "id": "panturrilha_sentado",
    "nome": "Panturrilha Sentado",
    "grupo": "Panturrilha",
    "sinergistas": "Sóleo (ativação isolada profunda)",
    "equipamento": "Máquina de Panturrilha Sentado (Gêmeos)",
    "nivel": "Todos",
    "execucao": "Sentado com almofada sobre as coxas perto dos joelhos. Desça os calcanhares sentindo alongar a panturrilha e eleve os calcanhares ao ponto mais alto.",
    "svgType": "calf_raise",
    "videoHint": "Com o joelho a 90°, o gastrocnêmio perde vantagem mecânica e o sóleo trabalha com força total."
  },
  {
    "id": "panturrilha_leg_press",
    "nome": "Panturrilha no Leg Press",
    "grupo": "Panturrilha",
    "sinergistas": "Gastrocnêmio, Sóleo, Tibial Posterior",
    "equipamento": "Leg Press 45° ou Horizontal",
    "nivel": "Intermediário",
    "execucao": "Apoie a metade anterior dos pés na extremidade inferior da plataforma. Empurre a plataforma com as pontas dos pés em flexão plantar completa e retorne com cautela.",
    "svgType": "leg_press",
    "videoHint": "Nunca solte a trava de segurança sem a supervisão e controle total do apoio dos pés."
  },
  {
    "id": "panturrilha_unilateral_halter",
    "nome": "Panturrilha Unilateral com Halter",
    "grupo": "Panturrilha",
    "sinergistas": "Gastrocnêmio, Estabilizadores do Tornozelo",
    "equipamento": "Halter e degrau/step",
    "nivel": "Todos",
    "execucao": "Apoie um pé na borda do step e segure um halter na mão do mesmo lado. Eleve o calcanhar ao limite máximo e desça bem abaixo da linha do step.",
    "svgType": "calf_raise",
    "videoHint": "Excelente para equilibrar assimetrias e hipertrofiar as panturrilhas."
  },
  {
    "id": "panturrilha_smith",
    "nome": "Panturrilha no Smith",
    "grupo": "Panturrilha",
    "sinergistas": "Gastrocnêmio, Sóleo",
    "equipamento": "Máquina Smith e step",
    "nivel": "Intermediário/Avançado",
    "execucao": "Barra do Smith apoiada no trapézio, pontas dos pés sobre o step. Destrave a barra e execute flexões plantares controladas mantendo o core firme.",
    "svgType": "calf_raise",
    "videoHint": "A trajetória guiada do Smith confere estabilidade para cargas maiores com segurança."
  },
  {
    "id": "crucifixo_halteres",
    "nome": "Crucifixo com Halteres",
    "grupo": "Peitoral",
    "sinergistas": "Deltoide Anterior, Bíceps (cabeça curta)",
    "equipamento": "Halteres e banco reto",
    "nivel": "Todos",
    "execucao": "Deitado de costas, halteres acima do peito com palmas voltadas uma para a outra. Abra os braços em arco com cotovelos levemente flexionados até o nível do tronco e volte contraindo o peito.",
    "svgType": "fly",
    "videoHint": "Imagine estar abraçando um barril largo; não transforme o movimento em supino."
  },
  {
    "id": "crucifixo_maquina_voador",
    "nome": "Crucifixo na Máquina (Voador / Peck Deck)",
    "grupo": "Peitoral",
    "sinergistas": "Peitoral Maior (esternal e clavicular), Deltoide Anterior",
    "equipamento": "Máquina Peck Deck / Voador",
    "nivel": "Iniciante a Avançado",
    "execucao": "Ajuste o banco para que as manoplas fiquem na linha do peitoral. Com cotovelos semi-flexionados, feche as hastes à frente espremendo o peitoral no ponto de contração máxima.",
    "svgType": "fly",
    "videoHint": "Mantenha o peito estufado e as escápulas coladas no encosto do aparelho."
  },
  {
    "id": "flexao_braco",
    "nome": "Flexão de Braço",
    "grupo": "Peitoral",
    "sinergistas": "Tríceps Braquial, Deltoide Anterior, Core",
    "equipamento": "Peso Corporal / Colchonete",
    "nivel": "Iniciante a Avançado",
    "execucao": "Mãos no chão ligeiramente mais largas que os ombros, corpo em linha reta dos calcanhares à cabeça. Desça o peito até quase encostar no chão e empurre com explosão.",
    "svgType": "bench_press",
    "videoHint": "Cotovelos a cerca de 45° do tronco (formato de flecha), nunca a 90° em T."
  },
  {
    "id": "pullover_peito",
    "nome": "Pullover",
    "grupo": "Peitoral",
    "sinergistas": "Peitoral Maior (porção esternal), Serrátil Anterior, Tríceps",
    "equipamento": "Halter e banco reto",
    "nivel": "Intermediário",
    "execucao": "Deitado com cabeça próxima à ponta do banco, segure um halter com ambas as mãos sob a anilha superior. Abaixe o halter em arco atrás da cabeça e retorne puxando pelo peitoral.",
    "svgType": "fly",
    "videoHint": "Concentre a força no peitoral mantendo o quadril baixo e estável."
  },
  {
    "id": "supino_declinado",
    "nome": "Supino Declinado",
    "grupo": "Peitoral",
    "sinergistas": "Peitoral Maior (porção inferior/abdominal), Tríceps, Deltoide Anterior",
    "equipamento": "Banco declinado e barra ou halteres",
    "nivel": "Intermediário",
    "execucao": "Fixe as pernas nos apoios do banco declinado. Desça a barra de forma controlada até a base do peitoral inferior e empurre até a extensão quase completa.",
    "svgType": "bench_press",
    "videoHint": "Ótimo para dar linha de corte inferior ao peitoral com menor estresse no ombro."
  },
  {
    "id": "supino_inclinado_barra",
    "nome": "Supino Inclinado com Barra",
    "grupo": "Peitoral",
    "sinergistas": "Porção Clavicular do Peitoral (superior), Deltoide Anterior, Tríceps",
    "equipamento": "Banco inclinado a 30° e barra olímpica",
    "nivel": "Intermediário/Avançado",
    "execucao": "Escápulas aduzidas e travadas no banco. Desça a barra controlada até a parte superior do tórax (logo abaixo da clavícula) e empurre explosivo.",
    "svgType": "incline_press",
    "videoHint": "Não deixe a barra tocar o pescoço; aterrissagem suave no topo do peito."
  },
  {
    "id": "supino_inclinado_halteres",
    "nome": "Supino Inclinado com Halteres",
    "grupo": "Peitoral",
    "sinergistas": "Porção Clavicular do Peitoral, Deltoide Anterior, Tríceps",
    "equipamento": "Banco inclinado a 30°-45° e halteres",
    "nivel": "Todos",
    "execucao": "Abaixe os halteres abrindo o peito até a linha do ombro e suba convergindo suavemente no topo sem bater os pesos.",
    "svgType": "incline_press",
    "videoHint": "Não exceda 45 graus de inclinação para não transferir o esforço excessivamente ao deltoide."
  },
  {
    "id": "supino_reto_barra",
    "nome": "Supino Reto com Barra",
    "grupo": "Peitoral",
    "sinergistas": "Deltoide Anterior, Tríceps Braquial",
    "equipamento": "Banco reto e barra olímpica",
    "nivel": "Intermediário/Avançado",
    "execucao": "Escápulas em adução e depressão. Desça a barra controladamente até a linha dos mamilos e empurre de volta sem projetar os ombros para frente.",
    "svgType": "bench_press",
    "videoHint": "Foco no arco torácico fisiológico e pés cravados com firmeza no chão."
  },
  {
    "id": "supino_reto_halteres",
    "nome": "Supino Reto com Halteres",
    "grupo": "Peitoral",
    "sinergistas": "Deltoide Anterior, Tríceps Braquial",
    "equipamento": "Halteres e banco reto",
    "nivel": "Todos",
    "execucao": "Deitado de costas, empurre os halteres para cima alinhados com o meio do tórax. Desça com controle sentindo o peitoral alongar em sua amplitude máxima segura.",
    "svgType": "bench_press",
    "videoHint": "Maior amplitude de movimento e trabalho estabilizador do que a barra."
  },
  {
    "id": "crossover_cabo",
    "nome": "Crossover no Cabo",
    "grupo": "Peitoral",
    "sinergistas": "Deltoide Anterior, Peitoral Maior",
    "equipamento": "Crossover / Polia Dupla",
    "nivel": "Todos",
    "execucao": "Tronco levemente inclinado à frente com base estável. Cotovelos semiflexionados. Puxe as manoplas cruzando ou aproximando as mãos na frente do tronco.",
    "svgType": "fly",
    "videoHint": "Mantenha o ângulo dos cotovelos congelado durante todo o trajeto do movimento."
  },
  {
    "id": "cadeira_flexora",
    "nome": "Cadeira Flexora (Mesa Flexora)",
    "grupo": "Posterior de Coxa",
    "sinergistas": "Bíceps Femoral, Semitendíneo, Semimembranoso, Gastrocnêmio",
    "equipamento": "Máquina Flexora Sentada ou Deitada",
    "nivel": "Todos",
    "execucao": "Ajuste o rolo de apoio na parte inferior das panturrilhas e o eixo na articulação do joelho. Flexione as pernas puxando o rolo em direção aos glúteos e segure 1s na contração.",
    "svgType": "squat",
    "videoHint": "Não descole a pelve do banco durante o pico de contração."
  },
  {
    "id": "stiff_barra",
    "nome": "Stiff com Barra",
    "grupo": "Posterior de Coxa",
    "sinergistas": "Glúteo Máximo, Isquiotibiais, Eretores da Coluna",
    "equipamento": "Barra e anilhas",
    "nivel": "Intermediário/Avançado",
    "execucao": "De pé com pés na largura do quadril, joelhos destravados com flexão mínima constante. Incline o tronco projetando o quadril para trás enquanto a barra desce rente às pernas.",
    "svgType": "deadlift",
    "videoHint": "O movimento é de flexão de quadril (hinge), jamais curvar a coluna vertebral."
  },
  {
    "id": "stiff_halteres",
    "nome": "Stiff com Halteres",
    "grupo": "Posterior de Coxa",
    "sinergistas": "Isquiotibiais, Glúteos, Core",
    "equipamento": "Halteres",
    "nivel": "Todos",
    "execucao": "Segurando um par de halteres à frente das coxas, empurre o quadril para trás mantendo as escápulas travadas até sentir o estiramento intenso da cadeia posterior.",
    "svgType": "deadlift",
    "videoHint": "Mantenha os halteres colados nas pernas para diminuir o braço de momento sobre a lombar."
  },
  {
    "id": "flexora_em_pe",
    "nome": "Flexora em Pé",
    "grupo": "Posterior de Coxa",
    "sinergistas": "Isquiotibiais, Gastrocnêmio",
    "equipamento": "Máquina Flexora em Pé ou Polia",
    "nivel": "Todos",
    "execucao": "Apoie o tronco e apoie a almofada atrás do tornozelo. Flexione a perna elevando o calcanhar o máximo possível em direção ao glúteo.",
    "svgType": "squat",
    "videoHint": "Excelente isolamento unilateral sem compensação da perna oposta."
  },
  {
    "id": "flexora_unilateral",
    "nome": "Flexora Unilateral",
    "grupo": "Posterior de Coxa",
    "sinergistas": "Bíceps Femoral, Semimembranoso",
    "equipamento": "Mesa Flexora ou Cadeira Flexora",
    "nivel": "Intermediário",
    "execucao": "Realize a flexão de perna com apenas um membro de cada vez, mantendo a pelve estabilizada e controlando a descida excêntrica em 3 segundos.",
    "svgType": "squat",
    "videoHint": "Ideal para corrigir discrepâncias de força e volume entre as pernas."
  },
  {
    "id": "levantamento_terra_romeno",
    "nome": "Levantamento Terra Romeno (RDL)",
    "grupo": "Posterior de Coxa",
    "sinergistas": "Glúteo Máximo, Isquiotibiais, Lombar",
    "equipamento": "Barra Olímpica",
    "nivel": "Intermediário/Avançado",
    "execucao": "Inicie de pé, destrave levemente os joelhos e desça a barra deslizando pelas coxas até abaixo da patela empurrando o bumbum para a parede atrás de você.",
    "svgType": "deadlift",
    "videoHint": "Diferente do terra tradicional, o RDL não toca o chão entre as repetições e foca no estiramento excêntrico."
  },
  {
    "id": "nordic_curl",
    "nome": "Nordic Curl",
    "grupo": "Posterior de Coxa",
    "sinergistas": "Isquiotibiais (força excêntrica pura), Glúteos",
    "equipamento": "Apoio de tornozelo / Colchonete / Parceiro",
    "nivel": "Avançado",
    "execucao": "Ajoelhado com os tornozelos fixados firmemente. Mantenha o corpo reto do joelho aos ombros e desça o corpo lentamente para frente resistindo à gravidade até apoiar as mãos.",
    "svgType": "squat",
    "videoHint": "Exercício ouro para prevenção de lesões de posteriores de coxa e força excêntrica."
  },
  {
    "id": "glute_ham_raise",
    "nome": "Glute Ham Raise",
    "grupo": "Posterior de Coxa",
    "sinergistas": "Isquiotibiais, Glúteos, Eretores Espinhais",
    "equipamento": "Banco GHR (Glute Ham Developer)",
    "nivel": "Avançado",
    "execucao": "Posicionado no aparelho com coxas na almofada curva e pés presos. Desça o tronco estendendo as pernas e puxe o corpo de volta flexionando vigorosamente os joelhos.",
    "svgType": "squat",
    "videoHint": "Ativa simultaneamente as duas funções dos isquiotibiais: extensão do quadril e flexão do joelho."
  },
  {
    "id": "agachamento_bulgaro",
    "nome": "Agachamento Búlgaro",
    "grupo": "Quadríceps",
    "sinergistas": "Glúteo Máximo, Adutores, Isquiotibiais",
    "equipamento": "Banco e Halteres ou Peso Corporal",
    "nivel": "Intermediário/Avançado",
    "execucao": "De costas para um banco, apoie o peito de um pé sobre ele. Agache flexionando a perna da frente até que a coxa fique paralela ao chão e retorne empurrando o calcanhar.",
    "svgType": "squat",
    "videoHint": "Mantenha o joelho da frente alinhado com o 2° dedo do pé; não deixe o joelho colapsar para dentro."
  },
  {
    "id": "agachamento_livre",
    "nome": "Agachamento Livre",
    "grupo": "Quadríceps",
    "sinergistas": "Glúteo Máximo, Isquiotibiais, Eretores da Espinha, Core",
    "equipamento": "Rack de agachamento e barra olímpica",
    "nivel": "Intermediário/Avançado",
    "execucao": "Pés na largura dos ombros, pontas suavemente para fora. Inicie quebrando o quadril e joelhos juntos, descendo até paralelo ou mais com coluna neutra e peito aberto.",
    "svgType": "squat",
    "videoHint": "Inspire e faça a manobra de Valsalva antes de descer para travar o abdômen e proteger a lombar."
  },
  {
    "id": "agachamento_smith",
    "nome": "Agachamento no Smith",
    "grupo": "Quadríceps",
    "sinergistas": "Quadríceps, Glúteos",
    "equipamento": "Máquina Smith",
    "nivel": "Iniciante a Avançado",
    "execucao": "Barra apoiada sobre o trapézio, pés posicionados ligeiramente à frente da linha da barra para melhor ênfase no quadríceps e menor sobrecarga na coluna.",
    "svgType": "squat",
    "videoHint": "Descida controlada em 3 segundos, mantendo calcanhares bem pressionados no chão."
  },
  {
    "id": "agachamento_sumo",
    "nome": "Agachamento Sumô",
    "grupo": "Quadríceps",
    "sinergistas": "Adutores da Coxa, Glúteo Máximo, Quadríceps",
    "equipamento": "Halter ou Barra e anilhas",
    "nivel": "Todos",
    "execucao": "Pés bem afastados (largura superior à dos ombros) com pontas rodadas a 45 graus para fora. Agache mantendo os joelhos apontando na mesma direção dos pés e tronco ereto.",
    "svgType": "squat",
    "videoHint": "Excelente estímulo para a parte interna das coxas (adutores) e glúteos."
  },
  {
    "id": "cadeira_extensora",
    "nome": "Cadeira Extensora",
    "grupo": "Quadríceps",
    "sinergistas": "Reto Femoral, Vasto Lateral, Vasto Medial, Vasto Intermédio",
    "equipamento": "Máquina Extensora de Joelhos",
    "nivel": "Todos",
    "execucao": "Costas bem apoiadas e joelhos alinhados com o eixo giratório da máquina. Estenda as pernas até a contração máxima do quadríceps, pausando 1s no topo e descendo lento.",
    "svgType": "squat",
    "videoHint": "Segure firme nas manoplas laterais para manter o quadril colado no assento."
  },
  {
    "id": "hack_squat",
    "nome": "Hack Squat",
    "grupo": "Quadríceps",
    "sinergistas": "Glúteo Máximo, Adutores",
    "equipamento": "Aparelho Hack Machine",
    "nivel": "Intermediário/Avançado",
    "execucao": "Costas totalmente apoiadas no encosto inclinado e ombros sob as almofadas. Desça flexionando os joelhos profundamente e empurre a plataforma com os calcanhares.",
    "svgType": "squat",
    "videoHint": "Permite isolar o quadríceps com segurança biomecânica extrema para a coluna lombar."
  },
  {
    "id": "leg_press_45",
    "nome": "Leg Press 45°",
    "grupo": "Quadríceps",
    "sinergistas": "Glúteo Máximo, Isquiotibiais, Adutores",
    "equipamento": "Leg Press 45 Graus",
    "nivel": "Todos",
    "execucao": "Pés na largura dos ombros no meio da plataforma. Destrave e flexione os joelhos até 90 graus sem deixar o quadril retroverter ou descolar do banco no ponto mais baixo.",
    "svgType": "leg_press",
    "videoHint": "Não estenda completamente os joelhos no topo (mantenha microflexão para proteger a cartilagem)."
  },
  {
    "id": "passada_afundo_halteres",
    "nome": "Passada (Afundo) com Halteres",
    "grupo": "Quadríceps",
    "sinergistas": "Glúteo Máximo, Isquiotibiais, Panturrilhas",
    "equipamento": "Halteres",
    "nivel": "Todos",
    "execucao": "Dê um passo à frente flexionando ambos os joelhos a 90 graus, até que o joelho de trás quase toque o chão. Retorne ou avance para o próximo passo com estabilidade.",
    "svgType": "squat",
    "videoHint": "Mantenha o tronco ereto e o abdômen acionado para garantir equilíbrio corporal."
  },
  {
    "id": "sissy_squat",
    "nome": "Sissy Squat",
    "grupo": "Quadríceps",
    "sinergistas": "Reto Femoral (isolamento extremo), Core",
    "equipamento": "Banco Sissy Squat ou Peso Corporal",
    "nivel": "Intermediário/Avançado",
    "execucao": "Com os pés fixados no banco ou nas pontas dos pés no solo, incline o tronco para trás enquanto dobra os joelhos para frente, estirando os quadríceps ao limite.",
    "svgType": "squat",
    "videoHint": "Trabalho brutal de isolamento do reto femoral em posição de extensão do quadril."
  },
  {
    "id": "step_up_banco",
    "nome": "Step-up no Banco",
    "grupo": "Quadríceps",
    "sinergistas": "Glúteo Máximo, Panturrilhas, Isquiotibiais",
    "equipamento": "Caixa / Banco e Halteres",
    "nivel": "Todos",
    "execucao": "Coloque um pé sobre o banco firme. Empurre o corpo para cima exclusivamente com a perna de cima sem dar impulso excessivo com o pé do chão e desça devagar.",
    "svgType": "squat",
    "videoHint": "Concentre toda a força no calcanhar da perna que está em cima do banco."
  },
  {
    "id": "encolhimento_barra",
    "nome": "Encolhimento com Barra",
    "grupo": "Trapézio",
    "sinergistas": "Trapézio Superior, Levantador da Escápula",
    "equipamento": "Barra Olímpica e anilhas",
    "nivel": "Todos",
    "execucao": "Segure a barra à frente na largura dos ombros. Eleve as escápulas verticalmente em direção às orelhas, segure 1 segundo no topo e desça controladamente.",
    "svgType": "forearms",
    "videoHint": "Não rode os ombros em círculos; o movimento correto é estritamente de elevação e depressão vertical."
  },
  {
    "id": "encolhimento_halteres",
    "nome": "Encolhimento com Halteres",
    "grupo": "Trapézio",
    "sinergistas": "Trapézio Superior e Médio",
    "equipamento": "Halteres pesados",
    "nivel": "Todos",
    "execucao": "Halteres ao lado do corpo com pegada neutra. Puxe os ombros para cima esmagando o trapézio no pico de contração e desça alongando totalmente.",
    "svgType": "forearms",
    "videoHint": "A pegada neutra ao lado das coxas proporciona uma linha de tração mais anatômica."
  },
  {
    "id": "encolhimento_smith",
    "nome": "Encolhimento no Smith",
    "grupo": "Trapézio",
    "sinergistas": "Trapézio Superior",
    "equipamento": "Máquina Smith",
    "nivel": "Todos",
    "execucao": "Barra do Smith à frente ou atrás dos glúteos. Com pegada pronada, realize a elevação pura dos ombros em trajetória guiada sem balançar o corpo.",
    "svgType": "forearms",
    "videoHint": "Permite sobrecarga progressiva com facilidade para travar a barra a qualquer momento."
  },
  {
    "id": "remada_alta_trapezio",
    "nome": "Remada Alta",
    "grupo": "Trapézio",
    "sinergistas": "Trapézio Superior, Deltoide Lateral",
    "equipamento": "Barra ou Polia Baixa",
    "nivel": "Intermediário",
    "execucao": "Puxe a barra verticalmente até a altura do peito, com cotovelos sempre mais altos que os punhos, sentindo o trapézio e ombros trabalharem em sinergia.",
    "svgType": "bent_row",
    "videoHint": "Puxe até a linha média do peito para preservar as articulações glenoumerais."
  },
  {
    "id": "encolhimento_unilateral",
    "nome": "Encolhimento Unilateral",
    "grupo": "Trapézio",
    "sinergistas": "Trapézio Superior, Levantador da Escápula",
    "equipamento": "Halter ou Cabo",
    "nivel": "Todos",
    "execucao": "Segurando um halter ou cabo de um lado só com a outra mão apoiada para apoio. Encolha o ombro ao ponto mais alto concentrando todo o recrutamento muscular.",
    "svgType": "forearms",
    "videoHint": "Excelente para quem sente assimetria de altura ou contração entre os trapézios."
  },
  {
    "id": "face_pull_trapezio",
    "nome": "Face Pull (Foco Trapézio Superior e Médio)",
    "grupo": "Trapézio",
    "sinergistas": "Trapézio Superior/Médio/Inferior, Deltoide Posterior, Romboides",
    "equipamento": "Polia Alta com Corda",
    "nivel": "Todos",
    "execucao": "Puxe a corda em direção à testa elevando os cotovelos e retraindo com força as escápulas, contraindo todo o miolo e topo das costas.",
    "svgType": "lat_pulldown",
    "videoHint": "Segure 2 segundos apertando o trapézio médio e superior a cada repetição."
  },
  {
    "id": "corrida_rua",
    "nome": "Corrida na Rua",
    "grupo": "Cardio",
    "sinergistas": "Sistema Cardiovascular, Quadríceps, Panturrilhas, Glúteos",
    "equipamento": "Tênis adequado de corrida",
    "nivel": "Todos",
    "execucao": "Corrida ao ar livre em piso plano ou misto. Mantenha cadência confortável (160-180 ppm), postura ereta, aterrissagem com o mediopé e respiração ritmada.",
    "svgType": "cardio",
    "videoHint": "Controle a frequência cardíaca na zona aeróbica alvo estipulada no seu protocolo."
  },
  {
    "id": "esteira",
    "nome": "Esteira",
    "grupo": "Cardio",
    "sinergistas": "Cardiovascular, Membros Inferiores",
    "equipamento": "Esteira Ergométrica",
    "nivel": "Todos",
    "execucao": "Caminhada rápida ou corrida na esteira. Utilize inclinação de 1% a 2% para simular a resistência do ar e diminuir impacto nas canelas.",
    "svgType": "cardio",
    "videoHint": "Não se segure nos apoios laterais durante o treino; mantenha o movimento natural dos braços."
  },
  {
    "id": "eliptico",
    "nome": "Elíptico",
    "grupo": "Cardio",
    "sinergistas": "Cardiovascular, Glúteos, Coxas, Braços",
    "equipamento": "Aparelho Elíptico / Transport",
    "nivel": "Iniciante a Avançado",
    "execucao": "Pise nos pedais e empurre e puxe as hastes sincronizadamente com as pernas em movimento contínuo e fluido de baixo impacto articular.",
    "svgType": "cardio",
    "videoHint": "Ideal para alunos com sobrepeso ou histórico de dores nos joelhos por ausência de impacto."
  },
  {
    "id": "bicicleta",
    "nome": "Bicicleta",
    "grupo": "Cardio",
    "sinergistas": "Quadríceps, Panturrilhas, Glúteos, Cardiovascular",
    "equipamento": "Bicicleta Ergométrica ou Spinning",
    "nivel": "Todos",
    "execucao": "Ajuste a altura do selim para que a perna mantenha leve flexão de joelho no ponto mais baixo do pedal. Mantenha cadência constante de 70 a 90 RPM.",
    "svgType": "cardio",
    "videoHint": "Ajuste o selim na altura do osso ilíaco para evitar tensão na patela."
  },
  {
    "id": "escada",
    "nome": "Escada",
    "grupo": "Cardio",
    "sinergistas": "Glúteos, Quadríceps, Panturrilhas, Core, Cardiovascular",
    "equipamento": "Simulador de Escada (Stepmill) ou Escadaria",
    "nivel": "Intermediário/Avançado",
    "execucao": "Suba os degraus de maneira contínua apoiando a sola inteira do pé em cada degrau, mantendo o tronco ereto sem debruçar sobre o painel.",
    "svgType": "cardio",
    "videoHint": "Potente ativador de glúteos e alto gasto calórico por minuto."
  },
  {
    "id": "polichinelos",
    "nome": "Polichinelos",
    "grupo": "Cardio",
    "sinergistas": "Corpo Inteiro, Sistema Cardiovascular, Panturrilhas",
    "equipamento": "Peso Corporal",
    "nivel": "Todos",
    "execucao": "Em pé com pés juntos e braços ao lado do corpo. Salte abrindo as pernas e elevando os braços até bater as palmas acima da cabeça, retornando ritmado.",
    "svgType": "cardio",
    "videoHint": "Amorteça o impacto com a ponta dos pés e joelhos levemente destravados."
  },
  {
    "id": "trote_corrida",
    "nome": "Trote Corrida",
    "grupo": "Cardio",
    "sinergistas": "Sistema Cardiovascular, Resistência Aeróbica",
    "equipamento": "Colchonete ou Pista / Peso Corporal",
    "nivel": "Iniciante",
    "execucao": "Trote leve e contínuo, podendo ser executado no lugar ou em espaço reduzido, ideal para aquecimento neuromuscular ou aeróbico de baixa intensidade (Z2).",
    "svgType": "cardio",
    "videoHint": "Mantenha a respiração nasal quando possível e ritmo sustentável por longos períodos."
  },
  {
    "id": "rosca_direta",
    "nome": "Rosca Direta com Barra",
    "grupo": "Braços",
    "sinergistas": "Bíceps Braquial, Braquial, Braquiorradial",
    "equipamento": "Barra W ou reta e anilhas",
    "nivel": "Todos",
    "execucao": "Cotovelos colados ao lado das costelas. Flexione os antebraços erguendo a barra sem balançar o tronco ou projetar os cotovelos para frente.",
    "svgType": "bicep_curl",
    "videoHint": "Mantenha o punho reto para proteger as articulações e concentrar no bíceps."
  },
  {
    "id": "triceps_corda",
    "nome": "Tríceps Corda na Polia",
    "grupo": "Braços",
    "sinergistas": "Tríceps (cabeça lateral e medial)",
    "equipamento": "Polia Alta com Corda",
    "nivel": "Todos",
    "execucao": "Cotovelos fixos ao lado do corpo. Estenda os braços para baixo abrindo as pontas da corda na parte final do movimento para contração máxima.",
    "svgType": "triceps_press",
    "videoHint": "Não mexa os cotovelos; o movimento deve ocorrer estritamente no antebraço."
  },
  {
    "id": "triceps_testa",
    "nome": "Tríceps Testa com Halteres / Barra W",
    "grupo": "Braços",
    "sinergistas": "Tríceps Braquial (porção longa e medial)",
    "equipamento": "Banco reto e barra W ou halteres",
    "nivel": "Intermediário",
    "execucao": "Deitado de costas, braços verticais. Dobre apenas os cotovelos descendo a barra em direção à testa/topo da cabeça e estenda de volta.",
    "svgType": "triceps_press",
    "videoHint": "Mantenha os cotovelos apontados para o teto e fechados sem abrir para os lados."
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

  getExerciseLibrary() {
    return EXERCISE_LIBRARY;
  }

  getExerciseById(id) {
    if (!id) return null;
    const direct = EXERCISE_LIBRARY.find(e => e.id === id);
    if (direct) return direct;
    const aliases = {
      supino_reto: "supino_reto_barra",
      puxada_alta: "puxada_alta_frente",
      remada_curvada: "remada_curvada_barra",
      crossover_polia: "crossover_cabo",
      prancha: "prancha_abdominal",
      mesa_flexora: "cadeira_flexora",
      panturrilha: "panturrilha_em_pe_maquina",
      box_squat_cadeira: "agachamento_livre"
    };
    const targetId = aliases[id];
    return targetId ? EXERCISE_LIBRARY.find(e => e.id === targetId) : null;
  }

  getFoodDatabase() {
    return TACO_FOOD_DATABASE;
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

