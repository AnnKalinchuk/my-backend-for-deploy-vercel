function paginatedResults(model) {
    return async (req, res, next) => {
    
      const searchTitle = req.query.search || ""

      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}

       // Получаем userId из запроса, если он присутствует
        const userId = req.user ? req.user.id : null;

        // Формируем фильтр
      const filter = {
        ...(userId && { userId }), // Фильтрация по userId, если он есть
        title: { $regex: searchTitle, $options: "i" }, // Фильтрация по названию
      };
  
      if(endIndex < await model.countDocuments(filter).exec()) {
          results.next = {
          page: page + 1,
          limit: limit
        }
      }
    
      if(startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      try {
        const totalCount = await model.countDocuments(filter).exec();

        results.results = await model.find(filter)
                          .limit(limit)
                          .skip(startIndex)
                          .exec()

        results.totalCount = totalCount;
        results.totalPages = Math.ceil(results.totalCount / limit);
        results.lastPage = Math.ceil(results.totalCount / limit)
        
    
        res.paginatedResults = results
        next()
      } catch (e) {
        res.status(500).json({message: e.message})
      }
    }
  }

  module.exports = paginatedResults