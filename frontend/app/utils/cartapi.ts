export async function addToCartApi(productId: number, quantity = 1): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Utilisateur non connecté');

  const res = await fetch('http://localhost:3000/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Erreur ajout panier: ${error}`);
  }
}
