# Expense-Tracker

MERN & MEAN Expense Tracker Application

ExpenseFlow is a real-world full-stack expense management platform designed to demonstrate both MERN and MEAN stacks using a single shared backend and database.
The platform allows users to record, manage, and analyze personal and system-wide expenses through role-based dashboards for Users and Admins.

Purpose

This platform demonstrates:

Email/Password and Google OAuth authentication

Role-Based Access Control (RBAC) for Users and Admins

RESTful API architecture

MongoDB schema design for financial data

React vs Angular frontends consuming the same backend

Expense tracking, categorization, and reporting workflows

Data visualization and export (CSV/PDF)

Architecture

One backend, two frontends:
React App (MERN) & Angular App (MEAN) → REST API → Node.js + Express → MongoDB

This architecture highlights how multiple frontend technologies can interact seamlessly with a single backend service.

Roles

User: Manages personal expenses, views dashboards, generates reports

Admin: Manages users, views all expenses, generates system-wide reports

Database

MongoDB with Mongoose ODM, including collections such as:

Users

Expenses

Categories

Budgets (optional)

Authentication

JWT-based authentication

Google OAuth integration

Secure role-based route protection

Future Enhancements

AI-based expense analysis and spending insights

Budget alerts and notifications

Receipt OCR and automatic data extraction

Multi-currency support

Mobile application (React Native / Flutter)

Advanced analytics and recommendations
