import Ticket from "../models/ticket.model.js";
import TicketAttachment from "../models/ticketAttachment.js";
import cloudinary from "../config/cloudinary.js";

export const addTicket = async (req, res) => {
  try {
    const userId = req.userId;

    const { title, description, category, priority } = req.body;

    // Basic validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and category are required",
      });
    }

    //  Create ticket
    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      created_by: userId,
      status: "Open",
    });

    // Response
    return res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (error) {
    console.error("Add Ticket Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const addTicketAttachment = async (req, res) => {
  try {
    const userId = req.userId;
    const ticketId = req.params.id;

    //  Check ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Check file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "support_tickets",
        resource_type: "auto",
      }
    );

    //  Save attachment in DB
    const attachment = await TicketAttachment.create({
      ticket_id: ticketId,
      file_name: req.file.originalname,
      file_url: uploadResult.secure_url,
      cloudinary_public_id: uploadResult.public_id,
      uploaded_by: userId,
    });

    //  Link attachment to ticket
    ticket.attachments.push(attachment._id);
    await ticket.save();

    return res.status(201).json({
      success: true,
      message: "Attachment uploaded successfully",
      data: attachment,
    });
  } catch (error) {
    console.error("Add Attachment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

