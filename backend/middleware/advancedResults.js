const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ["select", "sort", "page", "limit", "search"];
    removeFields.forEach((f) => delete reqQuery[f]);
  
    let queryStr = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, (m) => `$${m}`);
    query = model.find(JSON.parse(queryStr));
  
    if (req.query.search) {
      query = model.find({ $text: { $search: req.query.search } });
    }
    if (req.query.select) {
      query = query.select(req.query.select.split(",").join(" "));
    }
    query = req.query.sort
      ? query.sort(req.query.sort.split(",").join(" "))
      : query.sort("-createdAt");
  
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex   = page * limit;
    const total      = await model.countDocuments(JSON.parse(queryStr));
  
    query = query.skip(startIndex).limit(limit);
    if (populate) query = query.populate(populate);
  
    const results    = await query;
    const pagination = { total, page, limit, pages: Math.ceil(total / limit) };
    if (endIndex   < total) pagination.next = { page: page + 1, limit };
    if (startIndex > 0)     pagination.prev = { page: page - 1, limit };
  
    res.advancedResults = { success: true, count: results.length, pagination, data: results };
    next();
  };
  
  module.exports = advancedResults;
  