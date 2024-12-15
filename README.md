# Darkstore Project

## Overview
This project is designed to manage dark store operations.

## Technologies Used
- **Programming Language:** JavaScript
- **Database:** PostgreSQL
- **Styling:** Tailwind
- **API:** RESTful API
- **Version Control:** Git

## Getting Started
To get a local copy up and running, follow these steps:

### Prerequisites
- Node.js  20.16.0
- PostgreSQL 14.15

### Installation
1. Clone the repository:
  ```sh
  git clone https://github.com/julmedvedeva/darkstore
  ```
2. Navigate to the project directory:
  ```sh
  cd darkstore
  ```
3. Install backend dependencies:
  ```sh
  cd server
  npm install
  ```
4. Install frontend dependencies:
  ```sh
  cd ../client
  npm install
  ```
5. Install DB:
  ```sh
  cd ..
  chmod +x server/database/init-db.sh
  chmod +x server/database/init-db-2.sh
  ./init-db.sh
  ```
### Running the Application
1. Start the backend server:
  ```sh
  cd server
  npm run dev
  ```
2. Start the frontend development server:
  ```sh
  cd client
  npm run dev
  ```

## License
This project is licensed under the MIT and Creative Tim License. See the [LICENSE](client/LICENSE) file for details.


## Technologies Used
- **Programming Language:** JavaScript
- **Backend Framework:** Node.js/Express.js
- **Database:** PostgreSQL
- **Frontend:** React, Ag-Grid, Creative Tim
- **Styling:** CSS, Tailwind
- **API:** RESTful API
- **Version Control:** Git
