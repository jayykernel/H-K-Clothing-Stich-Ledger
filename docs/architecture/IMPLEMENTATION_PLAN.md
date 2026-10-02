# Implementation Plan for H&K Clothing Management System

## 1. Product Understanding
H&K Clothing is an internal garment manufacturing management system designed to streamline the costing, status follow-up, and order history processes for a clothing manufacturing business. The system aims to provide a single source of truth for business data, support both web and mobile platforms, and ensure data integrity, security, and scalability.

## 2. Functional Requirements
### 2.1 Costing Module
- Multi-step costing wizard with dynamic fabric entry
- Size-specific costing (S, M, L, XL, XXL, XXXL)
- Support for multiple fabrics per garment
- Component-based costing (Main Body, Sleeve, Rib, BNT, Yoke, Other Parts)
- Size-specific measurements and fabric consumption
- Automatic calculation of weight, cost per piece, and total costs
- Costing summary with expandable sections for future cost elements

### 2.2 Status Follow-Up Module
- To-do/work tracking system for orders
- Configurable workflow/tasks (Fabric Received, Cutting, Stitching, etc.)
- Ability to mark tasks as done, which moves them to history
- Notes, remarks, and follow-up dates per task
- View of pending, in-progress, and completed tasks per order

### 2.3 Order History Module
- View of active and completed orders
- Search/filter by order number, style, buyer, date, state
- Traceable order lifecycle from creation to completion
- Linked costing data and workflow history
- Distinction between active, completed, and cancelled orders

## 3. User Roles and Permissions
- **Admin**: Full access to all modules, user management, system configuration
- **Manager**: Access to costing, status follow-up, and history; can create/edit orders and workflows
- **Staff**: Limited access based on assigned tasks (e.g., costing staff, follow-up staff)
- **Viewer**: Read-only access to history and reports

Permissions will be role-based with granular access controls per module and action.

## 4. Recommended Technology Stack
### Frontend Web
- **React 18** with TypeScript
- **Material-UI (MUI)** for professional, responsive components
- **React Router v6** for navigation
- **React Hook Form** with Zod for validation
- **Redux Toolkit** for state management
- **Axios** for API calls

### Frontend Mobile
- **React Native** with TypeScript
- **React Native Paper** for Material Design components
- **React Navigation** for mobile navigation
- **React Hook Form** with Zod (shared validation)
- **Redux Toolkit** (shared state logic)
- **Axios** for API calls

### Backend
- **Node.js 18+** with TypeScript
- **Express.js** framework
- **PostgreSQL** as primary database
- **Prisma ORM** for database access
- **JWT** for authentication
- **Winston** for logging
- **Jest** and **Supertest** for testing

### Shared Packages (Monorepo)
- **TypeScript** configuration
- **Zod** validation schemas
- **API types** and interfaces
- **Utility functions** (date helpers, formatters)
- **Business logic** (costing calculations, workflow rules)

## 5. Why This Stack Was Selected
- **Reliability**: PostgreSQL offers ACID transactions, strong consistency, and mature tooling
- **Maintainability**: TypeScript across stack catches errors early; modular architecture
- **Performance**: React's virtual DOM, efficient SQL queries with proper indexing
- **Mobile + Web Support**: React Native shares business logic and validation with web
- **Secure Authentication**: JWT with refresh tokens, HTTP-only cookies, RBAC
- **Simple Deployment**: Docker containers for backend, static builds for frontend
- **Business Data Integrity**: Foreign keys, constraints, audit trails, soft deletes
- **Scalability**: Horizontal scaling possible with stateless backend and read replicas

## 6. Overall System Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌────────────────────┐
│   Web Client    │    │  Mobile Client   │    │   Admin Dashboard  │
│ (React + MUI)   │    │ (React Native)   │    │ (React + MUI)      │
└─────────┬───────┘    └─────────┬────────┘    └─────────┬──────────┘
          │                      │                         │
          ▼                      ▼                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     API Gateway (Express.js)                        │
│  - Authentication Middleware                                        │
│  - Rate Limiting                                                    │
│  - Request Validation                                               │
│  - API Documentation (Swagger/OpenAPI)                              │
└─────────────┬───────────────────────┬───────────────────────────────┘
              │                       │
              ▼                       ▼
┌─────────────────────┐    ┌─────────────────────┐
│    Costing Service  │    │ Status Follow-Up    │
│  (Business Logic)   │    │   Service           │
└─────────┬───────────┘    └─────────┬───────────┘
          │                          │
          ▼                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Shared Business Logic Layer                     │
