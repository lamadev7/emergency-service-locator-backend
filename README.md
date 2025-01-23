# Backend Service Finder API

This project provides a REST API for managing and accessing service data such as hospitals, ambulances, and other facilities. It supports finding nearby services, checking service statuses, and updating service details.

---

## Features

- **Service Retrieval**: Fetch all services or filter them by type.
- **Nearest Service**: Identify the closest service based on the user's current location.
- **Service Status**: Retrieve the status of a specific service.
- **Service Updates**: Update the status of a service.
- **Firebase Integration**: Real-time database integration using Firebase.

---

## Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Firebase Project**: A Firebase project configured with a service account and Realtime Database.

### Steps

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd backend
   npm install
   create .env file and paste the .env file in given attachment
   start the server using 'npm run dev' command


2. ENV Template
  ```json
  PORT=9999
  FIREBASE_DB_URL=https://emergency-service-locator-aaa21-default-rtdb.asia-southeast1.firebasedatabase.app/
```

## API Documentation

### Endpoints

#### 1. **Get All Services**
   **GET** `/services`

   **Query Parameters**:
   - `type` (optional): Filter services by type (e.g., "hospital", "ambulance", etc.).

   **Response**:
   ```json
   {
     "data": [
       {
         "id": "1",
         "location": [3, 4],
         "type": "hospital",
         "status": "available",
         "distance": 0
       }
     ],
     "error": null
   }
  ```

#### 2. **Get Nearest Service**

   **GET** `/services/nearest`

   **Query Parameters**:
   - `currentLocation` (required): User's current location as an array `[row, col]`.

   **Response**:
   ```json
   {
     "data": {
       "nearestService": {
         "id": "1",
         "serviceType": "Hospital",
         "distance": 3,
         "location": { "row": 4, "col": 5 },
         "status": "available"
       },
       "path": [[3, 4], [4, 4], [4, 5]]
     },
     "error": null
   }
  ```

#### 3. **Get Service Status**

   **GET** `/services/status`

   **Query Parameters**:
   - `serviceId` (required): The unique ID of the service.

   **Response**:
   ```json
   {
     "data": "available",
     "error": null
   }
  ```

#### 4. **Update Service Status**

   **POST** `/services/update`

   **Request Body**:
   ```json
   {
     "serviceId": "1",
     "status": "unavailable"
   }
  ```

  **Response**:
  ```json
  {
    "data": {
      "isUpdated": true
    },
    "error": null
  }
  ```

