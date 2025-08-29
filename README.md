<div align="center">

# 🌸 Serenity 🌸
### *Your Digital Sanctuary for Mental Wellness*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

*"In the chaos of modern life, find your serenity"*

[🌐 Live Demo](#) • [📖 Documentation](#documentation) • [🚀 Quick Start](#quick-start) • [💡 Features](#features)

</div>

---

## 🎯 **Vision**

Serenity is more than just a mental health platform—it's a compassionate digital companion that understands the complexities of mental wellness. Built with cutting-edge technology and designed with empathy, Serenity bridges the gap between technology and human connection.

> *"Mental health is not a destination, but a process. It's about how you drive, not where you're going."* 

---

## ✨ **Features That Care**

<table>
<tr>
<td width="33%">

### 🧠 **AI-Powered Therapy**
- 24/7 intelligent chatbot companion
- Personalized mental health insights
- Evidence-based therapeutic techniques
- Mood pattern recognition

</td>
<td width="33%">

### 📱 **Smart Wellness Tools**
- Interactive mood tracking
- Guided meditation sessions
- Breathing exercises
- Yoga asana recommendations

</td>
<td width="33%">

### 👥 **Professional Care**
- Video consultations with doctors
- Real-time appointment booking
- Comprehensive doctor profiles
- Secure healthcare communication

</td>
</tr>
<tr>
<td width="33%">

### 📝 **Digital Journaling**
- Emotion-rich diary interface
- Mood-based color coding
- Emoji integration
- Private & secure entries

</td>
<td width="33%">

### 🎵 **Therapeutic Content**
- Curated mental health videos
- Mood-based music recommendations
- Inspirational story collection
- Wellness e-book library

</td>
<td width="33%">

### 🎯 **Personalized Nutrition**
- Mental health-focused diet plans
- Nutrition assessment quiz
- Custom meal recommendations
- Lifestyle integration

</td>
</tr>
</table>

---

## 🛠️ **Tech Stack Excellence**

<div align="center">

| Frontend | Backend | Database | Tools |
|----------|---------|----------|-------|
| ⚛️ React 18.3+ | 🚀 Supabase | 🐘 PostgreSQL | 🎨 Figma |
| 📘 TypeScript | 🔐 Row Level Security | 📊 Real-time DB | 🧪 Vitest |
| 🎨 TailwindCSS | 🌐 Edge Functions | 💾 Storage Buckets | 📱 Responsive |
| 🎭 Shadcn/ui | 🔑 JWT Auth | 🔄 Real-time Subs | ⚡ Vite |
| 📊 Recharts | 📧 Email Auth | 🗃️ File Upload | 🎯 TypeScript |

</div>

---

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account

### 1️⃣ Clone & Install
```bash
git clone https://github.com/yourusername/serenity.git
cd serenity
npm install
```

### 2️⃣ Environment Setup
```bash
# Create .env.local file
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3️⃣ Database Setup
```sql
-- Run in Supabase SQL Editor
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Additional tables for doctors, appointments, journals...
-- See supabase-admin-setup.sql for complete schema
```

### 4️⃣ Launch
```bash
npm run dev
```
🎉 Open [localhost:5173](http://localhost:5173) and start your wellness journey!

---

## 📱 **App Architecture**

```
serenity/
├── 🎨 src/
│   ├── 📄 pages/           # Route components
│   │   ├── Index.tsx       # Landing page
│   │   ├── Profile.tsx     # User profile & nutrition
│   │   ├── Journal.tsx     # Digital diary
│   │   ├── Admin.tsx       # Admin dashboard
│   │   └── Appointments.tsx # Medical appointments
│   ├── 🧩 components/      # Reusable UI components
│   │   ├── ui/            # Shadcn components
│   │   ├── AITherapist.tsx # AI chat interface
│   │   ├── ConnectDoctor.tsx # Doctor booking
│   │   └── MoodTracker.tsx # Emotion tracking
│   ├── 🎣 hooks/          # Custom React hooks
│   ├── 🗃️ lib/            # Utilities & services
│   └── 🎭 context/        # React context providers
├── 🎨 public/             # Static assets
└── ⚙️ Configuration files
```

---

## 🎨 **Design Philosophy**

### 🌈 **Color Psychology**
- **Soft Blues**: Promote calmness and trust
- **Gentle Greens**: Encourage growth and harmony  
- **Warm Neutrals**: Create safe, welcoming spaces
- **Subtle Gradients**: Add depth without overwhelming

### 🎭 **User Experience**
- **Intuitive Navigation**: Clear, accessible interfaces
- **Emotional Design**: Colors that respond to user mood
- **Micro-interactions**: Delightful animations and feedback
- **Accessibility First**: WCAG 2.1 compliant design

---

## 🔐 **Security & Privacy**

<div align="center">

| Feature | Implementation |
|---------|----------------|
| 🔐 **Authentication** | Supabase Auth with JWT tokens |
| 🛡️ **Data Protection** | Row Level Security (RLS) policies |
| 🔒 **Encryption** | AES-256 encryption for sensitive data |
| 🚫 **Privacy** | GDPR compliant, minimal data collection |
| 🔍 **Audit Logs** | Complete activity tracking |

</div>

---

## 👥 **User Roles & Permissions**

### 🙋‍♀️ **Regular Users**
- Personal profile management
- Journal entries (private)
- AI therapy sessions
- Doctor appointments
- Wellness content access

### 👨‍⚕️ **Healthcare Providers**
- Patient consultation tools
- Appointment management
- Medical record access
- Video calling integration

### 🛠️ **Administrators**
- User management dashboard
- Content moderation
- Analytics & reporting
- System configuration
- Doctor profile management

---

## 📊 **Analytics Dashboard**

The admin panel provides comprehensive insights:

- 📈 **User Growth Metrics**
- 🧠 **Mental Health Trends**
- 💬 **AI Therapy Usage**
- 📅 **Appointment Statistics**
- 📝 **Journal Activity Patterns**

---

## 🤝 **Contributing**

We welcome contributions from developers, designers, mental health professionals, and advocates!

### 🌟 **Ways to Contribute**
1. **Code**: Bug fixes, new features, performance improvements
2. **Design**: UI/UX enhancements, accessibility improvements
3. **Content**: Mental health resources, wellness guides
4. **Testing**: QA testing, user experience feedback
5. **Documentation**: Tutorials, API docs, user guides

### 📋 **Contribution Process**
```bash
# 1. Fork the repository
# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Commit changes
git commit -m "✨ Add amazing feature"

# 4. Push to branch
git push origin feature/amazing-feature

# 5. Open Pull Request
```

---

## 🎯 **Roadmap**

### 🚧 **In Development**
- [ ] 🤖 Advanced AI mood prediction
- [ ] 🎮 Gamified wellness challenges
- [ ] 👥 Community support groups
- [ ] 📱 Mobile app (React Native)

### 🔮 **Future Vision**
- [ ] 🧠 EEG integration for stress monitoring
- [ ] 🌍 Multi-language support
- [ ] 🏥 Healthcare provider partnerships
- [ ] 📊 Advanced analytics & insights

---

## 🆘 **Mental Health Resources**

**🚨 Crisis Support:**
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **International Association for Suicide Prevention**: [iasp.info](https://iasp.info)

**📞 Additional Support:**
- **NAMI (National Alliance on Mental Illness)**: 1-800-950-NAMI
- **Mental Health America**: [mhanational.org](https://mhanational.org)

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

Special thanks to:
- 💙 **Mental health advocates** who inspired this project
- 🎨 **Open source community** for amazing tools and libraries
- 👨‍⚕️ **Healthcare professionals** who provided guidance
- 🧠 **Researchers** advancing digital mental health

---

<div align="center">

### 💝 **Built with Love for Mental Wellness**

*"Your mental health matters. You matter. This is your safe space."*

[![GitHub stars](https://img.shields.io/github/stars/yourusername/serenity?style=social)](https://github.com/yourusername/serenity)
[![Twitter Follow](https://img.shields.io/twitter/follow/serenityapp?style=social)](https://twitter.com/serenityapp)

**Made with ❤️ by the Serenity Team**

[🌐 Website](#) • [📧 Contact](mailto:codigomaestro07@gmail.com) • [🐦 Twitter](#) • [💼 LinkedIn](#)

</div>

---

*Remember: This application is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers.*