│  - Costing Engine                                                   │
│  - Workflow Engine                                                  │
│  - Validation Rules                                                 │
│  - Utility Functions                                                │
└─────────────┬───────────────────────┬───────────────────────────────┘
              │                       │
              ▼                       ▼
┌─────────────────────┐    ┌─────────────────────┐
│    Order Service    │    │   User Service      │
└─────────┬───────────┘    └─────────┬───────────┘
          │                          │
          ▼                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       Database (PostgreSQL)                         │
│  - Users, Roles, Permissions                                        │
│  - Styles, Fabrics, Components                                      │
│  - Orders, Order Items                                              │
│  - Costing Records                                                  │
│  - Workflow Tasks, History                                          │
│  - Audit Logs                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 7. Web Architecture
- Single Page Application (SPA) using React Router
- Code splitting by route for lazy loading
- State management with Redux Toolkit (slices for auth, costing, orders, history)
- API service layer with Axios interceptors for auth token handling
- Form validation with React Hook Form and Zod schemas
- Error boundaries and loading states
- Responsive design with MUI breakpoints
- Accessibility (WCAG 2.1 AA compliant)

## 8. Mobile Architecture
- React Native with TypeScript
- Shared business logic and validation via monorepo packages
- AsyncStorage for offline caching of non-sensitive data
- Push notifications for task assignments (future enhancement)
- Biometric authentication option
- Background sync for data updates
- Platform-specific styling (iOS/Android)

## 9. Backend/API Architecture
- RESTful API with versioning (/api/v1/)
- Modular route structure:
  - `/auth` - login, logout, refresh token
  - `/users` - user management
  - `/styles` - style CRUD
  - `/fabrics` - fabric management
  - `/components` - garment components
  - `/costing` - costing calculations and storage
  - `/orders` - order lifecycle management
  - `/workflow` - status follow-up tasks
  - `/history` - order history queries
- Input validation middleware using Zod
- Centralized error handling
- Logging with Winston (request/response, errors)
- Rate limiting and security headers (helmet)
- CORS configuration

## 10. Database Architecture
### 10.1 Choice: PostgreSQL
- ACID compliance for financial data integrity
- JSONB support for flexible metadata
- Full-text search for order history
- Horizontal scaling options
- Mature ecosystem and tooling

### 10.2 Connection Pooling
- Prisma ORM with connection pooling
- Environment-specific pool sizes
- Monitoring for pool exhaustion

## 11. Database Entities and Relationships
### Core Entities:
1. **User** (id, email, passwordHash, role, createdAt, updatedAt)
2. **Role** (id, name, permissions)
3. **Style** (id, styleNumber, styleName, fabricType, gsm, createdAt, updatedAt)
4. **Fabric** (id, styleId, serialNumber, color, pricePerKg, createdAt, updatedAt)
5. **Component** (id, name, description, createdAt, updatedAt)
6. **Order** (id, orderNumber, styleId, buyer, quantity, deliveryDate, status, createdAt, updatedAt)
7. **OrderItem** (id, orderId, size, quantity, weightPerPiece, fabricCostPerPiece, totalCost)
8. **CostingRecord** (id, orderId, styleDetails, fabricDetails, sizeQuantities, measurements, componentDetails, calculations, createdAt, updatedAt)
9. **WorkflowTask** (id, orderId, taskName, status, assignedTo, notes, dueDate, completedAt, completedBy, createdAt, updatedAt)
10. **AuditLog** (id, entityType, entityId, action, changes, userId, timestamp)

### Key Relationships:
- Style 1:N Fabric (multiple fabrics per style)
- Style 1:N Order (multiple orders per style)
- Order 1:N OrderItem (size-specific quantities)
- Order 1:N CostingRecord (history of costing versions)
- Order 1:N WorkflowTask (tasks per order)
- User 1:N WorkflowTask (assignment and completion tracking)
- All entities have audit trail capability

## 12. Costing Data Model
### CostingRecord:
- `id`: UUID
- `orderId`: UUID (foreign key to Order)
- `styleDetails`: JSON (styleNumber, styleName, baseFabric, baseGSM)
- `fabricDetails`: Array of {serialNumber, color, pricePerKg, associatedComponents: []}
- `sizeQuantities`: {S: number, M: number, L: number, XL: number, XXL: number, XXXL: number}
- `measurements`: JSON by size and component (e.g., {S: {mainBody: {length: 50, width: 40}}, ...})
- `componentDetails`: Array of {name, fabricUsed, dimensions: {length, width}, gsm, panelCount, calculatedWeight}
- `calculations`: JSON with size-specific costs and totals
- `createdAt`, `updatedAt`: Timestamps

