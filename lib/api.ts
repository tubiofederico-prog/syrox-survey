const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function submitSurvey(data: any) {
  try {
    const response = await fetch(`${API_URL}/api/surveys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit survey');
    return await response.json();
  } catch (error) {
    console.error('Survey submission error:', error);
    throw error;
  }
}

export async function loginAdmin(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function getSurveys(page = 1, limit = 50, token: string) {
  try {
    const response = await fetch(
      `${API_URL}/api/surveys?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch surveys');
    return await response.json();
  } catch (error) {
    console.error('Fetch surveys error:', error);
    throw error;
  }
}

export async function getAnalytics(token: string) {
  try {
    const response = await fetch(`${API_URL}/api/surveys/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return await response.json();
  } catch (error) {
    console.error('Fetch analytics error:', error);
    throw error;
  }
}
