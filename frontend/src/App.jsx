import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ShopConfigProvider } from './context/ShopConfigContext';
import { CartProvider } from './context/CartContext';

// Common Public Components
import TopBar from './components/common/TopBar';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import ScrollToTop from './components/common/ScrollToTop';

// 26 Core Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Compare from './pages/Compare';
import HowToUse from './pages/HowToUse';
import DosageGuide from './pages/DosageGuide';
import Quote from './pages/Quote';
import Distributorship from './pages/Distributorship';
import WhereToBuy from './pages/WhereToBuy';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Certifications from './pages/Certifications';
import Testimonials from './pages/Testimonials';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import ThankYou from './pages/ThankYou';
import Search from './pages/Search';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import PricingWarranty from './pages/PricingWarranty';
import DeliveryPolicy from './pages/DeliveryPolicy';
import NotFound from './pages/NotFound';

// E-Commerce Shopping Journey Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmed from './pages/OrderConfirmed';
import TrackOrder from './pages/TrackOrder';

// CMS Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminQuotesRetail from './pages/admin/AdminQuotesRetail';
import AdminQuotesBulk from './pages/admin/AdminQuotesBulk';
import AdminDistributors from './pages/admin/AdminDistributors';
import AdminDealers from './pages/admin/AdminDealers';
import AdminEvents from './pages/admin/AdminEvents';
import AdminGallery from './pages/admin/AdminGallery';
import AdminBlog from './pages/admin/AdminBlog';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminFAQ from './pages/admin/AdminFAQ';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminPages from './pages/admin/AdminPages';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';
import AdminThemes from './pages/admin/AdminThemes';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAccount from './pages/admin/AdminAccount';

// E-Commerce Admin Management Modules
import AdminBusinessMode from './pages/admin/AdminBusinessMode';
import AdminOrders from './pages/admin/AdminOrders';
import AdminAbandonedCarts from './pages/admin/AdminAbandonedCarts';
import AdminCRM from './pages/admin/AdminCRM';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Public Shell Layout
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider>
          <ShopConfigProvider>
            <CartProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  {/* Public Routes */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/how-to-use" element={<HowToUse />} />
                    <Route path="/dosage-guide" element={<DosageGuide />} />
                    <Route path="/quote" element={<Quote />} />
                    <Route path="/distributorship" element={<Distributorship />} />
                    <Route path="/where-to-buy" element={<WhereToBuy />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    <Route path="/certifications" element={<Certifications />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/thank-you" element={<ThankYou />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/pricing-warranty" element={<PricingWarranty />} />
                    <Route path="/delivery-policy" element={<DeliveryPolicy />} />

                    {/* E-Commerce Customer Journey */}
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmed/:orderNumber" element={<OrderConfirmed />} />
                    <Route path="/track-order" element={<TrackOrder />} />

                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Admin Login */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Admin CMS & E-Commerce Management */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />

                    {/* E-Commerce Operations */}
                    <Route path="business-mode" element={<AdminBusinessMode />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="abandoned-carts" element={<AdminAbandonedCarts />} />
                    <Route path="crm" element={<AdminCRM />} />
                    <Route path="analytics" element={<AdminAnalytics />} />

                    {/* Catalog & Content Operations */}
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="quotes/retail" element={<AdminQuotesRetail />} />
                    <Route path="quotes-retail" element={<AdminQuotesRetail />} />
                    <Route path="quotes/bulk" element={<AdminQuotesBulk />} />
                    <Route path="quotes-bulk" element={<AdminQuotesBulk />} />
                    <Route path="distributors" element={<AdminDistributors />} />
                    <Route path="dealers" element={<AdminDealers />} />
                    <Route path="events" element={<AdminEvents />} />
                    <Route path="gallery" element={<AdminGallery />} />
                    <Route path="blog" element={<AdminBlog />} />
                    <Route path="testimonials" element={<AdminTestimonials />} />
                    <Route path="faqs" element={<AdminFAQ />} />
                    <Route path="faq" element={<AdminFAQ />} />
                    <Route path="certificates" element={<AdminCertificates />} />
                    <Route path="pages" element={<AdminPages />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="themes" element={<AdminThemes />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="account" element={<AdminAccount />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </ShopConfigProvider>
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
