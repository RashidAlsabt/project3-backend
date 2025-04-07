const express = require("express")
const router = express.Router()
const Company = require("../models/Company")
const jwt = require("jsonwebtoken")
const verifyToken = require("../middleware/verify-token")

// register company
router.post("/register", async (req, res) => {
  try {
    const { company_name, email, password, salary } = req.body

    const foundCompany = await Company.findOne({ email })
    if (foundCompany) {
      return res.status(400).json({ err: "Email already registered" })
    }

    const createdCompany = await Company.create({
      company_name,
      email,
      password, 
      salary,
    })

    const companyData = createdCompany.toObject()
    delete companyData.password

    res.status(201).json(companyData)
  } catch (error) {
    console.error("Error in /register:", error.message)
    res.status(500).json({ err: "Something went wrong" })
  }
})

// takes request, checks if name is there and compares password
//then it signs the jwt and returns
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  try {
    const foundCompany = await Company.findOne({ email })
    if (!foundCompany) {
      return res.status(401).json({ err: "Email not registered" })
    }

    const isMatch = password === foundCompany.password
    if (!isMatch) {
      return res.status(401).json({ err: "Email or password incorrect" })
    }

    const payload = foundCompany.toObject()
    delete payload.password

    const token = jwt.sign({ payload }, process.env.JWT_SECRET)

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json(error)
  }
})

// checks token
router.get("/verify", verifyToken, (req, res) => {
  console.log(req.user)
  res.json(req.user)
})

// gets new name from form, checks current company id and changes it
router.put("/update-name", verifyToken, async (req, res) => {
  try {
    const { company_name } = req.body

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


// deletes account
router.delete("/delete-account", verifyToken, async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.user._id)
    res.status(200).json({ msg: "Account deleted" })
  } catch (error) {
    res.status(500).json({ err: "Failed to delete account" })
  }
})

module.exports = router
