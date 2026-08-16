import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Question {
  question: string;
  options: { label: string; value: string }[];
}

interface QuestionnaireModalProps {
  onClose: () => void;
}

export function QuestionnaireModal({ onClose }: QuestionnaireModalProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const questions: Question[] = [
    {
      question: t('questionnaire.q1'),
      options: [
        { label: t('questionnaire.option.stress'), value: 'stress' },
        { label: t('questionnaire.option.focus'), value: 'focus' },
        { label: t('questionnaire.option.sleep'), value: 'sleep' },
        { label: t('questionnaire.option.growth'), value: 'growth' },
      ],
    },
    {
      question: t('questionnaire.q2'),
      options: [
        { label: t('questionnaire.option.never'), value: 'never' },
        { label: t('questionnaire.option.occasional'), value: 'occasional' },
        { label: t('questionnaire.option.regular'), value: 'regular' },
        { label: t('questionnaire.option.daily'), value: 'daily' },
      ],
    },
    {
      question: t('questionnaire.q3'),
      options: [
        { label: t('questionnaire.option.5min'), value: '5min' },
        { label: t('questionnaire.option.10min'), value: '10min' },
        { label: t('questionnaire.option.15min'), value: '15min' },
        { label: t('questionnaire.option.20min'), value: '20min' },
      ],
    },
    {
      question: t('questionnaire.q4'),
      options: [
        { label: t('questionnaire.option.guided'), value: 'guided' },
        { label: t('questionnaire.option.silence'), value: 'silence' },
        { label: t('questionnaire.option.music'), value: 'music' },
        { label: t('questionnaire.option.nature'), value: 'nature' },
      ],
    },
    {
      question: t('questionnaire.q5'),
      options: [
        { label: t('questionnaire.option.morning'), value: 'morning' },
        { label: t('questionnaire.option.noon'), value: 'noon' },
        { label: t('questionnaire.option.afternoon'), value: 'afternoon' },
        { label: t('questionnaire.option.night'), value: 'night' },
      ],
    },
  ];

  const handleSelect = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      localStorage.setItem('zenflow-profile', JSON.stringify(newAnswers));
      setCompleted(true);
    }
  };

  const handleFinish = () => {
    onClose();
  };

  if (completed) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 28, textAlign: 'center', gap: 24,
      }}>
        <div style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: 'none', borderRadius: 24,
          padding: '40px 32px',
          maxWidth: 360, width: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 20,
          animation: 'scaleInPremium 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--red-400)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem',
        }}>
          ॐ
        </div>
        <h1 style={{ color: 'white', fontSize: '1.6rem', margin: 0 }}>{t('questionnaire.completed')}</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 300, lineHeight: 1.7, fontSize: '0.95rem' }}>
          {t('questionnaire.completedDesc2')}
        </p>
        <button
          onClick={handleFinish}
          style={{
            background: 'var(--red-400)', color: 'white',
            padding: '16px 48px', borderRadius: 50,
            fontSize: '1rem', fontWeight: 700,
            border: 'none', cursor: 'pointer', marginTop: 8,
          }}
        >
          {t('questionnaire.finish')}
        </button>
        </div>
      </div>
    );
  }

  const q = questions[step]!;
  const progress = ((step) / questions.length) * 100;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '20px 20px 60px',
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 16, right: 16, zIndex: 1,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: 'none', color: 'white', fontSize: '1.2rem',
          width: 40, height: 40, borderRadius: '50%',
          cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        ✕
      </button>

      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: 'none', borderRadius: 24,
        padding: '32px 28px',
        maxWidth: 420, width: '100%',
        alignSelf: 'center',
        animation: 'scaleInPremium 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'var(--red-400)',
            borderRadius: 2, transition: 'width 0.5s ease',
          }} />
        </div>
        <p style={{
          color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem',
          marginTop: 8, letterSpacing: '0.08em',
        }}>
          {t('questionnaire.step').toUpperCase()} {step + 1} {t('questionnaire.of')} {questions.length}
        </p>
      </div>

      <h2 style={{
        color: 'white', fontSize: '1.4rem', margin: 0,
        marginBottom: 28, lineHeight: 1.3,
      }}>
        {q.question}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            style={{
              width: '100%', padding: '16px 20px',
              borderRadius: 14,
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text)', fontSize: '1rem', fontWeight: 500,
              cursor: 'pointer', textAlign: 'left',
              transition: '0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--red-400)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}
