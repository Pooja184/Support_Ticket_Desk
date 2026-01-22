import { useEffect, useState } from "react";
import api from "../../api/axios";

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

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

      // include page & limit
      const params = {
        page,
        limit,
      };

      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const res = await api.get("/ticket/all-tickets", { params });

      setTickets(res.data.data);
      setTotalPages(res.data.pagination.totalPages); 
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
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  // this effect reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // this effect fetch on page or filter change
  useEffect(() => {
    fetchAllTickets();
  }, [filters, page]);

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Tickets</h2>

      {/*  Filters */}
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

      {/* Table  here we can also use grid as its easy to make page responsive*/}
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
              <tr key={ticket._id}>
                <td className="border px-3 py-2">{ticket.title}</td>
                <td className="border px-3 py-2 text-center">{ticket.category}</td>
                <td className="border px-3 py-2 text-center">{ticket.priority}</td>

                <td className="border px-3 py-2 text-center">
                  <select
                    value={ticket.status}
                    disabled={ticket.status === "Closed"}
                    onChange={(e) =>
                      handleStatusChange(ticket._id, e.target.value)
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
      </div>

      {/* Pagination UI */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllTickets;
