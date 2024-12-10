export const customFetch = async (url: string, options: RequestInit = {}) => {
  const baseUrl = process.env.BASE_URL || 'http://54.163.26.152:3000';
  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return { data: await response.json(), headers: response.headers, status: response.status };
  }
  return { data: undefined, headers: response.headers, status: response.status };
};

