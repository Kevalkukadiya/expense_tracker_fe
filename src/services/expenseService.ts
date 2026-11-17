import { apiClient } from './apiClient';

const URL = 'core/expenses/';

export const expenseService = {
  getAll: async (page = 1, search = '') => {
    const response = await apiClient.get(URL, {
      params: {
        page,
        page_size: 10,
        search: search || undefined,
        ordering: '-expense_date',
      },
    });
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post(URL, data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await apiClient.put(URL + id + '/', data);
    return response.data;
  },

  remove: async (id: number) => {
    const response = await apiClient.delete(URL + id + '/');
    return response.data;
  },
};
