// controllers/user.controller.js
const User = require("../models/User.model");

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, province } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, email, province },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }
    user.addresses.push(req.body);
    await user.save();

    res.json({
      success: true,
      message: "Thêm địa chỉ thành công",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy địa chỉ" });
    }

    if (req.body.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    Object.assign(address, req.body);
    await user.save();

    res.json({
      success: true,
      message: "Cập nhật địa chỉ thành công",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.pull(req.params.addressId);
    await user.save();

    res.json({
      success: true,
      message: "Xóa địa chỉ thành công",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: { $in: ["WAREHOUSE_STAFF", "ORDER_MANAGER", "ADMIN"] },
    }).select("-password");

    res.json({ success: true, data: { employees } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, province, password, role } = req.body;
    const user = await User.create({
      fullName,
      phoneNumber,
      email,
      province,
      password,
      role,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Tạo nhân viên thành công",
        data: { user },
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.toggleEmployeeStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy nhân viên" });
    }

    user.status = user.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
    await user.save();

    res.json({
      success: true,
      message: `${
        user.status === "LOCKED" ? "Khóa" : "Mở khóa"
      } nhân viên thành công`,
      data: { user },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy nhân viên" });
    }

    res.json({ success: true, message: "Xóa nhân viên thành công" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
