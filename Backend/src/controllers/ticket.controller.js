import Ticket from "../models/ticket.model.js";
import TicketAttachment from "../models/ticketAttachment.js";
import cloudinary from "../config/cloudinary.js";
import TicketComment from "../models/ticketComment.model.js";

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


export const getMyTickets = async (req, res) => {
  try {
    const userId = req.userId;

    const tickets = await Ticket.find({ created_by: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error("Get My Tickets Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const addComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { id: ticketId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const newComment = await TicketComment.create({
      ticket_id: ticketId,
      comment,
      created_by: userId,
    });

    res.status(201).json({
      success: true,
      data: newComment,
    });
  } catch (error) {
    console.error("Add Comment Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { id: ticketId } = req.params;

    const comments = await TicketComment.find({ ticket_id: ticketId })
      .populate("created_by", "name email")
      .sort({ createdAt: 1 });

      if(!comments){
        return res.status(404).json({success:false,message:"The specified ticket ID does not exist"})
      }

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error("Get Comments Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getTicketById = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const ticket = await Ticket.findOne({
      _id: id,
      created_by: userId, // ensures user can only see own ticket
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("Get Ticket By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const getAllTickets = async (req, res) => {
  try {
    const {
      status,
      category,
      priority,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [tickets, total] = await Promise.all([
      Ticket.find(query)
        .populate("created_by", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Ticket.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: tickets,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get All Tickets Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




const STATUS_FLOW = {
  Open: ["In_progress"],
  In_progress: ["Resolved"],
  Resolved: ["Closed"],
  Closed: [],
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const currentStatus = ticket.status;
    const allowedNext = STATUS_FLOW[currentStatus];

    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${currentStatus} to ${status}`,
      });
    }

    ticket.status = status;
    await ticket.save();

    return res.status(200).json({
      success: true,
      message: "Ticket status updated",
      data: ticket,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




