import { useRef } from "react";
import emailjs from "emailjs-com";

export default function Contact() {
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_53hno1l",
        "template_4buhi8r",
        formRef.current,
        "zGPCKrxWzxaT4mC7G"
      )
      .then(
        () => {
          alert("Message sent successfully ✅");
          formRef.current.reset();
        },
        (error) => {
          console.error(error);
          alert("Failed to send message ❌");
        }
      );
  };

  return (
    <section id="contact" className="py-20 px-8">
      <h3 className="text-3xl font-bold text-center mb-8">
        Contact Us
      </h3>

      <form
        ref={formRef}
        onSubmit={sendEmail}
        className="max-w-xl mx-auto grid gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border p-3 rounded-lg"
        />

        <textarea
          name="message"
          placeholder="Message"
          rows="4"
          required
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white py-3 rounded-lg cursor-pointer"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
