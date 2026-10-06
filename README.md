# ShareSphere 🌐

> **"Give what you can. Reach who needs it."**  
> A smart, transparent donation management and distribution platform that connects donors with vetted NGOs based on verifiable real-time requirements.

---

## ⚡ Algorithmic Intelligence (Zero AI / Zero ML Architecture)

ShareSphere is engineered strictly with **deterministic mathematical algorithms, spatial formulas, rule-based heuristics, and database integrity**. 

There are **ZERO** artificial intelligence or machine learning components:
- ❌ No OpenAI / ChatGPT / Gemini / Claude APIs
- ❌ No LLMs or neural networks
- ❌ No black-box machine learning predictions
- ❌ No fake AI terminology

All intelligence is mathematically transparent and fully explainable.

---

## 🌟 The Five Core Innovations

### 1. Weighted Multi-Criteria Smart Matching
Matches donations to NGO requirements using a deterministic 5-factor weighted scoring formula:

$$\text{Match Score} = 0.30 \times \text{Category} + 0.25 \times \text{Urgency} + 0.20 \times \text{Distance} + 0.15 \times \text{Quantity} + 0.10 \times \text{Trust}$$

- **Category Match (30%)**: Exact taxonomy match and semantic keyword overlap.
- **Urgency Priority (25%)**: Prioritizes `CRITICAL` (100) > `HIGH` (80) > `MEDIUM` (55) > `LOW` (30).
- **Spatial Distance (20%)**: Haversine distance scoring with mathematical decay over proximity.
- **Quantity Utilization (15%)**: Evaluates fulfillment proportion of remaining NGO need.
- **NGO Trust Rating (10%)**: Transparent verification score (0–100).
- **Deterministic Explanation**: Every match generates transparent "Why this match?" reasons.

### 2. Multi-NGO Smart Allocation Engine
When a donor contributes a bulk batch (e.g. 100 blankets), the allocation algorithm distributes it across multiple NGOs without surplus waste:
1. Sorts candidates by **Urgency Priority** $\rightarrow$ **Match Score** $\rightarrow$ **Proximity**.
2. Constrains allocation so it **never exceeds** available donation or remaining need.
3. Automatically computes unit allocations (e.g. 40 to NGO A, 30 to NGO B, 30 to NGO C) and generates clear programmatic rationales.

### 3. Haversine Spatial Location Routing
Calculates great-circle distances in kilometers directly on Earth coordinates $(lat_1, lon_1) \rightarrow (lat_2, lon_2)$ using the spherical Haversine formula:

