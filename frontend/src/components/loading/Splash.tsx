import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';

const Splash = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="h-screen flex items-center justify-center"
    >
      <DotLottieReact
        src="/loadingSplash.lottie"
        loop
        autoplay
        style={{ width: 200, height: 200 }}
      />
    </motion.div>
  );
};

export default Splash;