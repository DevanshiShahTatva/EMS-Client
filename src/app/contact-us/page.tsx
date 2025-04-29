'use client';

import { useState } from 'react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // here you can integrate your API to submit form data
    setFormStatus('Thank you! Your message has been received. We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => {
       setFormStatus("")
    },2500)
  };

  return (
    <section className="py-16 px-8">
      <div className="mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Contact Us</h1>
        <p className="text-center text-gray-600 mb-12">
          Have questions, feedback, or partnership inquiries? We'd love to hear from you!
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg border-2 border-gray-100 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="subject">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-500 text-white font-semibold px-8 py-3 rounded-md hover:bg-indigo-600 transition-all duration-300"
            >
              Send Message
            </button>
          </div>

          {formStatus && (
            <p className="text-green-600 text-center font-medium">{formStatus}</p>
          )}
        </form>
      </div>
    </section>
  );
}
