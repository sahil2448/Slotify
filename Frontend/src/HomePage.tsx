import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Paper,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const leftItemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const rightItemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const floatingVariants = {
    floating: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '91vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Animated Background Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.1)',
          zIndex: 0
        }}
        variants={floatingVariants}
        animate="floating"
      />
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.08)',
          zIndex: 0
        }}
        variants={floatingVariants}
        animate="floating"
        transition={{ delay: 1 }}
      />

      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          px: isMobile ? 2 : 4
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? 4 : 8,
              minHeight: '80vh'
            }}
          >
            {/* Left Side - Hero Content */}
            <motion.div variants={leftItemVariants}>
              <Box 
                sx={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMobile ? 'center' : 'flex-start',
                  justifyContent: 'center',
                  textAlign: isMobile ? 'center' : 'left',
                  maxWidth: isMobile ? '100%' : '500px'
                }}
              >
                <Typography
                  variant={isMobile ? 'h3' : 'h2'}
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                    mb: 3,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                  }}
                >
                  Your Schedule,
                  <br />
                  Simplified
                </Typography>

                <Typography
                  variant={isMobile ? 'body1' : 'h6'}
                  sx={{
                    color: '#64748b',
                    mb: 4,
                    lineHeight: 1.6,
                    fontWeight: 400,
                    maxWidth: '450px'
                  }}
                >
                  Take control of your time with our intuitive scheduling app. 
                  Create recurring slots, manage exceptions, and stay organized effortlessly.
                </Typography>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ 
                    scale: 1.01,
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/schedule')}
                    startIcon={<ScheduleIcon />}
                    sx={{
                      bgcolor: '#3b82f6',
                      color: 'white',
                      px: isMobile ? 2 : 3,
                      py: isMobile ? 1 : 1.5,
                      fontSize: isMobile ? '1rem' : '1.1rem',
                      fontWeight: 600,
                      borderRadius: 1,
                      textTransform: 'none',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                      '&:hover': {
                        bgcolor: '#2563eb',
                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </motion.div>
              </Box>
            </motion.div>

            {/* Right Side - Feature Cards */}
            <motion.div variants={rightItemVariants}>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  maxWidth: '500px',
                  width: '100%'
                }}
              >
                {[
                  {
                    icon: <CalendarTodayIcon />,
                    title: 'Smart Scheduling',
                    description: 'Create recurring time slots with intelligent conflict detection'
                  },
                  {
                    icon: <ScheduleIcon />,
                    title: 'Exception Management', 
                    description: 'Easily modify or cancel specific dates without affecting the series'
                  },
                  {
                    icon: <TrendingUpIcon />,
                    title: 'Stay Organized',
                    description: 'Visual overview of your schedule with today highlights'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ 
                      x: 5,
                      transition: { duration: 0.2 }
                    }}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { 
                        delay: 0.5 + (index * 0.1),
                        duration: 0.5 
                      }
                    }}
                    style={{ width: '100%' }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(226, 232, 240, 0.5)',
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 3,
                        width: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#3b82f6',
                          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.1)',
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          bgcolor: '#dbeafe',
                          color: '#3b82f6',
                          flexShrink: 0
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            mb: 0.5,
                            fontSize: '1rem'
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            lineHeight: 1.4
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Homepage;
