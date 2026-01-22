import { useEffect, useState } from "react";
import api from "../../api/axios";

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Filters state
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
    search: "",
  });

  const STATUS_OPTIONS = {
    Open: ["In_progress"],
    In_progress: ["Resolved"],
    Resolved: ["Closed"],
    Closed: [],
  };

  const fetchAllTickets = async () => {
    try {
      setLoading(true);

      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const res = await api.get("/ticket/all-tickets", { params });
      setTickets(res.data.data);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await api.patch(`/ticket/${ticketId}/status`, {
        status: newStatus,
      });
      fetchAllTickets();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to update status"
      );
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, [filters]);

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        All Tickets
      </h2>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search title"
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          className="border px-3 py-2 rounded text-sm"
        />

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="In_progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) =>
            setFilters({ ...filters, priority: e.target.value })
          }
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="">All Category</option>
          <option value="Bug">Bug</option>
          <option value="Feature">Feature</option>
          <option value="Support">Support</option>
        </select>
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Title</th>
              <th className="border px-3 py-2">Category</th>
              <th className="border px-3 py-2">Priority</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Created By</th>
              <th className="border px-3 py-2">Created At</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">
                  {ticket.title}
                </td>

                <td className="border px-3 py-2 text-center">
                  {ticket.category}
                </td>

                <td className="border px-3 py-2 text-center">
                  {ticket.priority}
                </td>

                <td className="border px-3 py-2 text-center">
                  <select
                    value={ticket.status}
                    disabled={ticket.status === "Closed"}
                    onChange={(e) =>
                      handleStatusChange(
                        ticket._id,
                        e.target.value
                      )
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value={ticket.status}>
                      {ticket.status.replace("_", " ")}
                    </option>

                    {STATUS_OPTIONS[ticket.status]?.map((next) => (
                      <option key={next} value={next}>
                        {next.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="border px-3 py-2 text-center">
                  {ticket.created_by?.name}
                </td>

                <td className="border px-3 py-2 text-center">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tickets.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No tickets found
          </p>
        )}
      </div>
    </div>
  );
};

export default AllTickets;
