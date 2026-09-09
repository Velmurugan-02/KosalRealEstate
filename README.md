# Kosal RealEstate CRM

A full-stack Real Estate CRM application designed to help sales teams manage leads, properties, follow-ups, and property bookings from a centralized dashboard.

## Overview

Kosal RealEstate CRM allows administrators and sales employees to manage the complete lead-to-booking workflow.

The application provides:

- Lead management
- Sales employee assignment
- Lead stage tracking
- Follow-up management
- Lead activity/notes
- Project, building, and unit management
- Property availability tracking
- Property booking
- Booking conflict prevention
- Role-based authentication
- Sales dashboard
- REST APIs
- Relational database management

---

## Features

### 1. Authentication & Authorization

- Secure login using JWT authentication
- Password encryption using BCrypt
- Role-based access control
- Admin and Sales Employee roles
- Protected backend APIs

### 2. Lead Management

Sales employees can manage leads throughout the sales process.

Lead stages:

- New
- Contacted
- Site Visit
- Interested
- Negotiation
- Booked
- Lost

Lead features:

- Create leads
- Edit leads
- View lead details
- Search leads
- Filter leads by stage
- Assign leads to sales employees
- Set follow-up dates
- Add notes and activities

### 3. Property Management

Properties are organized using a hierarchy:

```text
Project
   └── Building
          └── Unit
