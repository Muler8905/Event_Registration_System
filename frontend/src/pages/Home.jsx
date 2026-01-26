import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin, Star, ArrowRight, CheckCircle, Zap, Shield, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { eventService } from '../services/api'
import EventCard from '../components/EventCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0
  })

  useEffect(() => {
    fetchFeaturedEvents()
    fetchStats()
  }, [])

  const fetchFeaturedEvents = async () => {
    try {
      const response = await eventService.getEvents({ limit: 3 })
      setFeaturedEvents(response.events)
    } catch (error) {
      console.error('Failed to fetch featured events:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    // Mock stats for demo - in real app, this would come from an API
    setStats({
      totalEvents: 150,
      totalUsers: 2500,
      totalRegistrations: 8900
    })
  }

  const features = [
    {
      icon: Calendar,
      title: 'Easy Discovery',
      description: 'Find events that match your interests with our intuitive search and filtering system.',
      color: 'primary'
    },
    {
      icon: Users,
      title: 'Instant Registration',
      description: 'Register for events with just a few clicks. Manage all your registrations in one place.',
      color: 'success'
    },
    {
      icon: MapPin,
      title: 'Local & Global',
      description: 'Discover events in your area or explore opportunities around the world.',
      color: 'secondary'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security and privacy measures.',
      color: 'warning'
    }
  ]

  const benefits = [
    'Professional networking opportunities',
    'Industry-leading speakers and experts',
    'Hands-on workshops and training',
    'Certificate of attendance',
    'Access to exclusive resources',
    'Community support and mentorship'
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-90"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <div className="relative text-center py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
                Discover Amazing
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Events
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white opacity-90 mb-8 leading-relaxed max-w-3xl mx-auto">
                Connect with industry leaders, expand your network, and accelerate your career through 
                world-class professional events and conferences.
              </p>
            </div>
            
            <div className="animate-bounce-in flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/events" className="btn btn-primary px-8 py-4 text-lg font-semibold shadow-2xl">
                <Calendar className="h-5 w-5 mr-2" />
                Browse Events
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link to="/register" className="btn glass-effect text-white border-2 border-white border-opacity-30 px-8 py-4 text-lg font-semibold hover:bg-white hover:text-gray-900">
                Get Started Free
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center animate-fade-in">
                <div className="text-3xl font-bold text-white">{stats.totalEvents.toLocaleString()}+</div>
                <div className="text-white opacity-75">Events Hosted</div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}+</div>
                <div className="text-white opacity-75">Active Users</div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-3xl font-bold text-white">{stats.totalRegistrations.toLocaleString()}+</div>
                <div className="text-white opacity-75">Registrations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white bg-opacity-5 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400 bg-opacity-20 rounded-full animate-bounce"></div>
      </section>

      {/* Featured Events */}
      {!loading && featuredEvents.length > 0 && (
        <section className="animate-fade-in">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              <span>Featured Events</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Don't Miss These Amazing Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked events that offer exceptional value and networking opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredEvents.map((event, index) => (
              <div key={event.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <EventCard event={event} featured={index === 0} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/events" className="btn btn-primary px-8 py-3 text-lg">
              View All Events
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </section>
      )}

      {loading && (
        <section className="py-16">
          <LoadingSpinner size="lg" />
          <p className="text-center mt-4 text-gray-600">Loading featured events...</p>
        </section>
      )}

      {/* Features Section */}
      <section className="animate-fade-in">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-success-100 text-success-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            <span>Why Choose EventHub</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Everything You Need for Professional Growth
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We make event discovery and registration simple, secure, and enjoyable for professionals worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="card text-center animate-slide-up hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-12 animate-fade-in">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Globe className="h-4 w-4" />
              <span>Professional Benefits</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
              Unlock Your Professional Potential
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of professionals who have accelerated their careers through our curated events and networking opportunities.
            </p>
            <Link to="/register" className="btn btn-primary px-8 py-3 text-lg">
              Start Your Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit} 
                className="flex items-center space-x-4 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-success-500" />
                </div>
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-3xl p-16 text-white animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-display font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            Join thousands of professionals who trust EventHub for their career development and networking needs. 
            Start discovering amazing events today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl">
              <Calendar className="h-5 w-5 mr-2" />
              Explore Events Now
            </Link>
            <Link to="/register" className="btn glass-effect border-2 border-white border-opacity-30 text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home