## 13. Size-Specific Costing Model
### Approach:
1. Each size has its own quantity entry
2. Measurements stored per size (allowing S, M, L, etc. to have different dimensions)
3. Component dimensions can vary by size
4. Calculations performed per size:
   - Weight per piece = (Length × Width × GSM × panelCount × fabricFactor) / 10000 (conversion from cm² to m² and g to kg)
   - Fabric cost per piece = weight per piece × fabric price per kg
   - Total cost per size = fabric cost per piece × quantity for that size
   - Order total = sum of total cost per size across all sizes
5. Support for future cost elements via extensible calculations JSON

### Unit Conversion Formula:
```
Weight (grams) = (Length_cm × Width_cm × GSM × panelCount × fabricFactor) / 10000
Where:
  Length_cm, Width_cm: dimensions in centimeters
  GSM: grams per square meter
  panelCount: number of fabric pieces needed for component
  fabricFactor: 2 for symmetric components (left/right), 1 for single
  Division by 10000 converts cm² to m² (since GSM is g/m²)
Result: weight in grams
```

## 14. Fabric-to-Component Relationship Model
### Implementation:
- In `CostingRecord.componentDetails`, each component specifies:
  - `fabricUsed`: reference to fabric serial number or fabric ID
  - This links the component to a specific fabric entry
- During calculation:
  1. For each component, find the fabric price from `fabricDetails` using `fabricUsed`
  2. Calculate component weight using its dimensions and the linked fabric's GSM
  3. Component cost = component weight × fabric price per kg
- Supports:
  - Multiple fabrics per garment
  - Different fabrics per component
  - Components that don't use main fabric
  - Future addition of trims/notions via separate cost tracking

## 15. Costing Formulas and Units
### Documented Formulas:
1. **Component Weight (grams)**:
   ```
   = (Length_cm × Width_cm × GSM × panelCount × fabricFactor) / 10000
   ```
   *Example: 50cm × 40cm × 180 GSM × 2 panels × 2 (symmetric) / 10000 = 1440g*

2. **Fabric Cost per Piece**:
   ```
   = (Component Weight in grams / 1000) × pricePerKg
   ```

3. **Total Cost per Size**:
   ```
   = Σ (Component Fabric Cost per Piece) × quantity for that size
   ```

4. **Order Total Cost**:
   ```
   = Σ (Total Cost per Size) for all sizes
   ```

### Units:
- Length/Width: centimeters (cm)
- GSM: grams per square meter (g/m²)
- Weight: grams (g) for calculation, displayed in kg (divide by 1000)
- Price: currency per kg
- Cost: currency

## 16. Order Lifecycle
### States:
1. **DRAFT**: Costing completed, order not yet submitted
2. **ACTIVE**: Order submitted, workflow tasks pending/in-progress
3. **ON_HOLD**: Active but paused (e.g., waiting for materials)
4. **COMPLETED**: All required workflow tasks marked done
5. **CANCELLED**: Order cancelled at any stage
6. **ARCHIVED**: Completed order moved to archive (configurable retention)

### Transition Rules:
- DRAFT → ACTIVE: When user submits order
- ACTIVE → ON_HOLD: Manual hold or automatic (e.g., missing materials)
- ON_HOLD → ACTIVE: When hold reason resolved
- ACTIVE → COMPLETED: When all required tasks are DONE
- ACTIVE → CANCELLED: User cancellation with reason
- COMPLETED → ARCHIVED: After retention period or manual archive

## 17. Status Follow-Up Workflow
### Workflow Engine:
- Configurable task templates per order type
- Each task has:
  - `taskName`: string (e.g., "Fabric Received")
  - `isRequired`: boolean (affects completion criteria)
  - `dependsOn`: array of task names (optional dependencies)
  - `assignedToRole`: string (suggested assignee)
- State transitions:
  - PENDING → IN_PROGRESS: When work starts
  - IN_PROGRESS → PENDING: If work needs to be redone
  - IN_PROGRESS → DONE: When completed
  - DONE → HISTORY: Automatically moved when marked done

### Completion Criteria:
- Order is COMPLETED when all `isRequired` tasks are DONE
- Optional tasks can be skipped or remain PENDING
- Dependencies block task start until predecessors are DONE

## 18. How Completed Tasks Move into History
- When a WorkflowTask status changes to DONE:
  1. Set `completedAt` timestamp
  2. Set `completedBy` user ID
  3. Preserve `notes` and other fields
  4. Task remains in WorkflowTask table but is filtered out of active views
  5. History queries include completed tasks with completion metadata
