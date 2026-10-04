\# Credit Card Payment System



A full-stack credit card payment simulation built with React, Tailwind CSS, Django REST Framework, FastAPI, and MySQL.



\## Features



\* User registration and JWT authentication

\* Credit card management with masked card details

\* Payment processing with PENDING, SUCCESS, and FAILED statuses

\* Transaction history and filtering

\* Django admin panel and transaction CSV export

\* API documentation through Swagger/OpenAPI

\* Docker Compose setup for the application services

\* Automated backend tests



\## Technology Stack



| Layer                              | Technology                               |

| ---------------------------------- | ---------------------------------------- |

| Frontend                           | React, Vite, Tailwind CSS                |

| Authentication and management APIs | Django, Django REST Framework, SimpleJWT |

| Payment processing API             | FastAPI                                  |

| Database                           | MySQL 8                                  |

| Containers                         | Docker, Docker Compose                   |



\## Project Services



| Service                  | Local URL                       |

| ------------------------ | ------------------------------- |

| React frontend           | http://localhost:5173           |

| Django API documentation | http://localhost:8000/api/docs/ |

| FastAPI documentation    | http://localhost:8001/docs      |

| Django admin             | http://localhost:8000/admin/    |



\## Prerequisites



\* Docker Desktop with Docker Compose

\* Git

\* A web browser



\## Run the Application



Clone the repository:



```bash

git clone https://github.com/munirathnam7721/credit-card-payment-system.git

cd credit-card-payment-system

```



Configure the required environment variables in a local `.env` file. Do not commit `.env` or share secret values.



Build and start the services:



```bash

docker compose up --build -d

```



Check service status:



```bash

docker compose ps

```



View service logs:



```bash

docker compose logs --tail=100

```



Stop the application:



```bash

docker compose down

```



\## Database Schema



The schema-only SQL file is located at:



`database/credit\_card\_schema.sql`



It describes the database tables without exporting application records. Review the schema before importing it into another database. Follow the Django migrations and project configuration when setting up a fresh environment.



\## Testing



Run the Django test suite:



```bash

docker compose exec django python manage.py test

```



Run the FastAPI test suite:



```bash

docker compose exec fastapi pytest

```



If a test command cannot locate the test suite, check the service working directory and the project's test configuration.



\## API Testing



Import the Postman collection from:



`postman/Credit-Card-Payment-System.postman\_collection.json`



The collection can be used to exercise the available API requests. Authenticate first where an endpoint requires a JWT access token.



\## Security Notes



\* Never commit `.env` files, database dumps containing application records, passwords, or JWT tokens.

\* Store only masked card details and the last four digits; do not store full card numbers or CVV values.

\* Use strong, unique secrets and appropriate production settings before deployment.

\* The payment functionality is a simulation and should not be treated as a production payment gateway.



\## Repository



GitHub: https://github.com/munirathnam7721/credit-card-payment-system



\## Submission Checklist



\* \[ ] Application starts successfully with Docker Compose

\* \[ ] Frontend and both API documentation pages load

\* \[ ] Authentication, card management, payments, and transactions are tested

\* \[ ] Django and FastAPI test suites run successfully

\* \[ ] Postman collection is included

\* \[ ] Database schema-only SQL file is included

\* \[ ] UI screenshots and any required submission credentials are prepared securely

\* \[ ] No secrets, tokens, or private application data are committed
