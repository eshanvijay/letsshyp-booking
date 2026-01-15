# Let's Shyp - Booking Flow

A production-ready, end-to-end booking flow for Let's Shyp hyperlocal logistics platform. Built with React, TypeScript, and Tailwind CSS.

![Let's Shyp](https://img.shields.io/badge/Let's%20Shyp-Booking%20Flow-E53935?style=for-the-badge)

## 🚀 Live Demo

[View Live Demo](#) *(Deploy to Vercel/Netlify)*

## 📋 Features

### 5 Complete Booking Screens

1. **Pickup & Drop Details**
   - Google Maps integration with autocomplete
   - Real-time location visualization
   - Serviceable area validation
   - Optional delivery instructions

2. **Package/Vehicle Details**
   - Package size selection (Small, Medium, Large, Extra Large)
   - Weight input with live validation
   - Express vs Standard delivery selection
   - Fragile item handling option

3. **Pricing & Order Summary**
   - Dynamic fare breakdown (base + distance + weight + express)
   - GST calculation
   - Edit previous steps while retaining state
   - Price change notifications

4. **Checkout**
   - Sender & receiver contact details
   - Phone number validation (Indian format)
   - Secure booking with loading states
   - Error handling with retry mechanism

5. **Booking Confirmation**
   - Success animation with confetti
   - Unique booking reference (e.g., LS-XXXXXX)
   - Order summary recap
   - Clear next steps guidance

## ✅ Edge Cases Implemented

1. **Express vs Normal Delivery Clarity**
   - Clear visual distinction between delivery types
   - Price difference highlighted
   - Estimated delivery times shown

2. **Unserviceable Area Handling**
   - Address validation against serviceable areas
   - Clear error messaging with expansion note
   - Prevents booking for unsupported locations

3. **Price Change After Edits** *(Bonus)*
   - Dynamic price recalculation when editing
   - Visual notification when price updates

4. **Error & Retry State** *(Bonus)*
   - Simulated network failure handling
   - User-friendly retry mechanism
   - Data persistence during errors

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Maps:** Google Maps API with Places Autocomplete
- **State Management:** React Context + useReducer
- **Animations:** CSS Animations + Transitions

## 📦 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd letsshyp-booking

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

The Google Maps API key is included in the code for demo purposes. For production:

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## 🎨 Design Decisions

### Color Scheme
- **Primary:** #E53935 (Let's Shyp Red)
- **Secondary:** #4CAF50 (Success Green)
- **Accent:** #FF5722 (Express Orange)
- Following Let's Shyp's existing brand guidelines

### UX Assumptions

1. **Mobile-First Progressive Enhancement**: While desktop-first as required, the design is responsive
2. **Payment on Delivery**: No online payment integration needed (mocked)
3. **Indian Market Focus**: Phone validation for Indian numbers (+91)
4. **Serviceable Areas**: Limited to major cities (Mumbai, Delhi, Bangalore, etc.)

### State Management

Used React Context + useReducer pattern for:
- Predictable state updates
- Easy debugging
- Scalable architecture

## 📁 Project Structure

```
src/
├── components/
│   ├── steps/
│   │   ├── Step1PickupDrop.tsx
│   │   ├── Step2PackageDetails.tsx
│   │   ├── Step3PricingSummary.tsx
│   │   ├── Step4Checkout.tsx
│   │   └── Step5Confirmation.tsx
│   ├── AddressInput.tsx
│   ├── BookingFlow.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── StepIndicator.tsx
├── context/
│   └── BookingContext.tsx
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🔮 Future Improvements

1. **Real-time Tracking Integration** - WebSocket-based live tracking
2. **Multiple Package Support** - Book multiple deliveries at once
3. **Saved Addresses** - Quick selection from address book
4. **Push Notifications** - Real-time delivery updates
5. **Multi-language Support** - Hindi, Marathi, etc.

## ⚠️ Limitations

1. Google Maps API key is exposed (use environment variables in production)
2. No backend integration (all data is mocked)
3. Payment flow is simulated (no actual payment gateway)
4. Serviceable area list is hardcoded

## 🙏 Acknowledgments

- Design inspiration from [Let's Shyp](https://www.letsshyp.com/)
- Icons from Heroicons
- Font: Plus Jakarta Sans from Google Fonts

---

**Built with ❤️ for Let's Shyp Frontend Intern Assignment**
