const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'WebSocket server is running',
    timestamp: new Date().toISOString(),
    connectedClients: io.engine.clientsCount
  });
});

// API endpoint to get presentation state
app.get('/api/presentation', (req, res) => {
  res.json(presentationState);
});

const server = http.createServer(app);

// Enhanced Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Presentation state management
let presentationState = {
  currentSlide: 0,
  totalSlides: 5,
  slideContent: null,
  slides: [
    {
      id: 0,
      title: "Welcome to Our Presentation",
      content: "This is the first slide of our interactive presentation.",
      image: null
    },
    {
      id: 1,
      title: "About Our Project",
      content: "Here we discuss the main objectives and goals of our project.",
      image: null
    },
    {
      id: 2,
      title: "Key Features",
      content: "Real-time synchronization, interactive controls, and responsive design.",
      image: null
    },
    {
      id: 3,
      title: "Technical Implementation",
      content: "Built with React, Next.js, and Socket.IO for real-time communication.",
      image: null
    },
    {
      id: 4,
      title: "Thank You",
      content: "Questions and discussion time.",
      image: null
    }
  ]
};

// Update slide content helper
function updateCurrentSlideContent() {
  if (presentationState.slides[presentationState.currentSlide]) {
    presentationState.slideContent = presentationState.slides[presentationState.currentSlide];
  }
}

// Initialize slide content
updateCurrentSlideContent();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id} (Total: ${io.engine.clientsCount})`);

  // Send initial presentation state to new client
  socket.emit('presentation-initialized', {
    currentSlide: presentationState.currentSlide,
    totalSlides: presentationState.totalSlides,
    slideContent: presentationState.slideContent
  });

  // Handle request for presentation state
  socket.on('get-presentation-state', () => {
    console.log(`📊 Client ${socket.id} requested presentation state`);
    socket.emit('presentation-initialized', {
      currentSlide: presentationState.currentSlide,
      totalSlides: presentationState.totalSlides,
      slideContent: presentationState.slideContent
    });
  });

  // Handle going to specific slide
  socket.on('go-to-slide', (slideNumber) => {
    console.log(`🎯 Client ${socket.id} wants to go to slide ${slideNumber}`);
    
    if (slideNumber >= 0 && slideNumber < presentationState.totalSlides) {
      presentationState.currentSlide = slideNumber;
      updateCurrentSlideContent();
      
      // Broadcast to all clients
      io.emit('slide-changed', {
        currentSlide: presentationState.currentSlide,
        totalSlides: presentationState.totalSlides,
        slideContent: presentationState.slideContent
      });
      
      console.log(`📺 Slide changed to ${slideNumber}`);
    } else {
      console.log(`❌ Invalid slide number: ${slideNumber}`);
      socket.emit('error', { message: 'Invalid slide number' });
    }
  });

  // Handle next slide
  socket.on('next-slide', () => {
    console.log(`➡️ Client ${socket.id} wants next slide`);
    
    if (presentationState.currentSlide < presentationState.totalSlides - 1) {
      presentationState.currentSlide++;
      updateCurrentSlideContent();
      
      // Broadcast to all clients
      io.emit('slide-changed', {
        currentSlide: presentationState.currentSlide,
        totalSlides: presentationState.totalSlides,
        slideContent: presentationState.slideContent
      });
      
      console.log(`📺 Next slide: ${presentationState.currentSlide}`);
    } else {
      console.log(`❌ Already at last slide`);
    }
  });

  // Handle previous slide
  socket.on('prev-slide', () => {
    console.log(`⬅️ Client ${socket.id} wants previous slide`);
    
    if (presentationState.currentSlide > 0) {
      presentationState.currentSlide--;
      updateCurrentSlideContent();
      
      // Broadcast to all clients
      io.emit('slide-changed', {
        currentSlide: presentationState.currentSlide,
        totalSlides: presentationState.totalSlides,
        slideContent: presentationState.slideContent
      });
      
      console.log(`📺 Previous slide: ${presentationState.currentSlide}`);
    } else {
      console.log(`❌ Already at first slide`);
    }
  });

  // Handle slide content update
  socket.on('update-slide-content', (data) => {
    console.log(`✏️ Client ${socket.id} updating slide content:`, data);
    
    const { slideNumber, content } = data;
    
    if (slideNumber >= 0 && slideNumber < presentationState.totalSlides && presentationState.slides[slideNumber]) {
      // Update the slide content
      presentationState.slides[slideNumber] = {
        ...presentationState.slides[slideNumber],
        ...content
      };
      
      // If it's the current slide, update the current slide content
      if (slideNumber === presentationState.currentSlide) {
        updateCurrentSlideContent();
      }
      
      // Broadcast content update to all clients
      io.emit('slide-content-updated', presentationState.slides[slideNumber]);
      
      console.log(`📝 Slide ${slideNumber} content updated`);
    } else {
      console.log(`❌ Invalid slide update request`);
      socket.emit('error', { message: 'Invalid slide update request' });
    }
  });

  // Handle legacy slideChange event (for backward compatibility)
  socket.on('slideChange', (slideIndex) => {
    console.log(`🔄 Legacy slideChange event from ${socket.id}: ${slideIndex}`);
    
    if (slideIndex >= 0 && slideIndex < presentationState.totalSlides) {
      presentationState.currentSlide = slideIndex;
      updateCurrentSlideContent();
      
      // Broadcast to all clients (including sender for consistency)
      io.emit('slideChange', slideIndex);
      io.emit('slide-changed', {
        currentSlide: presentationState.currentSlide,
        totalSlides: presentationState.totalSlides,
        slideContent: presentationState.slideContent
      });
    }
  });

  // Handle custom events for presentation control
  socket.on('reset-presentation', () => {
    console.log(`🔄 Client ${socket.id} reset presentation`);
    presentationState.currentSlide = 0;
    updateCurrentSlideContent();
    
    io.emit('slide-changed', {
      currentSlide: presentationState.currentSlide,
      totalSlides: presentationState.totalSlides,
      slideContent: presentationState.slideContent
    });
  });

  // Handle presenter mode events
  socket.on('join-presenter', () => {
    console.log(`👨‍🏫 Client ${socket.id} joined as presenter`);
    socket.join('presenters');
    socket.emit('presenter-joined', { 
      message: 'You are now a presenter',
      currentState: presentationState 
    });
  });

  socket.on('join-audience', () => {
    console.log(`👥 Client ${socket.id} joined as audience`);
    socket.join('audience');
    socket.emit('audience-joined', { 
      message: 'You are now in audience mode',
      currentState: presentationState 
    });
  });

  // Handle disconnect
  socket.on('disconnect', (reason) => {
    console.log(`❌ Client disconnected: ${socket.id} (Reason: ${reason}) (Remaining: ${io.engine.clientsCount - 1})`);
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error(`🚨 Socket error from ${socket.id}:`, error);
  });
});

// Error handling for the server
server.on('error', (error) => {
  console.error('🚨 Server error:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server listening on port ${PORT}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}`);
  console.log(`🔗 Socket.IO endpoint: ws://localhost:${PORT}`);
  console.log(`📺 Initial presentation state:`, {
    currentSlide: presentationState.currentSlide,
    totalSlides: presentationState.totalSlides,
    slideTitle: presentationState.slideContent?.title
  });
});