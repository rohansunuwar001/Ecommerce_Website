class ApiFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    search() {
      if (this.queryString.keyword) {
        const keyword = {
          name: {
            $regex: this.queryString.keyword,
            $options: "i", // Case-insensitive search
          },
        };
        this.query = this.query.find(keyword);
      }
      return this;
    }
  
    filter() {
      const queryCopy = { ...this.queryString };
  
      // Fields to exclude
      const removeFields = ["keyword", "page", "limit"];
      removeFields.forEach((key) => delete queryCopy[key]);
  
      // Filter for price, rating, etc.
      let queryStr = JSON.stringify(queryCopy);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (key) => `$${key}`
      );
  
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }

    pagination(resultPerPage) {
        if (resultPerPage <= 0) {
            throw new Error("resultPerPage must be a positive number");
        }
    
        const currentPage = Number(this.queryString.page) || 1; // Default to page 1 if not provided
    
        const skip = resultPerPage * (currentPage - 1);
    
        this.query = this.query.limit(resultPerPage).skip(skip);
    
        return this; // For chaining
    }
    
  }
  
  export default ApiFeatures;
  