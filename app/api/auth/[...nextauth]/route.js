// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import Coach from "@/models/Coach";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "ایمیل", type: "email" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const { email, password } = credentials;
        console.log("🔍 جستجوی کاربر با ایمیل:", email);

        // ===== جستجو در مدل User =====
        let user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user) {
          console.log("✅ کاربر در مدل User پیدا شد:", user.email);
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            throw new Error("ایمیل یا رمز عبور اشتباه است");
          }
          const role = user.role || "member";
          const isAdmin = role === "super_admin" || role === "admin";
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: role,
            userType: "user",
            isAdmin: isAdmin,
          };
        }

        // ===== جستجو در مدل Coach =====
        let coach = await Coach.findOne({
          email: email.toLowerCase().trim(),
          hasPanelAccess: true,
        }).select("+password");

        if (coach) {
          console.log("✅ مربی در مدل Coach پیدا شد:", coach.email);
          if (!coach.password) {
            throw new Error("ایمیل یا رمز عبور اشتباه است");
          }
          const isValid = await bcrypt.compare(password, coach.password);
          if (!isValid) {
            throw new Error("ایمیل یا رمز عبور اشتباه است");
          }
          return {
            id: coach._id.toString(),
            name: coach.name,
            email: coach.email,
            role: "coach",
            userType: "coach",
            isAdmin: false,
          };
        }

        throw new Error("ایمیل یا رمز عبور اشتباه است");
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "my-secret-key-123456",
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.userType = user.userType;
        token.isAdmin = user.isAdmin || false;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.userType = token.userType;
      session.user.isAdmin = token.isAdmin || false;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };