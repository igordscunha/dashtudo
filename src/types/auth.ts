export interface User {
  id: number;
  nome: string;
  sobrenome: string;
  data_nascimento: Date;
  email: string;
  password: string;
  // adicionar outros campos conforme estrutura futuramente...
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}