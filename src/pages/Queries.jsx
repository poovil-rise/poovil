import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Queries = () => {
  const { setActiveSection } = useApp();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'What is the difference between a psychologist and a psychiatrist?',
      a: 'A psychologist helps people with emotional and mental issues through counseling and therapy. A psychiatrist is a medical doctor who can prescribe medicines to treat mental health conditions.'
    },
    {
      q: 'When to seek a psychologist and psychiatrist?',
      a: 'See a psychologist if you need support with stress, anxiety, depression, or personal challenges. See a psychiatrist if you think you might need medication for more severe mental health conditions like bipolar disorder, schizophrenia, or severe depression.'
    },
    {
      q: 'Do psychologists read minds?',
      a: 'This is a myth. No, psychologists don\'t read minds. They listen carefully, observe behavior, and use their training to understand your feelings and help you work through challenges.'
    },
    {
      q: 'How do online therapy sessions work?',
      a: 'Online therapy happens over video calls, chats, or phone calls based on the preference of the client. You schedule a session, connect with your therapist on a secure platform, and talk about your concerns just like in-person therapy.'
    },
    {
      q: 'Are the sessions kept confidential?',
      a: 'Yes, therapy sessions are highly confidential. Therapists won\'t share anything you say unless there\'s a risk of harm to you or someone else, which they are required to report — and the client is always informed before anything is shared.'
    },
    {
      q: 'Are therapy sessions lifelong?',
      a: 'No, therapy is not lifelong. Since every individual is unique and encounters different kinds of problems, the length of therapy depends on your needs. Some people attend a few sessions, while others might need more time to work through their challenges.'
    },
    {
      q: 'How do I know if my therapist is a good fit?',
      a: 'A good fit means you feel comfortable, understood, and supported. If you don\'t feel this way after a few sessions, it\'s okay to openly communicate how you feel about the therapy session or even try a different therapist.'
    },
    {
      q: 'Is every individual provided with the same techniques in a counseling session?',
      a: 'No, counseling is personalized. Therapists use different techniques based on your needs, challenges, and goals that will suit you the best.'
    },
    {
      q: 'Does therapy work?',
      a: 'Yes, therapy works for many people. It provides a safe space to understand more about yourself and your problems, learn coping skills, and make positive changes in your life.'
    },
    {
      q: 'Does going to therapy mean you are a madman?',
      a: 'Absolutely not! Going to therapy means you care about your well-being and want to improve your life. It\'s a sign of strength, not weakness. Remember — asking for help is completely okay.'
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="queriesSection" className="fade-in" style={{ paddingBottom: '48px' }}>
      <div className="queries-hero">
        <img id="footerLogoImg" src="/assets/image_2.png" alt="Poovil" />
        <div>
          <h2>Queries &amp; <em>Response</em></h2>
          <p className="hero-subtitle">Answers to the most common questions about counseling and therapy!!</p>
        </div>
      </div>

      <div className="faq-container">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div className="faq-item" key={index}>
              <button
                className={`faq-question ${isOpen ? 'open' : ''}`}
                onClick={() => handleToggle(index)}
              >
                <span>
                  <span className="faq-num">{index + 1}.</span>
                  {faq.q}
                </span>
                <span className="faq-chevron">▾</span>
              </button>
              <div
                className={`faq-answer ${isOpen ? 'open' : ''}`}
                style={{
                  maxHeight: isOpen ? '400px' : '0px',
                  display: 'block' // make sure it transitions correctly in React
                }}
              >
                <div className="faq-answer-inner">
                  <p>{faq.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="btn-book-appointment"
        style={{ display: 'block', margin: '0 auto' }}
        onClick={() => setActiveSection('consultants')}
      >
        Book an Appointment
      </button>
      <div className="queries-quote">"None of it is perfect but all of it is beautiful"</div>
    </div>
  );
};

export default Queries;
