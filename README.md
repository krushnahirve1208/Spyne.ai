## Spyne.ai API

Welcome to the Spyne.ai API documentation! This API allows developers to interact programmatically with various resources, enabling automation, integration, and extension of functionality within your application. Whether you're managing posts, comments, or user interactions, our API provides endpoints to streamline operations and build powerful applications.

### Important Links

- [Postman Collection](https://www.postman.com/spyneai-1341/workspace/krushna/environment/31753081-df3d5210-7be3-4d35-870a-957c5b72d4de?action=share&creator=31753081&active-environment=31753081-df3d5210-7be3-4d35-870a-957c5b72d4de)
- [Postman Documentation](https://documenter.getpostman.com/view/31753081/2sA3XPDNhq)
- [Host URL](https://spyne-ai.onrender.com)
- [Related Docs](https://drive.google.com/drive/folders/1nbvD_blgV_eYzlopST3lrHdgRGu3TXNN?usp=sharing)

### Posts

- **GET /api/v1/posts**
  - Retrieve all posts.

- **DELETE /api/v1/posts/:postId**
  - Delete a post by ID.

- **POST /api/v1/posts**
  - Create a new post.

- **PATCH /api/v1/posts/:postId**
  - Update a post by ID.

- **GET /api/v1/posts/:postId**
  - Retrieve a specific post by ID.

- **POST /api/v1/posts/:postId/like**
  - Like a post by ID.

- **POST /api/v1/posts/:postId/unlike**
  - Unlike a post by ID.

- **GET /api/v1/posts?tags=cool**
  - Retrieve posts tagged with a specific tag.

- **GET /api/v1/posts?text="trends"**
  - Retrieve posts containing specific text.

### Comments

- **GET /api/v1/posts/:postId/comments/:commentId**
  - Retrieve a specific comment by ID within a post.

- **POST /api/v1/posts/:postId/comments/**
  - Create a new comment for a post.

- **PATCH /api/v1/posts/:postId/comments/:commentId**
  - Update a comment by ID within a post.

- **DELETE /api/v1/posts/:postId/comments/:commentId**
  - Delete a comment by ID within a post.

### Users

- **GET /api/v1/users**
  - Retrieve all users.

- **GET /api/v1/users/:userId**
  - Retrieve a specific user by ID.

- **POST /api/v1/users**
  - Create a new user.

- **PUT /api/v1/users/:userId**
  - Update a user's information by ID.

- **DELETE /api/v1/users/:userId**
  - Delete a user by ID.

### Authentication

- **POST /api/v1/auth/register**
  - Register a new user.

- **POST /api/v1/auth/login**
  - Log in an existing user.

- **GET /api/v1/auth/logout**
  - Log out the current user.

- **POST /api/v1/auth/forgotPassword**
  - Initiate the password reset process.

- **PATCH /api/v1/auth/resetPassword/:resetToken**
  - Reset user's password using a reset token.

### Usage

- **Installation:** Clone the repository and install dependencies using `npm install`.

- **Environment Variables:** Set up your environment variables (e.g., API key, database connection string).

- **Run:** Start the server using `npm start`.

- **API Requests:** Use tools like Postman or `curl` to send requests to the API endpoints.
