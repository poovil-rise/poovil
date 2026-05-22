import React from 'react';
import { useApp } from '../context/AppContext';

const Services = () => {
  const { setActiveSection } = useApp();

  const servicesList = [
    {
      icon: '🧍',
      title: 'Individual Therapy',
      desc: 'Our one-on-one therapy sessions are tailored to help individuals overcome personal challenges such as anxiety, depression, stress, trauma, and more. Whether you\'re seeking guidance on personal growth or mental health, our psychologists are here to support your journey. We offer both in-person and online counseling, ensuring accessibility and flexibility for all.'
    },
    {
      icon: '👥',
      title: 'Group Therapy',
      desc: 'In group therapy, you will join others who share similar concerns, allowing for shared experiences and mutual support. It provides a sense of community, offering you the opportunity to learn from others while working on personal healing. Our group therapy sessions address issues such as addiction, stress management, and personal development.'
    },
    {
      icon: '❤️',
      title: 'Couple and Family Therapy',
      desc: 'Relationships can sometimes face challenges that need professional intervention. Our couples and family therapy sessions help partners and family members navigate conflict, improve communication, and foster stronger connections. We address relationship dynamics, parenting concerns, and other family issues in a supportive environment.'
    },
    {
      icon: '🧩',
      title: 'ABA Therapy',
      desc: 'For individuals with developmental disabilities, particularly those on the autism spectrum, we offer ABA (Applied Behavior Analysis) therapy. This evidence-based approach is designed to improve communication, social skills, and adaptive behaviors. We work with individuals and families to create customized treatment plans that promote long-term development.'
    },
    {
      icon: '🔄',
      title: 'Addiction & Rehabilitation Counseling',
      desc: 'Our addiction and rehabilitation services provide structured support for individuals struggling with substance use or behavioral addictions. We offer a safe, non-judgmental space to explore triggers, develop coping strategies, and work toward long-term recovery. Our comprehensive approach includes both individual and group support sessions.'
    },
    {
      icon: '🧭',
      title: 'Career Guidance Counseling',
      desc: 'Navigating career paths can be stressful, especially with changing job markets. Our career guidance services help you identify your strengths, set goals, and develop strategies to pursue fulfilling careers. Whether you\'re just starting out or seeking a career change, we provide personalized counseling and tools to help you succeed.'
    },
    {
      icon: '🌿',
      title: 'Stress Management',
      desc: 'Chronic stress can take a toll on your physical and mental health. Our stress management services focus on practical techniques such as mindfulness, relaxation exercises, and cognitive restructuring to help you regain control and balance in your life.'
    },
    {
      icon: '🤝',
      title: 'Team Building Services',
      desc: 'We offer customized team-building workshops for organizations looking to improve collaboration, communication, and productivity. These workshops are designed to foster a positive working environment, enhance interpersonal relationships, and boost team morale.'
    },
    {
      icon: '🎨',
      title: 'Art Therapy',
      desc: 'Through creative expression, art therapy provides an alternative way to explore and process emotions. Whether you\'re dealing with trauma, anxiety, or self-esteem issues, art therapy helps you channel your emotions and thoughts into a creative form, making it easier to understand and heal from them.'
    },
    {
      icon: '🧘',
      title: 'Mindfulness Therapy',
      desc: 'Our mindfulness-based therapy helps clients stay grounded in the present moment, reducing stress and promoting mental clarity. By practicing mindfulness, you can develop greater emotional resilience and learn how to manage negative thoughts and feelings more effectively.'
    },
    {
      icon: '🧠',
      title: 'Cognitive Behavioral Therapy (CBT)',
      desc: 'CBT is an evidence-based approach that focuses on identifying and changing negative thought patterns that influence behavior. Through structured sessions, you will learn to challenge distorted thoughts and develop healthier, more positive ways of thinking and behaving.'
    }
  ];

  return (
    <div id="servicesSection" className="fade-in" style={{ paddingBottom: '48px' }}>
      <div className="services-hero">
        <img id="footerLogoImg" src="/assets/image_2.png" alt="Poovil" />
        <div>
          <h2>Services <em>Provided</em></h2>
          <p className="hero-subtitle">Comprehensive therapy and counseling services tailored to your unique needs!!</p>
        </div>
      </div>

      <div className="services-intro">
        <h3>Therapy and Counseling Services</h3>
        <p>We offer a wide range of evidence-based services to support your mental health journey</p>
      </div>

      <div className="services-grid">
        {servicesList.map((svc, i) => (
          <div className="service-card" key={i}>
            <div className="svc-icon">{svc.icon}</div>
            <h4>{svc.title}</h4>
            <p>{svc.desc}</p>
          </div>
        ))}
      </div>

      <div className="services-cta">
        <p>Are you ready to take the first step toward a healthier mind?</p>
        <button className="btn-book-now" onClick={() => setActiveSection('consultants')}>
          Book an Appointment
        </button>
      </div>
    </div>
  );
};

export default Services;
