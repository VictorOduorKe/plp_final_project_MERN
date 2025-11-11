import { useState,useEffect} from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Contact = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
const [loading,setLoading]=useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullname || !email || !subject || !message) {
      toast.error("All fields are required");
      return;
    }
       setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact-message`, {
        name: fullname,
        email,
        subject,
        message,
      }, {
        withCredentials: true
      });
      toast.success("Message sent successfully!");
      setFullname("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error(err.response?.data?.message || "Failed to send message");
      setLoading(false);
    }finally{
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Contact <span className="text-violet-400">Us</span>
        </h1>
        <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto">
          Have questions, feedback, or suggestions? We’d love to hear from you.
          Reach out to the AI Study Planner team and we’ll respond as soon as possible.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-left mb-2 text-slate-300">Full Name</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-left mb-2 text-slate-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-left mb-2 text-slate-300">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What’s this about?"
              className="w-full px-4 py-3 rounded-lg bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-left mb-2 text-slate-300">Message</label>
            <textarea
              rows="6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 rounded-lg bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-violet-500 hover:bg-violet-600 rounded-lg font-semibold text-lg transition duration-300"
          >{!loading ? "Send Messages" : "Sending..."}
          </button>
        </form>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mt-20 text-center">
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-violet-500/30 transition">
          <h3 className="text-2xl font-bold mb-3 text-violet-400">📍 Address</h3>
          <p className="text-slate-300">123 AI Street, Mombasa, Kenya</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-violet-500/30 transition">
          <h3 className="text-2xl font-bold mb-3 text-violet-400">📞 Phone</h3>
          <p className="text-slate-300">+254 102 638 973</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-violet-500/30 transition">
          <h3 className="text-2xl font-bold mb-3 text-violet-400">📧 Email</h3>
          <p className="text-slate-300">victoroduor723@gmail.com</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
