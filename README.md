## Crop Vista
This project was built to complete the requirements of "INFO6150 Web Design & User Experience Engineering" course which I took at Northeastern University as part of my Master's degree.

The idea proposes to provide a digital solution, to bring the farmers, MNCs and distributors on the same platform enabling transparency and effective prduction and usage of produced crops. This will also enable farmers in reducing crop wastage by taking informed decisions for crop production which will be in line with the forecasted demand. 

#### Landing Page
<kbd><img width="1470" alt="Landing Screen" src="https://github.com/user-attachments/assets/4fe7c405-bd7c-4d09-915b-380055b29ed8" /></kbd>
#### Visualization using charts and graphs
<kbd><img width="1469" alt="Data Visualization" src="https://github.com/user-attachments/assets/84a0ac2e-c1a9-4840-a6fd-97a27fae67e4" /></kbd>
#### Farmer's View - showing internationalization
<kbd><img width="1465" alt="Farmer's View - Translated" src="https://github.com/user-attachments/assets/e461432d-43c5-4249-ad66-1c680b35a4c5" /></kbd>
#### Distributor's View - showing 'Create Procurement'
<kbd><img width="1470" alt="Distributor's View - Create Procurement" src="https://github.com/user-attachments/assets/bcd982ff-e6d1-430e-884b-b9b6bd5d6abc" /></kbd>
#### Company's View - showing downloadable contracts feature
<kbd><img width="1470" alt="Company View - Downloadable Contracts" src="https://github.com/user-attachments/assets/9c3bf57c-3816-46da-b03e-8382d733e541" /></kbd>

## Tech Stack
This is a Progressive Web App (PWA) based on MERN stack & uses Vite as a build framework - 
#### Database:
- MongoDB

#### Backend:
- Node.js
- Express
- Mongoose
- REST API
- JavaScript

#### Frontend:
- React
- Redux
- MUI
- TypeScript
- JavaScript
- HTML
- CSS
- Vite

## Setup
#### Server:
1. Navigate to the server directory: **cd server**.
2. Run **npm install** to install the required node modules.
3. Add a .env file which should contain parameters: PORT & MONGO_CONNECTION (connection URL of your MongoDB).
4. Start the backend server with **npm run start**, which will run the server on the port specified in .env file.

#### Client:
1. Navigate to the client directory: **cd client/app**.
2. Run **npm install** to install the necessary node modules.
3. Start the application with **npm run dev**, which will host it at http://localhost:4000/ as specified in the Vite configuration file.

## Node packages that will be installed
#### Server:
- **cors:** to enable Cross-Origin Resource Sharing for secure API access.
- **debug:** to provide a debugging utility for Node.js applications.
- **dotenv:** to load environment variables from a .env file.
- **express:** a web application framework for Node.js.
- **mongoose:** to provide a MongoDB object modeling tool for Node.js.

#### Client:
- **@emotion/react & @emotion/styled:** utilities for styling components with Emotion.
- **@mui:** Material Design components and icons for React.
- **@reduxjs/toolkit:** to simplify Redux state management.
- **date-fns:** used for date utility functions.
- **i18:** used for internationalization framework and backend loading for translations.
- **jspdf:** to generate PDF files in the browser.
- **react & react-dom:** core library and DOM methods for React.
- **react-hot-toast:** toast notifications in React.
- **react-i18next:** to integrate i18next with React.
- **react-redux:** to connect Redux with React components.
- **react-router-dom:** to manage routing in React applications.

## Domain Model

```mermaid
classDiagram
    class Account{
        + String username
        + String password
        + String role
        + Profile child
    }
 
    class Address {
        + String street1
        + String street2
        + String city
        + String state
        + String zip
        + String country
    }

    class Profile {
        + String name
        + String email
        + Address address
    }
 
    class Farmer {
        + Profile farmerProfile
        + float area
        + float productionCapacity
    }
 
    class Company {
        + Profile companyProfile
	    + Address shippingAddress
    }
 
    class Distributor {
        + Profile distProfile
        + float inventoryCapacity
	    + Address shippingAddress
    }
 
    class Demand {
        + String companyId
        + String cropId
        + int quantity
        + int timeline
        + date createdDate
    }
 
    class Supply {
        + String farmerId
        + String cropId
        + int quantity
        + int timeline
	    + date createdDate
    }
 
    class DistProc {
        + String distributorId
        + String farmerId
        + String cropId
        + int quantity
	    + int distQuote
	    + bool iAgreeDist
        + bool iAgreeFarmer
        + String status
        + date contractDate
    }
 
    class DistOffer {
        + String distributorId
        + String companyId
        + String cropId
        + int quantity
	    + int distQuote
	    + bool iAgreeDist
        + bool iAgreeCompany
        + String status
        + date contractDate
    }
 
    class Crop {
        + String name
        + String grade
        + float msp
    }
 
    Account <|-- Farmer
    Account <|-- Distributor
    Account <|-- Company

    Farmer *-- Profile: farmerProfile
    Company *-- Profile: companyProfile
    Distributor *-- Profile: distProfile

    Profile *-- Address: address
    Company *-- Address: shippingAddress
    Distributor *-- Address: shippingAddress

    Farmer "1" *-- "0..n" Supply: supplies
    Distributor "1" *-- "0..n" DistProc: procurements
    Supply "1" *-- "1" DistProc
    DistProc "1" *-- "1" Crop: crop
    DistProc "1" *-- "1" Farmer: farmer
    DistProc "1" *-- "1" Distributor: distributor

    Company "1" *-- "0..n" Demand: demands
    Distributor "1" *-- "0..n" DistOffer: offers
    Demand "1" *-- "1" DistOffer
    DistOffer "1" *-- "1" Crop: crop
    DistOffer "1" *-- "1" Company: company
    DistOffer "1" *-- "1" Distributor: distributor
 
    Crop "1" *-- "0..n" Supply: supplies
    Crop "1" *-- "0..n" Demand: demands
```
