import type { Meditation, MeditationStep } from '@/types';

function breathCycle(inhale: number, hold: number, exhale: number, label?: string, labelEn?: string): MeditationStep[] {
  const prefix = label ? `${label} — ` : '';
  const prefixEn = labelEn ? `${labelEn} — ` : '';
  return [
    { text: `${prefix}Inhala profundamente`, textEn: `${prefixEn}Breathe in deeply`, duration: inhale, type: 'inhale' },
    { text: `${prefix}Sostén la respiración`, textEn: `${prefixEn}Hold your breath`, duration: hold, type: 'hold' },
    { text: `${prefix}Exhala lentamente`, textEn: `${prefixEn}Breathe out slowly`, duration: exhale, type: 'exhale' },
  ];
}

interface BuildGuidedOpts {
  titleEn?: string;
  subtitleEn?: string;
  descriptionEn?: string;
  introStepsEn?: MeditationStep[];
  closeStepsEn?: MeditationStep[];
  breathLabelEn?: string;
  youtubeId?: string;
  isVideo?: boolean;
  premium?: boolean;
  pointsRequired?: number;
  youtubeIdEn?: string;
  videoStartEn?: number;
}

function buildGuided(
  id: string, title: string, subtitle: string, description: string,
  icon: string, iconType: string, color: string, gradient: string,
  introSteps: MeditationStep[], mainCycle: MeditationStep[],
  closeSteps: MeditationStep[], cycles: number,
  opts?: BuildGuidedOpts
): Meditation {
  const intro: MeditationStep[] = [
    { text: 'Busca un lugar tranquilo. Siéntate erguido pero relajado. Cierra los ojos suavemente.', textEn: 'Find a quiet place. Sit upright but relaxed. Gently close your eyes.', duration: 15, type: 'instruction' },
    { text: 'Toma tres respiraciones profundas para soltar el día.', textEn: 'Take three deep breaths to let go of the day.', duration: 12, type: 'instruction' },
    ...breathCycle(4, 2, 6, 'Preparación', opts?.breathLabelEn),
    ...introSteps.map((s, i) => {
      const en = opts?.introStepsEn?.[i];
      return en ? { ...s, textEn: en.text } : s;
    }),
  ];
  const outro: MeditationStep[] = [
    ...closeSteps.map((s, i) => {
      const en = opts?.closeStepsEn?.[i];
      return en ? { ...s, textEn: en.text } : s;
    }),
    { text: 'Poco a poco, trae tu conciencia de vuelta al espacio que te rodea.', textEn: 'Slowly bring your awareness back to the space around you.', duration: 8, type: 'instruction' },
    { text: 'Cuando te sientas listo, abre suavemente los ojos.', textEn: 'When you feel ready, gently open your eyes.', duration: 5, type: 'instruction' },
  ];
  const mainSteps: MeditationStep[] = opts?.youtubeId
    ? [{ text: `Reproduciendo — ${title}`, textEn: `Playing — ${opts?.titleEn || title}`, duration: 420, type: 'video' }]
    : Array(cycles).fill(mainCycle).flat();
  const steps = [...intro, ...mainSteps, ...outro];
  const totalSeconds = steps.reduce((acc, s) => acc + s.duration, 0);
  return {
    id, title, subtitle, description, icon, iconType, color, gradient,
    duration: totalSeconds, steps,
    premium: opts?.premium ?? false,
    youtubeId: opts?.youtubeId,
    isVideo: opts?.isVideo ?? !!opts?.youtubeId,
    youtubeIdEn: opts?.youtubeIdEn,
    videoStartEn: opts?.videoStartEn,
    titleEn: opts?.titleEn,
    pointsRequired: opts?.pointsRequired,
    subtitleEn: opts?.subtitleEn,
    descriptionEn: opts?.descriptionEn,
  };
}

