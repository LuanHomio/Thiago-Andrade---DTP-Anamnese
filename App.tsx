import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Section } from './components/Section';
import { Input } from './components/Input';
import { RadioGroup } from './components/RadioGroup';
import { TextArea } from './components/TextArea';
import { FormData, INITIAL_DATA, TrainingFile } from './types';

const EDGE_FUNCTION_URL = "https://uyaemczdotxlvowytwkt.supabase.co/functions/v1/thiago-andrade-anamnese";

function App() {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [treinos, setTreinos] = useState<TrainingFile[]>([]);
  const [nivel, setNivel] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email") || "";
    setEmail(emailParam);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.commitment) {
      alert("Você precisa se comprometer com o desafio para continuar.");
      return;
    }
    if (!email) {
      alert("Link inválido. O email não foi identificado. Peça um novo link ao Thiago.");
      return;
    }
    if (!formData.sex) {
      alert("Por favor, selecione seu sexo para que possamos personalizar seu treino.");
      return;
    }
    if (!formData.trainingFrequency) {
      alert("Por favor, selecione quantos dias por semana consegue treinar.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        email,
        name: formData.name,
        age: formData.age,
        sex: formData.sex,
        height: formData.height,
        waistCircumference: formData.waistCircumference,
        lowerAbdomen: formData.lowerAbdomen,
        hip: formData.hip,
        weight: formData.weight,
        trainingStatus: formData.trainingStatus,
        trainingLocation: formData.trainingLocation,
        trainingFrequency: formData.trainingFrequency,
        dietQuality: formData.dietQuality,
        dietDifficulty: formData.dietDifficulty,
        sleepHours: formData.sleepHours,
        waterIntake: formData.waterIntake,
        motivation: formData.motivation,
      };

      const res = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao enviar ficha. Tente novamente.");
      }

      setTreinos(data.treinos || []);
      setNivel(data.nivel || "");
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error("Erro ao enviar:", err);
      setError(err.message || "Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const nivelLabel = nivel === "iniciante" ? "Iniciante (3x/semana)"
      : nivel === "intermediario" ? "Intermediário (4x/semana)"
      : "Avançado (5x+/semana)";

    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black mb-4">
          Ficha enviada com sucesso!
        </h1>
        <p className="text-lg text-brand-darkGrey mb-2">
          Seu n{"í"}vel: <span className="font-bold text-brand-red">{nivelLabel}</span>
        </p>
        <p className="text-brand-darkGrey mb-8">
          Aqui est{"ã"}o seus treinos personalizados. Baixe todos!
        </p>

        <div className="w-full max-w-md space-y-3 mb-8">
          {treinos.map((treino, i) => (
            <a
              key={i}
              href={treino.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-4 bg-gray-50 border border-brand-lightGrey rounded-lg hover:bg-red-50 hover:border-brand-red transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="font-medium text-brand-black group-hover:text-brand-red transition-colors">
                  {treino.name}
                </span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-brand-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          ))}
        </div>

        <p className="text-sm text-gray-400">
          Agora {"é"} hora de come{"ç"}ar. Bora!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-brand-black">
      <header className="bg-brand-black text-white py-8 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">
            DESAFIO <span className="text-brand-red">TCHAU PAN{"Ç"}A</span>
          </h1>
          <p className="text-gray-400 font-medium tracking-wide text-sm md:text-base uppercase">
            Ficha de Anamnese Inicial
          </p>
          {email && (
            <p className="text-gray-500 text-xs mt-2">
              Preenchendo para: <span className="text-gray-300">{email}</span>
            </p>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {!email && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-8 text-center">
            <p className="text-yellow-800 font-medium">
              Link inv{"á"}lido. O email n{"ã"}o foi identificado na URL.
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              Pe{"ç"}a um novo link de acesso ao Thiago.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">

          <Section
            title="Dados Básicos"
            description="Esses dados ajudam você a se reconhecer no processo. Não é nada clínico."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            }
          >
            <Input
              name="name"
              label="Nome completo"
              placeholder="Digite seu nome"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="age"
                label="Idade"
                type="number"
                placeholder="Ex: 30"
                value={formData.age}
                onChange={handleChange}
              />
              <div className="w-full">
                <label className="block text-brand-black font-medium mb-1">Sexo <span className="text-brand-red">*</span></label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  required
                  className="w-full p-4 bg-gray-50 border border-brand-lightGrey rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent appearance-none"
                >
                  <option value="">Selecione</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                </select>
              </div>
            </div>
            <Input
              name="height"
              label="Altura (cm)"
              type="number"
              placeholder="Ex: 170"
              value={formData.height}
              onChange={handleChange}
            />
          </Section>

          <Section
            title="Medidas Corporais"
            description="A fita métrica é mais importante que a balança. Sempre meça no mesmo ponto, de preferência na altura do umbigo."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 6H3"/><path d="M10 12H3"/><path d="M10 18H3"/><circle cx="17" cy="15" r="3"/><path d="m21 19-1.9-1.9"/></svg>
            }
          >
            <Input
              name="waistCircumference"
              label="Circunferência da cintura (cm)"
              placeholder="Ex: 80"
              type="number"
              value={formData.waistCircumference}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="lowerAbdomen"
                label="Abdômen inferior (cm)"
                placeholder="Opcional"
                type="number"
                value={formData.lowerAbdomen}
                onChange={handleChange}
              />
              <Input
                name="hip"
                label="Quadril (cm)"
                placeholder="Opcional"
                type="number"
                value={formData.hip}
                onChange={handleChange}
              />
            </div>
            <Input
              name="weight"
              label="Peso atual (kg)"
              placeholder="Opcional"
              type="number"
              value={formData.weight}
              onChange={handleChange}
            />
          </Section>

          <Section
            title="Fotos de Início"
            description="Recomendado, mas opcional. Use roupa similar, mesmo local e sem pose."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input name="photoFront" label="Foto de frente" type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100"/>
              <Input name="photoSide" label="Foto de lado" type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100"/>
              <Input name="photoBack" label="Foto de costas" type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100"/>
            </div>
          </Section>

          <Section
            title="Rotina Atual"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            }
          >
            <RadioGroup
              label="Você treina atualmente?"
              name="trainingStatus"
              value={formData.trainingStatus}
              onChange={handleChange}
              options={[
                { label: 'Não treino', value: 'nao_treino' },
                { label: 'Treino às vezes', value: 'treino_as_vezes' },
                { label: 'Treino com frequência', value: 'treino_frequencia' }
              ]}
            />
            <RadioGroup
              label="Onde pretende treinar?"
              name="trainingLocation"
              value={formData.trainingLocation}
              onChange={handleChange}
              options={[
                { label: 'Em casa', value: 'casa' },
                { label: 'Academia', value: 'academia' },
                { label: 'Os dois', value: 'os_dois' }
              ]}
            />
            <RadioGroup
              label="Quantos dias por semana consegue treinar?"
              name="trainingFrequency"
              value={formData.trainingFrequency}
              onChange={handleChange}
              required
              options={[
                { label: '2-3', value: '2-3' },
                { label: '4-5', value: '4-5' },
                { label: '6+', value: '6+' }
              ]}
            />
          </Section>

          <Section
            title="Alimentação Atual"
            description="Aqui não existe julgamento. É só pra você ter clareza."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
            }
          >
            <RadioGroup
              label="Como você avalia sua alimentação hoje?"
              name="dietQuality"
              value={formData.dietQuality}
              onChange={handleChange}
              options={[
                { label: 'Desorganizada', value: 'desorganizada' },
                { label: 'Mais ou menos', value: 'mais_ou_menos' },
                { label: 'Já tento cuidar', value: 'ja_tento_cuidar' }
              ]}
            />
            <RadioGroup
              label="Principal dificuldade com alimentação"
              name="dietDifficulty"
              value={formData.dietDifficulty}
              onChange={handleChange}
              options={[
                { label: 'Falta de rotina', value: 'falta_rotina' },
                { label: 'Excesso de beliscos', value: 'excesso_beliscos' },
                { label: 'Falta de tempo', value: 'falta_tempo' },
                { label: 'Ansiedade', value: 'ansiedade' },
                { label: 'Outro', value: 'outro' }
              ]}
            />
          </Section>

          <Section
            title="Sono e Água"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            }
          >
            <RadioGroup
              label="Horas de sono por noite"
              name="sleepHours"
              value={formData.sleepHours}
              onChange={handleChange}
              options={[
                { label: 'Menos de 6', value: 'menos_6' },
                { label: '6-7', value: '6-7' },
                { label: '7+', value: '7+' }
              ]}
            />
            <RadioGroup
              label="Consumo diário de água"
              name="waterIntake"
              value={formData.waterIntake}
              onChange={handleChange}
              options={[
                { label: 'Menos de 1L', value: 'menos_1l' },
                { label: '1-2L', value: '1-2l' },
                { label: 'Mais de 2L', value: 'mais_2l' }
              ]}
            />
          </Section>

          <Section
            title="Objetivo Pessoal"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            }
          >
            <TextArea
              name="motivation"
              label="Qual o principal motivo que te fez entrar no Desafio Tchau Pança?"
              subLabel="Esse campo é importante para seu acompanhamento."
              value={formData.motivation}
              onChange={handleChange}
            />
          </Section>

          <div className="bg-gray-50 p-6 rounded-xl border border-brand-lightGrey mb-8">
            <h3 className="font-display font-bold text-lg mb-4 text-brand-black">Compromisso</h3>
            <label className="flex items-start cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="commitment"
                  checked={formData.commitment}
                  onChange={handleChange}
                  required
                  className="w-6 h-6 border-2 border-brand-black rounded focus:ring-brand-red text-brand-red cursor-pointer"
                />
              </div>
              <span className="ml-3 text-brand-darkGrey leading-tight group-hover:text-brand-black transition-colors">
                Me comprometo a seguir o plano do Desafio Tchau Pan{"ç"}a pelos pr{"ó"}ximos 21 dias e fazer o meu melhor. <span className="text-brand-red">*</span>
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center mb-4">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="pt-4 pb-12 text-center">
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full md:w-auto md:min-w-[300px] bg-brand-red hover:bg-red-700 text-white font-display font-bold text-lg py-5 px-8 rounded-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  ENVIANDO...
                </span>
              ) : (
                "ENVIAR FICHA INICIAL"
              )}
            </button>
          </div>

        </form>
      </main>

      <footer className="py-8 text-center text-gray-400 text-sm border-t border-brand-lightGrey">
        <p>{"©"} 2025 Desafio Tchau Pan{"ç"}a. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
