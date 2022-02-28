const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const product = await Product.find({ price: { $gt: 30 } }).sort('price');
  res.status(200).json({ product, nbHits: product.length });
}

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if(featured) {
    queryObject.featured = featured === 'true' ? true : false
  }

  if(company) {
    queryObject.company = company
  }

  if(name) {
    // queryObject.name = name
    queryObject.name = { $regex: name, $options: 'i' };
  }

  if(numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(regEx, match => `-${operatorMap[match]}-`);
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach(item => {
      const [field, operator, value] = item.split('-');

      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);

  if(sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList)
  }else {
    result = result.sort('createdAt');
  }

  // .select === fields
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;
  result.skip(skip).limit(limit)

  console.log(queryObject);
  const product = await result
  res.status(200).json({ product, nbHits: product.length });
}

module.exports = { getAllProductsStatic, getAllProducts }; 