import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 1,
    y: -12,
    scale: 1.005,
  },
};

export function PageTransition() {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={mounted ? "initial" : false}
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 32,
          opacity: { duration: 0.2 },
        }}
        className="will-change-transform"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
