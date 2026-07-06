import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Mock database
let users = [
  {
    id: "current-user",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Senior Full-Stack Engineer",
    company: "Quantum Labs",
    bio: "Passionate about building high-performance web applications and fluid animations. Looking to expand into smart-contract systems and LLM optimization.",
    offers: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
    wants: ["Rust", "Solidity", "Python", "Docker"],
    rating: 4.9,
    email: "alex.rivera@quantumlabs.io",
    github: "github.com/alexrivera",
    linkedin: "linkedin.com/in/alex-rivera",
    isCurrent: true
  },
  {
    id: "user-1",
    name: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    title: "Blockchain Architect",
    company: "EtherSphere",
    bio: "Developing EVM-compatible protocols and decentralised scaling solutions. Keen to learn elegant React UI engineering to build polished dApp frontends.",
    offers: ["Solidity", "Rust", "Web3.js", "Go"],
    wants: ["React", "TypeScript", "Framer Motion"],
    rating: 4.8,
    email: "elena@ethersphere.dev",
    github: "github.com/elena-eth",
    linkedin: "linkedin.com/in/elena-rostova"
  },
  {
    id: "user-2",
    name: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    title: "AI Research Scientist",
    company: "NeuralFlow",
    bio: "Specializing in training local LLMs and agentic prompting pipelines. I want to build highly interactive, responsive web frontends for AI tools.",
    offers: ["Python", "PyTorch", "FastAPI", "Docker"],
    wants: ["TypeScript", "Tailwind CSS", "Three.js"],
    rating: 5.0,
    email: "marcus@neuralflow.ai",
    github: "github.com/marcusvance",
    linkedin: "linkedin.com/in/marcus-vance"
  },
  {
    id: "user-3",
    name: "Siddharth Mehta",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    title: "DevOps Tech Lead",
    company: "CloudScale Inc.",
    bio: "Kubernetes, automated CI/CD pipelines, and multi-cloud provisioning. Wanting to learn backend Node.js and TypeScript API design with Express.",
    offers: ["Docker", "Kubernetes", "AWS", "Terraform"],
    wants: ["Node.js", "TypeScript", "Express"],
    rating: 4.7,
    email: "sid@cloudscale.io",
    github: "github.com/sid-cloud",
    linkedin: "linkedin.com/in/siddharthmehta"
  },
  {
    id: "user-4",
    name: "Aiko Tanaka",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    title: "UI/UX Creative Technologist",
    company: "Neon Canvas",
    bio: "Blending arts, design principles, and complex web animations. Eager to master system-level containerization for hosting heavy creative experiments.",
    offers: ["Framer Motion", "Tailwind CSS", "Three.js", "Figma"],
    wants: ["Docker", "AWS", "Python"],
    rating: 4.9,
    email: "aiko@neoncanvas.design",
    github: "github.com/aiko-tanaka",
    linkedin: "linkedin.com/in/aiko-tanaka-design"
  },
  {
    id: "user-5",
    name: "Devon Carter",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    title: "Systems Engineer",
    company: "RustForge",
    bio: "Building memory-safe embedded systems and low-latency network routers. I need to design beautiful modern admin dashboards to monitor hardware logs.",
    offers: ["Rust", "C++", "Docker", "Assembly"],
    wants: ["React", "TypeScript", "Tailwind CSS"],
    rating: 4.6,
    email: "devon@rustforge.org",
    github: "github.com/devonforge",
    linkedin: "linkedin.com/in/devoncarter"
  },
  {
    id: "user-6",
    name: "Sofia Giraldo",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    title: "Full-Stack Web Dev",
    company: "DevSprint",
    bio: "Crafting scalable Node.js servers and API systems. Wanting to learn Solidity and decentralised smart contracts to transition to Web3.",
    offers: ["Node.js", "TypeScript", "Express", "React"],
    wants: ["Solidity", "Rust", "Web3.js"],
    rating: 4.8,
    email: "sofia@devsprint.co",
    github: "github.com/sofia-giraldo",
    linkedin: "linkedin.com/in/sofia-giraldo"
  }
];

