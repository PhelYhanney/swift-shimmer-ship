import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

const pageVariants = {
  initial: {
    opacity: 1,
    y: 40,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 1,
    scale: 1,
  },
  exit: {
    opacity: 0.8,
    y: -10,
    scale: 1.01,
  },
};

export function PageTransition() {
  const router = useRouter();
  const pathname = router.state.location.pathname;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 36,
          opacity: { duration: 0.22 },
        }}
        className="will-change-transform"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
