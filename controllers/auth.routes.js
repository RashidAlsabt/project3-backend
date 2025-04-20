const express = require("express")
const router = express.Router()
const Company = require("../models/Company")
const jwt = require("jsonwebtoken")
const verifyToken = require("../middleware/verify-token")
const bcrypt = require("bcrypt")

// register company
router.post("/register", async (req, res) => {
  try {
    const { company_name, email, password, salary } = req.body

    const foundCompany = await Company.findOne({ email })
    if (foundCompany) {
      return res.status(400).json({ err: "Email already registered" })
    }

    const hashedPassword = bcrypt.hashSync(password, 12)

    const createdCompany = await Company.create({
      company_name,
      email,
      password: hashedPassword,
      salary,
    })

    const companyData = createdCompany.toObject()
    delete companyData.password

    res.status(201).json(companyData)
  } catch (error) {
    res.status(500).json({ err: "Something went wrong" })
  }
})

// login company
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const foundCompany = await Company.findOne({ email })
    if (!foundCompany) {
      return res.status(401).json({ err: "Email not registered" })
    }

    if (!foundCompany.password) {
      return res.status(500).json({ err: "No password found for this user" })
    }

    const isMatch = bcrypt.compareSync(password, foundCompany.password)
    if (!isMatch) {
      return res.status(401).json({ err: "Email or password incorrect" })
    }

    const payload = foundCompany.toObject()
    delete payload.password

    const token = jwt.sign({ payload }, process.env.JWT_SECRET)

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ err: "Internal server error" })
  }
})

// verify token
router.get("/verify", verifyToken, (req, res) => {
  res.json(req.user)
})

// update company name
router.put("/update-name", verifyToken, async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    ).select("-password")

    res.status(200).json(updated)
  } catch (error) {
    res.status(500).json({ err: "Failed to update name" })
  }
})

// delete account
router.delete("/delete-account", verifyToken, async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.user._id)
    res.status(200).json({ msg: "Account deleted" })
  } catch (error) {
    res.status(500).json({ err: "Failed to delete account" })
  }
})

module.exports = router