// Mock swap requests list
let swapRequests: { id: string; senderId: string; receiverId: string; status: 'pending' | 'accepted' | 'declined'; createdAt: string }[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoints
  // Get all users
  app.get('/api/users', (req, res) => {
    res.json(users);
  });

  // Get current user session
  app.get('/api/users/current', (req, res) => {
    const currentUser = users.find(u => u.isCurrent);
    res.json(currentUser || users[0]);
  });

  // Update current user profile
  app.put('/api/users/current', (req, res) => {
    const index = users.findIndex(u => u.isCurrent);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...req.body,
        id: "current-user", // Freeze ID
        isCurrent: true
      };
      res.json(users[index]);
    } else {
      res.status(404).json({ error: 'Current user session not found' });
    }
  });

  // Get smart matchmaking results for the current user
  app.get('/api/matches', (req, res) => {
    const currentUser = users.find(u => u.isCurrent) || users[0];
    
    const matches = users
      .filter(otherUser => otherUser.id !== currentUser.id)
      .map(otherUser => {
        // Calculate dynamic match vectors
        const matchedSkillsToReceive = otherUser.offers.filter(offer => 
          currentUser.wants.some(want => want.toLowerCase() === offer.toLowerCase())
        );

        const matchedSkillsToGive = currentUser.offers.filter(offer => 
          otherUser.wants.some(want => want.toLowerCase() === offer.toLowerCase())
        );

        let type: 'perfect' | 'give' | 'receive' = 'give';
        let score = 0;

        if (matchedSkillsToReceive.length > 0 && matchedSkillsToGive.length > 0) {
          type = 'perfect';
          score = Math.round(
            ( (matchedSkillsToReceive.length + matchedSkillsToGive.length) / 
              (currentUser.wants.length + otherUser.wants.length) ) * 100
          );
          // Boost perfect matches to stand out
          score = Math.min(100, score + 40);
        } else if (matchedSkillsToReceive.length > 0) {
          type = 'receive';
          score = Math.round((matchedSkillsToReceive.length / currentUser.wants.length) * 60);
        } else if (matchedSkillsToGive.length > 0) {
          type = 'give';
          score = Math.round((matchedSkillsToGive.length / otherUser.wants.length) * 60);
        }

        return {
          id: `${currentUser.id}-${otherUser.id}`,
          matchedWith: otherUser,
          type,
          matchedSkillsToReceive,
          matchedSkillsToGive,
          score: score > 0 ? score : 15 // baseline connection interest
        };
      })
      // Filter matches to those with some shared common interest/connection score
      .sort((a, b) => b.score - a.score);

    res.json(matches);
  });

  // Get sent/received swap requests
  app.get('/api/swaps', (req, res) => {
    const currentUser = users.find(u => u.isCurrent) || users[0];
    const userSwaps = swapRequests.map(r => {
      const sender = users.find(u => u.id === r.senderId);
      const receiver = users.find(u => u.id === r.receiverId);
      return {
        ...r,
        sender,
        receiver
      };
    }).filter(r => r.senderId === currentUser.id || r.receiverId === currentUser.id);
    res.json(userSwaps);
  });

  // Create a new swap request
  app.post('/api/swaps', (req, res) => {
    const { receiverId } = req.body;
    const currentUser = users.find(u => u.isCurrent) || users[0];

    if (!receiverId) {
      return res.status(400).json({ error: 'Receiver ID is required' });
    }

    // Prevent swapping with oneself
    if (receiverId === currentUser.id) {
      return res.status(400).json({ error: 'Cannot swap skills with yourself' });
    }

    // Check if swap already exists
    const existing = swapRequests.find(r => 
      (r.senderId === currentUser.id && r.receiverId === receiverId) ||
      (r.senderId === receiverId && r.receiverId === currentUser.id)
    );

    if (existing) {
      return res.json(existing);
    }

    const newRequest = {
      id: `swap-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      senderId: currentUser.id,
      receiverId,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    swapRequests.push(newRequest);
    res.status(201).json(newRequest);
  });

  // Respond to a swap request
  app.put('/api/swaps/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'declined'

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status response' });
    }

    const request = swapRequests.find(r => r.id === id);
    if (!request) {
      return res.status(404).json({ error: 'Swap request not found' });
    }

    request.status = status;
    res.json(request);
  });

  // Integration with frontend depending on environment
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    console.log('Running in Development mode with Vite Dev Server Middleware...');
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    console.log('Running in Production mode. Serving built front-end static files...');
    // Serve static files from the build output directory
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(`🚀 Back-end API & Front-end Server running at:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`===============================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal: Failed to start the server:', err);
});
