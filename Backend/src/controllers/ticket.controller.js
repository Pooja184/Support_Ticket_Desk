import Ticket from "../models/ticket.model.js";


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