- No deletion of tasks - preserves full audit trail
- Index on `status` and `completedAt` for efficient querying

## 19. How Active and Completed Orders Appear in History
### History View Shows:
- **Active Orders**: Orders with status ACTIVE or ON_HOLD
  - Display current workflow progress
  - Show pending/in-progress tasks
  - Link to current costing record
- **Completed Orders**: Orders with status COMPLETED
  - Show final costing used
  - Display all workflow tasks with completion timestamps
  - Show total time in each stage
- **Cancelled Orders**: Orders with status CANCELLED
  - Show cancellation reason and timestamp
  - Display partial workflow history

### Filtering:
- Toggle between Active/Completed/Cancelled
- Search by order number, style, buyer
- Date range filters
- Status filters (pending tasks, etc.)

## 20. Authentication and Authorization Design
### Authentication:
- **Username/Email + Password** with bcrypt hashing (salt rounds: 12)
- **JWT Access Token**: 15-minute expiry, stored in memory
- **Refresh Token**: 7-day expiry, HTTP-only cookie, rotated on use
- **Optional**: Biometric login (mobile) or SSO (future)
- **Password Reset**: Email-based with time-limited token

### Authorization:
- **Role-Based Access Control (RBAC)**:
  - Permissions defined as `module:action` (e.g., `costing:create`, `workflow:update`)
  - Roles assigned permissions
  - Users assigned to roles
- **Middleware**: Express middleware checks permissions per route
- **Object-Level Security**:
  - Orders: Users can only access orders they created or are assigned to (unless admin/manager)
  - Costing Records: Linked to order permissions
  - Workflow Tasks: Assignment-based access with escalation paths
- **Audit Logging**: All authentication attempts and permission checks logged

## 21. Validation Strategy
### Frontend Validation:
- **React Hook Form** with **Zod** schemas
- Real-time field validation
- Form-level validation on submit
- Prevents invalid data submission

### Backend Validation:
- **Zod** schemas for all API endpoints
- Validation middleware runs before controllers
- Database constraints as last line of defense
- Sanitization to prevent injection

### Shared Validation:
- Monorepo package `@hk-clothing/validation` contains:
  - Zod schemas for entities
  - Custom refinements (e.g., positive numbers, valid sizes)
  - Reused across web, mobile, and backend

### Business Rule Validation:
- Costing: Ensure all required fields present before calculation
- Workflow: Prevent circular dependencies in task dependencies
- Order: Quantity must match sum of size quantities

## 22. Error Handling
### Frontend:
- Global error boundary in React
- User-friendly error messages (no stack traces)
- Retry mechanisms for failed requests
- Offline queue for non-critical updates (mobile)

### Backend:
- Centralized error handling middleware
- Distinction between:
  - Operational errors (validation, not found) → 4xx
  - System errors (DB failure, etc.) → 500 with internal logging
- Error logging with Winston (includes request ID for tracing)
- Sentry integration for production error tracking
- Graceful degradation: non-critical features fail silently

### Database:
- Transaction rollback on failure
- Constraint violation handling (unique, foreign key)
- Deadlock detection and retry logic (max 3 attempts)

## 23. Security Considerations
### Data Protection:
- **Encryption**: TLS 1.3 for all traffic, sensitive fields encrypted at rest (PII)
- **Secrets Management**: Environment variables, AWS Secrets Manager (production)
- **Input Sanitization**: Prevent XSS, SQL injection, NoSQL injection
- **CSRF Protection**: Same-site cookies, double-submit cookie for SPA
- **Rate Limiting**: Per-IP and per-user limits on auth endpoints
- **Security Headers**: Helmet.js (HSTS, CSP, X-Frame-Options, etc.)

### Access Control:
- Principle of least privilege
- Regular permission audits
- Session timeout and re-authentication for sensitive actions
- Admin actions require MFA (future)

### Monitoring:
- Request/response logging (excluding sensitive data)
- Failed login attempts monitoring
- Database query performance monitoring
- Regular security scanning (dependencies, container images)

## 24. Testing Strategy
### Unit Testing:
- **Jest** for backend services and utilities
- **React Testing Library** for frontend components
- **Coverage target**: 80%+ for critical paths
- Mock external services (email, payment gateways)

### Integration Testing:
- **Supertest** for API endpoints
- Test database transactions with rollback
- Validate API contracts and error responses
- Test authentication flows

### End-to-End Testing:
- **Cypress** for web application
- **Detox** for mobile application
- Critical user journeys:
  - Complete costing workflow
  - Create order and follow tasks to completion
  - View history and filter results

