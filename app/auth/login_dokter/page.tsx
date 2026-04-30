"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // TODO: proses login (validasi, API call, dll)
    router.push("/dokter/dashboard");
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }

        .wrapper {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg { position: absolute; inset: 0; z-index: 0; }

        .overlay {
          position: absolute;
          inset: 0;
          backdrop-filter: blur(12px);
          background: rgba(255,255,255,0.35);
          z-index: 1;
        }

        .card {
          position: relative;
          z-index: 2;
          width: 340px;
          background: rgba(255,255,255,0.92);
          border-radius: 14px;
          padding: 26px 24px;
          box-shadow: 0 12px 35px rgba(0,0,0,0.15);
        }

        .logo { text-align: center; font-size: 18px; font-weight: 600; margin-bottom: 6px; }
        .subtitle { text-align: center; font-size: 12px; color: #777; margin-bottom: 18px; }

        .input-group { margin-bottom: 12px; }

        .label {
          font-size: 11px;
          color: #666;
          margin-bottom: 4px;
          display: block;
        }

        .input {
          width: 100%;
          padding: 10px;
          border-radius: 7px;
          border: 1px solid #ddd;
          font-size: 12.5px;
        }

        .input:focus { border-color: #2E7D32; }

        .row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          margin-bottom: 5px;
        }

        .row a { color: #2E7D32; text-decoration: none; }

        .btn {
          width: 100%;
          padding: 10px;
          border-radius: 7px;
          border: none;
          background: #2E7D32;
          color: white;
          font-size: 13px;
          font-weight: 600;
          margin-top: 10px;
          cursor: pointer;
        }

        .btn:hover { background: #1b5e20; }

        .bottom {
          text-align: center;
          font-size: 11.5px;
          margin-top: 14px;
        }

        .bottom a { color: #2E7D32; text-decoration: none; font-weight: 600; }
      `}</style>

      <div className="wrapper">
        <div className="bg">
          <Image src="/images/home1.png" alt="bg" fill style={{ objectFit: "cover" }} />
        </div>
        <div className="overlay" />

        <div className="card">
          <div className="logo">SIPEKA</div>
          <div className="subtitle">Sign in</div>

          <div className="input-group">
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="dokter@gmail.com" />
          </div>

          <div className="input-group">
            <div className="row">
              <label className="label">Password</label>
              <a href="#">Forgot password?</a>
            </div>
            <input type={showPassword ? "text" : "password"} className="input" placeholder="********" />
          </div>

          <button className="btn" onClick={handleLogin}>Login</button>

          <div className="bottom">
            Belum punya akun? <Link href="/auth/regis">Daftar</Link>
          </div>
        </div>
      </div>
    </>
  );
}