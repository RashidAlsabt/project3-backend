const {Schema, model} = require("mongoose")

const CompanySchema = new Schema({
  company_name: { type: String, required: true },
  salary: { type: Number },
  email: { type: String, required: true, unique:true },
  password: { type: String, required: true },
}, {
  timestamps: true
});

const Company = model('Company', CompanySchema)

module.exports = Company
