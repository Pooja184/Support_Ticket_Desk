import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiPaperclip, FiSend } from "react-icons/fi";
import api from "../../api/axios";

const AddTicket = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Bug",
    priority: "Low",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/ticket/add-ticket", formData);
      const ticketId = res.data.data._id;

      if (file) {
        const attachmentData = new FormData();
        attachmentData.append("file", file);

        await api.post(`/ticket/${ticketId}/attachments`, attachmentData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success("Ticket created successfully");
      navigate("/dashboard/my-tickets");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section className="rounded-lg bg-slate-950 px-5 py-6 text-white shadow-sm sm:px-6">
        <p className="text-sm font-medium text-cyan-200">New request</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">
          Create Support Ticket
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Share the issue, choose the right category, and attach a file if it
          helps the team understand what happened.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            placeholder="Briefly describe the issue"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            placeholder="Add steps, expected behavior, screenshots, or any context that can help"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="Bug">Bug</option>
              <option value="Feature">Feature</option>
              <option value="Support">Support</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Attachment (optional)
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 transition hover:border-slate-400 hover:bg-white">
            <FiPaperclip size={18} />
            <span className="min-w-0 truncate">
              {file?.name || "Choose a file to attach"}
            </span>
            <input
              type="file"
              onChange={(event) => setFile(event.target.files[0])}
              className="sr-only"
            />
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <FiSend size={16} />
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTicket;
