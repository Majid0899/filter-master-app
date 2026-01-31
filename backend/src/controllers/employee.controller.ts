import { Request, Response } from "express";
import Employee from "../models/Employee";
import {buildQuery} from "../utils/queryBuilder"


interface EmployeeQuery {
  page?: string;
  limit?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  filters?: string;
  logic?: "AND" | "OR";
}

// Get employees with filtering, sorting, and pagination
const handleGetEmployee = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "50",
      sortField= "hireDate",
      sortOrder= "desc",
      filters,
      logic = "AND",
    } = req.query as EmployeeQuery;

    const pageNum:number= parseInt(page, 10) || 1;
    const limitNum:number = parseInt(limit, 10) || 50;

    const query = filters ? buildQuery(JSON.parse(filters), logic) : {};

    const sortOptions: { [key: string]: 1 | -1 } = { 
      [sortField]: sortOrder === "asc" ? 1 : -1 
    };
    const employees = await Employee.find(query)
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const total = await Employee.countDocuments(query);

    res.json({
      data: employees,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      hasMore: pageNum * limitNum < total,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
};

export { handleGetEmployee };
