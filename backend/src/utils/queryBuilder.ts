// Helper function to build MongoDB query from filters

export interface IFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 
            'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'between' | 'inList';
  value: any;
}

export function buildQuery(filters:IFilter[], logic :'AND' | 'OR' = 'AND') {
  if (!filters || filters.length === 0) return {};
  
  const conditions = filters.map(filter => {
    const { field, operator, value } = filter;
    
    switch (operator) {
      case 'equals':
        return { [field]: value };
      case 'contains':
        return { [field]: { $regex: value, $options: 'i' } };
      case 'startsWith':
        return { [field]: { $regex: `^${value}`, $options: 'i' } };
      case 'endsWith':
        return { [field]: { $regex: `${value}$`, $options: 'i' } };
      case 'greaterThan':
        return { [field]: { $gt: parseFloat(value) } };
      case 'lessThan':
        return { [field]: { $lt: parseFloat(value) } };
      case 'greaterThanOrEqual':
        return { [field]: { $gte: parseFloat(value) } };
      case 'lessThanOrEqual':
        return { [field]: { $lte: parseFloat(value) } };
      case 'between':
        const [min, max] = String(value).split(',').map(v => parseFloat(v.trim()));
        return { [field]: { $gte: min, $lte: max } };
      case 'inList':
        const values = String(value).split(',').map(v => v.trim());
        return { [field]: { $in: values } };
      default:
        return { [field]: value };
    }
  });
  
  if (logic === 'OR') {
    return { $or: conditions };
  }
  return { $and: conditions };
}