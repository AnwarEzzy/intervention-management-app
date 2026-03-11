# Intervention Management System

A complete web application for managing technical intervention requests with role-based authentication.

## 🚀 Features

### Authentication and Role Management
- **Secure authentication system** with NextAuth.js and JWT
- **User roles**: Admin, User (employee), Technician (Level 1, 2, 3)
- **Different interface** depending on the user's role

### Role-based Dashboard
- **Admin**: Request management, statistics, user management
- **User**: Request creation, request tracking
- **Technician**: Assigned interventions, status updates

### Intervention Management
- **Request creation** with title, description, priority, equipment
- **Full workflow**: Pending → In Progress → Completed
- **Automatic assignment** based on priority:
  - Normal/Low → Level 1 Technician
  - High → Level 2 Technician
  - Critical → Level 3 Technician

### Statistics and Reports
- **Resolution rate** and average resolution time
- **Intervention trends** by month
- **Technician performance**

## 🛠️ Technologies Used

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Icons**: Heroicons

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

## 🔧 Installation

1. **Clone the project**
```bash
git clone <repository-url>
cd intervention
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment configuration**
```bash
# Create the .env.local file
touch .env.local
```

Edit the `.env.local` file with your settings:
```env
# Database - Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/intervention_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# JWT
JWT_SECRET="your-jwt-secret-key-change-this-in-production"
```

4. **Database setup**
```bash
# Generate the Prisma client
npx prisma generate

# Create tables
npx prisma db push

# (Optional) View the database
npx prisma studio
```

5. **Start the application**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🗄️ Database Structure

### Main Tables

#### Users
- `id`: Unique identifier
- `nom`, `prenom`: Last and first name
- `email`: Unique email
- `telephone`: Phone number
- `role`: Role (ADMIN, USER, TECHNICIAN_N1, TECHNICIAN_N2, TECHNICIAN_N3)
- `specialite`: Specialty (for technicians)
- `statut`: Status (ACTIVE, INACTIVE)
- `motDePasse`: Hashed password
- `dateCreation`, `dateModification`: Timestamps

#### Interventions
- `id`: Unique identifier
- `titre`, `description`: Intervention details
- `priorite`: Priority (LOW, NORMAL, HIGH, CRITICAL)
- `equipement`: Related equipment
- `dateEcheance`: Due date
- `statut`: Status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- `employeId`: Reference to the requesting employee
- `technicienId`: Reference to the assigned technician
- `adminId`: Reference to the validating admin
- `dateCreation`, `dateCloture`: Timestamps

#### Statistics
- `mois`, `annee`: Period
- `interventionsParMois`: Number of interventions
- `tempsMoyenResolution`: Average resolution time
- `tauxResolution`: Resolution rate as a percentage

## 🔐 Roles and Permissions

### Admin
- Full access to all features
- User management
- Intervention validation and assignment
- Statistics consultation

### User (Employee)
- Create intervention requests
- View their own requests
- Track request status

### Technician (L1, L2, L3)
- View assigned interventions
- Update status (In Progress → Completed)
- View personal statistics

## 📱 User Interface

### Responsive Design
- Modern interface with Tailwind CSS
- Dynamic sidebar based on role
- Personalized dashboards
- Intuitive forms

### Navigation
- **Dashboard**: Overview based on role
- **Interventions**: Request management (Admin)
- **Users**: User management (Admin)
- **Statistics**: Reports and analytics (Admin)
- **Settings**: Personal configuration

## 🚀 Deployment

### Production Environment Variables
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
JWT_SECRET="your-production-jwt-secret"
```

### Production Build
```bash
npm run build
npm start
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Development
npm run build        # Production build
npm run start        # Production start
npm run lint         # Linting
```

### Folder Structure
```
src/
├── app/                    # Next.js 14 pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── interventions/     # Intervention management
│   ├── admin/             # Admin pages
│   ├── user/              # User pages
│   └── technician/        # Technician pages
├── components/            # React components
│   ├── layout/           # Layout and navigation
│   ├── dashboard/        # Dashboard components
│   └── providers/        # Providers (NextAuth)
├── lib/                  # Utilities
│   ├── auth.ts          # NextAuth configuration
│   └── prisma.ts        # Prisma client
└── types/               # TypeScript types
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🆘 Support

For any questions or issues:
1. Check the documentation
2. Review existing issues
3. Open a new issue with the problem details

---

**Note**: This application is designed for managing technical interventions in a professional environment. Make sure to properly configure security and permissions according to your specific needs.