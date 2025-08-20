# School Management API

A RESTful API for managing schools with location-based proximity sorting functionality. Built with Node.js, Express.js, and MySQL.

## 🚀 Features

- **Add Schools**: Register new schools with name, address, and coordinates
- **Location-Based Search**: List schools sorted by proximity to user location
- **Input Validation**: Comprehensive validation using Joi
- **Error Handling**: Robust error handling with meaningful responses
- **Database Management**: Automatic database and table initialization
- **Health Checks**: API health monitoring endpoints

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Validation**: Joi
- **Environment**: dotenv
- **Deployment**: Railway
- **API Testing**: Postman

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/school-management-api.git
   cd school-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=school_management
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Base URL
- **Local**: `http://localhost:3000`
- **Production**: `https://your-app.up.railway.app`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check and API info |
| GET | `/health` | Detailed health check |
| POST | `/api/addSchool` | Add a new school |
| GET | `/api/listSchools` | Get schools by proximity |

### 1. Add School
**POST** `/api/addSchool`

**Request Body:**
```json
{
  "name": "Springfield Elementary School",
  "address": "123 Main Street, Springfield, USA",
  "latitude": 39.7817,
  "longitude": -89.6501
}
```

**Response:**
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Springfield Elementary School",
    "address": "123 Main Street, Springfield, USA",
    "latitude": 39.7817,
    "longitude": -89.6501
  }
}
```

### 2. List Schools by Proximity
**GET** `/api/listSchools?latitude={lat}&longitude={lon}`

**Query Parameters:**
- `latitude`: User's latitude (-90 to 90)
- `longitude`: User's longitude (-180 to 180)

**Example:**
```
GET /api/listSchools?latitude=40.7128&longitude=-74.0060
```

**Response:**
```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Nearby School",
      "address": "123 Close Street",
      "latitude": 40.7130,
      "longitude": -74.0058,
      "distance": 0.25
    }
  ],
  "userLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

## 🔧 Development

### Project Structure
```
├── server.js              # Main application entry point
├── config/
│   └── database.js        # Database configuration
├── controllers/
│   └── schoolController.js # Business logic
├── routes/
│   └── schoolRoutes.js    # Route definitions
├── middleware/
│   └── errorHandler.js    # Error handling
├── utils/
│   ├── distance.js        # Distance calculations
│   └── validation.js      # Input validation
└── sql/
    └── schema.sql         # Database schema
```

### Available Scripts
```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm test        # Run tests (if implemented)
```

## 🚀 Deployment

### Railway Deployment

1. **Connect Repository**
   - Link your GitHub repository to Railway
   - Railway will auto-deploy on push

2. **Environment Variables**
   Set these in Railway dashboard:
   ```
   DB_HOST=<railway-provided>
   DB_USER=<railway-provided>
   DB_PASSWORD=<railway-provided>
   DB_NAME=railway
   NODE_ENV=production
   ```

3. **Database Setup**
   - Add MySQL service in Railway
   - Connect to your web service
   - Database will be automatically provisioned

### Manual Deployment
1. Set up MySQL database
2. Configure environment variables
3. Install dependencies: `npm install`
4. Start server: `npm start`

## 🧪 Testing

### Using Postman
1. Import the collection from `/postman/School-API-Collection.json`
2. Update the `baseUrl` variable to your deployment URL
3. Test all endpoints

### Manual Testing
```bash
# Health check
curl http://localhost:3000/

# Add school
curl -X POST http://localhost:3000/api/addSchool \
  -H "Content-Type: application/json" \
  -d '{"name":"Test School","address":"123 Test St","latitude":40.7128,"longitude":-74.0060}'

# List schools
curl "http://localhost:3000/api/listSchools?latitude=40.7128&longitude=-74.0060"
```

## 📊 Database Schema

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_location (latitude, longitude)
);
```

## 🛡️ Error Handling

The API includes comprehensive error handling:
- Input validation errors (400)
- Duplicate entry errors (409)
- Database connection errors (500)
- Not found errors (404)
- Server errors (500)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