### Performance Testing:
- **Artillery** or **k6** for load testing
- Test concurrent users (target: 100+)
- Monitor response times and throughput
- Database query optimization based on results

### Manual Testing:
- Exploratory testing for edge cases
- User acceptance testing with business stakeholders
- Accessibility testing (WCAG compliance)

## 25. Folder/Repository Structure
### Monorepo Structure (using Yarn Workspaces or NPM Workspaces):
```
hk-clothing/
├── package.json                  # Root workspace config
├── turbo.json                   # Build system config (Turborepo)
├── .eslintrc.js                 # Shared ESLint config
├── .prettierrc                  # Shared Prettier config
├── apps/
│   ├── web/                     # React web application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── styles/
│   │   │   ├── utils/
│   │   │   └── App.tsx
│   │   ├── public/
│   │   ├── tailwind.config.js   # If using Tailwind (alternative to MUI)
│   │   └── tsconfig.json
│   ├── mobile/                  # React Native mobile application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── navigation/
│   │   │   ├── screens/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── utils/
│   │   │   └── App.tsx
│   │   ├── android/
│   │   ├── ios/
│   │   └── tsconfig.json
│   └── admin/                   # Optional separate admin dashboard
├── packages/
│   ├── validation/              # Shared Zod schemas
│   ├── api-types/               # Shared TypeScript interfaces
│   ├── utils/                   # Shared utility functions
│   ├── business-logic/          # Shared costing/workflow calculations
│   ├── ui-components/           # Shared component library (web/mobile)
│   └── eslint-config/           # Shared ESLint configuration
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── config/
│   │   └── server.ts
│   ├── prisma/                  # Prisma schema and migrations
│   ├── test/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── USER_GUIDE.md
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
├── .env.example
├── README.md
└── docker-compose.yml           # Local development
```

## 26. Environment/Configuration Strategy
### Configuration Management:
- **dotenv** for environment variables
- Separate files: `.env.development`, `.env.staging`, `.env.production`
- **Config Service**: Centralized configuration access
- **Feature Flags**: LaunchDarkly or custom implementation for gradual rollouts

