import mongoose from "mongoose";

const ticketAttachmentSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },

    file_name: {
      type: String,
      required: true,
    },

    file_url: {
      type: String,
      required: true,
    },

    cloudinary_public_id: {
      type: String,
      required: true,
    },

    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const TicketAttachment =
  mongoose.models.TicketAttachment ||
  mongoose.model("TicketAttachment", ticketAttachmentSchema);

export default TicketAttachment;
