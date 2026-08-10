import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.AUTH_SECRET || "dev-secret-change-me";
const key = new TextEncoder().encode(secretKey);

export type AdminSession = {
  type: "admin";
  id: number;
  name: string;
  role: "SUPER_ADMIN" | "STAFF";
};

export type CustomerSession = {
  type: "customer";
  id: number;
  name: string;
};

type Session = AdminSession | CustomerSession;

async function sign(payload: Session): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(key);
}

async function verify(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

// ---- Admin session ----
export async function createAdminSession(admin: { id: number; fullName: string; role: string }) {
  const token = await sign({ type: "admin", id: admin.id, name: admin.fullName, role: admin.role as any });
  cookies().set("admin_session", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const token = cookies().get("admin_session")?.value;
  if (!token) return null;
  const session = await verify(token);
  return session?.type === "admin" ? session : null;
}

export function clearAdminSession() {
  cookies().delete("admin_session");
}

// ---- Customer session ----
export async function createCustomerSession(customer: { id: number; fullName: string }) {
  const token = await sign({ type: "customer", id: customer.id, name: customer.fullName });
  cookies().set("customer_session", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const token = cookies().get("customer_session")?.value;
  if (!token) return null;
  const session = await verify(token);
  return session?.type === "customer" ? session : null;
}

export function clearCustomerSession() {
  cookies().delete("customer_session");
}
