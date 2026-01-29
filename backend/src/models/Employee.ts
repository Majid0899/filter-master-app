import mongoose  from "mongoose";


// Employee Schema
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  hireDate: { type: Date, required: true },
  status: { type: String, required: true, enum: ['Active', 'On Leave', 'Inactive'] },
  location: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  manager: { type: String }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee