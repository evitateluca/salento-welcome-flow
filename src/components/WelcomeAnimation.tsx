import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  guestName: string;
}

export function WelcomeAnimation({ guestName }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("salento-welcome-seen");
    if (!seen) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("salento-welcome-seen", "1");
      }, 3600);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="welcome"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <motion.svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            {/* Sun */}
            <motion.circle
              cx="80" cy="80" r="26"
              fill="var(--sun)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "backOut" }}
            />
            {/* Sun rays */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * Math.PI * 2) / 8;
              const x1 = 80 + Math.cos(angle) * 36;
              const y1 = 80 + Math.sin(angle) * 36;
              const x2 = 80 + Math.cos(angle) * 52;
              const y2 = 80 + Math.sin(angle) * 52;
              return (
                <motion.line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="var(--sun)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
                />
              );
            })}
            {/* Olive branch */}
            <motion.path
              d="M 30 130 Q 70 110 120 120"
              stroke="var(--olive)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.0, duration: 1.0, ease: "easeInOut" }}
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.ellipse
                key={i}
                cx={45 + i * 18}
                cy={125 - (i % 2) * 8}
                rx="6"
                ry="3"
                fill="var(--olive)"
                transform={`rotate(${-30 + i * 12} ${45 + i * 18} ${125 - (i % 2) * 8})`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{ delay: 1.4 + i * 0.1, duration: 0.4 }}
              />
            ))}
          </motion.svg>

          <motion.p
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.7 }}
            className="mt-10 text-sm uppercase tracking-[0.3em] text-muted-foreground"
          >
            Salento Flow
          </motion.p>
          <motion.h1
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.8 }}
            className="mt-4 px-8 text-center text-4xl font-medium text-balance"
          >
            Benvenuto a Casa,<br />
            <span className="italic" style={{ color: "var(--olive)" }}>{guestName}</span>
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
