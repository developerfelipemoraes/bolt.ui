const API_BASE_URL = 'http://localhost:3001/api';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  expiresIn: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Recuperar token do localStorage
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'API-Version': 'v1',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      console.log(`🔗 Fazendo requisição para: ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        mode: 'cors',
        credentials: 'include',
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });
      console.log(`📡 Resposta recebida:`, response.status, response.statusText);

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Erro na requisição',
          message: data.message || data.details?.join(', '),
        };
      }

      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return {
        error: 'Erro de conexão',
        message: 'Não foi possível conectar com o servidor',
      };
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): { id: number; email: string; name: string; role: string } | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Company methods
  async getCompanies(): Promise<unknown[]> {
    const response = await this.request<unknown[]>('/companies');
    return response.data || [];
  }

  async createCompany(company: unknown): Promise<unknown> {
    const response = await this.request<unknown>('/companies', {
      method: 'POST',
      body: JSON.stringify(company),
    });
    return response.data;
  }

  async updateCompany(id: string, company: unknown): Promise<unknown> {
    const response = await this.request<unknown>(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(company),
    });
    return response.data;
  }

  async deleteCompany(id: string): Promise<ApiResponse<void>> {
    return this.request(`/companies/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact methods
  async getContacts(): Promise<unknown[]> {
    const response = await this.request<unknown[]>('/contacts');
    return response.data || [];
  }

  async createContact(contact: unknown): Promise<unknown> {
    const response = await this.request<unknown>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
    return response.data;
  }

  async updateContact(id: string, contact: unknown): Promise<unknown> {
    const response = await this.request<unknown>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contact),
    });
    return response.data;
  }

  async deleteContact(id: string): Promise<ApiResponse<void>> {
    return this.request(`/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // Matching methods
  async getBestMatches(): Promise<ApiResponse<unknown[]>> {
    return this.request('/matching/best-matches');
  }
}

export const apiService = new ApiService();
export default apiService;