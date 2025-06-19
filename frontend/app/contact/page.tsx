'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email invalide';

    if (!message) newErrors.message = 'Message requis';
    else if (message.length > 300) newErrors.message = '300 caractères max';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setTimeout(() => {
      setSuccess(true);
      setEmail('');
      setMessage('');
    }, 500);
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Contact</h1>

      {success && (
        <p className="mb-4 text-green-600 font-semibold">
          Demande de contact envoyée avec succès
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block font-medium">Message</label>
          <textarea
            rows={5}
            className="w-full border px-3 py-2 rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex justify-between text-sm">
            {errors.message && <p className="text-red-600">{errors.message}</p>}
            <span className="text-gray-400">{message.length}/300</span>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
