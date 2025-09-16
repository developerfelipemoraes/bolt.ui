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
  private currentCompanyId: string | null = null;

  constructor() {
    // Recuperar token do localStorage
    this.token = localStorage.getItem('auth_token');
    
    // Recuperar empresa atual
    const savedCompany = localStorage.getItem('company');
    if (savedCompany) {
      try {
        const company = JSON.parse(savedCompany);
        this.currentCompanyId = company.id;
      } catch (error) {
        console.error('Erro ao carregar empresa:', error);
      }
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'API-Version': 'v1',
      'X-Company-ID': this.currentCompanyId || '',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private addCompanyFilter(endpoint: string): string {
    // Para super admin, não adicionar filtro automático
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.role === 'super_admin') {
          return endpoint;
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      }
    }
    
    // Para outros usuários, adicionar filtro de empresa
    const separator = endpoint.includes('?') ? '&' : '?';
    return `${endpoint}${separator}companyId=${this.currentCompanyId}`;
  }
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const filteredEndpoint = this.addCompanyFilter(endpoint);
      console.log(`🔗 Fazendo requisição para: ${API_BASE_URL}${filteredEndpoint}`);
      console.log(`🏢 Empresa atual: ${this.currentCompanyId}`);
      
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
      
      // Atualizar empresa atual baseada no usuário
      const savedCompany = localStorage.getItem('company');
      if (savedCompany) {
        try {
          const company = JSON.parse(savedCompany);
          this.currentCompanyId = company.id;
        } catch (error) {
          console.error('Erro ao carregar empresa:', error);
        }
      }
      
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  logout(): void {
    this.token = null;
    this.currentCompanyId = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
  }

  updateCompanyContext(companyId: string): void {
    this.currentCompanyId = companyId;
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
    // Adicionar companyId automaticamente
    const companyWithOwner = {
      ...company,
      ownerCompanyId: this.currentCompanyId
    };
    
    const response = await this.request<unknown>('/companies', {
      method: 'POST',
      body: JSON.stringify(companyWithOwner),
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
    // Adicionar companyId automaticamente
    const contactWithCompany = {
      ...contact,
      companyId: this.currentCompanyId
    };
    
    const response = await this.request<unknown>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactWithCompany),
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

  // User management methods
  async getCompanyUsers(): Promise<unknown[]> {
    const response = await this.request<unknown[]>('/users');
    return response.data || [];
  }

  async inviteUser(userData: { email: string; name: string; role: string }): Promise<unknown> {
    const userWithCompany = {
      ...userData,
      companyId: this.currentCompanyId
    };
    
    const response = await this.request<unknown>('/users/invite', {
      method: 'POST',
      body: JSON.stringify(userWithCompany),
    });
    return response.data;
  }

  async updateUserRole(userId: string, role: string): Promise<unknown> {
    const response = await this.request<unknown>(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
    return response.data;
  }
}

export const apiService = new ApiService();
import { useAuth } from '@/components/auth';
export default apiService;