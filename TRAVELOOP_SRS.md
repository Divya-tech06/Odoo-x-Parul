# Software Requirements Specification (SRS)
## Traveloop - Trip Planning & Budget Management Platform

**Document Version**: 1.0  
**Date**: May 10, 2026  
**Status**: Active Development  
**Project Name**: Traveloop  
**Product Version**: 0.1.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Business Requirements](#business-requirements)
4. [Functional Requirements](#functional-requirements)
5. [Non-Functional Requirements](#non-functional-requirements)
6. [System Architecture](#system-architecture)
7. [Technology Stack](#technology-stack)
8. [Database Requirements](#database-requirements)
9. [API Specifications](#api-specifications)
10. [Security Requirements](#security-requirements)
11. [Performance Requirements](#performance-requirements)
12. [Deployment Requirements](#deployment-requirements)
13. [Future Enhancements](#future-enhancements)

---

## 1. Executive Summary

Traveloop is a comprehensive web-based trip planning and budget management platform designed to help travelers organize, plan, and track their journeys efficiently. The application provides an intuitive interface for creating trips, planning stops/cities, managing activities, tracking expenses, and sharing itineraries with others.

**Key Objective**: Enable users to seamlessly plan multi-city trips with real-time budget tracking, weather updates, and collaborative sharing capabilities.

---

## 2. Project Overview

### 2.1 Project Vision

Create a modern, user-friendly platform that eliminates the complexity of trip planning by providing an integrated solution for itinerary planning, budget management, and travel collaboration.

### 2.2 Target Users

- **Primary**: Individual travelers, groups planning trips, travel enthusiasts
- **Secondary**: Travel agencies, tour operators, event planners
- **Age Group**: 18-65 years
- **Geographic**: Global (multi-language support planned)

### 2.3 Project Scope

**In Scope**:
- User authentication and profile management
- Trip creation and management
- Stop/city planning with dates
- Activity planning and tracking
- Expense tracking and budget management
- Weather forecasting integration
- Trip sharing with public links
- Currency conversion support
- Responsive design (desktop, tablet, mobile)

**Out of Scope** (MVP):
- Real-time collaboration/comments
- Advanced payment processing
- Mobile native apps
- Video/photo upload
- AI-powered recommendations
- Third-party booking integrations

---

## 3. Business Requirements

### 3.1 Business Goals

1. **User Acquisition**: Target 10,000+ active users in first year
2. **Engagement**: 70% monthly active user retention
3. **Monetization**: Freemium model with premium features in Phase 2
4. **Platform Expansion**: Web → Mobile Apps → Travel Partner Integrations

### 3.2 Success Criteria

- ✅ Zero authentication failures
- ✅ <500ms API response time (p95)
- ✅ 99.5% uptime SLA
- ✅ Support multi-currency operations
- ✅ Handle 100,000+ concurrent users

### 3.3 Constraints

- Development timeline: 6 months MVP
- Budget: Moderate cloud infrastructure costs
- Team: 6-8 developers
- Legal: GDPR, CCPA compliance required

---

## 4. Functional Requirements

### 4.1 Authentication & User Management

**FR-1: User Registration**
- Users can create account with name, email, password
- Password minimum 8 characters with at least 1 digit
- Email verification (future enhancement)
- OAuth2 integration with Google

**FR-2: User Login**
- Email/password authentication
- Social login (Google)
- Session management via JWT
- "Remember me" functionality (future)
- Password reset email (future)

**FR-3: User Profile**
- View/edit name, email, profile picture
- Change password
- Privacy settings
- Delete account option

**FR-4: Session Management**
- 30-day session expiry
- Logout functionality
- Automatic session timeout on inactivity
- Multi-device session tracking (future)

### 4.2 Trip Management

**FR-5: Create Trip**
- Provide trip title (required)
- Add description (optional)
- Set start/end dates (optional)
- Upload cover image
- Initial trip is PRIVATE
- Unique shareToken generated automatically

**FR-6: View Trips**
- List all user's trips
- Display trip summary: title, stop count, total cost
- Sort by date created, alphabetical, budget
- Filter by status (upcoming, ongoing, completed)
- Search trips by title/description

**FR-7: Edit Trip**
- Modify title, description, dates
- Update cover image
- Change budget target and currency
- Update visibility (PUBLIC/PRIVATE)
- Change cover image

**FR-8: Delete Trip**
- Soft delete with 30-day recovery (future)
- Hard delete option
- Cascade delete: stops, activities, expenses, notes

**FR-9: Share Trip**
- Generate shareable public link
- Toggle visibility (PUBLIC/PRIVATE)
- Change shareToken
- View shared trip (public link, no auth required)
- Public view read-only access

### 4.3 Stop/City Management

**FR-10: Add Stop to Trip**
- Search cities by name (debounced)
- Select from search results
- Auto-populate: city, country, countryCode, lat/long
- Set arrival date
- Set departure date
- Upload stop-specific cover image
- Set order (drag-and-drop)

**FR-11: View Stops**
- Timeline view of all stops in trip
- Ordered by sequence (orderIndex)
- Display dates, activities count, total cost per stop
- Highlight selected stop

**FR-12: Edit Stop**
- Modify city information
- Change arrival/departure dates
- Update cover image
- Reorder within trip

**FR-13: Delete Stop**
- Remove stop from trip
- Cascade delete all activities in stop
- Reorder remaining stops automatically

**FR-14: Reorder Stops**
- Drag-and-drop interface
- Update orderIndex in database
- Persist order immediately

### 4.4 Activity Management

**FR-15: Create Activity**
- Add to specific stop and date
- Title (required)
- Category: hotels, transport, activities, food, miscellaneous
- Cost (optional)
- Currency (default: INR)
- Duration in hours (optional)
- Date (defaults to stop's arrival date)
- Notes (optional)
- Image URL (optional)

**FR-16: View Activities**
- List by stop
- Timeline view with date grouping
- Display cost, category, duration
- Activity cards with preview

**FR-17: Edit Activity**
- Modify all activity fields
- Change category
- Update cost and currency
- Move to different date

**FR-18: Delete Activity**
- Remove from stop
- Auto-update budget calculations

**FR-19: Sort Activities**
- Drag-and-drop reordering
- Sort by date, cost, category

### 4.5 Expense Management

**FR-20: Create Expense**
- Trip-level expense (not tied to specific stop)
- Category: hotels, transport, activities, food, miscellaneous
- Amount (required)
- Currency (default: INR)
- Description (optional)
- Date (defaults to today)

**FR-21: View Expenses**
- List all trip expenses
- Filter by category
- Sort by date, amount
- Display total expenses

**FR-22: Edit Expense**
- Modify amount, currency, category, description, date

**FR-23: Delete Expense**
- Remove expense from trip
- Auto-update budget

### 4.6 Budget Management

**FR-24: Budget Tracking**
- Calculate total cost: sum of all activities + expenses
- Group expenses by category
- Display budget breakdown (hotels, transport, food, etc.)
- Calculate per-day average spend
- Track remaining budget vs. target

**FR-25: Set Budget Target**
- Set trip-wide budget limit
- Specify currency
- Visual indicator when approaching limit
- Budget warning at 80%, 90%, 100%

**FR-26: Currency Management**
- Set base currency per trip
- Support 100+ currencies
- Real-time exchange rate fetching
- Fallback to cached rates
- Display all costs in base currency

**FR-27: Budget Visualization**
- Pie chart: cost breakdown by category
- Bar chart: daily spending trend
- Progress bar: budget utilization
- Summary cards: total, remaining, average daily

### 4.7 Weather Integration

**FR-28: View Weather**
- Display current weather for each stop
- Show 5-day forecast
- Include temperature, humidity, wind speed
- Display weather icon
- Update weather on demand

**FR-29: Weather Notifications**
- Alert on extreme weather (future)
- Weather trends during trip dates

### 4.8 Notes Management

**FR-30: Create Note**
- Add note to trip
- Optional: tie note to specific stop
- Rich text editor (future)
- Auto-save notes

**FR-31: Edit Note**
- Modify note content
- Change associated stop (if any)

**FR-32: Delete Note**
- Remove note from trip

### 4.9 Search & Filtering

**FR-33: City Search**
- Debounced search input
- Real-time suggestions
- Display city name, country, population
- Geolocation data included

**FR-34: Global Search**
- Search trips by title, description
- Search activities by title
- Search notes by content (future)

### 4.10 Notifications & Alerts

**FR-35: Budget Alerts**
- Notify when budget limit exceeded
- Notify at 80% budget utilization

**FR-36: Trip Reminders** (Future)
- Pre-trip reminder emails
- Daily itinerary emails during trip

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| Metric | Target | Tolerance |
|--------|--------|-----------|
| API Response Time (p50) | <200ms | ±50ms |
| API Response Time (p95) | <500ms | ±100ms |
| Page Load Time | <3s | ±1s |
| Search Response | <500ms | ±200ms |
| Database Query | <100ms | ±50ms |

### 5.2 Scalability Requirements

- Support 100,000+ concurrent users
- 1M+ trips in database
- Horizontal scaling via load balancers
- Database replication and backup
- CDN for static assets

### 5.3 Availability Requirements

- **Uptime SLA**: 99.5% (max 3.6 hours downtime/month)
- **RTO** (Recovery Time Objective): <1 hour
- **RPO** (Recovery Point Objective): <5 minutes
- Automated backups every 6 hours
- Multi-region failover (future)

### 5.4 Security Requirements

- End-to-end HTTPS/TLS encryption
- JWT token-based authentication (30-day expiry)
- OWASP Top 10 vulnerability protection
- SQL injection prevention (Prisma ORM)
- XSS protection (React escaping)
- CSRF token validation
- Rate limiting on API endpoints
- Password hashing: bcryptjs (12 rounds)
- GDPR/CCPA compliance
- PCI DSS compliance (if payment processing added)

### 5.5 Reliability Requirements

- Mean Time Between Failures (MTBF): >720 hours
- Mean Time To Recovery (MTTR): <30 minutes
- Error rate: <0.1%
- Data consistency: ACID compliance

### 5.6 Usability Requirements

- Intuitive UI with minimal learning curve
- Responsive design: mobile (320px), tablet (768px), desktop (1024px+)
- Accessibility: WCAG 2.1 AA compliance
- Load time: <3 seconds on 4G
- Multi-language support (future: English, Spanish, French, German, Chinese)

### 5.7 Maintainability Requirements

- Code documentation: JSDoc for all functions
- Unit test coverage: >80%
- Integration test coverage: >60%
- E2E test coverage: >40%
- CI/CD pipeline with automated testing
- Semantic versioning for releases

### 5.8 Compatibility Requirements

- **Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Operating Systems**: Windows, macOS, Linux
- **Mobile**: iOS 12+, Android 8+
- **Database**: PostgreSQL 13+
- **Node.js**: 18+

---

## 6. System Architecture

### 6.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          CDN (Images)                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Load Balancer (Nginx)                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                   Next.js Application Servers                    │
│  (Horizontal scaling: 2-n instances)                             │
│  • Frontend (React)                                              │
│  • API Routes                                                    │
│  • Middleware (Auth)                                             │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database Cluster                     │
│  • Primary (write)                                               │
│  • Read Replica                                                  │
│  • Automated backups                                             │
└──────────────────────────────────────────────────────────────────┘
                ↓ (read-only)        ↓ (external calls)
       ┌─────────────────┐    ┌──────────────────────┐
       │  Redis Cache    │    │   External APIs      │
       │  (Sessions)     │    │ • RapidAPI (Cities)  │
       └─────────────────┘    │ • OpenWeather        │
                              │ • Currency Exchange  │
                              │ • Unsplash (Images)  │
                              └──────────────────────┘
```

### 6.2 Deployment Architecture

- **Hosting**: Vercel (primary), AWS/GCP (fallback)
- **Database**: AWS RDS PostgreSQL
- **Cache**: Redis on AWS ElastiCache
- **CDN**: Cloudflare/CloudFront
- **Monitoring**: DataDog/New Relic
- **Logging**: ELK Stack / CloudWatch

---

## 7. Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand (app state), React Query (server state)
- **Forms**: React Hook Form + Zod (validation)
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: NextAuth.js v5
- **Password Hashing**: bcryptjs
- **API Documentation**: OpenAPI/Swagger (future)

### Database
- **Primary**: PostgreSQL 13+
- **Caching**: Redis (sessions, rate limiting)
- **Search** (future): Elasticsearch

### DevOps & Deployment
- **Version Control**: Git/GitHub
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Container Registry**: Docker Hub / ECR
- **Orchestration**: Kubernetes (future scaling)
- **Infrastructure as Code**: Terraform (future)

### External Services
- **Authentication**: Google OAuth
- **APIs**:
  - RapidAPI GeoDB (City search)
  - OpenWeatherMap API (Weather)
  - Currency Exchange API
  - Unsplash API (Images)
- **Email**: SendGrid (future)
- **Analytics**: Google Analytics, Mixpanel (future)

### Testing & Quality
- **Unit Testing**: Jest + React Testing Library
- **E2E Testing**: Cypress / Playwright
- **Code Quality**: ESLint, Prettier
- **Type Safety**: TypeScript strict mode

---

## 8. Database Requirements

### 8.1 Database Schema

**Primary Tables**:
1. **User**: Authentication and profiles
2. **Trip**: Trip metadata and settings
3. **TripStop**: Cities/stops within trips
4. **Activity**: Activities within stops
5. **Expense**: Trip expenses
6. **Note**: Trip notes
7. **Account**: OAuth credentials (NextAuth)
8. **Session**: User sessions (NextAuth)
9. **VerificationToken**: Email verification (NextAuth)

### 8.2 Data Requirements

- **Storage Capacity**: 100GB initial, scaling to 1TB+ over 2 years
- **Backup Frequency**: Every 6 hours (automated)
- **Backup Retention**: 30 days
- **Replication**: Synchronous replication to read replica
- **Indexing**: On userId, tripId, shareToken for performance

### 8.3 Data Retention Policy

- User data: Retained until account deletion
- Deleted trips: 30-day soft delete, then permanent removal
- Session data: 30-day expiry, auto-cleanup
- Audit logs: 1-year retention (future)

---

## 9. API Specifications

### 9.1 API Design Principles

- RESTful architecture
- JSON request/response format
- Standard HTTP status codes
- JWT authentication via Bearer tokens
- Request/response validation with Zod
- Rate limiting: 100 requests/minute per user
- Pagination: limit + offset
- Error responses with detailed messages

### 9.2 API Endpoints Summary

| Method | Endpoint | Authentication | Purpose |
|--------|----------|-----------------|---------|
| POST | /api/auth/signup | None | Register user |
| POST | /api/auth/[...nextauth] | JWT | Login/Logout/Session |
| GET | /api/trips | JWT | List all trips |
| POST | /api/trips | JWT | Create trip |
| GET | /api/trips/[tripId] | JWT | Get trip details |
| PUT | /api/trips/[tripId] | JWT | Update trip |
| DELETE | /api/trips/[tripId] | JWT | Delete trip |
| POST | /api/trips/[tripId]/stops | JWT | Add stop |
| PUT | /api/trips/[tripId]/stops/[stopId] | JWT | Update stop |
| DELETE | /api/trips/[tripId]/stops/[stopId] | JWT | Delete stop |
| POST | /api/trips/[tripId]/stops/[stopId]/activities | JWT | Add activity |
| PUT | /api/stops/[stopId]/activities/[activityId] | JWT | Update activity |
| DELETE | /api/stops/[stopId]/activities/[activityId] | JWT | Delete activity |
| GET | /api/trips/[tripId]/expenses | JWT | List expenses |
| POST | /api/trips/[tripId]/expenses | JWT | Create expense |
| PUT | /api/trips/[tripId]/expenses/[expenseId] | JWT | Update expense |
| DELETE | /api/trips/[tripId]/expenses/[expenseId] | JWT | Delete expense |
| GET | /api/external/cities | None | Search cities (cached) |
| GET | /api/external/weather | None | Get weather (cached) |
| GET | /api/external/exchange | None | Get exchange rates (cached) |
| GET | /api/share/[shareToken] | None | View shared trip |

### 9.3 Error Handling

**Standard Error Response**:
```json
{
  "error": "Error message",
  "details": { "field": "Field error" },
  "timestamp": "2026-05-10T10:30:00Z"
}
```

**HTTP Status Codes**:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (auth required)
- 403: Forbidden (permission denied)
- 404: Not Found
- 409: Conflict (duplicate email, etc.)
- 429: Too Many Requests (rate limited)
- 500: Internal Server Error

---

## 10. Security Requirements

### 10.1 Authentication & Authorization

- JWT tokens with 30-day expiry
- Refresh token rotation (future)
- Session invalidation on logout
- Role-based access control (RBAC) for future admin panel
- OAuth2 with Google (optional login)

### 10.2 Data Security

- All data encrypted in transit (HTTPS/TLS 1.2+)
- Sensitive data encrypted at rest (future: database-level encryption)
- Password hashing: bcryptjs with 12 salt rounds
- No plain-text passwords in logs or responses
- PII (personally identifiable information) protection

### 10.3 API Security

- Rate limiting: 100 requests/minute per user
- Input validation with Zod schemas
- Output sanitization (React escaping)
- CORS policy: allow frontend domain only
- Security headers:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security

### 10.4 Compliance

- GDPR: User consent, data export, right to deletion
- CCPA: Privacy policy, opt-out mechanism
- COPPA: Age verification (future)
- SOC 2 compliance (future)

---

## 11. Performance Requirements

### 11.1 Load Testing Targets

- Concurrent Users: 100,000+
- Requests per Second: 10,000+ (RPS)
- Database Connections: Connection pooling (10-20 active)
- Cache Hit Rate: >80% for API caching

### 11.2 Optimization Strategies

- Database indexing on frequently queried fields
- Redis caching for API responses (1-24 hour TTL)
- CDN for static assets (images, fonts)
- Next.js image optimization
- Code splitting and lazy loading
- Database query optimization (N+1 prevention with Prisma includes)
- Pagination for large datasets (limit 50 results/page)

### 11.3 Monitoring & Metrics

- Page Load Time (real user monitoring)
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- API response times (p50, p95, p99)
- Error rates and exceptions
- Database query times
- Cache hit ratios

---

## 12. Deployment Requirements

### 12.1 Environment Configurations

**Development**:
- Local PostgreSQL
- Mock external APIs
- Debug logging enabled
- Relaxed CORS policy

**Staging**:
- AWS RDS PostgreSQL
- Real external APIs (rate-limited)
- Staging database (test data)
- Performance testing

**Production**:
- AWS RDS PostgreSQL (Multi-AZ)
- Real external APIs
- Production database
- Monitoring and alerting
- Error tracking (Sentry)

### 12.2 Deployment Strategy

- Blue-green deployment for zero downtime
- Canary releases (5% → 25% → 100%)
- Automated rollback on errors
- Health checks before activation
- Database migrations before app deployment

### 12.3 Infrastructure Provisioning

- Docker containerization
- Kubernetes orchestration (future scaling)
- Infrastructure as Code (Terraform)
- Auto-scaling based on CPU/memory
- Load balancing with health checks

### 12.4 Monitoring & Logging

- Application performance monitoring (APM)
- Centralized logging (ELK Stack)
- Error tracking (Sentry)
- Uptime monitoring (Uptime Robot)
- Alert thresholds for critical issues

---

## 13. Future Enhancements

### Phase 2 (Months 6-12)

- [ ] Email notifications and trip reminders
- [ ] Real-time collaboration (comments, mentions)
- [ ] Trip templates and guides
- [ ] Mobile apps (iOS/Android)
- [ ] Booking integrations (hotels, flights)
- [ ] AI-powered activity recommendations
- [ ] Photo gallery per trip/stop
- [ ] Advanced analytics dashboard

### Phase 3 (Year 2)

- [ ] Premium subscription tier
- [ ] Payment processing (Stripe)
- [ ] Trip expense splitting (group trips)
- [ ] Travel insurance integration
- [ ] Offline-first mobile sync
- [ ] Multi-language support
- [ ] Accessibility improvements (WCAG AAA)
- [ ] Partner program (travel agencies)

### Phase 4 (Year 3+)

- [ ] Marketplace for travel guides
- [ ] Social features (follow users, forums)
- [ ] Advanced budget forecasting (ML)
- [ ] Carbon footprint tracking
- [ ] Voice-activated planning
- [ ] VR destination previews

---

## Appendix

### A. Glossary

- **Trip**: A complete journey with multiple stops/cities
- **Stop**: A city or location within a trip
- **Activity**: A planned event or task at a stop
- **Expense**: A cost associated with the trip
- **ShareToken**: Unique identifier for sharing trips publicly
- **JWT**: JSON Web Token for authentication
- **GDPR**: General Data Protection Regulation
- **RTO**: Recovery Time Objective
- **RPO**: Recovery Point Objective

### B. Acronyms

- API: Application Programming Interface
- CRUD: Create, Read, Update, Delete
- JWT: JSON Web Token
- ORM: Object-Relational Mapping
- RDS: Relational Database Service
- SLA: Service Level Agreement
- TTFB: Time to First Byte
- WCAG: Web Content Accessibility Guidelines

### C. References

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OWASP Security Guidelines](https://owasp.org/)
- [GDPR Compliance Guide](https://gdpr-info.eu/)

---

**Document Approval**:
- Product Owner: ___________________ Date: _______
- Tech Lead: __________________ Date: _______
- QA Lead: __________________ Date: _______

---

*This SRS document is subject to change and will be updated quarterly or as required by project stakeholders.*
