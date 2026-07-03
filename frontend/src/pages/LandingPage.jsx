import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookClick = () => {
    if (user) {
      navigate(user.role === 'customer' ? '/book' : '/admin');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">La Maison</h1>
          <p className="hero-tagline">
            An exquisite dining experience in the heart of the city
          </p>
          <div className="hero-actions">
            <button onClick={handleBookClick} className="btn-hero">
              Book a Table
            </button>
            {!user && (
              <div className="hero-auth-links">
                <Link to="/login" className="btn-hero-outline">Login</Link>
                <Link to="/register" className="btn-hero-outline">Register</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="section-content">
          <h2>Welcome to La Maison</h2>
          <p>
            At La Maison, we believe every meal should be a celebration.
            Our chefs craft seasonal menus using the finest locally sourced
            ingredients, paired with an exceptional wine list from around
            the world. Whether you are joining us for an intimate dinner,
            a family gathering, or a special occasion, we promise an
            unforgettable culinary journey.
          </p>
        </div>
      </section>

      <section className="features-section">
        <div className="section-content">
          <h2>Why Dine With Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">&#127858;</span>
              <h3>Authentic Cuisine</h3>
              <p>Time-honored recipes prepared with a modern twist by our award-winning chefs.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">&#127867;</span>
              <h3>Curated Wine List</h3>
              <p>Over 200 labels from prestigious vineyards across the globe.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">&#127912;</span>
              <h3>Elegant Ambiance</h3>
              <p>Intimate lighting, live piano, and a warm atmosphere for every occasion.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">&#128100;</span>
              <h3>Private Events</h3>
              <p>Host your celebrations in our private dining rooms for up to 40 guests.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hours-section">
        <div className="section-content">
          <h2>Hours &amp; Location</h2>
          <div className="hours-grid">
            <div className="hours-card">
              <h3>Opening Hours</h3>
              <div className="hours-list">
                <div className="hours-row">
                  <span className="hours-day">Monday - Thursday</span>
                  <span className="hours-time">5:00 PM - 10:00 PM</span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Friday - Saturday</span>
                  <span className="hours-time">5:00 PM - 11:00 PM</span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Sunday</span>
                  <span className="hours-time">10:00 AM - 9:00 PM</span>
                </div>
              </div>
            </div>
            <div className="hours-card">
              <h3>Contact</h3>
              <div className="hours-list">
                <div className="hours-row">
                  <span className="hours-day">Address</span>
                  <span className="hours-time">123 Gourmet Street, Foodville</span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Phone</span>
                  <span className="hours-time">(555) 123-4567</span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Email</span>
                  <span className="hours-time">reservations@lamaison.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-content">
          <h2>Ready for an unforgettable evening?</h2>
          <p>Reserve your table today and experience La Maison.</p>
          <button onClick={handleBookClick} className="btn-hero">
            Book a Table
          </button>
        </div>
      </section>
    </div>
  );
}
