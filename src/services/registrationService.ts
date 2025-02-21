interface RegistrationData {
  nome: string;
  telefone: string;
  email: string;
  igreja: string;
  pastor: string;
  redeSocial: string;
  quantidadeMembros: string;
}

export async function submitRegistration(data: RegistrationData) {
  try {
    // Using no-cors mode to bypass CORS restrictions
    const response = await fetch('https://n8n-n8n-onlychurch.ibnltq.easypanel.host/webhook/cadastroclient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit registration');
    }

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error instanceof Error ? error.message : 'Unknown error occurred');
    throw new Error('Failed to submit registration. Please try again later.');
  }
}