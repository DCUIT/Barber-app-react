# The Cutting Edge Barber - Mobile App

Ứng dụng mobile React Native đặt lịch cắt tóc, tách riêng hoàn toàn từ [Barber-web](https://github.com/DCUIT/Barber-web).

## Tech Stack

- **React Native** + **Expo** (SDK 52)
- **TypeScript**
- **React Navigation** (Bottom Tabs + Native Stack)
- **Axios** - Gọi API
- **Zustand** - State management
- **NativeWind** (TailwindCSS cho React Native)
- **AsyncStorage** - Lưu token & session
- **Socket.io-client** - Real-time notifications

## Yêu cầu

- Node.js >= 18
- Expo CLI: `npm install -g expo-cli`
- Expo Go app trên điện thoại (hoặc emulator)

## Cài đặt & chạy

```bash
cd Barber-Mobile
npm install
npm start
```

Sau đó scan QR code bằng Expo Go, hoặc nhấn:
- `a` - Android emulator
- `i` - iOS simulator

## Build APK

```bash
npx expo build:android
# hoặc
npx eas build -p android --profile preview
```

## Cấu trúc project

```
Barber-Mobile/
├── App.tsx                          # Entry point
├── package.json                     # Dependencies (mobile only)
├── app.json                         # Expo config
├── tailwind.config.js               # NativeWind theme
├── babel.config.js
├── tsconfig.json
└── src/
    ├── api/                         # Axios services (7 files)
    ├── components/                  # UI + Business components (14 files)
    ├── screens/                     # Màn hình (15 files)
    │   ├── auth/                    # Login, Register
    │   ├── home/                    # Home (banner, services, barbers, reviews)
    │   ├── booking/                 # Booking 4-step + Confirm
    │   ├── profile/                 # Profile, History, Change password
    │   ├── barber/                  # Barber dashboard + management
    │   └── admin/                   # Admin CRUD screens
    ├── navigation/                  # React Navigation (3 files)
    ├── store/                       # Zustand stores (2 files)
    ├── hooks/                       # useSocket
    ├── utils/                       # format, storage, constants
    └── types/                       # TypeScript definitions
```

## API

Kết nối backend production: `https://barber-web-tkgd.onrender.com`

## Tài khoản test

| Vai trò | Username | Password |
|---------|----------|----------|
| Admin   | admin    | 123456   |
| User    | alex     | 123456   |
| User    | sam      | 123456   |

## Tính năng

### User
- Đăng ký / Đăng nhập (JWT)
- Xem dịch vụ, barber, đánh giá
- Đặt lịch 4 bước (service → barber → datetime → confirm)
- Lịch sử đặt lịch
- Chỉnh sửa profile, đổi mật khẩu

### Barber
- Dashboard hôm nay (Pending / Accepted / Completed)
- Accept / Complete / Cancel booking
- Quản lý lịch theo ngày

### Admin
- Dashboard thống kê
- CRUD Bookings, Services, Barbers, Users
- Phân quyền, block/unblock users

## Không phụ thuộc web

Project này hoàn toàn độc lập:
- ✅ Không React DOM, không HTML tags
- ✅ Không CSS files
- ✅ Không react-router-dom
- ✅ Chỉ dùng React Native components
- ✅ Chạy được với `npm install && npm start`
