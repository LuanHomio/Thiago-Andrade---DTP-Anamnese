export interface FormData {
  // Section 1
  name: string;
  age: string;
  sex: string;
  height: string;

  // Section 2
  waistCircumference: string;
  lowerAbdomen: string;
  hip: string;
  weight: string;

  // Section 3 (Files handled separately)
  photoFront: File | null;
  photoSide: File | null;
  photoBack: File | null;

  // Section 4
  trainingStatus: string;
  trainingLocation: string;
  trainingFrequency: string;

  // Section 5
  dietQuality: string;
  dietDifficulty: string;

  // Section 6
  sleepHours: string;
  waterIntake: string;

  // Section 7
  motivation: string;

  // Section 8
  commitment: boolean;
}

export const INITIAL_DATA: FormData = {
  name: '',
  age: '',
  sex: '',
  height: '',
  waistCircumference: '',
  lowerAbdomen: '',
  hip: '',
  weight: '',
  photoFront: null,
  photoSide: null,
  photoBack: null,
  trainingStatus: '',
  trainingLocation: '',
  trainingFrequency: '',
  dietQuality: '',
  dietDifficulty: '',
  sleepHours: '',
  waterIntake: '',
  motivation: '',
  commitment: false,
};

export interface TrainingFile {
  name: string;
  url: string;
}
