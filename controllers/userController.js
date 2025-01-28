import { findById, findByIdAndUpdate } from "../models/user";

export async function getUser(req, res) {
  try {
    const user = await findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
}

export async function updateUserInfo(req, res) {
  try {
    const updatedUser = await findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to update user", error: err.message });
  }
}
