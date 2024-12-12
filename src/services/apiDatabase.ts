const API_URL = `${process.env.NEXT_PUBLIC_DB_API_URL}`;

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_DB_API_KEY}`,
});

export const signUpManual: any = async (userData: {
  name: string;
  email: string;
  password: string;
  photo_url: string;
  role: string;
  status: string;
}) => {
  const response = await fetch(`${API_URL}/signup-manual`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  return data;
};

export const signInManual = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/signin-manual`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data;
};

export const signUpGoogle = async (idToken: string) => {
  const response = await fetch(`${API_URL}/signup-google`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ id_token: idToken }),
  });

  const data = await response.json();
  return data;
};

export const signInGoogle = async (idToken: string) => {
  const response = await fetch(`${API_URL}/signin-google`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ id_token: idToken }),
  });

  const data = await response.json();
  return data;
};
