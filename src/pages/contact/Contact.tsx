// pages/contact/Contact.tsx
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "react-toastify";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
  
    const subject = encodeURIComponent(`Contact form message from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
  
    window.location.href = `mailto:support@shopkart.com?subject=${subject}&body=${body}`;
    toast.success("Opening your email client...");
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">Contact Us</h1>
      <p className="mb-10 text-gray-600">
        Have a question or need help with an order? Reach out — we're happy
        to help.
      </p>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 text-orange-500" size={20} />
            <div>
              <p className="font-medium text-gray-800">Email</p>
              <p className="text-gray-600">support@shopkart.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-1 text-orange-500" size={20} />
            <div>
              <p className="font-medium text-gray-800">Phone</p>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 text-orange-500" size={20} />
            <div>
              <p className="font-medium text-gray-800">Address</p>
              <p className="text-gray-600">
                123 Market Street, Gurugram, Haryana, India
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md border px-4 py-2 outline-none focus:border-orange-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md border px-4 py-2 outline-none focus:border-orange-500"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            className="w-full rounded-md border px-4 py-2 outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-orange-500 px-6 py-2 font-medium text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;