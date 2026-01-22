import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await api.get("/ticket/my-tickets");
      setTickets(res.data.data);
    };
    fetchTickets();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Tickets</h2>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            onClick={() =>
              navigate(`/dashboard/tickets/${ticket._id}`)
            }
            className="border p-4 rounded cursor-pointer hover:bg-gray-50"
          >
            <h3 className="font-medium">{ticket.title}</h3>
            <p className="text-sm text-gray-600">
              Status: {ticket.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