### Environment Variables:
```
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/hk_clothing"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
BCRYPT_SALT_ROUNDS=12
SESSION_COOKIE_SECURE=false   # true in production
SESSION_COOKIE_SAMESITE=lax
RATE_LIMIT_WINDOW_MS=900000   # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Secrets Management:
- Development: `.env` files (gitignored)
- Staging/Production: AWS Secrets Manager or HashiCorp Vault
- CI/CD pipelines inject secrets as environment variables

## 27. Deployment Architecture
### Development:
- Docker Compose for local development:
  - Backend container (Node.js)
  - PostgreSQL container
  - Adminer for DB inspection
- Hot reload for frontend applications

### Staging:
- AWS ECS Fargate or Azure Container Instances
- Managed PostgreSQL (RDS/Azure Database for PostgreSQL)
- Application Load Balancer
- CloudWatch logging and monitoring
- Blue/Green deployments

### Production:
- Same as staging with:
  - Auto-scaling groups based on CPU/memory
  - Database read replicas for reporting queries
  - CDN for static assets (CloudFront/Azure CDN)
  - WAF (Web Application Firewall)
  - Regular backups and point-in-time recovery
  - Disaster recovery plan (multi-region)

### CI/CD Pipeline:
1. Code commit to main branch
2. Run unit and integration tests
3. Build Docker images
4. Push to container registry
5. Deploy to staging
6. Run smoke tests
7. Manual approval for production
8. Deploy to production
9. Post-deployment validation

## 28. Development Phases
### Phase 0: Project Setup (Week 1)
- Initialize monorepo
- Setup shared packages (validation, types, utils)
- Configure backend with Express, Prisma, PostgreSQL
- Implement basic authentication
- Create database schema for core entities
- Definition of Done: 
  - Repository structure in place
  - Backend can start and connect to DB
  - Auth endpoints work (register, login)
  - Basic health check endpoint

### Phase 1: Costing Module Core (Weeks 2-4)
- Implement Style, Fabric, Component CRUD
- Build costing wizard UI (web first)
- Implement size-specific costing calculations
- Create CostingRecord storage and retrieval
- Definition of Done:
  - User can complete a full costing for a style
  - System calculates size-specific costs correctly
  - Costing records persist and can be retrieved
  - Unit tests for costing engine (80% coverage)

### Phase 2: Order Management (Weeks 5-6)
- Order CRUD operations
- Link orders to costing records
- Basic order listing and filtering
- Definition of Done:
  - Users can create orders from costing records
  - Orders store referenced costing and style info
  - Order list shows key info (number, style, buyer, status)

### Phase 3: Status Follow-Up Module (Weeks 7-9)
- Workflow task templates
- Order workflow implementation
- Task completion and history tracking
- Pending/in-progress/completed task views
- Definition of Done:
  - Configurable workflow per order type
  - Tasks can be marked done and move to history
  - Order status updates based on task completion
  - History view shows completed tasks with timestamps

### Phase 4: Order History & Reporting (Weeks 10-11)
- History search and filtering
- Active vs completed order views
- Export capabilities (CSV/PDF)
- Definition of Done:
  - Users can search history by multiple fields
  - Clear separation of active/completed orders
  - Order lifecycle traceable from costing to completion
  - Basic reports on order volumes and timelines

### Phase 5: Mobile Application (Weeks 12-14)
- React Native setup with shared packages
- Implement core screens: login, costing, order list, history
- Offline capabilities for non-sensitive data
- Definition of Done:
  - Mobile app authenticates and syncs with backend
  - Core costing workflow functional on mobile
  - Order creation and viewing works
  - Basic history viewing available

### Phase 6: Security & Performance (Weeks 15-16)
- Implement security headers, rate limiting
- Add refresh token rotation
- Performance optimization (indexing, query optimization)
- Load testing and bottleneck resolution
- Definition of Done:
  - All security headers in place
  - Authentication secure with proper token handling
  - API response times under 2s for 95% of requests
  - No critical vulnerabilities in dependency scan

### Phase 7: Testing & QA (Weeks 17-18)
- Comprehensive test suite implementation
- End-to-end testing for critical paths
- User acceptance testing with business users
- Bug fixing and polishing
- Definition of Done:
  - Test coverage meets targets
  - UAT sign-off from stakeholders
  - All critical and high bugs resolved
  - Ready for production deployment

## 29. Detailed Implementation Steps for Each Phase
### Phase 0 Steps:
1. Initialize monorepo with workspace tool
2. Set up shared ESLint, Prettier, TypeScript configs
3. Create backend folder with Express server
4. Configure Prisma with PostgreSQL provider
5. Define initial User, Role schemas
6. Implement auth routes: register, login, logout
7. Create JWT utility functions
8. Set up Docker compose for dev environment
9. Write basic health check endpoint
10. Create README with setup instructions

### Phase 1 Steps:
1. Define Style, Fabric, Component Prisma schemas
2. Generate migration and apply to DB
3. Create REST controllers for CRUD operations
4. Build web UI for style/fabric/component management
5. Implement costing wizard step-by-step UI
6. Create costing calculation service with size-specific logic
7. Store costing results in CostingRecord table
8. Create API endpoints for save/get costing
9. Build costing summary view with calculations
10. Write unit tests for calculation formulas
11. Implement form validation with Zod schemas
12. Add error handling and loading states

### Phase 2 Steps:
1. Define Order and OrderItem Prisma schemas
2. Generate and apply migration
3. Create order creation flow from costing
4. Implement order listing with filtering/search
5. Add API endpoints for order CRUD
6. Build order detail view showing linked costing
7. Implement order submission (DRAFT to ACTIVE transition)
8. Add validation for order completeness
9. Create unit tests for order service
10. Implement soft delete for orders (archive flag)

### Phase 3 Steps:
1. Define WorkflowTask Prisma schema
2. Create workflow template configuration
3. Implement task assignment and due dates
4. Build web UI for task management per order
5. Create API endpoints for task CRUD and status updates
6. Implement business logic for workflow progression
7. Add automatic status updates when tasks done
8. Create history view for completed tasks
9. Add notes and remarks functionality
10. Implement task dependencies (blocking)
11. Write tests for workflow engine
12. Add notifications for task assignments (future placeholder)

### Phase 4 Steps:
1. Enhance order listing with active/completed filters
2. Implement history search by multiple fields
3. Create order detail view showing full lifecycle
4. Add export functionality (CSV) for history
5. Implement order cancellation with reason
6. Add audit logging for order status changes
7. Create reports dashboard (basic charts)
8. Optimize history queries with indexes
9. Write tests for history service
10. Implement pagination for large history sets

### Phase 5 Steps:
1. Set up React Native project with Expo CLI
2. Share validation and types packages via workspace
3. Implement authentication screens (login, forgot password)
4. Build costing wizard adapted for mobile
5. Create order list and detail views
6. Implement history viewing with filters
7. Add offline caching for reference data (styles, fabrics)
8. Implement background sync when online
9. Test on iOS/Android emulators and devices
10. Create release builds for internal distribution

### Phase 6 Steps:
1. Implement Helmet.js for security headers
2. Add rate limiting middleware (express-rate-limit)
3. Configure CORS restrictions
4. Add input sanitization middleware
5. Implement refresh token rotation
6. Add bcrypt salt rounds configuration
7. Perform dependency security audit (npm audit)
8. Add database indexes for frequent query patterns
9. Optimize costing calculation queries
10. Implement pagination for large result sets
11. Add request/response logging with Winston
12. Conduct load testing with Artillery
13. Fix performance bottlenecks

### Phase 7 Steps:
1. Write unit tests for all business logic
2. Create integration tests for API endpoints
3. Implement end-to-end tests with Cypress (web)
4. Implement end-to-end tests with Detox (mobile)
5. Conduct user acceptance testing sessions
6. Gather feedback and implement usability improvements
7. Fix all identified bugs
8. Write final documentation (API, user guide)
9. Prepare production deployment checklist
10. Conduct final security review

## 30. Definition of Done for Each Phase
Each phase is considered complete when:
- All planned features are implemented per specification
- Code passes linting with no errors
- Unit tests achieve minimum coverage threshold (80%)
- Integration tests pass for new functionality
- Manual QA verifies functionality on staging environment
- Documentation updated for new features
- No critical or high severity bugs remain
- Performance benchmarks met (if applicable)
- Security checks pass (no new vulnerabilities)

## 31. Risks and Edge Cases
### Risks:
1. **Scope Creep**: Mitigated by phased approach and clear phase goals
2. **Performance Degradation**: Addressed with indexing, query optimization, and caching
3. **Security Vulnerabilities**: Mitigated by regular audits, penetration testing, and secure coding practices
4. **Data Loss**: Prevented by transactions, constraints, backups, and audit trails
5. **Integration Complexity**: Reduced by shared validation and business logic packages
6. **Mobile Fragmentation**: Addressed by using React Native and testing on multiple devices

### Edge Cases Analyzed:
1. **Different Measurements by Size**: Stored per size in measurements JSON
2. **Zero Quantities for Sizes**: Handled in calculations (zero contribution to total)
3. **Styles with Partial Size Range**: System only requires defined sizes
4. **Adding New Sizes**: Extensible via configuration (no code change)
5. **Editing Existing Costing**: Creates new CostingRecord version, preserves history
6. **Historical Costing on Edit**: Old versions retained, linked to order at time of creation
7. **Reusing Styles**: Multiple orders can reference same style
8. **Partially Completed Orders**: Workflow shows pending tasks
9. **Accidental Task Completion**: Requires reopening workflow (with reason) or creates new task instance
10. **Cancelled Orders**: Status change preserves audit trail
11. **Concurrent Editing**: Optimistic locking via version fields or last-write-wins with audit
12. **Data Backup**: Regular automated backups with point-in-time recovery
13. **Auditability**: All changes logged with user, timestamp, and diff

## 32. Future Extensibility
### Planned Extensibility Points:
1. **Costing Engine**: 
   - Plugin system for additional cost elements (cutting, stitching, etc.)
   - Support for trims and notions as separate component types
   - Integration with external pricing APIs for fabric costs
2. **Workflow Engine**:
   - Visual workflow designer for non-technical users
   - SLA tracking and automated escalations
   - Mobile push notifications for task assignments
3. **Reporting & Analytics**:
   - Advanced dashboards (Power BI/MetaBase integration)
   - Predictive analytics for delivery dates
   - Supplier performance tracking
4. **Integration Capabilities**:
   - REST API for ERP/system integration
   - Webhooks for external system notifications
   - EDI support for supplier/customer transactions
5. **Mobile Enhancements**:
   - Barcode scanning for fabric/receipt tracking
   - Offline-first capabilities with conflict resolution
   - Augmented reality for garment visualization
6. **Admin & Configuration**:
   - Role-based workflow templates
   - Dynamic form builder for custom fields
   - Multi-tenancy for potential SaaS offering

---

## A. Final Recommended Stack
**Frontend Web**: React 18 + TypeScript + MUI + React Hook Form + Zod + Redux Toolkit  
**Frontend Mobile**: React Native + TypeScript + React Native Paper + React Navigation + Shared Validation/State  
**Backend**: Node.js 18 + TypeScript + Express + Prisma ORM + PostgreSQL + JWT + Winston  
**Database**: PostgreSQL 14+  
**Shared**: Monorepo with Yarn/NPM Workspaces for validation, types, utilities, business logic  
**DevOps**: Docker + Docker Compose (dev), AWS ECS/Azure CI (staging/prod), GitHub Actions CI/CD  

## B. Final Architecture Diagram in Text Form
```
[Web Client]       [Mobile Client]       [Admin Dashboard]
        │                 │                       │
        ▼                 ▼                       ▼
    [API Gateway] ◄─────┼─────► [API Gateway] ◄─────┼─────► [API Gateway]
        │                 │                       │
        ▼                 ▼                       ▼