$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)$$
$$d = 2 R \cdot \operatorname{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$

Allows donors and NGOs to filter radius boundaries (5 km, 10 km, 25 km, 50 km) without third-party mapping bloat.

### 4. QR Donation Custody Tracking
Every consignment receives a unique identifier (e.g. `DON-849201`) and a cryptographic QR code pointing to `/track/[donationId]`.
- Contains only safe tracking routes (no sensitive personal data).
- Enforces strict sequential lifecycle custody:  
  $$\text{DONATED} \longrightarrow \text{ACCEPTED} \longrightarrow \text{PICKUP\_SCHEDULED} \longrightarrow \text{COLLECTED} \longrightarrow \text{DELIVERED} \longrightarrow \text{DISTRIBUTED}$$
- Direct phase skipping (e.g., `DONATED` straight to `DISTRIBUTED`) is strictly rejected by the protocol.

### 5. Verifiable Proof of Community Impact
Closes the loop between donor and recipient:
- Recipient NGOs submit items received, items distributed, beneficiary families helped, impact story, and audit photographs.
- Dashboard statistics (total donations, items donated, items distributed, beneficiaries aided) are aggregated **live from MongoDB**.
- Donor dashboards report verified impact outcomes:  
  *"Your 100 blankets were distributed through 3 NGOs and helped 87 beneficiaries."*

---

## 🛡️ Rule-Based NGO Trust Score
- **Base Score**: 50
- **+5** per completed distribution lifecycle (`DISTRIBUTED`)
- **+10** per verified community impact report
- **+5** per accepted consignment batch
- Score dynamically bounded between `0 – 100`.

---

## 📁 Project Structure

```
ShareSphere/
├── app/
│   ├── api/
│   │   ├── allocation/route.ts        # Multi-NGO distribution engine
│   │   ├── auth/                      # Register, login, me, logout
│   │   ├── donations/                 # Donation CRUD, /status, /qr
│   │   ├── impact/                    # Proof of impact & verification
│   │   ├── matching/route.ts          # 5-factor weighted matching
│   │   ├── ngos/[id]/trust-score/     # Rule-based trust score API
│   │   ├── requirements/              # NGO requirement management
│   │   ├── seed/route.ts              # Tech Mela demo seeder
│   │   └── stats/route.ts             # Live MongoDB platform metrics
│   ├── admin/dashboard/page.tsx       # Admin audit & verification hub
│   ├── donation/[id]/page.tsx         # Donation redirect & details
│   ├── donor/dashboard/page.tsx       # Donor pledges, QR codes & impact
│   ├── explore/page.tsx               # Need discovery with filters
│   ├── donate/page.tsx                # Donation creator & smart matching
│   ├── impact/page.tsx                # Public verified impact audit
│   ├── login/page.tsx                 # Login with 1-click demo logins
│   ├── ngo/
│   │   ├── dashboard/page.tsx         # NGO consignments & trust score
│   │   ├── impact/page.tsx            # Impact submission console
│   │   └── requirements/page.tsx      # Requirement publisher
│   ├── register/page.tsx              # Role & coordinate registration
│   ├── track/[donationId]/page.tsx    # Public timeline & QR code tracking
│   ├── globals.css                    # Tailwind design system
│   ├── layout.tsx                     # Root layout with AuthProvider & Navbar
│   └── page.tsx                       # Landing page with workflow & 5 innovations
├── components/
│   ├── AuthContext.tsx                # Client session manager
│   ├── Footer.tsx                     # Social impact footer
│   ├── MatchScoreBadge.tsx            # Weighted match visualizer
│   ├── MultiNgoAllocationModal.tsx    # Multi-NGO distribution UI
│   ├── Navbar.tsx                     # Responsive navigation with demo button
│   └── StatusTimeline.tsx             # Sequential lifecycle custody component
├── lib/
│   ├── allocation.ts                  # Multi-NGO distribution logic
│   ├── auth.ts                        # Bcrypt & JWT verification
│   ├── distance.ts                    # Haversine distance formula
│   ├── matching.ts                    # 5-factor weighted scoring formula
│   ├── mongodb.ts                     # Cached Mongoose connection
│   └── trustScore.ts                  # Rule-based trust score calculator
├── models/
│   ├── Allocation.ts                  # Multi-NGO allocation schema
│   ├── Donation.ts                    # Donation schema & status logs
│   ├── ImpactRecord.ts                # Verified impact proof schema
│   ├── Requirement.ts                 # NGO requirements schema
│   └── User.ts                        # User schema with roles & coordinates
├── scripts/
│   ├── seed-data.ts                   # Tech Mela scenario database seeder
│   └── test-demo-scenario.ts          # Automated algorithmic test suite
├── types/
│   └── index.ts                       # Shared TypeScript types
├── .env.local.example                 # Environment variables template
├── tailwind.config.js                 # Brand theme configuration
└── tsconfig.json                      # TypeScript configuration
```

---

## 🛠️ Tech Stack & Dependencies

- **Frontend & Backend**: Next.js 14 (App Router), React 18, TypeScript
- **Database**: MongoDB & Mongoose
- **Styling**: Tailwind CSS, Lucide React Icons
- **Security**: Bcrypt.js, JSON Web Tokens (JWT)
- **Utilities**: QRCode, clsx, tailwind-merge, tsx

---

## 🚀 Setup & Run Locally

### 1. Prerequisites
- Node.js 18+ (Tested on Node.js 24)
- Running MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

### 2. Clone / Enter Directory
```bash
cd ShareSphere
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
Create `.env.local` from the template:
```bash
cp .env.local.example .env.local
```
Ensure your MongoDB URI is set:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/sharesphere
JWT_SECRET=sharesphere_super_secret_jwt_key_2026_algorithmic_platform
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Seed the Tech Mela Demo Data
```bash
npm run seed
```

### 6. Run the Algorithmic Test Suite
```bash
npx tsx scripts/test-demo-scenario.ts
```

### 7. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🎪 Step-by-Step Tech Mela Demo Instructions

### 1-Click Demo Accounts Pre-Configured:
- **Donor**: `donor@sharesphere.org` / `password123` (Location: Connaught Place, New Delhi)
- **NGO A**: `hope@ngo.org` / `password123` (Hope Foundation, Lajpat Nagar, 7.2 km away)
- **NGO B**: `care@ngo.org` / `password123` (Care India Relief, Rohini, 13.3 km away)
- **NGO C**: `seva@ngo.org` / `password123` (Seva Community Trust, Noida, 12.7 km away)
- **Admin**: `admin@sharesphere.org` / `password123`

*(You can also use the 1-Click Login buttons on the `/login` page).*

### Scenario Walkthrough:
1. **Initialize Requirements**:
   - Log in as **NGO A** (`hope@ngo.org`) or click "Seed Demo Data".
   - Notice requirement: **40 Blankets — CRITICAL**.
   - Notice **NGO B** requirement: **30 Blankets — HIGH**.
   - Notice **NGO C** requirement: **50 Blankets — MEDIUM**.
2. **Donor Creates Donation**:
   - Log in as **Donor** (`donor@sharesphere.org`).
   - Go to `/donate` and click **"Fill 100 Blankets (Tech Mela Scenario)"**.
   - Click **"Register Donation & Find Smart Matches"**.
3. **Smart Matching & Ranking**:
   - The platform calculates match scores via the weighted formula.
   - **NGO A** is ranked #1 with **97% match** (Exact category, Critical urgency, 7.2 km away, 90 trust score).
   - Dynamic explanation breakdown is rendered ("Why this match?").
4. **Run Multi-NGO Smart Allocation**:
   - Click **"Run Smart Multi-NGO Allocation"**.
   - The algorithm allocates:
     - **NGO A**: 40 units (100% of need fulfilled)
     - **NGO B**: 30 units (100% of need fulfilled)
     - **NGO C**: 30 units (Partial fulfillment constrained by available pool)
     - **Total Allocated**: 100 / 100 units (Remaining: 0).
   - Click **"Confirm & Commit Allocation"**.
5. **Lifecycle Tracking & QR Code**:
   - The donation is assigned a unique ID (`DON-XXXXXX`) and a QR code pointing to `/track/[donationId]`.
   - Authorized users advance the status step-by-step:
     `DONATED` $\rightarrow$ `ACCEPTED` $\rightarrow$ `PICKUP SCHEDULED` $\rightarrow$ `COLLECTED` $\rightarrow$ `DELIVERED` $\rightarrow$ `DISTRIBUTED`.
   - Illegal skipping is prevented.
6. **Submit & Verify Proof of Impact**:
   - Recipient NGO visits `/ngo/impact` and submits distribution proof: 40 blankets distributed to 35 beneficiaries with audit notes.
   - Admin approves on `/admin/dashboard`.
   - NGO Trust score increases by +10.
7. **View Donor Impact Outcome**:
   - Donor opens `/donor/dashboard` to see:
     *"Your 100 blankets were distributed through 3 NGOs and helped 87 beneficiaries."*
   - All statistics update live on `/` and `/impact`.

---

## ☁️ Vercel Deployment Instructions

1. Push this repository to GitHub or GitLab.
2. Go to [Vercel Dashboard](https://vercel.com/) and click **"Add New Project"**.
3. Select your repository.
4. In **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://<user>:<password>@cluster.mongodb.net/sharesphere?retryWrites=true&w=majority`)
   - `JWT_SECRET`: A secure random secret string
   - `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL (or leave blank to use request host)
5. Click **Deploy**.
6. Once deployed, run the seed endpoint once by visiting `/` and clicking **"Seed Demo Data"** in the navigation bar.

---

## 📄 License
MIT License. Built for real social-impact communities.
