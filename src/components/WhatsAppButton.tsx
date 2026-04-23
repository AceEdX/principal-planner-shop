import { motion } from "framer-motion";

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/919373387800"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      style={{ backgroundColor: "#25D366" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="white"
        className="w-8 h-8"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.129 6.744 3.047 9.379L1.054 31.49l6.326-2.012A15.907 15.907 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.32 22.598c-.39 1.1-1.932 2.013-3.176 2.28-.852.18-1.965.324-5.71-1.227-4.8-1.986-7.89-6.848-8.13-7.166-.228-.318-1.924-2.56-1.924-4.884 0-2.324 1.218-3.466 1.65-3.94.39-.427.914-.598 1.207-.598.293 0 .585 0 .842.016.294.012.63.048.962.81.39.9 1.316 3.222 1.43 3.458.114.236.228.554.07.872-.15.318-.276.52-.514.798-.24.28-.502.624-.716.836-.24.24-.488.5-.21.982.28.482 1.242 2.048 2.668 3.318 1.834 1.632 3.38 2.138 3.86 2.374.48.236.76.198 1.038-.118.28-.318 1.194-1.39 1.512-1.868.318-.48.636-.396 1.074-.236.44.16 2.762 1.302 3.236 1.54.474.236.79.354.906.55.114.196.114 1.138-.276 2.238z" />
      </svg>
    </motion.a>
  );
};

export default WhatsAppButton;
