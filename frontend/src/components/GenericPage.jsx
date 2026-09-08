import React from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';

const GenericPage = ({ title, description, icon, children }) => {
  return (
    <Container className="generic-page-container">
      <motion.div 
        className="generic-page-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {icon && <div className="generic-page-icon">{icon}</div>}
        <h1 className="generic-page-title">{title}</h1>
        <p className="generic-page-desc">{description}</p>
        
        {children && (
          <div className="mt-5">
            {children}
          </div>
        )}
      </motion.div>
    </Container>
  );
};

export default GenericPage;
