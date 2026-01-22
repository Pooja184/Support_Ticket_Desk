import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";

const TicketDetails = () => {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch ticket info
  const fetchTicket = async () => {
    const res = await api.get(`/ticket/${id}`);
    setTicket(res.data.data);
  };

  // Fetch comments
  const fetchComments = async () => {
    const res = await api.get(`/ticket/${id}/comments`);
    setComments(res.data.data);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        await Promise.all([fetchTicket(), fetchComments()]);
      } catch (err) {
        toast.error("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await api.post(`/ticket/${id}/comments`, {
        comment: newComment,
      });

      toast.success("Comment added");
      setNewComment("");
      fetchComments();
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!ticket) return <p>Ticket not found</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* 🔹 Ticket Info */}
      <div className="border rounded-lg p-5 bg-white">
        <h2 className="text-xl font-semibold mb-2">
          {ticket.title}
        </h2>

        <p className="text-gray-700 mb-4">
          {ticket.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p>
            <span className="font-medium">Category:</span>{" "}
            {ticket.category}
          </p>
          <p>
            <span className="font-medium">Priority:</span>{" "}
            {ticket.priority}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            {ticket.status}
          </p>
          <p>
            <span className="font-medium">Created:</span>{" "}
            {new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* 🔹 Comments Section */}
      <div className="border rounded-lg p-5 bg-white">
        <h3 className="text-lg font-semibold mb-4">
          Comments
        </h3>

        {/* Comments list */}
        <div className="space-y-3 mb-4">
          {comments.length === 0 && (
            <p className="text-sm text-gray-500">
              No comments yet
            </p>
          )}

          {comments.map((c) => (
            <div key={c._id} className="border p-3 rounded">
              <p className="text-gray-800">{c.comment}</p>
              <p className="text-xs text-gray-500 mt-1">
                {c.created_by?.name} •{" "}
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <textarea
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          placeholder="Write a comment..."
        />

        <button
          onClick={handleAddComment}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default TicketDetails;
