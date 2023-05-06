import express from 'express';

export const applyMiddlewareToRoutes = (routes) => {
    const apiRouter = express.Router();  

    for (const key in routes) {
      if (Object.hasOwnProperty.call(routes, key)) {
        apiRouter.use(routes[key]);
      }
    }
    
    return apiRouter;
    
  };