export const meditations: Meditation[] = [
  buildGuided(
    'breath-awareness',
    'Conciencia de la Respiración',
    'El puente entre el cuerpo y la mente',
    'Observa tu respiración natural sin modificarla. Siente el aire entrando y saliendo. Esta práctica fundamental cultiva la atención plena y te conecta con el momento presente. La respiración es el ancla que siempre está contigo.',
    'wind', 'wind', '#CC0000', 'linear-gradient(135deg, #CC0000 0%, #7A0000 100%)',
    [
      { text: 'Lleva tu atención a la punta de la nariz. Siente el aire frío al entrar.', duration: 10, type: 'instruction' },
      { text: 'Siente el aire cálido al salir. No controles, solo observa.', duration: 10, type: 'instruction' },
    ],
    [
      { text: 'Observa tu inhalación...', textEn: 'Observe your inhalation...', duration: 5, type: 'silence' },
      { text: 'Observa tu exhalación...', textEn: 'Observe your exhalation...', duration: 5, type: 'silence' },
      { text: 'Siente el espacio entre respiraciones...', textEn: 'Feel the space between breaths...', duration: 5, type: 'silence' },
    ],
    [
      { text: 'Permite que tu respiración sea natural, sin esfuerzo.', duration: 10, type: 'instruction' },
      { text: 'Siente cómo cada respiración te renueva.', duration: 10, type: 'instruction' },
    ],
    28,
    {
      titleEn: 'Breath Awareness',
      subtitleEn: 'The bridge between body and mind',
      descriptionEn: 'Observe your natural breath without changing it. Feel the air entering and leaving. This fundamental practice cultivates mindfulness and connects you with the present moment. Your breath is the anchor that is always with you.',
      breathLabelEn: 'Preparation',
      introStepsEn: [
        { text: 'Bring your attention to the tip of your nose. Feel the cool air as you breathe in.', duration: 10, type: 'instruction' },
        { text: 'Feel the warm air as you breathe out. Don\'t control, just observe.', duration: 10, type: 'instruction' },
      ],
      closeStepsEn: [
        { text: 'Allow your breath to be natural, effortless.', duration: 10, type: 'instruction' },
        { text: 'Feel how each breath renews you.', duration: 10, type: 'instruction' },
      ],
      pointsRequired: 0,
    }
  ),
  buildGuided(
    'body-scan',
    'Escáner Corporal',
    'Habita cada rincón de tu cuerpo',
    'Recorre tu cuerpo con atención sistemática, desde los pies hasta la coronilla. Esta práctica profundiza la conexión mente-cuerpo y libera tensiones acumuladas que ni siquiera sabías que llevabas.',
    'meditate', 'meditate', '#FF4444', 'linear-gradient(135deg, #FF4444 0%, #8B1A1A 100%)',
    [
      { text: 'Siente el peso de tu cuerpo contra el suelo. Entrégate a la gravedad.', duration: 10, type: 'instruction' },
    ],
    [
      { text: 'Lleva la atención a tus pies... dedos, planta, talón...', textEn: 'Bring attention to your feet... toes, sole, heel...', duration: 12, type: 'silence' },
      { text: 'Siente tus tobillos, pantorrillas, rodillas...', textEn: 'Feel your ankles, calves, knees...', duration: 12, type: 'silence' },
      { text: 'Muslos, caderas, abdomen...', textEn: 'Thighs, hips, abdomen...', duration: 12, type: 'silence' },
      { text: 'Pecho, hombros, brazos...', textEn: 'Chest, shoulders, arms...', duration: 12, type: 'silence' },
      { text: 'Cuello, rostro, coronilla...', textEn: 'Neck, face, crown...', duration: 12, type: 'silence' },
      { text: 'Ahora siente tu cuerpo como un todo, un campo de energía vibrante.', textEn: 'Now feel your body as a whole, a field of vibrant energy.', duration: 15, type: 'silence' },
    ],
    [
      { text: 'Visualiza una luz suave que recorre todo tu cuerpo, sanando cada célula.', duration: 15, type: 'instruction' },
    ],
    5,
    {
      titleEn: 'Body Scan',
      subtitleEn: 'Inhabit every corner of your body',
      descriptionEn: 'Scan your body with systematic attention, from your toes to the crown of your head. This practice deepens the mind-body connection and releases accumulated tension you didn\'t even know you were carrying.',
      breathLabelEn: 'Preparation',
      introStepsEn: [
        { text: 'Feel the weight of your body against the floor. Surrender to gravity.', duration: 10, type: 'instruction' },
      ],
      closeStepsEn: [
        { text: 'Visualize a soft light flowing through your entire body, healing every cell.', duration: 15, type: 'instruction' },
      ],
      pointsRequired: 0,
    }
  ),
  buildGuided(
    'aum-chanting',
    'Canto de Aum',
    'La vibración primordial del universo',
    'El Aum no es solo un sonido, es la vibración fundamental de la existencia. Al cantar Aum, sintonizas tu sistema con el ritmo del cosmos. Siente la vibración en tu pecho, garganta y cabeza. Deja que el sonido te lleve más allá del pensamiento.',
    'om', 'om', '#FF6B6B', 'linear-gradient(135deg, #FF6B6B 0%, #A00000 100%)',
    [
      { text: 'Inhala profundamente. Al exhalar, entona A-U-U-U-U-M-M-M...', duration: 8, type: 'mantra' },
      { text: 'Siente cómo la vibración comienza en el abdomen y sube hasta la coronilla.', duration: 5, type: 'instruction' },
    ],
    [
      { text: 'A-U-U-U-U-M-M-M...', textEn: 'A-U-U-U-U-M-M-M...', duration: 8, type: 'mantra' },
      { text: 'A-U-U-U-U-M-M-M...', textEn: 'A-U-U-U-U-M-M-M...', duration: 8, type: 'mantra' },
      { text: 'A-U-U-U-U-M-M-M...', textEn: 'A-U-U-U-U-M-M-M...', duration: 8, type: 'mantra' },
      { text: 'Silencio... siente el eco de la vibración en tu interior.', textEn: 'Silence... feel the echo of the vibration within you.', duration: 10, type: 'silence' },
    ],
    [
      { text: 'Ahora, en silencio, repite Aum mentalmente. Deja que resuene en tu ser.', duration: 20, type: 'instruction' },
    ],
    12,
    {
      titleEn: 'Aum Chanting',
      subtitleEn: 'The primordial vibration of the universe',
      descriptionEn: 'Aum is not just a sound, it is the fundamental vibration of existence. By chanting Aum, you tune your system with the rhythm of the cosmos. Feel the vibration in your chest, throat, and head. Let the sound carry you beyond thought.',
      youtubeId: '7zHDL0_sRGI',
      breathLabelEn: 'Preparation',
      introStepsEn: [
        { text: 'Breathe in deeply. As you exhale, intone A-U-U-U-U-M-M-M...', duration: 8, type: 'mantra' },
        { text: 'Feel how the vibration begins in your abdomen and rises to the crown of your head.', duration: 5, type: 'instruction' },
      ],
      closeStepsEn: [
        { text: 'Now, in silence, repeat Aum mentally. Let it resonate in your being.', duration: 20, type: 'instruction' },
      ],
      pointsRequired: 2,
    }
  ),
  buildGuided(
    'witnessing',
    'El Observador',
    'Tú no eres tus pensamientos',
    'Siéntate y observa tus pensamientos como nubes que pasan por el cielo. No te aferres a ninguno, no rechaces ninguno. Esta práctica crea una distancia saludable entre tu ser esencial y el constante parloteo de la mente. Descubre la paz que existe debajo del ruido mental.',
    'eye', 'eye', '#E03030', 'linear-gradient(135deg, #E03030 0%, #660000 100%)',
    [
      { text: 'Observa tu mente como quien mira pasar las nubes. Sin juicio, sin apego.', duration: 10, type: 'instruction' },
      { text: 'Cada pensamiento que surge, déjalo ir. No lo sigas, no lo retengas.', duration: 10, type: 'instruction' },
    ],
    [
      { text: 'Un pensamiento aparece... obsérvalo... déjalo ir...', textEn: 'A thought appears... observe it... let it go...', duration: 8, type: 'silence' },
      { text: 'Otro pensamiento aparece... ni lo juzgues... solo suéltalo...', textEn: 'Another thought appears... don\'t judge it... just release it...', duration: 8, type: 'silence' },
      { text: 'Entre pensamiento y pensamiento, hay un espacio... permanece ahí...', textEn: 'Between thoughts, there is a space... remain there...', duration: 10, type: 'silence' },
      { text: 'Ese espacio eres tú. No los pensamientos.', textEn: 'That space is you. Not the thoughts.', duration: 8, type: 'instruction' },
    ],
    [
      { text: 'Descansa en ese espacio de conciencia pura, más allá de los pensamientos.', duration: 20, type: 'silence' },
    ],
    15,
    {
      titleEn: 'The Witness',
      subtitleEn: 'You are not your thoughts',
      descriptionEn: 'Sit and observe your thoughts like clouds passing through the sky. Don\'t cling to any, don\'t reject any. This practice creates a healthy distance between your essential self and the constant chatter of the mind. Discover the peace that exists beneath the mental noise.',
      breathLabelEn: 'Preparation',
      introStepsEn: [
        { text: 'Observe your mind like watching clouds pass by. Without judgment, without attachment.', duration: 10, type: 'instruction' },
        { text: 'Every thought that arises, let it go. Don\'t follow it, don\'t hold it.', duration: 10, type: 'instruction' },
      ],
      closeStepsEn: [
        { text: 'Rest in that space of pure awareness, beyond thoughts.', duration: 20, type: 'silence' },
      ],
      pointsRequired: 3,
    }
  ),
  buildGuided(
    'gratitude',
    'Gratitud Profunda',
    'Agradece a la existencia por todo',
    'La gratitud no es un gesto, es una forma de ser. Cuando agradeces profundamente, todo en tu vida se transforma. Esta práctica te lleva a experimentar gratitud no como concepto, sino como vivencia. Agradece a la vida, al universo, a cada célula de tu cuerpo por el milagro de la existencia.',
    'prayer', 'prayer', '#FF2222', 'linear-gradient(135deg, #FF2222 0%, #7A0000 100%)',
    [
      { text: 'Lleva tus manos al corazón. Siente su calor y su latido.', duration: 10, type: 'instruction' },
      { text: 'Agradece a tu corazón, que late incansablemente desde antes de que nacieras.', duration: 10, type: 'instruction' },
    ],
    [
      { text: 'Agradece a tus pulmones por cada respiración que te regalan.', textEn: 'Thank your lungs for every breath they give you.', duration: 10, type: 'silence' },
      { text: 'Agradece a tus ojos por todo lo que te permiten ver.', textEn: 'Thank your eyes for everything they allow you to see.', duration: 10, type: 'silence' },
      { text: 'Agradece a tus oídos por los sonidos que te conectan con el mundo.', textEn: 'Thank your ears for the sounds that connect you to the world.', duration: 10, type: 'silence' },
      { text: 'Agradece a tus pies que te sostienen día tras día.', textEn: 'Thank your feet that support you day after day.', duration: 10, type: 'silence' },
      { text: 'Agradece al sol, al aire, al agua, a la tierra que te sustentan.', textEn: 'Thank the sun, the air, the water, the earth that sustain you.', duration: 12, type: 'silence' },
      { text: 'Agradece a cada persona que ha cruzado tu camino y te ha enseñado algo.', textEn: 'Thank every person who has crossed your path and taught you something.', duration: 12, type: 'silence' },
      { text: 'Agradece a la existencia misma por el milagro de estar aquí, ahora.', textEn: 'Thank existence itself for the miracle of being here, now.', duration: 15, type: 'silence' },
    ],
    [
      { text: 'Permite que la gratitud te inunde por completo. No hay nada más que hacer.', duration: 15, type: 'instruction' },
    ],
    3,
    {
      titleEn: 'Deep Gratitude',
      subtitleEn: 'Thank existence for everything',
      descriptionEn: 'Gratitude is not a gesture, it is a way of being. When you are deeply grateful, everything in your life transforms. This practice takes you to experience gratitude not as a concept, but as a lived experience. Thank life, the universe, every cell of your body for the miracle of existence.',
      youtubeId: 'rn79vE7WzTg',
      breathLabelEn: 'Preparation',
      introStepsEn: [
        { text: 'Bring your hands to your heart. Feel its warmth and its beat.', duration: 10, type: 'instruction' },
        { text: 'Thank your heart, which has been beating tirelessly since before you were born.', duration: 10, type: 'instruction' },
      ],
      closeStepsEn: [
        { text: 'Allow gratitude to wash over you completely. There is nothing else to do.', duration: 15, type: 'instruction' },
      ],
      pointsRequired: 5,
    }
  ),
  buildGuided(
    'inner-silence',
    'Silencio Interior',
    'Más allá del sonido está la paz',
    'En lo más profundo de tu ser existe un espacio de silencio absoluto. Un lugar donde ningún pensamiento, emoción o sonido externo puede alcanzarte. Esta práctica te guía hacia ese santuario interior. No hay mantra, no hay instrucción — solo silencio. El silencio es el lenguaje más elevado.',
    'cosmos', 'cosmos', '#CC0000', 'linear-gradient(135deg, #CC0000 0%, #4A0000 100%)',
    [
      { text: 'Inhala profundamente. Al exhalar, suelta todo: pensamientos, tensiones, expectativas.', duration: 10, type: 'instruction' },
      { text: 'Deja atrás el mundo exterior. No hay nada que hacer, ningún lugar al que ir.', duration: 10, type: 'instruction' },
    ],
    [
      { text: 'Silencio...', textEn: 'Silence...', duration: 20, type: 'silence' },
      { text: 'Silencio profundo...', textEn: 'Deep silence...', duration: 20, type: 'silence' },
      { text: 'Más allá del silencio...', textEn: 'Beyond silence...', duration: 20, type: 'silence' },
    ],
    [
      { text: 'Ese silencio no está fuera de ti. Eres tú.', duration: 10, type: 'instruction' },
      { text: 'Lleva este silencio contigo al abrir los ojos.', duration: 10, type: 'instruction' },
    ],
    8,
    {
      titleEn: 'Inner Silence',
      subtitleEn: 'Beyond sound lies peace',
      descriptionEn: 'In the deepest part of your being there is a space of absolute silence. A place where no thought, emotion, or external sound can reach you. This practice guides you to that inner sanctuary. No mantra, no instruction — only silence. Silence is the highest language.',
      breathLabelEn: 'Preparation',
      introStepsEn: [
        { text: 'Breathe in deeply. As you exhale, let go of everything: thoughts, tensions, expectations.', duration: 10, type: 'instruction' },
        { text: 'Leave the outer world behind. There is nothing to do, nowhere to go.', duration: 10, type: 'instruction' },
      ],
      closeStepsEn: [
        { text: 'That silence is not outside of you. It is you.', duration: 10, type: 'instruction' },
        { text: 'Carry this silence with you when you open your eyes.', duration: 10, type: 'instruction' },
      ],
      pointsRequired: 7,
    }
  ),

  {
    id: 'isha-kriya',
    title: 'Isha Kriya',
    titleEn: 'Isha Kriya',
    subtitle: 'Meditación guiada de 15 minutos',
    subtitleEn: '15-minute guided meditation',
    description: 'Isha Kriya es una poderosa meditación guiada de 15 minutos para la salud y el bienestar. A través de esta práctica aprenderás a usar tu respiración, pensamiento y conciencia de una manera que mejora enormemente tu capacidad para usar tu mente y cuerpo.',
    descriptionEn: 'Isha Kriya is a powerful 15-minute guided meditation for health and well-being. Through this practice you will learn to use your breath, thought, and awareness in a way that greatly enhances your ability to use your mind and body.',
    icon: 'candle',
    iconType: 'candle',
    color: '#8B0000',
    gradient: 'linear-gradient(135deg, #8B0000 0%, #3A0000 100%)',
    duration: 900,
    youtubeId: 'Z5zPYuZuwlk',
    youtubeIdEn: 'EwQkfoKxRvo',
    isVideo: true,
    videoDuration: 900,
    videoStartEn: 248,
    pointsRequired: 10,
    steps: [
      { text: 'Busca un lugar tranquilo donde no te interrumpan. Siéntate en una postura cómoda pero erguida.', textEn: 'Find a quiet place where you won\'t be disturbed. Sit in a comfortable but upright posture.', duration: 15, type: 'instruction' },
      { text: 'Toma tres respiraciones profundas para prepararte para esta práctica.', textEn: 'Take three deep breaths to prepare for this practice.', duration: 10, type: 'instruction' },
      { text: 'A continuación, reproduciremos el video guía. Solo sigue las instrucciones.', textEn: 'Next, we will play the guided video. Just follow the instructions.', duration: 5, type: 'instruction' },
      { text: 'Reproduciendo Isha Kriya — Sigue la guía de Sadhguru', textEn: 'Playing Isha Kriya — Follow Sadhguru\'s guidance', duration: 900, type: 'video' },
      { text: 'La práctica ha terminado. Siéntate en silencio por un momento y observa cómo te sientes.', textEn: 'The practice has ended. Sit in silence for a moment and observe how you feel.', duration: 20, type: 'silence' },
      { text: 'Lleva esta experiencia contigo durante el resto del día.', textEn: 'Carry this experience with you throughout the rest of the day.', duration: 10, type: 'instruction' },
    ],
  },
  {
    id: 'miracle-of-mind',
    title: 'Miracle of Mind',
    titleEn: 'Miracle of Mind',
    subtitle: 'Meditación guiada de 12 minutos',
    subtitleEn: '12-minute guided meditation',
    description: 'Una poderosa meditación guiada diseñada por Sadhguru. Solo toma 12 minutos al día. Con instrucciones claras paso a paso y suaves campanillas, esta práctica establece una base sólida para el bienestar mental. Perfecta para principiantes y práctica diaria.',
    descriptionEn: 'A powerful guided meditation designed by Sadhguru. It takes only 12 minutes a day. With clear step-by-step instructions and gentle bells, this practice establishes a solid foundation for mental well-being. Perfect for beginners and daily practice.',
    icon: 'om',
    iconType: 'om',
    color: '#CC0000',
    gradient: 'linear-gradient(135deg, #CC0000 0%, #4A0000 100%)',
    duration: 720,
    youtubeId: 'Z5zPYuZuwlk',
    youtubeIdEn: 'EwQkfoKxRvo',
    isVideo: true,
    videoStart: 0,
    videoStartEn: 248,
    pointsRequired: 0,
    steps: [
      { text: 'Busca un lugar tranquilo. Siéntate erguido pero relajado. Cierra los ojos suavemente.', textEn: 'Find a quiet place. Sit upright but relaxed. Gently close your eyes.', duration: 10, type: 'instruction' },
      { text: 'Toma tres respiraciones profundas para soltar el día.', textEn: 'Take three deep breaths to let go of the day.', duration: 10, type: 'instruction' },
      { text: 'Inhala profundamente', textEn: 'Breathe in deeply', duration: 5, type: 'inhale' },
      { text: 'Sostén la respiración', textEn: 'Hold your breath', duration: 3, type: 'hold' },
      { text: 'Exhala lentamente', textEn: 'Breathe out slowly', duration: 7, type: 'exhale' },
      { text: 'Lleva tu atención al centro de tu pecho. Siente tu corazón latir.', textEn: 'Bring your attention to the center of your chest. Feel your heart beating.', duration: 15, type: 'instruction' },
      { text: 'Visualiza una luz suave en el centro de tu pecho que se expande con cada respiración.', textEn: 'Visualize a soft light in the center of your chest expanding with each breath.', duration: 20, type: 'instruction' },
      { text: 'Esa luz eres tú. Permanece en ella.', textEn: 'That light is you. Rest in it.', duration: 30, type: 'silence' },
      { text: 'Inhala profundamente', textEn: 'Breathe in deeply', duration: 5, type: 'inhale' },
      { text: 'Sostén', textEn: 'Hold', duration: 3, type: 'hold' },
      { text: 'Exhala lentamente', textEn: 'Breathe out slowly', duration: 7, type: 'exhale' },
      { text: 'Observa tu respiración natural. Sin control, solo observa.', textEn: 'Observe your natural breath. Without control, just observe.', duration: 30, type: 'silence' },
      { text: 'Cada inhalación trae energía nueva. Cada exhalación libera tensión.', textEn: 'Each inhale brings new energy. Each exhale releases tension.', duration: 20, type: 'instruction' },
      { text: 'Descansa en la conciencia de tu propia existencia.', textEn: 'Rest in the awareness of your own existence.', duration: 40, type: 'silence' },
      { text: 'Inhala profundamente', textEn: 'Breathe in deeply', duration: 5, type: 'inhale' },
      { text: 'Sostén', textEn: 'Hold', duration: 3, type: 'hold' },
      { text: 'Exhala lentamente', textEn: 'Breathe out slowly', duration: 7, type: 'exhale' },
      { text: 'Poco a poco, trae tu conciencia de vuelta al espacio que te rodea.', textEn: 'Slowly bring your awareness back to the space around you.', duration: 10, type: 'instruction' },
      { text: 'Mueve suavemente tus dedos de las manos y los pies.', textEn: 'Gently move your fingers and toes.', duration: 8, type: 'instruction' },
      { text: 'Cuando te sientas listo, abre suavemente los ojos.', textEn: 'When you feel ready, gently open your eyes.', duration: 5, type: 'instruction' },
      { text: 'Lleva esta paz contigo durante el resto del día.', textEn: 'Carry this peace with you throughout the rest of the day.', duration: 5, type: 'instruction' },
    ],
  },
  {
    id: 'nada-yoga',
    title: 'Nada Yoga',
    titleEn: 'Nada Yoga',
    subtitle: 'El yoga del sonido interior',
    subtitleEn: 'The yoga of inner sound',
    description: 'Nada Yoga es la ciencia de usar el sonido y la vibración para trascender los límites del ser. El sonido no es solo un medio de comunicación, es un puente hacia el infinito. A través del canto de AUM y la escucha profunda del sonido interior, esta práctica te lleva más allá del ruido mental hacia la paz interior.',
    descriptionEn: 'Nada Yoga is the science of using sound and vibration to transcend the limits of being. Sound is not just a means of communication, it is a bridge to the infinite. Through AUM chanting and deep listening of the inner sound, this practice takes you beyond mental noise toward inner peace.',
    icon: 'bell',
    iconType: 'bell',
    color: '#CC0000',
    gradient: 'linear-gradient(135deg, #CC0000 0%, #2A0000 100%)',
    duration: 720,
    youtubeId: 'ga3iCb360_I',
    youtubeIdEn: 'Ug8OoFAFfZ0',
    isVideo: true,
    videoDuration: 600,
    videoStartEn: 0,
    pointsRequired: 0,
    steps: [
      { text: 'Siéntate erguido con la columna recta. Cierra los ojos suavemente.', textEn: 'Sit upright with your spine straight. Gently close your eyes.', duration: 15, type: 'instruction' },
      { text: 'Toma tres respiraciones profundas para conectar contigo mismo.', textEn: 'Take three deep breaths to connect with yourself.', duration: 12, type: 'instruction' },
      { text: 'Inhala profundamente. Al exhalar, entona AUM...', textEn: 'Breathe in deeply. As you exhale, intone AUM...', duration: 8, type: 'mantra' },
      { text: 'Escucha el silencio después del sonido. Ahí está la verdadera práctica.', textEn: 'Listen to the silence after the sound. That is where the real practice lies.', duration: 20, type: 'instruction' },
      { text: 'Reproduciendo Nada Yoga — Sigue la guía de Sadhguru', textEn: 'Playing Nada Yoga — Follow Sadhguru\'s guidance', duration: 600, type: 'video' },
      { text: 'Inhala profundamente', textEn: 'Breathe in deeply', duration: 4, type: 'inhale' },
      { text: 'Sostén', textEn: 'Hold', duration: 2, type: 'hold' },
      { text: 'Exhala', textEn: 'Breathe out', duration: 6, type: 'exhale' },
      { text: 'Hay un sonido que no necesita ser producido. Solo escuchado.', textEn: 'There is a sound that does not need to be produced. Only listened to.', duration: 20, type: 'instruction' },
      { text: 'Permanece en la escucha profunda...', textEn: 'Remain in deep listening...', duration: 40, type: 'silence' },
      { text: 'El sonido y el silencio son uno. Lleva esta conciencia contigo.', textEn: 'Sound and silence are one. Carry this awareness with you.', duration: 10, type: 'instruction' },
    ],
  },
  {
    id: 'yoga-namaskar',
    title: 'Yoga Namaskar',
    titleEn: 'Yoga Namaskar',
    subtitle: 'Rutina matutina de 10 minutos',
    subtitleEn: '10-minute morning routine',
    description: 'Yoga Namaskar es una secuencia completa de 10 minutos para estirar y fortalecer la espalda. Esta poderosa práctica matutina activa la región lumbar de la columna y fortalece los músculos a lo largo de ella. Ideal para principiantes, puede hacerse en casa, en la oficina o en el parque.',
    descriptionEn: 'Yoga Namaskar is a complete 10-minute sequence to stretch and strengthen the back. This powerful morning practice activates the lumbar region of the spine and strengthens the muscles along it. Ideal for beginners, it can be done at home, at the office, or in the park.',
    icon: 'sunrise',
    iconType: 'sunrise',
    color: '#CC0000',
    gradient: 'linear-gradient(135deg, #CC0000 0%, #4A0000 100%)',
    duration: 600,
    youtubeId: '6Lc7h07iB28',
    isVideo: true,
    videoDuration: 600,
    premium: true,
    pointsRequired: 999,
    steps: [
      { text: 'Busca un espacio donde puedas moverte libremente. Usa ropa cómoda.', textEn: 'Find a space where you can move freely. Wear comfortable clothes.', duration: 10, type: 'instruction' },
      { text: 'Párate erguido, pies juntos, manos a los lados. Respira profundamente.', textEn: 'Stand upright, feet together, hands at your sides. Breathe deeply.', duration: 10, type: 'instruction' },
      { text: 'Vamos a seguir la práctica guiada en video. Sigue las instrucciones al ritmo de tu cuerpo.', textEn: 'We will follow the guided practice on video. Follow the instructions at your own pace.', duration: 5, type: 'instruction' },
      { text: 'Reproduciendo Yoga Namaskar — Sigue la práctica', textEn: 'Playing Yoga Namaskar — Follow along', duration: 600, type: 'video' },
      { text: 'Siéntate o recuéstate un momento. Siente la energía en tu columna.', textEn: 'Sit or lie down for a moment. Feel the energy in your spine.', duration: 20, type: 'silence' },
      { text: 'Lleva esta vitalidad contigo para el resto de tu día.', textEn: 'Carry this vitality with you for the rest of the day.', duration: 10, type: 'instruction' },
    ],
  },
  {
    id: 'nadi-shuddhi',
    title: 'Nadi Shuddhi',
    titleEn: 'Nadi Shuddhi',
    subtitle: 'Limpieza de los canales energéticos',
    subtitleEn: 'Cleansing of the energy channels',
    description: 'Nadi Shuddhi es una práctica simple pero poderosa de 5 minutos que limpia los nadis, los canales por los que fluye la energía pránica. Esta práctica resulta en un sistema equilibrado y bienestar psicológico. Guiada por Sadhguru.',
    descriptionEn: 'Nadi Shuddhi is a simple yet powerful 5-minute practice that cleanses the nadis, the channels through which pranic energy flows. This practice results in a balanced system and psychological well-being. Guided by Sadhguru.',
    icon: 'wind',
    iconType: 'wind',
    color: '#CC0000',
    gradient: 'linear-gradient(135deg, #CC0000 0%, #6B0000 100%)',
    duration: 300,
    youtubeId: 'zrPg7oIJHvM',
    youtubeIdEn: 'q5m6tMjcF8k',
    isVideo: true,
    videoDuration: 300,
    videoStartEn: 0,
    steps: [
      { text: 'Busca un lugar tranquilo. Siéntate erguido con la columna recta.', textEn: 'Find a quiet place. Sit upright with your spine straight.', duration: 10, type: 'instruction' },
      { text: 'Toma tres respiraciones profundas para prepararte.', textEn: 'Take three deep breaths to prepare.', duration: 8, type: 'instruction' },
      { text: 'Reproduciendo Nadi Shuddhi — Sigue la guía de Sadhguru', textEn: 'Playing Nadi Shuddhi — Follow Sadhguru\'s guidance', duration: 300, type: 'video' },
      { text: 'Siéntate en silencio por un momento. Siente el flujo de energía en tu sistema.', textEn: 'Sit in silence for a moment. Feel the flow of energy in your system.', duration: 15, type: 'silence' },
      { text: 'Lleva esta ligereza contigo durante el resto del día.', textEn: 'Carry this lightness with you throughout the rest of the day.', duration: 8, type: 'instruction' },
    ],
  },
  {
    id: 'chit-shakti-salud',
    title: 'Chit Shakti para la Salud',
    titleEn: 'Chit Shakti for Health',
    subtitle: 'Meditación guiada gratuita',
    subtitleEn: 'Free guided meditation',
    description: 'Chit Shakti es una poderosa meditación guiada que utiliza el poder de la mente para crear tu realidad. Esta práctica está diseñada para la salud y el bienestar. A través de afirmaciones y visualización guiada por Sadhguru, activa la energía curativa dentro de ti.',
    descriptionEn: 'Chit Shakti is a powerful guided meditation that uses the power of the mind to create your reality. This practice is designed for health and well-being. Through affirmations and guided visualization by Sadhguru, activate the healing energy within you.',
    icon: 'candle', iconType: 'candle',
    color: '#CC0000', gradient: 'linear-gradient(135deg, #CC0000 0%, #2A6B00 100%)',
    duration: 660,
    youtubeId: '3Ago2LOCGbE',
    youtubeIdEn: 'SqbQ1QrxhB4',
    isVideo: true,
    videoDuration: 660,
    premium: false,
    pointsRequired: 5,
    steps: [
      { text: 'Busca un lugar tranquilo. Siéntate erguido pero relajado. Cierra los ojos suavemente.', textEn: 'Find a quiet place. Sit upright but relaxed. Gently close your eyes.', duration: 10, type: 'instruction' },
      { text: 'Toma tres respiraciones profundas para soltar el día.', textEn: 'Take three deep breaths to let go of the day.', duration: 10, type: 'instruction' },
      { text: 'Reproduciendo Chit Shakti para la Salud — Sigue la guía de Sadhguru', textEn: 'Playing Chit Shakti for Health — Follow Sadhguru\'s guidance', duration: 660, type: 'video' },
      { text: 'La práctica ha terminado. Siéntate en silencio por un momento.', textEn: 'The practice has ended. Sit in silence for a moment.', duration: 15, type: 'silence' },
      { text: 'Lleva esta energía contigo durante el resto del día.', textEn: 'Carry this energy with you throughout the rest of the day.', duration: 10, type: 'instruction' },
    ],
  },
  {
    id: 'chit-shakti-amor',
    title: 'Chit Shakti para el Amor',
    titleEn: 'Chit Shakti for Love',
    subtitle: 'Meditación guiada gratuita',
    subtitleEn: 'Free guided meditation',
    description: 'Chit Shakti es una poderosa meditación guiada que utiliza el poder de la mente para crear tu realidad. Esta práctica está diseñada para abrir tu corazón al amor en todas sus formas. Guiada por Sadhguru, utiliza afirmaciones y visualización para cultivar el amor y la compasión.',
    descriptionEn: 'Chit Shakti is a powerful guided meditation that uses the power of the mind to create your reality. This practice is designed to open your heart to love in all its forms. Guided by Sadhguru, it uses affirmations and visualization to cultivate love and compassion.',
    icon: 'prayer', iconType: 'prayer',
    color: '#CC0000', gradient: 'linear-gradient(135deg, #CC0000 0%, #6B006B 100%)',
    duration: 660,
    youtubeId: '1e7hTyHXnXw',
    youtubeIdEn: 'Kd6DkSM6QHo',
    isVideo: true,
    videoDuration: 660,
    premium: false,
    pointsRequired: 5,
    steps: [
      { text: 'Busca un lugar tranquilo. Siéntate erguido pero relajado. Cierra los ojos suavemente.', textEn: 'Find a quiet place. Sit upright but relaxed. Gently close your eyes.', duration: 10, type: 'instruction' },
      { text: 'Toma tres respiraciones profundas para conectar con tu corazón.', textEn: 'Take three deep breaths to connect with your heart.', duration: 10, type: 'instruction' },
      { text: 'Reproduciendo Chit Shakti para el Amor — Sigue la guía de Sadhguru', textEn: 'Playing Chit Shakti for Love — Follow Sadhguru\'s guidance', duration: 660, type: 'video' },
      { text: 'La práctica ha terminado. Siente el amor en tu corazón.', textEn: 'The practice has ended. Feel the love in your heart.', duration: 15, type: 'silence' },
      { text: 'Lleva este amor contigo durante el resto del día.', textEn: 'Carry this love with you throughout the rest of the day.', duration: 10, type: 'instruction' },
    ],
  },
  {
    id: 'no-soy-el-cuerpo',
    title: 'No soy el Cuerpo — Tampoco soy la Mente',
    titleEn: 'I am not the Body — Neither am I the Mind',
    subtitle: '7 minutos para recordar tu verdadera naturaleza',
    subtitleEn: '7 minutes to remember your true nature',
    description: 'Una meditación profunda basada en la enseñanza advaita. Al afirmar "No soy el Cuerpo" en la inhalación y "Tampoco soy la Mente" en la exhalación, trasciendes las identificaciones limitantes y despiertas a tu verdadera esencia.',
    descriptionEn: 'A deep meditation based on advaita teaching. By affirming "I am not the Body" on the inhale and "Neither am I the Mind" on the exhale, you transcend limiting identifications and awaken to your true essence.',
    icon: 'om', iconType: 'om',
    color: '#CC0000',
    gradient: 'linear-gradient(135deg, #CC0000 0%, #4A0000 100%)',
    duration: 420,
    premium: false,
    pointsRequired: 22,
    steps: [
      { text: 'Busca un lugar tranquilo. Siéntate erguido pero relajado. Cierra los ojos suavemente.', textEn: 'Find a quiet place. Sit upright but relaxed. Gently close your eyes.', duration: 10, type: 'instruction' },
      { text: 'Toma tres respiraciones profundas para soltar el día.', textEn: 'Take three deep breaths to let go of the day.', duration: 8, type: 'instruction' },
      { text: 'Inhala profundamente', textEn: 'Breathe in deeply', duration: 3, type: 'inhale' },
      { text: 'Relájate en la exhalación', textEn: 'Relax on the exhale', duration: 3, type: 'exhale' },
      { text: 'Inhala profundamente', textEn: 'Breathe in deeply', duration: 3, type: 'inhale' },
      { text: 'Relájate en la exhalación', textEn: 'Relax on the exhale', duration: 3, type: 'exhale' },
      { text: 'Inhala profundamente', textEn: 'Breathe in deeply', duration: 3, type: 'inhale' },
      { text: 'Relájate en la exhalación', textEn: 'Relax on the exhale', duration: 3, type: 'exhale' },
      ...(() => {
        const s: MeditationStep[] = [];
        for (let i = 0; i < 37; i++) {
          s.push({ text: 'No soy el Cuerpo', textEn: 'I am not the Body', duration: 4, type: 'inhale' });
          s.push({ text: 'Tampoco soy la mente', textEn: 'Neither am I the Mind', duration: 6, type: 'exhale' });
        }
        return s;
      })(),
      { text: 'Poco a poco, trae tu conciencia de vuelta al espacio que te rodea.', textEn: 'Slowly bring your awareness back to the space around you.', duration: 8, type: 'instruction' },
      { text: 'Cuando te sientas listo, abre suavemente los ojos.', textEn: 'When you feel ready, gently open your eyes.', duration: 5, type: 'instruction' },
    ],
  },
  {
    id: 'yoga-exito',
    title: 'Yoga para el Éxito',
    titleEn: 'Yoga for Success',
    subtitle: '5 minutos',
    subtitleEn: '5 minutes',
    description: 'Una práctica corta de yoga guiada por Sadhguru para activar la energía del éxito en tu sistema. En solo 5 minutos, alinea tu cuerpo y mente para atraer prosperidad y logros.',
    descriptionEn: 'A short yoga practice guided by Sadhguru to activate the energy of success in your system. In just 5 minutes, align your body and mind to attract prosperity and achievements.',
    icon: 'sunrise', iconType: 'sunrise',
    color: '#CC0000', gradient: 'linear-gradient(135deg, #CC0000 0%, #B8860B 100%)',
    duration: 300,
    youtubeId: 'exBqIQCLYrg',
    isVideo: true,
    videoDuration: 300,
    pointsRequired: 3,
    steps: [
      { text: 'Busca un lugar donde puedas moverte libremente.', textEn: 'Find a space where you can move freely.', duration: 10, type: 'instruction' },
      { text: 'Reproduciendo Yoga para el Éxito — Sigue la guía', textEn: 'Playing Yoga for Success — Follow along', duration: 300, type: 'video' },
      { text: 'Toma un momento para sentir la energía en tu cuerpo.', textEn: 'Take a moment to feel the energy in your body.', duration: 15, type: 'silence' },
    ],
  },
  {
    id: 'yoga-espalda',
    title: 'Yoga para el Dolor de Espalda',
    titleEn: 'Yoga for Back Pain',
    subtitle: '10 minutos',
    subtitleEn: '10 minutes',
    description: 'Una práctica de 10 minutos guiada por Sadhguru para aliviar el dolor de espalda. Estira y fortalece la columna con movimientos suaves y conscientes.',
    descriptionEn: 'A 10-minute practice guided by Sadhguru to relieve back pain. Stretch and strengthen your spine with gentle, mindful movements.',
    icon: 'meditate', iconType: 'meditate',
    color: '#CC0000', gradient: 'linear-gradient(135deg, #CC0000 0%, #006B6B 100%)',
    duration: 600,
    youtubeId: '7aMdhUS5j-w',
    isVideo: true,
    videoDuration: 600,
    pointsRequired: 3,
    steps: [
      { text: 'Busca un lugar cómodo para practicar. Usa ropa holgada.', textEn: 'Find a comfortable place to practice. Wear loose clothing.', duration: 10, type: 'instruction' },
      { text: 'Reproduciendo Yoga para la Espalda — Sigue la guía', textEn: 'Playing Yoga for Back Pain — Follow along', duration: 600, type: 'video' },
      { text: 'Recuéstate un momento y siente tu columna liberada.', textEn: 'Lie down for a moment and feel your spine released.', duration: 15, type: 'silence' },
    ],
  },
  {
    id: 'explorar-interior',
    title: 'Explorar tu Interior',
    titleEn: 'Explore Your Inner Self',
    subtitle: '5 minutos',
    subtitleEn: '5 minutes',
    description: 'Una meditación guiada de 5 minutos para explorar tu mundo interior. Sadhguru te conduce a las profundidades de tu ser en este viaje introspectivo.',
    descriptionEn: 'A 5-minute guided meditation to explore your inner world. Sadhguru takes you into the depths of your being on this introspective journey.',
    icon: 'cosmos', iconType: 'cosmos',
    color: '#CC0000', gradient: 'linear-gradient(135deg, #CC0000 0%, #4A0080 100%)',
    duration: 300,
    youtubeId: 'muFLu_ZZXkM',
    isVideo: true,
    videoDuration: 300,
    pointsRequired: 3,
    steps: [
      { text: 'Siéntate erguido y cierra los ojos.', textEn: 'Sit upright and close your eyes.', duration: 10, type: 'instruction' },
      { text: 'Reproduciendo Explorar tu Interior — Sigue la guía', textEn: 'Playing Explore Your Inner Self — Follow along', duration: 300, type: 'video' },
      { text: 'Permanece en silencio un momento. Observa cómo te sientes.', textEn: 'Remain in silence for a moment. Observe how you feel.', duration: 15, type: 'silence' },
    ],
  },
  {
    id: 'isha-upa-yoga',
    title: 'Isha Upa Yoga',
    titleEn: 'Isha Upa Yoga',
    subtitle: 'Prácticas guiadas',
    subtitleEn: 'Guided practices',
    description: 'Una colección de prácticas guiadas de Isha Upa Yoga con Sadhguru. Estas poderosas rutinas están diseñadas para activar las articulaciones, rejuvenecer el sistema y traer salud y bienestar a tu vida.',
    descriptionEn: 'A collection of guided Isha Upa Yoga practices with Sadhguru. These powerful routines are designed to activate the joints, rejuvenate the system, and bring health and well-being to your life.',
    icon: 'candle', iconType: 'candle',
    color: '#CC0000', gradient: 'linear-gradient(135deg, #CC0000 0%, #2A6B00 100%)',
    duration: 1200,
    youtubeId: '8y8fn7gjHxo',
    isVideo: true,
    videoDuration: 1200,
    premium: true,
    pointsRequired: 999,
    steps: [
      { text: 'Prepara un espacio donde puedas moverte con libertad.', textEn: 'Prepare a space where you can move freely.', duration: 10, type: 'instruction' },
      { text: 'Reproduciendo Isha Upa Yoga — Sigue la práctica', textEn: 'Playing Isha Upa Yoga — Follow along', duration: 1200, type: 'video' },
      { text: 'Siéntate en silencio y siente el flujo de energía.', textEn: 'Sit in silence and feel the flow of energy.', duration: 20, type: 'silence' },
    ],
  },
];
