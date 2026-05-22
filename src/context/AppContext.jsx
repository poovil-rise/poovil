import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbytlqN_rqeb2j_T2i_a0qT1eGiIgcor_HEAAY1sBLzuxPLZ0AIvBF6hoJsCMcTheF1HUw/exec";

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return { id: 'guest_' + Date.now(), name: 'Guest', email: '', age: '', role: 'user' };
  });

  const defaultBlogs = [
    {
      id: 'b1',
      title: 'Cultivating Inner Peace in a Restless World',
      specialty: 'Mindfulness & Anxiety',
      author: 'Harishmitha CB',
      date: 'May 15, 2026',
      icon: '🌿',
      content: "In today's fast-paced world, finding a moment of silence can feel almost impossible. Constant notifications, work deadlines, and social obligations keep our brains in a perpetual state of high alert. However, mindfulness isn't about emptying your mind; it's about becoming aware of the present moment without judgment.\n\nTo begin cultivating inner peace today, try these simple steps:\n\n1. **The 5-4-3-2-1 Grounding Method**: Name five things you can see, four you can touch, three you can hear, two you can smell, and one you can taste. This brings your focus entirely back to your physical body.\n2. **Sinusoidal Breathing**: Inhale deeply for four seconds, hold for four seconds, and exhale slowly for six seconds.\n3. **Mindful Transitions**: Spend the first five minutes of your lunch break away from all screens. Just focus on the textures and flavors of your food.\n\nRemember, your mind deserves gentle care. Healing doesn't happen overnight, but small, intentional pauses create the foundation for lasting mental resilience."
    },
    {
      id: 'b2',
      title: 'Understanding Cognitive Reframing: Changing Your Narrative',
      specialty: 'CBT & Thought Patterns',
      author: 'Koushika P',
      date: 'May 18, 2026',
      icon: '🧠',
      content: "Have you ever caught yourself thinking, \"I fail at everything I try\"? This is what psychologists call a cognitive distortion—an exaggerated, negative thought pattern that doesn't reflect reality. Cognitive Behavioral Therapy (CBT) teaches us that while we cannot always control external events, we can control how we interpret them.\n\nCognitive reframing is the process of identifying these negative patterns and actively challenging them.\n\nHow to Reframe Your Thoughts:\n- **Step 1: Catch it.** Notice when you make a sweeping generalization (e.g., \"I ruined that presentation, I am terrible at my job\").\n- **Step 2: Check it.** Ask yourself, what objective evidence supports this? What evidence contradicts it? Did you really fail at the entire presentation, or just one slide?\n- **Step 3: Change it.** Rephrase the thought in a balanced, realistic way: \"I made a mistake on one slide, but I received positive feedback on the rest of the presentation. I will practice more next time.\"\n\nBy reframing our thoughts, we reduce emotional distress and open up constructive pathways for problem-solving."
    },
    {
      id: 'b3',
      title: 'Setting Boundaries: The Ultimate Act of Self-Love',
      specialty: 'Relationships & Family',
      author: 'Subiksha Varsa E',
      date: 'May 20, 2026',
      icon: '❤️',
      content: "Many of us grow up believing that being \"good\" means saying yes to every request, helping everyone around us, and neglecting our own needs. However, saying yes to others when your body is screaming \"no\" only leads to resentment, fatigue, and burnout.\n\nBoundaries are not walls to keep people out; they are doors that govern who and what we let into our life. They protect your energy, emotional wellness, and self-respect.\n\nSimple ways to set healthy boundaries:\n1. **Use direct language**: \"I would love to help, but I do not have the bandwidth for this right now.\" You do not owe anyone a detailed excuse.\n2. **Protect your personal time**: Decide on a time in the evening where you turn off work notifications and stick to it.\n3. **Acknowledge the discomfort**: Setting boundaries can trigger guilt, especially if you are a people-pleaser. Understand that this guilt is a normal part of growth—it is the sound of your old habits adjusting to healthy new ones.\n\nBoundaries allow you to love others from a full cup rather than a place of exhaustion."
    }
  ];
  
  const [db, setDb] = useState(() => {
    const saved = localStorage.getItem('poovilDB');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          users: parsed.users || [
            { id: 'admin', email: 'admin@poovil.com', password: 'admin123', role: 'admin', name: 'Admin' },
            { id: 'u1', email: 'test@test.com', password: 'test123', role: 'user', name: 'Demo User', age: 28 }
          ],
          bookings: parsed.bookings || [],
          blogs: parsed.blogs || defaultBlogs
        };
      } catch (e) {
        console.error("Error parsing poovilDB:", e);
      }
    }
    return {
      users: [
        { id: 'admin', email: 'admin@poovil.com', password: 'admin123', role: 'admin', name: 'Admin' },
        { id: 'u1', email: 'test@test.com', password: 'test123', role: 'user', name: 'Demo User', age: 28 }
      ],
      bookings: [],
      blogs: defaultBlogs
    };
  });

  const [activeSection, setActiveSection] = useState('about');
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const [consultants] = useState([
    {
      id: 'c1',
      name: 'Harishmitha CB',
      specialty: 'Holistic Wellness & Emotional Health',
      bio: 'I believe every emotion deserves to be understood 🌿. A safe space for counseling, emotional support, and self-growth. Helping you understand your thoughts, feelings, and patterns with clarity and care.\n Feel • Heal • Grow 🌸\n\n English, Tamil, Telugu',
      exp: '2 years exp.',
      emoji: '👩‍⚕️',
      slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      photo: '/assets/image_9.jpeg'
    },
    {
      id: 'c2',
      name: 'Subiksha Varsa E',
      specialty: 'Relationships, Family & Problem-Solving',
      bio: 'Everyone deserves a space to feel heard without judgment. Why? Because we live in a world where we constantly expect and demand perfection, strength, and certainty often leaving little room for vulnerability, emotions, or honest conversations. This space is created to help you pause, reflect, heal, and reconnect with yourself in a safe and supportive environment.\n\n English, Tamil',
      exp: '2 years exp.',
      emoji: '👩‍⚕️',
      slots: ['10:00 AM', '11:00 AM', '12:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'],
      photo: '/assets/image_6.jpeg'
    },
    {
      id: 'c3',
      name: 'Koushika P',
      specialty: 'Stress Management & Skill Development',
      bio: 'As a psychologist, I have experience in individual counseling. I create a safe space where you can talk openly, make sense of what you’re feeling, and work toward real, positive change at your pace.\n\nEnglish, Tamil',
      exp: '2 years exp.',
      emoji: '👩‍⚕️',
      slots: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      photo: '/assets/image_7.jpeg'
    }
  ]);

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('poovilDB', JSON.stringify(db));
  }, [db]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const login = (email, password) => {
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveSection('admin');
    } else {
      setActiveSection('about');
    }
    showToast(`Welcome back, ${user.name}!`);
    return { success: true };
  };

  const adminLogin = (password) => {
    const admin = db.users.find(u => u.role === 'admin' && u.password === password);
    if (!admin) {
      return { success: false, error: 'Incorrect password. Try again.' };
    }
    setCurrentUser(admin);
    setActiveSection('admin');
    showToast('Admin Panel unlocked.');
    return { success: true };
  };

  const register = (name, email, age, password) => {
    if (db.users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = {
      id: 'u' + Date.now(),
      email,
      password,
      role: 'user',
      name,
      age: parseInt(age)
    };
    
    setDb(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
    showToast('Account created! Please sign in.');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser({ id: 'guest_' + Date.now(), name: 'Guest', email: '', age: '', role: 'user' });
    setSelectedConsultant(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setActiveSection('about');
    showToast('Signed out successfully.');
  };

  const sendAdminNotification = (booking) => {
    const payload = {
      bookingId: booking.id,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientAge: booking.clientAge,
      consultant: booking.consultantName,
      date: booking.date,
      time: booking.time,
      issue: booking.note,
      bookedAt: new Date(booking.bookedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };
    
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(() => console.log('Booking saved to Sheets + admin notified ✓'))
    .catch(err => console.warn('Notification failed:', err));
  };

  const addBooking = (name, email, age, note) => {
    if (!selectedConsultant || !selectedDate || !selectedSlot) {
      showToast('Missing booking specifications.');
      return false;
    }
    
    const newBooking = {
      id: 'b' + Date.now(),
      userId: currentUser.id,
      consultantId: selectedConsultant.id,
      consultantName: selectedConsultant.name,
      date: selectedDate,
      time: selectedSlot,
      clientName: name,
      clientEmail: email,
      clientAge: parseInt(age),
      note,
      status: 'pending',
      bookedAt: new Date().toISOString()
    };

    setDb(prev => ({
      ...prev,
      bookings: [...prev.bookings, newBooking]
    }));
    
    sendAdminNotification(newBooking);
    showToast('Booking confirmed! See you soon.');
    setSelectedSlot(null);
    return true;
  };

  const addBlogPost = (title, content, author, icon, specialty) => {
    const newPost = {
      id: 'blog_' + Date.now(),
      title,
      content,
      author: author || 'Admin',
      icon: icon || '📝',
      specialty: specialty || 'General',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setDb(prev => ({
      ...prev,
      blogs: [newPost, ...(prev.blogs || [])]
    }));
    showToast('Blog article published successfully!');
    return newPost;
  };

  const updateBlogPost = (id, updatedFields) => {
    setDb(prev => {
      const updatedBlogs = (prev.blogs || []).map(post => {
        if (post.id === id) {
          return { ...post, ...updatedFields };
        }
        return post;
      });
      return { ...prev, blogs: updatedBlogs };
    });
    showToast('Blog article updated successfully!');
    return true;
  };

  const deleteBlogPost = (id) => {
    setDb(prev => {
      const filteredBlogs = (prev.blogs || []).filter(post => post.id !== id);
      return { ...prev, blogs: filteredBlogs };
    });
    showToast('Blog article deleted.');
    return true;
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      db,
      activeSection,
      setActiveSection,
      selectedConsultant,
      setSelectedConsultant,
      selectedDate,
      setSelectedDate,
      selectedSlot,
      setSelectedSlot,
      toastMessage,
      showToast,
      consultants,
      login,
      adminLogin,
      register,
      logout,
      addBooking,
      setDb,
      APPS_SCRIPT_URL,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
