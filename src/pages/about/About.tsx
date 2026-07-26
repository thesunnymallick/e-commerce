// pages/about/About.tsx
const About = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">
        About Shop<span className="text-orange-500">Kart</span>
      </h1>
      <p className="mb-6 text-gray-600">
        ShopKart is your one-stop destination for quality products at
        honest prices. We started with a simple idea: online shopping
        should be fast, transparent, and enjoyable.
      </p>

      <div className="grid gap-8 sm:grid-cols-3">
        <div className="rounded-lg border p-6 text-center shadow-sm">
          <h3 className="mb-2 text-xl font-semibold text-orange-500">
            10K+
          </h3>
          <p className="text-gray-600">Happy Customers</p>
        </div>
        <div className="rounded-lg border p-6 text-center shadow-sm">
          <h3 className="mb-2 text-xl font-semibold text-orange-500">
            5K+
          </h3>
          <p className="text-gray-600">Products Listed</p>
        </div>
        <div className="rounded-lg border p-6 text-center shadow-sm">
          <h3 className="mb-2 text-xl font-semibold text-orange-500">
            24/7
          </h3>
          <p className="text-gray-600">Customer Support</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-3 text-2xl font-semibold text-gray-800">
          Our Mission
        </h2>
        <p className="text-gray-600">
          To make quality products accessible to everyone through a
          simple, secure, and delightful shopping experience — backed
          by reliable delivery and responsive support.
        </p>
      </div>
    </div>
  );
};

export default About;