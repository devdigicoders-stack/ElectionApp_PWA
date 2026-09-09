import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const otpInputRefs = [
    useRef(null), useRef(null), useRef(null), 
    useRef(null), useRef(null), useRef(null)
  ];

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(val);
  };

  const handleSendOtp = (e) => {
    e?.preventDefault();
    if (mobileNumber.length !== 10) {
      triggerToast('Please enter a valid 10-digit number');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      setTimer(30);
      setCanResend(false);
      triggerToast(`OTP successfully sent to +91 ${mobileNumber}`);
      setTimeout(() => otpInputRefs[0]?.current?.focus(), 150);
    }, 800);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance focus
    if (value && index < 5) {
      otpInputRefs[index + 1]?.current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e?.preventDefault();
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      triggerToast('Please enter 6-digit OTP');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      triggerToast('🎉 Login Successful!');
      setTimeout(() => navigate('/profile', { replace: true }), 1000);
    }, 700);
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    triggerToast(`New OTP sent to: +91 ${mobileNumber}`);
    otpInputRefs[0]?.current?.focus();
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-white overflow-hidden">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gray-900/90 text-white text-sm rounded-full shadow-xl animate-bounce flex items-center gap-2 whitespace-nowrap">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 flex flex-col px-6 pt-16 pb-6 overflow-y-auto">
        
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-6 shrink-0">
          <img src="/image copy 3.png" alt="BJP Logo" className="w-32 h-auto object-contain" />
        </div>

        {/* Welcome Text */}
        <div className="mb-8">
          <p className="text-[#334155] text-[0.9rem] font-semibold mb-1">Welcome to</p>
          <h1 className="text-[1.7rem] font-extrabold text-gray-900 tracking-tight">BJP JanSampark</h1>
        </div>

        {isVerified ? (
          <div className="w-full py-10 flex flex-col items-center gap-4 bg-orange-50 border border-orange-100 rounded-2xl p-6">
            <div className="w-16 h-16 rounded-full bg-[#f37920] text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800">Login Successful</p>
              <p className="text-sm text-gray-600 mt-1">+91 {mobileNumber}</p>
            </div>
            <button
              onClick={() => {
                setIsVerified(false);
                setIsOtpSent(false);
                setOtp(['', '', '', '', '', '']);
                setMobileNumber('');
              }}
              className="mt-4 text-sm font-semibold text-[#f37920] hover:underline"
            >
              Logout / Change Number
            </button>
          </div>
        ) : !isOtpSent ? (
          /* Phone Number Input Form */
          <form onSubmit={handleSendOtp} className="w-full flex flex-col flex-1">
            <div className="mb-6">
              <p className="text-sm font-medium text-[#64748b] mb-4">
                Enter your mobile number<br/>to continue
              </p>
              
              {/* Input Box */}
              <div className="flex items-center w-full h-14 px-4 border border-gray-200 rounded-xl bg-white shadow-sm focus-within:border-[#f37920] focus-within:ring-1 focus-within:ring-[#f37920] transition-all">
                {/* Flag and Code */}
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇮🇳</span>
                  <span className="text-sm font-bold text-gray-800">+91</span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Divider */}
                <div className="w-px h-6 bg-gray-200 mx-3"></div>
                
                {/* Number Input */}
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={mobileNumber}
                  onChange={handlePhoneChange}
                  className="w-full bg-transparent outline-none text-base font-semibold text-gray-800 placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#f37920] hover:bg-[#e25d14] text-white font-bold text-lg rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center disabled:opacity-75"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>

            {/* Bottom Footer Text */}
            <div className="mt-auto pt-8 pb-4 text-center">
              <p className="text-xs text-gray-400 font-medium">
                By continuing, you agree to our<br/>
                <span className="text-gray-600 font-bold">Terms & Privacy Policy</span>
              </p>
            </div>
          </form>
        ) : (
          /* OTP Verification Form */
          <form onSubmit={handleVerifyOtp} className="w-full flex flex-col flex-1">
            <div className="mb-6">
              <p className="text-sm font-medium text-[#64748b] mb-4">
                Enter the 6-digit OTP sent to<br/>
                <span className="font-bold text-gray-800">+91 {mobileNumber}</span>
                <button type="button" onClick={() => setIsOtpSent(false)} className="ml-2 text-[#f37920] hover:underline text-xs">Edit</button>
              </p>
              
              {/* 6 Digit OTP Inputs */}
              <div className="flex justify-between gap-2 mt-4">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpInputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-gray-800 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#f37920] focus:ring-1 focus:ring-[#f37920] transition-all shadow-sm"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#f37920] hover:bg-[#e25d14] text-white font-bold text-lg rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center disabled:opacity-75 mt-2"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* Resend Timer */}
            <div className="text-center mt-6">
              {canResend ? (
                <button type="button" onClick={handleResendOtp} className="text-[#f37920] font-bold text-sm hover:underline">
                  Resend OTP
                </button>
              ) : (
                <span className="text-sm text-gray-500 font-medium">Resend OTP in <strong className="text-gray-800">{timer}s</strong></span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
