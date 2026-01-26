import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin } from 'lucide-react'

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Discover Amazing Events
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Find and register for events that match your interests. 
            Connect with like-minded people and create memorable experiences.
          </p>
          <div className="space-x-4">
            <Link to="/events" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Browse Events
            </Link>
            <Link to="/register" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose EventHub?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make event discovery and registration simple, secure, and enjoyable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Discovery</h3>
            <p className="text-gray-600">
              Find events that match your interests with our intuitive search and filtering system.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Registration</h3>
            <p className="text-gray-600">
              Register for events with just a few clicks. Manage all your registrations in one place.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Local & Global</h3>
            <p className="text-gray-600">
              Discover events in your area or explore opportunities around the world.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of event enthusiasts who trust EventHub for their event discovery and registration needs.
        </p>
        <Link to="/events" className="btn btn-primary px-8 py-3 text-lg">
          Explore Events Now
        </Link>
      </section>
    </div>
  )
}

export default Home