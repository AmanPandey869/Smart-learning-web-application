import { useState } from "react";
import { HiMail, HiUser, HiChatAlt2 } from "react-icons/hi";

const Contact = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully 🚀");
    console.log(formData);

    // reset form
    setFormData({ name: "", email: "", message: "" });
    setShowForm(false);
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-white mb-4">Contact Us</h1>
      <p className="text-gray-400 mb-6">
        Have any questions? Click below to contact us.
      </p>

      {/* Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary mb-6"
      >
        {showForm ? "Close Form" : "Contact Now"}
      </button>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 p-6 rounded-xl max-w-md space-y-4"
        >
          <div>
            <label className="text-gray-300">Name</label>
            <div className="flex items-center bg-gray-800 rounded px-3">
              <HiUser className="text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-transparent p-2 w-full outline-none text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300">Email</label>
            <div className="flex items-center bg-gray-800 rounded px-3">
              <HiMail className="text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-transparent p-2 w-full outline-none text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300">Message</label>
            <div className="flex items-start bg-gray-800 rounded px-3">
              <HiChatAlt2 className="text-gray-400 mt-2" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="bg-transparent p-2 w-full outline-none text-white"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;