import React from 'react';
import HeroCanvas from '../components/HeroCanvas';
import { useApp } from '../context/AppContext';

const About = () => {
  const { setActiveSection } = useApp();

  return (
    <div id="aboutSection" className="fade-in">
      <div className="hero">
        <HeroCanvas />
        <div className="hero-content">
          <div className="hero-left">
            <h1>
              Your Mind Deserves
              <br />
              <em>Gentle Care</em>
            </h1>
            <p>
              Poovil offers compassionate, evidence-based psychological consultations — a safe space to grow, heal, and
              rediscover yourself.
            </p>
            <button className="btn-book-now" onClick={() => setActiveSection('consultants')}>
              Book a Consultation
            </button>
          </div>
        </div>
      </div>

      {/* WELCOME & INFO SECTION */}
      <div className="welcome-section">
        <h2>Welcome to Poovil,</h2>
        <div className="welcome-body">
          <p>
            The view you set for yourself has a profound effect on how you view the world. In a world of 8 billion people
            there are 8 billion perspectives, each of us navigates life with our own unique ideas, values, and goals. Just
            as every flower takes its time to bloom, so do we unfold in our own unique ways.
          </p>
          <p>
            Life is a series of choices, from the moment we wake up to the time we rest. Each decision we make carries
            its own consequences — some uplifting, others challenging. When we encounter obstacles, it's natural to feel
            overwhelmed or tempted to give up. However, facing these challenges is where true growth begins.
          </p>
          <p>
            We believe that the first step begins when we start looking for help. Let us help you to complete the journey
            you have started.
          </p>
        </div>
        <div className="quote-banner">
          <p>" Sometime you want to disappear but all you really want is to be found "</p>
        </div>
      </div>

      {/* WHAT IS COUNSELING SECTION */}
      <div className="counseling-section">
        <h3>What's Counseling?</h3>
        <div className="counseling-cards">
          <div className="counsel-card">
            <h4>What is Counseling?</h4>
            <p>
              Counseling is a process where a trained professional helps individuals explore their thoughts, feelings, and
              behaviors to improve overall well-being. It provides a confidential, safe, and non-judgmental space where
              clients can express themselves freely and work toward their goals.
            </p>
          </div>
          <div className="counsel-card">
            <h4>How does counseling work?</h4>
            <ul>
              <li>
                <strong>Sessions:</strong> Typically 45 minutes to 1 hour, varying based on individual needs and the
                therapist's approach.
              </li>
              <li>
                <strong>Process:</strong> Involves understanding challenges, exploring emotions, and using evidence-based
                techniques to support clients in making their own choices.
              </li>
              <li>
                <strong>First Session:</strong> Focused on understanding your background, concerns, and goals, while
                building rapport with the therapist.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="quote-banner-2">
        <p>"Remember you are not a finished product but a work in progress"</p>
      </div>

      <div className="about-sections">
        <div className="about-card">
          <div className="icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h3>Safe &amp; Confidential</h3>
          <p>
            Everything shared within our sessions stays private. Your trust is our highest commitment. We maintain strict
            ethical standards.
          </p>
        </div>
        <div className="about-card">
          <div className="icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          </div>
          <h3>Flexible Scheduling</h3>
          <p>
            Book sessions that fit your schedule. Morning, afternoon, or evening slots available Monday through Saturday.
          </p>
        </div>
        <div className="about-card">
          <div className="icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3>Expert Consultants</h3>
          <p>
            Our team of licensed psychologists specialise in anxiety, depression, trauma, relationships, and personal growth.
          </p>
        </div>
      </div>

      <div className="testimonial-section">
        <h2>What Our Clients Say</h2>
        <div className="sub">Real experiences from real people</div>
        <div className="testimonials-scroll-container">
          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p>"Ninga enaku nala tips kuduthinga na Attend pana varaikum and na bettera vum feel panen..."</p>
          </div>
          <div className="t-card">
            <div className="stars">★★★★</div>
            <p>"It felt so good to say what I was feeling inside me without a constant worry of being judged."</p>
          </div>
          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p>"Talking you feels very comforting and like talking to a long lost friend."</p>
          </div>
          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p>"The activities that you give me between the session are really nice.. naa nala enjoy panuna."</p>
          </div>
          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p>"I don't think you lacked anything, it was genuinely really comforting and good."</p>
          </div>
          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p>"Thankyou for helping me to know more about myself."</p>
          </div>
          <div className="t-card">
            <div className="stars">★★★★</div>
            <p>"Unga session helpfulla irunthuchu, feeling better."</p>
          </div>
          <div className="t-card">
            <div className="stars">★★★★</div>
            <p>"I really like your approach and I feel better after having the session."</p>
          </div>
          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p>"Enna purinju kitta vitham romba pudichirundhathu. Highly recommended for couples therapy."</p>
          </div>
          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p>"I feel more confident and grounded. Your guidance has completely changed my perspective on stress."</p>
          </div>
          <div className="t-card">
            <div className="stars">★★★★★</div>
            <p>"I don't feel pressured to attend the therapy session. Enaku varaku comfortable ah iruku."</p>
          </div>
          <div className="t-card">
            <div className="stars">★★★</div>
            <p>"I am able to follow the techniques and strategies."</p>
          </div>
          <div className="t-card">
            <div className="stars">★★★★</div>
            <p>"Thank you for being so flexible with the timings."</p>
          </div>
          <div className="t-card">
            <div className="stars">★★★★</div>
            <p>"It was great to access therapy from home."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
