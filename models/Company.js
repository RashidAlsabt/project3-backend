import mongoose from 'mongoose';
const { Schema } = mongoose;

const CompanySchema = new Schema({
  companyName: { type: String, required: true },
  salary: { type: Number },
  email: { type: String, required: true, unique:true },
  password: { type: String, required: true },
}, {
  timestamps: true
});

const Company = mongoose.model('Company', CompanySchema);
export default Company;
