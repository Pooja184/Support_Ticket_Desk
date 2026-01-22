import mongoose from "mongoose";

const ticketCommentSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const TicketComment = mongoose.models.TicketComment || mongoose.model("TicketComment", ticketCommentSchema);

export default TicketComment;
