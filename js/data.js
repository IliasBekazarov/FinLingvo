// FinLingvo — Финансылык сабаттуулук платформасы
// js/data.js — Бардык сабак маалыматтары

const MODULES = [
  {
    id: 1,
    title: "Акча деген эмне?",
    subtitle: "Акчанын негиздерин үйрөн",
    emoji: "💰",
    color: "#58CC02",
    colorDark: "#4a9e02",
    bgGradient: "linear-gradient(135deg, #1a3a0a, #0f2200)",
    lessons: [
      {
        id: "1-1", title: "Акчанын маңызы", icon: "💵",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Акча деген эмне?",
            options: [
              { text: "Товар жана кызматтар үчүн алмаштыруу каражаты", correct: true },
              { text: "Мамлекеттин гана мүлкү", correct: false },
              { text: "Алтын жана күмүш гана", correct: false },
              { text: "Банктын облигациясы", correct: false }
            ],
            explanation: "Акча — бул товарларды жана кызматтарды алуу үчүн колдонулган универсалдуу алмаштыруу каражаты." },
          { type: "true_false", question: "Акча ар дайым физикалык (кагаз же монета) түрүндө гана болот.",
            correct: false,
            explanation: "Жок! Азыркы заманда акча электрондук жана цифралык түрдө да болот." },
          { type: "multiple_choice", question: "Акчанын негизги функциясы кайсы?",
            options: [
              { text: "Алмаштыруу каражаты катары кызмат кылуу", correct: true },
              { text: "Байлык жыйноо гана", correct: false },
              { text: "Банкта сактоо гана", correct: false },
              { text: "Мамлекетти башкаруу", correct: false }
            ],
            explanation: "Акчанын негизги функциясы — алмаштыруу каражаты, баа өлчөгүч жана баалуулуктарды сактоо." },
          { type: "multiple_choice", question: "Кыргызстандын улуттук валютасы кайсы?",
            options: [
              { text: "Сом", correct: true },
              { text: "Рубль", correct: false },
              { text: "Доллар", correct: false },
              { text: "Тенге", correct: false }
            ],
            explanation: "Кыргызстандын улуттук валютасы — КЫР СОМ (KGS)." },
          { type: "fill_blank", question: "Акча — бул товар жана кызматтарды сатып алуу үчүн ___ каражаты.",
            answer: "алмаштыруу",
            options: ["алмаштыруу", "берүү", "сактоо", "жок кылуу"],
            explanation: "Акча — алмаштыруу каражаты болуп саналат." }
        ]
      },
      {
        id: "1-2", title: "Акчанын түрлөрү", icon: "🏦",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Нак акча деген эмне?",
            options: [
              { text: "Колдо кармай турган кагаз жана монеталар", correct: true },
              { text: "Банктагы сактык", correct: false },
              { text: "Электрондук которуу", correct: false },
              { text: "Кредиттик карта", correct: false }
            ],
            explanation: "Нак акча — физикалык түрдөгү банкноттар жана монеталар." },
          { type: "true_false", question: "Криптовалюта — бул мамлекет тарабынан чыгарылган акча.",
            correct: false,
            explanation: "Жок! Криптовалюта децентрализованный цифралык валюта." },
          { type: "multiple_choice", question: "Дебеттик карта деген эмне?",
            options: [
              { text: "Сенин өз акчаңа жетүү куралы", correct: true },
              { text: "Банктан кредит алуу куралы", correct: false },
              { text: "Акча жыйноо куралы", correct: false },
              { text: "Инвестиция куралы", correct: false }
            ],
            explanation: "Дебеттик картада сенин өз акчаң болот, кредит эмес." },
          { type: "true_false", question: "Электрондук акча нак акчага барабар кызмат аткарат.",
            correct: true,
            explanation: "Туура! Электрондук акча нак акча сыяктуу эле товар жана кызматтарды алуу үчүн колдонулат." },
          { type: "multiple_choice", question: "Кайсы валюта дүйнөлүк резерв валютасы болуп саналат?",
            options: [
              { text: "АКШ доллары (USD)", correct: true },
              { text: "Евро (EUR)", correct: false },
              { text: "Кытай юани (CNY)", correct: false },
              { text: "Британ фунту (GBP)", correct: false }
            ],
            explanation: "АКШ доллары дүйнөнүн негизги резерв валютасы болуп саналат." }
        ]
      },
      {
        id: "1-3", title: "Акчанын баасы", icon: "📊",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Инфляция деген эмне?",
            options: [
              { text: "Баалардын жалпы деңгээлинин өсүшү", correct: true },
              { text: "Акчанын саны көбөйүшү", correct: false },
              { text: "Экономиканын өсүшү", correct: false },
              { text: "Товарлардын сапатынын жогорулашы", correct: false }
            ],
            explanation: "Инфляция — бул убакыттын өтүшү менен товарлар жана кызматтардын баасынын жалпы деңгээлинин өсүшү." },
          { type: "true_false", question: "Инфляция болгондо акчанын сатып алуу күчү азаят.",
            correct: true,
            explanation: "Туура! Инфляция учурунда баалар өсөт, демек бир эле акчага азыраак нерсе сатып алса болот." },
          { type: "fill_blank", question: "Баалар жалпы өскөндө муну ___ деп атайбыз.",
            answer: "инфляция",
            options: ["инфляция", "дефляция", "стагнация", "рецессия"],
            explanation: "Баалардын жалпы өсүшү — инфляция деп аталат." },
          { type: "multiple_choice", question: "Акча курсу деген эмне?",
            options: [
              { text: "Бир валютаны башка валютага алмаштыруу баасы", correct: true },
              { text: "Банктын пайыздык чени", correct: false },
              { text: "Мамлекеттин бюджети", correct: false },
              { text: "Акча жыйноонун эрежеси", correct: false }
            ],
            explanation: "Акча курсу — бир өлкөнүн акчасын башка өлкөнүн акчасына алмаштыруу баасы." },
          { type: "true_false", question: "Дефляция — баалардын төмөндөшү.",
            correct: true,
            explanation: "Туура! Дефляция инфляциянын тескериси — баалардын жалпы деңгээлинин төмөндөшү." }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Киреше жана чыгаша",
    subtitle: "Акча агымын башкар",
    emoji: "💸",
    color: "#1CB0F6",
    colorDark: "#0e8bc4",
    bgGradient: "linear-gradient(135deg, #0a1f3a, #051525)",
    lessons: [
      {
        id: "2-1", title: "Киреше деген эмне?", icon: "💰",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Киреше деген эмне?",
            options: [
              { text: "Иш же бизнестен алынган акча", correct: true },
              { text: "Банктан алынган кредит", correct: false },
              { text: "Жарандын чыгашасы", correct: false },
              { text: "Мамлекеттин салыгы", correct: false }
            ],
            explanation: "Киреше — бул эмгек, бизнес, инвестиция же башка булактардан алынган акча." },
          { type: "true_false", question: "Пассивдүү киреше иш кылбай эле алынат.",
            correct: true,
            explanation: "Туура! Пассивдүү киреше — аренда, дивиденд, депозит сыяктуу иш кылбай эле келген акча." },
          { type: "multiple_choice", question: "Жалак (зарплата) кайсы киреше түрүнө кирет?",
            options: [
              { text: "Активдүү киреше", correct: true },
              { text: "Пассивдүү киреше", correct: false },
              { text: "Инвестициялык киреше", correct: false },
              { text: "Бизнес киреше", correct: false }
            ],
            explanation: "Зарплата — активдүү киреше, анткени аны алуу үчүн эмгек жумшоо керек." },
          { type: "fill_blank", question: "Акча иштебей эле кирсе, муну ___ киреше деп атайбыз.",
            answer: "пассивдүү",
            options: ["пассивдүү", "активдүү", "инвестициялык", "бизнес"],
            explanation: "Пассивдүү киреше — акчаңдын же мүлкүңдүн сен үчүн иштеши." },
          { type: "true_false", question: "Бизнестен алынган пайда — бул да киреше.",
            correct: true,
            explanation: "Туура! Бизнес кирешеси — ишкердиктен алынган пайда да кирешенин бир түрү." }
        ]
      },
      {
        id: "2-2", title: "Чыгаша деген эмне?", icon: "🛍️",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Чыгаша деген эмне?",
            options: [
              { text: "Жашоо үчүн жумшалган акча", correct: true },
              { text: "Банкка коюлган акча", correct: false },
              { text: "Алынган кредит", correct: false },
              { text: "Мамлекетке берилген сыйлык", correct: false }
            ],
            explanation: "Чыгаша — жашоо процессинде товар жана кызматтарга жумшалган акча." },
          { type: "multiple_choice", question: "Кайсы чыгаша зарыл (негизги)?",
            options: [
              { text: "Тамак-аш жана коммуналдык кызматтар", correct: true },
              { text: "Кино жана ойын-зоок", correct: false },
              { text: "Кымбат сыйлыктар", correct: false },
              { text: "Брендик кийим", correct: false }
            ],
            explanation: "Зарыл чыгашалар — тамак, үй, транспорт сыяктуу жашоо үчүн керек нерселер." },
          { type: "true_false", question: "Чыгашаны контролдоо финансылык ден соолуктун белгиси.",
            correct: true,
            explanation: "Туура! Чыгашаны башкара билген адам финансылык тытыктуулукка жетет." },
          { type: "fill_blank", question: "Кино, саякат, ойын-зоок — бул ___ чыгашалар.",
            answer: "зарыл эмес",
            options: ["зарыл эмес", "негизги", "зарыл", "милдеттүү"],
            explanation: "Кино, саякат — кааласаң бол, кааласаң болбой турган чыгашалар." },
          { type: "multiple_choice", question: "Чыгашаны азайтуунун эң жакшы жолу кайсы?",
            options: [
              { text: "Чыгашаларды жазып, талдоо", correct: true },
              { text: "Эч нерсе сатып албоо", correct: false },
              { text: "Кредит алуу", correct: false },
              { text: "Акчаны жашыруу", correct: false }
            ],
            explanation: "Чыгашаларды жазуу жана талдоо — ашыкча чыгашаны аныктоого жардам берет." }
        ]
      },
      {
        id: "2-3", title: "Баланс: Киреше vs Чыгаша", icon: "⚖️",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Киреше чыгашадан көп болгондо эмне болот?",
            options: [
              { text: "Акча калат, үнөмдөө мүмкүнчүлүгү чыгат", correct: true },
              { text: "Карыз болосун", correct: false },
              { text: "Банкрот болосун", correct: false },
              { text: "Эч нерсе болбойт", correct: false }
            ],
            explanation: "Киреше > Чыгаша = Профицит. Бул үнөмдөөгө жана инвестицияга мүмкүнчүлүк берет." },
          { type: "true_false", question: "Чыгаша киреше менен барабар болсо, бул идеалдуу абал.",
            correct: false,
            explanation: "Жок! Идеалдуу абал — кирешенин бир бөлүгүн сактоо жана инвестиция кылуу." },
          { type: "multiple_choice", question: "50/30/20 эреже деген эмне?",
            options: [
              { text: "50% — зарыл, 30% — каалоо, 20% — үнөмдөө", correct: true },
              { text: "50% — үнөмдөө, 30% — зарыл, 20% — каалоо", correct: false },
              { text: "50% — инвестиция, 30% — чыгаша, 20% — кредит", correct: false },
              { text: "50% — салык, 30% — үй, 20% — тамак", correct: false }
            ],
            explanation: "50/30/20 — кирешени бөлүштүрүүнүн популярдуу эрежеси." },
          { type: "true_false", question: "Акча дефициті — чыгаша кирешеден ашкан абал.",
            correct: true,
            explanation: "Туура! Дефицит — чыгаша кирешеден ашканда, бул карызга алып келет." },
          { type: "fill_blank", question: "Кирешеден чыгашаны чегергенде калган акча — бул ___.",
            answer: "профицит",
            options: ["профицит", "дефицит", "бюджет", "карыз"],
            explanation: "Киреше - Чыгаша = Профицит (оң болсо) же Дефицит (терс болсо)." }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Үнөмдөө",
    subtitle: "Акчаңды акылдуу сакта",
    emoji: "🐷",
    color: "#FF9600",
    colorDark: "#cc7a00",
    bgGradient: "linear-gradient(135deg, #2a1a00, #1a1000)",
    lessons: [
      {
        id: "3-1", title: "Эмне үчүн үнөмдөө керек?", icon: "🎯",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Үнөмдөө эмне үчүн маанилүү?",
            options: [
              { text: "Келечектеги максаттарга жетүү жана кырдаалга даяр болуу", correct: true },
              { text: "Банкты байытуу", correct: false },
              { text: "Мамлекетке жардам берүү", correct: false },
              { text: "Акчаны жашыруу", correct: false }
            ],
            explanation: "Үнөмдөө — ийгиликтүү келечектин негизи." },
          { type: "true_false", question: "Акчанын 10% дайыма үнөмдөө жакшы адат.",
            correct: true,
            explanation: "Туура! 'Өзүңө биринчи төлө' принциби — кирешенин кеминде 10% үнөмдөө." },
          { type: "multiple_choice", question: "Өзгөчө жагдайлар фонду канча ай чыгашасына барабар болушу керек?",
            options: [
              { text: "3-6 ай", correct: true },
              { text: "1 ай", correct: false },
              { text: "1 жыл", correct: false },
              { text: "10 жыл", correct: false }
            ],
            explanation: "Финансылык коопсуздук үчүн 3-6 айлык чыгашага барабар резерв фонду сунушталат." },
          { type: "fill_blank", question: "'Өзүңө биринчи төлө' дегени — биринчи ___ жабасың.",
            answer: "үнөмдөөңдү",
            options: ["үнөмдөөңдү", "карызды", "чыгашаны", "салыкты"],
            explanation: "Кирешени алгач — үнөмдөөгө, андан кийин чыгашаларга бөлүштүр." },
          { type: "true_false", question: "Депозит — акча үнөмдөөнүн бир жолу.",
            correct: true,
            explanation: "Туура! Банктагы депозит — акчаңды үнөмдөп, пайыз табуунун жолу." }
        ]
      },
      {
        id: "3-2", title: "Үнөмдөө ыкмалары", icon: "🔧",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Кайпакты кармоо ыкмасы (envelope method) деген эмне?",
            options: [
              { text: "Акчаны категорияларга бөлүп, конверттерге салуу", correct: true },
              { text: "Акчаны почта аркылуу жөнөтүү", correct: false },
              { text: "Банкка акча коюу", correct: false },
              { text: "Карта менен гана жумшоо", correct: false }
            ],
            explanation: "Конверт ыкмасы — бюджеттик категорияларга акча бөлүштүрүп башкаруу." },
          { type: "true_false", question: "Автоматтык үнөмдөө — эң жакшы үнөмдөө ыкмаларынын бири.",
            correct: true,
            explanation: "Туура! Автоматтык которуу — акчаны өзүнөн-өзү сактагычка которот." },
          { type: "multiple_choice", question: "30 күндүк эреже деген эмне?",
            options: [
              { text: "Чоң сатып алуу алдында 30 күн ойлонуу", correct: true },
              { text: "Айына 30 жолу сатып алуу", correct: false },
              { text: "30 күнгө бюджет түзүү", correct: false },
              { text: "Акчаны 30 күнгө банкка коюу", correct: false }
            ],
            explanation: "30 күндүк эреже — импульстик сатып алуудан сактайт." },
          { type: "fill_blank", question: "Ашыкча нерсе сатып алуу — ___ сатып алуу деп аталат.",
            answer: "импульстик",
            options: ["импульстик", "акылдуу", "зарыл", "пайдалуу"],
            explanation: "Импульстик сатып алуу — ойланбай, эмоция менен сатып алуу." },
          { type: "multiple_choice", question: "Кайсы ыкма акча үнөмдөөгө эң жакшы жардам берет?",
            options: [
              { text: "Бюджет түзүп, аны аткаруу", correct: true },
              { text: "Жумушту таштоо", correct: false },
              { text: "Баарын кредитке алуу", correct: false },
              { text: "Акчаны жашыруу", correct: false }
            ],
            explanation: "Бюджет — акча жаратуунун эң күчтүү куралы." }
        ]
      },
      {
        id: "3-3", title: "Мотивация менен максаттар", icon: "🏆",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "SMART максаттары кайсы?",
            options: [
              { text: "Конкреттүү, Өлчөгүч, Жетишимдүү, Реалдуу, Мөөнөттүү", correct: true },
              { text: "Чоң, Акылдуу, Ылдам, Туура, Мезгилдүү", correct: false },
              { text: "Жөнөкөй, Маанилүү, Активдүү, Реалдуу, Тест", correct: false },
              { text: "Стратегиялуу, Мааниле, Ар тараптуу, Реалдуу, Убакытка байлануу", correct: false }
            ],
            explanation: "SMART максаттары — финансылык максаттарды так аныктоого жардам берет." },
          { type: "true_false", question: "Визуализация (максатты элестетүү) максатка жетишүүгө жардам берет.",
            correct: true,
            explanation: "Туура! Максатты визуалдаштыруу мотивацияны жогорулатат." },
          { type: "multiple_choice", question: "Кыска мөөнөттүү финансылык максат деген эмне?",
            options: [
              { text: "1 жылдан кыска мөөнөттө жетиле турган максат", correct: true },
              { text: "10 жылдан ашык максат", correct: false },
              { text: "Ашыкча кымбат нерсе алуу", correct: false },
              { text: "Карызды кечиктирүү", correct: false }
            ],
            explanation: "Кыска мөөнөттүү максат — 1 жылга чейинки жетише турган максат." },
          { type: "fill_blank", question: "Акча жыйноодо 'сыйлык берүү' принциби ___ жогорулатат.",
            answer: "мотивацияны",
            options: ["мотивацияны", "кредитти", "чыгашаны", "карызды"],
            explanation: "Ар бир максатка жеткенде өзүңдү сыйлоо — мотивацияны сактайт." },
          { type: "true_false", question: "Достор менен акча максаттарын бөлүшүү жардам берет.",
            correct: true,
            explanation: "Туура! Максатты башкаларга айтуу — аны аткаруу ыктымалдуулугун жогорулатат." }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Бюджет",
    subtitle: "Акчаңды планда",
    emoji: "📒",
    color: "#9B59B6",
    colorDark: "#7d3f99",
    bgGradient: "linear-gradient(135deg, #1a0a2a, #100620)",
    lessons: [
      {
        id: "4-1", title: "Бюджет деген эмне?", icon: "📋",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Бюджет деген эмне?",
            options: [
              { text: "Киреше менен чыгашанын планы", correct: true },
              { text: "Банктагы акча суммасы", correct: false },
              { text: "Мамлекеттик каражат", correct: false },
              { text: "Кредит лимити", correct: false }
            ],
            explanation: "Бюджет — кирешени жана чыгашаны алдын ала пландоо документи." },
          { type: "true_false", question: "Бюджет түзүү убакыт талап кылат жана татаал процесс.",
            correct: false,
            explanation: "Жок! Жөнөкөй бюджет 15-30 мүнөттө түзүлөт жана чоң пайда берет." },
          { type: "multiple_choice", question: "Нөлдүк бюджет деген эмне?",
            options: [
              { text: "Ар бир сомду максатка ыйгаруу", correct: true },
              { text: "Эч нерсе жумшабоо", correct: false },
              { text: "Акчасыз жашоо", correct: false },
              { text: "Карызга алуу", correct: false }
            ],
            explanation: "Нөлдүк бюджет — Киреше - Чыгаша = 0, ар бир сом өз ордунда." },
          { type: "fill_blank", question: "Бюджет — ___ жана чыгашанын планы.",
            answer: "кирешенин",
            options: ["кирешенин", "карыздын", "инвестициянын", "банктын"],
            explanation: "Бюджет — киреше менен чыгашаны алдын ала пландоо." },
          { type: "true_false", question: "Бюджет — финансылык максаттарга жетүүнүн куралы.",
            correct: true,
            explanation: "Туура! Бюджет аркылуу акчаны туура жумшоо жана максаттарга жетүү мүмкүн." }
        ]
      },
      {
        id: "4-2", title: "Бюджет түзүү", icon: "✏️",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Бюджет түзүүнүн биринчи кадамы кайсы?",
            options: [
              { text: "Кирешени аныктоо", correct: true },
              { text: "Чыгашаны кыскартуу", correct: false },
              { text: "Карыз алуу", correct: false },
              { text: "Банк аккаунт ачуу", correct: false }
            ],
            explanation: "Биринчи кезекте жалпы кирешеңди аныктоо керек." },
          { type: "multiple_choice", question: "Чыгашаларды кандай категорияларга бөлсө болот?",
            options: [
              { text: "Зарыл жана зарыл эмес чыгашалар", correct: true },
              { text: "Ак жана кара чыгашалар", correct: false },
              { text: "Чоң жана кичине чыгашалар", correct: false },
              { text: "Жакшы жана жаман чыгашалар", correct: false }
            ],
            explanation: "Чыгашаларды зарыл (негизги) жана зарыл эмес (каалоо) деп бөлүүгө болот." },
          { type: "true_false", question: "Бюджетти ай сайын жаңыртуу керек.",
            correct: true,
            explanation: "Туура! Ай сайын бюджетти карап чыгуу — ийгиликтин ачкычы." },
          { type: "fill_blank", question: "50/30/20 эреже: 50% — зарыл, 30% — каалоо, 20% — ___.",
            answer: "үнөмдөө",
            options: ["үнөмдөө", "чыгаша", "кредит", "инвестиция"],
            explanation: "20% — үнөмдөө жана карыздарды төлөш үчүн." },
          { type: "multiple_choice", question: "Бюджет аткарылбаса эмне кылуу керек?",
            options: [
              { text: "Себебин талдап, бюджетти ыңгайлаштыруу", correct: true },
              { text: "Бюджетти таштоо", correct: false },
              { text: "Карыз алуу", correct: false },
              { text: "Кирешени жашыруу", correct: false }
            ],
            explanation: "Бюджет — катуу эреже эмес, жашоого ылайыкталуучу план." }
        ]
      },
      {
        id: "4-3", title: "Бюджет колдонуу", icon: "📱",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Каттоо ыкмасы (tracking) деген эмне?",
            options: [
              { text: "Бардык чыгашаларды жазуу жана байкоо", correct: true },
              { text: "Акчаны санап отуруу", correct: false },
              { text: "Рецептти жазуу", correct: false },
              { text: "Банкка барып отуруу", correct: false }
            ],
            explanation: "Чыгашаларды каттоо — кайда акча кетип жатканын билүүгө жардам берет." },
          { type: "true_false", question: "Акча каттоо колдонмолору бюджет башкарууга жардам берет.",
            correct: true,
            explanation: "Туура! Мобилдик колдонмолор чыгашаларды автоматтык каттайт." },
          { type: "multiple_choice", question: "Жылдык бюджет планы кандай пайда берет?",
            options: [
              { text: "Жыл бою чоң чыгашаларды алдын ала пландоо", correct: true },
              { text: "Акчаны эки эсе кылуу", correct: false },
              { text: "Салыктан бошоо", correct: false },
              { text: "Банкта кредит алуу", correct: false }
            ],
            explanation: "Жылдык план — белек алуу, саякат, ремонт сыяктуу ири чыгашаларга даяр болуу." },
          { type: "fill_blank", question: "Бюджет — акчаны ___ иштетүүгө жардам берет.",
            answer: "акылдуу",
            options: ["акылдуу", "тез", "мыкты", "эркин"],
            explanation: "Бюджет аркылуу акчаңды акылдуу пайдалануу мүмкүн болот." },
          { type: "true_false", question: "Бюджет — бай адамдар үчүн гана эмес, баары үчүн.",
            correct: true,
            explanation: "Туура! Бюджет каалаган киреше деңгээлиндеги адам үчүн пайдалуу." }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Актив жана пассив",
    subtitle: "Байлыктын сырын бил",
    emoji: "🏠",
    color: "#FF4B4B",
    colorDark: "#cc2222",
    bgGradient: "linear-gradient(135deg, #2a0a0a, #1a0505)",
    lessons: [
      {
        id: "5-1", title: "Актив деген эмне?", icon: "💎",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Актив деген эмне?",
            options: [
              { text: "Сага акча алып келген нерсе", correct: true },
              { text: "Акчаңды алып кеткен нерсе", correct: false },
              { text: "Банктагы кредит", correct: false },
              { text: "Үй жабдуулары", correct: false }
            ],
            explanation: "Актив — сага пассивдүү киреше же баалуулук алып келген нерсе." },
          { type: "true_false", question: "Ижарага берилген үй — бул актив.",
            correct: true,
            explanation: "Туура! Ижарага берилген үй ай сайын киреше алып келет — демек актив." },
          { type: "multiple_choice", question: "Кайсы нерсе акча алып келет?",
            options: [
              { text: "Дивиденд берүүчү акциялар", correct: true },
              { text: "Телефон", correct: false },
              { text: "Кийим", correct: false },
              { text: "Тамак-аш", correct: false }
            ],
            explanation: "Акциялар дивиденд (пайда) алып келсе — актив болот." },
          { type: "fill_blank", question: "Ижарага берилген мүлк — ___ катары саналат.",
            answer: "актив",
            options: ["актив", "пассив", "чыгаша", "карыз"],
            explanation: "Киреше алып келген мүлк — актив." },
          { type: "true_false", question: "Бизнес — бул актив боло алат.",
            correct: true,
            explanation: "Туура! Пайда алып келген бизнес — актив." }
        ]
      },
      {
        id: "5-2", title: "Пассив деген эмне?", icon: "💳",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Пассив деген эмне?",
            options: [
              { text: "Акчаңды алып кеткен нерсе", correct: true },
              { text: "Акча алып келген нерсе", correct: false },
              { text: "Банктагы депозит", correct: false },
              { text: "Бизнес кирешеси", correct: false }
            ],
            explanation: "Пассив — сенден акча чыгарган нерсе: карыз, кредит, ашыкча чыгаша." },
          { type: "true_false", question: "Кредит — пассивтин мисалы.",
            correct: true,
            explanation: "Туура! Кредит ай сайын пайыз талап кылат — акчаңды алып кетет." },
          { type: "multiple_choice", question: "Роберт Кийосаки боюнча сенин үйүң эмне?",
            options: [
              { text: "Пассив (ижарага бербесең)", correct: true },
              { text: "Актив дайыма", correct: false },
              { text: "Инвестиция", correct: false },
              { text: "Бизнес", correct: false }
            ],
            explanation: "'Бай ата, жарды ата' китебинде: өзүң жашаган үй — пассив, анткени акча алып кирбейт." },
          { type: "fill_blank", question: "Карыз, кредит, ижара төлөм — бул ___ мисалдары.",
            answer: "пассив",
            options: ["пассив", "актив", "киреше", "үнөмдөө"],
            explanation: "Булар акчаңды алып кеткен нерселер — пассив." },
          { type: "true_false", question: "Байлар активди сатып алышат, жардылар пассив сатып алышат.",
            correct: true,
            explanation: "Кийосакинин негизги идеясы: байлар актив жыйышат, жардылар пассив." }
        ]
      },
      {
        id: "5-3", title: "Актив жыйоо стратегиясы", icon: "📈",
        xpReward: 50, gemReward: 10,
        questions: [
          { type: "multiple_choice", question: "Финансылык көз карандысыздыкка кантип жетсе болот?",
            options: [
              { text: "Активдер жыйып, пассивдүү киреше алуу", correct: true },
              { text: "Көп иштеп, акча жыйоо", correct: false },
              { text: "Кредит алуу", correct: false },
              { text: "Жер которуу", correct: false }
            ],
            explanation: "Активдер жыйоо — акчаңды сен үчүн иштетүү." },
          { type: "true_false", question: "Акциялар, облигациялар — финансылык активдер.",
            correct: true,
            explanation: "Туура! Акциялар жана облигациялар — финансылык активдердин мисалдары." },
          { type: "multiple_choice", question: "Кайсы стратегия байлык жаратат?",
            options: [
              { text: "Активди сатып алуу, кирешени жаңы активке салуу", correct: true },
              { text: "Акчаны жашыруу", correct: false },
              { text: "Баардыгын жумшоо", correct: false },
              { text: "Кредит менен жашоо", correct: false }
            ],
            explanation: "Кирешени жаңы активге салуу — 'Сложный процент' эффекти." },
          { type: "fill_blank", question: "Активдерден алынган пассивдүү киреше чыгашадан ашканда, муну ___ деп атайбыз.",
            answer: "финансылык эркиндик",
            options: ["финансылык эркиндик", "бюджет", "кредит", "инвестиция"],
            explanation: "Финансылык эркиндик — иштебей туруп жашоо мүмкүнчүлүгү." },
          { type: "true_false", question: "Кичинекей активдерден баштоо мүмкүн.",
            correct: true,
            explanation: "Туура! Бир акция, кичине бизнес — баары ири байлыктын башы." }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Инвестиция",
    subtitle: "Акчаңды иштет",
    emoji: "📈",
    color: "#1CB0F6",
    colorDark: "#0e8bc4",
    bgGradient: "linear-gradient(135deg, #051525, #020d1a)",
    lessons: [
      {
        id: "6-1", title: "Инвестиция негиздери", icon: "💡",
        xpReward: 60, gemReward: 15,
        questions: [
          { type: "multiple_choice", question: "Инвестиция деген эмне?",
            options: [
              { text: "Келечекте пайда алуу үчүн акча же убакыт жумшоо", correct: true },
              { text: "Акчаны жашыруу", correct: false },
              { text: "Банкка карыз берүү", correct: false },
              { text: "Кымбат нерсе алуу", correct: false }
            ],
            explanation: "Инвестиция — бүгүн жумшалып, эртең пайда алуу максатындагы аракет." },
          { type: "multiple_choice", question: "Сложный процент деген эмне?",
            options: [
              { text: "Пайыздан кайра пайыз алуу", correct: true },
              { text: "Банктын чоң пайызы", correct: false },
              { text: "Кредит пайызы", correct: false },
              { text: "Татаал математика", correct: false }
            ],
            explanation: "Сложный процент — 'дүйнөнүн 8-кереметі', акчаңды экспоненциалдуу өстүрөт." },
          { type: "true_false", question: "Инвестициянын тобокелчилиги жок болушу мүмкүн.",
            correct: false,
            explanation: "Жок! Ар кандай инвестицияда тобокелчилик бар, пайда менен тобокелчилик тең." },
          { type: "fill_blank", question: "Инвестицияда жогору пайда — жогору ___ дегенди билдирет.",
            answer: "тобокелчилик",
            options: ["тобокелчилик", "кепилдик", "бюджет", "актив"],
            explanation: "Жогору пайда — жогору тобокелчилик, бул инвестициянын негизги принциби." },
          { type: "true_false", question: "Диверсификация — тобокелчиликти азайтат.",
            correct: true,
            explanation: "Туура! 'Жумурткаларды бир себетке сала' дегендей — ар кандай активге бөлүп инвестициялоо." }
        ]
      },
      {
        id: "6-2", title: "Инвестиция түрлөрү", icon: "🎯",
        xpReward: 60, gemReward: 15,
        questions: [
          { type: "multiple_choice", question: "Акция (акции) деген эмне?",
            options: [
              { text: "Компаниянын кичинекей үлүшү", correct: true },
              { text: "Банктын кредити", correct: false },
              { text: "Мамлекеттин облигациясы", correct: false },
              { text: "Алтын сертификаты", correct: false }
            ],
            explanation: "Акция — компаниянын ээлигинин бир бөлүгү, дивиденд алуу укугун берет." },
          { type: "true_false", question: "Облигация — карыз куралы, инвестор мамлекет же компанияга карыз берет.",
            correct: true,
            explanation: "Туура! Облигация — карыз куралы, белгилүү мөөнөткө белгиленген пайыз берет." },
          { type: "multiple_choice", question: "ETF (Exchange-Traded Fund) деген эмне?",
            options: [
              { text: "Биржада сатылуучу инвестициялык фонд", correct: true },
              { text: "Электрондук которуу тутуму", correct: false },
              { text: "Валюта алмаштыруу куралы", correct: false },
              { text: "Банктык депозит", correct: false }
            ],
            explanation: "ETF — ар кандай активдердин себетин камтыган биржалык фонд." },
          { type: "fill_blank", question: "Алтын — инфляциядан ___ куралы катары колдонулат.",
            answer: "коргоо",
            options: ["коргоо", "жоголтуу", "арттыруу", "кредиттөө"],
            explanation: "Алтын — дүйнөлүк кризис жана инфляциядан коргоочу куралдардын бири." },
          { type: "multiple_choice", question: "Кайсы инвестиция эң аз тобокелчиликтүү?",
            options: [
              { text: "Мамлекеттик облигациялар", correct: true },
              { text: "Криптовалюта", correct: false },
              { text: "Стартап акциялары", correct: false },
              { text: "Коммодити", correct: false }
            ],
            explanation: "Мамлекеттик облигациялар — эң ишенимдүү, бирок аз пайдалуу инвестиция." }
        ]
      },
      {
        id: "6-3", title: "Узак мөөнөттүү инвестиция", icon: "🌱",
        xpReward: 60, gemReward: 15,
        questions: [
          { type: "multiple_choice", question: "Узак мөөнөттүү инвестиция канча жылга созулат?",
            options: [
              { text: "5 жылдан жогору", correct: true },
              { text: "1 жыл", correct: false },
              { text: "1 ай", correct: false },
              { text: "1 жума", correct: false }
            ],
            explanation: "Узак мөөнөттүү инвестиция — 5-30 жыл, сложный процент күчүн колдонот." },
          { type: "true_false", question: "Жаш адамдар узак мөөнөттүү инвестициядан көп пайда алат.",
            correct: true,
            explanation: "Туура! Убакыт — инвестициянын эң маанилүү факторы." },
          { type: "multiple_choice", question: "DCA (Dollar-Cost Averaging) деген эмне?",
            options: [
              { text: "Дайыма белгилүү суммага активди сатып алуу", correct: true },
              { text: "Баа төмөндөгөндө гана сатып алуу", correct: false },
              { text: "Баасы жогору болгондо сатуу", correct: false },
              { text: "Бир жолу чоң суммага инвестиция", correct: false }
            ],
            explanation: "DCA — баанын өзгөрүшүнө карабай, дайыма бирдей сатып алуу стратегиясы." },
          { type: "fill_blank", question: "Инвестициянын негизги эрежеси: акчаңды ар кандай ___ жай.",
            answer: "активге",
            options: ["активге", "банкка", "кредитке", "пассивке"],
            explanation: "Диверсификация — ар кандай активге бөлүп инвестициялоо." },
          { type: "true_false", question: "Биржа бир күндө чоң жоготку берет, бирок узак мөөнөттө өсөт.",
            correct: true,
            explanation: "Туура! Кыска мезгилде туруксуз, бирок тарыхта биржа дайыма узак мөөнөттө өскөн." }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Кредит жана карыз",
    subtitle: "Карыз акылдуу башкар",
    emoji: "💳",
    color: "#FF9600",
    colorDark: "#cc7a00",
    bgGradient: "linear-gradient(135deg, #2a1500, #1a0d00)",
    lessons: [
      {
        id: "7-1", title: "Кредит деген эмне?", icon: "🏦",
        xpReward: 60, gemReward: 15,
        questions: [
          { type: "multiple_choice", question: "Кредит деген эмне?",
            options: [
              { text: "Банктан алынган карыз акча", correct: true },
              { text: "Акча белек", correct: false },
              { text: "Мамлекеттин гранты", correct: false },
              { text: "Инвестиция", correct: false }
            ],
            explanation: "Кредит — банктан белгилүү мөөнөткө, пайыз менен алынган акча." },
          { type: "true_false", question: "Кредит пайызы — банкка карыз алуу баасы.",
            correct: true,
            explanation: "Туура! Пайыз — кредитти пайдалангандыгың үчүн банкка төлөйсүң." },
          { type: "multiple_choice", question: "Кредит рейтинги деген эмне?",
            options: [
              { text: "Карызды кайтарым жөндөмүңдүн баасы", correct: true },
              { text: "Банктын рейтинги", correct: false },
              { text: "Акча суммасы", correct: false },
              { text: "Пайыз ченинин рейтинги", correct: false }
            ],
            explanation: "Кредит рейтинги — сенин карыздарды убагында кайтарым жөндөмүңдүн баасы." },
          { type: "fill_blank", question: "Жыл ичиндеги кредит пайызы — ___ деп аталат.",
            answer: "жылдык пайыз чени",
            options: ["жылдык пайыз чени", "айлык чен", "бекер кредит", "ипотека"],
            explanation: "Жылдык пайыз чени (ГПС/APR) — кредиттин жылдык чыгымы." },
          { type: "true_false", question: "Кредитти убагында төлөө кредит рейтингин жакшыртат.",
            correct: true,
            explanation: "Туура! Убагында төлөм — жакшы кредит тарыхын жаратат." }
        ]
      },
      {
        id: "7-2", title: "Карызды башкаруу", icon: "⚖️",
        xpReward: 60, gemReward: 15,
        questions: [
          { type: "multiple_choice", question: "Карызды жоюунун кайсы ыкмасы эң натыйжалуу?",
            options: [
              { text: "Пайызы жогору карыздан баштоо (avalanche method)", correct: true },
              { text: "Баарын бирдей төлөө", correct: false },
              { text: "Карызды унутуу", correct: false },
              { text: "Жаңы карыз алып, эскисин жабуу", correct: false }
            ],
            explanation: "Avalanche method — эң жогору пайыздуу карыздан баштоо математикалык жактан тиімды." },
          { type: "true_false", question: "Карыз — дайыма жаман нерсе эмес.",
            correct: true,
            explanation: "Туура! 'Жакшы карыз' — билим алуу, бизнес ачуу үчүн алынган карыз активге айланат." },
          { type: "multiple_choice", question: "Кайсы карыз 'жаман карыз' деп саналат?",
            options: [
              { text: "Кымбат тамак жана ойын-зоок үчүн алынган кредит", correct: true },
              { text: "Билим алуу үчүн кредит", correct: false },
              { text: "Бизнес ачуу үчүн кредит", correct: false },
              { text: "Кирешелүү мүлк алуу кредити", correct: false }
            ],
            explanation: "Пассивди сатып алуу үчүн алынган карыз — жаман карыз." },
          { type: "fill_blank", question: "Карызды убагында төлөбөсөң, ___ жазасы болот.",
            answer: "айып пул",
            options: ["айып пул", "бекер", "сыйлык", "жардам"],
            explanation: "Убагында төлөнбөгөн карызга айып пул (штраф) жана кошумча пайыз коюлат." },
          { type: "true_false", question: "Кредит картасын ай сайын толук төлөө пайыздан сактайт.",
            correct: true,
            explanation: "Туура! Кредит картасын ай сайын толук жабуу — пайыздан бошотот." }
        ]
      },
      {
        id: "7-3", title: "Ипотека жана чоң кредиттер", icon: "🏠",
        xpReward: 60, gemReward: 15,
        questions: [
          { type: "multiple_choice", question: "Ипотека деген эмне?",
            options: [
              { text: "Жылыжай (үй) сатып алуу үчүн узак мөөнөттүү кредит", correct: true },
              { text: "Жылдык карыз", correct: false },
              { text: "Арзан кредит", correct: false },
              { text: "Бекер жашак", correct: false }
            ],
            explanation: "Ипотека — үй сатып алуу үчүн алынган 10-30 жылдык кредит." },
          { type: "true_false", question: "Ипотека алуудан мурун, башынкы төлөм (аванс) болушу керек.",
            correct: true,
            explanation: "Туура! Адатта баанын 10-30% аванс катары төлөнөт." },
          { type: "multiple_choice", question: "Автокредит алып машина алуу — бул кандай карыз?",
            options: [
              { text: "Пассив (машина бааланмаксыздана берет)", correct: true },
              { text: "Актив (машина баасы өсөт)", correct: false },
              { text: "Инвестиция", correct: false },
              { text: "Бекер акча", correct: false }
            ],
            explanation: "Машина — убакыт өткөн сайын баасы төмөндөйт (амортизация), пассив болуп саналат." },
          { type: "fill_blank", question: "Ипотека боюнча ай сайын төлөнүүчү акча — ___ деп аталат.",
            answer: "аннуитет",
            options: ["аннуитет", "инвестиция", "дивиденд", "пайыз"],
            explanation: "Аннуитет — ай сайын бирдей суммада кредит жана пайыз төлөмү." },
          { type: "true_false", question: "Пайыздын чени төмөн болсо, ипотека пайдалуу болушу мүмкүн.",
            correct: true,
            explanation: "Туура! Төмөн пайыздуу ипотека менен алынган мүлк актив болушу мүмкүн." }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Бизнес негиздери",
    subtitle: "Ишкер жолун баштан ал",
    emoji: "🏢",
    color: "#58CC02",
    colorDark: "#4a9e02",
    bgGradient: "linear-gradient(135deg, #0a2a0a, #051505)",
    lessons: [
      {
        id: "8-1", title: "Бизнес идея", icon: "💡",
        xpReward: 70, gemReward: 20,
        questions: [
          { type: "multiple_choice", question: "Бизнес деген эмне?",
            options: [
              { text: "Пайда алуу максатында товар же кызмат сунуштоо", correct: true },
              { text: "Иш менен алектенүү", correct: false },
              { text: "Чоң завод ачуу", correct: false },
              { text: "Мамлекеттик мекеме", correct: false }
            ],
            explanation: "Бизнес — пайда алуу максатындагы ишкердик иш-аракет." },
          { type: "true_false", question: "Бизнес ачуу үчүн чоң капитал керек.",
            correct: false,
            explanation: "Жок! Кичинекей капитал менен да бизнес ачса болот, маанилүүсү — идея жана аракет." },
          { type: "multiple_choice", question: "Бизнес идея кантип текшерилет?",
            options: [
              { text: "Рынокту изилдеп, мини тест жасоо", correct: true },
              { text: "Баардык акчаны дароо жумшоо", correct: false },
              { text: "Достор менен сүйлөшүү гана", correct: false },
              { text: "Эч нерсе текшербоо", correct: false }
            ],
            explanation: "Рынок изилдөө жана MVP (минимум жашоолуу продукт) — идеяны текшерүүнүн жолу." },
          { type: "fill_blank", question: "Бизнес идеянын маңызы — кимдир биринин ___ чечүү.",
            answer: "проблемасын",
            options: ["проблемасын", "акчасын", "убактысын", "досун"],
            explanation: "Ийгиликтүү бизнес — рынокто чыныгы проблеманы чечет." },
          { type: "true_false", question: "Бизнес-план — бизнестин жол картасы.",
            correct: true,
            explanation: "Туура! Бизнес-план — максаттарды, стратегияны жана финансты камтыган документ." }
        ]
      },
      {
        id: "8-2", title: "Пайда жана чыгым", icon: "📊",
        xpReward: 70, gemReward: 20,
        questions: [
          { type: "multiple_choice", question: "Жалпы пайда кантип эсептелет?",
            options: [
              { text: "Киреше - Товар/Кызмат чыгымы", correct: true },
              { text: "Киреше × 2", correct: false },
              { text: "Чыгаша - Кредит", correct: false },
              { text: "Инвестиция + Пайыз", correct: false }
            ],
            explanation: "Жалпы пайда = Сатуу кирешеси - Тикелей чыгымдар (себестоимость)." },
          { type: "true_false", question: "Таза пайда — бардык чыгымдарды алып салгандан кийинки акча.",
            correct: true,
            explanation: "Туура! Таза пайда = Жалпы киреше - Бардык чыгымдар (салык кошкондо)." },
          { type: "multiple_choice", question: "Break-even point деген эмне?",
            options: [
              { text: "Чыгым менен кирешенин барабар болуучу чекити", correct: true },
              { text: "Бизнестин жоголуш чекити", correct: false },
              { text: "Максималдуу пайда", correct: false },
              { text: "Ири инвестиция", correct: false }
            ],
            explanation: "Break-even — бул чектен ашып кеткенде бизнес пайда таба баштайт." },
          { type: "fill_blank", question: "Бизнестин жашоо мүмкүнчүлүгү анын ___ жаратуу жөндөмүнө жараша.",
            answer: "пайда",
            options: ["пайда", "карыз", "акча", "кредит"],
            explanation: "Пайда жаратуу — бизнестин негизги максаты жана жашоо шарты." },
          { type: "true_false", question: "Сатуу баасы чыгымдан жогору болушу керек.",
            correct: true,
            explanation: "Туура! Сатуу баасы < Чыгым болсо — бизнес зыян тартат." }
        ]
      },
      {
        id: "8-3", title: "Бизнес түрлөрү", icon: "🌐",
        xpReward: 70, gemReward: 20,
        questions: [
          { type: "multiple_choice", question: "ЖЧК деген эмне?",
            options: [
              { text: "Жоопкерчилиги чектелген коом", correct: true },
              { text: "Жашоочулар чогулушу коому", correct: false },
              { text: "Жалпы чыгарма кызмат", correct: false },
              { text: "Жаң чакан кесип", correct: false }
            ],
            explanation: "ЖЧК — жоопкерчилиги чектелген коом, бизнестин жалпы жайылган түрү." },
          { type: "true_false", question: "Фриланс — бул кичинекей бизнестин бир түрү.",
            correct: true,
            explanation: "Туура! Фрилансер — өз услугаларын өз эсебинен сататын жеке ишкер." },
          { type: "multiple_choice", question: "Франшиза деген эмне?",
            options: [
              { text: "Белгилүү брендди ижарага алып бизнес жүргүзүү", correct: true },
              { text: "Бекер лицензия", correct: false },
              { text: "Мамлекеттик жардам", correct: false },
              { text: "Инвестициялык фонд", correct: false }
            ],
            explanation: "Франшиза — белгилүү компаниянын атын жана системасын колдонуп бизнес жүргүзүү." },
          { type: "fill_blank", question: "Онлайн бизнес — ___ аркылуу жүргүзүлгөн ишкердик.",
            answer: "интернет",
            options: ["интернет", "телефон", "банк", "почта"],
            explanation: "Онлайн бизнес — интернет аркылуу товар же кызмат сатуу." },
          { type: "true_false", question: "Стартап — инновациялуу идеяга негизделген жаш компания.",
            correct: true,
            explanation: "Туура! Стартап — тез өсүүгө умтулган инновациялуу бизнес моделдери." }
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Байлардын ой жүгүртүүсү",
    subtitle: "Ой жүгүртүүңдү өзгөрт",
    emoji: "🧠",
    color: "#9B59B6",
    colorDark: "#7d3f99",
    bgGradient: "linear-gradient(135deg, #180a2a, #100520)",
    lessons: [
      {
        id: "9-1", title: "Менталитетти өзгөртүү", icon: "🔑",
        xpReward: 70, gemReward: 20,
        questions: [
          { type: "multiple_choice", question: "Байлардын жана жардылардын ой жүгүртүүсүнүн айырмасы кайсы?",
            options: [
              { text: "Байлар мүмкүнчүлүктөрдү, жардылар тоскоолдуктарды көрөт", correct: true },
              { text: "Байлар акчалуу үй-бүлөдөн чыгат", correct: false },
              { text: "Байлар жакшы окуган", correct: false },
              { text: "Байлар бактылуу", correct: false }
            ],
            explanation: "Байлардын ой жүгүртүүсү — проблемаларды мүмкүнчүлүккө айландыруу." },
          { type: "true_false", question: "Акча — бул жаман нерсе деген ой жүгүртүү байлыкка бөгөт.",
            correct: true,
            explanation: "Туура! Акча жөнүндө терс ой — аны табуудан тартынтат." },
          { type: "multiple_choice", question: "Growth mindset деген эмне?",
            options: [
              { text: "Каталардан үйрөнүп, дайыма өнүккөн адам", correct: true },
              { text: "Тез бай болуу", correct: false },
              { text: "Риск албоо", correct: false },
              { text: "Эч нерсе үйрөнбөө", correct: false }
            ],
            explanation: "Growth mindset — жетишпестиктерди өнүгүүгө мүмкүнчүлүк катары кабылдоо." },
          { type: "fill_blank", question: "Байлар ___ жасап акча табышат, жардылар убактысын сатышат.",
            answer: "акчасын иштетип",
            options: ["акчасын иштетип", "карыз алып", "жаш болуп", "иштебей"],
            explanation: "Байлар акчасын инвестиция аркылуу иштетишет." },
          { type: "true_false", question: "Финансылык сабаттуулук — жашоону өзгөртүүгө жардам берет.",
            correct: true,
            explanation: "Туура! Финансылык билим — мүмкүнчүлүктөрдү ачуучу ачкыч." }
        ]
      },
      {
        id: "9-2", title: "Байлардын адаттары", icon: "⭐",
        xpReward: 70, gemReward: 20,
        questions: [
          { type: "multiple_choice", question: "Ийгиликтүү байлардын жалпы адаты кайсы?",
            options: [
              { text: "Дайыма үйрөнүү жана өнүгүү", correct: true },
              { text: "Кымбат нерсе алуу", correct: false },
              { text: "Эрте ойгонуу гана", correct: false },
              { text: "Компьютер ойноо", correct: false }
            ],
            explanation: "Байлардын 88% ки күнүнүн 30 минутун өз-өзүн өнүктүрүүгө жумшашат (Corley изилдөөсү)." },
          { type: "true_false", question: "Сетевизм (networking) — карьера жана бизнестин негизи.",
            correct: true,
            explanation: "Туура! 'Сен кимди билесиң' — 'Сен эмнени билесиң' сыяктуу эле маанилүү." },
          { type: "multiple_choice", question: "'Pay yourself first' дегени кайсы?",
            options: [
              { text: "Кирешени алгач үнөмдөөгө коюу", correct: true },
              { text: "Өзүңө зарплата берүү", correct: false },
              { text: "Башкаларга акча берүү", correct: false },
              { text: "Ишти таштоо", correct: false }
            ],
            explanation: "Өзүңө биринчи төлө — кирешенин 10-20% автоматтык сактагычка которуу адаты." },
          { type: "fill_blank", question: "Байлар ийгиликсиздикти ___ катары кабылдашат.",
            answer: "сабак",
            options: ["сабак", "кыйынчылык", "бүтүш", "каталык"],
            explanation: "Ийгиликсиздик — сабак, байлар андан үйрөнүп алдыга басышат." },
          { type: "true_false", question: "Байлар адатта кандайдыр бир максатта жашашат.",
            correct: true,
            explanation: "Туура! Максат — мотивациянын жана ийгиликтин негизи." }
        ]
      },
      {
        id: "9-3", title: "Финансылык эркиндикке жол", icon: "🚀",
        xpReward: 80, gemReward: 25,
        questions: [
          { type: "multiple_choice", question: "Финансылык эркиндик деген эмне?",
            options: [
              { text: "Жашоо чыгашасын жабуу үчүн иштебей эле акча алуу", correct: true },
              { text: "Банкта чоң акча болуу", correct: false },
              { text: "Кредит алуу укугу", correct: false },
              { text: "Чоң зарплата алуу", correct: false }
            ],
            explanation: "Финансылык эркиндик — пассивдүү кирешең чыгашаңды жаппаганда." },
          { type: "true_false", question: "Финансылык эркиндикке жетүү ондогон жылдар талап кылат.",
            correct: false,
            explanation: "Жок! FIRE движение боюнча 10-15 жылда да жетүүгө болот, жогору сактоо менен." },
          { type: "multiple_choice", question: "FIRE акронимдин маанисин билесиңби?",
            options: [
              { text: "Financial Independence, Retire Early", correct: true },
              { text: "Fast Income, Real Estate", correct: false },
              { text: "Finance, Investment, Return, Earn", correct: false },
              { text: "Freedom In Real Economy", correct: false }
            ],
            explanation: "FIRE — Финансылык Көз карандысыздык жана Эрте Зейнетке Чыгуу кыймылы." },
          { type: "fill_blank", question: "Финансылык эркиндиктин үч мүнөзгөсү: активдер, ___, жана аз чыгаша.",
            answer: "пассивдүү киреше",
            options: ["пассивдүү киреше", "зарплата", "кредит", "банк"],
            explanation: "Активдер → Пассивдүү Киреше → Аз Чыгаша = Финансылык Эркиндик." },
          { type: "true_false", question: "Ар ким финансылык эркиндикке умтула алат.",
            correct: true,
            explanation: "Туура! Акылдуу пландоо жана тактика менен — баарына жеткиликтүү максат." }
        ]
      }
    ]
  },
  {
    id: 10,
    title: "Финансылык эркиндик",
    subtitle: "Жогорку деңгээл",
    emoji: "👑",
    color: "#FFD900",
    colorDark: "#ccac00",
    bgGradient: "linear-gradient(135deg, #2a2000, #1a1500)",
    lessons: [
      {
        id: "10-1", title: "Пассивдүү кирешенин булактары", icon: "🌊",
        xpReward: 80, gemReward: 25,
        questions: [
          { type: "multiple_choice", question: "Пассивдүү кирешенин мисалы кайсы?",
            options: [
              { text: "Акциялардан алынган дивиденд", correct: true },
              { text: "Зарплата", correct: false },
              { text: "Убакытка сатылган кызмат", correct: false },
              { text: "Айлык бонус", correct: false }
            ],
            explanation: "Дивиденд — акциялар аркылуу алынган пассивдүү киреше." },
          { type: "true_false", question: "Онлайн курс жаратуу — пассивдүү кирешенин бир жолу.",
            correct: true,
            explanation: "Туура! Бир жолу жаратылган контент дайыма пайда алып келиши мүмкүн." },
          { type: "multiple_choice", question: "Аренда кирешеси — кандай киреше?",
            options: [
              { text: "Пассивдүү киреше", correct: true },
              { text: "Активдүү киреше", correct: false },
              { text: "Бизнес кирешеси", correct: false },
              { text: "Зарплата", correct: false }
            ],
            explanation: "Мүлктү ижарага берүү — иштебей эле акча алуунун классикалуу жолу." },
          { type: "fill_blank", question: "Китеп же музыка жаратуу — ___ укук кирешесин алып келет.",
            answer: "авторлук",
            options: ["авторлук", "банк", "инвестиция", "зарплата"],
            explanation: "Авторлук укук (роялти) — жаратылган акыл-ой мүлкүнөн алынган пассивдүү киреше." },
          { type: "true_false", question: "Пассивдүү кирешени жаратуу убакыт жана күч талап кылат.",
            correct: true,
            explanation: "Туура! Пассивдүү киреше бир жолу чоң жумуш талап кылат, кийин өзүнөн-өзү иштейт." }
        ]
      },
      {
        id: "10-2", title: "Байлыктын жети деңгээли", icon: "🏔️",
        xpReward: 80, gemReward: 25,
        questions: [
          { type: "multiple_choice", question: "Биринчи финансылык максат кайсы болушу керек?",
            options: [
              { text: "Өзгөчө жагдай фонду жаратуу", correct: true },
              { text: "Бай болуу", correct: false },
              { text: "Инвестиция кылуу", correct: false },
              { text: "Бизнес ачуу", correct: false }
            ],
            explanation: "Ырааттуулук: Өзгөчө фонд → Карызсыздык → Инвестиция → Финансылык эркиндик." },
          { type: "true_false", question: "Нет активдер (net worth) — байлыктын өлчөмү.",
            correct: true,
            explanation: "Туура! Нет активдер = Жалпы активдер - Жалпы карыздар." },
          { type: "multiple_choice", question: "Кайсы адам финансылык жактан эркин?",
            options: [
              { text: "Пассивдүү кирешеси чыгашасын жапкан адам", correct: true },
              { text: "Эң бай адам", correct: false },
              { text: "Мыкты зарплата алган адам", correct: false },
              { text: "Карызы жок адам", correct: false }
            ],
            explanation: "Финансылык эркиндик — пассивдүү кирешең чыгашаңды жабат." },
          { type: "fill_blank", question: "Миллионер болуу үчүн орточо ___ жыл талап кылынат.",
            answer: "25-30",
            options: ["25-30", "1-2", "5-10", "50-60"],
            explanation: "DCA жана диверсификация менен узак мөөнөттүү инвестиция миллионерлик жаратат." },
          { type: "true_false", question: "Байлык — туура адаттар жана убакыттын натыйжасы.",
            correct: true,
            explanation: "Туура! Байлык — бир түнтө эмес, жылдар бою акылдуу аракеттердин жыйынтыгы." }
        ]
      },
      {
        id: "10-3", title: "Финансылык мурас", icon: "🌟",
        xpReward: 100, gemReward: 30,
        questions: [
          { type: "multiple_choice", question: "Мурас (наследство) пландоо эмне?",
            options: [
              { text: "Байлыкты кийинки муунга өткөрүү пландоосу", correct: true },
              { text: "Кариялар үчүн акча", correct: false },
              { text: "Зарплатаны арттыруу", correct: false },
              { text: "Кредит жабуу", correct: false }
            ],
            explanation: "Мурас пландоо — байлыкты балдарга же коомго өткөрүп берүү планы." },
          { type: "true_false", question: "Байлар балдарына акча эмес, акылдуулукту мурас калтыруу маанилүү.",
            correct: true,
            explanation: "Туура! Финансылык билим — акчадан баалуу мурас." },
          { type: "multiple_choice", question: "Коомдук байлык (социальный капитал) деген эмне?",
            options: [
              { text: "Байланыштар, ишеним жана бирдиктүүлүк", correct: true },
              { text: "Мамлекеттин акчасы", correct: false },
              { text: "Коомдук фонд", correct: false },
              { text: "Кайрымдуулук", correct: false }
            ],
            explanation: "Социалдык капитал — байланыштар жана ишеним, бизнестин негизги ресурсу." },
          { type: "fill_blank", question: "Финансылык ___ балдарга берилген эң баалуу белек.",
            answer: "сабаттуулук",
            options: ["сабаттуулук", "акча", "үй", "машина"],
            explanation: "Финансылык сабаттуулук — байлык жаратуунун жана сактоонун ачкычы." },
          { type: "true_false", question: "FinLingvoну бүтүргөн сен — финансылык болочоксун!",
            correct: true,
            explanation: "Куттуктайбыз! 🎉 Финансылык сабаттуулук сапарыңды баштадың!" }
        ]
      }
    ]
  }
];

// Жетишкендиктер
const ACHIEVEMENTS = [
  { id: "first_lesson", title: "Биринчи кадам", description: "Биринчи сабагыңды аяктадың", icon: "🚀", xp: 50 },
  { id: "streak_3", title: "3 күн катары", description: "3 күн катары үйрөндүң", icon: "🔥", xp: 75 },
  { id: "streak_7", title: "Жума баатыры", description: "7 күн катары үйрөндүң", icon: "⚡", xp: 150 },
  { id: "streak_30", title: "Ай легендасы", description: "30 күн катары үйрөндүң", icon: "👑", xp: 500 },
  { id: "xp_100", title: "100 XP", description: "100 тажрыйба жыйдың", icon: "⭐", xp: 25 },
  { id: "xp_1000", title: "1000 XP Чемпион", description: "1000 тажрыйба жыйдың", icon: "🏆", xp: 100 },
  { id: "xp_5000", title: "5000 XP Легенда", description: "5000 тажрыйба жыйдың", icon: "💎", xp: 250 },
  { id: "perfect_lesson", title: "Мүнөзсүз", description: "Бир да ката кетирбедиң", icon: "✨", xp: 75 },
  { id: "module_1", title: "Акча Эксперти", description: "1-бөлүмдү аяктадың", icon: "💰", xp: 100 },
  { id: "module_5", title: "Инвестор", description: "5-бөлүмдү аяктадың", icon: "📈", xp: 200 },
  { id: "all_modules", title: "Финансылык Эксперт", description: "Бардык бөлүмдөрдү аяктадың", icon: "🧠", xp: 1000 },
  { id: "fast_learner", title: "Тез Окуучу", description: "1 күндө 5 сабак аяктадың", icon: "⚡", xp: 100 }
];

// Лига системасы
const LEAGUES = [
  { id: "bronze", name: "Жез", color: "#CD7F32", minXP: 0, icon: "🥉" },
  { id: "silver", name: "Күмүш", color: "#C0C0C0", minXP: 500, icon: "🥈" },
  { id: "gold", name: "Алтын", color: "#FFD700", minXP: 1500, icon: "🥇" },
  { id: "sapphire", name: "Сапфир", color: "#0F52BA", minXP: 3000, icon: "💎" },
  { id: "ruby", name: "Рубин", color: "#E0115F", minXP: 5000, icon: "❤️‍🔥" },
  { id: "emerald", name: "Изумруд", color: "#50C878", minXP: 8000, icon: "💚" },
  { id: "amethyst", name: "Аметист", color: "#9966CC", minXP: 12000, icon: "💜" },
  { id: "pearl", name: "Меруерт", color: "#F0EAD6", minXP: 18000, icon: "🤍" },
  { id: "obsidian", name: "Обсидиан", color: "#3D3D3D", minXP: 25000, icon: "🖤" },
  { id: "diamond", name: "Бриллиант", color: "#B9F2FF", minXP: 40000, icon: "💠" }
];

// Дүкөн буюмдары
const SHOP_ITEMS = [
  { id: "heart_refill", category: "hearts", name: "Жан толтуруу", description: "Жандарды толук калыбына келтир", icon: "❤️", price: 350, currency: "gems" },
  { id: "heart_shield", category: "hearts", name: "Жан коргоо", description: "1 сабак ичинде жандарды жоготпоо", icon: "🛡️", price: 150, currency: "gems" },
  { id: "xp_boost_2x", category: "boosts", name: "2× XP Boost", description: "30 мүнөт бою 2 эсе XP", icon: "⚡", price: 200, currency: "gems" },
  { id: "xp_boost_3x", category: "boosts", name: "3× XP Boost", description: "15 мүнөт бою 3 эсе XP", icon: "🚀", price: 300, currency: "gems" },
  { id: "streak_freeze", category: "streaks", name: "Streak Freeze", description: "1 күн streak үзүлбөйт", icon: "🧊", price: 200, currency: "gems" },
  { id: "avatar_eagle", category: "avatars", name: "Бүркүт Аватар", description: "Кыргызстандын символу", icon: "🦅", price: 500, currency: "gems" },
  { id: "avatar_yurt", category: "avatars", name: "Боз Үй Аватар", description: "Кыргыздын үйү", icon: "🏠", price: 500, currency: "gems" },
  { id: "theme_dark", category: "themes", name: "Кара Тема", description: "Кош алгыш", icon: "🌙", price: 0, currency: "gems" },
  { id: "theme_cyber", category: "themes", name: "Киберпанк Тема", description: "Болочок", icon: "🤖", price: 400, currency: "gems" }
];

// Лидерлер тизмеси үчүн демо маалыматтар
const DEMO_USERS = [
  { name: "Айгерим К.", xp: 4850, streak: 23, avatar: "👩" },
  { name: "Нурлан А.", xp: 4200, streak: 15, avatar: "👨" },
  { name: "Зарина Б.", xp: 3900, streak: 18, avatar: "👩" },
  { name: "Темир С.", xp: 3450, streak: 12, avatar: "👦" },
  { name: "Аида М.", xp: 3100, streak: 9, avatar: "👧" },
  { name: "Бекзат Р.", xp: 2800, streak: 7, avatar: "👦" },
  { name: "Малика О.", xp: 2500, streak: 14, avatar: "👩" },
  { name: "Данияр Т.", xp: 2200, streak: 5, avatar: "👨" },
  { name: "Гүлнара Э.", xp: 1950, streak: 11, avatar: "👩" },
  { name: "Азиз К.", xp: 1700, streak: 3, avatar: "👦" }
];
