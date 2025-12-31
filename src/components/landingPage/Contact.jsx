export default function Contact() {
  return (
    <section id="contact" className="py-20 px-8">
      <h3 className="text-3xl font-bold text-center mb-8">
        Contact Us
      </h3>

      <form className="max-w-xl mx-auto grid gap-4">
        <input
          type="text"
          placeholder="Name"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
        />
        <textarea
          placeholder="Message"
          rows="4"
          className="border p-3 rounded-lg"
        />
        <button className="bg-indigo-600 text-white py-3 rounded-lg">
          Send Message
        </button>
      </form>
    </section>
  );
}
