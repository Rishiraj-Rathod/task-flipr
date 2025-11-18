import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { Projects, Clients, ContactSubmissions, NewsletterSubscribers } from '@/entities';
import { ArrowRight, Mail, Phone, MapPin, User } from 'lucide-react';

export default function HomePage() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [clients, setClients] = useState<Clients[]>([]);
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    city: ''
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    loadProjects();
    loadClients();
  }, []);

  const loadProjects = async () => {
    try {
      const { items } = await BaseCrudService.getAll<Projects>('projects');
      setProjects(items.slice(0, 6)); // Show first 6 projects
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadClients = async () => {
    try {
      const { items } = await BaseCrudService.getAll<Clients>('clients');
      setClients(items.slice(0, 6)); // Show first 6 clients
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);

    try {
      await BaseCrudService.create('contactsubmissions', {
        _id: crypto.randomUUID(),
        ...contactForm,
        submissionDate: new Date()
      });
      
      setContactForm({ fullName: '', email: '', mobileNumber: '', city: '' });
      alert('Thank you for your message! We will get back to you soon.');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    try {
      await BaseCrudService.create('newslettersubscribers', {
        _id: crypto.randomUUID(),
        email: newsletterEmail,
        subscriptionDate: new Date(),
        isActive: true,
        source: 'homepage'
      });
      
      setNewsletterEmail('');
      alert('Successfully subscribed to our newsletter!');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      alert('There was an error subscribing. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full bg-background border-b border-primary/10">
        <div className="max-w-[120rem] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-heading text-2xl font-bold text-primary">
            Portfolio Studio
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#projects" className="font-paragraph text-primary hover:opacity-70 transition-opacity">
              Our Projects
            </a>
            <a href="#clients" className="font-paragraph text-primary hover:opacity-70 transition-opacity">
              Happy Clients
            </a>
            <a href="#contact" className="font-paragraph text-primary hover:opacity-70 transition-opacity">
              Contact
            </a>
            <Link to="/admin" className="font-paragraph text-primary hover:opacity-70 transition-opacity">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - Inspired by the image layout */}
      <section className="w-full max-w-[120rem] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <h1 className="font-heading text-6xl lg:text-7xl font-bold text-primary leading-tight">
              Creative Excellence
            </h1>
            <p className="font-paragraph text-lg text-primary/80 max-w-lg leading-relaxed">
              Discover our portfolio of innovative projects and the satisfied clients who trust us to bring their visions to life through exceptional design and development.
            </p>
            <Button 
              className="bg-buttonbackground border border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-8 py-3"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Our Work
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Right side - Featured images */}
          <div className="grid grid-cols-2 gap-6">
            {projects.slice(0, 2).map((project, index) => (
              <div key={project._id} className={`${index === 0 ? 'mt-8' : ''}`}>
                <Image
                  src={project.projectImage || 'https://static.wixstatic.com/media/75f02d_fd7d145f2fb049d88782da837938a602~mv2.png?originWidth=256&originHeight=256'}
                  alt={project.projectName || 'Featured project'}
                  width={300}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Projects Section */}
      <section id="projects" className="w-full bg-secondary py-20">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl font-bold text-secondary-foreground mb-6">
              Our Projects
            </h2>
            <p className="font-paragraph text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
              Explore our diverse portfolio of creative projects that showcase innovation, quality, and attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project._id} className="bg-background border-none overflow-hidden group hover:transform hover:scale-105 transition-all duration-300">
                <div className="relative overflow-hidden">
                  <Image
                    src={project.projectImage || 'https://static.wixstatic.com/media/75f02d_a903ee3a787a443f83bcd27b3bfa8f48~mv2.png?originWidth=384&originHeight=192'}
                    alt={project.projectName || 'Project image'}
                    width={400}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                    {project.projectName}
                  </h3>
                  <p className="font-paragraph text-primary/70 mb-4 line-clamp-3">
                    {project.briefDescription}
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-buttonborder text-primary hover:bg-buttonbackground transition-colors"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Happy Clients Section */}
      <section id="clients" className="w-full bg-background py-20">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl font-bold text-primary mb-6">
              Happy Clients
            </h2>
            <p className="font-paragraph text-lg text-primary/80 max-w-2xl mx-auto">
              Meet the amazing clients who have trusted us with their projects and achieved remarkable success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clients.map((client) => (
              <Card key={client._id} className="bg-secondary border-none text-center p-8 group hover:transform hover:scale-105 transition-all duration-300">
                <div className="mb-6">
                  <Image
                    src={client.clientImage || 'https://static.wixstatic.com/media/75f02d_23f3b51b7dc64c3d9254323959339cbf~mv2.png?originWidth=128&originHeight=128'}
                    alt={client.clientName || 'Client photo'}
                    width={120}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-secondary-foreground/20"
                  />
                </div>
                <h3 className="font-heading text-xl font-semibold text-secondary-foreground mb-2">
                  {client.clientName}
                </h3>
                <p className="font-paragraph text-sm text-secondary-foreground/60 mb-3">
                  {client.clientDesignation} at {client.companyName}
                </p>
                <p className="font-paragraph text-secondary-foreground/80 text-sm leading-relaxed">
                  {client.clientDescription}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="w-full bg-secondary py-20">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Info */}
            <div>
              <h2 className="font-heading text-5xl font-bold text-secondary-foreground mb-6">
                Get In Touch
              </h2>
              <p className="font-paragraph text-lg text-secondary-foreground/80 mb-8">
                Ready to start your next project? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-secondary-foreground/60" />
                  <span className="font-paragraph text-secondary-foreground">hello@portfoliostudio.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-secondary-foreground/60" />
                  <span className="font-paragraph text-secondary-foreground">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-secondary-foreground/60" />
                  <span className="font-paragraph text-secondary-foreground">New York, NY</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-background border-none p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="font-paragraph text-sm font-medium text-primary mb-2 block">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={contactForm.fullName}
                    onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                    required
                    className="border-buttonborder focus:border-primary"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="font-paragraph text-sm font-medium text-primary mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="border-buttonborder focus:border-primary"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="font-paragraph text-sm font-medium text-primary mb-2 block">
                    Mobile Number
                  </label>
                  <Input
                    type="tel"
                    value={contactForm.mobileNumber}
                    onChange={(e) => setContactForm({ ...contactForm, mobileNumber: e.target.value })}
                    required
                    className="border-buttonborder focus:border-primary"
                    placeholder="Enter your mobile number"
                  />
                </div>

                <div>
                  <label className="font-paragraph text-sm font-medium text-primary mb-2 block">
                    City
                  </label>
                  <Input
                    type="text"
                    value={contactForm.city}
                    onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                    required
                    className="border-buttonborder focus:border-primary"
                    placeholder="Enter your city"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmittingContact}
                  className="w-full bg-buttonbackground border border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  {isSubmittingContact ? 'Submitting...' : 'Submit Message'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full bg-background py-20">
        <div className="max-w-[120rem] mx-auto px-6 text-center">
          <h2 className="font-heading text-4xl font-bold text-primary mb-6">
            Stay Updated
          </h2>
          <p className="font-paragraph text-lg text-primary/80 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest updates on our projects, insights, and creative inspiration.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <Input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 border-buttonborder focus:border-primary"
                placeholder="Enter your email"
              />
              <Button 
                type="submit" 
                disabled={isSubscribing}
                className="bg-buttonbackground border border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-secondary py-12">
        <div className="max-w-[120rem] mx-auto px-6 text-center">
          <div className="font-heading text-2xl font-bold text-secondary-foreground mb-4">
            Portfolio Studio
          </div>
          <p className="font-paragraph text-secondary-foreground/60 mb-6">
            Creating exceptional digital experiences through innovative design and development.
          </p>
          <div className="border-t border-secondary-foreground/20 pt-6">
            <p className="font-paragraph text-sm text-secondary-foreground/60">
              © 2024 Portfolio Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}