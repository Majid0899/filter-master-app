import app from "./app";
import dotenv from 'dotenv'
import employeeRoute from './routes/employee.routes'
import presetRoute from './routes/preset.routes'
import Employee from "./models/Employee";
import Preset from "./models/Preset";

dotenv.config()

const PORT: number = Number(process.env.PORT) || 4000;
const URL: string = process.env.URL || 'http://localhost';


app.use("/api/employees",employeeRoute)
app.use("/api/presets",presetRoute)
// Seed data endpoint (for testing)
app.post('/api/seed', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Database already seeded', count });
    }
    
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Product', 'Support'];
    const positions = {
      Engineering: ['Software Engineer', 'Senior Engineer', 'Tech Lead', 'Engineering Manager'],
      Sales: ['Sales Rep', 'Account Executive', 'Sales Manager', 'VP Sales'],
      Marketing: ['Marketing Specialist', 'Content Writer', 'Marketing Manager', 'CMO'],
      HR: ['HR Specialist', 'Recruiter', 'HR Manager', 'CHRO'],
      Finance: ['Accountant', 'Financial Analyst', 'Finance Manager', 'CFO'],
      Operations: ['Operations Specialist', 'Operations Manager', 'COO'],
      Product: ['Product Manager', 'Senior PM', 'VP Product'],
      Support: ['Support Agent', 'Support Lead', 'Support Manager']
    };
    const locations = ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Singapore', 'Austin', 'Seattle'];
    const statuses = ['Active', 'Active', 'Active', 'Active', 'Active', 'On Leave', 'Inactive'];
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle', 'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];
    
    const employees = [];
    const startDate = new Date('2020-01-01');
    const endDate = new Date();
    
    for (let i = 1; i <= 1000; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const position = positions[department as keyof typeof positions][Math.floor(Math.random() * positions[department as keyof typeof positions].length)];
      const hireDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      
      employees.push({
        employeeId: `EMP${String(i).padStart(4, '0')}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
        department,
        position,
        salary: Math.floor(Math.random() * (150000 - 40000 + 1)) + 40000,
        hireDate,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        age: Math.floor(Math.random() * (65 - 22 + 1)) + 22,
        phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        manager: i > 100 ? `EMP${String(Math.floor(Math.random() * 100) + 1).padStart(4, '0')}` : null
      });
    }
    
    await Employee.insertMany(employees);
    
    // Create default preset
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    await Preset.create({
      name: 'Active Employees - Recent Hires',
      filters: [
        { field: 'status', operator: 'equals', value: 'Active' },
        { field: 'hireDate', operator: 'greaterThan', value: oneYearAgo.toISOString().split('T')[0] }
      ],
      logic: 'AND',
      isDefault: true
    });
    
    res.json({ message: 'Database seeded successfully', count: 1000 });
  } catch (error) {
    console.error('Error seeding database:', error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${URL}:${PORT}`);
});
