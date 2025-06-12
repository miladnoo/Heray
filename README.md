# Heray Organization - Member Signup Platform

A secure Next.js application for the Heray Organization (انجمن هری) that allows people with connections to Herat, Afghanistan to join the community.

## Features

- ✅ **Secure Member Registration**: Form submissions stored securely in Supabase
- ✅ **Modern UI**: Built with Next.js 14, TypeScript, and Tailwind CSS
- ✅ **Security Headers**: CSP, XSS protection, and other security measures
- ✅ **Input Validation**: Client-side and server-side validation
- ✅ **Responsive Design**: Works on all devices
- ✅ **Bilingual Support**: Persian/Dari and English text
- ✅ **Rate Limiting**: Basic protection against spam
- ✅ **Row Level Security**: Database access controls

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Security**: Middleware, CSP headers, input validation

## Setup Instructions

### 1. Environment Variables

Rename `env.txt` to `.env.local` and ensure it contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wsfiedqpcjigljobagro.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses a `members` table with the following structure:

```sql
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  connection_to_herat TEXT,
  interests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## Security Features

1. **Row Level Security (RLS)**: Only allows public insertions, prevents unauthorized data access
2. **Input Validation**: Both client-side and server-side validation
3. **Security Headers**: CSP, XSS protection, frame options
4. **Rate Limiting**: Basic protection against spam submissions
5. **Environment Variables**: Sensitive data stored in environment variables

## API Endpoints

### POST /api/members

Register a new member.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "connection_to_herat": "born-herat",
  "interests": "Cultural events, Business networking"
}
```

**Response:**
```json
{
  "message": "Successfully registered!",
  "member_id": "uuid-here"
}
```

## Deployment

This app can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- Any Node.js hosting provider

Make sure to set environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For questions about the Heray Organization, please contact the administrators.

## License

This project is private and intended for use by the Heray Organization community.