[Auth Service]  [Costing Service]  [Order Service]  [Workflow Service]  [User Service]
        │                 │                 │                 │                 │
        └─────────────────┼─────────────────┼─────────────────┼─────────────────┘
                          ▼
                  [Shared Business Logic Layer]
                          │
                          ▼
                   [PostgreSQL Database]
                          │
        ┌─────────────────┼─────────────────┼─────────────────┐
        ▼                 ▼                 ▼                 ▼
    [Users]           [Styles]          [Orders]        [WorkflowTasks]
    [Roles]         [Fabrics]         [OrderItems]      [AuditLogs]
    [Sessions]   [Components]    [CostingRecords]  [etc.]
```

## C. Final Database/Entity Relationship Overview
**Core Tables**: Users, Roles, Styles, Fabrics, Components, Orders, OrderItems, CostingRecords, WorkflowTasks, AuditLogs  
**Key Relationships**: 
- Styles → Fabrics (1:N)
- Styles → Orders (1:N)
- Orders → OrderItems (1:N)
- Orders → CostingRecords (1:N)
- Orders → WorkflowTasks (1:N)
- Users → WorkflowTasks (1:N for assignment/completion)
All tables include: id (UUID), createdAt, updatedAt, and relevant audit fields  

## D. Final Costing Calculation Flow
1. User enters style details and fabric information
2. User specifies quantities per size (S, M, L, XL, XXL, XXXL)
3. User enters measurements per component per size (optional, defaults available)
4. System calculates per component:
   - Weight (g) = (Length_cm × Width_cm × GSM × panelCount × fabricFactor) / 10000
   - Fabric Cost = (Weight / 1000) × pricePerKg
5. System sums component costs per size
6. Total Cost per Size = (Sum of Component Costs) × Quantity for that size
7. Order Total Cost = Σ (Total Cost per Size) for all sizes
8. Results stored in CostingRecord with size-specific breakdown

## E. Final Order/Status/History Flow
1. User completes costing → saves as CostingRecord
2. User creates order from costing → Order in DRAFT status
3. User submits order → status changes to ACTIVE
4. System creates WorkflowTasks from order type template
5. User marks tasks as done → tasks move to completed state
6. When all required tasks DONE → order status changes to COMPLETED
7. COMPLETED orders appear in history with full task completion timestamps
8. ACTIVE orders show pending/in-progress tasks
9. CANCELLED orders show cancellation reason and partial history

## F. Ordered Implementation Roadmap
1. Phase 0: Project Setup & Authentication
2. Phase 1: Costing Module Core
3. Phase 2: Order Management
4. Phase 3: Status Follow-Up Module
5. Phase 4: Order History & Reporting
6. Phase 5: Mobile Application
7. Phase 6: Security & Performance
8. Phase 7: Testing & QA

## G. Phase-by-Plan Milestones
| Phase | Duration | Key Milestones |
|-------|----------|----------------|
| 0     | Week 1   | Repo setup, auth working, DB connected |
| 1     | Weeks 2-4| Costing wizard complete, calculations accurate |
| 2     | Weeks 5-6| Order creation from costing, basic listing |
| 3     | Weeks 7-9| Workflow tasks functional, history tracking |
| 4     | Weeks 10-11| History search, active/completed separation |
| 5     | Weeks 12-14| Mobile app core features working |
| 6     | Weeks 15-16| Security hardened, performance optimized |
| 7     | Weeks 17-18| Comprehensive testing, UAT sign-off |

## H. What Should Be Implemented First
**Phase 0: Project Setup and Authentication** should be implemented first because:
1. Establishes the development foundation
2. Enables secure access to all subsequent features
3. Provides immediate value (login/logout functionality)
4. Allows early testing of backend connectivity
5. Creates reusable patterns (API structure, validation, error handling)
6. Reduces risk by verifying core infrastructure before building business logic

Implementing authentication first ensures that all subsequent development happens within a secure, tested framework, preventing rework and security gaps later in the project.
