const AUTH_API_URL = 'https://auth.bravewave-de2e6ca9.westus2.azurecontainerapps.io/api/auth';
const VEHICLES_API_URL = 'https://vehicles.bravewave-de2e6ca9.westus2.azurecontainerapps.io/api/vehicles';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface VehiclesResponse {
  data: unknown[];
  total: number;
  page: number;
  limit: number;
}

class VehicleEditorApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('vehicle_editor_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return { success: false, error: 'Credenciais inválidas' };
      }

      const data: AuthResponse = await response.json();
      this.token = data.token;
      localStorage.setItem('vehicle_editor_token', data.token);
      localStorage.setItem('vehicle_editor_user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  }

  async getVehicles(page = 1, limit = 20, search?: string): Promise<VehiclesResponse> {
    try {
      let url = `${VEHICLES_API_URL}?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar veículos');
      }

      return await response.json();
    } catch (error) {
      console.error('Get vehicles error:', error);
      return { data: [], total: 0, page: 1, limit };
    }
  }

  async getVehicleBySku(sku: string): Promise<unknown | null> {
    try {
      const response = await fetch(`${VEHICLES_API_URL}/sku/${sku}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Get vehicle by SKU error:', error);
      return null;
    }
  }

  async getVehicleById(id: string): Promise<unknown | null> {
    try {
      const response = await fetch(`${VEHICLES_API_URL}/${id}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Get vehicle by ID error:', error);
      return null;
    }
  }

  async updateVehicle(id: string, data: unknown): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${VEHICLES_API_URL}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Erro ao atualizar veículo' };
      }

      return { success: true };
    } catch (error) {
      console.error('Update vehicle error:', error);
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  }

  async createVehicle(data: unknown): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const response = await fetch(VEHICLES_API_URL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Erro ao criar veículo' };
      }

      const result = await response.json();
      return { success: true, id: result.id };
    } catch (error) {
      console.error('Create vehicle error:', error);
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  }

  async deleteVehicle(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${VEHICLES_API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return { success: false, error: 'Erro ao excluir veículo' };
      }

      return { success: true };
    } catch (error) {
      console.error('Delete vehicle error:', error);
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('vehicle_editor_token');
    localStorage.removeItem('vehicle_editor_user');
  }
}

export const vehicleEditorApi = new VehicleEditorApiService();
