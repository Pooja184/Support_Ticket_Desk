import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiRefreshCcw,
  FiSearch,
} from "react-icons/fi";
import api from "../../api/axios";

const STATUS_OPTIONS = {
  Open: ["In_progress"],
  In_progress: ["Resolved"],
  Resolved: ["Closed"],
  Closed: [],
};

const STATUS_STYLES = {
  Open: "bg-sky-50 text-sky-700 ring-sky-200",
  In_progress: "bg-amber-50 text-amber-700 ring-amber-200",
  Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Closed: "bg-slate-100 text-slate-600 ring-slate-200",
};

const PRIORITY_STYLES = {
  Low: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-rose-50 text-rose-700",
};

const limit = 5;

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
    search: "",
  });

  const hasFilters = Object.values(filters).some(Boolean);

  const metrics = useMemo(() => {
    const openTickets = tickets.filter((ticket) => ticket.status !== "Closed");
    const highPriority = tickets.filter((ticket) => ticket.priority === "High");

    return [
      { label: "Visible tickets", value: tickets.length },
      { label: "Active now", value: openTickets.length },
      { label: "High priority", value: highPriority.length },
    ];
  }, [tickets]);

  const fetchAllTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = { page, limit };

      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const res = await api.get("/ticket/all-tickets", { params });

      setTickets(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (fetchError) {
      console.error("Failed to fetch tickets", fetchError);
      setError("Unable to load tickets right now.");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await api.patch(`/ticket/${ticketId}/status`, {
        status: newStatus,
      });
      fetchAllTickets();
    } catch (statusError) {
      alert(statusError.response?.data?.message || "Failed to update status");
    }
  };

  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      category: "",
      priority: "",
      search: "",
    });
  };

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    fetchAllTickets();
  }, [fetchAllTickets]);

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-sm">
        <div className="px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-200">
                Ticket operations
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-normal sm:text-3xl">
                Admin Ticket Queue
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Review incoming requests, filter by urgency, and move tickets
                through the support workflow.
              </p>
            </div>

            <button
              onClick={fetchAllTickets}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              <FiRefreshCcw size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid border-t border-white/10 bg-white/[0.03] sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="border-t border-white/10 px-5 py-4 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0 sm:px-6"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {metric.label}
              </p>
              <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <FiFilter size={17} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-950">Filters</h2>
              <p className="text-xs text-slate-500">
                Narrow the queue by title, status, priority, or category.
              </p>
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="relative block">
            <span className="sr-only">Search title</span>
            <FiSearch
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search title"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </label>

          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(value) => updateFilter("status", value)}
            options={["Open", "In_progress", "Resolved", "Closed"]}
            placeholder="All Status"
          />

          <FilterSelect
            label="Priority"
            value={filters.priority}
            onChange={(value) => updateFilter("priority", value)}
            options={["Low", "Medium", "High"]}
            placeholder="All Priority"
          />

          <FilterSelect
            label="Category"
            value={filters.category}
            onChange={(value) => updateFilter("category", value)}
            options={["Bug", "Feature", "Support"]}
            placeholder="All Category"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold text-slate-950">All Tickets</h2>
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
          </div>
        </div>

        {error && (
          <div className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <TicketSkeleton />
        ) : tickets.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Ticket</th>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">Priority</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Created By</th>
                    <th className="px-5 py-3 font-semibold">Created At</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {tickets.map((ticket) => (
                    <TicketRow
                      key={ticket._id}
                      ticket={ticket}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 md:hidden">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket._id}
                  ticket={ticket}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-4 sm:px-5">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronLeft size={16} />
            Prev
          </button>

          <span className="text-sm font-medium text-slate-600">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages || loading}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <FiChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};

const FilterSelect = ({ label, value, onChange, options, placeholder }) => (
  <label className="block">
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {formatLabel(option)}
        </option>
      ))}
    </select>
  </label>
);

const TicketRow = ({ ticket, onStatusChange }) => (
  <tr className="transition hover:bg-slate-50">
    <td className="max-w-xs px-5 py-4">
      <p className="truncate font-semibold text-slate-950">{ticket.title}</p>
      <p className="mt-1 text-xs text-slate-500">#{ticket._id?.slice(-6)}</p>
    </td>
    <td className="px-5 py-4 text-slate-600">{ticket.category}</td>
    <td className="px-5 py-4">
      <Badge className={PRIORITY_STYLES[ticket.priority]}>
        {ticket.priority}
      </Badge>
    </td>
    <td className="px-5 py-4">
      <StatusSelect ticket={ticket} onStatusChange={onStatusChange} />
    </td>
    <td className="px-5 py-4 text-slate-600">
      {ticket.created_by?.name || "Unknown"}
    </td>
    <td className="px-5 py-4 text-slate-600">
      {formatDate(ticket.createdAt)}
    </td>
  </tr>
);

const TicketCard = ({ ticket, onStatusChange }) => (
  <article className="space-y-4 p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="font-semibold text-slate-950">{ticket.title}</h3>
        <p className="mt-1 text-xs text-slate-500">#{ticket._id?.slice(-6)}</p>
      </div>
      <Badge className={PRIORITY_STYLES[ticket.priority]}>
        {ticket.priority}
      </Badge>
    </div>

    <div className="grid grid-cols-2 gap-3 text-sm">
      <Detail label="Category" value={ticket.category} />
      <Detail label="Created" value={formatDate(ticket.createdAt)} />
      <Detail label="Created By" value={ticket.created_by?.name || "Unknown"} />
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Status
        </p>
        <div className="mt-1">
          <StatusSelect ticket={ticket} onStatusChange={onStatusChange} />
        </div>
      </div>
    </div>
  </article>
);

const StatusSelect = ({ ticket, onStatusChange }) => (
  <div className="inline-flex items-center gap-2">
    <Badge className={STATUS_STYLES[ticket.status]}>
      {formatLabel(ticket.status)}
    </Badge>
    <select
      value={ticket.status}
      disabled={ticket.status === "Closed"}
      onChange={(event) => onStatusChange(ticket._id, event.target.value)}
      className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      aria-label={`Update status for ${ticket.title}`}
    >
      <option value={ticket.status}>{formatLabel(ticket.status)}</option>
      {STATUS_OPTIONS[ticket.status]?.map((next) => (
        <option key={next} value={next}>
          {formatLabel(next)}
        </option>
      ))}
    </select>
  </div>
);

const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}
  >
    {children}
  </span>
);

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-slate-700">{value}</p>
  </div>
);

const TicketSkeleton = () => (
  <div className="space-y-3 p-5">
    {[1, 2, 3, 4, 5].map((item) => (
      <div key={item} className="h-14 animate-pulse rounded-lg bg-slate-100" />
    ))}
  </div>
);

const EmptyState = ({ hasFilters, onClear }) => (
  <div className="px-5 py-14 text-center">
    <h3 className="text-lg font-semibold text-slate-950">No tickets found</h3>
    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
      {hasFilters
        ? "No tickets match the selected filters."
        : "Tickets submitted by users will appear here."}
    </p>
    {hasFilters && (
      <button
        onClick={onClear}
        className="mt-5 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Clear filters
      </button>
    )}
  </div>
);

const formatLabel = (value = "") => value.replace("_", " ");

const formatDate = (value) => {
  if (!value) return "Not available";

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default AllTickets;
